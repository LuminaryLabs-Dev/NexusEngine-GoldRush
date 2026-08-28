import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import { createGoldRushAuthoredTerrainFixture } from "../../../../content/goldrushAuthoredTerrainFixture.js";

export const domainPath = "n:goldrush:desert-map";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  return {
    ...runtime,
    snapshot(extra = {}) {
      return runtime.snapshot({
        source: { fixtureId: source.fixtureId, revisionId: source.revisionId, sourceHash: source.sourceHash },
        layout: structuredClone(source.worldLayout),
        hierarchy: ["canyon-entrance", "basin", "mine-shelf", "town-cashout-shelf"],
        ...extra,
      });
    },
  };
}

export default createKit;
