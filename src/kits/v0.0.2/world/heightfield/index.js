import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import {
  createGoldRushAuthoredTerrainFixture,
} from "../../../../content/goldrushAuthoredTerrainFixture.js";
import {
  GOLD_RUSH_WORLD_RECIPE,
  sampleSeededTerrainHeight,
  sampleSeededTerrainSlope,
} from "../terrain-source/seededWorld.js";

export const domainPath = "n:world:heightfield";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  return {
    ...runtime,
    sampleGround(point) {
      const sampleStep = 2;
      const height = sampleSeededTerrainHeight(point.x, point.z, GOLD_RUSH_WORLD_RECIPE);
      const dx = (sampleSeededTerrainHeight(point.x + sampleStep, point.z) - sampleSeededTerrainHeight(point.x - sampleStep, point.z)) / (sampleStep * 2);
      const dz = (sampleSeededTerrainHeight(point.x, point.z + sampleStep) - sampleSeededTerrainHeight(point.x, point.z - sampleStep)) / (sampleStep * 2);
      const length = Math.hypot(dx, 1, dz);
      return {
        x: point.x,
        y: height,
        z: point.z,
        height,
        slopeGrade: sampleSeededTerrainSlope(point.x, point.z),
        normal: { x: -dx / length, y: 1 / length, z: -dz / length },
        sourceRevisionId: GOLD_RUSH_WORLD_RECIPE.revisionId,
      };
    },
    snapshot(extra = {}) {
      return runtime.snapshot({
        source: { fixtureId: source.fixtureId, revisionId: source.revisionId, sourceHash: source.sourceHash },
        heightfield: {
          gridId: "goldrush.seeded-heightfield",
          width: GOLD_RUSH_WORLD_RECIPE.width,
          height: GOLD_RUSH_WORLD_RECIPE.depth,
          tileSize: GOLD_RUSH_WORLD_RECIPE.tileSize,
          sourceRevisionId: GOLD_RUSH_WORLD_RECIPE.revisionId,
        },
        ...extra,
      });
    },
  };
}

export default createKit;
