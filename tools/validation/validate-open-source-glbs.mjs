import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const manifestPath = join(root, "public/assets/manifests/open-source-glbs.json");

assert(existsSync(manifestPath), "open-source GLB manifest is missing");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
assert(manifest.manifestId === "goldrush.open-source-glbs", "manifest id is incorrect");
assert(manifest.imports.length >= 2, "at least two direct GLB imports are required");

for (const asset of manifest.imports) {
  assert(asset.sourcePage?.startsWith("https://poly.pizza/m/"), `${asset.id} must keep a source page`);
  assert(asset.sourceGlb?.startsWith("https://static.poly.pizza/"), `${asset.id} must keep a direct source GLB URL`);
  assert(asset.license === "CC0-1.0", `${asset.id} must have verified CC0 license metadata`);
  assert(asset.runtimePath?.endsWith(".glb"), `${asset.id} must target a GLB runtime path`);

  const runtimeFile = join(root, "public", asset.runtimePath);
  assert(existsSync(runtimeFile), `${asset.id} runtime GLB file is missing`);
  assert(statSync(runtimeFile).size > 1000, `${asset.id} runtime GLB is unexpectedly tiny`);
}

assert(
  manifest.blockedCandidates.some((candidate) => candidate.id.includes("animation")),
  "character animation candidate should stay documented until directly importable"
);

console.log("open-source GLB imports passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
