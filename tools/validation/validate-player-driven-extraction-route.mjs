import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  playerDrivenExtractionRouteContract,
  playerDrivenExtractionRouteDomainPath,
  validatePlayerDrivenExtractionRoute,
} from "../../src/content/goldrushPlayerDrivenExtractionRoute.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

const loopApi = runtime.engine.n.goldrushExtractionLoop;
const routeApi = runtime.engine.n.goldrushPlayerDrivenExtractionRoute;
assert(routeApi, "missing engine.n.goldrushPlayerDrivenExtractionRoute");

let loop = loopApi.getState();
const mine = loop.mining.sites["mine-seam-01"];
assert(mine, "missing mine-seam-01");

const minePlayer = createLocalPlayer({ position: mine.worldPosition, yaw: 0 });
const miningObjectInteraction = {
  contract: "goldrush-object-interaction-host-v1",
  nearest: {
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
        command: "tickExtractionLoop",
      },
    },
    candidateCount: 1,
    candidates: [],
  },
  last: null,
};

runtime.engine.n.goldrushPlayerActionSurface.update({
  objectInteraction: miningObjectInteraction,
  localPlayer: minePlayer,
});

let route = routeApi.update({
  objectInteraction: miningObjectInteraction,
  localPlayer: minePlayer,
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assertBase(route);
assert(stage(route, "resource-affordance").status === "ready", "gold object affordance should be ready before mining");
assert(stage(route, "mine-hold").playerDriven === true, "mine hold stage should be marked player-driven");

let mined = null;
for (let index = 0; index < 8; index += 1) {
  mined = runtime.tickExtractionLoop({
    localPlayer: minePlayer,
    input: { interact: true, holdActive: true },
    dt: 0.3,
  });
  if ((mined.player?.cargo?.goldDust ?? 0) > 0) break;
}
assert((mined?.player?.cargo?.goldDust ?? 0) > 0, "input-driven interact ticks should mine carried gold");

route = routeApi.update({
  objectInteraction: miningObjectInteraction,
  localPlayer: minePlayer,
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assertBase(route);
assert(stage(route, "mine-hold").status === "resolved", "mine-hold should resolve after input-driven mining");
assert(stage(route, "carry-gold").status === "resolved", "carry-gold should resolve after mining");
assert(!route.helperDebt.some((entry) => entry.id === "direct-extract-helper"), "validator route should not use direct extract helper");

loop = loopApi.getState();
const extraction = loop.extraction.sites["rail-depot-extract-01"];
assert(extraction, "missing rail-depot-extract-01");
const extractionPlayer = createLocalPlayer({
  position: {
    x: extraction.worldPosition.x,
    y: extraction.worldPosition.y,
    z: extraction.worldPosition.z,
  },
  yaw: 0,
});

for (let index = 0; index < 14; index += 1) {
  loop = runtime.tickExtractionLoop({
    localPlayer: extractionPlayer,
    input: { interact: true, holdActive: true },
    dt: 0.35,
  });
  runtime.engine.n.goldrushPlayerActionSurface.update({
    objectInteraction: {
      contract: "goldrush-object-interaction-host-v1",
      nearest: {
        contract: "goldrush-nearest-object-affordance-v1",
        domainPath: "n:gameplay:interaction-hold",
        selected: null,
        candidateCount: 0,
        candidates: [],
      },
      last: null,
    },
    localPlayer: extractionPlayer,
  });
  if (loop.receipt?.extracted) break;
}

assert(loop.receipt?.extracted === true, "input-driven interact ticks should complete extraction");
assert(runtime.engine.n.goldrushExtractionReceipts.snapshot().totals.extractedGold > 0, "extraction receipt ledger should contain extracted gold");
assert(runtime.engine.n.goldrushProtoKitBridge.snapshot().protoSnapshot.route.completedIds.includes("cashout-site"), "input-driven cashout should sync ProtoKit route completion");
runtime.endMatch({ reason: "player-driven-extraction-route-validator" });

route = routeApi.update({
  objectInteraction: {
    contract: "goldrush-object-interaction-host-v1",
    nearest: {
      contract: "goldrush-nearest-object-affordance-v1",
      domainPath: "n:gameplay:interaction-hold",
      selected: null,
      candidateCount: 0,
      candidates: [],
    },
    last: null,
  },
  localPlayer: extractionPlayer,
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assertBase(route);
assert(route.matrix.routeStatus === "resolved", `route should be resolved, got ${route.matrix.routeStatus}`);
assert(route.matrix.resolvedCount === 5, "all player-driven route stages should resolve");
assert(stage(route, "cashout-hold").status === "resolved", "cashout-hold should resolve from input ticks");
assert(stage(route, "receipt-results").status === "resolved", "results stage should resolve after receipt-backed finalization");
assert(route.matrix.playerDrivenStages.includes("cashout-hold"), "cashout hold should be marked player-driven");
assert(validatePlayerDrivenExtractionRoute(route).passed, "content validator should pass final route");
assert(routeApi.validate().passed, "engine route kit validator should pass");

console.log(JSON.stringify({
  status: "player-driven-extraction-route-ready",
  contract: route.contract,
  domainPath: route.domainPath,
  routeStatus: route.matrix.routeStatus,
  resolvedStages: route.matrix.resolvedStages,
  playerDrivenStages: route.matrix.playerDrivenStages,
  helperDebt: route.helperDebt,
}, null, 2));

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
  };
}

function stage(route, id) {
  return route.matrix.stages.find((entry) => entry.id === id) ?? {};
}

function assertBase(route) {
  assert(route.contract === playerDrivenExtractionRouteContract, "route contract should match");
  assert(route.domainPath === playerDrivenExtractionRouteDomainPath, "route domain path should match");
  assert(route.consumes.includes("n:goldrush:cashout-sites"), "route should consume cashout-sites");
  assert(Array.isArray(route.matrix.stages) && route.matrix.stages.length === 5, "route should expose five stage rows");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
