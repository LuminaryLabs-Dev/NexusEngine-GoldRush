import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import {
  createGoldRushAuthoredTerrainFixture,
  sampleAuthoredTerrainGround,
} from "../../../../content/goldrushAuthoredTerrainFixture.js";

export const domainPath = "n:world:heightfield";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  return {
    ...runtime,
    sampleGround(point) {
      return sampleAuthoredTerrainGround(source, point);
    },
    snapshot(extra = {}) {
      return runtime.snapshot({
        source: { fixtureId: source.fixtureId, revisionId: source.revisionId, sourceHash: source.sourceHash },
        heightfield: { gridId: source.heightSamples.gridId, width: source.heightSamples.width, height: source.heightSamples.height },
        ...extra,
      });
    },
  };
}

export default createKit;
