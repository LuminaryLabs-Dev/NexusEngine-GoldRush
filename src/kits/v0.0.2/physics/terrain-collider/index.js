import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import { createGoldRushAuthoredTerrainFixture } from "../../../../content/goldrushAuthoredTerrainFixture.js";
import { createTerrainColliderDescriptor } from "../../../../physics/terrainCollider.js";
import { GOLD_RUSH_WORLD_RECIPE } from "../../world/terrain-source/seededWorld.js";

export const domainPath = "n:physics:terrain-collider";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  const collider = createTerrainColliderDescriptor();
  return {
    ...runtime,
    snapshot(extra = {}) {
      return runtime.snapshot({
        source: { fixtureId: source.fixtureId, revisionId: source.revisionId, sourceHash: source.sourceHash },
        collider: {
          id: collider.id,
          bounds: collider.bounds,
          columns: collider.columns,
          rows: collider.rows,
          sampleCount: collider.samples.length,
          mode: "camera-local-tiled-collision-window",
          worldBounds: structuredClone(GOLD_RUSH_WORLD_RECIPE.bounds),
          worldRevisionId: GOLD_RUSH_WORLD_RECIPE.revisionId,
        },
        ...extra,
      });
    },
  };
}

export default createKit;
