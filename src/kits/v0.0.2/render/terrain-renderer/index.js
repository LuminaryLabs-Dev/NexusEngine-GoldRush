import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import { createGoldRushAuthoredTerrainFixture } from "../../../../content/goldrushAuthoredTerrainFixture.js";

export const domainPath = "n:render:terrain-renderer";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  return {
    ...runtime,
    snapshot(extra = {}) {
      return runtime.snapshot({
        source: { fixtureId: source.fixtureId, revisionId: source.revisionId, sourceHash: source.sourceHash },
        presentation: {
          mode: "greybox-normal-area",
          layoutId: source.worldLayout.id,
          playableBounds: structuredClone(source.worldLayout.playableBounds),
          deferredLayers: ["player", "combat", "network", "decorative-assets", "micro-objects"],
        },
        ...extra,
      });
    },
  };
}

export default createKit;
