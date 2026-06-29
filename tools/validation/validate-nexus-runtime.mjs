import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createRoomOrchestrator } from "../../src/rooms/roomOrchestrator.js";

const runtime = createGoldRushRuntime({ orchestrator: createRoomOrchestrator() });
const requiredApis = [
  "goldrushRooms",
  "goldrushScenario",
  "goldrushMining",
  "goldrushCargo",
  "goldrushCashout",
  "goldrushCombat",
  "goldrushPerspective",
  "goldrushAssets",
];

for (const apiName of requiredApis) {
  assert(runtime.engine.n?.[apiName], `missing NexusRealtime engine.n.${apiName}`);
}

runtime.generateMatch({ players: 51, phase: "prospect" });
const prospect = runtime.snapshot();
assert(prospect.rooms.shards.length === 2, "51 players must generate two room shards");
assert(prospect.rooms.shards[0].playerCount === 50, "first shard must cap at 50 players");
assert(prospect.rooms.shards[1].playerCount === 1, "second shard must receive player 51");
assert(prospect.cameraMode === "exploration", "prospect phase should use exploration perspective");
assert(prospect.installOrder.length === requiredApis.length, "all Gold Rush domain kits should install");

runtime.setCameraMode("combat");
const combat = runtime.snapshot();
assert(combat.cameraMode === "combat", "combat mode should switch through NexusRealtime perspective kit");
assert(combat.combat.active === true, "combat kit should own active combat state");

runtime.setCameraMode("exploration");
const exploration = runtime.snapshot();
assert(exploration.cameraMode === "exploration", "exploration mode should exit combat state");
assert(exploration.combat.active === false, "combat kit should clear active combat state");

console.log("nexus runtime passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
