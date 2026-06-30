import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  validateGoldRushAssetIntakeReport,
} from "../import-sanitize/goldrush-asset-intake-classifier.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const handoffPath = path.join(repoRoot, "manifests/import-jobs/goldrush-cloud-transfer-handoff.json");
const rawCopyPlanPath = path.join(repoRoot, "reports/provenance/goldrush-dual-source-001-raw-copy-plan.json");
const handoff = JSON.parse(readFileSync(handoffPath, "utf8"));
const rawCopyPlan = existsSync(rawCopyPlanPath)
  ? JSON.parse(readFileSync(rawCopyPlanPath, "utf8"))
  : null;
const destinationFolders = handoff.destinationFolders ?? {};
const failures = [];

const requiredReceiptKeys = [
  "sourceDiscoveryReport",
  "denyPathReport",
  "secretScanReport",
  "copyLedger",
  "hashManifest",
  "classificationReport",
];

const receiptPaths = Object.fromEntries(
  requiredReceiptKeys.map((key) => [key, destinationFolders[key]])
);
const requireReceipts = process.argv.includes("--require-receipts")
  || process.env.GOLDRUSH_REQUIRE_CLOUD_RECEIPTS === "1";

const existingReceipts = requiredReceiptKeys.filter((key) => existsRepoFile(receiptPaths[key]));
const rawCandidateFiles = listRawCandidateFiles(destinationFolders.rawCandidates);
const hasCloudEvidence = existingReceipts.length > 0 || rawCandidateFiles.length > 0;

for (const [key, relPath] of Object.entries(receiptPaths)) {
  expect(isSafeRepoRelativePath(relPath), `unsafe-receipt-path:${key}`);
}

if (!hasCloudEvidence) {
  if (requireReceipts) {
    console.error(JSON.stringify({
      status: "cloud-asset-receipts-required",
      importJobId: handoff.importJobId,
      requiredReceipts: receiptPaths,
      rawCandidateFiles: 0,
      failures: ["cloud-asset-receipts-required"],
    }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({
    status: "waiting-for-cloud-asset-receipts",
    importJobId: handoff.importJobId,
    requiredReceipts: receiptPaths,
    rawCandidateFiles: 0,
  }, null, 2));
  process.exit(0);
}

for (const key of requiredReceiptKeys) {
  expect(existsRepoFile(receiptPaths[key]), `missing-required-cloud-receipt:${key}`);
}

const sourceDiscovery = readReceipt("sourceDiscoveryReport");
const denyScan = readReceipt("denyPathReport");
const secretScan = readReceipt("secretScanReport");
const copyLedger = readReceipt("copyLedger");
const hashManifest = readReceipt("hashManifest");
const classification = readReceipt("classificationReport");

if (sourceDiscovery) validateSourceDiscovery(sourceDiscovery);
if (denyScan) validateDenyScan(denyScan);
if (secretScan) validateSecretScan(secretScan);
if (copyLedger) validateCopyLedger(copyLedger);
if (hashManifest) validateHashManifest(hashManifest);
if (classification) validateClassification(classification);
if (copyLedger && hashManifest && classification) {
  validateReceiptsAgainstRawCopyPlan({
    copyLedger,
    hashManifest,
    classification,
    denyScan,
    secretScan,
    rawCandidateFiles,
  });
}

for (const file of rawCandidateFiles) {
  expect(!isDeniedPath(file), `raw-candidate-denied-path:${file}`);
}

assert(failures.length === 0, `cloud asset receipts invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "cloud-asset-receipts-ready",
  importJobId: handoff.importJobId,
  sourceCommitSha: sourceDiscovery?.source?.commitSha ?? sourceDiscovery?.sourceCommitSha ?? null,
  rawCandidateFiles: rawCandidateFiles.length,
  copiedFiles: normalizeArray(copyLedger?.copiedFiles ?? copyLedger?.files).length,
  classificationCandidates: classification?.totals?.candidates ?? 0,
}, null, 2));

function validateSourceDiscovery(report) {
  expect(report.schema === "nexusengine.goldrush.cloud-source-discovery.v1", "source-discovery-invalid-schema");
  expect(report.importJobId === handoff.importJobId, "source-discovery-wrong-job");
  const source = report.source ?? report;
  expect(source.nameWithOwner === handoff.repositories?.source?.nameWithOwner, "source-discovery-wrong-source-repo");
  expect(isCommitSha(source.commitSha), "source-discovery-missing-commit-sha");
  const roots = normalizeArray(source.roots ?? report.roots);
  expect(roots.length === (handoff.repositories?.source?.roots ?? []).length, "source-discovery-root-count-mismatch");
  for (const expectedRoot of handoff.repositories?.source?.roots ?? []) {
    const actual = roots.find((root) => root.sourceKey === expectedRoot.sourceKey || root.root === expectedRoot.root);
    expect(actual, `source-discovery-missing-root:${expectedRoot.sourceKey}`);
    if (!actual) continue;
    expect(actual.root === expectedRoot.root, `source-discovery-root-path-mismatch:${expectedRoot.sourceKey}`);
    expect(actual.exists === true, `source-discovery-root-not-proven:${expectedRoot.sourceKey}`);
    expect(actual.productName === expectedRoot.expectedProductName, `source-discovery-product-name-mismatch:${expectedRoot.sourceKey}`);
    expect(actual.unityVersion === expectedRoot.expectedUnityVersion, `source-discovery-unity-version-mismatch:${expectedRoot.sourceKey}`);
    for (const scenePath of expectedRoot.requiredSceneEvidence ?? []) {
      expect((actual.requiredSceneEvidence ?? actual.requiredScenes ?? []).some((scene) => {
        if (typeof scene === "string") return scene === scenePath;
        return scene.path === scenePath && scene.exists === true;
      }), `source-discovery-missing-scene:${scenePath}`);
    }
  }
}

function validateDenyScan(report) {
  expect(report.schema === "nexusengine.goldrush.deny-path-scan.v1", "deny-scan-invalid-schema");
  expect(report.importJobId === handoff.importJobId, "deny-scan-wrong-job");
  expect(report.status === "passed" || report.status === "blocked", "deny-scan-invalid-status");
  const blocked = normalizeArray(report.blockedPaths ?? report.blocked ?? report.deniedPaths);
  if (report.status === "passed") expect(blocked.length === 0, "deny-scan-passed-with-blocked-paths");
  for (const record of blocked) {
    const recordPath = typeof record === "string" ? record : record.path;
    expect(isSafeReportPath(recordPath), `deny-scan-unsafe-blocked-path:${recordPath}`);
    expect(isDeniedPath(recordPath), `deny-scan-blocked-path-not-denied-pattern:${recordPath}`);
  }
}

function validateSecretScan(report) {
  expect(report.schema === "nexusengine.goldrush.secret-scan.v1", "secret-scan-invalid-schema");
  expect(report.importJobId === handoff.importJobId, "secret-scan-wrong-job");
  expect(report.status === "passed" || report.status === "blocked", "secret-scan-invalid-status");
  const serialized = JSON.stringify(report);
  expect(!containsSecretValue(serialized), "secret-scan-contains-secret-like-value");
  for (const finding of normalizeArray(report.findings)) {
    expect(finding.type || finding.findingType, "secret-scan-finding-missing-type");
    expect(isSafeReportPath(finding.path), `secret-scan-unsafe-finding-path:${finding.path}`);
    expect(!("value" in finding), `secret-scan-finding-must-not-include-value:${finding.path}`);
  }
}

function validateCopyLedger(report) {
  expect(report.schema === "nexusengine.goldrush.copy-ledger.v1", "copy-ledger-invalid-schema");
  expect(report.importJobId === handoff.importJobId, "copy-ledger-wrong-job");
  const files = normalizeArray(report.copiedFiles ?? report.files);
  expect(files.length > 0, "copy-ledger-empty");
  for (const file of files) {
    expect(isSafeReportPath(file.sourcePath), `copy-ledger-unsafe-source-path:${file.sourcePath}`);
    expect(isSafeRawDestination(file.destinationPath), `copy-ledger-unsafe-destination-path:${file.destinationPath}`);
    expect(isSha256(file.sourceHash), `copy-ledger-invalid-source-hash:${file.sourcePath}`);
    expect(Number.isFinite(file.sizeBytes) && file.sizeBytes >= 0, `copy-ledger-invalid-size:${file.sourcePath}`);
    expect(!isDeniedPath(file.sourcePath), `copy-ledger-copied-denied-source:${file.sourcePath}`);
    expect(!isDeniedPath(file.destinationPath), `copy-ledger-copied-denied-destination:${file.destinationPath}`);
  }
}

function validateHashManifest(report) {
  expect(report.schema === "nexusengine.goldrush.hash-manifest.v1", "hash-manifest-invalid-schema");
  expect(report.importJobId === handoff.importJobId, "hash-manifest-wrong-job");
  const files = normalizeArray(report.files);
  expect(files.length > 0, "hash-manifest-empty");
  for (const file of files) {
    expect(isSafeRawDestination(file.path), `hash-manifest-unsafe-path:${file.path}`);
    expect(isSha256(file.sha256 ?? file.sourceHash), `hash-manifest-invalid-hash:${file.path}`);
    expect(!isDeniedPath(file.path), `hash-manifest-denied-path:${file.path}`);
  }
}

function validateClassification(report) {
  const validation = validateGoldRushAssetIntakeReport(report);
  expect(validation.passed, `classification-invalid:${validation.failures.join("|")}`);
  expect(report.importJobId === handoff.importJobId, "classification-wrong-job");
  expect(report.status !== "blocked", "classification-blocked");
  expect((report.totals?.candidates ?? 0) > 0, "classification-has-no-candidates");
  for (const candidate of report.candidates ?? []) {
    expect(candidate.promoteOnlyAfter?.includes("human-review"), `classification-candidate-missing-human-review:${candidate.path}`);
  }
}

function validateReceiptsAgainstRawCopyPlan({
  copyLedger,
  hashManifest,
  classification,
  denyScan,
  secretScan,
  rawCandidateFiles,
}) {
  expect(rawCopyPlan?.schema === "nexusengine.goldrush.cloud-raw-copy-plan.v1", "raw-copy-plan-missing-or-invalid");
  expect(rawCopyPlan?.importJobId === handoff.importJobId, "raw-copy-plan-wrong-job");
  if (!rawCopyPlan) return;

  const planEntries = (rawCopyPlan.domains ?? []).flatMap((domain) =>
    (domain.selected ?? []).map((entry) => ({ ...entry, domainId: domain.id }))
  );
  const selectedBySource = new Map(planEntries.map((entry) => [entry.sourcePath, entry]));
  const selectedByTarget = new Map(planEntries.map((entry) => [entry.targetRawPath, entry]));
  const copiedFiles = normalizeArray(copyLedger.copiedFiles ?? copyLedger.files);
  const hashFiles = normalizeArray(hashManifest.files);
  const classificationRecords = [
    ...normalizeArray(classification.candidates),
    ...normalizeArray(classification.unmapped),
    ...normalizeArray(classification.blocked),
  ];
  const rawRoot = stripTrailingSlash(destinationFolders.rawCandidates);
  const classificationPaths = new Set(
    classificationRecords.map((record) => toRawDestinationPath(record.path, rawRoot))
  );
  const firstPlanRawCandidateFiles = rawCandidateFiles.filter((file) => selectedByTarget.has(file));
  const remainingBatchRawCandidateFiles = rawCandidateFiles.filter((file) => !selectedByTarget.has(file));

  expect(denyScan?.status === "passed", "deny-scan-must-pass-before-raw-plan-copy");
  expect(secretScan?.status === "passed", "secret-scan-must-pass-before-raw-plan-copy");
  expect(copiedFiles.length === planEntries.length, "copy-ledger-must-cover-exact-raw-copy-plan");
  expect(hashFiles.length === planEntries.length, "hash-manifest-must-cover-exact-raw-copy-plan");
  expect(firstPlanRawCandidateFiles.length === planEntries.length, "raw-candidates-must-cover-exact-raw-copy-plan");
  expect(classificationRecords.length === planEntries.length, "classification-must-cover-exact-raw-copy-plan");
  expect((classification.blocked ?? []).length === 0, "classification-must-not-have-blocked-records-after-copy");
  validateRemainingBatchRawCandidates(remainingBatchRawCandidateFiles);

  for (const entry of planEntries) {
    const copied = copiedFiles.find((file) => file.sourcePath === entry.sourcePath);
    expect(Boolean(copied), `copy-ledger-missing-plan-source:${entry.sourcePath}`);
    if (copied) {
      expect(copied.destinationPath === entry.targetRawPath, `copy-ledger-target-mismatch:${entry.sourcePath}`);
      expect(copied.sizeBytes === entry.sizeBytes, `copy-ledger-size-mismatch:${entry.sourcePath}`);
      expect(!copied.slotId || copied.slotId === entry.slotId, `copy-ledger-slot-mismatch:${entry.sourcePath}`);
      expect(!copied.domain || copied.domain === entry.domainId, `copy-ledger-domain-mismatch:${entry.sourcePath}`);
    }
    expect(hashFiles.some((file) => file.path === entry.targetRawPath), `hash-manifest-missing-plan-target:${entry.targetRawPath}`);
    expect(rawCandidateFiles.includes(entry.targetRawPath), `raw-candidate-file-missing-plan-target:${entry.targetRawPath}`);
    expect(classificationPaths.has(entry.targetRawPath), `classification-missing-plan-target:${entry.targetRawPath}`);
  }

  for (const file of copiedFiles) {
    expect(selectedBySource.has(file.sourcePath), `copy-ledger-source-not-in-raw-copy-plan:${file.sourcePath}`);
    expect(selectedByTarget.has(file.destinationPath), `copy-ledger-target-not-in-raw-copy-plan:${file.destinationPath}`);
  }
  for (const file of hashFiles) {
    expect(selectedByTarget.has(file.path), `hash-manifest-path-not-in-raw-copy-plan:${file.path}`);
  }
  for (const recordPath of classificationPaths) {
    expect(selectedByTarget.has(recordPath), `classification-path-not-in-raw-copy-plan:${recordPath}`);
  }
}

function validateRemainingBatchRawCandidates(extraRawCandidateFiles) {
  if (extraRawCandidateFiles.length === 0) return;
  const indexPath = "reports/provenance/remaining-batches/batch-index.json";
  expect(existsRepoFile(indexPath), "remaining-batch-index-required-for-extra-raw-files");
  if (!existsRepoFile(indexPath)) return;
  const index = JSON.parse(readFileSync(path.join(repoRoot, indexPath), "utf8"));
  expect(index.schema === "nexusengine.goldrush.remaining-batch-index.v1", "remaining-batch-index-invalid-schema");
  expect(index.importJobId === handoff.importJobId, "remaining-batch-index-wrong-job");
  expect(index.appendOnly === true, "remaining-batch-index-must-be-append-only");
  expect(index.doesNotModifyFirst31Gate === true, "remaining-batch-index-must-not-modify-first31");

  const covered = new Set();
  for (const batch of normalizeArray(index.batches)) {
    const receiptRoot = batch.receiptRoot;
    expect(isSafeRepoRelativePath(receiptRoot), `remaining-batch-unsafe-root:${receiptRoot}`);
    const rawCopyPath = `${receiptRoot}/raw-copy.receipt.json`;
    const hashesPath = `${receiptRoot}/hashes.receipt.json`;
    expect(existsRepoFile(rawCopyPath), `remaining-batch-missing-raw-copy:${batch.batchId}`);
    expect(existsRepoFile(hashesPath), `remaining-batch-missing-hashes:${batch.batchId}`);
    if (!existsRepoFile(rawCopyPath) || !existsRepoFile(hashesPath)) continue;
    const rawCopy = JSON.parse(readFileSync(path.join(repoRoot, rawCopyPath), "utf8"));
    const hashes = JSON.parse(readFileSync(path.join(repoRoot, hashesPath), "utf8"));
    expect(rawCopy.receiptKind === "remaining-batch", `remaining-batch-raw-copy-kind:${batch.batchId}`);
    expect(rawCopy.rawFilesWritten === true, `remaining-batch-raw-files-not-written:${batch.batchId}`);
    expect(rawCopy.mode === "raw-files-written", `remaining-batch-raw-copy-mode:${batch.batchId}`);
    expect(rawCopy.doesNotModifyFirst31Gate === true, `remaining-batch-raw-copy-first31:${batch.batchId}`);
    expect(hashes.receiptKind === "remaining-batch", `remaining-batch-hashes-kind:${batch.batchId}`);
    const hashesByPath = new Map(normalizeArray(hashes.files).map((file) => [file.path, file]));
    for (const file of normalizeArray(rawCopy.fetchedFiles)) {
      covered.add(file.targetRawPath);
      const hashRecord = hashesByPath.get(file.targetRawPath);
      expect(Boolean(hashRecord), `remaining-batch-hash-missing:${file.targetRawPath}`);
      expect(hashRecord?.sha256 === file.sourceHash, `remaining-batch-hash-mismatch:${file.targetRawPath}`);
      const absolute = path.join(repoRoot, file.targetRawPath);
      expect(existsSync(absolute), `remaining-batch-raw-file-missing:${file.targetRawPath}`);
      if (existsSync(absolute)) {
        const bytes = readFileSync(absolute);
        expect(bytes.length === file.sizeBytes, `remaining-batch-raw-file-size:${file.targetRawPath}`);
        expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}` === file.sourceHash, `remaining-batch-raw-file-hash:${file.targetRawPath}`);
      }
    }
  }

  for (const file of extraRawCandidateFiles) {
    expect(covered.has(file), `raw-candidate-not-in-raw-copy-plan-or-remaining-batch:${file}`);
  }
}

function readReceipt(key) {
  const relPath = receiptPaths[key];
  if (!existsRepoFile(relPath)) return null;
  try {
    return JSON.parse(readFileSync(path.join(repoRoot, relPath), "utf8"));
  } catch (error) {
    failures.push(`invalid-json:${key}:${error.message}`);
    return null;
  }
}

function listRawCandidateFiles(rawRoot) {
  if (!isSafeRepoRelativePath(rawRoot)) return [];
  const absoluteRoot = path.join(repoRoot, rawRoot);
  if (!existsSync(absoluteRoot)) return [];
  const files = [];
  walk(absoluteRoot);
  return files;

  function walk(absolutePath) {
    const info = statSync(absolutePath);
    if (info.isDirectory()) {
      for (const entry of readdirSync(absolutePath)) walk(path.join(absolutePath, entry));
      return;
    }
    const rel = normalizePath(path.relative(repoRoot, absolutePath));
    if (rel.endsWith("/.gitkeep")) return;
    files.push(rel);
  }
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function stripTrailingSlash(value) {
  return typeof value === "string" ? value.replace(/\/+$/, "") : "";
}

function toRawDestinationPath(value, rawRoot) {
  const normalized = normalizePath(value ?? "");
  if (normalized.startsWith(`${rawRoot}/`)) return normalized;
  return `${rawRoot}/${normalized}`;
}

function existsRepoFile(relPath) {
  return isSafeRepoRelativePath(relPath) && existsSync(path.join(repoRoot, relPath));
}

function isSafeRepoRelativePath(value) {
  if (!isSafeReportPath(value)) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && !normalized.startsWith("../") && normalized !== "..";
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

function isSafeRawDestination(value) {
  return isSafeRepoRelativePath(value)
    && value.startsWith(destinationFolders.rawCandidates)
    && !isDeniedPath(value);
}

function isDeniedPath(value) {
  if (!value) return false;
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

function containsSecretValue(value) {
  return /github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i.test(value);
}

function isCommitSha(value) {
  return typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
}

function isSha256(value) {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/i.test(value);
}

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
