import { readFileSync } from "node:fs";
import { goldRushLegacySourceManifest, validateLegacySourceManifest } from "../../src/content/goldrushLegacySourceManifest.js";
import { assetRegistry } from "../../src/content/assetRegistry.js";

const validation = validateLegacySourceManifest(goldRushLegacySourceManifest);
assert(validation.passed, `legacy source manifest invalid: ${validation.failures.join(", ")}`);

const manifestPath = new URL("../../manifests/import-jobs/goldrush-legacy-source-intake.json", import.meta.url);
const importManifest = JSON.parse(readFileSync(manifestPath, "utf8"));

assert(importManifest.importJobId === "goldrush-legacy-source-intake", "import manifest should use stable job id");
assert(importManifest.sourceProjects.length === 2, "import manifest should require both legacy source projects");
assert(importManifest.requiredReports.every((entry) => entry.path.startsWith("reports/") || entry.path.startsWith("quarantine/")), "reports must stay in report folders");
assert(importManifest.targetFolders.rawCandidates.startsWith("raw/imported/"), "raw target must stay under raw/imported");
assert(importManifest.targetFolders.publicAssets.startsWith("public/assets/"), "promoted target must stay under public/assets");

const runtimeSlotIds = new Set([
  ...assetRegistry.assets.map((asset) => asset.id),
  ...assetRegistry.presentation.scenes.map((scene) => scene.id),
  ...assetRegistry.presentation.audio.map((audio) => audio.id),
  ...assetRegistry.presentation.animations.map((animation) => animation.id),
]);

const missingSlots = goldRushLegacySourceManifest.browserPlayableFamilies
  .flatMap((family) => family.requiredSlots)
  .filter((slotId) => !runtimeSlotIds.has(slotId));

assert(missingSlots.length === 0, `legacy intake references missing runtime slots: ${missingSlots.join(", ")}`);

const forbiddenText = JSON.stringify(importManifest);
for (const forbidden of ["secret", "token", "password"]) {
  assert(!new RegExp(`\"[^\"/]*${forbidden}[^\"/]*\"\\\\s*:\\\\s*\"[^\"<]`, "i").test(forbiddenText), `manifest appears to contain ${forbidden} value`);
}

console.log("legacy source intake passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
