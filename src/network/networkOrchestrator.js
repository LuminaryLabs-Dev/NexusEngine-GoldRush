const partitionCapacity = 50;
const minPlayers = 2;
const maxPlayers = 100;

export function createNetworkOrchestrator() {
  function generate({ players, phase = "lobby" } = {}) {
    const safePlayers = clampPlayerCount(players);
    const partitions = createPartitions(safePlayers);
    const lobby = {
      id: "lobby-main",
      playerCount: safePlayers,
      state: "ready-check",
      joinSurface: "external-browser-instances",
    };
    const ledger = {
      id: "match-ledger",
      partitionIds: partitions.map((partition) => partition.id),
      shardIds: partitions.map((partition) => partition.shardId),
      writes: ["cashout", "combat-summary", "disconnect-lock", "final-score"],
    };

    return {
      id: "goldrush-network-main",
      version: "0.1.0",
      status: "ready",
      phase,
      players: safePlayers,
      policy: {
        minPlayers,
        maxPlayers,
        partitionCapacity,
        playerJoinSurface: "external-browser-instances",
        playerJoinUiFocus: "deferred",
      },
      topology: {
        kind: "incremental-room-network",
        publicLabel: "network-ready",
        activePartitionCount: partitions.length,
        maxPartitionCount: Math.ceil(maxPlayers / partitionCapacity),
        resolvedAfterValidation: true,
      },
      lobby,
      partitions,
      ledger,
      rooms: toRoomSnapshot({ lobby, partitions, ledger }),
      debug: {
        internalShardPolicy: "50-player partitions",
        visibleInPrimaryHud: false,
      },
    };
  }

  function createSession({ players = minPlayers, phase = "lobby" } = {}) {
    return createIncrementalNetworkSession({ players, phase });
  }

  return { generate, createSession };
}

export function createIncrementalNetworkSession({ players = minPlayers, phase = "lobby" } = {}) {
  let nextEventId = 1;
  let nextPlayerIndex = 1;
  let currentPhase = phase;
  const roster = new Map();
  const retainedPartitionCount = { value: 1 };
  const events = [];

  function emit(type, payload = {}) {
    const event = {
      id: `network-event-${String(nextEventId).padStart(4, "0")}`,
      sequence: nextEventId,
      type,
      phase: currentPhase,
      payload,
    };
    nextEventId += 1;
    events.push(event);
    return event;
  }

  function ensurePartitionForCount(playerCount) {
    const needed = Math.max(1, Math.ceil(playerCount / partitionCapacity));
    if (needed > retainedPartitionCount.value) {
      for (let index = retainedPartitionCount.value + 1; index <= needed; index += 1) {
        emit("partition.created", {
          partitionId: `partition-${index}`,
          shardId: `shard-${index}`,
          capacity: partitionCapacity,
          reason: "player-capacity-threshold",
        });
      }
      retainedPartitionCount.value = needed;
    }
  }

  function joinPlayer({ playerId = null, source = "session-seed" } = {}) {
    if (roster.size >= maxPlayers) {
      return {
        accepted: false,
        reason: "network-full",
        playerId,
        snapshot: snapshot(),
      };
    }
    const id = playerId ?? `player-${String(nextPlayerIndex).padStart(3, "0")}`;
    nextPlayerIndex += 1;
    if (roster.has(id)) {
      return {
        accepted: false,
        reason: "duplicate-player",
        playerId: id,
        snapshot: snapshot(),
      };
    }
    ensurePartitionForCount(roster.size + 1);
    const partitionId = partitionIdForRosterIndex(roster.size);
    roster.set(id, {
      id,
      partitionId,
      state: "active",
      joinedSequence: nextEventId,
    });
    emit("player.joined", {
      playerId: id,
      partitionId,
      source,
      playerCount: roster.size,
    });
    return {
      accepted: true,
      playerId: id,
      partitionId,
      snapshot: snapshot(),
    };
  }

  function leavePlayer({ playerId, reason = "left-session" } = {}) {
    if (!roster.has(playerId)) {
      return {
        accepted: false,
        reason: "unknown-player",
        playerId,
        snapshot: snapshot(),
      };
    }
    const player = roster.get(playerId);
    roster.delete(playerId);
    emit("player.left", {
      playerId,
      partitionId: player.partitionId,
      reason,
      playerCount: roster.size,
    });
    rebalanceRoster(roster);
    return {
      accepted: true,
      playerId,
      snapshot: snapshot(),
    };
  }

  function handoff({ playerId, toPartitionId, reason = "loading-gate" } = {}) {
    const player = roster.get(playerId);
    const partitions = createPartitionsFromRoster(roster, retainedPartitionCount.value);
    const to = partitions.find((partition) => partition.id === toPartitionId);
    if (!player || !to) {
      return {
        accepted: false,
        reason: !player ? "unknown-player" : "unknown-partition",
        playerId,
        toPartitionId,
        snapshot: snapshot(),
      };
    }
    const fromPartitionId = player.partitionId;
    player.partitionId = toPartitionId;
    emit("player.handoff", {
      playerId,
      fromPartitionId,
      toPartitionId,
      reason,
      topic: to.handoffTopic,
    });
    return {
      accepted: true,
      playerId,
      fromPartitionId,
      toPartitionId,
      reason,
      topic: to.handoffTopic,
      snapshot: snapshot(),
    };
  }

  function advancePhase(nextPhase) {
    currentPhase = nextPhase;
    emit("phase.changed", { phase: nextPhase });
    return snapshot();
  }

  function snapshot() {
    const players = Math.max(minPlayers, roster.size);
    const partitions = createPartitionsFromRoster(roster, retainedPartitionCount.value);
    const lobby = {
      id: "lobby-main",
      playerCount: roster.size,
      state: currentPhase === "lobby" ? "ready-check" : "launched",
      joinSurface: "external-browser-instances",
    };
    const ledger = {
      id: "match-ledger",
      partitionIds: partitions.map((partition) => partition.id),
      shardIds: partitions.map((partition) => partition.shardId),
      writes: ["cashout", "combat-summary", "disconnect-lock", "final-score", "player-join", "player-leave", "room-handoff"],
      eventCount: events.length,
      highWaterPartitionCount: retainedPartitionCount.value,
      latestEvents: events.slice(-12),
    };

    return {
      id: "goldrush-network-main",
      version: "0.1.0",
      status: "ready",
      phase: currentPhase,
      players,
      activePlayers: roster.size,
      policy: {
        minPlayers,
        maxPlayers,
        partitionCapacity,
        playerJoinSurface: "external-browser-instances",
        playerJoinUiFocus: "deferred",
        partitionRetention: "retain-high-water-until-match-end",
      },
      topology: {
        kind: "incremental-room-network",
        publicLabel: "network-ready",
        activePartitionCount: partitions.filter((partition) => partition.playerCount > 0).length,
        retainedPartitionCount: retainedPartitionCount.value,
        maxPartitionCount: Math.ceil(maxPlayers / partitionCapacity),
        resolvedAfterValidation: true,
      },
      lobby,
      partitions,
      ledger,
      rooms: toRoomSnapshot({ lobby, partitions, ledger }),
      roster: [...roster.values()].map((player) => ({ ...player })),
      debug: {
        internalShardPolicy: "50-player partitions",
        visibleInPrimaryHud: false,
      },
    };
  }

  const seedPlayers = clampPlayerCount(players);
  for (let index = 0; index < seedPlayers; index += 1) {
    joinPlayer({ source: "session-seed" });
  }

  return {
    joinPlayer,
    leavePlayer,
    handoff,
    advancePhase,
    snapshot,
    validate() {
      return validateIncrementalSession(snapshot());
    },
  };
}

export function toRoomSnapshot({ lobby, partitions, ledger }) {
  const shards = partitions.map((partition) => ({
    id: partition.shardId,
    capacity: partition.capacity,
    playerCount: partition.playerCount,
    state: partition.state,
    handoffTopic: partition.handoffTopic,
    partitionId: partition.id,
  }));

  return {
    lobby: {
      id: lobby.id,
      playerCount: lobby.playerCount,
      state: lobby.state,
    },
    shards,
    ledger: {
      id: ledger.id,
      shardIds: shards.map((room) => room.id),
      writes: ledger.writes,
    },
  };
}

function createPartitions(players) {
  const partitionCount = Math.ceil(players / partitionCapacity);
  return Array.from({ length: partitionCount }, (_, index) => {
    const remaining = players - index * partitionCapacity;
    return {
      id: `partition-${index + 1}`,
      shardId: `shard-${index + 1}`,
      roomWindowId: index === 0 ? "room-window-west-basin" : "room-window-east-rail",
      capacity: partitionCapacity,
      playerCount: Math.min(partitionCapacity, remaining),
      state: index === 0 ? "primary" : "incremental",
      handoffTopic: `goldrush.match.handoff.${index + 1}`,
      visibility: "internal",
    };
  });
}

export function validateIncrementalSession(network) {
  const failures = [];
  if (network.policy.partitionCapacity !== partitionCapacity) failures.push("partition-capacity-changed");
  if (network.policy.partitionRetention !== "retain-high-water-until-match-end") failures.push("missing-high-water-retention");
  if (network.partitions.length < 1 || network.partitions.length > Math.ceil(maxPlayers / partitionCapacity)) failures.push("invalid-retained-partition-count");
  if (network.activePlayers > maxPlayers) failures.push("too-many-active-players");
  if (network.partitions.some((partition) => partition.playerCount > partition.capacity)) failures.push("partition-overflow");
  if (network.ledger.highWaterPartitionCount !== network.partitions.length) failures.push("ledger-high-water-mismatch");
  if (network.rooms.shards.length !== network.partitions.length) failures.push("rooms-do-not-match-retained-partitions");
  const rosterPartitionIds = new Set(network.roster.map((player) => player.partitionId));
  rosterPartitionIds.forEach((partitionId) => {
    if (!network.partitions.some((partition) => partition.id === partitionId)) failures.push(`unknown-roster-partition:${partitionId}`);
  });
  return { passed: failures.length === 0, failures };
}

function createPartitionsFromRoster(roster, partitionCount) {
  const counts = new Map();
  for (const player of roster.values()) {
    counts.set(player.partitionId, (counts.get(player.partitionId) ?? 0) + 1);
  }
  return Array.from({ length: partitionCount }, (_, index) => {
    const id = `partition-${index + 1}`;
    const playerCount = counts.get(id) ?? 0;
    return {
      id,
      shardId: `shard-${index + 1}`,
      roomWindowId: index === 0 ? "room-window-west-basin" : "room-window-east-rail",
      capacity: partitionCapacity,
      playerCount,
      state: index === 0 ? "primary" : playerCount > 0 ? "incremental" : "retained",
      handoffTopic: `goldrush.match.handoff.${index + 1}`,
      visibility: "internal",
    };
  });
}

function rebalanceRoster(roster) {
  // Roster compaction keeps active players in the earliest partitions while retained partitions keep their ids.
  // Explicit handoff calls may still move a player to a later retained partition after compaction.
  let index = 0;
  for (const player of roster.values()) {
    player.partitionId = partitionIdForRosterIndex(index);
    index += 1;
  }
}

function partitionIdForRosterIndex(index) {
  return `partition-${Math.floor(index / partitionCapacity) + 1}`;
}

function clampPlayerCount(players) {
  if (!Number.isFinite(players)) return minPlayers;
  return Math.min(maxPlayers, Math.max(minPlayers, Math.round(players)));
}
