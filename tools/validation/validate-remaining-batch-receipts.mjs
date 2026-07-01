import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const receiptRoot = "reports/provenance/remaining-batches";
const indexPath = `${receiptRoot}/batch-index.json`;
const coveragePath = `reports/provenance/${importJobId}-remaining-coverage.json`;
const firstRawCopyPlanPath = `reports/provenance/${importJobId}-raw-copy-plan.json`;
const receiptFileNames = [
  "source.receipt.json",
  "raw-copy.receipt.json",
  "hashes.receipt.json",
  "secret-scan.receipt.json",
  "collision-and-overlap.receipt.json",
  "validator.receipt.json",
];
const failures = [];

const coverage = readJson(coveragePath);
const firstRawCopyPlan = readJson(firstRawCopyPlanPath);
const index = readJson(indexPath);
const coverageBatches = new Map((coverage.nextCopyBatches ?? []).map((batch) => [batch.batchId, batch]));
const first31Targets = new Set(
  (firstRawCopyPlan.domains ?? [])
    .flatMap((domain) => domain.selected ?? [])
    .map((entry) => entry.targetRawPath)
);

validateIndexCommon();
const seenBatchIds = new Set();
for (const record of index.batches ?? []) {
  validateIndexedBatch(record);
}

if (failures.length > 0) {
  throw new Error(`remaining batch receipts invalid: ${failures.join(", ")}`);
}

console.log(JSON.stringify({
  status: "remaining-batch-receipts-ready",
  importJobId,
  batches: index.batches.length,
  receiptFiles: index.batches.length * receiptFileNames.length,
  totalItems: index.batches.reduce((sum, record) => sum + record.itemCount, 0),
  totalBytes: index.batches.reduce((sum, record) => sum + record.totalBytes, 0),
  publicPromotion: false,
  runtimePromotion: false,
}, null, 2));

function validateIndexCommon() {
  expect(index.schema === "nexusengine.goldrush.remaining-batch-index.v1", "index-invalid-schema");
  expect(index.importJobId === importJobId, "index-wrong-job");
  expect(index.appendOnly === true, "index-must-be-append-only");
  expect(index.doesNotModifyFirst31Gate === true, "index-must-not-modify-first31");
  expect(Array.isArray(index.batches) && index.batches.length >= 1, "index-must-have-batches");
  expect(coverage.schema === "nexusengine.goldrush.remaining-asset-coverage.v1", "coverage-invalid-schema");
}

function validateIndexedBatch(record) {
  const batchId = record?.batchId ?? "missing-batch-id";
  expect(hasFilledString(record?.batchId), `${batchId}:index-missing-batch-id`);
  expect(!seenBatchIds.has(record?.batchId), `${batchId}:duplicate-index-batch`);
  seenBatchIds.add(record?.batchId);

  const batch = coverageBatches.get(record?.batchId);
  expect(Boolean(batch), `${batchId}:coverage-missing-batch`);
  if (!batch) return;

  const batchDir = `${receiptRoot}/${batch.batchId}`;
  expect(record.domainId === batch.domainId, `${batchId}:index-domain-mismatch`);
  expect(["fetch-proof-receipts-ready", "raw-files-written-receipts-ready"].includes(record.status), `${batchId}:index-wrong-status`);
  expect(record.itemCount === batch.itemCount, `${batchId}:index-item-count-mismatch`);
  expect(record.totalBytes === batch.totalBytes, `${batchId}:index-byte-total-mismatch`);
  expect(record.receiptRoot === batchDir, `${batchId}:index-receipt-root-mismatch`);
  expect(record.publicPromotion === false, `${batchId}:index-must-not-promote-public`);
  expect(record.runtimePromotion === false, `${batchId}:index-must-not-promote-runtime`);

  const receipts = Object.fromEntries(
    receiptFileNames.map((fileName) => [fileName, readJson(`${batchDir}/${fileName}`)])
  );

  for (const fileName of receiptFileNames) {
    const relPath = `${batchDir}/${fileName}`;
    expect(record.receiptDigests?.[relPath] === sha256File(relPath), `${batchId}:index-digest-mismatch:${fileName}`);
  }

  validateReceiptCommon(batch, receipts);
  validateSourceReceipt(batch, receipts["source.receipt.json"]);
  validateRawCopyReceipt(batch, receipts["raw-copy.receipt.json"]);
  validateHashReceipt(batch, receipts["hashes.receipt.json"]);
  validateSecretScanReceipt(batch, receipts["secret-scan.receipt.json"]);
  validateCollisionReceipt(batch, receipts["collision-and-overlap.receipt.json"]);
  validateValidatorReceipt(batch, receipts["validator.receipt.json"]);
  validateAgainstProof(batch, receipts);
  validateRawWriteState(batch, receipts);
}

function validateReceiptCommon(batch, receipts) {
  for (const [fileName, receipt] of Object.entries(receipts)) {
    expect(receipt.receiptKind === "remaining-batch", `${batch.batchId}:receipt-kind-mismatch:${fileName}`);
    expect(receipt.importJobId === importJobId, `${batch.batchId}:receipt-job-mismatch:${fileName}`);
    expect(receipt.batchId === batch.batchId, `${batch.batchId}:receipt-batch-mismatch:${fileName}`);
    expect(receipt.doesNotModifyFirst31Gate === true, `${batch.batchId}:receipt-must-not-modify-first31:${fileName}`);
    const serialized = JSON.stringify(receipt);
    expect(!/"runtimePath":/.test(serialized), `${batch.batchId}:receipt-must-not-contain-runtime-path:${fileName}`);
    expect(!/"status":"approved"/.test(serialized), `${batch.batchId}:receipt-must-not-claim-approval:${fileName}`);
  }
}

function validateSourceReceipt(batch, receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-source-receipt.v1", `${batch.batchId}:source-receipt-invalid-schema`);
  expect(receipt.source?.nameWithOwner === "thecrimsondeveloper/Gold_Rush", `${batch.batchId}:source-receipt-wrong-repo`);
  expect(receipt.source?.commitSha === "144230e32b537336c83407b4ddae83cdc95c1c9e", `${batch.batchId}:source-receipt-wrong-commit`);
  expect(receipt.batchStatus === "planned-not-copied", `${batch.batchId}:source-receipt-wrong-batch-status`);
  expect(receipt.targetRawRoot === `raw/imported/${importJobId}/`, `${batch.batchId}:source-receipt-wrong-raw-root`);
  expect(receipt.itemCount === batch.itemCount, `${batch.batchId}:source-receipt-item-count-mismatch`);
  expect(receipt.totalBytes === batch.totalBytes, `${batch.batchId}:source-receipt-byte-total-mismatch`);
  expect(receipt.publicPromotion === false, `${batch.batchId}:source-receipt-must-not-promote-public`);
  expect(receipt.runtimePromotion === false, `${batch.batchId}:source-receipt-must-not-promote-runtime`);
}

function validateRawCopyReceipt(batch, receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-raw-copy-receipt.v1", `${batch.batchId}:raw-copy-receipt-invalid-schema`);
  expect(["fetch-proof-only", "raw-files-written"].includes(receipt.mode), `${batch.batchId}:raw-copy-receipt-invalid-mode`);
  expect(receipt.rawFilesWritten === (receipt.mode === "raw-files-written"), `${batch.batchId}:raw-copy-receipt-written-mode-mismatch`);
  expect(receipt.targetRawRoot === `raw/imported/${importJobId}/`, `${batch.batchId}:raw-copy-receipt-wrong-root`);
  expect(Array.isArray(receipt.fetchedFiles) && receipt.fetchedFiles.length === batch.itemCount, `${batch.batchId}:raw-copy-receipt-file-count-mismatch`);
  const expectedExtensions = new Set(batch.items.map((item) => item.extension));
  for (const file of receipt.fetchedFiles ?? []) {
    expect(isSafeReportPath(file.sourcePath), `${batch.batchId}:raw-copy-unsafe-source:${file.sourcePath}`);
    expect(isSafeRawDestination(file.targetRawPath), `${batch.batchId}:raw-copy-unsafe-target:${file.targetRawPath}`);
    expect(isBlobSha(file.blobSha), `${batch.batchId}:raw-copy-invalid-blob:${file.sourcePath}`);
    expect(isSha256(file.sourceHash), `${batch.batchId}:raw-copy-invalid-hash:${file.sourcePath}`);
    expect(expectedExtensions.has(file.extension), `${batch.batchId}:raw-copy-unexpected-extension:${file.sourcePath}`);
    expect(Number.isFinite(file.sizeBytes) && file.sizeBytes > 0, `${batch.batchId}:raw-copy-invalid-size:${file.sourcePath}`);
  }
}

function validateHashReceipt(batch, receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-hash-receipt.v1", `${batch.batchId}:hash-receipt-invalid-schema`);
  expect(Array.isArray(receipt.files) && receipt.files.length === batch.itemCount, `${batch.batchId}:hash-receipt-file-count-mismatch`);
  for (const file of receipt.files ?? []) {
    expect(isSafeRawDestination(file.path), `${batch.batchId}:hash-receipt-unsafe-path:${file.path}`);
    expect(isSha256(file.sha256), `${batch.batchId}:hash-receipt-invalid-sha:${file.path}`);
    expect(isBlobSha(file.blobSha), `${batch.batchId}:hash-receipt-invalid-blob:${file.path}`);
    expect(Number.isFinite(file.sizeBytes) && file.sizeBytes > 0, `${batch.batchId}:hash-receipt-invalid-size:${file.path}`);
  }
}

function validateSecretScanReceipt(batch, receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-secret-scan-receipt.v1", `${batch.batchId}:secret-receipt-invalid-schema`);
  expect(receipt.scanner === "copy-remaining-batch-from-github", `${batch.batchId}:secret-receipt-wrong-scanner`);
  expect(receipt.filesScanned === batch.itemCount, `${batch.batchId}:secret-receipt-file-count-mismatch`);
  expect(receipt.bytesScanned === batch.totalBytes, `${batch.batchId}:secret-receipt-byte-count-mismatch`);
  expect(receipt.findingCount === 0, `${batch.batchId}:secret-receipt-findings`);
  expect(Array.isArray(receipt.findings) && receipt.findings.length === 0, `${batch.batchId}:secret-receipt-findings-array`);
  expect(receipt.result === "pass", `${batch.batchId}:secret-receipt-must-pass`);
}

function validateCollisionReceipt(batch, receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-collision-receipt.v1", `${batch.batchId}:collision-receipt-invalid-schema`);
  expect(receipt.first31PlanPath === firstRawCopyPlanPath, `${batch.batchId}:collision-receipt-wrong-first31-plan`);
  expect(Array.isArray(receipt.overlapsFirst31) && receipt.overlapsFirst31.length === 0, `${batch.batchId}:collision-receipt-overlaps-first31`);
  expect(Array.isArray(receipt.targetPathCollisions) && receipt.targetPathCollisions.length === 0, `${batch.batchId}:collision-receipt-target-collisions`);
  expect(Array.isArray(receipt.caseFoldCollisions) && receipt.caseFoldCollisions.length === 0, `${batch.batchId}:collision-receipt-case-collisions`);
  expect(Array.isArray(receipt.duplicateContent) && receipt.duplicateContent.length === 0, `${batch.batchId}:collision-receipt-duplicate-content`);
  expect(Array.isArray(receipt.duplicateSourceBlob) && receipt.duplicateSourceBlob.length === 0, `${batch.batchId}:collision-receipt-duplicate-source`);
  expect(receipt.result === "pass", `${batch.batchId}:collision-receipt-must-pass`);
}

function validateValidatorReceipt(batch, receipt) {
  expect(receipt.schema === "nexusengine.goldrush.remaining-batch-validator-receipt.v1", `${batch.batchId}:validator-receipt-invalid-schema`);
  expect(["1", "2"].includes(receipt.validatorVersion), `${batch.batchId}:validator-receipt-version-mismatch`);
  expect(receipt.validatedAgainstFirst31ReceiptSet === true, `${batch.batchId}:validator-receipt-must-check-first31`);
  expect(receipt.validatedAgainstBatchIndex === true, `${batch.batchId}:validator-receipt-must-check-index`);
  expect(receipt.expectedItemCount === batch.itemCount, `${batch.batchId}:validator-receipt-item-count-mismatch`);
  expect(receipt.expectedTotalBytes === batch.totalBytes, `${batch.batchId}:validator-receipt-byte-total-mismatch`);
  expect(receipt.result === "pass", `${batch.batchId}:validator-receipt-must-pass`);
  expect(Array.isArray(receipt.errors) && receipt.errors.length === 0, `${batch.batchId}:validator-receipt-errors`);
}

function validateAgainstProof(batch, receipts) {
  const sequence = getBatchSequence(batch.batchId);
  const fetchProofPath = `reports/provenance/${importJobId}-next-${sequence}-fetch-proof.json`;
  const rawWriteProofPath = `reports/provenance/${importJobId}-next-${sequence}-raw-write-proof.json`;
  const fetchProof = readJson(fetchProofPath);
  const rawWriteProof = existsSync(path.join(repoRoot, rawWriteProofPath))
    ? readJson(rawWriteProofPath)
    : null;
  const rawReceipt = receipts["raw-copy.receipt.json"];

  expect(fetchProof.schema === "nexusengine.goldrush.remaining-batch-fetch-proof.v1", `${batch.batchId}:fetch-proof-invalid-schema`);
  expect(fetchProof.write === false, `${batch.batchId}:fetch-proof-must-not-write`);
  expect(fetchProof.batchId === batch.batchId, `${batch.batchId}:fetch-proof-batch-mismatch`);
  expect(fetchProof.itemCount === batch.itemCount, `${batch.batchId}:fetch-proof-item-count-mismatch`);
  expect(fetchProof.totalBytes === batch.totalBytes, `${batch.batchId}:fetch-proof-byte-total-mismatch`);
  expect(fetchProof.publicPromotion === false, `${batch.batchId}:fetch-proof-must-not-promote-public`);
  expect(fetchProof.runtimePromotion === false, `${batch.batchId}:fetch-proof-must-not-promote-runtime`);

  if (rawReceipt.mode === "raw-files-written") {
    expect(rawReceipt.proofPath === rawWriteProofPath, `${batch.batchId}:raw-copy-receipt-wrong-write-proof-path`);
    expect(rawWriteProof?.schema === "nexusengine.goldrush.remaining-batch-fetch-proof.v1", `${batch.batchId}:raw-write-proof-invalid-schema`);
    expect(rawWriteProof?.status === "remaining-batch-worker-wrote-raw-files", `${batch.batchId}:raw-write-proof-wrong-status`);
    expect(rawWriteProof?.write === true, `${batch.batchId}:raw-write-proof-must-write`);
    expect(rawWriteProof?.itemCount === batch.itemCount, `${batch.batchId}:raw-write-proof-item-count-mismatch`);
    expect(rawWriteProof?.totalBytes === batch.totalBytes, `${batch.batchId}:raw-write-proof-byte-total-mismatch`);
    expect(rawWriteProof?.receiptCounts?.secretFindings === 0, `${batch.batchId}:raw-write-proof-secret-findings`);
    expect(rawWriteProof?.publicPromotion === false, `${batch.batchId}:raw-write-proof-must-not-promote-public`);
    expect(rawWriteProof?.runtimePromotion === false, `${batch.batchId}:raw-write-proof-must-not-promote-runtime`);
  }

  const rawTargets = rawReceipt.fetchedFiles.map((file) => file.targetRawPath);
  const folded = new Set();
  for (const targetPath of rawTargets) {
    expect(!first31Targets.has(targetPath), `${batch.batchId}:target-overlaps-first31:${targetPath}`);
    expect(!folded.has(targetPath.toLowerCase()), `${batch.batchId}:case-fold-target-collision:${targetPath}`);
    folded.add(targetPath.toLowerCase());
  }
}

function validateRawWriteState(batch, receipts) {
  const rawReceipt = receipts["raw-copy.receipt.json"];
  if (rawReceipt.mode === "fetch-proof-only") {
    for (const file of rawReceipt.fetchedFiles ?? []) {
      expect(!existsSync(path.join(repoRoot, file.targetRawPath)), `${batch.batchId}:remaining-batch-raw-file-written-before-gate:${file.targetRawPath}`);
    }
    return;
  }
  for (const file of rawReceipt.fetchedFiles ?? []) {
    const absolute = path.join(repoRoot, file.targetRawPath);
    expect(existsSync(absolute), `${batch.batchId}:remaining-batch-raw-file-missing:${file.targetRawPath}`);
    if (existsSync(absolute)) {
      const bytes = readFileSync(absolute);
      expect(bytes.length === file.sizeBytes, `${batch.batchId}:remaining-batch-raw-file-size-mismatch:${file.targetRawPath}`);
      expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}` === file.sourceHash, `${batch.batchId}:remaining-batch-raw-file-hash-mismatch:${file.targetRawPath}`);
    }
  }
}

function getBatchSequence(batchId) {
  const match = batchId.match(/\.next\.(\d{3})\./);
  expect(Boolean(match), `${batchId}:batch-id-missing-sequence`);
  return match?.[1] ?? "000";
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

function hasFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
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
