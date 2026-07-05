import {
  V002_VERSION,
  createV002ProofGroupSnapshots,
  createV002RegistrySnapshot,
  validateV002Registry,
} from "./registry.js";

export function createV002GoldRushState({ screen = "unknown", scenario = null, sceneKitLoader = null } = {}) {
  const registry = createV002RegistrySnapshot();
  const proofGroups = createV002ProofGroupSnapshots();
  const validation = validateV002Registry();
  return {
    version: V002_VERSION,
    status: validation.passed ? "architecture-scaffold-ready" : "architecture-scaffold-invalid",
    domains: registry.domains,
    kits: registry.kits,
    proofGroups,
    snapshots: {
      activeScreen: screen,
      activeSceneSite: sceneKitLoader?.activeSite ?? null,
      inheritedTerrainRevision: scenario?.authoredTerrain?.revisionId ?? scenario?.terrainState?.authoredSource?.revisionId ?? null,
      integratedLoop: registry.integratedLoop,
    },
    events: [
      { type: "v002.registry.snapshotted", version: V002_VERSION },
      { type: "v002.proofGroups.ready", count: proofGroups.length },
    ],
    validation,
  };
}
