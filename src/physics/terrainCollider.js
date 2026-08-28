import { GOLD_RUSH_GREYBOX_LAYOUT } from "../content/goldrushAuthoredTerrainFixture.js";

export const TERRAIN_PATCH_COLUMNS = 180;
export const TERRAIN_PATCH_ROWS = 110;
export const TERRAIN_PATCH_SIZE = 1;
export const TERRAIN_WIDTH = TERRAIN_PATCH_COLUMNS * TERRAIN_PATCH_SIZE;
export const TERRAIN_DEPTH = TERRAIN_PATCH_ROWS * TERRAIN_PATCH_SIZE;
export const TERRAIN_RAYCAST_FROM_Y = 80;
export const TERRAIN_RAYCAST_TO_Y = -30;

export function terrainFieldBaseHeight(x, z) {
  const layout = GOLD_RUSH_GREYBOX_LAYOUT;
  const rolling = Math.sin(x * 0.055) * 0.2 + Math.cos(z * 0.07) * 0.16;
  const wash = Math.sin((x + z) * 0.035) * 0.09 + Math.cos((x - z) * 0.028) * 0.07;
  const edgeDistance = Math.max(0, Math.abs(x) - layout.basin.radiusX);
  const canyonLift = Math.pow(edgeDistance / 16, 1.45) * 5.8;
  const routeDistance = Math.min(...layout.routes.map((route) => distanceToPolyline(x, z, route.points)));
  const routeWidth = Math.max(...layout.routes.map((route) => route.width));
  const trailCut = Math.max(0, 1 - routeDistance / routeWidth) * -0.18;
  const trailBanks = Math.max(0, 1 - Math.abs(routeDistance - routeWidth * 1.35) / 1.8) * 0.08;
  const basinRadius = Math.hypot((x - layout.basin.x) / layout.basin.radiusX, (z - layout.basin.z) / layout.basin.radiusZ);
  const basinBowl = Math.max(0, 1 - basinRadius) * layout.basin.floorHeight;
  const mineShelf = shelfInfluence(layout.shelves.find((shelf) => shelf.role === "mine"), x, z);
  const townShelf = shelfInfluence(layout.shelves.find((shelf) => shelf.role === "cashout"), x, z);
  const goldSeam = layout.landmarks.find((landmark) => landmark.role === "gold-seam");
  const goldFaceLift = Math.max(0, 1 - Math.hypot((x - goldSeam.x) / 9, (z - goldSeam.z) / 5)) * 0.58;
  return rolling + wash + canyonLift + trailCut + trailBanks + basinBowl + mineShelf + townShelf + goldFaceLift;
}

export function terrainFieldHeight(x, z) {
  return terrainFieldBaseHeight(x, z);
}

export function terrainFieldColor(x, z) {
  const layout = GOLD_RUSH_GREYBOX_LAYOUT;
  const wash = Math.sin((x + z) * 0.09);
  const scrub = Math.cos(x * 0.21) + Math.sin(z * 0.17);
  const slope = Math.max(0, Math.abs(x) - layout.basin.radiusX) / 18;
  const mineShelf = layout.shelves.find((shelf) => shelf.role === "mine");
  const townShelf = layout.shelves.find((shelf) => shelf.role === "cashout");
  const goldSeam = layout.landmarks.find((landmark) => landmark.role === "gold-seam");
  const routeDistance = Math.min(...layout.routes.map((route) => distanceToPolyline(x, z, route.points)));
  if (insideShelf(mineShelf, x, z)) return 0x714a35;
  if (insideShelf(townShelf, x, z)) return 0xa8753e;
  if (Math.hypot((x - goldSeam.x) / 9, (z - goldSeam.z) / 5) < 1) return 0x9f5030;
  if (routeDistance < 4.4) return 0x7f5a32;
  if (slope > 0.75) return 0x6d351f;
  if (slope > 0.42) return 0xb45b32;
  if (wash > 0.62) return 0xb98b50;
  if (scrub > 1.1) return 0x706b3e;
  return 0x92703d;
}

export function sampleTerrainCollider({ x, z, sampleStep = 0.75, maxWalkableSlope = 1.85, hit = null } = {}) {
  hit = hit ?? raycastTerrainDown({ x, z });
  const height = hit?.point.y ?? terrainFieldHeight(x, z);
  const dx = (raycastTerrainHeight(x + sampleStep, z) - raycastTerrainHeight(x - sampleStep, z)) / (sampleStep * 2);
  const dz = (raycastTerrainHeight(x, z + sampleStep) - raycastTerrainHeight(x, z - sampleStep)) / (sampleStep * 2);
  const slopeGrade = Math.hypot(dx, dz);
  const boundary = GOLD_RUSH_GREYBOX_LAYOUT.blockedAreas.find((area) => (
    x >= area.minX && x <= area.maxX && z >= area.minZ && z <= area.maxZ
  ));

  return {
    kind: "sampled-heightfield",
    algorithm: "single-banded-triangle-terrain-v1",
    placement: hit?.kind ?? "height-sample",
    x,
    z,
    height,
    y: height,
    slopeGrade,
    normal: normalize({ x: -dx, y: 1, z: -dz }),
    walkable: slopeGrade <= maxWalkableSlope && !boundary,
    blockingFeatureId: boundary?.id ?? null,
    sampleStep,
    hit,
  };
}

function shelfInfluence(shelf, x, z) {
  if (!shelf) return 0;
  const radius = Math.hypot((x - shelf.x) / (shelf.width * 0.5), (z - shelf.z) / (shelf.depth * 0.5));
  return smoothStep(1.15, 0.72, radius) * shelf.elevation;
}

function insideShelf(shelf, x, z) {
  return Boolean(shelf)
    && Math.abs(x - shelf.x) <= shelf.width * 0.5
    && Math.abs(z - shelf.z) <= shelf.depth * 0.5;
}

function distanceToPolyline(x, z, points) {
  let nearest = Number.POSITIVE_INFINITY;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const lengthSquared = dx * dx + dz * dz;
    const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - start.x) * dx + (z - start.z) * dz) / lengthSquared));
    nearest = Math.min(nearest, Math.hypot(x - (start.x + dx * t), z - (start.z + dz * t)));
  }
  return nearest;
}

function smoothStep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function raycastTerrainDown({
  x,
  z,
  fromY = TERRAIN_RAYCAST_FROM_Y,
  toY = TERRAIN_RAYCAST_TO_Y,
  bands = createTerrainTessellationBands(),
} = {}) {
  const sortedBands = [...bands].sort((a, b) => a.step - b.step);
  for (let bandIndex = 0; bandIndex < sortedBands.length; bandIndex += 1) {
    const band = sortedBands[bandIndex];
    if (x < band.bounds.minX || x > band.bounds.maxX || z < band.bounds.minZ || z > band.bounds.maxZ) continue;
    const hits = raycastBandCell({
      x,
      z,
      fromY,
      toY,
      band,
      bandYOffset: (bands.length - bandIndex - 1) * 0.012,
    })
    .filter(Boolean)
    .sort((a, b) => b.point.y - a.point.y);
    if (hits[0]) return hits[0];
  }
  return null;
}

export function createTerrainColliderDescriptor({
  minX = -TERRAIN_WIDTH / 2,
  maxX = TERRAIN_WIDTH / 2,
  minZ = -TERRAIN_DEPTH / 2,
  maxZ = TERRAIN_DEPTH / 2,
  step = TERRAIN_PATCH_SIZE,
} = {}) {
  const columns = Math.floor((maxX - minX) / step) + 1;
  const rows = Math.floor((maxZ - minZ) / step) + 1;
  const samples = [];
  for (let row = 0; row < rows; row += 1) {
    const z = minZ + row * step;
    for (let column = 0; column < columns; column += 1) {
      const x = minX + column * step;
      samples.push(Number(terrainFieldHeight(x, z).toFixed(4)));
    }
  }

  return {
    id: "goldrush.terrain.collider.heightfield",
    kind: "sampled-heightfield",
    algorithm: "single-banded-triangle-terrain-v1",
    bridgeTargets: ["cannon-es-heightfield", "rapier-heightfield"],
    bounds: { minX, maxX, minZ, maxZ },
    raycast: {
      mode: "downward-triangle-raycast",
      fromY: TERRAIN_RAYCAST_FROM_Y,
      toY: TERRAIN_RAYCAST_TO_Y,
      placement: "highest-visible-banded-triangle-hit",
    },
    step,
    columns,
    rows,
    samples,
    blockedAreas: GOLD_RUSH_GREYBOX_LAYOUT.blockedAreas.map((area) => ({ ...area })),
  };
}

export function createTerrainTessellationBands({
  width = TERRAIN_WIDTH,
  depth = TERRAIN_DEPTH,
  patchSize = TERRAIN_PATCH_SIZE,
} = {}) {
  return [
    {
      id: "canonical-world-band",
      priority: 1,
      step: patchSize,
      bounds: scaleBounds(width, depth, 1, 1),
      role: "single-continuous-visible-and-collidable-world-surface",
      overlapCells: 0,
      skirtDepth: 10,
      renderOrder: 1,
    },
  ];
}

export function createTerrainContinuityDescriptor({
  width = TERRAIN_WIDTH,
  depth = TERRAIN_DEPTH,
  patchSize = TERRAIN_PATCH_SIZE,
} = {}) {
  const bands = createTerrainTessellationBands({ width, depth, patchSize });
  const bandPairs = [];
  for (let index = 0; index < bands.length - 1; index += 1) {
    const current = bands[index];
    const next = bands[index + 1];
    bandPairs.push({
      innerBandId: current.id,
      outerBandId: next.id,
      overlapX: Number((Math.min(current.bounds.maxX, next.bounds.maxX) - Math.max(current.bounds.minX, next.bounds.minX)).toFixed(4)),
      overlapZ: Number((Math.min(current.bounds.maxZ, next.bounds.maxZ) - Math.max(current.bounds.minZ, next.bounds.minZ)).toFixed(4)),
      minRequiredOverlap: Math.min(current.step, next.step),
    });
  }
  return {
    id: "goldrush.terrain.render-continuity",
    algorithm: "single-banded-triangle-terrain-v1",
    winding: "top-face-up",
    noDebugBlue: true,
    bands,
    bandPairs,
    edgeTreatment: {
      exposedBandEdges: "skirted",
      skirtSource: "terrainFieldHeight",
      colliderAffectedBySkirts: false,
    },
    horizonBlend: {
      source: "far-horizon-band",
      colorTarget: "fog-and-sandstone",
      noFlatFillPlane: true,
    },
  };
}

export function validateTerrainColliderDescriptor(descriptor = createTerrainColliderDescriptor()) {
  const failures = [];
  if (descriptor.algorithm !== "single-banded-triangle-terrain-v1") failures.push("algorithm-mismatch");
  if (!descriptor.bridgeTargets?.includes("cannon-es-heightfield")) failures.push("missing-cannon-bridge-target");
  if (!descriptor.bridgeTargets?.includes("rapier-heightfield")) failures.push("missing-rapier-bridge-target");
  if (descriptor.samples.length !== descriptor.columns * descriptor.rows) failures.push("sample-count-mismatch");
  if (descriptor.columns < 40 || descriptor.rows < 25) failures.push("heightfield-too-sparse");
  if (!descriptor.blockedAreas?.length) failures.push("missing-canonical-blocked-areas");
  if (descriptor.raycast?.mode !== "downward-triangle-raycast") failures.push("missing-downward-raycast-mode");
  return { passed: failures.length === 0, failures, descriptor };
}

export function validateTerrainContinuityDescriptor(descriptor = createTerrainContinuityDescriptor()) {
  const failures = [];
  if (descriptor.algorithm !== "single-banded-triangle-terrain-v1") failures.push("algorithm-mismatch");
  if (descriptor.winding !== "top-face-up") failures.push("missing-top-face-winding-contract");
  if (!descriptor.noDebugBlue) failures.push("debug-blue-not-disabled");
  if (!descriptor.edgeTreatment || descriptor.edgeTreatment.exposedBandEdges !== "skirted") failures.push("missing-skirted-edge-treatment");
  if (descriptor.edgeTreatment?.colliderAffectedBySkirts !== false) failures.push("skirts-must-not-affect-collider");
  if (!Array.isArray(descriptor.bands) || descriptor.bands.length !== 1) failures.push("terrain-must-use-one-continuous-band");
  descriptor.bands?.forEach((band) => {
    if (!Number.isFinite(band.overlapCells) || band.overlapCells !== 0) failures.push(`single-band-must-not-overlap:${band.id}`);
    if (!Number.isFinite(band.skirtDepth) || band.skirtDepth <= 0) failures.push(`missing-skirt-depth:${band.id}`);
    if (!Number.isFinite(band.renderOrder)) failures.push(`missing-render-order:${band.id}`);
  });
  descriptor.bandPairs?.forEach((pair) => {
    if (pair.overlapX < pair.minRequiredOverlap || pair.overlapZ < pair.minRequiredOverlap) {
      failures.push(`insufficient-band-overlap:${pair.innerBandId}:${pair.outerBandId}`);
    }
  });
  return { passed: failures.length === 0, failures, descriptor };
}

function raycastTerrainHeight(x, z) {
  return raycastTerrainDown({ x, z })?.point.y ?? terrainFieldHeight(x, z);
}

function raycastBandCell({ x, z, fromY, toY, band, bandYOffset }) {
  if (x < band.bounds.minX || x > band.bounds.maxX || z < band.bounds.minZ || z > band.bounds.maxZ) return [];
  const cellX = Math.floor((x - band.bounds.minX) / band.step) * band.step + band.bounds.minX;
  const cellZ = Math.floor((z - band.bounds.minZ) / band.step) * band.step + band.bounds.minZ;
  const x0 = Math.max(band.bounds.minX, cellX);
  const z0 = Math.max(band.bounds.minZ, cellZ);
  const x1 = Math.min(x0 + band.step, band.bounds.maxX);
  const z1 = Math.min(z0 + band.step, band.bounds.maxZ);
  const centerX = (x0 + x1) / 2;
  const centerZ = (z0 + z1) / 2;
  const vertices = [
    terrainVertex(x0, z0, bandYOffset),
    terrainVertex(x1, z0, bandYOffset),
    terrainVertex(x1, z1, bandYOffset),
    terrainVertex(x0, z1, bandYOffset),
    terrainVertex(centerX, centerZ, bandYOffset),
  ];
  const triangles = [
    [vertices[0], vertices[1], vertices[4]],
    [vertices[1], vertices[2], vertices[4]],
    [vertices[2], vertices[3], vertices[4]],
    [vertices[3], vertices[0], vertices[4]],
  ];
  return triangles
    .map((triangle, index) => interpolateTriangleHit({ x, z, fromY, toY, triangle, band, index }))
    .filter(Boolean);
}

function terrainVertex(x, z, yOffset) {
  return { x, y: terrainFieldHeight(x, z) + yOffset, z };
}

function interpolateTriangleHit({ x, z, fromY, toY, triangle, band, index }) {
  const [a, b, c] = triangle;
  const weights = barycentric2D({ x, z }, a, b, c);
  if (!weights) return null;
  const y = a.y * weights.a + b.y * weights.b + c.y * weights.c;
  if (y > fromY || y < toY) return null;
  return {
    kind: "downward-triangle-raycast",
    bandId: band.id,
    triangleIndex: index,
    point: { x, y, z },
    barycentric: weights,
  };
}

function barycentric2D(point, a, b, c) {
  const v0x = b.x - a.x;
  const v0z = b.z - a.z;
  const v1x = c.x - a.x;
  const v1z = c.z - a.z;
  const v2x = point.x - a.x;
  const v2z = point.z - a.z;
  const dot00 = v0x * v0x + v0z * v0z;
  const dot01 = v0x * v1x + v0z * v1z;
  const dot02 = v0x * v2x + v0z * v2z;
  const dot11 = v1x * v1x + v1z * v1z;
  const dot12 = v1x * v2x + v1z * v2z;
  const denominator = dot00 * dot11 - dot01 * dot01;
  if (Math.abs(denominator) < 0.000001) return null;
  const invDenominator = 1 / denominator;
  const bWeight = (dot11 * dot02 - dot01 * dot12) * invDenominator;
  const cWeight = (dot00 * dot12 - dot01 * dot02) * invDenominator;
  const aWeight = 1 - bWeight - cWeight;
  const epsilon = -0.00001;
  if (aWeight < epsilon || bWeight < epsilon || cWeight < epsilon) return null;
  return { a: aWeight, b: bWeight, c: cWeight };
}

function scaleBounds(width, depth, widthScale, depthScale) {
  return {
    minX: -width * widthScale * 0.5,
    maxX: width * widthScale * 0.5,
    minZ: -depth * depthScale * 0.5,
    maxZ: depth * depthScale * 0.5,
  };
}

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: Number((vector.x / length).toFixed(4)),
    y: Number((vector.y / length).toFixed(4)),
    z: Number((vector.z / length).toFixed(4)),
  };
}
