import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  playerGuidanceCueContract,
  playerGuidanceCueDomainPath,
  validatePlayerGuidanceCue,
} from "../../src/content/goldrushPlayerGuidanceCue.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

const loopApi = runtime.engine.n.goldrushExtractionLoop;
const actionSurfaceApi = runtime.engine.n.goldrushPlayerActionSurface;
const routeGuidanceApi = runtime.engine.n.goldrushPlayerRouteGuidance;
const cueApi = runtime.engine.n.goldrushPlayerGuidanceCue;

assert(cueApi, "missing engine.n.goldrushPlayerGuidanceCue");

let loop = loopApi.getState();
const mine = loop.mining.sites["mine-seam-01"];
assert(mine, "missing mine-seam-01");

const approachPlayer = createLocalPlayer({
  position: {
    x: mine.worldPosition.x + 9.5,
    y: mine.worldPosition.y,
    z: mine.worldPosition.z + 5.4,
  },
  yaw: -0.28,
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
routeGuidanceApi.update({
  objectInteraction: miningObjectInteraction,
  localPlayer: approachPlayer,
});
let cue = cueApi.update({ localPlayer: approachPlayer });
assertBase(cue);
assert(cue.visible === true, "approach cue should be visible");
assert(cue.noDebugOverlay === true, "cue should be independent of debug overlay");
assert(cue.target.kind === "resource", "approach cue should target a resource");
assert(cue.cue.role === "world-route-direction", "out-of-range resource cue should be a direction cue");
assert(cue.cue.shape === "claim-route-arrow", "resource direction should use claim-route-arrow shape");
assert(cue.readability.noColorOnlyCriticalInfo === true, "cue must not depend on color only");
assert(cue.cue.suggestedKeys.includes("w"), "cue should preserve camera-relative forward movement");

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
routeGuidanceApi.update({
  objectInteraction: miningInRange,
  localPlayer: minePlayer,
});
cue = cueApi.update({ localPlayer: minePlayer });
assertBase(cue);
assert(cue.target.kind === "resource", "in-range cue should still target the resource");
assert(cue.cue.role === "hold-readiness", "in-range cue should switch to hold-readiness");
assert(cue.cue.primaryInput === "E", "hold-ready cue should expose the interaction input");

let mined = null;
for (let index = 0; index < 8; index += 1) {
  mined = runtime.tickExtractionLoop({
    localPlayer: minePlayer,
    input: { interact: true, holdActive: true },
    dt: 0.3,
  });
  if ((mined.player?.cargo?.goldDust ?? 0) > 0) break;
}
assert((mined?.player?.cargo?.goldDust ?? 0) > 0, "input-driven mining should create cargo before cashout cue");

loop = loopApi.getState();
const extraction = loop.extraction.sites["rail-depot-extract-01"];
assert(extraction, "missing rail-depot-extract-01");
const cashoutApproachPlayer = createLocalPlayer({
  position: {
    x: extraction.worldPosition.x + 12,
    y: extraction.worldPosition.y,
    z: extraction.worldPosition.z + 8,
  },
  yaw: 0.35,
});
actionSurfaceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutApproachPlayer,
});
routeGuidanceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutApproachPlayer,
});
cue = cueApi.update({ localPlayer: cashoutApproachPlayer });
assertBase(cue);
assert(cue.target.kind === "cashout", "after cargo cue should target cashout");
assert(cue.cue.shape === "depot-route-arrow", "cashout route should use depot-route-arrow shape");
assert(cue.target.distanceBand === "near" || cue.target.distanceBand === "mid", "cashout cue should expose a distance band");

const cashoutPlayer = createLocalPlayer({
  position: extraction.worldPosition,
  yaw: 0,
});
runtime.tickExtractionLoop({
  localPlayer: cashoutPlayer,
  input: {},
  dt: 0.05,
});
actionSurfaceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutPlayer,
});
routeGuidanceApi.update({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutPlayer,
});
cue = cueApi.update({ localPlayer: cashoutPlayer });
assertBase(cue);
assert(cue.target.kind === "cashout", "cashout hold cue should target cashout");
assert(cue.cue.role === "hold-readiness", "cashout in-range cue should switch to hold-readiness");
assert(cue.cue.shape === "depot-hold-ring", "cashout hold cue should use depot-hold-ring shape");
assert(cue.action.nextAction === "hold-cashout" || cue.action.nextAction === "keep-holding-cashout", "cashout cue action should expose hold state");

console.log(JSON.stringify({
  status: "player-guidance-cue-ready",
  contract: cue.contract,
  domainPath: cue.domainPath,
  target: cue.target,
  cue: cue.cue,
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

function assertBase(cue) {
  assert(cue.contract === playerGuidanceCueContract, "cue contract should match");
  assert(cue.domainPath === playerGuidanceCueDomainPath, "cue domain path should match");
  assert(cue.consumes.includes("n:goldrush:player-route-guidance"), "cue should consume route guidance");
  assert(cue.consumes.includes("n:goldrush:player-action-surface"), "cue should consume player action surface");
  assert(validatePlayerGuidanceCue(cue).passed, `cue should validate: ${validatePlayerGuidanceCue(cue).failures.join(", ")}`);
  assert(cue.readability.clutterPolicy === "one-active-world-cue", "cue should keep one active world marker");
}

function distance2D(a, b) {
  return Math.hypot(Number(a.x ?? 0) - Number(b.x ?? 0), Number(a.z ?? 0) - Number(b.z ?? 0));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
