import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const batchId = `${importJobId}.next.001.audio-music-and-sfx`;
const receiptRoot = "reports/provenance/remaining-batches";
const batchDir = `${receiptRoot}/${batchId}`;
const indexPath = `${receiptRoot}/batch-index.json`;
const coveragePath = `reports/provenance/${importJobId}-remaining-coverage.json`;
const fetchProofPath = `reports/provenance/${importJobId}-next-001-fetch-proof.json`;
const rawWriteProofPath = `reports/provenance/${importJobId}-next-001-raw-write-proof.json`;
const firstRawCopyPlanPath = `reports/provenance/${importJobId}-raw-copy-plan.json`;
const expectedAudioExtensions = new Set([".ogg", ".mp3", ".wav"]);
const failures = [];

const coverage = readJson(coveragePath);
const fetchProof = readJson(fetchProofPath);
const rawWriteProof = existsSync(path.join(repoRoot, rawWriteProofPath))
  ? readJson(rawWriteProofPath)
  : null;
const firstRawCopyPlan = readJson(firstRawCopyPlanPath);
const index = readJson(indexPath);
const batch = (coverage.nextCopyBatches ?? []).find((candidate) => candidate.batchId === batchId);
expect(Boolean(batch), "coverage-missing-batch");

const receiptFileNames = [
  "source.receipt.json",
  "raw-copy.receipt.json",
  "hashes.receipt.json",
  "secret-scan.receipt.json",
  "collision-and-overlap.receipt.json",
  "validator.receipt.json",
];
const receipts = Object.fromEntries(
  receiptFileNames.map((fileName) => [fileName, readJson(`${batchDir}/${fileName}`)])
);

validateIndex();
validateReceiptCommon();
validateSourceReceipt(receipts["source.receipt.json"]);
validateRawCopyReceipt(receipts["raw-copy.receipt.json"]);
validateHashReceipt(receipts["hashes.receipt.json"]);
validateSecretScanReceipt(receipts["secret-scan.receipt.json"]);
validateCollisionReceipt(receipts["collision-and-overlap.receipt.json"]);
validateValidatorReceipt(receipts["validator.receipt.json"]);
validateAgainstCoverageAndProof();
validateRawWriteState();

if (failures.length > 0) {
  throw new Error(`remaining batch receipts invalid: ${failures.join(", ")}`);
}

console.log(JSON.stringify({
  status: "remaining-batch-receipts-ready",
  importJobId,
  batchId,
  receiptFiles: receiptFileNames.length,
  itemCount: batch?.itemCount ?? null,
  totalBytes: batch?.totalBytes ?? null,
  mode: receipts["raw-copy.receipt.json"].mode,
  publicPromotion: false,
  runtimePromotion: false,
}, null, 2));

function validateIndex() {
  expect(index.schema === "nexusengine.goldrush.remaining-batch-index.v1", "index-invalid-schema");
  expect(index.importJobId === importJobId, "index-wrong-job");
  expect(index.appendOnly === true, "index-must-be-append-only");
  expect(index.doesNotModifyFirst31Gate === true, "index-must-not-modify-first31");
  expect(Array.isArray(index.batches) && index.batches.length === 1, "index-batch-count-mismatch");
  const record = index.batches?.[0];
  expect(record?.batchId === batchId, "index-wrong-batch");
  expect(record?.domainId === "audio-music-and-sfx", "index-wrong-domain");
  expect(["fetch-proof-receipts-ready", "raw-files-written-receipts-ready"].includes(record?.status), "index-wrong-status");
  expect(record?.itemCount === 15, "index-item-count-mismatch");
  expect(record?.totalBytes === 90145108, "index-byte-total-mismatch");
  expect(record?.receiptRoot === batchDir, "index-receipt-root-mismatch");
  expect(record?.publicPromotion === false, "index-must-not-promote-public");
  expect(record?.runtimePromotion === false, "index-must-not-promote-runtime");

  for (const fileName of receiptFileNames) {
    const relPath = `${batchDir}/${fileName}`;
    expect(record?.receiptDigests?.[relPath] === sha256File(relPath), `index-digest-mismatch:${fileName}`);
  }
}

function validateReceiptCommon() {
  for (const [fileName, receipt] of Object.entries(receipts)) {
    expect(receipt.receiptKind === "remaining-batch", `receipt-kind-mismatch:${fileName}`);
    expect(receipt.importJobId === importJobId, `receipt-job-mismatch:${fileName}`);
    expect(receipt.batchId === batchId, `receipt-batch-mismatch:${fileName}`);
    expect(receipt.doesNotModifyFirst31Gate === true, `receipt-must-not-modify-first31:${fileName}`);
    const serialized = JSON.stringify(receipt);
    expect(!/"runtimePath":/.test(serialized), `receipt-must-not-contain-runtime-path:${fileName}`);
    expect(!/"status":"approved"/.test(serialized), `receipt-must-not-claim-approval:${fileName}`);
  }
}

function validateSourceReceipt(receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-source-receipt.v1", "source-receipt-invalid-schema");
  expect(receipt.source?.nameWithOwner === "thecrimsondeveloper/Gold_Rush", "source-receipt-wrong-repo");
  expect(receipt.source?.commitSha === "144230e32b537336c83407b4ddae83cdc95c1c9e", "source-receipt-wrong-commit");
  expect(receipt.batchStatus === "planned-not-copied", "source-receipt-wrong-batch-status");
  expect(receipt.targetRawRoot === `raw/imported/${importJobId}/`, "source-receipt-wrong-raw-root");
  expect(receipt.itemCount === 15, "source-receipt-item-count-mismatch");
  expect(receipt.totalBytes === 90145108, "source-receipt-byte-total-mismatch");
  expect(receipt.publicPromotion === false, "source-receipt-must-not-promote-public");
  expect(receipt.runtimePromotion === false, "source-receipt-must-not-promote-runtime");
}

function validateRawCopyReceipt(receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-raw-copy-receipt.v1", "raw-copy-receipt-invalid-schema");
  expect(["fetch-proof-only", "raw-files-written"].includes(receipt.mode), "raw-copy-receipt-invalid-mode");
  expect(receipt.rawFilesWritten === (receipt.mode === "raw-files-written"), "raw-copy-receipt-written-mode-mismatch");
  if (receipt.mode === "raw-files-written") {
    expect(receipt.proofPath === rawWriteProofPath, "raw-copy-receipt-wrong-write-proof-path");
  }
  expect(receipt.targetRawRoot === `raw/imported/${importJobId}/`, "raw-copy-receipt-wrong-root");
  expect(Array.isArray(receipt.fetchedFiles) && receipt.fetchedFiles.length === 15, "raw-copy-receipt-file-count-mismatch");
  for (const file of receipt.fetchedFiles ?? []) {
    expect(isSafeReportPath(file.sourcePath), `raw-copy-unsafe-source:${file.sourcePath}`);
    expect(isSafeRawDestination(file.targetRawPath), `raw-copy-unsafe-target:${file.targetRawPath}`);
    expect(isBlobSha(file.blobSha), `raw-copy-invalid-blob:${file.sourcePath}`);
    expect(isSha256(file.sourceHash), `raw-copy-invalid-hash:${file.sourcePath}`);
    expect(expectedAudioExtensions.has(file.extension), `raw-copy-non-audio-extension:${file.sourcePath}`);
    expect(Number.isFinite(file.sizeBytes) && file.sizeBytes > 0, `raw-copy-invalid-size:${file.sourcePath}`);
  }
}

function validateHashReceipt(receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-hash-receipt.v1", "hash-receipt-invalid-schema");
  expect(Array.isArray(receipt.files) && receipt.files.length === 15, "hash-receipt-file-count-mismatch");
  for (const file of receipt.files ?? []) {
    expect(isSafeRawDestination(file.path), `hash-receipt-unsafe-path:${file.path}`);
    expect(isSha256(file.sha256), `hash-receipt-invalid-sha:${file.path}`);
    expect(isBlobSha(file.blobSha), `hash-receipt-invalid-blob:${file.path}`);
    expect(Number.isFinite(file.sizeBytes) && file.sizeBytes > 0, `hash-receipt-invalid-size:${file.path}`);
  }
}

function validateSecretScanReceipt(receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-secret-scan-receipt.v1", "secret-receipt-invalid-schema");
  expect(receipt.scanner === "copy-remaining-batch-from-github", "secret-receipt-wrong-scanner");
  expect(receipt.filesScanned === 15, "secret-receipt-file-count-mismatch");
  expect(receipt.bytesScanned === 90145108, "secret-receipt-byte-count-mismatch");
  expect(receipt.findingCount === 0, "secret-receipt-findings");
  expect(Array.isArray(receipt.findings) && receipt.findings.length === 0, "secret-receipt-findings-array");
  expect(receipt.result === "pass", "secret-receipt-must-pass");
}

function validateCollisionReceipt(receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-collision-receipt.v1", "collision-receipt-invalid-schema");
  expect(receipt.first31PlanPath === firstRawCopyPlanPath, "collision-receipt-wrong-first31-plan");
  expect(Array.isArray(receipt.overlapsFirst31) && receipt.overlapsFirst31.length === 0, "collision-receipt-overlaps-first31");
  expect(Array.isArray(receipt.targetPathCollisions) && receipt.targetPathCollisions.length === 0, "collision-receipt-target-collisions");
  expect(Array.isArray(receipt.caseFoldCollisions) && receipt.caseFoldCollisions.length === 0, "collision-receipt-case-collisions");
  expect(Array.isArray(receipt.duplicateContent) && receipt.duplicateContent.length === 0, "collision-receipt-duplicate-content");
  expect(Array.isArray(receipt.duplicateSourceBlob) && receipt.duplicateSourceBlob.length === 0, "collision-receipt-duplicate-source");
  expect(receipt.result === "pass", "collision-receipt-must-pass");
}

function validateValidatorReceipt(receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-validator-receipt.v1", "validator-receipt-invalid-schema");
  expect(receipt.validatorVersion === "1", "validator-receipt-version-mismatch");
  expect(receipt.validatedAgainstFirst31ReceiptSet === true, "validator-receipt-must-check-first31");
  expect(receipt.validatedAgainstBatchIndex === true, "validator-receipt-must-check-index");
  expect(receipt.expectedItemCount === 15, "validator-receipt-item-count-mismatch");
  expect(receipt.expectedTotalBytes === 90145108, "validator-receipt-byte-total-mismatch");
  expect(receipt.result === "pass", "validator-receipt-must-pass");
  expect(Array.isArray(receipt.errors) && receipt.errors.length === 0, "validator-receipt-errors");
}

function validateAgainstCoverageAndProof() {
  expect(coverage.schema === "nexusengine.goldrush.remaining-asset-coverage.v1", "coverage-invalid-schema");
  expect(fetchProof.schema === "nexusengine.goldrush.remaining-batch-fetch-proof.v1", "fetch-proof-invalid-schema");
  expect(fetchProof.write === false, "fetch-proof-must-not-write");
  expect(fetchProof.publicPromotion === false, "fetch-proof-must-not-promote-public");
  expect(fetchProof.runtimePromotion === false, "fetch-proof-must-not-promote-runtime");
  if (rawWriteProof) {
    expect(rawWriteProof.schema === "nexusengine.goldrush.remaining-batch-fetch-proof.v1", "raw-write-proof-invalid-schema");
    expect(rawWriteProof.status === "remaining-batch-worker-wrote-raw-files", "raw-write-proof-wrong-status");
    expect(rawWriteProof.write === true, "raw-write-proof-must-write");
    expect(rawWriteProof.itemCount === 15, "raw-write-proof-item-count-mismatch");
    expect(rawWriteProof.totalBytes === 90145108, "raw-write-proof-byte-total-mismatch");
    expect(rawWriteProof.receiptCounts?.secretFindings === 0, "raw-write-proof-secret-findings");
    expect(rawWriteProof.publicPromotion === false, "raw-write-proof-must-not-promote-public");
    expect(rawWriteProof.runtimePromotion === false, "raw-write-proof-must-not-promote-runtime");
  }
  expect(batch?.itemCount === 15, "coverage-batch-item-count-mismatch");
  expect(batch?.totalBytes === 90145108, "coverage-batch-byte-total-mismatch");
  expect((batch?.items ?? []).every((item) => expectedAudioExtensions.has(item.extension)), "coverage-batch-must-be-audio-only");

  const first31Targets = new Set(
    (firstRawCopyPlan.domains ?? [])
      .flatMap((domain) => domain.selected ?? [])
      .map((entry) => entry.targetRawPath)
  );
  const rawTargets = receipts["raw-copy.receipt.json"].fetchedFiles.map((file) => file.targetRawPath);
  const folded = new Set();
  for (const targetPath of rawTargets) {
    expect(!first31Targets.has(targetPath), `target-overlaps-first31:${targetPath}`);
    expect(!folded.has(targetPath.toLowerCase()), `case-fold-target-collision:${targetPath}`);
    folded.add(targetPath.toLowerCase());
  }
}

function validateRawWriteState() {
  const rawReceipt = receipts["raw-copy.receipt.json"];
  if (rawReceipt.mode === "fetch-proof-only") {
    for (const file of rawReceipt.fetchedFiles ?? []) {
      expect(!existsSync(path.join(repoRoot, file.targetRawPath)), `remaining-batch-raw-file-written-before-gate:${file.targetRawPath}`);
    }
    return;
  }
  expect(Boolean(rawWriteProof), "raw-write-receipt-requires-write-proof");
  for (const file of receipts["raw-copy.receipt.json"].fetchedFiles ?? []) {
    const absolute = path.join(repoRoot, file.targetRawPath);
    expect(existsSync(absolute), `remaining-batch-raw-file-missing:${file.targetRawPath}`);
    if (existsSync(absolute)) {
      const bytes = readFileSync(absolute);
      expect(bytes.length === file.sizeBytes, `remaining-batch-raw-file-size-mismatch:${file.targetRawPath}`);
      expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}` === file.sourceHash, `remaining-batch-raw-file-hash-mismatch:${file.targetRawPath}`);
    }
  }
}

function readJson(relativePath) {
  const absolute = path.join(repoRoot, normalizeRepoPath(relativePath));
  if (!existsSync(absolute)) {
    failures.push(`missing-json:${relativePath}`);
    return {};
  }
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch (error) {
    failures.push(`invalid-json:${relativePath}:${error.message}`);
    return {};
  }
}

function sha256File(relativePath) {
  return `sha256:${createHash("sha256").update(readFileSync(path.join(repoRoot, normalizeRepoPath(relativePath)))).digest("hex")}`;
}

function normalizeRepoPath(value) {
  if (!isSafeReportPath(value)) return "";
  return value;
}

function isSafeRawDestination(value) {
  return isSafeReportPath(value) && value.startsWith(`raw/imported/${importJobId}/`);
}

function isSafeReportPath(value) {
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

function isSha256(value) {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}
