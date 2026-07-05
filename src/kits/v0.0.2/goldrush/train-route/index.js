import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";

export const domainPath = "n:goldrush:train-route";
export const kitContract = getV002KitByDomainPath(domainPath);

export const trainRouteDefinition = Object.freeze({
  routeId: "goldrush-train-route-v1",
  orientation: "tangent-following",
  approach: [
    { x: 0, z: -50 },
    { x: 0, z: -38 },
    { x: 0, z: -22 },
    { x: 0, z: -9.1 },
  ],
  departure: [
    { x: 0, z: -9.1 },
    { x: 0, z: 3 },
    { x: 0, z: 22 },
    { x: 0, z: 45 },
  ],
});

export function sampleTrainRoute(phase = "approach", progress = 0) {
  const points = phase === "departure" ? trainRouteDefinition.departure : trainRouteDefinition.approach;
  const t = smoothstep(clamp01(progress));
  const position = sampleCubicBezier(points, t);
  const tangent = sampleCubicBezierTangent(points, t);
  return {
    routeId: trainRouteDefinition.routeId,
    phase,
    progress: Number(t.toFixed(3)),
    position,
    tangent,
    yaw: Math.atan2(tangent.x, tangent.z) + Math.PI,
  };
}

export function createTrainRouteKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  return {
    ...runtime,
    routeDefinition: structuredClone(trainRouteDefinition),
    sample: sampleTrainRoute,
    snapshot(extra = {}) {
      return runtime.snapshot({
        routeId: trainRouteDefinition.routeId,
        orientation: trainRouteDefinition.orientation,
        routeDefinition: structuredClone(trainRouteDefinition),
        ...extra,
      });
    },
  };
}

export function createKit(options = {}) {
  return createTrainRouteKit(options);
}

export default createKit;

function sampleCubicBezier(points, t) {
  const a = (1 - t) ** 3;
  const b = 3 * (1 - t) ** 2 * t;
  const c = 3 * (1 - t) * t ** 2;
  const d = t ** 3;
  return {
    x: points[0].x * a + points[1].x * b + points[2].x * c + points[3].x * d,
    z: points[0].z * a + points[1].z * b + points[2].z * c + points[3].z * d,
  };
}

function sampleCubicBezierTangent(points, t) {
  const a = 3 * (1 - t) ** 2;
  const b = 6 * (1 - t) * t;
  const c = 3 * t ** 2;
  const x = (points[1].x - points[0].x) * a
    + (points[2].x - points[1].x) * b
    + (points[3].x - points[2].x) * c;
  const z = (points[1].z - points[0].z) * a
    + (points[2].z - points[1].z) * b
    + (points[3].z - points[2].z) * c;
  const length = Math.hypot(x, z) || 1;
  return { x: x / length, z: z / length };
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
