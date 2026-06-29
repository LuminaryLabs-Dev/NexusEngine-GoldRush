import { createGoldRushProceduralScene, createBandedTriangleTerrainGeometry } from "../../src/renderer/proceduralKits.js";
import {
  createTerrainContinuityDescriptor,
  raycastTerrainDown,
  terrainFieldColor,
  terrainFieldHeight,
  validateTerrainContinuityDescriptor,
} from "../../src/physics/terrainCollider.js";

const continuity = createTerrainContinuityDescriptor();
const continuityValidation = validateTerrainContinuityDescriptor(continuity);
assert(continuityValidation.passed, `terrain continuity descriptor failed: ${continuityValidation.failures.join(", ")}`);

const procedural = createGoldRushProceduralScene();
const geometry = createBandedTriangleTerrainGeometry(procedural.terrain);
const position = geometry.getAttribute("position");
const color = geometry.getAttribute("color");
const index = geometry.getIndex();

assert(position.count > 10000, "terrain should retain dense tessellated field geometry");
assert(index.count / 3 > 10000, "terrain should retain many small triangle patches");
assert(color.count === position.count, "terrain vertex colors should cover every vertex");

let upward = 0;
let downward = 0;
let finiteVertices = 0;
for (let vertex = 0; vertex < position.count; vertex += 1) {
  const x = position.getX(vertex);
  const y = position.getY(vertex);
  const z = position.getZ(vertex);
  if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) finiteVertices += 1;
  const r = color.getX(vertex);
  const g = color.getY(vertex);
  const b = color.getZ(vertex);
  assert(!(b > 0.62 && b > r * 1.2 && b > g * 1.05), "terrain vertex color should not be debug/sky blue");
}
assert(finiteVertices === position.count, "terrain vertices must be finite");

for (let i = 0; i < index.count; i += 3) {
  const a = readVertex(position, index.getX(i));
  const b = readVertex(position, index.getX(i + 1));
  const c = readVertex(position, index.getX(i + 2));
  const normalY = triangleNormalY(a, b, c);
  if (normalY > 0.0001) upward += 1;
  if (normalY < -0.0001) downward += 1;
}

assert(upward > downward * 3, `terrain top winding should be upward; upward=${upward}, downward=${downward}`);

const spawnHit = raycastTerrainDown({ x: -12, z: -20 });
const mineHit = raycastTerrainDown({ x: -17.5, z: -16.5 });
const extractionHit = raycastTerrainDown({ x: -33.5, z: -22.5 });
assert(spawnHit?.bandId === "near-play-band", "spawn should still raycast to near-play band");
assert(mineHit?.bandId === "near-play-band", "mine seam should still raycast to near-play band");
assert(extractionHit?.point && Number.isFinite(extractionHit.point.y), "extraction should still raycast to terrain");
assert(Number.isFinite(terrainFieldHeight(-17.5, -16.5)), "terrain height sampler should remain authoritative");
assert(Number.isInteger(terrainFieldColor(-17.5, -16.5)), "terrain color sampler should remain authoritative");

const source = await import("node:fs").then((fs) => fs.readFileSync("src/renderer/proceduralKits.js", "utf8"));
assert(source.includes("pushTerrainBandSkirts"), "renderer should generate terrain band skirts");
assert(source.includes("sampleTerrainRenderColor"), "renderer should use terrain render color sampler");
assert(source.includes("isCoveredByFinerTerrainBand"), "renderer should carve coarse terrain bands under finer bands to avoid stacked surface flicker");
assert(!source.includes("0x6f9eaa, roughness"), "terrain material must not use sky-blue debug color");

console.log(JSON.stringify({
  status: "terrain-continuity-ready",
  triangles: index.count / 3,
  vertices: position.count,
  upward,
  downward,
  bands: continuity.bands.map((band) => ({
    id: band.id,
    overlapCells: band.overlapCells,
    skirtDepth: band.skirtDepth,
    renderOrder: band.renderOrder,
  })),
}, null, 2));

function readVertex(position, index) {
  return {
    x: position.getX(index),
    y: position.getY(index),
    z: position.getZ(index),
  };
}

function triangleNormalY(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  return ab.z * ac.x - ab.x * ac.z;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
