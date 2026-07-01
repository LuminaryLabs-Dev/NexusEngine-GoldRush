import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  playerActionSurfaceContract,
  playerActionSurfaceDomainPath,
} from "../../src/content/goldrushPlayerActionSurface.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

let loop = runtime.engine.n.goldrushExtractionLoop.getState();
const mine = loop.mining.sites["mine-seam-01"];
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: mine.worldPosition,
  heading: 0,
});

const miningSelection = {
  contract: "goldrush-nearest-object-affordance-v1",
  domainPath: "n:gameplay:interaction-hold",
  selected: {
    kitId: "goldrush.micro.gold.seam-vein.validator",
    action: "mine-gold",
    prompt: "Mine",
    inRange: true,
    target: {
      type: "mining-site",
      siteId: mine.id,
      command: "holdMine",
    },
  },
  candidateCount: 1,
  candidates: [],
};

let surface = runtime.engine.n.goldrushPlayerActionSurface.update({
  localPlayer: { position: mine.worldPosition, heading: 0, look: { yaw: 0 }, ground: { grounded: true } },
  objectInteraction: {
    contract: "goldrush-object-interaction-host-v1",
    nearest: miningSelection,
    last: null,
  },
});
assertBase(surface);
assert(surface.primaryAction.action === "mine-gold", "near mineable gold should make mining the primary action");
assert(surface.primaryAction.nextAction === "hold-mine", "mining action should instruct hold-mine");
assert(surface.primaryAction.domainPath === "n:goldrush:mine-hold-action", "mining action should stay in mine-hold domain");

let mineReceipt = null;
for (let index = 0; index < 6; index += 1) {
  mineReceipt = runtime.engine.n.goldrushExtractionLoop.holdMine({ siteId: mine.id, dt: 0.3 });
  if (mineReceipt.complete) break;
}
assert(mineReceipt?.complete === true, "validator should mine cargo before cashout surface proof");

loop = runtime.engine.n.goldrushExtractionLoop.getState();
const extraction = loop.extraction.sites["rail-depot-extract-01"];
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: extraction.worldPosition,
  heading: 0,
});
runtime.engine.n.goldrushExtractionLoop.holdExtraction({ siteId: extraction.id, dt: 0.3 });
surface = runtime.engine.n.goldrushPlayerActionSurface.update({
  localPlayer: { position: extraction.worldPosition, heading: 0, look: { yaw: 0 }, ground: { grounded: true } },
  objectInteraction: {
    contract: "goldrush-object-interaction-host-v1",
    nearest: { contract: "goldrush-nearest-object-affordance-v1", domainPath: "n:gameplay:interaction-hold", selected: null, candidateCount: 0, candidates: [] },
    last: null,
  },
});
assertBase(surface);
assert(surface.primaryAction.action === "cashout-gold", "cashout should become primary while holding in the depot");
assert(surface.primaryAction.nextAction === "keep-holding-cashout", "active cashout should tell the player to keep holding");
assert(surface.primaryAction.hold.ratio > 0, "cashout primary action should expose hold progress");
assert(surface.primaryAction.domainPath === "n:goldrush:cashout-sites", "cashout action should stay in cashout domain");

runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: -9.5, y: 0, z: -13.4 },
  heading: 0,
});
runtime.engine.n.goldrushExtractionLoop.setAim({ active: true });
runtime.engine.n.goldrushExtractionLoop.engageCover({ threatId: "claim-jumper-01" });
surface = runtime.engine.n.goldrushPlayerActionSurface.update({
  localPlayer: { position: { x: -9.5, y: 0, z: -13.4 }, heading: 0, look: { yaw: 0 }, ground: { grounded: true } },
  objectInteraction: {
    contract: "goldrush-object-interaction-host-v1",
    nearest: { contract: "goldrush-nearest-object-affordance-v1", domainPath: "n:gameplay:interaction-hold", selected: null, candidateCount: 0, candidates: [] },
    last: null,
  },
});
assertBase(surface);
assert(surface.primaryAction.action === "hold-cover", "engaged combat cover should become the primary action");
assert(surface.primaryAction.domainPath === "n:goldrush:ambush-pressure", "combat action should stay in ambush-pressure domain");
assert(surface.risk.activeThreatCount > 0, "surface should expose active threat risk");
assert(runtime.engine.n.goldrushPlayerActionSurface.validate().passed, "engine kit validator should pass");

console.log(JSON.stringify({
  status: "player-action-surface-ready",
  contract: surface.contract,
  domainPath: surface.domainPath,
  primaryAction: surface.primaryAction.action,
  availableActions: surface.availableActions.length,
}, null, 2));

function assertBase(surface) {
  assert(surface.contract === playerActionSurfaceContract, "surface contract should match");
  assert(surface.domainPath === playerActionSurfaceDomainPath, "surface domain should match");
  assert(surface.consumes.includes("n:gameplay:interaction-hold"), "surface should consume interaction-hold");
  assert(surface.consumes.includes("n:gameplay:extraction"), "surface should consume extraction");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
