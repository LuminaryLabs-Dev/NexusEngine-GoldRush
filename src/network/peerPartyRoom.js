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
      roomCode,
      launchedAt: Date.now(),
    };
    broadcast(startPayload);
    onStartMatch(startPayload);
    return true;
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
        onStartMatch(data);
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
    });
  }

  function broadcast(payload) {
    connections.forEach(({ connection }) => {
      if (connection.open) connection.send(payload);
    });
  }

  function removeConnection(peerId) {
    const record = connections.get(peerId);
    if (!record) return;
    connections.delete(peerId);
    members = members.filter((member) => member.id !== record.memberId);
    message = "A party member disconnected.";
    notify();
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
