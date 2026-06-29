import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createRoomOrchestrator } from "../../src/rooms/roomOrchestrator.js";

const runtime = createGoldRushRuntime({ orchestrator: createRoomOrchestrator() });
const requiredApis = [
  "goldrushRooms",
  "goldrushScenario",
  "goldrushTerrain",
  "goldrushTowns",
  "goldrushPaths",
  "goldrushGoldZones",
  "goldrushLoadingGates",
  "goldrushMining",
  "goldrushCargo",
  "goldrushCashout",
  "goldrushCombat",
  "goldrushCamera",
  "goldrushPerspective",
  "goldrushScenes",
  "goldrushWorld",
  "goldrushAudio",
  "goldrushAnimation",
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
assert(prospect.sceneState.currentSceneId === "goldrush.scene.arena", "prospect phase should use massive terrain arena scene");
assert(prospect.sceneState.activeAudioCueId === "goldrush.audio.music.wandering", "prospect phase should cue wandering music");
assert(prospect.world.scale.widthMeters >= 5000, "world scale must support a massive terrain");
assert(prospect.world.activeRoomWindows.length === 2, "51 players must activate two room patch windows");
assert(prospect.terrainState.patchGrid.activePatchIds.length >= 100, "terrain kit should expose active patch IDs");
assert(prospect.world.towns.length >= 3, "world must include towns and settlements");
assert(prospect.world.goldZones.length >= 4, "world must include multiple gold zones");
assert(prospect.towns.every((town) => town.buildings.length >= 6), "town layouts must expose building descriptors");
assert(prospect.paths.every((path) => path.points.length >= 4), "paths must expose route points");
assert(prospect.goldZones.every((zone) => zone.goldAmountPerPickup === 10), "gold zones should preserve legacy pickup value");
assert(prospect.loadingGates.gates.every((gate) => gate.status === "ready"), "loading gates should validate room/path references");
assert(prospect.audioState.musicCueId === "goldrush.audio.music.wandering", "prospect phase should use wandering music state");
assert(prospect.animationState.clipSlotIds.base === "goldrush.anim.player.run", "prospect phase should use run animation descriptor");
assert(prospect.cameraState.mode === "exploration", "prospect phase should expose exploration camera descriptor");
assert(prospect.cameraState.legacyCameraModel.outOfCombatSize === 20, "camera kit should preserve legacy out-of-combat size");
assert(prospect.installOrder.length === requiredApis.length, "all Gold Rush domain kits should install");

runtime.setCameraMode("combat");
const combat = runtime.snapshot();
assert(combat.cameraMode === "combat", "combat mode should switch through NexusRealtime perspective kit");
assert(combat.combat.active === true, "combat kit should own active combat state");

runtime.setCameraMode("exploration");
const exploration = runtime.snapshot();
assert(exploration.cameraMode === "exploration", "exploration mode should exit combat state");
assert(exploration.combat.active === false, "combat kit should clear active combat state");

const mined = runtime.mineGold();
assert(mined.accepted === true, "mine action should yield gold");
const afterMining = runtime.snapshot();
assert(afterMining.cargo["player-1"] > 0, "mined gold should enter player cargo");

runtime.takeDamage();
const afterDamage = runtime.snapshot();
assert(afterDamage.cameraMode === "combat", "damage should force combat perspective");
assert(afterDamage.sceneState.currentSceneId === "goldrush.scene.legacyGame", "combat should transition to legacy game scene reference");
assert(afterDamage.sceneState.activeAudioCueId === "goldrush.audio.sfx.ambush", "combat transition should cue ambush audio");
assert(afterDamage.sceneState.activeAnimationCueId === "goldrush.anim.player.aimIdle", "combat transition should cue aim animation");
assert(afterDamage.audioState.musicCueId === "goldrush.audio.music.combat", "combat should switch audio state to combat music");
assert(afterDamage.animationState.params.isAiming === true, "combat should switch animation descriptor to aiming");
assert(afterDamage.cameraState.mode === "combat", "damage should switch camera descriptor to combat");
assert(afterDamage.cargo["player-1"] < afterMining.cargo["player-1"], "damage should put carried gold at risk");

runtime.cashOut();
const afterCashout = runtime.snapshot();
assert(afterCashout.cashout["player-1"] > 0, "cashout should bank remaining carried gold");
assert(afterCashout.cargo["player-1"] === 0, "cashout should clear carried gold");
assert(afterCashout.sceneState.currentSceneId === "goldrush.scene.arena", "cashout should return to massive terrain arena scene");
assert(afterCashout.sceneState.activeAudioCueId === "goldrush.audio.sfx.cashout", "cashout should cue cashout audio");
assert(afterCashout.audioState.oneShots.some((shot) => shot.cueId === "goldrush.audio.sfx.cashout"), "cashout should emit one-shot cashout cue");
assert(afterCashout.animationState.actionState === "cashout", "cashout should emit cashout animation state");
assert(afterCashout.assets.assets.length === 10, "placeholder asset slots should be installed");
assert(afterCashout.assets.presentation.scenes.length === 8, "scene slots should be installed");
assert(afterCashout.assets.presentation.audio.length === 12, "audio slots should be installed");
assert(afterCashout.assets.presentation.animations.length === 14, "animation slots should be installed");
assert(
  afterCashout.assets.assets.every((asset) => asset.status === "placeholder" && asset.runtimePath === null),
  "asset slots must remain placeholders until cloud promotion"
);

console.log("nexus runtime passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
