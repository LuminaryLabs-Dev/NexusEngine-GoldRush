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

const session = orchestrator.createSession({ players: 49, phase: "lobby" });
session.joinPlayer({ playerId: "player-050", source: "validator" });
let rooms = session.snapshot().rooms;
assert(rooms.shards.length === 1, "50 live players should still use one compatibility room shard");
assert(rooms.shards[0].playerCount === 50, "compatibility shard 1 should hold 50 players before threshold");

session.joinPlayer({ playerId: "player-051", source: "validator" });
rooms = session.snapshot().rooms;
assert(rooms.shards.length === 2, "player 51 should add compatibility shard 2");
assert(rooms.shards[0].playerCount === 50, "compatibility shard 1 should remain capped");
assert(rooms.shards[1].playerCount === 1, "compatibility shard 2 should receive overflow player");

session.leavePlayer({ playerId: "player-051", reason: "validator-drop" });
rooms = session.snapshot().rooms;
assert(rooms.shards.length === 2, "compatibility shard 2 should stay retained after player 51 leaves");
assert(rooms.shards[1].state === "retained", "compatibility shard 2 should be marked retained when empty");
assert(rooms.ledger.writes.includes("player-leave"), "room ledger should include incremental leave writes");

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
