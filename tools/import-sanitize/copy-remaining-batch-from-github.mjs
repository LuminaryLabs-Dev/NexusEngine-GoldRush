import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  sanitizeTextForOutput,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const defaultCoveragePath = `reports/provenance/${importJobId}-remaining-coverage.json`;
const defaultBatchId = `${importJobId}.next.001.audio-music-and-sfx`;
const defaultProofPath = `reports/provenance/${importJobId}-next-001-fetch-proof.json`;
const textLikeExtensions = new Set([".anim", ".asset", ".controller", ".json", ".mat", ".meta", ".prefab", ".txt", ".unity", ".xml", ".yaml", ".yml"]);
const secretPatterns = [
  { type: "github-token", pattern: /github_pat_|gh[pousr]_/i },
  { type: "aws-access-key", pattern: /AKIA[0-9A-Z]{16}/ },
  { type: "private-key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { type: "secret-key-name", pattern: /\b(password|secret|token|api[_-]?key|app[_-]?id)\b\s*[:=]/i },
  { type: "credential-url", pattern: /https?:\/\/[^/\s:@]+:[^@\s]+@/i },
];

export function createRemainingBatchWorkerSummary({
  coveragePath = defaultCoveragePath,
  batchId = defaultBatchId,
} = {}) {
  const coverage = readJson(coveragePath);
  const batch = findBatch(coverage, batchId);
  return {
    importJobId: coverage.importJobId,
    source: coverage.source,
    batchId: batch.batchId,
    domainId: batch.domainId,
    status: batch.status,
    targetRawRoot: batch.targetRawRoot,
    itemCount: batch.itemCount,
    totalBytes: batch.totalBytes,
    publicPromotion: coverage.publicPromotion,
    runtimePromotion: coverage.runtimePromotion,
    receiptRequirements: batch.receiptRequirements,
    promotionBlockedBy: batch.promotionBlockedBy,
  };
}

export function copyRemainingBatchFromGithub({
  coveragePath = defaultCoveragePath,
  batchId = defaultBatchId,
  generatedAt = new Date().toISOString(),
  fetch = false,
  write = false,
  confirmPublicRawImportRisk = false,
  proofOut = defaultProofPath,
} = {}) {
  const coverage = readJson(coveragePath);
  const batch = findBatch(coverage, batchId);
  const failures = [];

  expect(coverage.schema === "nexusengine.goldrush.remaining-asset-coverage.v1", "invalid-coverage-schema", failures);
  expect(coverage.importJobId === importJobId, "wrong-import-job", failures);
  expect(coverage.publicPromotion === false, "coverage-must-not-promote-public-assets", failures);
  expect(coverage.runtimePromotion === false, "coverage-must-not-promote-runtime-assets", failures);
  expect(batch.status === "planned-not-copied", "batch-must-be-planned-not-copied", failures);
  expect(batch.itemCount === (batch.items ?? []).length, "batch-item-count-mismatch", failures);
  expect(batch.totalBytes === sumBytes(batch.items ?? []), "batch-byte-total-mismatch", failures);
  expect(!write || confirmPublicRawImportRisk, "write-requires-confirm-public-raw-import-risk", failures);

  const targetPaths = new Set();
  for (const item of batch.items ?? []) {
    expect(isSafeSourcePath(item.sourcePath), `unsafe-source-path:${item.sourcePath}`, failures);
    expect(isBlobSha(item.blobSha), `invalid-blob-sha:${item.sourcePath}`, failures);
    expect(item.targetRawPath === `${batch.targetRawRoot}${item.sourcePath}`, `target-path-mismatch:${item.sourcePath}`, failures);
    expect(!targetPaths.has(item.targetRawPath), `duplicate-target-path:${item.targetRawPath}`, failures);
    targetPaths.add(item.targetRawPath);
    expect(!isDeniedPath(item.sourcePath), `denied-source-path:${item.sourcePath}`, failures);
    expect(!isDeniedPath(item.targetRawPath), `denied-target-path:${item.targetRawPath}`, failures);
  }

  assert(failures.length === 0, `remaining batch worker preflight failed: ${failures.join(", ")}`);

  if (!fetch && !write) {
    return {
      fetch: false,
      write: false,
      ...createRemainingBatchWorkerSummary({ coveragePath, batchId }),
      status: "remaining-batch-worker-dry-run-ready",
      proofOut,
    };
  }

  const copied = [];
  const secretFindings = [];
  try {
    for (const item of batch.items ?? []) {
      const bytes = readGithubBlob({
        sourceRepo: coverage.source.nameWithOwner,
        blobSha: item.blobSha,
      });
      const sourceHash = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
      expect(bytes.length === item.sizeBytes, `downloaded-size-mismatch:${item.sourcePath}`, failures);
      secretFindings.push(...detectSecretFindings(item, bytes));
      copied.push({ ...item, bytes, sourceHash });
    }
  } catch (error) {
    const failure = createFetchFailureProof({
      generatedAt,
      batch,
      coverage,
      write,
      error,
    });
    if (proofOut) writeJson(proofOut, failure);
    throw new Error(`${failure.status}: ${failure.error.kind}`);
  }

  expect(secretFindings.length === 0, "secret-scan-blocked", failures);
  assert(failures.length === 0, `remaining batch worker download failed: ${failures.join(", ")}`);

  const proof = {
    schema: "nexusengine.goldrush.remaining-batch-fetch-proof.v1",
    importJobId,
    generatedAt,
    status: write ? "remaining-batch-worker-wrote-raw-files" : "remaining-batch-worker-fetched-batch",
    fetch: true,
    write,
    batchId: batch.batchId,
    domainId: batch.domainId,
    source: coverage.source,
    targetRawRoot: batch.targetRawRoot,
    itemCount: copied.length,
    totalBytes: copied.reduce((sum, item) => sum + item.sizeBytes, 0),
    receiptRequirements: batch.receiptRequirements,
    promotionBlockedBy: batch.promotionBlockedBy,
    publicPromotion: false,
    runtimePromotion: false,
    copiedFiles: copied.map((item) => ({
      sourcePath: item.sourcePath,
      targetRawPath: item.targetRawPath,
      blobSha: item.blobSha,
      sourceHash: item.sourceHash,
      sizeBytes: item.sizeBytes,
      extension: item.extension,
      referencedByDomains: item.referencedByDomains ?? [],
    })),
    receiptCounts: {
      copiedFiles: copied.length,
      hashFiles: copied.length,
      secretFindings: secretFindings.length,
    },
  };

  if (write) {
    for (const item of copied) writeRawFile(item.targetRawPath, item.bytes);
  }
  if (proofOut) writeJson(proofOut, proof);

  return proof;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  try {
    const result = copyRemainingBatchFromGithub(args);
    console.log(sanitizedConsoleJson(result, { repoRoot }));
  } catch (error) {
    console.error(sanitizedConsoleJson({
      status: "remaining-batch-worker-failed",
      error: sanitizeTextForOutput(error.message, { repoRoot }),
    }, { repoRoot }));
    process.exit(1);
  }
}

function findBatch(coverage, batchId) {
  const batch = (coverage.nextCopyBatches ?? []).find((candidate) => candidate.batchId === batchId);
  assert(batch, `batch not found: ${batchId}`);
  return batch;
}

function readGithubBlob({ sourceRepo, blobSha }) {
  const output = execFileSync("gh", [
    "api",
    `repos/${sourceRepo}/git/blobs/${blobSha}`,
    "--jq",
    "{sha:.sha,encoding:.encoding,content:.content}",
  ], {
    encoding: "utf8",
    maxBuffer: 120 * 1024 * 1024,
  });
  const blob = JSON.parse(output);
  assert(blob.sha === blobSha, `github blob sha mismatch: ${blobSha}`);
  assert(blob.encoding === "base64", `unsupported github blob encoding: ${blob.encoding}`);
  return Buffer.from(blob.content.replace(/\n/g, ""), "base64");
}

function createFetchFailureProof({ generatedAt, batch, coverage, write, error }) {
  const githubError = parseGithubError(error);
  return {
    schema: "nexusengine.goldrush.remaining-batch-fetch-failure.v1",
    importJobId,
    generatedAt,
    status: "remaining-batch-worker-fetch-blocked",
    fetch: false,
    write: false,
    requestedWrite: write === true,
    batchId: batch.batchId,
    domainId: batch.domainId,
    source: coverage.source,
    targetRawRoot: batch.targetRawRoot,
    itemCount: batch.itemCount,
    totalBytes: batch.totalBytes,
    publicPromotion: false,
    runtimePromotion: false,
    rawFilesWritten: false,
    error: githubError,
  };
}

function parseGithubError(error) {
  const stdout = String(error?.stdout ?? "");
  let response = {};
  try {
    response = JSON.parse(stdout);
  } catch {
    response = {};
  }
  return {
    kind: response.status === "401" ? "github-api-bad-credentials" : "github-api-fetch-failed",
    ghExitStatus: Number.isFinite(error?.status) ? error.status : null,
    httpStatus: response.status ?? null,
    message: sanitizeTextForOutput(response.message ?? error?.message ?? "GitHub API request failed", { repoRoot }),
    docs: response.documentation_url ? "https://docs.github.com/rest" : null,
  };
}

function detectSecretFindings(item, bytes) {
  if (!textLikeExtensions.has(item.extension) || bytes.length > 1024 * 1024) return [];
  const text = bytes.toString("utf8");
  return secretPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ type }) => ({ path: item.sourcePath, type }));
}

function isDeniedPath(value) {
  const normalized = `/${normalizePath(value)}`;
  const deniedFragments = [
    "/Packages/manifest.json",
    "/Packages/packages-lock.json",
    "/ProjectSettings/",
    "/UserSettings/",
    "/Library/",
    "/Temp/",
    "/Obj/",
    "/Logs/",
    "/Build/",
    "/Builds/",
    "/Assets/Photon/",
    "/Assets/Plugins/",
    "/PhotonAppSettings.asset",
  ];
  const deniedSuffixes = [".csproj", ".sln", ".env", ".npmrc", ".upmconfig.toml"];
  return deniedFragments.some((fragment) => normalized.includes(fragment))
    || deniedSuffixes.some((suffix) => normalized.endsWith(suffix));
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--coverage") args.coveragePath = argv[++index];
    else if (arg === "--batch") args.batchId = argv[++index];
    else if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--proof-out") args.proofOut = argv[++index];
    else if (arg === "--fetch") args.fetch = true;
    else if (arg === "--write") {
      args.write = true;
      args.fetch = true;
    } else if (arg === "--confirm-public-raw-import-risk") args.confirmPublicRawImportRisk = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, normalizeRepoPath(relativePath)), "utf8"));
}

function writeJson(relativePath, value) {
  const absolute = join(repoRoot, normalizeRepoPath(relativePath));
  writeSanitizedJsonArtifactSync(absolute, value, { repoRoot });
}

function writeRawFile(relativePath, bytes) {
  const absolute = join(repoRoot, normalizeRepoPath(relativePath));
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, bytes);
}

function normalizePath(value) {
  return value.replace(/\\/g, "/");
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

function sumBytes(items) {
  return items.reduce((sum, item) => sum + item.sizeBytes, 0);
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
