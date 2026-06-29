import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createRemainingBatchWorkerSummary } from "../import-sanitize/copy-remaining-batch-from-github.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const defaultBatchId = `${importJobId}.next.001.audio-music-and-sfx`;
const proofPath = path.join(repoRoot, `reports/provenance/${importJobId}-next-001-fetch-proof.json`);
const coveragePath = path.join(repoRoot, `reports/provenance/${importJobId}-remaining-coverage.json`);
const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
const summary = createRemainingBatchWorkerSummary();
const failures = [];

expect(summary.importJobId === importJobId, "wrong-import-job");
expect(summary.source?.nameWithOwner === "thecrimsondeveloper/Gold_Rush", "wrong-source-repo");
expect(summary.source?.commitSha === "144230e32b537336c83407b4ddae83cdc95c1c9e", "wrong-source-commit");
expect(summary.batchId === defaultBatchId, "wrong-default-batch");
expect(summary.domainId === "audio-music-and-sfx", "wrong-default-domain");
expect(summary.status === "planned-not-copied", "batch-should-still-be-planned-not-copied");
expect(summary.targetRawRoot === `raw/imported/${importJobId}/`, "wrong-target-raw-root");
expect(summary.itemCount === 15, "default-batch-item-count-mismatch");
expect(summary.totalBytes === 90145108, "default-batch-byte-count-mismatch");
expect(summary.publicPromotion === false, "summary-must-not-promote-public-assets");
expect(summary.runtimePromotion === false, "summary-must-not-promote-runtime-assets");

for (const requirement of ["source-discovery", "deny-path-scan", "secret-scan", "copy-ledger", "hash-manifest", "classification"]) {
  expect((summary.receiptRequirements ?? []).includes(requirement), `missing-receipt-requirement:${requirement}`);
}
for (const blocker of ["conversion-report", "license-provenance", "human-review", "approved-runtime-record"]) {
  expect((summary.promotionBlockedBy ?? []).includes(blocker), `missing-promotion-blocker:${blocker}`);
}

const defaultBatch = (coverage.nextCopyBatches ?? []).find((batch) => batch.batchId === defaultBatchId);
expect(defaultBatch?.items?.every((item) => item.extension === ".ogg" || item.extension === ".mp3" || item.extension === ".wav"), "default-batch-should-only-contain-audio");
expect(defaultBatch?.items?.every((item) => item.targetRawPath === `${summary.targetRawRoot}${item.sourcePath}`), "default-batch-target-path-mismatch");

if (existsSync(proofPath)) {
  const proof = JSON.parse(readFileSync(proofPath, "utf8"));
  expect(proof.schema === "nexusengine.goldrush.remaining-batch-fetch-proof.v1", "invalid-fetch-proof-schema");
  expect(proof.importJobId === importJobId, "fetch-proof-wrong-job");
  expect(proof.status === "remaining-batch-worker-fetched-batch", "fetch-proof-wrong-status");
  expect(proof.fetch === true, "fetch-proof-must-fetch");
  expect(proof.write === false, "fetch-proof-must-not-write");
  expect(proof.batchId === summary.batchId, "fetch-proof-batch-mismatch");
  expect(proof.domainId === summary.domainId, "fetch-proof-domain-mismatch");
  expect(proof.itemCount === summary.itemCount, "fetch-proof-item-count-mismatch");
  expect(proof.totalBytes === summary.totalBytes, "fetch-proof-byte-count-mismatch");
  expect(proof.publicPromotion === false, "fetch-proof-must-not-promote-public-assets");
  expect(proof.runtimePromotion === false, "fetch-proof-must-not-promote-runtime-assets");
  expect(proof.receiptCounts?.copiedFiles === summary.itemCount, "fetch-proof-copied-count-mismatch");
  expect(proof.receiptCounts?.hashFiles === summary.itemCount, "fetch-proof-hash-count-mismatch");
  expect(proof.receiptCounts?.secretFindings === 0, "fetch-proof-secret-findings");
  expect(Array.isArray(proof.copiedFiles) && proof.copiedFiles.length === summary.itemCount, "fetch-proof-copied-files-missing");
  for (const item of proof.copiedFiles ?? []) {
    expect(isSafeSourcePath(item.sourcePath), `fetch-proof-unsafe-source-path:${item.sourcePath}`);
    expect(item.targetRawPath === `${summary.targetRawRoot}${item.sourcePath}`, `fetch-proof-target-path-mismatch:${item.sourcePath}`);
    expect(/^sha256:[a-f0-9]{64}$/.test(item.sourceHash ?? ""), `fetch-proof-invalid-source-hash:${item.sourcePath}`);
    expect(isBlobSha(item.blobSha), `fetch-proof-invalid-blob:${item.sourcePath}`);
  }
  const serialized = JSON.stringify(proof);
  expect(!serialized.includes("content\":\""), "fetch-proof-must-not-contain-file-content");
  expect(!/"runtimePath":/.test(serialized), "fetch-proof-must-not-contain-runtime-path");
  expect(!/"status":"approved"/.test(serialized), "fetch-proof-must-not-claim-approval");
}

if (failures.length > 0) {
  throw new Error(`remaining batch worker invalid: ${failures.join(", ")}`);
}

console.log(JSON.stringify({
  status: "remaining-batch-worker-ready",
  importJobId: summary.importJobId,
  batchId: summary.batchId,
  domainId: summary.domainId,
  itemCount: summary.itemCount,
  totalBytes: summary.totalBytes,
  fetchProof: existsSync(proofPath),
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
