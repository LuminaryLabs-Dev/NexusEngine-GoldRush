import { createRoomOrchestrator } from "../../src/rooms/roomOrchestrator.js";

const orchestrator = createRoomOrchestrator();

const cases = [
  { players: 2, shards: [2] },
  { players: 50, shards: [50] },
  { players: 51, shards: [50, 1] },
  { players: 72, shards: [50, 22] },
  { players: 100, shards: [50, 50] },
  { players: -10, shards: [2] },
  { players: 101, shards: [50, 50] },
  { players: Number.NaN, shards: [2] },
];

for (const testCase of cases) {
  const result = orchestrator.generate({ players: testCase.players });
  const actual = result.shards.map((room) => room.playerCount);
  assertDeepEqual(actual, testCase.shards, `players ${String(testCase.players)} shard distribution`);

  assert(result.lobby.id === "lobby-main", "lobby id should stay stable");
  assert(result.ledger.id === "match-ledger", "ledger id should stay stable");
  assert(
    result.ledger.shardIds.length === result.shards.length,
    "ledger must reference every generated shard"
  );

  for (const [index, room] of result.shards.entries()) {
    assert(room.capacity === 50, `room ${room.id} capacity must be 50`);
    assert(room.playerCount >= 1, `room ${room.id} must not be empty`);
    assert(room.playerCount <= room.capacity, `room ${room.id} must not overflow`);
    assert(room.id === `shard-${index + 1}`, "shard ids must be deterministic");
    assert(room.handoffTopic.endsWith(String(index + 1)), "handoff topic must match shard index");
  }
}

console.log("room orchestration passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertDeepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`${label}: expected ${expectedText}, received ${actualText}`);
  }
}
