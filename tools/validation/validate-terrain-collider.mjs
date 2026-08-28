import { readFileSync } from "node:fs";
import {
  createCannonTerrainPhysics,
  createCannonTerrainPhysicsDescriptor,
  validateCannonTerrainPhysics,
} from "../../src/physics/cannonTerrainPhysics.js";
import {
  createTerrainColliderDescriptor,
  raycastTerrainDown,
  sampleTerrainCollider,
  terrainFieldHeight,
  validateTerrainColliderDescriptor,
} from "../../src/physics/terrainCollider.js";

const descriptor = createTerrainColliderDescriptor();
const cannonDescriptor = createCannonTerrainPhysicsDescriptor(descriptor);
const cannonPhysics = createCannonTerrainPhysics(descriptor);
const cannonValidation = validateCannonTerrainPhysics(cannonPhysics);
const validation = validateTerrainColliderDescriptor(descriptor);
assert(validation.passed, `terrain collider descriptor failed: ${validation.failures.join(", ")}`);
assert(cannonValidation.passed, `cannon terrain physics failed: ${cannonValidation.failures.join(", ")}`);
assert(descriptor.id === "goldrush.terrain.collider.heightfield", "terrain collider must expose the shared heightfield id");
assert(descriptor.samples.length === descriptor.columns * descriptor.rows, "terrain collider heightfield sample count must match rows and columns");
assert(descriptor.bridgeTargets.includes("cannon-es-heightfield"), "terrain collider must be bridgeable to cannon-es heightfields");
assert(descriptor.bridgeTargets.includes("rapier-heightfield"), "terrain collider must be bridgeable to Rapier heightfields");
assert(descriptor.raycast.mode === "downward-triangle-raycast", "terrain collider must declare downward raycast placement");
assert(cannonDescriptor.body.shape === "Heightfield", "cannon terrain physics descriptor must use a Heightfield body");
assert(cannonPhysics.bodyCount === 1 && cannonPhysics.shapeCount === 1, "cannon terrain physics must create one static terrain body with one shape");
assert(cannonPhysics.heightMatrix.length === descriptor.rows && cannonPhysics.heightMatrix[0].length === descriptor.columns, "cannon height matrix must match collider rows and columns");
assert(Number.isFinite(terrainFieldHeight(-12, -20)), "terrain height sampler must return finite player spawn height");

const spawnHit = raycastTerrainDown({ x: -12, z: -20 });
assert(spawnHit?.kind === "downward-triangle-raycast", "player placement must raycast down onto a terrain triangle");
assert(spawnHit.bandId === "canonical-world-band", "player spawn should hit the canonical world band");
const spawnGround = sampleTerrainCollider({ x: -12, z: -20 });
assert(spawnGround.kind === "sampled-heightfield", "terrain sampler must identify sampled heightfield ground");
assert(spawnGround.placement === "downward-triangle-raycast", "terrain sampler must use downward raycast placement");
assert(spawnGround.walkable, "player spawn should be walkable");
assert(Number.isFinite(spawnGround.height), "player spawn height must be finite");
assert(spawnGround.normal.y > 0.25, "terrain normal must be usable for grounded movement");

const westBoundary = sampleTerrainCollider({ x: -85, z: 0 });
assert(!westBoundary.walkable, "canonical canyon boundary must block player traversal");
assert(westBoundary.blockingFeatureId === "blocker.west-wall", "boundary blocker must report its canonical feature id");

const proceduralSource = readFileSync(new URL("../../src/renderer/proceduralKits.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
const colliderSource = readFileSync(new URL("../../src/physics/terrainCollider.js", import.meta.url), "utf8");
assert(!proceduralSource.includes("function terrainFieldHeight"), "renderer must not own a duplicate terrain height function");
assert(!proceduralSource.includes("function terrainFieldColor"), "renderer must not own a duplicate terrain color function");
assert(proceduralSource.includes("terrainGroundHeight"), "renderer must consume local player sampled ground when available");
assert(appSource.includes("sampleTerrainCollider"), "app movement controller must use the shared terrain sampler");
assert(appSource.includes("raycastTerrainDown"), "app movement controller must place the player by downward terrain raycast");
assert(appSource.includes("terrainColliderDescriptor"), "browser state must expose the terrain collider descriptor");
assert(appSource.includes("terrainPhysics"), "browser state must expose the terrain physics descriptor");
assert(colliderSource.includes("trailBanks") && colliderSource.includes("basinBowl") && colliderSource.includes("goldFaceLift"), "terrain collider must preserve the canonical greybox height algorithm");
assert(!colliderSource.includes("centralMountainLift"), "open basin terrain must not contain legacy central mountain lift");

console.log("terrain collider passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
