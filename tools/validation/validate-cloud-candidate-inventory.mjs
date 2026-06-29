import { readFileSync } from "node:fs";
import path from "node:path";
import { assetRegistry } from "../../src/content/assetRegistry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const inventoryPath = path.join(repoRoot, "reports/provenance/goldrush-dual-source-001-candidate-inventory.json");
const slicePath = path.join(repoRoot, "manifests/import-jobs/goldrush-cloud-first-copy-slice.json");
const sourceProofPath = path.join(repoRoot, "reports/provenance/goldrush-source-access-2026-06-29.json");
const inventory = JSON.parse(readFileSync(inventoryPath, "utf8"));
const slice = JSON.parse(readFileSync(slicePath, "utf8"));
const sourceProof = JSON.parse(readFileSync(sourceProofPath, "utf8"));
const failures = [];

const runtimeSlotIds = new Set([
  ...assetRegistry.assets.map((asset) => asset.id),
  ...assetRegistry.presentation.scenes.map((scene) => scene.id),
  ...assetRegistry.presentation.audio.map((audio) => audio.id),
  ...assetRegistry.presentation.animations.map((animation) => animation.id),
]);

expect(inventory.schema === "nexusengine.goldrush.cloud-candidate-inventory.v1", "invalid-schema");
expect(inventory.importJobId === slice.importJobId, "import-job-mismatch");
expect(inventory.generatedFrom?.method === "github-api-tree-metadata-no-local-clone", "invalid-generation-method");
expect(inventory.generatedFrom?.localCloneCreated === false, "must-not-use-local-clone");
expect(inventory.source?.nameWithOwner === slice.source?.nameWithOwner, "source-repo-mismatch");
expect(inventory.source?.branch === slice.source?.branch, "source-branch-mismatch");
expect(inventory.source?.commitSha === sourceProof.source?.headSha, "source-commit-mismatch");
expect(inventory.source?.treeTruncated === false, "tree-must-not-be-truncated");
expect(Number.isInteger(inventory.source?.treeEntryCount) && inventory.source.treeEntryCount > 0, "invalid-tree-entry-count");

const sliceDomains = new Map((slice.firstCopyDomains ?? []).map((domain) => [domain.id, domain]));
expect((inventory.domains ?? []).length === sliceDomains.size, "domain-count-mismatch");
let candidateTotal = 0;
let sizeTotal = 0;
for (const domain of inventory.domains ?? []) {
  const expected = sliceDomains.get(domain.id);
  expect(Boolean(expected), `unexpected-domain:${domain.id}`);
  if (!expected) continue;
  expect(domain.priority === expected.priority, `domain-priority-mismatch:${domain.id}`);
  expect(JSON.stringify(domain.requiredSlots) === JSON.stringify(expected.requiredSlots), `required-slots-mismatch:${domain.id}`);
  expect((domain.missingRequiredSourcePaths ?? []).length === 0, `domain-missing-required-sources:${domain.id}`);
  expect(Number.isInteger(domain.candidateCount), `domain-invalid-candidate-count:${domain.id}`);
  expect(domain.candidateCount === (domain.candidates ?? []).length, `domain-candidate-count-mismatch:${domain.id}`);
  expect(domain.candidateCount > 0, `domain-has-no-candidates:${domain.id}`);
  for (const slotId of domain.requiredSlots ?? []) {
    expect(runtimeSlotIds.has(slotId), `slot-not-in-runtime-registry:${domain.id}:${slotId}`);
  }
  for (const candidate of domain.candidates ?? []) {
    expect(isSafeSourcePath(candidate.path), `unsafe-candidate-path:${domain.id}:${candidate.path}`);
    expect(isBlobSha(candidate.blobSha), `invalid-candidate-blob:${domain.id}:${candidate.path}`);
    expect(Number.isFinite(candidate.sizeBytes) && candidate.sizeBytes >= 0, `invalid-candidate-size:${domain.id}:${candidate.path}`);
    expect((expected.allowExtensions ?? []).includes(candidate.extension), `candidate-extension-not-allowed:${domain.id}:${candidate.path}`);
    expect((candidate.matchReasons ?? []).length > 0, `candidate-missing-match-reason:${domain.id}:${candidate.path}`);
    expect(candidate.denied === false, `candidate-marked-denied:${domain.id}:${candidate.path}`);
  }
  candidateTotal += domain.candidateCount;
  sizeTotal += domain.totalSizeBytes;
}
expect(inventory.totals?.domains === (inventory.domains ?? []).length, "totals-domain-mismatch");
expect(inventory.totals?.candidates === candidateTotal, "totals-candidate-mismatch");
expect(inventory.totals?.totalSizeBytes === sizeTotal, "totals-size-mismatch");

const serialized = JSON.stringify(inventory);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "inventory-contains-secret-like-value");
expect(!serialized.includes("content\":\""), "inventory-must-not-contain-file-content");

assert(failures.length === 0, `cloud candidate inventory invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "cloud-candidate-inventory-ready",
  importJobId: inventory.importJobId,
  sourceCommitSha: inventory.source.commitSha,
  domains: inventory.domains.length,
  candidates: inventory.totals.candidates,
  totalSizeBytes: inventory.totals.totalSizeBytes,
}, null, 2));

function isSafeSourcePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isBlobSha(value) {
  return typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
