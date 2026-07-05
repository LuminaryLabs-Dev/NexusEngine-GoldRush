import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  createV002RegistrySnapshot,
  v002KitRegistry,
  v002ProofGroups,
} from "../../src/kits/v0.0.2/registry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const proofRoot = path.join(repoRoot, "public/proof/v0.0.2");
const publicRegistryPath = path.join(proofRoot, "registry.json");
const publicRegistry = JSON.parse(readFileSync(publicRegistryPath, "utf8"));
const sourceRegistry = createV002RegistrySnapshot();
const proofReader = readFileSync(path.join(proofRoot, "proof-page.js"), "utf8");

assert(JSON.stringify(publicRegistry) === JSON.stringify(sourceRegistry), "public proof registry mirror must match source registry");
assert(proofReader.includes("./registry.json"), "shared proof reader must fetch the grouped registry mirror");
assert(proofReader.includes("data-kit-list"), "shared proof reader must render grouped kit cards");

const proofFiles = readdirSync(proofRoot).filter((entry) => entry.endsWith(".html")).sort();
const expectedPages = v002ProofGroups.map((group) => group.page).sort();
assertDeepEqual(proofFiles, expectedPages, "proof page list must match grouped proof registry");

for (const group of v002ProofGroups) {
  const htmlPath = path.join(proofRoot, group.page);
  assert(existsSync(htmlPath), `missing proof page: ${group.page}`);
  const html = readFileSync(htmlPath, "utf8");
  assert(html.includes(`data-proof-group="${group.id}"`), `proof page missing group marker: ${group.id}`);
  assert(html.includes("./proof-page.js"), `proof page must use the shared proof page reader: ${group.id}`);
  const groupKitCount = v002KitRegistry.filter((kit) => kit.proofGroup === group.id).length;
  assert(groupKitCount > 0, `proof group has no kits: ${group.id}`);
}

for (const kit of v002KitRegistry) {
  assert(!proofFiles.includes(`${kit.subdomain}.html`), `individual small kit proof page is not allowed by default: ${kit.domainPath}`);
}

console.log(JSON.stringify({
  status: "v002-proof-groups-ready",
  proofPages: proofFiles.length,
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
