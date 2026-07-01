export const TERRAIN_PATCH_COLUMNS = 88;
export const TERRAIN_PATCH_ROWS = 56;
export const TERRAIN_PATCH_SIZE = 2.15;
export const TERRAIN_WIDTH = TERRAIN_PATCH_COLUMNS * TERRAIN_PATCH_SIZE;
export const TERRAIN_DEPTH = TERRAIN_PATCH_ROWS * TERRAIN_PATCH_SIZE;
export const TERRAIN_RAYCAST_FROM_Y = 80;
export const TERRAIN_RAYCAST_TO_Y = -30;

export const CENTRAL_MOUNTAIN_FORMS = [
  { id: "central-mountain.north-spur", x: -8.5, z: 29, width: 19, depth: 21, height: 8.4, blockerRadius: 7.1, routeRole: "force-west-or-east-walkaround", color: 0xb8623d },
  { id: "central-mountain.gold-spine", x: 9.2, z: 17.4, width: 17.5, depth: 16.5, height: 9.2, blockerRadius: 7.6, routeRole: "split-main-route", color: 0xc16c40 },
  { id: "central-mountain.south-shoulder", x: -17.5, z: 6.8, width: 14, depth: 14, height: 6.2, blockerRadius: 6.4, routeRole: "force-canyon-detour", color: 0x9f5132 },
];

const MOUNTAIN_CLEARANCE_CORRIDORS = [
  { id: "spawn-sightline-clearance", x: -4, z: -7.5, width: 31, depth: 28, strength: 0.82 },
  { id: "west-walkaround-clearance", x: -27, z: 10, width: 15, depth: 50, strength: 0.86 },
  { id: "east-walkaround-clearance", x: 26, z: 10, width: 16, depth: 48, strength: 0.84 },
];

export function terrainFieldBaseHeight(x, z) {
  const rolling = Math.sin(x * 0.085) * 0.42 + Math.cos(z * 0.11) * 0.34;
  const wash = Math.sin((x + z) * 0.045) * 0.18 + Math.cos((x - z) * 0.033) * 0.14;
  const canyonLift = Math.pow(Math.max(0, Math.abs(x) - TERRAIN_WIDTH * 0.38) / 26, 1.35) * 4.6;
  const routeT = (x + TERRAIN_WIDTH / 2) / TERRAIN_WIDTH;
  const trailCenter = Math.sin(routeT * Math.PI * 2.4) * 8.5 + (routeT - 0.5) * TERRAIN_DEPTH * 0.38 + Math.exp(-Math.pow((routeT - 0.52) / 0.16, 2)) * 21;
  const trailCut = Math.max(0, 1 - Math.abs(z - trailCenter) / 5.2) * -0.58;
  const trailBanks = Math.max(0, 1 - Math.abs(Math.abs(z - trailCenter) - 6.7) / 2.1) * 0.34;
  const basinBowl = Math.max(0, 1 - Math.hypot(x * 0.34, z * 0.48) / 34) * -0.42;
  const mineShelf = Math.max(0, 1 - Math.hypot((x + 8.8) / 7.8, (z - 7.2) / 4.7)) * 0.52;
  const townShelf = Math.max(0, 1 - Math.hypot((x - 8.3) / 9.2, (z - 8.6) / 4.8)) * 0.34;
  const goldFaceLift = Math.max(0, 1 - Math.hypot((x + 10.2) / 7.6, (z - 9.3) / 1.8)) * 0.7;
  return rolling + wash + canyonLift + trailCut + trailBanks + basinBowl + mineShelf + townShelf + goldFaceLift;
}

export function terrainFieldHeight(x, z) {
  const base = terrainFieldBaseHeight(x, z);
  const centralMountainLift = CENTRAL_MOUNTAIN_FORMS.reduce((total, mountain) => {
    return total + sampleCentralMountainHeight(x, z, mountain);
  }, 0);
  return base + centralMountainLift;
}

export function terrainFieldColor(x, z) {
  const wash = Math.sin((x + z) * 0.09);
  const scrub = Math.cos(x * 0.21) + Math.sin(z * 0.17);
  const slope = Math.max(0, Math.abs(x) - TERRAIN_WIDTH * 0.38) / 26;
  const mountainInfluence = sampleCentralMountainInfluence(x, z);
  if (mountainInfluence > 0.46) return 0xb85f38;
  if (mountainInfluence > 0.2) return 0xc9804d;
  if (Math.hypot((x + 8.8) / 7.8, (z - 7.2) / 4.7) < 1) return 0x74523a;
  if (Math.hypot((x - 8.3) / 9.2, (z - 8.6) / 4.8) < 1) return 0xa77b45;
  if (Math.hypot((x + 10.2) / 7.6, (z - 9.3) / 1.8) < 1) return 0x9f5030;
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
  const mountain = sampleCentralMountainBlocker(x, z);

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
    walkable: slopeGrade <= maxWalkableSlope && !mountain,
    blockingFeatureId: mountain?.id ?? null,
    sampleStep,
    hit,
  };
}

export function sampleCentralMountainHeight(x, z, mountain) {
  const radius = Math.hypot((x - mountain.x) / (mountain.width * 0.56), (z - mountain.z) / (mountain.depth * 0.56));
  const core = Math.pow(smoothStep(1, 0, radius), 1.28) * mountain.height;
  const walkaroundClearance = sampleMountainWalkaroundClearance(x, z);
  const viewClearance = sampleMountainViewClearanceMask(x, z);
  const clearance = Math.max(walkaroundClearance, viewClearance);
  return core * (1 - clearance);
}

export function sampleMountainWalkaroundClearance(x, z) {
  return Math.max(
    sampleClearanceCorridor(MOUNTAIN_CLEARANCE_CORRIDORS[1], x, z),
    sampleClearanceCorridor(MOUNTAIN_CLEARANCE_CORRIDORS[2], x, z)
  );
}

export function sampleMountainViewClearanceMask(x, z) {
  return sampleClearanceCorridor(MOUNTAIN_CLEARANCE_CORRIDORS[0], x, z);
}

export function sampleCentralMountainInfluence(x, z) {
  return CENTRAL_MOUNTAIN_FORMS.reduce((maximum, mountain) => {
    const radius = Math.hypot((x - mountain.x) / (mountain.width * 0.62), (z - mountain.z) / (mountain.depth * 0.62));
    return Math.max(maximum, smoothStep(1, 0, radius));
  }, 0);
}

function sampleCentralMountainBlocker(x, z) {
  const clearance = Math.max(sampleMountainWalkaroundClearance(x, z), sampleMountainViewClearanceMask(x, z));
  if (clearance > 0.5) return null;
  return CENTRAL_MOUNTAIN_FORMS.find((form) => {
    return Math.hypot((x - form.x) / form.blockerRadius, (z - form.z) / form.blockerRadius) < 1;
  }) ?? null;
}

function sampleClearanceCorridor(corridor, x, z) {
  const radius = Math.hypot((x - corridor.x) / (corridor.width * 0.5), (z - corridor.z) / (corridor.depth * 0.5));
  return smoothStep(1, 0, radius) * corridor.strength;
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
  const sortedBands = [...bands].sort((a, b) => b.priority - a.priority);
  const hits = sortedBands
    .flatMap((band, bandIndex) => raycastBandCell({
      x,
      z,
      fromY,
      toY,
      band,
      bandYOffset: bandIndex * 0.012,
    }))
    .filter(Boolean)
    .sort((a, b) => b.point.y - a.point.y);
  return hits[0] ?? null;
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
    centralMountainBlockers: CENTRAL_MOUNTAIN_FORMS.map((form) => ({
      id: form.id,
      x: form.x,
      z: form.z,
      radius: form.blockerRadius,
      height: form.height,
    })),
  };
}

export function createTerrainTessellationBands({
  width = TERRAIN_WIDTH,
  depth = TERRAIN_DEPTH,
  patchSize = TERRAIN_PATCH_SIZE,
} = {}) {
  return [
    {
      id: "near-play-band",
      priority: 1,
      bounds: scaleBounds(width, depth, 0.42, 0.38),
      step: patchSize / 3,
      role: "player-footing-and-camera-detail",
      overlapCells: 3,
      skirtDepth: 2.2,
      renderOrder: 3,
    },
    {
      id: "middle-route-band",
      priority: 2,
      bounds: scaleBounds(width, depth, 0.72, 0.68),
      step: patchSize,
      role: "walkable-route-and-mountain-approach",
      overlapCells: 4,
      skirtDepth: 4.4,
      renderOrder: 2,
    },
    {
      id: "far-horizon-band",
      priority: 3,
      bounds: scaleBounds(width, depth, 1, 1),
      step: patchSize * 2,
      role: "large-world-silhouette",
      overlapCells: 6,
      skirtDepth: 10,
      horizonFadeStart: 0.72,
      horizonFadeEnd: 1,
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
  if (!descriptor.centralMountainBlockers?.length) failures.push("missing-central-mountain-blockers");
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
  if (!Array.isArray(descriptor.bands) || descriptor.bands.length < 3) failures.push("missing-render-bands");
  descriptor.bands?.forEach((band) => {
    if (!Number.isFinite(band.overlapCells) || band.overlapCells < 1) failures.push(`missing-overlap-cells:${band.id}`);
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
