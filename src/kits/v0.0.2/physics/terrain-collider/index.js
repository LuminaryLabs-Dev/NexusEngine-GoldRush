import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import { createGoldRushAuthoredTerrainFixture } from "../../../../content/goldrushAuthoredTerrainFixture.js";
import { createTerrainColliderDescriptor } from "../../../../physics/terrainCollider.js";

export const domainPath = "n:physics:terrain-collider";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  const collider = createTerrainColliderDescriptor(source.worldLayout.playableBounds);
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
        },
        ...extra,
      });
    },
  };
}

export default createKit;
