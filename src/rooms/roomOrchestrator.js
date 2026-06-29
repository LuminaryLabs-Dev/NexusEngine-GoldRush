const shardCapacity = 50;

export function createRoomOrchestrator() {
  function generate({ players }) {
    const safePlayers = clampPlayerCount(players);
    const shardCount = Math.ceil(safePlayers / shardCapacity);
    const shards = Array.from({ length: shardCount }, (_, index) => {
      const remaining = safePlayers - index * shardCapacity;
      return {
        id: `shard-${index + 1}`,
        capacity: shardCapacity,
        playerCount: Math.min(shardCapacity, remaining),
        state: index === 0 ? "primary" : "incremental",
        handoffTopic: `goldrush.match.handoff.${index + 1}`,
      };
    });

    return {
      lobby: {
        id: "lobby-main",
        playerCount: safePlayers,
        state: "ready-check",
      },
      shards,
      ledger: {
        id: "match-ledger",
        shardIds: shards.map((room) => room.id),
        writes: ["cashout", "combat-summary", "disconnect-lock", "final-score"],
      },
    };
  }

  return { generate };
}

function clampPlayerCount(players) {
  if (!Number.isFinite(players)) return 2;
  return Math.min(100, Math.max(2, Math.round(players)));
}
