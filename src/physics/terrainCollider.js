import { GOLD_RUSH_GREYBOX_LAYOUT } from "../content/goldrushAuthoredTerrainFixture.js";
import {
  GOLD_RUSH_WORLD_RECIPE,
  sampleSeededTerrainColor,
  sampleSeededTerrainHeight,
} from "../kits/v0.0.2/world/terrain-source/seededWorld.js";

export const TERRAIN_PATCH_COLUMNS = GOLD_RUSH_WORLD_RECIPE.width / GOLD_RUSH_WORLD_RECIPE.tileSize;
export const TERRAIN_PATCH_ROWS = GOLD_RUSH_WORLD_RECIPE.depth / GOLD_RUSH_WORLD_RECIPE.tileSize;
export const TERRAIN_PATCH_SIZE = GOLD_RUSH_WORLD_RECIPE.tileSize;
export const TERRAIN_WIDTH = GOLD_RUSH_WORLD_RECIPE.width;
export const TERRAIN_DEPTH = GOLD_RUSH_WORLD_RECIPE.depth;
export const TERRAIN_RAYCAST_FROM_Y = 240;
export const TERRAIN_RAYCAST_TO_Y = -120;
export const TERRAIN_COLLISION_RADIUS = 256;

export function terrainFieldBaseHeight(x, z) {
  return sampleSeededTerrainHeight(x, z);
}

export function terrainFieldHeight(x, z) {
  return terrainFieldBaseHeight(x, z);
}

export function terrainFieldColor(x, z) {
  return sampleSeededTerrainColor(x, z);
}

export function sampleTerrainCollider({ x, z, sampleStep = 0.75, maxWalkableSlope = 1.85, hit = null } = {}) {
  hit = hit ?? raycastTerrainDown({ x, z });
  const height = hit?.point.y ?? terrainFieldHeight(x, z);
  const dx = (raycastTerrainHeight(x + sampleStep, z) - raycastTerrainHeight(x - sampleStep, z)) / (sampleStep * 2);
  const dz = (raycastTerrainHeight(x, z + sampleStep) - raycastTerrainHeight(x, z - sampleStep)) / (sampleStep * 2);
  const slopeGrade = Math.hypot(dx, dz);
  const authoredBoundary = GOLD_RUSH_GREYBOX_LAYOUT.blockedAreas.find((area) => (
    x >= area.minX && x <= area.maxX && z >= area.minZ && z <= area.maxZ
  ));
  const outsideWorld = x < GOLD_RUSH_WORLD_RECIPE.bounds.minX
    || x > GOLD_RUSH_WORLD_RECIPE.bounds.maxX
    || z < GOLD_RUSH_WORLD_RECIPE.bounds.minZ
    || z > GOLD_RUSH_WORLD_RECIPE.bounds.maxZ;
  const boundary = authoredBoundary ?? (outsideWorld ? { id: "blocker.world-edge" } : null);

  return {
    kind: "sampled-heightfield",
    algorithm: "seeded-radial-tile-terrain-v1",
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

export function raycastTerrainDown({
  x,
  z,
  fromY = TERRAIN_RAYCAST_FROM_Y,
  toY = TERRAIN_RAYCAST_TO_Y,
  bands = null,
} = {}) {
  const activeBands = bands ?? createTerrainTessellationBands({ focusX: x, focusZ: z });
  const sortedBands = [...activeBands].sort((a, b) => a.step - b.step);
  for (let bandIndex = 0; bandIndex < sortedBands.length; bandIndex += 1) {
    const band = sortedBands[bandIndex];
    if (x < band.bounds.minX || x > band.bounds.maxX || z < band.bounds.minZ || z > band.bounds.maxZ) continue;
    const hits = raycastBandCell({
      x,
      z,
      fromY,
      toY,
      band,
      bandYOffset: (activeBands.length - bandIndex - 1) * 0.001,
    })
    .filter(Boolean)
    .sort((a, b) => b.point.y - a.point.y);
    if (hits[0]) return hits[0];
  }
  return null;
}

export function createTerrainColliderDescriptor({
  minX = -TERRAIN_COLLISION_RADIUS,
  maxX = TERRAIN_COLLISION_RADIUS,
  minZ = -TERRAIN_COLLISION_RADIUS,
  maxZ = TERRAIN_COLLISION_RADIUS,
  step = GOLD_RUSH_WORLD_RECIPE.collisionStep,
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
    algorithm: "seeded-radial-tile-terrain-v1",
    bridgeTargets: ["cannon-es-heightfield", "rapier-heightfield"],
    bounds: { minX, maxX, minZ, maxZ },
    raycast: {
      mode: "downward-triangle-raycast",
      fromY: TERRAIN_RAYCAST_FROM_Y,
      toY: TERRAIN_RAYCAST_TO_Y,
      placement: "shared-seeded-tile-triangle-hit",
    },
    step,
    columns,
    rows,
    samples,
    blockedAreas: GOLD_RUSH_GREYBOX_LAYOUT.blockedAreas.map((area) => ({ ...area })),
  };
}

export function createTerrainTessellationBands({
  focusX = 0,
  focusZ = 0,
} = {}) {
  return GOLD_RUSH_WORLD_RECIPE.lodRings.map((ring) => ({
    id: ring.id,
    priority: GOLD_RUSH_WORLD_RECIPE.lodRings.length - ring.level,
    level: ring.level,
    radius: ring.radius,
    step: ring.step,
    bounds: {
      minX: Math.max(GOLD_RUSH_WORLD_RECIPE.bounds.minX, focusX - ring.radius),
      maxX: Math.min(GOLD_RUSH_WORLD_RECIPE.bounds.maxX, focusX + ring.radius),
      minZ: Math.max(GOLD_RUSH_WORLD_RECIPE.bounds.minZ, focusZ - ring.radius),
      maxZ: Math.min(GOLD_RUSH_WORLD_RECIPE.bounds.maxZ, focusZ + ring.radius),
    },
    role: ring.collision ? "visible-and-collidable-near-ring" : "visible-streamed-lod-ring",
    overlapCells: 1,
    skirtDepth: Math.max(8, ring.step * 1.5),
    renderOrder: ring.level,
  }));
}

export function createTerrainContinuityDescriptor({
  focusX = 0,
  focusZ = 0,
} = {}) {
  const bands = createTerrainTessellationBands({ focusX, focusZ });
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
    algorithm: "seeded-radial-tile-terrain-v1",
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
      source: "lod-horizon",
      colorTarget: "fog-and-sandstone",
      noFlatFillPlane: true,
    },
  };
}

export function validateTerrainColliderDescriptor(descriptor = createTerrainColliderDescriptor()) {
  const failures = [];
  if (descriptor.algorithm !== "seeded-radial-tile-terrain-v1") failures.push("algorithm-mismatch");
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
  if (descriptor.algorithm !== "seeded-radial-tile-terrain-v1") failures.push("algorithm-mismatch");
  if (descriptor.winding !== "top-face-up") failures.push("missing-top-face-winding-contract");
  if (!descriptor.noDebugBlue) failures.push("debug-blue-not-disabled");
  if (!descriptor.edgeTreatment || descriptor.edgeTreatment.exposedBandEdges !== "skirted") failures.push("missing-skirted-edge-treatment");
  if (descriptor.edgeTreatment?.colliderAffectedBySkirts !== false) failures.push("skirts-must-not-affect-collider");
  if (!Array.isArray(descriptor.bands) || descriptor.bands.length < 4) failures.push("terrain-must-use-concentric-lod-rings");
  descriptor.bands?.forEach((band) => {
    if (!Number.isFinite(band.overlapCells) || band.overlapCells < 1) failures.push(`lod-ring-must-overlap:${band.id}`);
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

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: Number((vector.x / length).toFixed(4)),
    y: Number((vector.y / length).toFixed(4)),
    z: Number((vector.z / length).toFixed(4)),
  };
}
