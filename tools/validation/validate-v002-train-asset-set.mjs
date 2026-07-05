import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { v002KitRegistry } from "../../src/kits/v0.0.2/registry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportPath = path.join(repoRoot, "reports/asset-intake/quaternius-modular-train-pack.json");
const kit = v002KitRegistry.find((entry) => entry.domainPath === "n:goldrush:train-asset-set");

assert(kit, "missing GoldRush train asset set kit");
assert(kit.kind === "composite-domain", "train asset set must stay composite-domain");
assert(kit.proofGroup === "goldrush-integrated", "train asset set must remain in the integrated proof group");
assert(kit.promotionStatus === "game-specific-v002", "train asset set must stay game-specific");
assert(kit.publicApi.join(",") === "install,reset,snapshot,validate", "train asset set public API changed");
assert(kit.dependencies.includes("n:content:source-asset-intake"), "train asset set must depend on source intake");
assert(kit.dependencies.includes("n:content:license-provenance"), "train asset set must depend on license provenance");
assert(kit.dependencies.includes("n:content:source-file-inventory"), "train asset set must depend on source inventory");
assert(kit.dependencies.includes("n:content:fbx-conversion-request"), "train asset set must depend on FBX conversion requests");

assert(existsSync(reportPath), "source asset intake report is missing");
const report = JSON.parse(readFileSync(reportPath, "utf8"));
assert(report.status === "source-only", "train asset set must only consume source-only intake");
assert(report.inventory?.extensions?.fbx === 14, "train asset set report must include FBX inventory");

console.log(JSON.stringify({
  status: "v002-train-asset-set-ready",
  domainPath: kit.domainPath,
  dependencies: kit.dependencies.length,
  sourceFiles: report.inventory?.files ?? 0,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
