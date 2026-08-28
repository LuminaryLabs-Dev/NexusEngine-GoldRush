import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import { createGoldRushAuthoredTerrainFixture } from "../../../../content/goldrushAuthoredTerrainFixture.js";
import {
  GOLD_RUSH_WORLD_RECIPE,
  createActiveTerrainTiles,
  createSeededWorldSnapshot,
} from "../../world/terrain-source/seededWorld.js";

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
          mode: "seeded-streamed-world",
          layoutId: source.worldLayout.id,
          world: createSeededWorldSnapshot(GOLD_RUSH_WORLD_RECIPE),
          activeTiles: createActiveTerrainTiles({ focus: { x: -12, z: -20 } }).map((tile) => ({
            id: tile.id,
            lod: tile.lod,
            ringId: tile.ringId,
            bounds: tile.bounds,
          })),
          authoredSpawnRegion: structuredClone(source.worldLayout.playableBounds),
          deferredLayers: ["combat", "network", "approved-production-assets"],
        },
        ...extra,
      });
    },
  };
}

export default createKit;
