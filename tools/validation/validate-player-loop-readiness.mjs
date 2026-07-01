import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  playerLoopReadinessContract,
  playerLoopReadinessDomainPath,
  validatePlayerLoopReadiness,
} from "../../src/content/goldrushPlayerLoopReadiness.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

const loopApi = runtime.engine.n.goldrushExtractionLoop;
const actionSurfaceApi = runtime.engine.n.goldrushPlayerActionSurface;
const routeApi = runtime.engine.n.goldrushPlayerDrivenExtractionRoute;
const guidanceApi = runtime.engine.n.goldrushPlayerRouteGuidance;
const cueApi = runtime.engine.n.goldrushPlayerGuidanceCue;
const readinessApi = runtime.engine.n.goldrushPlayerLoopReadiness;

assert(readinessApi, "missing engine.n.goldrushPlayerLoopReadiness");

let loop = loopApi.getState();
const mine = loop.mining.sites["mine-seam-01"];
assert(mine, "missing mine-seam-01");

const approachPlayer = createLocalPlayer({
  position: {
    x: mine.worldPosition.x + 8.6,
    y: mine.worldPosition.y,
    z: mine.worldPosition.z + 4.2,
  },
  yaw: -0.25,
});
let objectInteraction = createMiningObjectInteraction({
  mine,
  position: mine.worldPosition,
  distance: distance2D(approachPlayer.position, mine.worldPosition),
  inRange: false,
});
syncPlayerFacingKits({ objectInteraction, localPlayer: approachPlayer });
let readiness = readinessApi.update({
  renderer: createRendererEvidence({ cue: cueApi.snapshot(), cargo: loop.player?.cargo }),
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assertBase(readiness);
assert(stage(readiness, "resource-direction-cue").status === "resolved", "resource direction cue should resolve before mining");
assert(readiness.proofPolicy.currentObjectiveVisible === true, "current objective should be visible before mining");

const minePlayer = createLocalPlayer({
  position: mine.worldPosition,
  yaw: 0,
});
objectInteraction = createMiningObjectInteraction({
  mine,
  position: mine.worldPosition,
  distance: 0.4,
  inRange: true,
});
syncPlayerFacingKits({ objectInteraction, localPlayer: minePlayer });
readiness = readinessApi.update({
  renderer: createRendererEvidence({ cue: cueApi.snapshot(), cargo: loopApi.getState().player?.cargo }),
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assert(stage(readiness, "mine-hold-readiness").status === "ready", "mine hold should become ready in range");

let mined = null;
for (let index = 0; index < 8; index += 1) {
  mined = runtime.tickExtractionLoop({
    localPlayer: minePlayer,
    input: { interact: true, holdActive: true },
    dt: 0.3,
  });
  if ((mined.player?.cargo?.goldDust ?? 0) > 0) break;
}
assert((mined?.player?.cargo?.goldDust ?? 0) > 0, "input-driven interact ticks should create carried cargo");
syncPlayerFacingKits({ objectInteraction, localPlayer: minePlayer });
readiness = readinessApi.update({
  renderer: createRendererEvidence({ cue: cueApi.snapshot(), cargo: mined.player?.cargo }),
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assert(stage(readiness, "mine-hold-readiness").status === "resolved", "mine hold should resolve after mining");
assert(stage(readiness, "cargo-visual-carry").status === "resolved", "cargo visual should resolve when renderer evidence is present");
assert(stage(readiness, "cashout-direction-cue").status === "resolved", "cashout direction cue should resolve after cargo");

loop = loopApi.getState();
const extraction = loop.extraction.sites["rail-depot-extract-01"];
assert(extraction, "missing rail-depot-extract-01");
const cashoutPlayer = createLocalPlayer({
  position: extraction.worldPosition,
  yaw: 0,
});
syncPlayerFacingKits({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutPlayer,
});
readiness = readinessApi.update({
  renderer: createRendererEvidence({ cue: cueApi.snapshot(), cargo: loopApi.getState().player?.cargo }),
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assert(stage(readiness, "cashout-hold-readiness").status === "ready", "cashout hold should be ready at depot");

for (let index = 0; index < 14; index += 1) {
  loop = runtime.tickExtractionLoop({
    localPlayer: cashoutPlayer,
    input: { interact: true, holdActive: true },
    dt: 0.35,
  });
  syncPlayerFacingKits({
    objectInteraction: createEmptyObjectInteraction(),
    localPlayer: cashoutPlayer,
  });
  if (loop.receipt?.extracted) break;
}
assert(loop.receipt?.extracted === true, "input-driven cashout should create extraction receipt");
runtime.endMatch({ reason: "player-loop-readiness-validator" });
syncPlayerFacingKits({
  objectInteraction: createEmptyObjectInteraction(),
  localPlayer: cashoutPlayer,
});

readiness = readinessApi.update({
  renderer: createRendererEvidence({ cue: cueApi.snapshot(), cargo: loopApi.getState().player?.cargo }),
  proofTelemetry: {
    inputDrivenInteract: true,
    usedHelpers: [],
  },
});
assertBase(readiness);
assert(readiness.matrix.routeStatus === "resolved", `loop readiness should resolve, got ${readiness.matrix.routeStatus}`);
assert(readiness.matrix.resolvedCount === 6, "all loop readiness stages should resolve");
assert(readiness.helperDebt.length === 0, "validator should not use helper debt");
assert(readiness.proofPolicy.noDirectCompletionHelper === true, "direct completion helper should be absent");
assert(readiness.proofPolicy.noPlacementHelperRequired === true, "placement helpers should be absent");
assert(validatePlayerLoopReadiness(readiness).passed, "content validator should pass final readiness");
assert(readinessApi.validate().passed, "engine readiness kit validator should pass");

console.log(JSON.stringify({
  status: "player-loop-readiness-ready",
  contract: readiness.contract,
  domainPath: readiness.domainPath,
  routeStatus: readiness.matrix.routeStatus,
  resolvedStages: readiness.matrix.resolvedStages,
  proofPolicy: readiness.proofPolicy,
}, null, 2));

function syncPlayerFacingKits({ objectInteraction, localPlayer }) {
  actionSurfaceApi.update({ objectInteraction, localPlayer });
  routeApi.update({
    objectInteraction,
    localPlayer,
    proofTelemetry: {
      inputDrivenInteract: true,
      usedHelpers: [],
    },
  });
  guidanceApi.update({ objectInteraction, localPlayer });
  cueApi.update({ localPlayer });
}

function createRendererEvidence({ cue, cargo }) {
  const amount = Number(cargo?.goldDust ?? cargo?.totalValue ?? 0);
  return {
    procedural: {
      gameplay: {
        playerGuidanceCue: {
          contract: "goldrush-player-guidance-cue-visual-v1",
          visible: Boolean(cue?.visible),
          target: cue?.target ? {
            kind: cue.target.kind,
            id: cue.target.id,
            distanceBand: cue.target.distanceBand,
          } : null,
          cue: cue?.cue ? {
            role: cue.cue.role,
            shape: cue.cue.shape,
            primaryInput: cue.cue.primaryInput,
          } : null,
        },
      },
      playerRig: {
        cargoVisual: {
          contract: cargo?.visual?.contract ?? "goldrush-carried-cargo-visual-v1",
          visible: amount > 0,
          amount,
          visibleNuggetCount: amount > 0 ? 3 : 0,
          domainPath: "n:goldrush:gold-carrying",
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

function stage(readiness, id) {
  return readiness.matrix.stages.find((entry) => entry.id === id) ?? {};
}

function assertBase(readiness) {
  assert(readiness.contract === playerLoopReadinessContract, "readiness contract should match");
  assert(readiness.domainPath === playerLoopReadinessDomainPath, "readiness domain path should match");
  assert(readiness.consumes.includes("n:goldrush:player-guidance-cue"), "readiness should consume player guidance cue");
  assert(readiness.consumes.includes("n:match:results"), "readiness should consume match results");
  assert(Array.isArray(readiness.matrix.stages) && readiness.matrix.stages.length === 6, "readiness should expose six stage rows");
  assert(validatePlayerLoopReadiness(readiness).passed, `readiness should validate: ${validatePlayerLoopReadiness(readiness).failures.join(", ")}`);
}

function distance2D(a, b) {
  return Math.hypot(Number(a.x ?? 0) - Number(b.x ?? 0), Number(a.z ?? 0) - Number(b.z ?? 0));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
