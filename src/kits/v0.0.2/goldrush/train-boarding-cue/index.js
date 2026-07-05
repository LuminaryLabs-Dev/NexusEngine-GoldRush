import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";

export const domainPath = "n:goldrush:train-boarding-cue";
export const kitContract = getV002KitByDomainPath(domainPath);
export const trainBoardingAnchor = Object.freeze({ x: -1.68, y: 0, z: -3.72 });

export function resolveTrainBoardingCueState({
  doorProgress = 0,
  playerLockedToTrain = false,
  trainReadout = null,
  elapsedSeconds = 0,
} = {}) {
  const visible = Boolean(trainReadout?.boardingCueVisible ?? (doorProgress >= 0.25 && !playerLockedToTrain));
  const status = playerLockedToTrain
    ? "riding-train"
    : doorProgress >= 0.92
      ? "board-now"
      : doorProgress > 0
        ? "door-opening"
        : "waiting-for-door";
  const pulse = visible ? 1 + Math.sin(elapsedSeconds * 5.8) * 0.08 : 1;
  return {
    contract: "goldrush-train-boarding-cue-v1",
    visible,
    status,
    pulse,
    anchor: structuredClone(trainBoardingAnchor),
    nextPlayerAction: trainReadout?.nextPlayerAction ?? null,
    cameraDirective: trainReadout?.cameraDirective ?? null,
  };
}

export function createTrainBoardingCueKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  return {
    ...runtime,
    anchor: structuredClone(trainBoardingAnchor),
    resolve: resolveTrainBoardingCueState,
    snapshot(extra = {}) {
      return runtime.snapshot({
        anchor: structuredClone(trainBoardingAnchor),
        ...extra,
      });
    },
  };
}

export function createKit(options = {}) {
  return createTrainBoardingCueKit(options);
}

export default createKit;
