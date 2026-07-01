import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  playerRouteGuidanceContract,
  playerRouteGuidanceDomainPath,
  validatePlayerRouteGuidance,
} from "../../src/content/goldrushPlayerRouteGuidance.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

const loopApi = runtime.engine.n.goldrushExtractionLoop;
const actionSurfaceApi = runtime.engine.n.goldrushPlayerActionSurface;
const guidanceApi = runtime.engine.n.goldrushPlayerRouteGuidance;

assert(guidanceApi, "missing engine.n.goldrushPlayerRouteGuidance");

let loop = loopApi.getState();
const mine = loop.mining.sites["mine-seam-01"];
assert(mine, "missing mine-seam-01");

const approachPlayer = createLocalPlayer({
  position: {
    x: mine.worldPosition.x + 7.2,
    y: mine.worldPosition.y,
    z: mine.worldPosition.z + 4.4,
  },
  yaw: -0.25,
});
const miningObjectInteraction = createMiningObjectInteraction({
  mine,
  position: mine.worldPosition,
  distance: distance2D(approachPlayer.position, mine.worldPosition),
  inRange: false,
});

actionSurfaceApi.update({
  objectInteraction: miningObjectInteraction,
  localPlayer: approachPlayer,
});

let guidance = guidanceApi.update({
  objectInteraction: miningObjectInteraction,
  localPlayer: approachPlayer,
});

assertBase(guidance);
assert(guidance.currentLegId === "spawn-to-resource", `expected spawn-to-resource, got ${guidance.currentLegId}`);
assert(guidance.target?.kind === "resource", "route guidance should target a resource before mining");
assert(guidance.cameraRelativeInput.mode === "camera-relative-walk", "resource approach should expose camera-relative walk input");
assert(guidance.cameraRelativeInput.keys.includes("w"), "resource approach should move forward");
assert(stage(guidance, "spawn-to-resource").status === "active", "resource approach leg should be active while out of range");

const minePlayer = createLocalPlayer({
  position: mine.worldPosition,
  yaw: 0,
});
const miningInRange = createMiningObjectInteraction({
  mine,
  position: mine.worldPosition,
  distance: 0.4,
  inRange: true,
});

actionSurfaceApi.update({
  objectInteraction: miningInRange,
  localPlayer: minePlayer,
});

guidance = guidanceApi.update({
  objectInteraction: miningInRange,
  localPlayer: minePlayer,
});
assert(stage(guidance, "spawn-to-resource").status === "ready", "resource approach should be ready when in range");
assert(guidance.nextAction === "hold-mine", "in-range resource guidance should ask for mine hold");

let mined = null;
for (let index = 0; index < 8; index += 1) {
  mined = runtime.tickExtractionLoop({
    localPlayer: minePlayer,
    input: { interact: true, holdActive: true },
    dt: 0.3,
  });
  if ((mined.player?.cargo?.goldDust ?? 0) > 0) break;
}
assert((mined?.player?.cargo?.goldDust ?? 0) > 0, "input-driven mining should create cargo before cashout guidance");

loop = loopApi.getState();
const extraction = loop.extraction.sites["rail-depot-extract-01"];
assert(extraction, "missing rail-depot-extract-01");
const cashoutApproachPlayer = createLocalPlayer({
  position: {
    x: extraction.worldPosition.x + 10,
    y: extraction.worldPosition.y,
    z: extraction.worldPosition.z + 8,
  },
  yaw: 0.4,
});

actionSurfaceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutApproachPlayer,
});
guidance = guidanceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutApproachPlayer,
});

assertBase(guidance);
assert(guidance.currentLegId === "resource-to-cashout", `expected resource-to-cashout, got ${guidance.currentLegId}`);
assert(guidance.target?.kind === "cashout", "route guidance should target cashout after mining");
assert(guidance.target.id === extraction.id, "route guidance should choose the rail depot cashout");
assert(guidance.nextAction === "walk-to-cashout", "cashout guidance should ask the player to walk");
assert(guidance.cameraRelativeInput.keys.includes("w"), "cashout route should move forward");

const cashoutPlayer = createLocalPlayer({
  position: extraction.worldPosition,
  yaw: 0,
});

for (let index = 0; index < 14; index += 1) {
  loop = runtime.tickExtractionLoop({
    localPlayer: cashoutPlayer,
    input: { interact: true, holdActive: true },
    dt: 0.35,
  });
  if (loop.receipt?.extracted) break;
}
assert(loop.receipt?.extracted === true, "input-driven cashout should create an extraction receipt");
runtime.endMatch({ reason: "player-route-guidance-validator" });

guidance = guidanceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutPlayer,
});

assertBase(guidance);
assert(guidance.routeStatus === "resolved", `route guidance should resolve after results, got ${guidance.routeStatus}`);
assert(guidance.matrix.resolvedCount === 4, "all guidance legs should resolve");
assert(validatePlayerRouteGuidance(guidance).passed, "content validator should pass final guidance");
assert(guidanceApi.validate().passed, "engine guidance kit validator should pass");

console.log(JSON.stringify({
  status: "player-route-guidance-ready",
  contract: guidance.contract,
  domainPath: guidance.domainPath,
  routeStatus: guidance.routeStatus,
  resolvedLegs: guidance.matrix.resolvedLegs,
  target: guidance.target,
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
    terrainCollider: {
      blocked: false,
    },
  };
}

function createMiningObjectInteraction({ mine, position, distance, inRange }) {
  return {
    contract: "goldrush-object-interaction-host-v1",
    nearest: {
      contract: "goldrush-nearest-object-affordance-v1",
      domainPath: "n:gameplay:interaction-hold",
      selected: inRange ? {
        kitId: "goldrush.micro.gold.seam-vein.validator",
        action: "mine-gold",
        prompt: "Hold to mine gold",
        inRange,
        allowedDistance: 3.2,
        distance,
        position,
        target: {
          type: "mining-site",
          siteId: mine.id,
          command: "tickExtractionLoop",
        },
        placement: {
          source: "n:world:placement-raycast",
        },
      } : null,
      candidateCount: 1,
      candidates: [{
        kitId: "goldrush.micro.gold.seam-vein.validator",
        action: "mine-gold",
        prompt: "Hold to mine gold",
        inRange,
        allowedDistance: 3.2,
        distance,
        position,
        target: {
          type: "mining-site",
          siteId: mine.id,
          command: "tickExtractionLoop",
        },
        placement: {
          source: "n:world:placement-raycast",
        },
      }],
    },
    last: null,
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

function stage(guidance, id) {
  return guidance.matrix.legs.find((entry) => entry.id === id) ?? {};
}

function assertBase(guidance) {
  assert(guidance.contract === playerRouteGuidanceContract, "guidance contract should match");
  assert(guidance.domainPath === playerRouteGuidanceDomainPath, "guidance domain path should match");
  assert(guidance.consumes.includes("n:control:character-movement"), "guidance should consume character movement");
  assert(Array.isArray(guidance.matrix.legs) && guidance.matrix.legs.length === 4, "guidance should expose four route legs");
  assert(validatePlayerRouteGuidance(guidance).passed, `guidance should validate: ${validatePlayerRouteGuidance(guidance).failures.join(", ")}`);
}

function distance2D(a, b) {
  return Math.hypot(Number(a.x ?? 0) - Number(b.x ?? 0), Number(a.z ?? 0) - Number(b.z ?? 0));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
