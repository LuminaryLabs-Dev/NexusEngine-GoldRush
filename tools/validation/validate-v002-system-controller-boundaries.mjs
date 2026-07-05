import { v002KitRegistry } from "../../src/kits/v0.0.2/registry.js";

const behaviorKits = v002KitRegistry.filter((kit) => kit.domain === "behavior");
const animationKits = v002KitRegistry.filter((kit) => kit.domain === "animation");
const renderKits = v002KitRegistry.filter((kit) => kit.domain === "render");
const executionKits = v002KitRegistry.filter((kit) => kit.executionRole === "execution-only");

assert(behaviorKits.length === 5, "v0.0.2 must have five behavior controller kits");
assert(animationKits.length === 7, "v0.0.2 must have seven animation execution kits");
assert(executionKits.some((kit) => kit.domainPath === "n:animation:knee-bend"), "knee bend must be a top-level execution kit");
assert(executionKits.some((kit) => kit.domainPath === "n:animation:arm-motion"), "arm motion must be a top-level execution kit");
assert(executionKits.some((kit) => kit.domainPath === "n:animation:tool-swing"), "tool swing must be a top-level execution kit");

for (const kit of behaviorKits) {
  assert(kit.kind === "system-controller", `behavior kit must be a system-controller: ${kit.domainPath}`);
  assert(kit.controllerRole === "system-controller", `behavior kit missing controller role: ${kit.domainPath}`);
  assert(!kit.executionRole, `behavior controller cannot be execution-only: ${kit.domainPath}`);
  assert(kit.purpose.includes("outside-controller"), `behavior controller must describe outside perspective: ${kit.domainPath}`);
}

for (const kit of executionKits) {
  assert(kit.kind === "execution", `execution kit must use execution kind: ${kit.domainPath}`);
  assert(kit.executionRole === "execution-only", `execution kit missing execution-only marker: ${kit.domainPath}`);
  assert(!kit.ownsGameRules, `execution kit cannot own game rules: ${kit.domainPath}`);
  assert(kit.dependencies.includes("n:behavior:body-state") || kit.domain === "control", `execution kit must consume behavior/body state or control substrate: ${kit.domainPath}`);
}

for (const kit of renderKits) {
  assert(kit.kind === "renderer-adapter", `render kit must be a renderer adapter: ${kit.domainPath}`);
  assert(kit.ownsRenderTruth === false, `render kit cannot own gameplay truth: ${kit.domainPath}`);
  assert(!kit.ownsGameRules, `render kit cannot own game rules: ${kit.domainPath}`);
}

console.log(JSON.stringify({
  status: "v002-system-controller-boundaries-ready",
  behaviorControllers: behaviorKits.length,
  executionKits: executionKits.length,
  renderAdapters: renderKits.length,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
