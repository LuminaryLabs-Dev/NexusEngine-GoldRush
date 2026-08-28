import { GOLD_RUSH_GREYBOX_LAYOUT } from "../../../../content/goldrushAuthoredTerrainFixture.js";

export const GOLD_RUSH_WORLD_RECIPE = Object.freeze({
  id: "goldrush.seeded-world.001",
  revisionId: "goldrush-seeded-world-r1",
  seed: 0x47525553,
  unit: "meter",
  width: 10240,
  depth: 10240,
  tileSize: 128,
  collisionStep: 4,
  origin: Object.freeze({ x: 0, y: 0, z: 0 }),
  bounds: Object.freeze({ minX: -5120, maxX: 5120, minZ: -5120, maxZ: 5120 }),
  lodRings: Object.freeze([
    Object.freeze({ id: "lod-near", level: 0, radius: 220, step: 4, collision: true, featureDensity: 1 }),
    Object.freeze({ id: "lod-mid", level: 1, radius: 430, step: 8, collision: false, featureDensity: 0.5 }),
    Object.freeze({ id: "lod-far", level: 2, radius: 720, step: 16, collision: false, featureDensity: 0.18 }),
    Object.freeze({ id: "lod-horizon", level: 3, radius: 1080, step: 32, collision: false, featureDensity: 0.05 }),
  ]),
  terrain: Object.freeze({
    macroScale: 840,
    ridgeScale: 360,
    detailScale: 92,
    macroHeight: 22,
    ridgeHeight: 54,
    detailHeight: 2.8,
  }),
});

export function createSeededWorldSnapshot(recipe = GOLD_RUSH_WORLD_RECIPE) {
  return {
    contract: "nexus-seeded-world-recipe-v1",
    id: recipe.id,
    revisionId: recipe.revisionId,
    seed: recipe.seed,
    unit: recipe.unit,
    width: recipe.width,
    depth: recipe.depth,
    tileSize: recipe.tileSize,
    tileGrid: {
      columns: recipe.width / recipe.tileSize,
      rows: recipe.depth / recipe.tileSize,
    },
    bounds: { ...recipe.bounds },
    origin: { ...recipe.origin },
    lodRings: recipe.lodRings.map((ring) => ({ ...ring })),
    generationOrder: [
      "world-recipe",
      "macro-geography",
      "region-stamps",
      "terrain-tiles",
      "structural-features",
      "feature-zones",
      "prop-protokits",
      "render-and-collision-consumers",
    ],
  };
}

export function createActiveTerrainTiles({
  focus = { x: 0, z: 0 },
  recipe = GOLD_RUSH_WORLD_RECIPE,
} = {}) {
  const focusTileX = Math.floor(focus.x / recipe.tileSize);
  const focusTileZ = Math.floor(focus.z / recipe.tileSize);
  const maxRadius = recipe.lodRings.at(-1).radius;
  const tileRadius = Math.ceil(maxRadius / recipe.tileSize) + 1;
  const tiles = [];

  for (let tileZ = focusTileZ - tileRadius; tileZ <= focusTileZ + tileRadius; tileZ += 1) {
    for (let tileX = focusTileX - tileRadius; tileX <= focusTileX + tileRadius; tileX += 1) {
      const bounds = tileBounds(tileX, tileZ, recipe.tileSize);
      if (!boundsOverlap(bounds, recipe.bounds)) continue;
      const center = { x: (bounds.minX + bounds.maxX) * 0.5, z: (bounds.minZ + bounds.maxZ) * 0.5 };
      const distance = Math.hypot(center.x - focus.x, center.z - focus.z);
      const ring = recipe.lodRings.find((candidate) => distance <= candidate.radius + recipe.tileSize * 0.72);
      if (!ring) continue;
      const seed = deriveSeed(recipe.seed, "tile", tileX, tileZ);
      tiles.push({
        id: `terrain.${tileX}.${tileZ}.lod${ring.level}`,
        tileX,
        tileZ,
        column: tileX,
        row: tileZ,
        seed,
        ringId: ring.id,
        lod: ring.level,
        step: ring.step,
        resolution: recipe.tileSize / ring.step,
        collision: ring.collision,
        featureDensity: ring.featureDensity,
        x: center.x,
        z: center.z,
        size: recipe.tileSize,
        vertexGrid: recipe.tileSize / ring.step,
        lodBand: ring.id.replace("lod-", ""),
        strataBands: ["sandstone-base", "red-rock-mid", "dark-shadow-seam", "pale-ridge-cap"],
        bounds: clampBounds(bounds, recipe.bounds),
        center,
      });
    }
  }

  return tiles.sort((a, b) => a.lod - b.lod || a.tileZ - b.tileZ || a.tileX - b.tileX);
}

export function createSeededTileFeatures(tile, recipe = GOLD_RUSH_WORLD_RECIPE) {
  const count = Math.max(0, Math.round(7 * tile.featureDensity));
  const features = [];
  for (let index = 0; index < count; index += 1) {
    const seed = deriveSeed(tile.seed, "feature", index);
    const x = lerp(tile.bounds.minX + 8, tile.bounds.maxX - 8, random01(seed));
    const z = lerp(tile.bounds.minZ + 8, tile.bounds.maxZ - 8, random01(seed ^ 0x9e3779b9));
    if (insideAuthoredClearance(x, z)) continue;
    const slope = sampleSeededTerrainSlope(x, z, recipe);
    if (slope > 1.15) continue;
    const kindRoll = random01(seed ^ 0x85ebca6b);
    features.push({
      id: `feature.${tile.tileX}.${tile.tileZ}.${index}`,
      tileId: tile.id,
      seed,
      kind: kindRoll > 0.84 ? "cactus" : kindRoll > 0.32 ? "rock" : "scrub",
      position: { x, y: sampleSeededTerrainHeight(x, z, recipe), z },
      yaw: random01(seed ^ 0xc2b2ae35) * Math.PI * 2,
      scale: 0.65 + random01(seed ^ 0x27d4eb2f) * 1.35,
      lifecycle: "owned-by-terrain-tile",
    });
  }
  return features;
}

export function sampleSeededTerrainHeight(x, z, recipe = GOLD_RUSH_WORLD_RECIPE) {
  const terrain = recipe.terrain;
  const macro = fractalNoise(x / terrain.macroScale, z / terrain.macroScale, recipe.seed, 4) * terrain.macroHeight;
  const ridgeNoise = Math.abs(fractalNoise(x / terrain.ridgeScale, z / terrain.ridgeScale, recipe.seed ^ 0x7f4a7c15, 3));
  const ridge = smoothstep(0.36, 0.82, ridgeNoise) * terrain.ridgeHeight;
  const detail = fractalNoise(x / terrain.detailScale, z / terrain.detailScale, recipe.seed ^ 0x165667b1, 3) * terrain.detailHeight;
  const drainage = -Math.pow(Math.max(0, 0.34 - Math.abs(valueNoise(x / 510, z / 510, recipe.seed ^ 0xd3a2646c))), 2) * 26;
  const procedural = macro + ridge + detail + drainage;
  const authored = sampleAuthoredBasinHeight(x, z);
  const authoredWeight = 1 - smoothstep(92, 250, Math.hypot(x, z));
  return lerp(procedural, authored, authoredWeight);
}

export function sampleSeededTerrainColor(x, z, recipe = GOLD_RUSH_WORLD_RECIPE) {
  const height = sampleSeededTerrainHeight(x, z, recipe);
  const slope = sampleSeededTerrainSlope(x, z, recipe);
  const routeDistance = Math.min(...GOLD_RUSH_GREYBOX_LAYOUT.routes.map((route) => distanceToPolyline(x, z, route.points)));
  if (Math.hypot(x, z) < 130 && routeDistance < 7) return 0x75502e;
  if (slope > 1.25 || height > 35) return 0x6f321f;
  if (slope > 0.72 || height > 20) return 0x9e4c2d;
  const biome = valueNoise(x / 185, z / 185, recipe.seed ^ 0x94d049bb);
  if (biome > 0.48) return 0x8b753f;
  if (biome < -0.42) return 0xb8894c;
  return 0xa6763e;
}

export function sampleSeededTerrainSlope(x, z, recipe = GOLD_RUSH_WORLD_RECIPE, step = 2) {
  const dx = (sampleSeededTerrainHeight(x + step, z, recipe) - sampleSeededTerrainHeight(x - step, z, recipe)) / (step * 2);
  const dz = (sampleSeededTerrainHeight(x, z + step, recipe) - sampleSeededTerrainHeight(x, z - step, recipe)) / (step * 2);
  return Math.hypot(dx, dz);
}

export function deriveSeed(parentSeed, ...parts) {
  let hash = parentSeed >>> 0;
  for (const part of parts) {
    const text = String(part);
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
  }
  return hash >>> 0;
}

export function validateSeededWorldRecipe(recipe = GOLD_RUSH_WORLD_RECIPE) {
  const failures = [];
  if (recipe.width < 10000 || recipe.depth < 10000) failures.push("world-must-be-at-least-ten-kilometers");
  if (recipe.width % recipe.tileSize !== 0 || recipe.depth % recipe.tileSize !== 0) failures.push("world-bounds-must-align-to-tiles");
  if (recipe.lodRings.length < 4) failures.push("missing-concentric-lod-rings");
  if (recipe.lodRings.some((ring, index) => index > 0 && ring.radius <= recipe.lodRings[index - 1].radius)) failures.push("lod-radii-must-increase");
  if (recipe.lodRings.some((ring, index) => index > 0 && ring.step <= recipe.lodRings[index - 1].step)) failures.push("lod-step-must-coarsen");
  if (recipe.lodRings.some((ring) => recipe.tileSize % ring.step !== 0)) failures.push("lod-step-must-divide-tile-size");
  return { passed: failures.length === 0, failures };
}

function sampleAuthoredBasinHeight(x, z) {
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

function shelfInfluence(shelf, x, z) {
  if (!shelf) return 0;
  const radius = Math.hypot((x - shelf.x) / (shelf.width * 0.5), (z - shelf.z) / (shelf.depth * 0.5));
  return smoothstep(1.15, 0.72, radius) * shelf.elevation;
}

function insideAuthoredClearance(x, z) {
  if (Math.hypot(x, z) > 145) return false;
  const routeDistance = Math.min(...GOLD_RUSH_GREYBOX_LAYOUT.routes.map((route) => distanceToPolyline(x, z, route.points)));
  return routeDistance < 8 || GOLD_RUSH_GREYBOX_LAYOUT.landmarks.some((landmark) => Math.hypot(x - landmark.x, z - landmark.z) < 11);
}

function distanceToPolyline(x, z, points) {
  let nearest = Number.POSITIVE_INFINITY;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const lengthSquared = dx * dx + dz * dz;
    const t = lengthSquared === 0 ? 0 : clamp01(((x - start.x) * dx + (z - start.z) * dz) / lengthSquared);
    nearest = Math.min(nearest, Math.hypot(x - (start.x + dx * t), z - (start.z + dz * t)));
  }
  return nearest;
}

function fractalNoise(x, z, seed, octaves) {
  let total = 0;
  let amplitude = 1;
  let frequency = 1;
  let normalizer = 0;
  for (let octave = 0; octave < octaves; octave += 1) {
    total += valueNoise(x * frequency, z * frequency, seed + octave * 1013) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return total / normalizer;
}

function valueNoise(x, z, seed) {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const tx = smootherStep(x - x0);
  const tz = smootherStep(z - z0);
  const a = signedRandom(seed, x0, z0);
  const b = signedRandom(seed, x0 + 1, z0);
  const c = signedRandom(seed, x0, z0 + 1);
  const d = signedRandom(seed, x0 + 1, z0 + 1);
  return lerp(lerp(a, b, tx), lerp(c, d, tx), tz);
}

function signedRandom(seed, x, z) {
  let hash = seed ^ Math.imul(x, 0x1f123bb5) ^ Math.imul(z, 0x5f356495);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0xffffffff * 2 - 1;
}

function random01(seed) {
  return (deriveSeed(seed, "random") >>> 0) / 0xffffffff;
}

function tileBounds(tileX, tileZ, tileSize) {
  return {
    minX: tileX * tileSize,
    maxX: (tileX + 1) * tileSize,
    minZ: tileZ * tileSize,
    maxZ: (tileZ + 1) * tileSize,
  };
}

function clampBounds(bounds, worldBounds) {
  return {
    minX: Math.max(bounds.minX, worldBounds.minX),
    maxX: Math.min(bounds.maxX, worldBounds.maxX),
    minZ: Math.max(bounds.minZ, worldBounds.minZ),
    maxZ: Math.min(bounds.maxZ, worldBounds.maxZ),
  };
}

function boundsOverlap(a, b) {
  return a.maxX > b.minX && a.minX < b.maxX && a.maxZ > b.minZ && a.minZ < b.maxZ;
}

function smootherStep(value) {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
