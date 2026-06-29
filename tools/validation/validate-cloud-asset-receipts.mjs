import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  validateGoldRushAssetIntakeReport,
} from "../import-sanitize/goldrush-asset-intake-classifier.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const handoffPath = path.join(repoRoot, "manifests/import-jobs/goldrush-cloud-transfer-handoff.json");
const handoff = JSON.parse(readFileSync(handoffPath, "utf8"));
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
