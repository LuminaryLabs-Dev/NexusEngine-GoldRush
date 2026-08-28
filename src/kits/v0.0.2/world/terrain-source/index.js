import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import {
  createAuthoredTerrainSourceSnapshot,
  createGoldRushAuthoredTerrainFixture,
  validateAuthoredTerrainSourceFixture,
} from "../../../../content/goldrushAuthoredTerrainFixture.js";
import {
  GOLD_RUSH_WORLD_RECIPE,
  createActiveTerrainTiles,
  createSeededTileFeatures,
  createSeededWorldSnapshot,
  sampleSeededTerrainHeight,
  validateSeededWorldRecipe,
} from "./seededWorld.js";

export const domainPath = "n:world:terrain-source";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  const recipe = options.recipe ?? GOLD_RUSH_WORLD_RECIPE;
  return {
    ...runtime,
    sampleHeight(point) {
      return sampleSeededTerrainHeight(point.x, point.z, recipe);
    },
    activeTiles(focus = { x: 0, z: 0 }) {
      return createActiveTerrainTiles({ focus, recipe });
    },
    tileFeatures(tile) {
      return createSeededTileFeatures(tile, recipe);
    },
    snapshot(extra = {}) {
      return runtime.snapshot({
        source: createAuthoredTerrainSourceSnapshot(source),
        world: createSeededWorldSnapshot(recipe),
        authoredRegions: [{
          id: source.worldLayout.id,
          role: "spawn-basin-region",
          bounds: structuredClone(source.worldLayout.playableBounds),
        }],
        ...extra,
      });
    },
    validate() {
      const runtimeValidation = runtime.validate();
      const sourceValidation = validateAuthoredTerrainSourceFixture(source);
      const worldValidation = validateSeededWorldRecipe(recipe);
      return {
        passed: runtimeValidation.passed && sourceValidation.passed && worldValidation.passed,
        failures: [...runtimeValidation.failures, ...sourceValidation.failures, ...worldValidation.failures],
        domainPath,
        revisionId: source.revisionId,
        worldRevisionId: recipe.revisionId,
      };
    },
  };
}

export default createKit;
