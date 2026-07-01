import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  combatRouteGuidanceContract,
  combatRouteGuidanceDomainPath,
  validateCombatRouteGuidance,
} from "../../src/content/goldrushCombatRouteGuidance.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

const loopApi = runtime.engine.n.goldrushExtractionLoop;
const actionSurfaceApi = runtime.engine.n.goldrushPlayerActionSurface;
const routeApi = runtime.engine.n.goldrushCombatRouteGuidance;
const combatReadinessApi = runtime.engine.n.goldrushCombatLoopReadiness;

assert(routeApi, "missing engine.n.goldrushCombatRouteGuidance");

let loop = loopApi.getState();
let route = routeApi.update({
  localPlayer: createLocalPlayer({ position: loop.player.position, yaw: 0 }),
  renderer: createRendererEvidence(loop),
});
assertBase(route);
assert(route.routeStatus !== "resolved", "fresh route should not resolve before cargo and threat pressure");

const mine = loop.mining.sites["mine-seam-01"];
assert(mine, "missing mine-seam-01");
const minePlayer = createLocalPlayer({
  position: mine.worldPosition,
  yaw: 0,
});
loopApi.setPlayerPose({
  position: minePlayer.position,
  heading: minePlayer.heading,
});
for (let index = 0; index < 8; index += 1) {
  const mined = loopApi.holdMine({ siteId: mine.id, dt: 0.3 });
  if (mined?.complete) break;
}
loop = loopApi.tick({
  localPlayer: minePlayer,
  input: { aim: false },
  dt: 0.1,
});
syncActionSurface(minePlayer);
combatReadinessApi.update({ renderer: createRendererEvidence(loop) });
route = routeApi.update({
  localPlayer: minePlayer,
  renderer: createRendererEvidence(loop),
});

assertBase(route);
assert(stage(route, "cargo-to-threat-zone").status === "resolved", "carried gold should expose a combat route");
assert(stage(route, "threat-zone-activation").status === "resolved", "carried gold should activate nearby threat pressure");
assert(route.threatTarget?.kind === "threat-zone", "route should expose a threat-zone target");
assert(route.coverTarget?.kind === "cover", "route should expose a cover target");
assert(route.target?.kind === "cover", "active combat route should target readable cover");
assert(route.cameraRelativeInput.keys.includes("w"), "out-of-range cover route should expose forward camera-relative input");

const coverPlayer = createLocalPlayer({
  position: route.coverTarget.position,
  yaw: route.cameraRelativeInput.desiredYaw ?? 0,
});
loop = loopApi.tick({
  localPlayer: coverPlayer,
  input: { aim: true, cover: true, peek: route.combatInputHint.peek },
  dt: 0.1,
});
syncActionSurface(coverPlayer);
combatReadinessApi.update({ renderer: createRendererEvidence(loop) });
route = routeApi.update({
  localPlayer: coverPlayer,
  renderer: createRendererEvidence(loop),
});

assertBase(route);
assert(stage(route, "threat-to-cover-route").status === "resolved", "cover route should resolve after cover engagement");
assert(stage(route, "cover-action-readiness").status === "resolved", "cover action readiness should resolve after engagement");
assert(stage(route, "cover-engagement").status === "resolved", "cover engagement should resolve through tick input");
assert(route.combatInputHint.cover === true, "engaged cover should keep cover input readable");
assert(route.nextAction === "peek-and-fire-from-cover" || route.nextAction === "hold-cover-and-watch-threat", `unexpected next action ${route.nextAction}`);

loop = loopApi.tick({
  localPlayer: coverPlayer,
  input: { aim: true, cover: true, fire: true, peek: route.combatInputHint.peek },
  dt: 0.1,
});
syncActionSurface(coverPlayer);
combatReadinessApi.update({ renderer: createRendererEvidence(loop) });
route = routeApi.update({
  localPlayer: coverPlayer,
  renderer: createRendererEvidence(loop),
});

assertBase(route);
assert(stage(route, "combat-receipt-ready").status === "resolved", "firing from cover should create route combat receipt readiness");
assert(route.matrix.resolvedCount === 6, `all route stages should resolve, got ${route.matrix.resolvedCount}`);
assert(route.routeStatus === "resolved", `combat route should resolve, got ${route.routeStatus}`);
assert(route.proofPolicy.cameraRelativeCombatRoute === true, "route proof should keep camera-relative movement policy");
assert(route.proofPolicy.coverCounterplayRouted === true, "route proof should expose cover counterplay routing");
assert(route.helperDebt.length === 0, "validator should not report helper debt");
assert(routeApi.validate().passed, "engine combat route guidance validator should pass");

console.log(JSON.stringify({
  status: "combat-route-guidance-ready",
  contract: route.contract,
  domainPath: route.domainPath,
  routeStatus: route.routeStatus,
  resolvedLegs: route.matrix.resolvedLegs,
  nextAction: route.nextAction,
  target: route.target,
}, null, 2));

function syncActionSurface(localPlayer) {
  return actionSurfaceApi.update({
    objectInteraction: createEmptyObjectInteraction(),
    localPlayer,
  });
}

function createRendererEvidence(loopState) {
  const readability = loopState?.combat?.readability ?? {};
  const markers = loopState?.worldSpaceMarkers ?? [];
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

function stage(route, id) {
  return route.matrix.legs.find((entry) => entry.id === id) ?? {};
}

function assertBase(route) {
  assert(route.contract === combatRouteGuidanceContract, "combat route contract should match");
  assert(route.domainPath === combatRouteGuidanceDomainPath, "combat route domain path should match");
  assert(route.consumes.includes("n:goldrush:ambush-pressure"), "combat route should consume ambush pressure");
  assert(route.consumes.includes("n:control:character-movement"), "combat route should consume character movement");
  assert(Array.isArray(route.matrix.legs) && route.matrix.legs.length === 6, "combat route should expose six route legs");
  assert(validateCombatRouteGuidance(route).passed, `combat route should validate: ${validateCombatRouteGuidance(route).failures.join(", ")}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
