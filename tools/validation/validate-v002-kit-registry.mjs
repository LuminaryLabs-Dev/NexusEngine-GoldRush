import { existsSync } from "node:fs";
import {
  V002_VERSION,
  createV002RegistrySnapshot,
  validateV002Registry,
  v002KitRegistry,
  v002ProofGroups,
} from "../../src/kits/v0.0.2/registry.js";

const validation = validateV002Registry();
assert(validation.passed, `v0.0.2 registry failed: ${validation.failures.join(", ")}`);
assert(V002_VERSION === "v0.0.2", "v0.0.2 registry must expose the expected version");
assert(v002KitRegistry.length === 80, "v0.0.2 must register every planned top-level kit");
assert(v002ProofGroups.length === 10, "v0.0.2 must use grouped proof pages");

const requiredValidators = new Set([
  "tools/validation/validate-v002-kit-registry.mjs",
  "tools/validation/validate-v002-domain-structure.mjs",
  "tools/validation/validate-v002-proof-groups.mjs",
  "tools/validation/validate-v002-system-controller-boundaries.mjs",
  "tools/validation/validate-v002-integrated-loop-contract.mjs",
  "tools/validation/validate-v002-train-loop-contract.mjs",
  "tools/validation/validate-v002-content-asset-kits.mjs",
  "tools/validation/validate-v002-train-asset-set.mjs",
]);

for (const kit of v002KitRegistry) {
  assert(requiredValidators.has(kit.validator), `kit references unknown validator: ${kit.domainPath}`);
  assert(existsSync(kit.validator), `kit validator file is missing: ${kit.validator}`);
  assert(kit.publicApi.join(",") === "install,reset,snapshot,validate", `kit public API changed: ${kit.domainPath}`);
  assert(kit.snapshot.includes("domainPath"), `kit snapshot must expose domainPath: ${kit.domainPath}`);
  assert(kit.reset.includes("kit-local"), `kit reset must be explicit and local: ${kit.domainPath}`);
}

const snapshot = createV002RegistrySnapshot();
assert(snapshot.architecture === "domain-subdomain-top-level-kits", "registry architecture marker changed");
assert(snapshot.rejectedFromV001.includes("helper-only proof paths"), "v0.0.2 must reject helper-only proof inheritance");
assert(snapshot.inheritedFromV001.includes("terrain source fixture contracts through material and biome masks"), "v0.0.2 must inherit only validated terrain source contracts");

console.log(JSON.stringify({
  status: "v002-kit-registry-ready",
  version: V002_VERSION,
  domains: validation.domains,
  kits: validation.kits,
  proofGroups: validation.proofGroups,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
