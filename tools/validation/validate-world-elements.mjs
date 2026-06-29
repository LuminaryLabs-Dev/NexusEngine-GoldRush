import { createGoldRushWorldElements, validateGoldRushWorldElements } from "../../src/content/goldrushWorldElements.js";
import { createRoomOrchestrator } from "../../src/rooms/roomOrchestrator.js";

const rooms = createRoomOrchestrator().generate({ players: 72 });
const world = createGoldRushWorldElements({ rooms, phase: "prospect" });
const validation = validateGoldRushWorldElements(world);

assert(validation.passed, `world element validation failed: ${validation.failures.join(", ")}`);
assert(world.activeRoomWindows.length === 2, "72 players should activate two room patch windows");
assert(world.roomPatchWindows.every((window) => window.patchRadius >= 5), "room patch windows are too small");
assert(world.towns.some((town) => town.buildings.includes("station")), "town set must include a station");
assert(world.towns.some((town) => town.buildings.includes("saloon")), "town set must include an explorable town center");
assert(world.mountainRanges.every((range) => range.height >= 250), "mountain ranges must read as horizon blockers");
assert(world.goldZones.every((zone) => zone.radius >= 140), "gold zones must be broad enough for multiplayer contention");
assert(world.paths.every((path) => path.points.length >= 4), "paths must have enough points for route readability");
assert(world.loadingGates.length >= 2, "loading and room handoff gates must be defined");

console.log("world elements passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
