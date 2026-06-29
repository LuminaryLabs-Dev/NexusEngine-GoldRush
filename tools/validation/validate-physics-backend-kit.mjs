import {
  createPhysicsBackendDecision,
  validatePhysicsBackendDecision,
} from "../../src/physics/physicsBackendKit.js";
import { createCannonTerrainPhysicsDescriptor } from "../../src/physics/cannonTerrainPhysics.js";
import { createTerrainColliderDescriptor } from "../../src/physics/terrainCollider.js";

const terrainColliderDescriptor = createTerrainColliderDescriptor();
const terrainPhysicsDescriptor = createCannonTerrainPhysicsDescriptor(terrainColliderDescriptor);
const decision = createPhysicsBackendDecision({
  terrainColliderDescriptor,
  terrainPhysicsDescriptor,
});
const validation = validatePhysicsBackendDecision(decision);

assert(validation.passed, `physics backend decision failed: ${validation.failures.join(", ")}`);
assert(decision.activeBackend === "cannon-es", "cannon-es should remain the active backend for the current stable terrain pass");
assert(decision.recommendation.includes("rapier-later"), "backend decision should retain the Rapier migration path");
assert(decision.dataExposed.terrainShape === "Heightfield", "active backend must expose the terrain heightfield shape");
assert(decision.characterControllerPlan.current === "camera-relative-wasd-plus-raycast-grounding", "current controller plan should match camera-relative movement");

console.log(JSON.stringify({
  status: "physics-backend-kit-ready",
  activeBackend: decision.activeBackend,
  recommendation: decision.recommendation,
  candidates: decision.candidates.map((candidate) => ({
    id: candidate.id,
    status: candidate.status,
    bestForNow: candidate.bestForNow,
  })),
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
