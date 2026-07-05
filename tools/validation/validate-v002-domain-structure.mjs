import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { v002Domains, v002KitRegistry } from "../../src/kits/v0.0.2/registry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const kitRoot = path.join(repoRoot, "src/kits/v0.0.2");

for (const entry of ["registry.js", "kitRuntime.js", "state.js"]) {
  assert(existsSync(path.join(kitRoot, entry)), `missing v0.0.2 runtime file: ${entry}`);
}

for (const domain of v002Domains) {
  const domainDir = path.join(kitRoot, domain.domain);
  assert(existsSync(domainDir), `missing domain directory: ${domain.domain}`);
  const actualSubdomains = v002KitRegistry
    .filter((kit) => kit.domain === domain.domain)
    .map((kit) => kit.subdomain)
    .sort();
  assertDeepEqual(actualSubdomains, [...domain.subdomains].sort(), `subdomain mismatch for ${domain.domain}`);
}

for (const kit of v002KitRegistry) {
  const kitDir = path.join(kitRoot, kit.domain, kit.subdomain);
  const readmePath = path.join(kitDir, "README.md");
  const kitJsonPath = path.join(kitDir, "kit.json");
  const indexPath = path.join(kitDir, "index.js");
  assert(existsSync(readmePath), `missing README for ${kit.domainPath}`);
  assert(existsSync(kitJsonPath), `missing kit.json for ${kit.domainPath}`);
  assert(existsSync(indexPath), `missing index.js for ${kit.domainPath}`);

  const kitJson = JSON.parse(readFileSync(kitJsonPath, "utf8"));
  assert(kitJson.domainPath === kit.domainPath, `kit.json domainPath mismatch: ${kit.domainPath}`);
  assert(kitJson.domain === kit.domain, `kit.json domain mismatch: ${kit.domainPath}`);
  assert(kitJson.subdomain === kit.subdomain, `kit.json subdomain mismatch: ${kit.domainPath}`);
  assert(kitJson.proofGroup === kit.proofGroup, `kit.json proof group mismatch: ${kit.domainPath}`);

  const readme = readFileSync(readmePath, "utf8");
  assert(readme.includes(`- Domain: \`${kit.domain}\``), `README missing domain: ${kit.domainPath}`);
  assert(readme.includes("## Core Kit Reuse"), `README missing core reuse section: ${kit.domainPath}`);
  assert(readme.includes("## First Proof"), `README missing first proof section: ${kit.domainPath}`);

  const index = readFileSync(indexPath, "utf8");
  assert(index.includes(`export const domainPath = "${kit.domainPath}"`), `index.js missing domainPath export: ${kit.domainPath}`);
  assert(index.includes("createV002KitRuntime"), `index.js must compose the shared kit runtime: ${kit.domainPath}`);
}

console.log(JSON.stringify({
  status: "v002-domain-structure-ready",
  domains: v002Domains.length,
  kits: v002KitRegistry.length,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDeepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) throw new Error(`${label}: expected ${expectedText}, received ${actualText}`);
}
