import { readFileSync } from "node:fs";
import { assetRegistry } from "../../src/content/assetRegistry.js";
import { goldRushLegacySourceManifest } from "../../src/content/goldrushLegacySourceManifest.js";

const handoffPath = new URL("../../manifests/import-jobs/goldrush-cloud-transfer-handoff.json", import.meta.url);
const handoff = JSON.parse(readFileSync(handoffPath, "utf8"));

const runtimeSlotIds = new Set([
  ...assetRegistry.assets.map((asset) => asset.id),
  ...assetRegistry.presentation.scenes.map((scene) => scene.id),
  ...assetRegistry.presentation.audio.map((audio) => audio.id),
  ...assetRegistry.presentation.animations.map((animation) => animation.id),
]);

const legacyRequiredSlots = new Set(
  goldRushLegacySourceManifest.browserPlayableFamilies.flatMap((family) => family.requiredSlots)
);
const handoffRequiredSlots = new Set(handoff.requiredPromotionSlots ?? []);
const copyDomainSlots = new Set((handoff.copyDomains ?? []).flatMap((domain) => domain.slots ?? []));
const failures = [];

expect(handoff.schema === "nexusengine.goldrush.cloud-transfer-handoff.v1", "invalid-schema");
expect(handoff.status === "ready-for-cloud-worker", "handoff-not-ready-for-cloud-worker");
expect(handoff.importJobId === "goldrush-dual-source-001", "unexpected-import-job-id");
expect(handoff.localCodexRule?.mayCloneLegacySourceRepos === false, "local-codex-clone-rule-missing");
expect(handoff.repositories?.destination?.nameWithOwner === "LuminaryLabs-Dev/NexusEngine-GoldRush", "wrong-destination-repo");
expect(handoff.repositories?.source?.nameWithOwner === "thecrimsondeveloper/Gold_Rush", "wrong-source-repo");
expect(handoff.repositories?.source?.commitSha === "TO_BE_FILLED_BY_CLOUD_WORKER", "source-commit-placeholder-changed-before-cloud-worker");
expect((handoff.repositories?.source?.roots ?? []).length === 2, "expected-two-source-roots");

for (const source of handoff.repositories?.source?.roots ?? []) {
  expect(source.root?.endsWith("/"), `source-root-must-end-slash:${source.sourceKey}`);
  expect(source.expectedProductName, `source-root-missing-product-name:${source.sourceKey}`);
  expect(source.expectedUnityVersion, `source-root-missing-unity-version:${source.sourceKey}`);
  expect((source.requiredSceneEvidence ?? []).length >= 3, `source-root-missing-scene-evidence:${source.sourceKey}`);
}

expectPath(handoff.destinationFolders?.rawCandidates, "raw/imported/goldrush-dual-source-001/", "raw-destination");
expectPath(handoff.destinationFolders?.sanitizedCandidates, "sanitized/converted/goldrush-dual-source-001/", "sanitized-destination");
expectPath(handoff.destinationFolders?.publicRuntimeAssets, "public/assets/", "public-assets-destination");
expectPath(handoff.destinationFolders?.sanitizedRegistry, "sanitized/registry/assets.json", "sanitized-registry");

const requiredReports = [
  "denyPathReport",
  "secretScanReport",
  "hashManifest",
  "sourceDiscoveryReport",
  "copyLedger",
  "classificationReport",
  "conversionReport",
  "licenseProvenanceReport",
  "humanReviewReport",
];
for (const reportId of requiredReports) {
  const reportPath = handoff.destinationFolders?.[reportId];
  expect(typeof reportPath === "string", `missing-report-path:${reportId}`);
  expect(reportPath?.startsWith("reports/") || reportPath?.startsWith("quarantine/reports/"), `report-outside-report-folder:${reportId}`);
}

const requiredPhases = [
  "source-discovery",
  "pre-copy-deny-scan",
  "pre-copy-secret-scan",
  "raw-candidate-copy",
  "classification",
  "conversion",
  "human-review",
  "public-promotion",
];
const phaseIds = new Set((handoff.cloudWorkerPhases ?? []).map((phase) => phase.id));
for (const phaseId of requiredPhases) {
  expect(phaseIds.has(phaseId), `missing-cloud-worker-phase:${phaseId}`);
}
(handoff.cloudWorkerPhases ?? []).forEach((phase) => {
  expect((phase.mustProduce ?? []).length > 0, `phase-missing-must-produce:${phase.id}`);
  expect((phase.mustNotProduce ?? []).length > 0, `phase-missing-must-not-produce:${phase.id}`);
});

const requiredDeniedPatterns = [
  "*/Packages/manifest.json",
  "*/ProjectSettings/**",
  "*/UserSettings/**",
  "*/Library/**",
  "*/Temp/**",
  "*/Assets/Photon/**",
  "*/Assets/**/PhotonAppSettings.asset",
  "*/Assets/Plugins/**",
  "*.csproj",
  "*.sln",
  ".env",
  ".npmrc",
  ".upmconfig.toml",
];
for (const pattern of requiredDeniedPatterns) {
  expect((handoff.deniedPatterns ?? []).includes(pattern), `missing-denied-pattern:${pattern}`);
}

expect((handoff.copyDomains ?? []).length >= 5, "missing-copy-domain-web");
for (const domain of handoff.copyDomains ?? []) {
  expect(domain.id, "copy-domain-missing-id");
  expect(Number.isFinite(domain.priority), `copy-domain-missing-priority:${domain.id}`);
  expect((domain.slots ?? []).length > 0, `copy-domain-missing-slots:${domain.id}`);
  expect((domain.candidateExtensions ?? []).length > 0, `copy-domain-missing-extensions:${domain.id}`);
  expect((domain.edgeCases ?? []).length >= 2, `copy-domain-missing-edge-cases:${domain.id}`);
  for (const slotId of domain.slots ?? []) {
    expect(runtimeSlotIds.has(slotId), `copy-domain-slot-not-in-runtime-registry:${slotId}`);
  }
}

for (const slotId of legacyRequiredSlots) {
  expect(handoffRequiredSlots.has(slotId), `handoff-missing-legacy-required-slot:${slotId}`);
  expect(copyDomainSlots.has(slotId), `copy-domains-missing-legacy-required-slot:${slotId}`);
}
for (const slotId of handoffRequiredSlots) {
  expect(runtimeSlotIds.has(slotId), `required-slot-not-in-runtime-registry:${slotId}`);
}

const serialized = JSON.stringify(handoff);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "handoff-contains-secret-like-value");
for (const criterion of handoff.acceptanceCriteria ?? []) {
  expect(!criterion.includes("clone locally"), "acceptance-criteria-suggests-local-clone");
}
expect((handoff.acceptanceCriteria ?? []).some((entry) => entry.includes("public smoke proof")), "missing-public-smoke-acceptance");
expect((handoff.acceptanceCriteria ?? []).some((entry) => entry.includes("runtime code never imports")), "missing-runtime-boundary-acceptance");

assert(failures.length === 0, `cloud transfer handoff invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "cloud-transfer-handoff-ready",
  importJobId: handoff.importJobId,
  sourceRoots: handoff.repositories.source.roots.length,
  phases: phaseIds.size,
  copyDomains: handoff.copyDomains.length,
  requiredPromotionSlots: handoff.requiredPromotionSlots.length,
  deniedPatterns: handoff.deniedPatterns.length,
}, null, 2));

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function expectPath(actual, expected, label) {
  expect(actual === expected, `${label}-mismatch`);
  expect(typeof actual === "string" && !actual.startsWith("/") && !actual.includes(".."), `${label}-unsafe`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
