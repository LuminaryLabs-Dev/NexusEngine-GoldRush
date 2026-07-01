import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createCloudSourceDiscoveryReport } from "./generate-cloud-source-discovery.mjs";
import { createGoldRushAssetIntakeReport } from "./goldrush-asset-intake-classifier.mjs";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultPlanPath = "reports/provenance/goldrush-dual-source-001-raw-copy-plan.json";
const defaultHandoffPath = "manifests/import-jobs/goldrush-cloud-transfer-handoff.json";

const textLikeExtensions = new Set([
  ".anim",
  ".asset",
  ".controller",
  ".json",
  ".mat",
  ".meta",
  ".prefab",
  ".txt",
  ".unity",
  ".xml",
  ".yaml",
  ".yml",
]);

const secretPatterns = [
  { type: "github-token", pattern: /github_pat_|gh[pousr]_/i },
  { type: "aws-access-key", pattern: /AKIA[0-9A-Z]{16}/ },
  { type: "private-key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { type: "secret-key-name", pattern: /\b(password|secret|token|api[_-]?key|app[_-]?id)\b\s*[:=]/i },
  { type: "credential-url", pattern: /https?:\/\/[^/\s:@]+:[^@\s]+@/i },
];

export function createRawCopyWorkerSummary({
  planPath = defaultPlanPath,
  handoffPath = defaultHandoffPath,
} = {}) {
  const plan = readJson(planPath);
  const handoff = readJson(handoffPath);
  const entries = getPlanEntries(plan);
  return {
    importJobId: plan.importJobId,
    source: plan.source,
    destinationRepo: handoff.repositories?.destination?.nameWithOwner,
    rawImportBranch: handoff.repositories?.destination?.rawImportBranch,
    rawRoot: plan.destination?.rawRoot,
    domains: summarizeDomains(plan),
    totals: {
      selectedFiles: entries.length,
      selectedBytes: entries.reduce((total, entry) => total + entry.sizeBytes, 0),
      deferredSlots: (plan.domains ?? []).reduce((total, domain) => total + (domain.deferred ?? []).length, 0),
    },
  };
}

export async function copyRawPlanFromGithub({
  planPath = defaultPlanPath,
  handoffPath = defaultHandoffPath,
  generatedAt = new Date().toISOString(),
  write = false,
  fetch = write,
  confirmPublicRawImportRisk = false,
} = {}) {
  const plan = readJson(planPath);
  const handoff = readJson(handoffPath);
  const failures = [];
  const entries = getPlanEntries(plan);

  expect(plan.schema === "nexusengine.goldrush.cloud-raw-copy-plan.v1", "invalid-raw-copy-plan-schema", failures);
  expect(plan.importJobId === handoff.importJobId, "import-job-mismatch", failures);
  expect(plan.destination?.rawRoot === handoff.destinationFolders?.rawCandidates, "raw-root-handoff-mismatch", failures);
  expect(entries.length === plan.totals?.selectedFiles, "selected-file-total-mismatch", failures);
  expect(!write || confirmPublicRawImportRisk, "write-requires-confirm-public-raw-import-risk", failures);

  for (const entry of entries) {
    expect(isSafeSourcePath(entry.sourcePath), `unsafe-source-path:${entry.sourcePath}`, failures);
    expect(entry.targetRawPath === `${plan.destination.rawRoot}${entry.sourcePath}`, `target-path-mismatch:${entry.sourcePath}`, failures);
    expect(!isDeniedPath(entry.sourcePath), `denied-source-path:${entry.sourcePath}`, failures);
    expect(!isDeniedPath(entry.targetRawPath), `denied-target-path:${entry.targetRawPath}`, failures);
  }

  assert(failures.length === 0, `raw copy worker preflight failed: ${failures.join(", ")}`);

  if (!fetch) {
    return {
      status: "raw-copy-worker-dry-run-ready",
      write: false,
      fetch: false,
      ...createRawCopyWorkerSummary({ planPath, handoffPath }),
      receiptsToWrite: receiptPaths(handoff),
    };
  }

  const copied = [];
  const secretFindings = [];

  for (const entry of entries) {
    const bytes = readGithubBlob({
      sourceRepo: plan.source.nameWithOwner,
      blobSha: entry.blobSha,
    });
    const sourceHash = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
    expect(bytes.length === entry.sizeBytes, `downloaded-size-mismatch:${entry.sourcePath}`, failures);
    const findings = detectSecretFindings(entry, bytes);
    secretFindings.push(...findings);
    copied.push({
      ...entry,
      bytes,
      sourceHash,
    });
  }

  expect(secretFindings.length === 0, "secret-scan-blocked", failures);
  assert(failures.length === 0, `raw copy worker download failed: ${failures.join(", ")}`);

  const sourceDiscoveryReport = createCloudSourceDiscoveryReport({ generatedAt });
  const denyPathReport = {
    schema: "nexusengine.goldrush.deny-path-scan.v1",
    importJobId: plan.importJobId,
    status: "passed",
    generatedAt,
    rawCopyPlan: planPath,
    scannedPaths: entries.flatMap((entry) => [entry.sourcePath, entry.targetRawPath]),
    blockedPaths: [],
  };
  const secretScanReport = {
    schema: "nexusengine.goldrush.secret-scan.v1",
    importJobId: plan.importJobId,
    status: "passed",
    generatedAt,
    rawCopyPlan: planPath,
    findings: secretFindings,
  };
  const copyLedger = {
    schema: "nexusengine.goldrush.copy-ledger.v1",
    importJobId: plan.importJobId,
    generatedAt,
    rawCopyPlan: planPath,
    copiedFiles: copied.map((entry) => ({
      sourcePath: entry.sourcePath,
      destinationPath: entry.targetRawPath,
      sourceHash: entry.sourceHash,
      sizeBytes: entry.sizeBytes,
      domain: entry.domainId,
      slotId: entry.slotId,
    })),
  };
  const hashManifest = {
    schema: "nexusengine.goldrush.hash-manifest.v1",
    importJobId: plan.importJobId,
    generatedAt,
    rawCopyPlan: planPath,
    files: copied.map((entry) => ({
      path: entry.targetRawPath,
      sha256: entry.sourceHash,
      sizeBytes: entry.sizeBytes,
      sourcePath: entry.sourcePath,
      slotId: entry.slotId,
    })),
  };
  const classificationReport = createGoldRushAssetIntakeReport({
    importJobId: plan.importJobId,
    rootPath: plan.destination.rawRoot.replace(/\/$/, ""),
    generatedAt,
    files: copied.map((entry) => ({
      path: entry.sourcePath,
      sizeBytes: entry.sizeBytes,
      sourceHash: entry.sourceHash,
    })),
  });

  const receipts = {
    sourceDiscoveryReport,
    denyPathReport,
    secretScanReport,
    copyLedger,
    hashManifest,
    classificationReport,
  };

  if (write) {
    for (const entry of copied) writeRawFile(entry.targetRawPath, entry.bytes);
    writeReceipts(handoff, receipts);
  }

  return {
    status: write ? "raw-copy-worker-wrote-receipts-and-raw-files" : "raw-copy-worker-fetched-plan",
    write,
    fetch,
    ...createRawCopyWorkerSummary({ planPath, handoffPath }),
    receiptCounts: {
      copiedFiles: copyLedger.copiedFiles.length,
      hashFiles: hashManifest.files.length,
      classificationRecords: [
        ...(classificationReport.candidates ?? []),
        ...(classificationReport.unmapped ?? []),
        ...(classificationReport.blocked ?? []),
      ].length,
      secretFindings: secretFindings.length,
    },
    receiptsToWrite: receiptPaths(handoff),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const result = await copyRawPlanFromGithub(args);
  if (args.summaryOut) {
    const outPath = join(repoRoot, normalizeRepoPath(args.summaryOut));
    writeSanitizedJsonArtifactSync(outPath, result, { repoRoot });
  }
  console.log(sanitizedConsoleJson(result, { repoRoot }));
}

function readGithubBlob({ sourceRepo, blobSha }) {
  const output = execFileSync("gh", [
    "api",
    `repos/${sourceRepo}/git/blobs/${blobSha}`,
    "--jq",
    "{sha:.sha,encoding:.encoding,content:.content}",
  ], {
    encoding: "utf8",
    maxBuffer: 100 * 1024 * 1024,
  });
  const blob = JSON.parse(output);
  assert(blob.sha === blobSha, `github blob sha mismatch: ${blobSha}`);
  assert(blob.encoding === "base64", `unsupported github blob encoding: ${blob.encoding}`);
  return Buffer.from(blob.content.replace(/\n/g, ""), "base64");
}

function getPlanEntries(plan) {
  return (plan.domains ?? []).flatMap((domain) =>
    (domain.selected ?? []).map((entry) => ({ ...entry, domainId: domain.id }))
  );
}

function summarizeDomains(plan) {
  return (plan.domains ?? []).map((domain) => ({
    id: domain.id,
    selectedCount: domain.selectedCount,
    deferredCount: domain.deferredCount,
    selectedBytes: (domain.selected ?? []).reduce((total, entry) => total + entry.sizeBytes, 0),
  }));
}

function writeRawFile(relPath, bytes) {
  const safePath = normalizeRepoPath(relPath);
  const absolute = join(repoRoot, safePath);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, bytes);
}

function writeReceipts(handoff, receipts) {
  const paths = receiptPaths(handoff);
  for (const [key, report] of Object.entries(receipts)) {
    const relPath = paths[key];
    const absolute = join(repoRoot, normalizeRepoPath(relPath));
    writeSanitizedJsonArtifactSync(absolute, report, { repoRoot });
  }
}

function receiptPaths(handoff) {
  return {
    sourceDiscoveryReport: handoff.destinationFolders?.sourceDiscoveryReport,
    denyPathReport: handoff.destinationFolders?.denyPathReport,
    secretScanReport: handoff.destinationFolders?.secretScanReport,
    copyLedger: handoff.destinationFolders?.copyLedger,
    hashManifest: handoff.destinationFolders?.hashManifest,
    classificationReport: handoff.destinationFolders?.classificationReport,
  };
}

function detectSecretFindings(entry, bytes) {
  if (!textLikeExtensions.has(entry.extension) || bytes.length > 1024 * 1024) return [];
  const text = bytes.toString("utf8");
  return secretPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ type }) => ({
      path: entry.sourcePath,
      type,
    }));
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
    "/Assets/Photon",
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
    if (arg === "--plan") args.planPath = argv[++index];
    else if (arg === "--handoff") args.handoffPath = argv[++index];
    else if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--summary-out") args.summaryOut = argv[++index];
    else if (arg === "--fetch") args.fetch = true;
    else if (arg === "--write") {
      args.write = true;
      args.fetch = true;
    } else if (arg === "--confirm-public-raw-import-risk") args.confirmPublicRawImportRisk = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relPath) {
  return JSON.parse(readFileSync(join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
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

function normalizePath(value) {
  return value.split("\\").join("/");
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
