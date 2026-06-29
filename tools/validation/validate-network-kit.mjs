import { createNetworkOrchestrator, validateIncrementalSession } from "../../src/network/networkOrchestrator.js";

const orchestrator = createNetworkOrchestrator();

const cases = [
  { players: 2, partitions: [2] },
  { players: 50, partitions: [50] },
  { players: 51, partitions: [50, 1] },
  { players: 72, partitions: [50, 22] },
  { players: 100, partitions: [50, 50] },
  { players: -10, partitions: [2] },
  { players: 101, partitions: [50, 50] },
  { players: Number.NaN, partitions: [2] },
];

for (const testCase of cases) {
  const result = orchestrator.generate({ players: testCase.players, phase: "prospect" });
  const actual = result.partitions.map((partition) => partition.playerCount);
  assertDeepEqual(actual, testCase.partitions, `players ${String(testCase.players)} network partition distribution`);

  assert(result.status === "ready", "network status should stay ready");
  assert(result.policy.partitionCapacity === 50, "internal partition capacity must stay 50");
  assert(result.policy.playerJoinUiFocus === "deferred", "player joining UI should remain out of the primary build focus");
  assert(result.topology.publicLabel === "network-ready", "public topology label should be network-level");
  assert(result.debug.visibleInPrimaryHud === false, "internal partition detail should not be primary HUD state");
  assert(result.rooms.shards.length === result.partitions.length, "room compatibility facade must match partitions");
  assert(result.ledger.partitionIds.length === result.partitions.length, "ledger must reference every partition");

  for (const [index, partition] of result.partitions.entries()) {
    assert(partition.visibility === "internal", `partition ${partition.id} must stay internal`);
    assert(partition.capacity === 50, `partition ${partition.id} capacity must be 50`);
    assert(partition.playerCount >= 1, `partition ${partition.id} must not be empty`);
    assert(partition.playerCount <= partition.capacity, `partition ${partition.id} must not overflow`);
    assert(partition.id === `partition-${index + 1}`, "partition ids must be deterministic");
    assert(partition.handoffTopic.endsWith(String(index + 1)), "handoff topic must match partition index");
  }
}

const session = orchestrator.createSession({ players: 50, phase: "lobby" });
let snapshot = session.snapshot();
assert(snapshot.partitions.length === 1, "50-player session should start with one retained partition");
assert(snapshot.partitions[0].playerCount === 50, "first session partition should hold 50 players");

const player51 = session.joinPlayer({ playerId: "player-051", source: "browser-instance" });
assert(player51.accepted, "player 51 should be accepted");
snapshot = session.snapshot();
assert(snapshot.partitions.length === 2, "player 51 should create the second retained partition");
assert(snapshot.partitions[1].playerCount === 1, "player 51 should land in partition 2");
assert(snapshot.ledger.latestEvents.some((event) => event.type === "partition.created"), "session ledger should record partition creation");
assert(snapshot.ledger.writes.includes("player-join"), "session ledger should include player-join writes");
assert(validateIncrementalSession(snapshot).passed, "incremental session should validate after player 51 joins");

const duplicate = session.joinPlayer({ playerId: "player-051", source: "browser-instance" });
assert(!duplicate.accepted && duplicate.reason === "duplicate-player", "duplicate player joins should be rejected");

const leave51 = session.leavePlayer({ playerId: "player-051", reason: "playtest-disconnect" });
assert(leave51.accepted, "player 51 should be able to leave");
snapshot = session.snapshot();
assert(snapshot.partitions.length === 2, "partition 2 should stay retained after player count drops under 51");
assert(snapshot.partitions[1].state === "retained", "empty partition 2 should be retained until match end");
assert(snapshot.ledger.highWaterPartitionCount === 2, "ledger should preserve high-water partition count");
assert(snapshot.ledger.latestEvents.some((event) => event.type === "player.left"), "session ledger should record player leave");
assert(validateIncrementalSession(snapshot).passed, "incremental session should validate after retention");

const compactSession = orchestrator.createSession({ players: 51, phase: "prospect" });
const leaveFirst = compactSession.leavePlayer({ playerId: "player-001", reason: "front-slot-drop" });
assert(leaveFirst.accepted, "first player should be able to leave after partition 2 exists");
snapshot = compactSession.snapshot();
assert(snapshot.partitions[0].playerCount === 50, "active players should compact into partition 1 after an early slot leaves");
assert(snapshot.partitions[1].playerCount === 0, "retained partition 2 should be empty after compaction");
assert(snapshot.partitions[1].state === "retained", "retained partition 2 should keep its room identity after compaction");

const full = orchestrator.createSession({ players: 100, phase: "prospect" });
const overflow = full.joinPlayer({ playerId: "player-101", source: "overflow-test" });
assert(!overflow.accepted && overflow.reason === "network-full", "player 101 should be rejected by the live session");

console.log("network kit passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDeepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`${label}: expected ${expectedText}, received ${actualText}`);
  }
}
