import { readFileSync } from "node:fs";
import { GOLD_RUSH_GREYBOX_LAYOUT } from "../../src/content/goldrushAuthoredTerrainFixture.js";
import { createGoldRushProceduralScene } from "../../src/renderer/proceduralKits.js";
import {
  raycastTerrainDown,
  sampleTerrainCollider,
  terrainFieldColor,
  terrainFieldHeight,
} from "../../src/physics/terrainCollider.js";

const descriptors = createGoldRushProceduralScene();
const layout = descriptors.greyboxLayout;
const samples = {
  spawn: sampleTerrainCollider({ x: -12, z: -20 }),
  basinCenter: sampleTerrainCollider({ x: 0, z: -4 }),
  formerNorthSpur: sampleTerrainCollider({ x: -8.5, z: 29 }),
  formerGoldSpine: sampleTerrainCollider({ x: 9.2, z: 17.4 }),
  formerSouthShoulder: sampleTerrainCollider({ x: -17.5, z: 6.8 }),
  westBoundary: sampleTerrainCollider({ x: -85, z: 0 }),
  eastBoundary: sampleTerrainCollider({ x: 85, z: 0 }),
};

assert(layout.id === GOLD_RUSH_GREYBOX_LAYOUT.id, "renderer must consume the canonical greybox layout");
assert(layout.playableBounds.width === 180 && layout.playableBounds.depth === 110, "greybox must preserve the bounded normal-area footprint");
assert(layout.canyonWalls.length >= 10, "canyon walls must frame the basin perimeter");
assert(!Object.hasOwn(descriptors.canyonComposition, "centralMountains"), "open basin must not retain central mountain descriptors");
assert(samples.spawn.walkable && samples.basinCenter.walkable, "spawn and basin center must remain walkable");
assert(samples.formerNorthSpur.walkable && samples.formerGoldSpine.walkable && samples.formerSouthShoulder.walkable, "legacy central mountain footprints must be open terrain");
assert(!samples.westBoundary.walkable && samples.westBoundary.blockingFeatureId === "blocker.west-wall", "west canyon boundary must block traversal");
assert(!samples.eastBoundary.walkable && samples.eastBoundary.blockingFeatureId === "blocker.east-wall", "east canyon boundary must block traversal");
assert(Math.max(
  terrainFieldHeight(-8.5, 29),
  terrainFieldHeight(9.2, 17.4),
  terrainFieldHeight(-17.5, 6.8)
) - terrainFieldHeight(0, -4) < 3, "basin center must not contain isolated mountain spikes");
assert(Number.isInteger(terrainFieldColor(9.2, 17.4)), "terrain color must remain centralized");
assert(raycastTerrainDown({ x: 0, z: -4 })?.bandId === "canonical-world-band", "basin center must raycast to the canonical terrain surface");

const proceduralSource = readFileSync(new URL("../../src/renderer/proceduralKits.js", import.meta.url), "utf8");
const colliderSource = readFileSync(new URL("../../src/physics/terrainCollider.js", import.meta.url), "utf8");
assert(proceduralSource.includes("open-center-with-boundary-canyon-walls"), "renderer must declare the open-basin presentation intent");
assert(!proceduralSource.includes("createWalkaroundMountainGeometry"), "renderer must not retain central mountain geometry");
assert(!colliderSource.includes("centralMountainLift"), "heightfield must not retain central mountain shaping");

console.log(JSON.stringify({
  status: "goldrush-basin-readability-ready",
  layoutId: layout.id,
  bounds: layout.playableBounds,
  canyonWallCount: layout.canyonWalls.length,
  samples: Object.fromEntries(Object.entries(samples).map(([id, ground]) => [id, summarizeGround(ground)])),
}, null, 2));

function summarizeGround(ground) {
  return {
    height: Number(ground.height.toFixed(3)),
    slopeGrade: Number(ground.slopeGrade.toFixed(3)),
    walkable: ground.walkable,
    blockingFeatureId: ground.blockingFeatureId,
    bandId: ground.hit?.bandId ?? null,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
