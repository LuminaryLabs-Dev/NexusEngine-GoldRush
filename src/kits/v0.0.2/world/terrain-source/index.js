import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";
import {
  createAuthoredTerrainSourceSnapshot,
  createGoldRushAuthoredTerrainFixture,
  validateAuthoredTerrainSourceFixture,
} from "../../../../content/goldrushAuthoredTerrainFixture.js";

export const domainPath = "n:world:terrain-source";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  const runtime = createV002KitRuntime(domainPath, options);
  const source = createGoldRushAuthoredTerrainFixture(options.source);
  return {
    ...runtime,
    snapshot(extra = {}) {
      return runtime.snapshot({ source: createAuthoredTerrainSourceSnapshot(source), ...extra });
    },
    validate() {
      const runtimeValidation = runtime.validate();
      const sourceValidation = validateAuthoredTerrainSourceFixture(source);
      return {
        passed: runtimeValidation.passed && sourceValidation.passed,
        failures: [...runtimeValidation.failures, ...sourceValidation.failures],
        domainPath,
        revisionId: source.revisionId,
      };
    },
  };
}

export default createKit;
