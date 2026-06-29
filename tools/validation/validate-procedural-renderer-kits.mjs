import { readFileSync } from "node:fs";
import { createGoldRushProceduralScene, validateProceduralRendererKits } from "../../src/renderer/proceduralKits.js";

const descriptors = createGoldRushProceduralScene();
const validation = validateProceduralRendererKits(descriptors);

for (const entry of validation.entries) {
  assert(entry.passed, `${entry.id} failed procedural kit validation`);
}

assert(descriptors.terrain.patches.length >= 250, "terrain must use many small tessellated patches");
assert(descriptors.terrain.width > descriptors.terrain.depth, "terrain must read as a broad landscape, not an arena token");
assert(descriptors.terrain.width >= 48 && descriptors.terrain.depth >= 30, "terrain footprint is too small");
assert(descriptors.route.routePoints[0].x < -20, "route must start near the far terrain edge");
assert(descriptors.route.routePoints.at(-1).x > 20, "route must cross toward the far terrain edge");
assert(descriptors.goldNodes.nodes.length >= 24, "gold node scatter is too sparse for massive terrain");

const rendererSource = readFileSync(new URL("../../src/renderer/goldRushRenderer.js", import.meta.url), "utf8");
assert(!rendererSource.includes("CircleGeometry"), "renderer must not use circular arena primitive");
assert(!rendererSource.includes("BoxGeometry"), "renderer must not use box markers as the core player field");

console.log("procedural renderer kits passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
