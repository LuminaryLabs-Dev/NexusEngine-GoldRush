import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import { genericIncubatorKitContracts } from "../../src/kits/generic-incubator/domainServiceKitCatalog.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
const requiredApis = [
  ...genericIncubatorKitContracts.map((contract) => contract.apiName),
  "goldrushKitContracts",
  "goldrushProtoKitBridge",
  "goldrushNetwork",
  "goldrushRooms",
  "goldrushScenario",
  "goldrushLegacySources",
  "goldrushTerrain",
  "goldrushTowns",
  "goldrushPaths",
  "goldrushGoldZones",
  "goldrushLoadingGates",
  "goldrushMining",
  "goldrushCargo",
  "goldrushCashout",
  "goldrushCombat",
  "goldrushExtractionLoop",
  "goldrushCamera",
  "goldrushPerspective",
  "goldrushScenes",
  "goldrushWorld",
  "goldrushAudio",
  "goldrushAnimation",
  "goldrushLegacyModes",
  "goldrushMatch",
  "goldrushFinalRush",
  "goldrushExtractionReceipts",
  "goldrushRoomHandoffReceipts",
  "goldrushScoring",
  "goldrushResults",
  "goldrushReplaySummary",
  "goldrushAssets",
  "goldrushReality",
];

for (const apiName of requiredApis) {
  assert(runtime.engine.n?.[apiName], `missing NexusRealtime engine.n.${apiName}`);
}

runtime.generateMatch({ players: 51, phase: "prospect" });
const prospect = runtime.snapshot();
assert(prospect.network.status === "ready", "network kit should be the public multiplayer contract");
assert(prospect.network.policy.playerJoinUiFocus === "deferred", "player joining UI should be deferred for browser-instance testing");
assert(prospect.network.topology.publicLabel === "network-ready", "network should expose a public ready label");
assert(prospect.network.partitions.length === 2, "51 players should create two internal network partitions");
assert(prospect.network.partitions.every((partition) => partition.visibility === "internal"), "partitions should stay internal");
assert(prospect.network.ledger.writes.includes("player-join"), "network ledger should include incremental join writes");
assert(prospect.network.policy.partitionRetention === "retain-high-water-until-match-end", "network should retain high-water partitions until match end");
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
assert(prospect.cameraState.legacyCameraModel.type === "over-the-shoulder-third-person", "camera kit should expose third-person camera model");
assert(prospect.cameraState.threeDescriptor.position[1] <= 5.5, "exploration camera should not be tactical top-down");
assert(prospect.cameraState.legacyCameraModel.outOfCombatSize === 20, "camera kit should preserve legacy out-of-combat size");
assert(prospect.cameraState.perspectiveCount >= 1000, "camera kit should expose 1000 deterministic player-view perspectives");
assert(prospect.cameraState.perspectiveFamilies.length >= 10, "camera kit should cover many player-view perspective families");
assert(prospect.cameraState.selectedPerspective.playabilityChecks.includes("player-silhouette-readable"), "selected camera should carry playability checks");
assert(JSON.stringify(prospect.cameraState.perspectiveCatalog).includes("goldrush.camera.pose.1000"), "camera perspective catalog should serialize the full pose set");
assert(prospect.installOrder.length === requiredApis.length, "all Gold Rush domain kits should install");
assert(prospect.installOrder.includes("n-goldrush-protokit-route-cargo-extraction-bridge-kit"), "GoldRush ProtoKit bridge should install into the runtime");
assert(runtime.engine.n.goldrushProtoKitBridge.validate().passed, "GoldRush ProtoKit bridge should validate inside the runtime");
assert(prospect.realityStatus.summary.placeholderSlots >= 30, "reality status should expose placeholder debt");
assert(prospect.realityStatus.domains.some((domain) => domain.id === "legacy-assets" && domain.status === "blocked-cloud-import"), "legacy assets should stay cloud-blocked until promoted");
assert(prospect.realityStatus.domains.some((domain) => domain.id === "audio-music" && domain.status === "blocked-cloud-import"), "actual audio should stay cloud-blocked until promoted");
assert(prospect.legacySources.sourceProjects.length === 2, "legacy source manifest should track both Unity source projects");
assert(prospect.legacyReadiness.totals.totalRequiredSlots >= 18, "legacy source readiness should cover playable asset families");
assert(prospect.legacyReadiness.status === "waiting-for-cloud-import", "legacy source readiness should remain blocked until assets are approved");
assert(prospect.legacyMode.modes.length === 3, "legacy mode kit should expose three playable version intents");
assert(prospect.legacyMode.activeMode.modeId === "modernExtraction", "modern extraction should be the default unified mode");
assert(prospect.kitContracts.generic.count === genericIncubatorKitContracts.length, "runtime snapshot should expose the generic incubator kit catalog");
assert(prospect.kitContracts.goldRush.count >= 30, "runtime snapshot should expose the GoldRush custom kit catalog");
assert(prospect.kitContracts.pairings.length === genericIncubatorKitContracts.length, "each generic incubator kit should have one GoldRush pairing");
assert(runtime.engine.n.goldrushKitContracts.validate().passed, "GoldRush kit contract registry should validate");
assert(runtime.engine.n.runtimeDomainRegistry.snapshot().domainPath === "n:runtime:domain-registry", "generic runtime domain registry should be installed");

runtime.engine.n.goldrushNetwork.generate({ players: 50, phase: "lobby" });
const runtimeJoin51 = runtime.engine.n.goldrushNetwork.joinPlayer({ playerId: "runtime-player-051", source: "validator" });
assert(runtimeJoin51.accepted, "runtime network API should accept player 51 incrementally");
assert(runtimeJoin51.snapshot.partitions.length === 2, "runtime network API should allocate partition 2 at player 51");
const runtimeLeave51 = runtime.engine.n.goldrushNetwork.leavePlayer({ playerId: "runtime-player-051", reason: "validator-drop" });
assert(runtimeLeave51.accepted, "runtime network API should allow player 51 to leave");
const retainedRuntimeNetwork = runtime.engine.n.goldrushNetwork.snapshot();
assert(retainedRuntimeNetwork.partitions.length === 2, "runtime network API should retain partition 2 after dropping below 51");
assert(retainedRuntimeNetwork.partitions[1].state === "retained", "runtime retained partition should be marked retained");
runtime.generateMatch({ players: 51, phase: "prospect" });

runtime.setCameraMode("combat");
const combat = runtime.snapshot();
assert(combat.cameraMode === "combat", "combat mode should switch through NexusRealtime perspective kit");
assert(combat.combat.active === true, "combat kit should own active combat state");

runtime.setLegacyMode({ modeId: "classicCombat" });
const classicCombat = runtime.snapshot();
assert(classicCombat.legacyMode.activeMode.modeId === "classicCombat", "classic combat mode should be selectable");
assert(classicCombat.cameraMode === "combat", "classic combat mode should force combat perspective");
assert(classicCombat.sceneState.currentSceneId === "goldrush.scene.legacyGame", "classic combat should target the legacy Game scene intent");

runtime.setLegacyMode({ modeId: "classicSolo" });
const classicSolo = runtime.snapshot();
assert(classicSolo.legacyMode.activeMode.modeId === "classicSolo", "classic solo mode should be selectable");
assert(classicSolo.sceneState.currentSceneId === "goldrush.scene.legacySinglePlayer", "classic solo should target the legacy single-player scene intent");

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
assert(afterDamage.cameraState.selectedPerspective.mode === "combat", "combat camera should select a combat perspective packet");
assert(afterDamage.cargo["player-1"] < afterMining.cargo["player-1"], "damage should put carried gold at risk");

runtime.startFinalRush();
const afterFinalRush = runtime.snapshot();
assert(afterFinalRush.match.phase === "finalRush", "final rush should advance match lifecycle");
assert(afterFinalRush.finalRush.pressureScalar > 0, "final rush should create collapse pressure");
assert(afterFinalRush.finalRush.pressureScalar <= 1, "final rush pressure should stay clamped");

runtime.cashOut();
const afterCashout = runtime.snapshot();
assert(afterCashout.cashout["player-1"] > 0, "cashout should bank remaining carried gold");
assert(afterCashout.cargo["player-1"] === 0, "cashout should clear carried gold");
assert(afterCashout.extractionReceipts.totals.acceptedCount === 1, "cashout should create one accepted extraction receipt");
assert(afterCashout.scoring.leaders.teamId === "team-01", "cashout should update scoring leader");
assert(afterCashout.scoring.teams["team-01"].totalScore > 0, "cashout should produce a positive team score");
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

runtime.requestHandoff();
const afterHandoff = runtime.snapshot();
assert(afterHandoff.handoffReceipts.appliedHandoffIds.length === 1, "handoff should record one accepted room gate receipt");

runtime.endMatch({ reason: "manual" });
const afterResults = runtime.snapshot();
assert(afterResults.match.phase === "results", "end match should advance to results");
assert(afterResults.results.status === "final", "end match should finalize result state");
assert(afterResults.results.winner.id === "team-01", "results should report the deterministic team winner");
assert(afterResults.replaySummary.keyMoments.length >= 3, "replay summary should include match lifecycle moments");

console.log("nexus runtime passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
