import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  combatLoopReadinessContract,
  combatLoopReadinessDomainPath,
  validateCombatLoopReadiness,
} from "../../src/content/goldrushCombatLoopReadiness.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });
runtime.engine.n.goldrushFrontierConditions.setCondition({
  conditionId: "goldrush.condition.high-fever-seam",
  reason: "combat-loop-readiness-validator",
});

const loopApi = runtime.engine.n.goldrushExtractionLoop;
const actionSurfaceApi = runtime.engine.n.goldrushPlayerActionSurface;
const readinessApi = runtime.engine.n.goldrushCombatLoopReadiness;

assert(readinessApi, "missing engine.n.goldrushCombatLoopReadiness");

let loop = loopApi.getState();
let readiness = readinessApi.update({
  renderer: createRendererEvidence(loop),
  proofTelemetry: { usedHelpers: [] },
});
assertBase(readiness);
assert(readiness.matrix.combatStatus !== "resolved", `fresh combat loop should not be resolved, got ${readiness.matrix.combatStatus}`);
assert(readiness.matrix.resolvedCount < 6, "fresh combat loop should not resolve every stage");

const mine = loop.mining.sites["mine-seam-01"];
assert(mine, "missing mine-seam-01");
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: mine.worldPosition.x, y: 0, z: mine.worldPosition.z },
  heading: 0,
});

let mineReceipt = null;
for (let index = 0; index < 8; index += 1) {
  mineReceipt = loopApi.holdMine({ siteId: mine.id, dt: 0.3 });
  if (mineReceipt?.complete) break;
}
assert(mineReceipt?.accepted === true && mineReceipt?.complete === true, "validator should mine cargo before combat pressure");

const threatPlayer = createLocalPlayer({
  position: { x: -9.5, y: 0, z: -13.4 },
  yaw: 0,
});
loopApi.setPlayerPose({
  position: threatPlayer.position,
  heading: threatPlayer.heading,
});
loop = loopApi.setAim({ active: true });
syncActionSurface(threatPlayer);
readiness = readinessApi.update({
  renderer: createRendererEvidence(loop),
  proofTelemetry: { usedHelpers: [] },
});
assertBase(readiness);
assert(stage(readiness, "cargo-threat-activation").status === "resolved", "cargo threat activation should resolve after aim activates a readable ambush");
assert(stage(readiness, "threat-telegraph-readability").status === "resolved", "active ambush should expose readable telegraph before damage");
assert(stage(readiness, "cover-counterplay-readiness").status === "resolved", "active ambush should expose visible cover counterplay");

loop = loopApi.engageCover({ threatId: "claim-jumper-01" });
const engagedCoverId = loop.combat.cover.coverId;
syncActionSurface(threatPlayer);
readiness = readinessApi.update({
  renderer: createRendererEvidence(loop),
  proofTelemetry: { usedHelpers: [] },
});
assert(stage(readiness, "cover-engagement").status === "resolved", "cover engagement should resolve after engageCover");
assert(readiness.proofPolicy.coverCounterplayVisible === true, "cover counterplay should be visible in combat readiness");

const shot = loopApi.fire({});
assert(shot.accepted === true, "fire should create a combat shot receipt");
const damage = loopApi.takeDamage({ amount: 9, reason: "combat-loop-readiness-validator" });
assert(damage.receipt?.type === "player-damaged", "takeDamage should create a combat damage receipt");
loop = loopApi.getState();
syncActionSurface(threatPlayer);
readiness = readinessApi.update({
  renderer: createRendererEvidence(loop),
  proofTelemetry: { usedHelpers: [] },
});
assert(stage(readiness, "shot-damage-receipts").status === "resolved", "shot and damage receipts should resolve receipt stage");
assert(readiness.proofPolicy.receiptBackedCombat === true, "combat readiness should be receipt-backed");
for (let index = 0; index < 14; index += 1) {
  loopApi.tick({ input: {}, dt: 0.1 });
}

runtime.startFinalRush();
loop = loopApi.getState();
const extraction = loop.extraction.sites["rail-depot-extract-01"];
assert(extraction, "missing rail-depot-extract-01");
const cashoutPlayer = createLocalPlayer({
  position: { x: extraction.worldPosition.x, y: 0, z: extraction.worldPosition.z },
  yaw: 0,
});
loopApi.setAim({ active: false });
loopApi.setPlayerPose({
  position: cashoutPlayer.position,
  heading: cashoutPlayer.heading,
});
for (let index = 0; index < 30; index += 1) {
  loop = loopApi.holdExtraction({ siteId: extraction.id, dt: 0.35 });
  if (loop?.complete) break;
}
assert(loop?.complete === true, "validator should complete extraction after combat receipts");
runtime.endMatch({ reason: "combat-loop-readiness-validator" });
syncActionSurface(cashoutPlayer);

readiness = readinessApi.update({
  renderer: createRendererEvidence(loopApi.getState()),
  proofTelemetry: { usedHelpers: [] },
});
assertBase(readiness);
assert(readiness.matrix.combatStatus === "resolved", `combat readiness should resolve, got ${readiness.matrix.combatStatus}`);
assert(readiness.matrix.resolvedCount === 6, "all combat readiness stages should resolve");
assert(readiness.helperDebt.length === 0, "validator should not use helper debt");
assert(readiness.proofPolicy.multisensoryCriticalCues === true, "combat cues should be multisensory");
assert(readiness.proofPolicy.noColorOnlyCriticalInfo === true, "combat cues should not rely only on color");
assert(readiness.proofPolicy.resultBackedCombat === true, "combat readiness should be result-backed");
assert(validateCombatLoopReadiness(readiness).passed, "content validator should pass final combat readiness");
assert(readinessApi.validate().passed, "engine combat readiness kit validator should pass");

console.log(JSON.stringify({
  status: "combat-loop-readiness-ready",
  contract: readiness.contract,
  domainPath: readiness.domainPath,
  combatStatus: readiness.matrix.combatStatus,
  resolvedStages: readiness.matrix.resolvedStages,
  proofPolicy: readiness.proofPolicy,
}, null, 2));

function syncActionSurface(localPlayer) {
  return actionSurfaceApi.update({
    objectInteraction: createEmptyObjectInteraction(),
    localPlayer,
  });
}

function createRendererEvidence(loop) {
  const readability = loop?.combat?.readability ?? {};
  const markers = loop?.worldSpaceMarkers ?? [];
  const laneIds = Array.isArray(readability.activeLaneIds) ? readability.activeLaneIds : [];
  const coverIds = Array.isArray(readability.coverIds) ? readability.coverIds : [];
  const engagedCoverIds = markers.map((marker) => marker.engagedCoverId).filter(Boolean);
  return {
    procedural: {
      gameplay: {
        extractionLoopMarkers: {
          visualContract: readability.contract ?? "readable-threat-lanes-v1",
          coverContract: readability.coverContract ?? "readable-threat-cover-v1",
          laneIds,
          coverIds,
          engagedCoverIds,
        },
      },
    },
  };
}

function createLocalPlayer({ position, yaw = 0 }) {
  return {
    position,
    heading: yaw,
    look: {
      yaw,
      pitch: -0.08,
      movementRelativeToCamera: true,
    },
    inputModel: {
      id: "camera-relative-wasd",
      wasdFollowsCameraYaw: true,
    },
    ground: {
      grounded: true,
      height: Number(position.y ?? 0),
    },
    terrainCollider: {
      blocked: false,
    },
  };
}

function createEmptyObjectInteraction() {
  return {
    contract: "goldrush-object-interaction-host-v1",
    nearest: {
      contract: "goldrush-nearest-object-affordance-v1",
      domainPath: "n:gameplay:interaction-hold",
      selected: null,
      candidateCount: 0,
      candidates: [],
    },
    last: null,
  };
}

function stage(readiness, id) {
  return readiness.matrix.stages.find((entry) => entry.id === id);
}

function assertBase(readiness) {
  assert(readiness.contract === combatLoopReadinessContract, "readiness contract should match");
  assert(readiness.domainPath === combatLoopReadinessDomainPath, "readiness domain path should match");
  assert(readiness.consumes.includes("n:goldrush:ambush-pressure"), "readiness should consume ambush pressure");
  assert(readiness.consumes.includes("n:match:results"), "readiness should consume match results");
  assert(Array.isArray(readiness.matrix.stages) && readiness.matrix.stages.length === 6, "readiness should expose six stages");
  assert(validateCombatLoopReadiness(readiness).passed, `readiness should validate: ${validateCombatLoopReadiness(readiness).failures.join(", ")}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
