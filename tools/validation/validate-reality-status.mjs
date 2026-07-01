import { readFileSync } from "node:fs";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import {
  createGoldRushRealityStatus,
  validateGoldRushRealityStatus,
} from "../../src/content/goldrushRealityStatus.js";
import { assetRegistry } from "../../src/content/assetRegistry.js";

const orchestrator = createNetworkOrchestrator();
const runtime = createGoldRushRuntime({ orchestrator });
runtime.generateMatch({ players: 72, phase: "prospect" });

const runtimeStatus = runtime.engine.n.goldrushReality.snapshot({
  sceneKitLoader: {
    activationReceipts: [{ id: "validation-scene-receipt" }],
    loadedModules: ["procedural-terrain"],
  },
});
const validation = validateGoldRushRealityStatus(runtimeStatus);

assert(validation.passed, `reality status invalid: ${validation.failures.join(", ")}`);
assert(runtimeStatus.summary.placeholderSlots >= 30, "placeholder slots should remain visible until cloud promotion");
assert(runtimeStatus.summary.promotedAudio === 0, "actual legacy audio should not be claimed as promoted yet");
assert(runtimeStatus.summary.blockedCloud >= 2, "cloud-blocked asset/audio domains should be explicit");
assert(findDomain(runtimeStatus, "legacy-assets").status === "blocked-cloud-import", "legacy assets must be marked cloud-blocked");
assert(findDomain(runtimeStatus, "audio-music").status === "blocked-cloud-import", "audio must be marked cloud-blocked");
assert(findDomain(runtimeStatus, "character-rig").status === "prototype", "procedural character must be marked prototype");
assert(findDomain(runtimeStatus, "animation-clips").status === "prototype", "animation clips must be marked prototype");
assert(findDomain(runtimeStatus, "mining-gold").currentTruth.includes("cargo visual"), "mining prototype truth should acknowledge the local cargo visual contract");
assert(findDomain(runtimeStatus, "network-rooms").status === "real-local", "network room orchestration should be real local");
assert(findDomain(runtimeStatus, "terrain-collider").status === "real-local", "terrain collider should be real local");
assert(findDomain(runtimeStatus, "scene-kit-loading").status === "real-local", "scene-kit loading proof should be real when receipts are supplied");

const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
assert(appSource.includes("realityStatus"), "app state should expose the reality status");
assert(appSource.includes("goldrushReality.validate"), "app state should expose reality validation");

const directStatus = createGoldRushRealityStatus({
  assetRegistry,
  legacyReadiness: runtime.engine.n.goldrushLegacySources.readiness(),
  network: runtime.engine.n.goldrushNetwork.snapshot(),
  installOrder: runtime.engine.game?.installOrder ?? [],
});
assert(findDomain(directStatus, "scene-kit-loading").status === "prototype", "scene-kit proof should not be real without activation receipts");

console.log(JSON.stringify({
  status: "reality-status-ready",
  summary: runtimeStatus.summary,
  fakeOrBlocked: runtimeStatus.domains
    .filter((domain) => domain.status !== "real-local")
    .map((domain) => ({ id: domain.id, status: domain.status })),
}, null, 2));

function findDomain(status, id) {
  const domain = status.domains.find((entry) => entry.id === id);
  assert(domain, `missing domain ${id}`);
  return domain;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
