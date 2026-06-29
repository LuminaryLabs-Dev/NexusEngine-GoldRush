import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createBridgeRuntime } from "../../src/kits/protokits/goldRushProtoKitBridge.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";

const failures = [];

const standaloneBridge = createBridgeRuntime();
const standaloneValidation = standaloneBridge.validate();
expect(standaloneValidation.passed, `standalone-bridge-validation-failed:${standaloneValidation.failures.join(",")}`);

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
const bridge = runtime.engine.n.goldrushProtoKitBridge;
expect(bridge, "runtime-missing-goldrush-protokit-bridge-api");

const initial = bridge.snapshot();
expect(initial.status === "loaded", "bridge-not-loaded");
expect(initial.policy === "isolated-protokit-runtime", "bridge-policy-mismatch");
expect(initial.installedProtoKits.length === 4, "bridge-should-install-four-protokits");
expect(initial.installedProtoKits.some((kit) => kit.id === "generic-route-cargo-extraction-kit"), "composite-protokit-not-installed");
expect(initial.protoSnapshot.descriptors.some((descriptor) => descriptor.id === "mine-seam"), "mine-seam-descriptor-missing");
expect(initial.protoSnapshot.descriptors.some((descriptor) => descriptor.kind === "cargo-resource" && descriptor.id === "gold"), "gold-cargo-descriptor-missing");
expect(initial.protoSnapshot.descriptors.some((descriptor) => descriptor.kind === "extraction-pressure-channel" && descriptor.id === "ambush-pressure"), "ambush-pressure-descriptor-missing");

const pickup = bridge.pickupGold({ amount: 18, commandId: "validator.pickup" });
expect(pickup.accepted, "pickup-gold-rejected");
expect(pickup.snapshot.cargo.resourcesById.gold.value === 18, "pickup-gold-value-mismatch");

const mine = bridge.completeCheckpoint({ checkpointId: "mine-seam", commandId: "validator.mine" });
expect(mine.accepted, "mine-checkpoint-rejected");
expect(mine.snapshot.route.completedIds.includes("mine-seam"), "mine-checkpoint-not-completed");
expect(mine.snapshot.route.activeId === "carry-gold", "route-did-not-advance-to-carry-gold");

const pressure = bridge.adjustPressure({ amount: 40, commandId: "validator.pressure" });
expect(pressure.accepted, "pressure-adjust-rejected");
expect(pressure.snapshot.pressure.channelsById["ambush-pressure"].value === 40, "pressure-value-mismatch");

const deliver = bridge.deliverGold({ amount: 7, commandId: "validator.deliver" });
expect(deliver.accepted, "deliver-gold-rejected");
expect(deliver.snapshot.cargo.resourcesById.gold.value === 11, "deliver-gold-value-mismatch");

const runtimeValidation = bridge.validate();
expect(runtimeValidation.passed, `runtime-bridge-validation-failed:${runtimeValidation.failures.join(",")}`);

runtime.generateMatch({ players: 20, phase: "prospect" });
expect(runtime.engine.clock.frame > 0, "runtime-tick-did-not-advance-with-protokit-bridge-installed");
expect(runtime.engine.n.goldrushExtractionLoop.snapshot().runId, "goldrush-custom-extraction-loop-missing-after-protokit-bridge");
expect(runtime.engine.n.goldrushProtoKitBridge.snapshot().customOwner === "engine.n.goldrushExtractionLoop", "bridge-custom-owner-mismatch");

const loop = runtime.engine.n.goldrushExtractionLoop.snapshot();
const mineSite = loop.mining.sites["mine-seam-01"];
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: mineSite.worldPosition.x, y: 0, z: mineSite.worldPosition.z },
});
let liveMine = null;
for (let index = 0; index < 8; index += 1) {
  liveMine = runtime.holdExtractionLoopMine({ dt: 0.3 });
  if (liveMine.complete) break;
}
expect(liveMine?.accepted && liveMine.complete, "live-runtime-mine-did-not-complete");
const afterLiveMine = runtime.snapshot().protoKitBridge.protoSnapshot;
expect(afterLiveMine.cargo.resourcesById.gold.value === liveMine.payout, "live-runtime-mine-not-reflected-in-protokit-cargo");
expect(afterLiveMine.route.completedIds.includes("mine-seam"), "live-runtime-mine-not-reflected-in-protokit-route");

const extractionSite = runtime.engine.n.goldrushExtractionLoop.snapshot().extraction.sites["rail-depot-extract-01"];
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: extractionSite.worldPosition.x, y: 0, z: extractionSite.worldPosition.z },
});
let liveCashout = null;
for (let index = 0; index < 12; index += 1) {
  liveCashout = runtime.holdExtractionLoopCashout({ dt: 0.3 });
  if (liveCashout.complete) break;
}
expect(liveCashout?.accepted && liveCashout.complete, "live-runtime-cashout-did-not-complete");
const afterLiveCashout = runtime.snapshot().protoKitBridge.protoSnapshot;
expect(afterLiveCashout.route.status === "completed", "live-runtime-cashout-not-reflected-in-protokit-route");
expect(afterLiveCashout.cargo.resourcesById.gold.value === 0, "live-runtime-cashout-not-reflected-in-protokit-cargo");

assert(failures.length === 0, `goldrush protokit bridge invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "goldrush-protokit-bridge-ready",
  installedProtoKits: initial.installedProtoKits.map((kit) => kit.id),
  descriptorCount: initial.descriptorCount,
  pickupGold: pickup.snapshot.cargo.resourcesById.gold.value,
  completedIds: mine.snapshot.route.completedIds,
  pressure: pressure.snapshot.pressure.channelsById["ambush-pressure"].value,
  remainingCargo: deliver.snapshot.cargo.resourcesById.gold.value,
  runtimeFrame: runtime.engine.clock.frame,
  liveRuntimeRouteStatus: afterLiveCashout.route.status,
}, null, 2));

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
