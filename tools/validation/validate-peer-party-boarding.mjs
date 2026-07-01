import {
  applyPeerPartyBoardingReport,
  createPeerPartyBoardingReport,
  createPeerPartyBoardingSync,
  hydratePeerPartyBoardingSync,
  removePeerPartyBoardingMember,
  snapshotPeerPartyBoardingSync,
} from "../../src/network/peerPartyRoom.js";

const members = [
  { id: "player-1", label: "Prospector", role: "Leader" },
  { id: "player-2", label: "Trail Scout", role: "Member" },
  { id: "player-3", label: "Claim Guard", role: "Member" },
];

let sync = createPeerPartyBoardingSync({
  members,
  localId: "player-1",
  roomCode: "GOLD1",
  launchId: "launch-001",
});
let snapshot = snapshotPeerPartyBoardingSync(sync);

assert(snapshot.contract === "goldrush-peer-party-boarding-sync-v1", "missing-peer-boarding-contract");
assert(snapshot.expectedCount === 3, "expected party member count missing");
assert(snapshot.readyCount === 0, "party should not start ready");
assert(snapshot.missingMemberIds.length === 3, "initial missing party ids wrong");

sync = applyPeerPartyBoardingReport(sync, createPeerPartyBoardingReport({
  memberId: "player-1",
  phase: "train-departing",
  boardingStatus: {
    localBoarded: true,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
    readyAt: 4900,
  },
  now: 4900,
}));
snapshot = snapshotPeerPartyBoardingSync(sync);
assert(snapshot.readyCount === 1, "only local boarded report should count as one ready peer");
assert(!snapshot.allReady, "peer party should wait for every peer local-boarded report");

sync = applyPeerPartyBoardingReport(sync, createPeerPartyBoardingReport({
  memberId: "player-2",
  phase: "train-departing",
  boardingStatus: {
    localBoarded: true,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
    readyAt: 5000,
  },
  now: 5000,
}));
sync = applyPeerPartyBoardingReport(sync, createPeerPartyBoardingReport({
  memberId: "player-3",
  phase: "boarding-open",
  boardingStatus: {
    localBoarded: false,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
  },
  now: 5010,
}));
snapshot = snapshotPeerPartyBoardingSync(sync);
assert(snapshot.readyCount === 2, "unboarded peer should not count ready even if its local kit auto-followed party");
assert(snapshot.missingMemberIds.includes("player-3"), "unboarded peer should remain missing");

sync = applyPeerPartyBoardingReport(sync, createPeerPartyBoardingReport({
  memberId: "player-3",
  phase: "train-departing",
  boardingStatus: {
    localBoarded: true,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
    readyAt: 5100,
  },
  now: 5100,
}));
snapshot = snapshotPeerPartyBoardingSync(sync);
assert(snapshot.readyCount === 3, "all peers should be ready after local boarded reports");
assert(snapshot.allReady, "all peers should be ready");
assert(snapshot.missingMemberIds.length === 0, "no missing peers after all ready");

const hydrated = hydratePeerPartyBoardingSync(snapshot, { members, localId: "player-2", roomCode: "GOLD1" });
const hydratedSnapshot = snapshotPeerPartyBoardingSync(hydrated);
assert(hydratedSnapshot.contract === snapshot.contract, "hydrated contract mismatch");
assert(hydratedSnapshot.readyCount === 3, "hydrated ready count mismatch");
assert(hydratedSnapshot.allReady, "hydrated all-ready mismatch");

let disconnectSync = createPeerPartyBoardingSync({
  members,
  localId: "player-1",
  roomCode: "GOLD1",
  launchId: "launch-002",
});
disconnectSync = applyPeerPartyBoardingReport(disconnectSync, createPeerPartyBoardingReport({
  memberId: "player-1",
  phase: "boarding-syncing",
  boardingStatus: {
    localBoarded: true,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
  },
  now: 6100,
}));
disconnectSync = applyPeerPartyBoardingReport(disconnectSync, createPeerPartyBoardingReport({
  memberId: "player-2",
  phase: "boarding-syncing",
  boardingStatus: {
    localBoarded: true,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
  },
  now: 6110,
}));
disconnectSync = removePeerPartyBoardingMember(disconnectSync, {
  memberId: "player-3",
  reason: "peer-connection-closed",
  now: 6200,
});
let disconnectSnapshot = snapshotPeerPartyBoardingSync(disconnectSync);
assert(disconnectSnapshot.expectedCount === 2, "disconnect should reduce expected roster count");
assert(disconnectSnapshot.readyCount === 2, "remaining ready peers should stay ready after disconnect");
assert(disconnectSnapshot.allReady, "remaining roster should be all ready after disconnect");
assert(disconnectSnapshot.disconnects.length === 1, "disconnect receipt should be recorded");
assert(disconnectSnapshot.disconnects[0].policy === "reduce-roster-require-remaining", "disconnect policy should be explicit");

disconnectSync = applyPeerPartyBoardingReport(disconnectSync, createPeerPartyBoardingReport({
  memberId: "player-3",
  phase: "train-departing",
  boardingStatus: {
    localBoarded: true,
    allReady: true,
    expectedCount: 3,
    boardedCount: 3,
  },
  now: 6300,
}));
disconnectSnapshot = snapshotPeerPartyBoardingSync(disconnectSync);
assert(disconnectSnapshot.expectedCount === 2, "stale disconnected peer report should not re-expand roster");
assert(disconnectSnapshot.readyCount === 2, "stale disconnected peer report should not change ready count");
assert(disconnectSnapshot.ignoredReports.some((report) => report.memberId === "player-3"), "stale disconnected peer report should be tracked as ignored");

console.log(JSON.stringify({
  status: "peer-party-boarding-ready",
  contract: snapshot.contract,
  expectedCount: snapshot.expectedCount,
  readyCount: snapshot.readyCount,
  allReady: snapshot.allReady,
  disconnectPolicy: disconnectSnapshot.policy.disconnect,
  disconnects: disconnectSnapshot.disconnects.length,
  ignoredReports: disconnectSnapshot.ignoredReports.length,
  sequence: snapshot.sequence,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
