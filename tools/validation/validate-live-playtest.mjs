import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import { readFileSync } from "node:fs";

const debugUrl = process.env.GOLDRUSH_PLAYTEST_URL ?? "http://localhost:5177/NexusEngine-GoldRush/";

const response = await fetch(debugUrl, { method: "GET" });
assert(response.ok, `debug URL did not return OK: ${response.status}`);
const html = await response.text();
assert(html.includes("NexusEngine Gold Rush") || html.includes("Gold Rush"), "debug URL did not return the Gold Rush app shell");

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 72, phase: "prospect" });
const state = runtime.snapshot();

assert(state.players === 72, "playtest scenario should use the default outfit-sized run");
assert(state.network.status === "ready", "network should be ready");
assert(state.network.policy.partitionCapacity === 50, "network partition capacity should remain 50");
assert(state.network.partitions.length === 2, "72 players should create two internal partitions");
assert(state.network.policy.partitionRetention === "retain-high-water-until-match-end", "network should retain high-water room partitions");
assert(state.network.ledger.writes.includes("player-join"), "network ledger should include incremental player joins");
assert(state.cameraState.perspectiveCount >= 1000, "camera perspective catalog should be available");
assert(state.world.environmentSpaces.length >= 6, "world environment spaces should be available");
assert(state.legacyReadiness.status === "waiting-for-cloud-import", "legacy readiness should remain explicit");
assert(state.realityStatus.summary.placeholderSlots >= 30, "reality status should expose placeholder debt");
assert(state.realityStatus.domains.some((domain) => domain.id === "legacy-assets" && domain.status === "blocked-cloud-import"), "legacy asset fake layer should be cloud-blocked");
assert(state.realityStatus.domains.some((domain) => domain.id === "audio-music" && domain.status === "blocked-cloud-import"), "actual audio fake layer should be cloud-blocked");
assert(state.realityStatus.domains.some((domain) => domain.id === "character-rig" && domain.status === "prototype"), "procedural character should be marked prototype");

const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
const partySource = readFileSync(new URL("../../src/network/peerPartyRoom.js", import.meta.url), "utf8");
assert(appSource.includes("const partyCapacity = 4"), "lobby should cap the PeerJS party at four players");
assert(appSource.includes("const massMatchPlayers = 20"), "party leader should launch the first mass-scale room at 20 players");
assert(appSource.includes("const massMatchPlayers = 20"), "lobby should retain the 20-player match payload");
assert(appSource.includes('data-screen-panel="loading"'), "app should expose the loading-yard site before the gold field");
assert(appSource.includes("startLoadingYard"), "party leader start should enter the train loading scene first");
assert(appSource.includes("sceneKitSnapshot.activeKitGroups"), "app should expose active scene-kit groups from loader state");
assert(appSource.includes("createGoldRushSceneKitLoader"), "app should own a scene kit loader");
assert(appSource.includes("sceneKitLoader.activate"), "app should activate scene kits when screens change");
assert(appSource.includes("sceneKitLoaderValidation"), "debug state should expose scene kit loader validation");
assert(!appSource.includes("../renderer/goldRushRenderer.js"), "app should not statically import the gold-field renderer");
assert(appSource.includes("sampleTerrainCollider"), "app movement should ground the player through the shared terrain collider");
assert(appSource.includes("raycastTerrainDown"), "app movement should place the player by raycasting down to the terrain collider");
assert(appSource.includes("addLookDelta"), "app movement should expose mouse-look deltas");
assert(appSource.includes("requestPointerLock"), "run stage should request pointer lock for mouse look");
assert(appSource.includes("movementRelativeToCamera"), "WASD movement should be relative to camera look yaw");
assert(appSource.includes("terrainColliderDescriptor"), "app debug state should expose the shared terrain collider descriptor");
assert(appSource.includes("terrainPhysics"), "app debug state should expose the cannon-es terrain physics descriptor");
assert(appSource.includes("realityStatus"), "app debug state should expose the reality-status ledger");
assert(appSource.includes("goldrushReality.validate"), "app debug state should expose reality-status validation");
assert(appSource.includes("engine.n.goldrushNetwork") || readFileSync(new URL("../../src/kits/goldRushDomainKits.js", import.meta.url), "utf8").includes("joinPlayer"), "runtime should expose incremental network joins");
assert(partySource.includes("new Peer("), "PeerJS party room should create peer sessions");
assert(partySource.includes("start-match"), "PeerJS party room should broadcast leader match starts");
assert(!appSource.includes("createTone("), "audio should not use sustained humming oscillator tones");

console.log(JSON.stringify({
  status: "live-playtest-ready",
  url: debugUrl,
  players: state.players,
  partitions: state.network.partitions.length,
  partitionRetention: state.network.policy.partitionRetention,
  partyCapacity: 4,
  leaderLaunchPlayers: 20,
  sceneSiteFlow: ["lobby", "loading", "run"],
  sceneKitLoading: "runtime-activation-receipts",
  terrainCollider: "sampled-heightfield",
  terrainPhysics: "cannon-es-heightfield",
  cameraInput: "mouse-look-wasd-relative",
  cameraPerspectives: state.cameraState.perspectiveCount,
  environmentSpaces: state.world.environmentSpaces.length,
  legacyReadiness: state.legacyReadiness.status,
  realityStatus: {
    realLocal: state.realityStatus.summary.realLocal,
    prototype: state.realityStatus.summary.prototype,
    blockedCloud: state.realityStatus.summary.blockedCloud,
    promotedAssets: state.realityStatus.summary.promotedAssets,
    promotedAudio: state.realityStatus.summary.promotedAudio,
  },
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
