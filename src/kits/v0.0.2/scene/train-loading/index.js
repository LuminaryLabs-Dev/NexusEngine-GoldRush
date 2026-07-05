import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";

export const domainPath = "n:scene:train-loading";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  return createV002KitRuntime(domainPath, options);
}

export default createKit;
