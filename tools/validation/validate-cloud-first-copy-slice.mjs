import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { assetRegistry } from "../../src/content/assetRegistry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const slicePath = path.join(repoRoot, "manifests/import-jobs/goldrush-cloud-first-copy-slice.json");
const slice = JSON.parse(readFileSync(slicePath, "utf8"));
const handoff = readJson(slice.cloudTransferHandoff);
const sourceProof = readJson(slice.sourceAccessProof);
const failures = [];

const runtimeSlotIds = new Set([
  ...assetRegistry.assets.map((asset) => asset.id),
  ...assetRegistry.presentation.scenes.map((scene) => scene.id),
  ...assetRegistry.presentation.audio.map((audio) => audio.id),
  ...assetRegistry.presentation.animations.map((animation) => animation.id),
]);

expect(slice.schema === "nexusengine.goldrush.cloud-first-copy-slice.v1", "invalid-schema");
expect(slice.status === "ready-for-cloud-worker-pre-copy", "slice-not-ready");
expect(slice.importJobId === handoff.importJobId, "import-job-mismatch");
expect(slice.source?.nameWithOwner === handoff.repositories?.source?.nameWithOwner, "source-repo-mismatch");
expect(slice.source?.branch === handoff.repositories?.source?.branch, "source-branch-mismatch");
expect(slice.source?.headSha === sourceProof.source?.headSha, "source-head-mismatch");
expect(sourceProof.localCloneCreated === false, "source-proof-must-be-no-local-clone");
expect(slice.destination?.nameWithOwner === handoff.repositories?.destination?.nameWithOwner, "destination-repo-mismatch");
expect(slice.destination?.rawImportBranch === handoff.repositories?.destination?.rawImportBranch, "raw-import-branch-mismatch");
expect(slice.destination?.rawRoot === handoff.destinationFolders?.rawCandidates, "raw-root-mismatch");

expect(isSafeRepoPath(slice.sourceAccessProof) && existsRepoFile(slice.sourceAccessProof), "source-proof-path-invalid");
expect(isSafeRepoPath(slice.cloudTransferHandoff) && existsRepoFile(slice.cloudTransferHandoff), "handoff-path-invalid");
expect(isSafeRepoPath(slice.assetIntakeClassifierJob) && existsRepoFile(slice.assetIntakeClassifierJob), "classifier-job-path-invalid");

const requiredReceiptPaths = [
  handoff.destinationFolders?.sourceDiscoveryReport,
  handoff.destinationFolders?.denyPathReport,
  handoff.destinationFolders?.secretScanReport,
  handoff.destinationFolders?.copyLedger,
  handoff.destinationFolders?.hashManifest,
  handoff.destinationFolders?.classificationReport,
];
expect(JSON.stringify(slice.requiredReceiptGate) === JSON.stringify(requiredReceiptPaths), "required-receipt-gate-mismatch");

const handoffRoots = new Set((handoff.repositories?.source?.roots ?? []).map((root) => root.root));
for (const root of slice.source?.roots ?? []) {
  expect(handoffRoots.has(root), `slice-root-not-in-handoff:${root}`);
}

const proofScenes = new Set(
  (sourceProof.roots ?? []).flatMap((root) => root.requiredSceneEvidence ?? []).map((scene) => scene.path)
);
const sourceRootPrefixes = (handoff.repositories?.source?.roots ?? []).map((root) => root.root);
const domains = slice.firstCopyDomains ?? [];
expect(domains.length >= 4, "expected-four-first-copy-domains");
const priorities = new Set();
const domainIds = new Set();
for (const domain of domains) {
  expect(domain.id && !domainIds.has(domain.id), `domain-id-invalid:${domain.id}`);
  domainIds.add(domain.id);
  expect(Number.isFinite(domain.priority) && !priorities.has(domain.priority), `domain-priority-invalid:${domain.id}`);
  priorities.add(domain.priority);
  expect(domain.reason?.length > 20, `domain-missing-reason:${domain.id}`);
  expect((domain.edgeCases ?? []).length >= 3, `domain-needs-edge-cases:${domain.id}`);
  expect((domain.allowExtensions ?? []).every((ext) => /^\.[a-z0-9]+$/i.test(ext)), `domain-invalid-extension:${domain.id}`);
  expect(domain.copyHandling && !domain.copyHandling.includes("public-promotion"), `domain-copy-handling-invalid:${domain.id}`);

  for (const root of domain.sourceRoots ?? []) {
    expect(isSafeSourcePath(root), `domain-unsafe-source-root:${domain.id}:${root}`);
    expect(sourceRootPrefixes.some((prefix) => root.startsWith(prefix) || prefix.startsWith(root)), `domain-root-outside-source:${domain.id}:${root}`);
  }
  for (const slotId of domain.requiredSlots ?? []) {
    expect(runtimeSlotIds.has(slotId), `domain-slot-not-in-runtime-registry:${domain.id}:${slotId}`);
  }
  for (const sourcePath of domain.requiredSourcePaths ?? []) {
    expect(isSafeSourcePath(sourcePath), `domain-unsafe-source-path:${domain.id}:${sourcePath}`);
    expect(proofScenes.has(sourcePath), `domain-required-source-not-in-proof:${domain.id}:${sourcePath}`);
  }
  for (const hint of domain.pathHints ?? []) {
    expect(isSafeGlobHint(hint), `domain-unsafe-path-hint:${domain.id}:${hint}`);
  }
}

const requiredDomainIds = [
  "audio-music-and-sfx",
  "legacy-scene-layout-metadata",
  "player-combat-character",
  "mine-town-terrain-props",
];
for (const id of requiredDomainIds) {
  expect(domainIds.has(id), `missing-first-copy-domain:${id}`);
}

for (const blockedPath of slice.destination?.mustNotWriteBeforeReview ?? []) {
  expect(isSafeRepoPath(blockedPath), `unsafe-must-not-write-path:${blockedPath}`);
  expect(!blockedPath.startsWith(slice.destination.rawRoot), `raw-root-marked-must-not-write:${blockedPath}`);
}
for (const criterion of slice.acceptanceForCloudWorkerBranch ?? []) {
  expect(!criterion.toLowerCase().includes("clone locally"), "acceptance-suggests-local-clone");
}
expect((slice.acceptanceForCloudWorkerBranch ?? []).some((entry) => entry.includes("--require-receipts")), "missing-strict-receipt-acceptance");
expect((slice.preCopySequence ?? []).length >= 4, "precopy-sequence-too-short");

const serialized = JSON.stringify(slice);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "slice-contains-secret-like-value");

assert(failures.length === 0, `cloud first copy slice invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "cloud-first-copy-slice-ready",
  importJobId: slice.importJobId,
  sourceHeadSha: slice.source.headSha,
  domains: domains.length,
  requiredReceiptGate: slice.requiredReceiptGate.length,
  requiredSlots: domains.flatMap((domain) => domain.requiredSlots ?? []).length,
}, null, 2));

function readJson(relPath) {
  if (!isSafeRepoPath(relPath)) {
    throw new Error(`unsafe json path: ${relPath}`);
  }
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), "utf8"));
}

function existsRepoFile(relPath) {
  return isSafeRepoPath(relPath) && existsSync(path.join(repoRoot, relPath));
}

function isSafeRepoPath(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isSafeSourcePath(value) {
  return isSafeRepoPath(value);
}

function isSafeGlobHint(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
