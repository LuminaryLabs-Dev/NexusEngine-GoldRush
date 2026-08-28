import { v002KitRegistry } from "../../src/kits/v0.0.2/registry.js";
import {
  createTrainRouteKit,
  sampleTrainRoute,
} from "../../src/kits/v0.0.2/goldrush/train-route/index.js";
import {
  createTrainBoardingCueKit,
  resolveTrainBoardingCueState,
  trainBoardingAnchor,
} from "../../src/kits/v0.0.2/goldrush/train-boarding-cue/index.js";
import { createTrainRideAttachKit, resolveTrainRideAttachment } from "../../src/kits/v0.0.2/goldrush/train-ride-attach/index.js";
import { createTrainDepartureHandoffKit, resolveTrainDepartureHandoffState } from "../../src/kits/v0.0.2/goldrush/train-departure-handoff/index.js";

const routeKit = v002KitRegistry.find((entry) => entry.domainPath === "n:goldrush:train-route");
const cueKit = v002KitRegistry.find((entry) => entry.domainPath === "n:goldrush:train-boarding-cue");
const attachKit = v002KitRegistry.find((entry) => entry.domainPath === "n:goldrush:train-ride-attach");
const handoffKit = v002KitRegistry.find((entry) => entry.domainPath === "n:goldrush:train-departure-handoff");

assert(routeKit, "missing GoldRush train route kit");
assert(cueKit, "missing GoldRush train boarding cue kit");
assert(attachKit, "missing GoldRush train ride attach kit");
assert(handoffKit, "missing GoldRush train departure handoff kit");

assert(routeKit.validator === "tools/validation/validate-v002-train-loop-contract.mjs", "train route validator changed");
assert(cueKit.validator === "tools/validation/validate-v002-train-loop-contract.mjs", "train boarding cue validator changed");
assert(attachKit.validator === "tools/validation/validate-v002-train-loop-contract.mjs", "train ride attach validator changed");
assert(handoffKit.validator === "tools/validation/validate-v002-train-loop-contract.mjs", "train departure handoff validator changed");

const routeRuntime = createTrainRouteKit();
const approachSample = sampleTrainRoute("approach", 0.5);
const departureSample = sampleTrainRoute("departure", 0.5);
assert(routeRuntime.contract().domainPath === "n:goldrush:train-route", "route kit domain path changed");
assert(approachSample.routeId === "goldrush-train-route-v1", "approach route id changed");
assert(departureSample.routeId === "goldrush-train-route-v1", "departure route id changed");
assert(Number.isFinite(approachSample.yaw), "approach route yaw must be finite");
assert(Number.isFinite(departureSample.yaw), "departure route yaw must be finite");
assert(Array.isArray(routeKit.dependencies) && routeKit.dependencies.length >= 2, "train route kit dependencies too small");

const cueRuntime = createTrainBoardingCueKit();
const cueState = resolveTrainBoardingCueState({
  doorProgress: 1,
  playerLockedToTrain: false,
  trainReadout: { boardingCueVisible: true, nextPlayerAction: "board-train", cameraDirective: "over-shoulder-walk" },
  elapsedSeconds: 1.5,
});
assert(cueRuntime.contract().domainPath === "n:goldrush:train-boarding-cue", "cue kit domain path changed");
assert(cueState.contract === "goldrush-train-boarding-cue-v1", "boarding cue contract changed");
assert(cueState.visible === true, "boarding cue should become visible when the door is open");
assert(cueState.anchor.x === trainBoardingAnchor.x && cueState.anchor.z === trainBoardingAnchor.z, "boarding cue anchor changed");

const attachRuntime = createTrainRideAttachKit();
const attachState = resolveTrainRideAttachment({
  localPlayer: { position: { x: 1, z: 2 }, heading: 0.8, look: { yaw: 0.8, pitch: -0.1 } },
  playerLockedToTrain: true,
  routeSample: departureSample,
  trainPosition: { x: 0, z: -9.1 },
  boardingAnchorWorldPosition: { x: -1.68, z: -3.72 },
});
assert(attachRuntime.contract().domainPath === "n:goldrush:train-ride-attach", "ride attach kit domain path changed");
assert(attachState.contract === "goldrush-train-ride-attach-v1", "ride attach contract changed");
assert(attachState.attached === true, "ride attach should attach when player is locked");
assert(attachState.cameraDirective === "follow-train", "ride attach camera should follow the train");

const walkYaw = 0.8;
const walkPitch = -0.1;
const walkState = resolveTrainRideAttachment({
  localPlayer: { position: { x: 1, y: 0, z: 2 }, heading: walkYaw, look: { yaw: walkYaw, pitch: walkPitch } },
  playerLockedToTrain: false,
  routeSample: approachSample,
  trainPosition: { x: 0, z: -9.1 },
  boardingAnchorWorldPosition: { x: -1.68, z: -3.72 },
});
const walkView = {
  x: walkState.cameraLookAt.x - walkState.cameraPosition.x,
  y: walkState.cameraLookAt.y - walkState.cameraPosition.y,
  z: walkState.cameraLookAt.z - walkState.cameraPosition.z,
};
const walkPlanarLength = Math.hypot(walkView.x, walkView.z);
const walkYawDot = (walkView.x / walkPlanarLength) * Math.sin(walkYaw)
  + (walkView.z / walkPlanarLength) * Math.cos(walkYaw);
const resolvedWalkPitch = Math.atan2(walkView.y, walkPlanarLength);
assert(walkYawDot >= 0.999999, "walk camera must look along the same yaw used by W movement");
assert(Math.abs(resolvedWalkPitch - walkPitch) <= 0.000001, "walk camera must look along the same pitch stored by mouse look");

const handoffRuntime = createTrainDepartureHandoffKit();
const handoffState = resolveTrainDepartureHandoffState({
  boardingStatus: { localBoarded: true, allReady: true },
  peerHandoffGate: { ready: true },
  departureStartedAt: 12,
  departureProgress: 1,
  playerLockedToTrain: true,
});
assert(handoffRuntime.contract().domainPath === "n:goldrush:train-departure-handoff", "departure handoff kit domain path changed");
assert(handoffState.contract === "goldrush-train-departure-handoff-v1", "departure handoff contract changed");
assert(handoffState.ready === true, "departure handoff should be ready once party and peer gating are satisfied");
assert(handoffState.phase === "handoff-ready", "departure handoff should reach handoff-ready when departure is complete");

console.log(JSON.stringify({
  status: "v002-train-loop-contract-ready",
  route: routeKit.domainPath,
  cue: cueKit.domainPath,
  attach: attachKit.domainPath,
  handoff: handoffKit.domainPath,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
