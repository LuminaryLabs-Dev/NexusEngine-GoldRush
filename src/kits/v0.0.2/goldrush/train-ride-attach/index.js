import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";

export const domainPath = "n:goldrush:train-ride-attach";
export const kitContract = getV002KitByDomainPath(domainPath);

export function resolveTrainRideAttachment({
  localPlayer = null,
  playerLockedToTrain = false,
  routeSample = null,
  trainPosition = { x: 0, z: 0 },
  boardingAnchorWorldPosition = null,
} = {}) {
  const attached = Boolean(playerLockedToTrain && routeSample);
  const anchorPosition = boardingAnchorWorldPosition ?? routeSample?.position ?? trainPosition;
  const playerPosition = attached
    ? { x: anchorPosition.x, z: anchorPosition.z }
    : localPlayer?.position ?? trainPosition;
  const playerHeading = attached ? routeSample.yaw : localPlayer?.heading ?? 0;
  const cameraDirective = attached ? "follow-train" : "over-shoulder-walk";
  const camera = attached && routeSample
    ? resolveFollowCamera(routeSample, playerPosition)
    : resolveWalkCamera(localPlayer);
  return {
    contract: "goldrush-train-ride-attach-v1",
    attached,
    playerPosition,
    playerHeading,
    cameraDirective,
    cameraPosition: camera.position,
    cameraLookAt: camera.lookAt,
    routeSample: routeSample ? {
      routeId: routeSample.routeId ?? null,
      phase: routeSample.phase ?? null,
      progress: routeSample.progress ?? null,
    } : null,
  };
}

export function createTrainRideAttachKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  return {
    ...runtime,
    resolve: resolveTrainRideAttachment,
    snapshot(extra = {}) {
      return runtime.snapshot({
        contract: "goldrush-train-ride-attach-v1",
        ...extra,
      });
    },
  };
}

export function createKit(options = {}) {
  return createTrainRideAttachKit(options);
}

export default createKit;

function resolveFollowCamera(routeSample, playerPosition) {
  const tangent = routeSample.tangent;
  const side = { x: tangent.z, z: -tangent.x };
  return {
    position: {
      x: playerPosition.x - tangent.x * 9 + side.x * 3.4,
      y: 4.2,
      z: playerPosition.z - tangent.z * 9 + side.z * 3.4,
    },
    lookAt: {
      x: playerPosition.x + tangent.x * 5,
      y: 1.45,
      z: playerPosition.z + tangent.z * 5,
    },
  };
}

function resolveWalkCamera(localPlayer) {
  const yaw = localPlayer?.look?.yaw ?? Math.PI;
  const pitch = localPlayer?.look?.pitch ?? -0.08;
  const position = localPlayer?.position ?? { x: 0, y: 0, z: 0 };
  const forward = { x: Math.sin(yaw), z: Math.cos(yaw) };
  const right = { x: -Math.cos(yaw), z: Math.sin(yaw) };
  const cameraPosition = {
    x: position.x - forward.x * 6.4 + right.x * 2.2,
    y: Number(position.y ?? 0) + 2.65,
    z: position.z - forward.z * 6.4 + right.z * 2.2,
  };
  const horizontalLook = Math.cos(pitch) * 8;
  return {
    position: cameraPosition,
    lookAt: {
      x: cameraPosition.x + forward.x * horizontalLook,
      y: cameraPosition.y + Math.sin(pitch) * 8,
      z: cameraPosition.z + forward.z * horizontalLook,
    },
  };
}
