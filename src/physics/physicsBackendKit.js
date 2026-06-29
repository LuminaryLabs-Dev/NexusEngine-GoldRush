export function createPhysicsBackendDecision({
  terrainColliderDescriptor = null,
  terrainPhysicsDescriptor = null,
} = {}) {
  return {
    id: "n-physics-backend-decision-kit",
    domainPath: "n:physics:backend-decision",
    purpose: "Choose the smallest reliable physics backend for the current Gold Rush slice while keeping a Rapier migration path.",
    activeBackend: "cannon-es",
    recommendation: "keep-cannon-now-incubate-rapier-later",
    reason: "The repo already has cannon-es installed and bridged to the terrain heightfield. Rapier is better for the later capsule/kinematic character-controller pass, but it adds a new async/WASM adapter before the current terrain, train, and camera loop is stable.",
    publicApi: ["snapshot", "validate", "selectBackend"],
    internalApi: ["createStaticHeightfield", "syncTerrainCollider", "adaptFutureKinematicController"],
    events: ["physics.backend.selected", "physics.heightfield.synced", "physics.backend.candidateLogged"],
    snapshot: ["activeBackend", "candidateBackends", "terrainShape", "characterControllerPlan"],
    reset: "recreate-static-world-from-terrain-collider-descriptor",
    dataExposed: {
      activeBackend: "cannon-es",
      terrainShape: terrainPhysicsDescriptor?.body?.shape ?? "Heightfield",
      terrainColliderId: terrainColliderDescriptor?.id ?? null,
      terrainPhysicsId: terrainPhysicsDescriptor?.id ?? null,
    },
    validators: ["tools/validation/validate-physics-backend-kit.mjs"],
    graduationStatus: "incubating-generic-kit",
    candidates: [
      {
        id: "cannon-es",
        status: "active",
        bestForNow: true,
        strengths: [
          "installed dependency",
          "static terrain heightfield already wired",
          "no browser WASM initialization step",
          "matches the current raycast-grounded player controller",
        ],
        risks: [
          "not the final choice for high-fidelity capsule movement",
          "heightfield-only terrain collision still needs visible mesh parity checks",
        ],
      },
      {
        id: "rapier",
        status: "future-adapter",
        bestForNow: false,
        strengths: [
          "stronger long-term kinematic character-controller surface",
          "shape casts and collision queries fit proper over-shoulder movement",
          "better future path for dynamic bodies and props",
        ],
        risks: [
          "requires a new package and async/WASM initialization path",
          "needs a dedicated adapter, validators, and browser proof before replacing cannon-es",
        ],
      },
    ],
    characterControllerPlan: {
      current: "camera-relative-wasd-plus-raycast-grounding",
      next: "capsule-controller-adapter-behind-the-same-public-api",
      publicContractMustStay: true,
    },
  };
}

export function validatePhysicsBackendDecision(decision = createPhysicsBackendDecision()) {
  const failures = [];
  if (decision.domainPath !== "n:physics:backend-decision") failures.push("invalid-domain-path");
  if (decision.activeBackend !== "cannon-es") failures.push("unexpected-active-backend");
  if (!decision.candidates?.some((candidate) => candidate.id === "cannon-es" && candidate.status === "active")) {
    failures.push("missing-active-cannon-candidate");
  }
  if (!decision.candidates?.some((candidate) => candidate.id === "rapier" && candidate.status === "future-adapter")) {
    failures.push("missing-future-rapier-candidate");
  }
  if (!decision.publicApi?.includes("snapshot")) failures.push("missing-public-snapshot-api");
  if (!decision.internalApi?.includes("syncTerrainCollider")) failures.push("missing-terrain-sync-internal-api");
  if (decision.dataExposed?.terrainShape !== "Heightfield") failures.push("terrain-shape-not-heightfield");
  return {
    passed: failures.length === 0,
    failures,
    decision,
  };
}
