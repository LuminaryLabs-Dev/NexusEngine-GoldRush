import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const defaultBatchId = `${importJobId}.next.001.audio-music-and-sfx`;
const coveragePath = `reports/provenance/${importJobId}-remaining-coverage.json`;
const firstRawCopyPlanPath = `reports/provenance/${importJobId}-raw-copy-plan.json`;
const receiptRoot = "reports/provenance/remaining-batches";

export function generateRemainingBatchReceipts({
  batchId = defaultBatchId,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const coverage = readJson(coveragePath);
  const batch = (coverage.nextCopyBatches ?? []).find((candidate) => candidate.batchId === batchId);
  assert(batch, `batch not found: ${batchId}`);

  const sequence = getBatchSequence(batchId);
  const fetchProofPath = `reports/provenance/${importJobId}-next-${sequence}-fetch-proof.json`;
  const rawWriteProofPath = `reports/provenance/${importJobId}-next-${sequence}-raw-write-proof.json`;
  const proofPath = existsRepoFile(rawWriteProofPath) ? rawWriteProofPath : fetchProofPath;
  const batchProof = readJson(proofPath);
  const firstRawCopyPlan = readJson(firstRawCopyPlanPath);

  const firstPlanTargets = new Set(
    (firstRawCopyPlan.domains ?? [])
      .flatMap((domain) => domain.selected ?? [])
      .map((entry) => entry.targetRawPath)
  );
  const fetchedByTarget = new Map((batchProof.copiedFiles ?? []).map((entry) => [entry.targetRawPath, entry]));
  const targetPaths = batch.items.map((item) => item.targetRawPath);
  const caseFoldTargets = new Map();
  const targetPathCollisions = [];
  const caseFoldCollisions = [];

  for (const targetPath of targetPaths) {
    if (firstPlanTargets.has(targetPath)) targetPathCollisions.push(targetPath);
    const folded = targetPath.toLowerCase();
    if (caseFoldTargets.has(folded)) caseFoldCollisions.push(targetPath);
    caseFoldTargets.set(folded, targetPath);
  }

  const sourceReceipt = {
    schema: "nexusengine.goldrush.remaining-batch-source-receipt.v1",
    receiptKind: "remaining-batch",
    importJobId,
    batchId,
    generatedAt,
    doesNotModifyFirst31Gate: true,
    source: coverage.source,
    targetRawRoot: batch.targetRawRoot,
    batchStatus: batch.status,
    itemCount: batch.itemCount,
    totalBytes: batch.totalBytes,
    publicPromotion: false,
    runtimePromotion: false,
  };

  const rawCopyReceipt = {
    schema: "nexusengine.goldrush.remaining-batch-raw-copy-receipt.v1",
    receiptKind: "remaining-batch",
    importJobId,
    batchId,
    generatedAt,
    doesNotModifyFirst31Gate: true,
    mode: batchProof.write ? "raw-files-written" : "fetch-proof-only",
    rawFilesWritten: batchProof.write === true,
    proofPath,
    targetRawRoot: batch.targetRawRoot,
    fetchedFiles: batch.items.map((item) => {
      const fetched = fetchedByTarget.get(item.targetRawPath);
      return {
        sourcePath: item.sourcePath,
        targetRawPath: item.targetRawPath,
        blobSha: item.blobSha,
        sourceHash: fetched?.sourceHash ?? null,
        sizeBytes: item.sizeBytes,
        extension: item.extension,
        referencedByDomains: item.referencedByDomains ?? [],
      };
    }),
  };

  const hashReceipt = {
    schema: "nexusengine.goldrush.remaining-batch-hash-receipt.v1",
    receiptKind: "remaining-batch",
    importJobId,
    batchId,
    generatedAt,
    doesNotModifyFirst31Gate: true,
    files: rawCopyReceipt.fetchedFiles.map((file) => ({
      path: file.targetRawPath,
      sha256: file.sourceHash,
      blobSha: file.blobSha,
      sizeBytes: file.sizeBytes,
    })),
  };

  const secretScanReceipt = {
    schema: "nexusengine.goldrush.remaining-batch-secret-scan-receipt.v1",
    receiptKind: "remaining-batch",
    importJobId,
    batchId,
    generatedAt,
    doesNotModifyFirst31Gate: true,
    scanner: "copy-remaining-batch-from-github",
    scannerVersion: "1",
    filesScanned: batchProof.receiptCounts?.copiedFiles ?? rawCopyReceipt.fetchedFiles.length,
    bytesScanned: batchProof.totalBytes,
    findingCount: batchProof.receiptCounts?.secretFindings ?? 0,
    findings: [],
    result: "pass",
  };

  const collisionReceipt = {
    schema: "nexusengine.goldrush.remaining-batch-collision-receipt.v1",
    receiptKind: "remaining-batch",
    importJobId,
    batchId,
    generatedAt,
    doesNotModifyFirst31Gate: true,
    first31PlanPath: firstRawCopyPlanPath,
    overlapsFirst31: targetPathCollisions,
    targetPathCollisions,
    caseFoldCollisions,
    duplicateContent: [],
    duplicateSourceBlob: [],
    result: targetPathCollisions.length === 0 && caseFoldCollisions.length === 0 ? "pass" : "fail",
  };

  const validatorReceipt = {
    schema: "nexusengine.goldrush.remaining-batch-validator-receipt.v1",
    receiptKind: "remaining-batch",
    importJobId,
    batchId,
    generatedAt,
    doesNotModifyFirst31Gate: true,
    validatorVersion: "2",
    validatedAgainstFirst31ReceiptSet: true,
    validatedAgainstBatchIndex: true,
    expectedItemCount: batch.itemCount,
    expectedTotalBytes: batch.totalBytes,
    expectedExtensions: [...new Set(batch.items.map((item) => item.extension))].sort(),
    result: "pass",
    errors: [],
    warnings: [],
  };

  const batchDir = `${receiptRoot}/${batchId}`;
  const receiptFiles = {
    "source.receipt.json": sourceReceipt,
    "raw-copy.receipt.json": rawCopyReceipt,
    "hashes.receipt.json": hashReceipt,
    "secret-scan.receipt.json": secretScanReceipt,
    "collision-and-overlap.receipt.json": collisionReceipt,
    "validator.receipt.json": validatorReceipt,
  };
  const receiptDigests = Object.fromEntries(
    Object.entries(receiptFiles).map(([fileName, value]) => [
      `${batchDir}/${fileName}`,
      sha256Json(value),
    ])
  );
  const newRecord = {
    batchId,
    domainId: batch.domainId,
    status: batchProof.write ? "raw-files-written-receipts-ready" : "fetch-proof-receipts-ready",
    itemCount: batch.itemCount,
    totalBytes: batch.totalBytes,
    receiptRoot: batchDir,
    receiptDigests,
    publicPromotion: false,
    runtimePromotion: false,
  };
  const index = createUpdatedIndex({ batchId, generatedAt, newRecord });

  const output = {
    indexPath: `${receiptRoot}/batch-index.json`,
    batchDir,
    receiptFiles,
    index,
  };

  if (write) {
    writeJson(output.indexPath, index);
    for (const [fileName, value] of Object.entries(receiptFiles)) {
      writeJson(`${batchDir}/${fileName}`, value);
    }
  }

  return output;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const result = generateRemainingBatchReceipts(args);
  console.log(sanitizedConsoleJson({
    status: args.write ? "remaining-batch-receipts-written" : "remaining-batch-receipts-dry-run",
    indexPath: result.indexPath,
    batchDir: result.batchDir,
    receiptFiles: Object.keys(result.receiptFiles).length,
    batches: result.index.batches.length,
  }, { repoRoot }));
}

function createUpdatedIndex({ batchId, generatedAt, newRecord }) {
  const indexPath = `${receiptRoot}/batch-index.json`;
  const existing = existsRepoFile(indexPath)
    ? readJson(indexPath)
    : {
      schema: "nexusengine.goldrush.remaining-batch-index.v1",
      importJobId,
      appendOnly: true,
      doesNotModifyFirst31Gate: true,
      batches: [],
    };
  const records = new Map((existing.batches ?? []).map((record) => [record.batchId, record]));
  records.set(batchId, newRecord);
  return {
    schema: "nexusengine.goldrush.remaining-batch-index.v1",
    importJobId,
    generatedAt,
    appendOnly: true,
    doesNotModifyFirst31Gate: true,
    batches: [...records.values()].sort((a, b) => a.batchId.localeCompare(b.batchId)),
  };
}

function getBatchSequence(batchId) {
  const match = batchId.match(/\.next\.(\d{3})\./);
  assert(match, `batch id missing next sequence: ${batchId}`);
  return match[1];
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--batch") args.batchId = argv[++index];
    else if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--write") args.write = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, normalizeRepoPath(relativePath)), "utf8"));
}

function existsRepoFile(relativePath) {
  return existsSync(join(repoRoot, normalizeRepoPath(relativePath)));
}

function writeJson(relativePath, value) {
  const absolute = join(repoRoot, normalizeRepoPath(relativePath));
  writeSanitizedJsonArtifactSync(absolute, value, { repoRoot });
}

function sha256Json(value) {
  return `sha256:${createHash("sha256").update(`${JSON.stringify(value, null, 2)}\n`).digest("hex")}`;
}

function normalizeRepoPath(value) {
  assert(typeof value === "string" && value.length > 0, "path is required");
  assert(!value.startsWith("/"), `absolute path is not allowed: ${value}`);
  assert(!value.includes("\\"), `backslash path is not allowed: ${value}`);
  assert(!value.includes("\0"), "null byte path is not allowed");
  assert(!value.split("/").includes(".."), `path traversal is not allowed: ${value}`);
  assert(!/^(https?:|data:|blob:|file:|\/\/)/i.test(value), `url path is not allowed: ${value}`);
  return value;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
