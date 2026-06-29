import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const coveragePath = path.join(repoRoot, `reports/provenance/${importJobId}-remaining-coverage.json`);
const inventoryPath = path.join(repoRoot, `reports/provenance/${importJobId}-candidate-inventory.json`);
const classificationPath = path.join(repoRoot, `reports/asset-classification/${importJobId}-classification.json`);
const failures = [];

expect(existsSync(coveragePath), "remaining-coverage-report-missing");
expect(existsSync(inventoryPath), "candidate-inventory-missing");
expect(existsSync(classificationPath), "copied-classification-missing");
assert(failures.length === 0, `remaining asset coverage invalid: ${failures.join(", ")}`);

const coverage = readJson(coveragePath);
const inventory = readJson(inventoryPath);
const classification = readJson(classificationPath);

expect(coverage.schema === "nexusengine.goldrush.remaining-asset-coverage.v1", "invalid-coverage-schema");
expect(coverage.importJobId === importJobId, "wrong-coverage-job");
expect(coverage.generatedFrom?.method === "metadata-coverage-no-local-clone-no-file-content", "wrong-generation-method");
expect(coverage.generatedFrom?.localCloneCreated === false, "coverage-must-not-use-local-clone");
expect(coverage.source?.commitSha === inventory.source?.commitSha, "source-commit-mismatch");
expect(coverage.publicPromotion === false, "coverage-must-not-promote-public-assets");
expect(coverage.runtimePromotion === false, "coverage-must-not-promote-runtime-assets");
expect(coverage.rules?.writesRawFiles === false, "coverage-must-not-write-raw-files");
expect(coverage.rules?.writesSanitizedFiles === false, "coverage-must-not-write-sanitized-files");
expect(coverage.rules?.writesPublicAssets === false, "coverage-must-not-write-public-assets");
expect(coverage.rules?.promotesRuntimeAssets === false, "coverage-must-not-promote-runtime-assets-rule");
expect(coverage.rules?.requiresSixReceiptsForAnyFutureCopy === true, "coverage-must-require-six-receipts");
expect(coverage.rules?.requiresHumanReviewBeforePromotion === true, "coverage-must-require-human-review");
expect(coverage.rules?.noLocalLegacyClone === true, "coverage-must-ban-local-legacy-clone");

const inventoryCandidates = flattenInventory(inventory);
const copiedPaths = new Set((classification.candidates ?? []).map((candidate) => candidate.path));
const inventoryPathSet = new Set(inventoryCandidates.map((candidate) => candidate.path));
const uniqueInventoryBytes = sumUniqueInventoryBytes(inventoryCandidates);
const coverageCopied = [];
const coverageRemaining = [];
const coveragePathSet = new Set();

for (const domain of coverage.domains ?? []) {
  expect(hasFilledString(domain.id), "coverage-domain-missing-id");
  expect(Number.isInteger(domain.inventoryReferences), `domain-invalid-inventory-count:${domain.id}`);
  expect(domain.inventoryReferences === domain.copiedReferences + domain.remainingReferences, `domain-coverage-count-mismatch:${domain.id}`);
  expect(domain.copiedReferenceBytes + domain.remainingReferenceBytes === sumBytes([...(domain.copied ?? []), ...(domain.remaining ?? [])]), `domain-byte-mismatch:${domain.id}`);
  for (const copied of domain.copied ?? []) {
    validateCoverageCandidate(copied, `${domain.id}:copied`);
    expect(copiedPaths.has(copied.sourcePath), `coverage-copied-not-classified:${copied.sourcePath}`);
    coverageCopied.push(copied);
    coveragePathSet.add(copied.sourcePath);
  }
  for (const remaining of domain.remaining ?? []) {
    validateCoverageCandidate(remaining, `${domain.id}:remaining`);
    expect(!copiedPaths.has(remaining.sourcePath), `coverage-remaining-already-copied:${remaining.sourcePath}`);
    coverageRemaining.push(remaining);
    coveragePathSet.add(remaining.sourcePath);
  }
}

expect(coveragePathSet.size === inventoryPathSet.size, "coverage-does-not-cover-inventory-paths");
for (const sourcePath of inventoryPathSet) {
  expect(coveragePathSet.has(sourcePath), `inventory-path-missing-from-coverage:${sourcePath}`);
}

expect(coverage.totals?.inventoryReferences === inventory.totals?.candidates, "inventory-reference-total-mismatch");
expect(coverage.totals?.inventoryReferenceBytes === inventory.totals?.totalSizeBytes, "inventory-reference-byte-total-mismatch");
expect(coverage.totals?.uniqueInventoryPaths === inventoryPathSet.size, "unique-inventory-path-total-mismatch");
expect(coverage.totals?.duplicateDomainReferences === inventory.totals?.candidates - inventoryPathSet.size, "duplicate-reference-total-mismatch");
expect(coverage.totals?.copiedUniquePaths === (classification.candidates ?? []).length, "copied-total-should-match-classification");
expect(coverage.totals?.remainingUniquePaths === inventoryPathSet.size - copiedPaths.size, "remaining-unique-total-mismatch");
expect(coverage.totals?.copiedUniquePaths + coverage.totals?.remainingUniquePaths === coverage.totals?.uniqueInventoryPaths, "coverage-total-count-mismatch");
expect(coverage.totals?.copiedUniqueBytes + coverage.totals?.remainingUniqueBytes === uniqueInventoryBytes, "coverage-total-byte-mismatch");
expect(coverage.totals?.remainingUniquePaths > coverage.totals?.copiedUniquePaths, "remaining-coverage-should-exceed-first-slice");

const batchPaths = new Set();
for (const batch of coverage.nextCopyBatches ?? []) {
  expect(hasFilledString(batch.batchId), "batch-missing-id");
  expect(batch.status === "planned-not-copied", `${batch.batchId}:batch-status-must-be-planned`);
  expect(batch.targetRawRoot === `raw/imported/${importJobId}/`, `${batch.batchId}:wrong-target-root`);
  expect(batch.itemCount === (batch.items ?? []).length, `${batch.batchId}:item-count-mismatch`);
  expect(batch.totalBytes === sumBytes(batch.items ?? []), `${batch.batchId}:byte-total-mismatch`);
  for (const requirement of ["source-discovery", "deny-path-scan", "secret-scan", "copy-ledger", "hash-manifest", "classification"]) {
    expect((batch.receiptRequirements ?? []).includes(requirement), `${batch.batchId}:missing-receipt:${requirement}`);
  }
  for (const blocker of ["conversion-report", "license-provenance", "human-review", "approved-runtime-record"]) {
    expect((batch.promotionBlockedBy ?? []).includes(blocker), `${batch.batchId}:missing-promotion-blocker:${blocker}`);
  }
  for (const item of batch.items ?? []) {
    validateBatchItem(item, batch.batchId);
    expect(!copiedPaths.has(item.sourcePath), `${batch.batchId}:batch-item-already-copied:${item.sourcePath}`);
    expect(inventoryPathSet.has(item.sourcePath), `${batch.batchId}:batch-item-not-in-inventory:${item.sourcePath}`);
    expect(item.targetRawPath === `raw/imported/${importJobId}/${item.sourcePath}`, `${batch.batchId}:target-path-mismatch:${item.sourcePath}`);
    expect(!batchPaths.has(item.sourcePath), `${batch.batchId}:duplicate-batch-path:${item.sourcePath}`);
    batchPaths.add(item.sourcePath);
  }
}
expect(batchPaths.size === coverage.totals.remainingUniquePaths, "next-batches-do-not-cover-all-remaining-candidates");

const serialized = JSON.stringify(coverage);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "coverage-contains-secret-like-value");
expect(!serialized.includes("content\":\""), "coverage-must-not-contain-file-content");
expect(!/"status":"approved"/.test(serialized), "coverage-must-not-claim-approved-status");
expect(!/"runtimePath":/.test(serialized), "coverage-must-not-contain-runtime-path");

assert(failures.length === 0, `remaining asset coverage invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "remaining-asset-coverage-ready",
  importJobId,
  inventoryCandidates: coverage.totals.inventoryCandidates,
  copiedCandidates: coverage.totals.copiedUniquePaths,
  remainingCandidates: coverage.totals.remainingUniquePaths,
  nextCopyBatches: coverage.nextCopyBatches.length,
  publicPromotion: coverage.publicPromotion,
  runtimePromotion: coverage.runtimePromotion,
}, null, 2));

function flattenInventory(inventory) {
  return (inventory.domains ?? []).flatMap((domain) => domain.candidates ?? []);
}

function sumUniqueInventoryBytes(candidates) {
  const byPath = new Map();
  for (const candidate of candidates) byPath.set(candidate.path, candidate.sizeBytes);
  return [...byPath.values()].reduce((sum, sizeBytes) => sum + sizeBytes, 0);
}

function validateCoverageCandidate(candidate, label) {
  expect(isSafeSourcePath(candidate.sourcePath), `${label}:unsafe-source-path:${candidate.sourcePath}`);
  expect(isBlobSha(candidate.blobSha), `${label}:invalid-blob-sha:${candidate.sourcePath}`);
  expect(Number.isFinite(candidate.sizeBytes) && candidate.sizeBytes >= 0, `${label}:invalid-size:${candidate.sourcePath}`);
  expect(hasFilledString(candidate.extension), `${label}:missing-extension:${candidate.sourcePath}`);
}

function validateBatchItem(item, label) {
  expect(isSafeSourcePath(item.sourcePath), `${label}:unsafe-source-path:${item.sourcePath}`);
  expect(isSafeSourcePath(item.targetRawPath), `${label}:unsafe-target-path:${item.targetRawPath}`);
  expect(isBlobSha(item.blobSha), `${label}:invalid-blob-sha:${item.sourcePath}`);
  expect(Number.isFinite(item.sizeBytes) && item.sizeBytes >= 0, `${label}:invalid-size:${item.sourcePath}`);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function sumBytes(items) {
  return items.reduce((sum, item) => sum + item.sizeBytes, 0);
}

function hasFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeSourcePath(value) {
  return hasFilledString(value)
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
