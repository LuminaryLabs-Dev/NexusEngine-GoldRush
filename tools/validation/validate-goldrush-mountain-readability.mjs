import { readFileSync } from "node:fs";
import { createGoldRushProceduralScene } from "../../src/renderer/proceduralKits.js";
import {
  CENTRAL_MOUNTAIN_FORMS,
  raycastTerrainDown,
  sampleMountainViewClearanceMask,
  sampleMountainWalkaroundClearance,
  sampleTerrainCollider,
  terrainFieldColor,
  terrainFieldHeight,
} from "../../src/physics/terrainCollider.js";

const descriptors = createGoldRushProceduralScene();
const centralMountains = descriptors.canyonComposition.centralMountains;

assert(CENTRAL_MOUNTAIN_FORMS.length >= 3, "mountain forms must remain present");
assert(centralMountains.length >= 3, "renderer must expose central mountain descriptors");
assert(centralMountains.every((mountain) => mountain.composition === "midground-walkaround-terraced-shoulders"), "mountains must be terraced midground landmarks");
assert(centralMountains.every((mountain) => mountain.visualHeight <= 5.5), "visible mountain meshes must not become foreground slabs");
assert(centralMountains.every((mountain) => mountain.visualHeight < mountain.height), "visual mountain caps must be lower than collider heightfield mass");
assert(centralMountains.every((mountain) => mountain.blockerRadius >= 6), "mountains must still block direct traversal through the core");

const spawn = sampleTerrainCollider({ x: -12, z: -20 });
const approach = sampleTerrainCollider({ x: -4, z: -7.5 });
const westRoute = sampleTerrainCollider({ x: -26, z: 6 });
const eastRoute = sampleTerrainCollider({ x: 25, z: 6 });
const mountainCore = sampleTerrainCollider({ x: 9.2, z: 13.4 });

assert(spawn.walkable, "spawn must remain walkable");
assert(approach.walkable, "spawn-facing mountain approach must remain walkable");
assert(westRoute.walkable, "west walkaround corridor must be walkable");
assert(eastRoute.walkable, "east walkaround corridor must be walkable");
assert(!mountainCore.walkable && mountainCore.blockingFeatureId === "central-mountain.gold-spine", "mountain core must still block traversal");
assert(sampleMountainViewClearanceMask(-4, -7.5) > 0.35, "spawn-facing view corridor must have clearance mask");
assert(sampleMountainWalkaroundClearance(-26, 6) > 0.35, "west route must have walkaround clearance");
assert(sampleMountainWalkaroundClearance(25, 6) > 0.35, "east route must have walkaround clearance");

const nearCorridorHeight = terrainFieldHeight(-4, -7.5);
const coreHeight = terrainFieldHeight(9.2, 13.4);
assert(coreHeight > nearCorridorHeight + 2.6, "mountain core must still read taller than the cleared approach");
assert(Number.isInteger(terrainFieldColor(9.2, 13.4)), "mountain color must remain centralized");
assert(raycastTerrainDown({ x: -4, z: -7.5 })?.bandId === "near-play-band", "approach must raycast to visible terrain");

const proceduralSource = readFileSync(new URL("../../src/renderer/proceduralKits.js", import.meta.url), "utf8");
const colliderSource = readFileSync(new URL("../../src/physics/terrainCollider.js", import.meta.url), "utf8");
assert(proceduralSource.includes("createWalkaroundMountainGeometry"), "renderer must use terraced mountain geometry");
assert(proceduralSource.includes("midground-walkaround-terraced-shoulders"), "renderer descriptor must name the BUG-002 composition intent");
assert(colliderSource.includes("sampleCentralMountainHeight"), "heightfield must own central mountain shaping");
assert(colliderSource.includes("sampleMountainViewClearanceMask"), "heightfield must own camera-view clearance");
assert(colliderSource.includes("sampleMountainWalkaroundClearance"), "heightfield must own walkaround clearance");

console.log(JSON.stringify({
  status: "goldrush-mountain-readability-ready",
  mountainCount: centralMountains.length,
  maxVisualHeight: Math.max(...centralMountains.map((mountain) => mountain.visualHeight)),
  routeSamples: {
    spawn: summarizeGround(spawn),
    approach: summarizeGround(approach),
    westRoute: summarizeGround(westRoute),
    eastRoute: summarizeGround(eastRoute),
    mountainCore: summarizeGround(mountainCore),
  },
  clearance: {
    view: Number(sampleMountainViewClearanceMask(-4, -7.5).toFixed(3)),
    west: Number(sampleMountainWalkaroundClearance(-26, 6).toFixed(3)),
    east: Number(sampleMountainWalkaroundClearance(25, 6).toFixed(3)),
  },
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
