import { getV002KitByDomainPath } from "../../registry.js";
import { createV002KitRuntime } from "../../kitRuntime.js";

export const domainPath = "n:network:party-room";
export const kitContract = getV002KitByDomainPath(domainPath);

export function createKit(options = {}) {
  return createV002KitRuntime(domainPath, options);
}

export default createKit;
