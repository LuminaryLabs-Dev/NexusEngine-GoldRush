import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { v002KitRegistry } from "../../src/kits/v0.0.2/registry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportPath = path.join(repoRoot, "reports/asset-intake/quaternius-modular-train-pack.json");
const proofPath = path.join(repoRoot, "public/proof/v0.0.2/content.html");

const contentKits = v002KitRegistry.filter((kit) => kit.domain === "content");
assert(contentKits.length === 4, "content domain must contain four source-only intake kits");
assert(existsSync(reportPath), "source asset intake report is missing");
assert(existsSync(proofPath), "content proof page is missing");

const report = JSON.parse(readFileSync(reportPath, "utf8"));
assert(report.schema === "nexusengine.goldrush.asset-intake.source-catalog.v1", "unexpected asset-intake report schema");
assert(report.status === "source-only", "source asset intake report must remain source-only");
assert(report.license?.licenseId === "CC0-1.0", "source asset intake report must preserve license provenance");
assert(report.license?.runtimePromotion === false, "source asset intake report must block runtime promotion");
assert(report.inventory?.files === 59, "source asset intake report must preserve file count");

for (const kit of contentKits) {
  assert(kit.kind === "host-support", `content kit must be host-support: ${kit.domainPath}`);
  assert(kit.proofGroup === "content", `content kit must use content proof group: ${kit.domainPath}`);
  assert(kit.promotionStatus === "local-v002-incubation", `content kit must stay local-only: ${kit.domainPath}`);
  assert(kit.publicApi.join(",") === "install,reset,snapshot,validate", `content kit public API changed: ${kit.domainPath}`);
  assert(!kit.ownsGameRules, `content kit cannot own game rules: ${kit.domainPath}`);
  assert(!kit.ownsRenderTruth, `content kit cannot own render truth: ${kit.domainPath}`);
  assert(kit.snapshot.includes("proofGroup"), `content kit snapshot must expose proofGroup: ${kit.domainPath}`);
}

const ordered = contentKits.map((kit) => kit.domainPath).sort();
assertDeepEqual(ordered, [
  "n:content:fbx-conversion-request",
  "n:content:license-provenance",
  "n:content:source-asset-intake",
  "n:content:source-file-inventory",
], "content kit inventory changed");

console.log(JSON.stringify({
  status: "v002-content-asset-kits-ready",
  contentKits: contentKits.length,
  fileCount: report.inventory?.files ?? 0,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDeepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) throw new Error(`${label}: expected ${expectedText}, received ${actualText}`);
}
