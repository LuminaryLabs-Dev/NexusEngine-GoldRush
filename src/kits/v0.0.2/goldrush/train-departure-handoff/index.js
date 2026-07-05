import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";

export const domainPath = "n:goldrush:train-departure-handoff";
export const kitContract = getV002KitByDomainPath(domainPath);

export function resolveTrainDepartureHandoffState({
  boardingStatus = null,
  peerHandoffGate = null,
  departureStartedAt = null,
  departureProgress = 0,
  playerLockedToTrain = false,
} = {}) {
  const localBoarded = Boolean(boardingStatus?.localBoarded);
  const partyReady = Boolean(boardingStatus?.allReady);
  const peerReady = Boolean(peerHandoffGate?.ready);
  const ready = Boolean(playerLockedToTrain && localBoarded && partyReady && peerReady);
  const phase = !localBoarded
    ? "boarding-open"
    : !partyReady || !peerReady
      ? "boarding-syncing"
      : departureStartedAt === null
        ? "train-departing"
        : departureProgress >= 1
          ? "handoff-ready"
          : "train-departing";
  return {
    contract: "goldrush-train-departure-handoff-v1",
    ready,
    phase,
    playerLockedToTrain: Boolean(playerLockedToTrain),
    localBoarded,
    partyReady,
    peerReady,
    departureStartedAt,
    departureProgress,
    nextPlayerAction: phase === "boarding-open"
      ? "board-train"
      : phase === "boarding-syncing"
        ? "wait-for-party"
        : phase === "train-departing"
          ? "ride-train"
          : "continue",
    cameraDirective: ready || playerLockedToTrain ? "follow-train" : "over-shoulder-walk",
  };
}

export function createTrainDepartureHandoffKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  return {
    ...runtime,
    resolve: resolveTrainDepartureHandoffState,
    snapshot(extra = {}) {
      return runtime.snapshot({
        contract: "goldrush-train-departure-handoff-v1",
        ...extra,
      });
    },
  };
}

export function createKit(options = {}) {
  return createTrainDepartureHandoffKit(options);
}

export default createKit;
