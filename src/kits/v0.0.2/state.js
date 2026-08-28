import {
  V002_VERSION,
  createV002ProofGroupSnapshots,
  createV002RegistrySnapshot,
  validateV002Registry,
} from "./registry.js";
import { createKit as createTerrainSourceKit } from "./world/terrain-source/index.js";
import { createKit as createTerrainRendererKit } from "./render/terrain-renderer/index.js";
import { createKit as createTerrainColliderKit } from "./physics/terrain-collider/index.js";
import { createKit as createDesertMapKit } from "./goldrush/desert-map/index.js";

export function createV002GoldRushState({ screen = "unknown", scenario = null, sceneKitLoader = null } = {}) {
  const registry = createV002RegistrySnapshot();
  const proofGroups = createV002ProofGroupSnapshots();
  const validation = validateV002Registry();
  const terrainSource = createTerrainSourceKit();
  const terrainRenderer = createTerrainRendererKit();
  const terrainCollider = createTerrainColliderKit();
  const desertMap = createDesertMapKit();
  terrainSource.install({ version: V002_VERSION });
  terrainRenderer.install({ version: V002_VERSION });
  terrainCollider.install({ version: V002_VERSION });
  desertMap.install({ version: V002_VERSION });
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
      terrainSource: terrainSource.snapshot(),
      terrainRenderer: terrainRenderer.snapshot(),
      terrainCollider: terrainCollider.snapshot(),
      desertMap: desertMap.snapshot(),
      integratedLoop: registry.integratedLoop,
    },
    events: [
      { type: "v002.registry.snapshotted", version: V002_VERSION },
      { type: "v002.proofGroups.ready", count: proofGroups.length },
    ],
    validation,
  };
}
