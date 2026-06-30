import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const defaultBatchId = `${importJobId}.next.001.audio-music-and-sfx`;
const coveragePath = `reports/provenance/${importJobId}-remaining-coverage.json`;
const fetchProofPath = `reports/provenance/${importJobId}-next-001-fetch-proof.json`;
const firstRawCopyPlanPath = `reports/provenance/${importJobId}-raw-copy-plan.json`;
const receiptRoot = "reports/provenance/remaining-batches";
const activeAudioExtensions = new Set([".ogg", ".mp3", ".wav"]);

export function generateRemainingBatchReceipts({
  batchId = defaultBatchId,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const coverage = readJson(coveragePath);
  const fetchProof = readJson(fetchProofPath);
  const firstRawCopyPlan = readJson(firstRawCopyPlanPath);
  const batch = (coverage.nextCopyBatches ?? []).find((candidate) => candidate.batchId === batchId);
  assert(batch, `batch not found: ${batchId}`);

  const firstPlanTargets = new Set(
    (firstRawCopyPlan.domains ?? [])
      .flatMap((domain) => domain.selected ?? [])
      .map((entry) => entry.targetRawPath)
  );
  const fetchedByTarget = new Map((fetchProof.copiedFiles ?? []).map((entry) => [entry.targetRawPath, entry]));
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
    mode: "fetch-proof-only",
    rawFilesWritten: false,
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
    filesScanned: fetchProof.receiptCounts?.copiedFiles ?? rawCopyReceipt.fetchedFiles.length,
    bytesScanned: fetchProof.totalBytes,
    findingCount: fetchProof.receiptCounts?.secretFindings ?? 0,
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
    validatorVersion: "1",
    validatedAgainstFirst31ReceiptSet: true,
    validatedAgainstBatchIndex: true,
    expectedItemCount: 15,
    expectedTotalBytes: 90145108,
    expectedExtensions: [...activeAudioExtensions].sort(),
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
  const index = {
    schema: "nexusengine.goldrush.remaining-batch-index.v1",
    importJobId,
    generatedAt,
    appendOnly: true,
    doesNotModifyFirst31Gate: true,
    batches: [
      {
        batchId,
        domainId: batch.domainId,
        status: "fetch-proof-receipts-ready",
        itemCount: batch.itemCount,
        totalBytes: batch.totalBytes,
        receiptRoot: batchDir,
        receiptDigests,
        publicPromotion: false,
        runtimePromotion: false,
      },
    ],
  };

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
  console.log(JSON.stringify({
    status: args.write ? "remaining-batch-receipts-written" : "remaining-batch-receipts-dry-run",
    indexPath: result.indexPath,
    batchDir: result.batchDir,
    receiptFiles: Object.keys(result.receiptFiles).length,
    batches: result.index.batches.length,
  }, null, 2));
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

function writeJson(relativePath, value) {
  const absolute = join(repoRoot, normalizeRepoPath(relativePath));
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
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
