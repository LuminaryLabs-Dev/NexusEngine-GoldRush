import Peer from "peerjs";

const peerPrefix = "goldrush-party";

export function createPeerPartyRoom({
  capacity = 4,
  onChange = () => {},
  onStartMatch = () => {},
} = {}) {
  const localId = createLocalId();
  const localLabel = "Prospector";
  const connections = new Map();
  let peer = null;
  let hostConnection = null;
  let roomCode = null;
  let role = "leader";
  let status = "local";
  let message = "Local leader can launch or create a party code.";
  let members = [createMember({ id: localId, label: localLabel, leader: true })];
  let boardingSync = createPeerPartyBoardingSync({ members, localId, roomCode });
  let lastBoardingReportKey = "";

  function snapshot() {
    return {
      capacity,
      localId,
      roomCode,
      role,
      status,
      message,
      members: members.map((member) => ({ ...member })),
      isLeader: role === "leader",
      boarding: snapshotPeerPartyBoardingSync(boardingSync),
    };
  }

  function notify() {
    onChange(snapshot());
  }

  function createRoom() {
    closePeer();
    roomCode = createRoomCode();
    role = "leader";
    status = "creating";
    message = "Creating PeerJS party room.";
    members = [createMember({ id: localId, label: localLabel, leader: true })];
    resetBoardingSync();
    notify();

    peer = new Peer(toPeerId(roomCode));
    peer.on("open", () => {
      status = "hosting";
      message = "Share this party code. Up to four players can join.";
      notify();
      broadcastSnapshot();
    });
    peer.on("connection", handleLeaderConnection);
    peer.on("error", (error) => {
      status = "local";
      message = `PeerJS room unavailable; local leader fallback active (${error.type ?? "error"}).`;
      notify();
    });
  }

  function joinRoom(nextCode) {
    const normalizedCode = normalizeRoomCode(nextCode);
    if (!normalizedCode) {
      message = "Enter a party code to join.";
      notify();
      return;
    }

    closePeer();
    roomCode = normalizedCode;
    role = "member";
    status = "joining";
    message = "Joining PeerJS party room.";
    members = [createMember({ id: localId, label: localLabel, leader: false })];
    resetBoardingSync();
    notify();

    peer = new Peer();
    peer.on("open", () => {
      hostConnection = peer.connect(toPeerId(roomCode), { reliable: true });
      bindMemberConnection(hostConnection);
    });
    peer.on("error", (error) => {
      status = "join-failed";
      message = `Could not join party (${error.type ?? "error"}).`;
      notify();
    });
  }

  function startMatch(payload = {}) {
    if (role !== "leader") {
      message = "Only the party leader can launch the mass match.";
      notify();
      return false;
    }

    const startPayload = {
      type: "start-match",
      players: payload.players,
      groupType: payload.groupType,
      legacyModeId: payload.legacyModeId,
      roomCode,
      launchId: `goldrush-launch-${Date.now()}`,
      partyLeaderId: members.find((member) => member.role === "Leader")?.id ?? localId,
      partyMembers: members.map((member) => ({ ...member })),
      launchedAt: Date.now(),
    };
    resetBoardingSync({ launchId: startPayload.launchId });
    broadcast(startPayload);
    onStartMatch(startPayload);
    notify();
    return true;
  }

  function reportBoardingStatus({ phase = "unknown", boardingStatus = null } = {}) {
    const report = createPeerPartyBoardingReport({
      memberId: localId,
      phase,
      boardingStatus,
      now: Date.now(),
    });
    const reportKey = JSON.stringify({
      phase: report.phase,
      status: report.status,
      localBoarded: report.localBoarded,
      boardedCount: report.boardedCount,
      expectedCount: report.expectedCount,
    });
    if (reportKey === lastBoardingReportKey) return snapshot();
    lastBoardingReportKey = reportKey;
    boardingSync = applyPeerPartyBoardingReport(boardingSync, report);
    if (role === "leader") {
      broadcastBoardingState();
    } else if (hostConnection?.open) {
      hostConnection.send({ type: "boarding-status", report });
    }
    notify();
    return snapshot();
  }

  function handleLeaderConnection(connection) {
    if (members.length >= capacity) {
      connection.on("open", () => {
        connection.send({ type: "reject", reason: "party-full" });
        window.setTimeout(() => connection.close(), 80);
      });
      return;
    }

    connection.on("data", (data) => {
      if (data?.type === "boarding-status") {
        boardingSync = applyPeerPartyBoardingReport(boardingSync, data.report);
        broadcastBoardingState();
        notify();
        return;
      }
      if (data?.type === "leave") {
        removeConnection(connection.peer, data.reason ?? "member-left-party");
        broadcastSnapshot();
        return;
      }
      if (data?.type !== "join") return;
      if (members.length >= capacity) {
        connection.send({ type: "reject", reason: "party-full" });
        connection.close();
        return;
      }

      const member = createMember({
        id: data.memberId || connection.peer,
        label: data.label || `Prospector ${members.length + 1}`,
        leader: false,
      });
      connections.set(connection.peer, { connection, memberId: member.id });
      members = [...members.filter((item) => item.id !== member.id), member];
      resetBoardingSync();
      message = `${member.label} joined the party.`;
      bindLeaderConnectionClose(connection);
      broadcastSnapshot();
    });

    connection.on("error", () => {
      removeConnection(connection.peer);
    });
  }

  function bindLeaderConnectionClose(connection) {
    connection.on("close", () => {
      removeConnection(connection.peer);
      broadcastSnapshot();
    });
  }

  function bindMemberConnection(connection) {
    connection.on("open", () => {
      status = "joined";
      message = "Joined party. Waiting for the leader to launch.";
      connection.send({ type: "join", memberId: localId, label: localLabel });
      notify();
    });
    connection.on("data", (data) => {
      if (data?.type === "party-snapshot") {
        members = data.members ?? members;
        roomCode = data.roomCode ?? roomCode;
        boardingSync = hydratePeerPartyBoardingSync(data.boarding, { members, localId, roomCode });
        status = "joined";
        message = "Joined party. Waiting for the leader to launch.";
        notify();
      }
      if (data?.type === "reject") {
        status = "join-failed";
        message = data.reason === "party-full" ? "Party is full." : "Join rejected.";
        notify();
      }
      if (data?.type === "start-match") {
        members = data.partyMembers ?? members;
        resetBoardingSync({ launchId: data.launchId });
        onStartMatch(data);
      }
      if (data?.type === "boarding-state") {
        boardingSync = hydratePeerPartyBoardingSync(data.boarding, { members, localId, roomCode });
        notify();
      }
    });
    connection.on("close", () => {
      status = "disconnected";
      message = "Party connection closed.";
      notify();
    });
    connection.on("error", () => {
      status = "join-failed";
      message = "Party connection failed.";
      notify();
    });
  }

  function broadcastSnapshot() {
    notify();
    broadcast({
      type: "party-snapshot",
      capacity,
      roomCode,
      leaderId: localId,
      members,
      boarding: snapshotPeerPartyBoardingSync(boardingSync),
    });
  }

  function broadcastBoardingState() {
    broadcast({
      type: "boarding-state",
      boarding: snapshotPeerPartyBoardingSync(boardingSync),
    });
  }

  function broadcast(payload) {
    connections.forEach(({ connection }) => {
      if (connection.open) connection.send(payload);
    });
  }

  function removeConnection(peerId, reason = "peer-connection-closed") {
    const record = connections.get(peerId);
    if (!record) return;
    connections.delete(peerId);
    members = members.filter((member) => member.id !== record.memberId);
    boardingSync = removePeerPartyBoardingMember(boardingSync, {
      memberId: record.memberId,
      reason,
      now: Date.now(),
    });
    lastBoardingReportKey = "";
    message = "A party member disconnected.";
    notify();
  }

  function resetBoardingSync({ launchId = boardingSync?.launchId ?? null } = {}) {
    boardingSync = createPeerPartyBoardingSync({ members, localId, roomCode, launchId });
    lastBoardingReportKey = "";
    return boardingSync;
  }

  function leaveRoom({ reason = "local-player-left-party" } = {}) {
    if (role === "member" && hostConnection?.open) {
      hostConnection.send({ type: "leave", memberId: localId, reason });
    }
    closePeer();
    roomCode = null;
    role = "leader";
    status = "local";
    members = [createMember({ id: localId, label: localLabel, leader: true })];
    resetBoardingSync();
    message = "Left party.";
    notify();
    return snapshot();
  }

  function closePeer() {
    connections.forEach(({ connection }) => connection.close());
    connections.clear();
    if (hostConnection) hostConnection.close();
    hostConnection = null;
    if (peer) peer.destroy();
    peer = null;
  }

  return {
    snapshot,
    createRoom,
    joinRoom,
    startMatch,
    reportBoardingStatus,
    resetBoardingSync,
    leaveRoom,
  };
}

export function createPeerPartyBoardingSync({
  members = [],
  localId = null,
  roomCode = null,
  launchId = null,
  now = 0,
} = {}) {
  const reports = {};
  const memberIds = [];
  members.forEach((member, index) => {
    const memberId = String(member.id ?? member.playerId ?? `party-member-${index + 1}`);
    memberIds.push(memberId);
    reports[memberId] = {
      memberId,
      label: String(member.label ?? member.displayName ?? `Prospector ${index + 1}`),
      role: String(member.role ?? "Member"),
      status: "waiting",
      phase: "not-started",
      localBoarded: false,
      kitAllReady: false,
      expectedCount: members.length,
      boardedCount: 0,
      readyAt: null,
      updatedAt: now,
    };
  });
  return {
    contract: "goldrush-peer-party-boarding-sync-v1",
    launchId,
    roomCode,
    localId,
    memberIds,
    reports,
    sequence: 0,
    policy: {
      disconnect: "reduce-roster-require-remaining",
    },
    disconnects: [],
  };
}

export function createPeerPartyBoardingReport({
  memberId,
  phase = "unknown",
  boardingStatus = null,
  now = Date.now(),
} = {}) {
  const localBoarded = Boolean(boardingStatus?.localBoarded);
  const kitAllReady = Boolean(boardingStatus?.allReady);
  return {
    memberId: String(memberId ?? boardingStatus?.localPlayerId ?? "player-1"),
    status: localBoarded ? "boarded" : "waiting",
    phase,
    localBoarded,
    kitAllReady,
    expectedCount: Number(boardingStatus?.expectedCount ?? 0),
    boardedCount: Number(boardingStatus?.boardedCount ?? 0),
    readyAt: localBoarded ? boardingStatus?.readyAt ?? now : null,
    updatedAt: now,
  };
}

export function applyPeerPartyBoardingReport(sync, report = {}) {
  const next = structuredClone(sync ?? createPeerPartyBoardingSync());
  const memberId = String(report.memberId ?? "");
  if (!memberId) return next;
  if (Array.isArray(next.memberIds) && next.memberIds.length > 0 && !next.memberIds.includes(memberId)) {
    next.ignoredReports = [
      ...(next.ignoredReports ?? []),
      {
        memberId,
        reason: "not-in-current-roster",
        phase: String(report.phase ?? "unknown"),
        updatedAt: Number(report.updatedAt ?? Date.now()),
      },
    ].slice(-8);
    next.sequence = Number(next.sequence ?? 0) + 1;
    return next;
  }
  const previous = next.reports[memberId] ?? {
    memberId,
    label: memberId,
    role: "Member",
  };
  next.reports[memberId] = {
    ...previous,
    memberId,
    status: report.localBoarded ? "boarded" : String(report.status ?? "waiting"),
    phase: String(report.phase ?? previous.phase ?? "unknown"),
    localBoarded: Boolean(report.localBoarded),
    kitAllReady: Boolean(report.kitAllReady),
    expectedCount: Number(report.expectedCount ?? previous.expectedCount ?? 0),
    boardedCount: Number(report.boardedCount ?? previous.boardedCount ?? 0),
    readyAt: report.readyAt ?? previous.readyAt ?? null,
    updatedAt: Number(report.updatedAt ?? Date.now()),
  };
  next.sequence = Number(next.sequence ?? 0) + 1;
  return next;
}

export function removePeerPartyBoardingMember(sync, { memberId, reason = "disconnected", now = Date.now() } = {}) {
  const id = String(memberId ?? "");
  const next = structuredClone(sync ?? createPeerPartyBoardingSync());
  if (!id) return next;
  next.memberIds = (next.memberIds ?? Object.keys(next.reports ?? {})).filter((entry) => entry !== id);
  delete next.reports[id];
  next.disconnects = [
    ...(next.disconnects ?? []),
    {
      memberId: id,
      reason,
      at: now,
      policy: "reduce-roster-require-remaining",
    },
  ].slice(-8);
  next.sequence = Number(next.sequence ?? 0) + 1;
  return next;
}

export function hydratePeerPartyBoardingSync(snapshot, { members = [], localId = null, roomCode = null } = {}) {
  if (!snapshot?.contract) return createPeerPartyBoardingSync({ members, localId, roomCode });
  let sync = createPeerPartyBoardingSync({
    members,
    localId,
    roomCode: snapshot.roomCode ?? roomCode,
    launchId: snapshot.launchId ?? null,
  });
  const allowedIds = new Set(sync.memberIds);
  (snapshot.reports ?? []).filter((report) => allowedIds.has(report.memberId)).forEach((report) => {
    sync = applyPeerPartyBoardingReport(sync, report);
  });
  sync.disconnects = Array.isArray(snapshot.disconnects) ? structuredClone(snapshot.disconnects).slice(-8) : [];
  sync.sequence = Number(snapshot.sequence ?? sync.sequence);
  return sync;
}

export function snapshotPeerPartyBoardingSync(sync) {
  const reports = Object.values(sync?.reports ?? {});
  const expectedCount = reports.length;
  const readyReports = reports.filter((report) => report.localBoarded);
  return {
    contract: sync?.contract ?? "goldrush-peer-party-boarding-sync-v1",
    launchId: sync?.launchId ?? null,
    roomCode: sync?.roomCode ?? null,
    localId: sync?.localId ?? null,
    sequence: Number(sync?.sequence ?? 0),
    policy: structuredClone(sync?.policy ?? { disconnect: "reduce-roster-require-remaining" }),
    expectedCount,
    readyCount: readyReports.length,
    allReady: expectedCount > 0 && readyReports.length === expectedCount,
    missingMemberIds: reports.filter((report) => !report.localBoarded).map((report) => report.memberId),
    disconnects: structuredClone(sync?.disconnects ?? []),
    ignoredReports: structuredClone(sync?.ignoredReports ?? []),
    reports: reports.map((report) => ({ ...report })),
  };
}

function createMember({ id, label, leader }) {
  return {
    id,
    label,
    role: leader ? "Leader" : "Member",
    status: leader ? "Ready" : "Connected",
  };
}

function createRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function createLocalId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `local-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function normalizeRoomCode(value) {
  return String(value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function toPeerId(code) {
  return `${peerPrefix}-${normalizeRoomCode(code)}`;
}
