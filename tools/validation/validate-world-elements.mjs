import {
  createAudioStateDescriptor,
  createGoldRushWorldElements,
  createGoldZoneDescriptors,
  createPathNetworkDescriptors,
  createTownLayoutDescriptors,
  validateGoldRushWorldElements,
} from "../../src/content/goldrushWorldElements.js";
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
assert(world.environmentSpaces.length >= 6, "world must expose environment spaces, not only prop/reference-image lists");
assert(world.environmentSpaces.some((space) => space.id === "space.world.canyon-basin"), "world must define the canyon basin as a playable volume");
assert(world.environmentSpaces.some((space) => space.id === "space.world.mine-shelf" && space.spatialRule.includes("one shelf")), "mine props must be organized by shelf/world understanding");
assert(world.activeRoomWindows.reduce((sum, window) => sum + ((window.patchRadius * 2 + 1) ** 2), 0) >= 100, "active terrain windows need enough patch coverage");

const towns = createTownLayoutDescriptors(world);
const paths = createPathNetworkDescriptors(world);
const goldZones = createGoldZoneDescriptors(world);
const combatAudio = createAudioStateDescriptor({ phase: "combat", combatActive: true });

assert(towns.every((town) => town.buildings.length >= 6), "each town needs at least six building descriptors");
assert(towns.every((town) => town.streetGraph.nodes.length >= 7), "each town needs a street graph");
assert(paths.every((path) => path.connectedTownIds.length > 0), "each path should connect at least one town");
assert(paths.some((path) => path.tags.includes("extraction")), "path network needs an extraction route");
assert(goldZones.every((zone) => zone.goldAmountPerPickup === 10), "gold zones must preserve legacy 10 gold pickup value");
assert(goldZones.every((zone) => zone.spawnRateTicks > 0), "gold zones must define spawn cadence");
assert(combatAudio.musicCueId === "goldrush.audio.music.combat", "combat audio descriptor should select combat music");

console.log("world elements passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
