import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import {
  approvedAssetRecordRequiredFields,
  collectGoldRushApprovedAssetRecords,
  goldRushApprovedAssets,
} from "../../src/content/goldrushApprovedAssets.js";
import { assetRegistry } from "../../src/content/assetRegistry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const publicRoot = path.join(repoRoot, "public");
const publicAssetsRoot = path.join(publicRoot, "assets");
const publicManifestPath = path.join(publicAssetsRoot, "manifests", "goldrush-assets.json");
const failures = [];

expect(goldRushApprovedAssets.schema === "nexusengine.goldrush.approved-assets.v1", "invalid-approved-assets-schema");
expect(goldRushApprovedAssets.version === "0.1.0", "invalid-approved-assets-version");
expect(goldRushApprovedAssets.source === "cloud-reviewed-public-runtime-assets", "invalid-approved-assets-source");
expect(Array.isArray(goldRushApprovedAssets.assets), "approved-assets-must-be-array");
expect(Array.isArray(goldRushApprovedAssets.presentation?.scenes), "approved-scenes-must-be-array");
expect(Array.isArray(goldRushApprovedAssets.presentation?.audio), "approved-audio-must-be-array");
expect(Array.isArray(goldRushApprovedAssets.presentation?.animations), "approved-animations-must-be-array");

const slotCatalog = {
  asset: new Map((assetRegistry.assets ?? []).map((record) => [record.id, record])),
  scene: new Map((assetRegistry.presentation?.scenes ?? []).map((record) => [record.id, record])),
  audio: new Map((assetRegistry.presentation?.audio ?? []).map((record) => [record.id, record])),
  animation: new Map((assetRegistry.presentation?.animations ?? []).map((record) => [record.id, record])),
};

const approvedRecords = collectGoldRushApprovedAssetRecords(goldRushApprovedAssets);
const seenIds = new Set();
const seenApprovalIds = new Set();
const seenRuntimePaths = new Set();

for (const { category, record } of approvedRecords) {
  const label = `${category}:${record?.id ?? "missing-id"}`;
  expect(record && typeof record === "object" && !Array.isArray(record), `${label}:record-must-be-object`);
  if (!record || typeof record !== "object") continue;

  for (const field of approvedAssetRecordRequiredFields) {
    expect(hasFilledString(record[field]), `${label}:missing-${field}`);
  }

  expect(record.status === "approved", `${label}:status-must-be-approved`);
  expect(slotCatalog[category]?.has(record.id), `${label}:unknown-slot-id`);
  expect(!seenIds.has(record.id), `${label}:duplicate-approved-slot-id`);
  seenIds.add(record.id);

  expect(record.sourceJobId === "goldrush-dual-source-001", `${label}:unexpected-source-job-id`);
  expect(isSafeSourcePath(record.sourcePath), `${label}:unsafe-source-path`);
  expect(/^sha256:[a-f0-9]{64}$/.test(record.sourceHash ?? ""), `${label}:invalid-source-hash`);
  expect(/^sha256:[a-f0-9]{64}$/.test(record.outputHash ?? ""), `${label}:invalid-output-hash`);
  expect(!seenApprovalIds.has(record.approvalId), `${label}:duplicate-approval-id`);
  seenApprovalIds.add(record.approvalId);

  expect(isSafeRuntimePath(record.runtimePath), `${label}:unsafe-runtime-path`);
  expect(!seenRuntimePaths.has(record.runtimePath), `${label}:duplicate-runtime-path`);
  seenRuntimePaths.add(record.runtimePath);

  const runtimeFile = path.resolve(publicRoot, record.runtimePath);
  expect(runtimeFile.startsWith(`${publicAssetsRoot}${path.sep}`), `${label}:runtime-file-escapes-public-assets`);
  expect(existsSync(runtimeFile), `${label}:runtime-file-missing`);
  if (existsSync(runtimeFile)) {
    const realRuntimeFile = realpathSync(runtimeFile);
    const realPublicAssetsRoot = realpathSync(publicAssetsRoot);
    expect(realRuntimeFile.startsWith(`${realPublicAssetsRoot}${path.sep}`), `${label}:runtime-file-symlink-escapes-public-assets`);
    expect(statSync(runtimeFile).isFile(), `${label}:runtime-path-not-file`);
    expect(`sha256:${sha256File(runtimeFile)}` === record.outputHash, `${label}:output-hash-does-not-match-runtime-file`);
  }
}

validateOverlayResult();
validatePublicManifest();

assert(failures.length === 0, `approved asset registry invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: approvedRecords.length > 0 ? "approved-runtime-assets-validated" : "approved-runtime-assets-pending",
  approvedRecords: approvedRecords.length,
  pendingCloudImport: goldRushApprovedAssets.pendingCloudImport,
  runtimeRegistryApprovedSlots: countApprovedRuntimeSlots(),
}, null, 2));

function validateOverlayResult() {
  if (approvedRecords.length === 0) {
    expect(assetRegistry.pendingCloudImport === true, "empty-approved-registry-should-remain-pending-cloud-import");
    expect(assetRegistry.approvedAssetOverlay?.approvedCount === 0, "empty-approved-registry-overlay-count-mismatch");
    expect(countApprovedRuntimeSlots() === 0, "empty-approved-registry-should-not-approve-runtime-slots");
    return;
  }

  for (const { category, record } of approvedRecords) {
    const runtimeRecord = slotCatalog[category]?.get(record.id);
    expect(runtimeRecord?.status === "approved", `${category}:${record.id}:overlay-did-not-approve-slot`);
    expect(runtimeRecord?.runtimePath === record.runtimePath, `${category}:${record.id}:overlay-runtime-path-mismatch`);
  }
}

function validatePublicManifest() {
  expect(existsSync(publicManifestPath), "goldrush-public-assets-manifest-missing");
  if (!existsSync(publicManifestPath)) return;

  const manifest = JSON.parse(readFileSync(publicManifestPath, "utf8"));
  expect(Array.isArray(manifest.assets), "goldrush-public-assets-manifest-assets-must-be-array");
  expect(manifest.pendingCloudImport === true || approvedRecords.length > 0, "public-manifest-should-stay-pending-while-empty");

  const approvedById = new Map(approvedRecords.map(({ record }) => [record.id, record]));
  for (const manifestAsset of manifest.assets ?? []) {
    const approved = approvedById.get(manifestAsset.id);
    expect(approved, `public-manifest-asset-not-approved:${manifestAsset.id}`);
    if (approved) {
      expect(manifestAsset.runtimePath === approved.runtimePath, `public-manifest-runtime-path-mismatch:${manifestAsset.id}`);
      expect(manifestAsset.outputHash === approved.outputHash, `public-manifest-output-hash-mismatch:${manifestAsset.id}`);
    }
  }
}

function isSafeSourcePath(sourcePath) {
  if (!hasFilledString(sourcePath)) return false;
  if (hasUnsafePathText(sourcePath)) return false;
  if (sourcePath.startsWith("/") || sourcePath.includes("\\") || /^[a-z]:/i.test(sourcePath)) return false;
  const normalized = path.posix.normalize(sourcePath);
  if (normalized !== sourcePath || normalized.startsWith("../") || normalized === "..") return false;
  return !hasForbiddenSegment(normalized);
}

function isSafeRuntimePath(runtimePath) {
  if (!hasFilledString(runtimePath)) return false;
  if (runtimePath !== runtimePath.trim()) return false;
  if (!runtimePath.startsWith("assets/")) return false;
  if (runtimePath.startsWith("public/")) return false;
  if (hasUnsafePathText(runtimePath)) return false;
  if (runtimePath.includes("?") || runtimePath.includes("#")) return false;
  if (runtimePath.includes("\\") || runtimePath.startsWith("/") || /^[a-z]:/i.test(runtimePath)) return false;
  const normalized = path.posix.normalize(runtimePath);
  if (normalized !== runtimePath || normalized.startsWith("../") || normalized === "..") return false;
  if (hasForbiddenSegment(normalized)) return false;
  return normalized.startsWith("assets/");
}

function hasUnsafePathText(value) {
  if (/[\u0000-\u001f\u007f]/.test(value)) return true;
  if (/^(https?:|data:|blob:|file:|\/\/)/i.test(value)) return true;
  if (/%(?:2e|2f|5c|00)/i.test(value)) return true;
  try {
    const decoded = decodeURIComponent(value);
    if (decoded !== value && (decoded.includes("..") || decoded.includes("/") || decoded.includes("\\"))) return true;
  } catch {
    return true;
  }
  return false;
}

function hasForbiddenSegment(value) {
  return value.toLowerCase().split("/").some((segment) => ["raw", "sanitized", "quarantine"].includes(segment));
}

function hasFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function countApprovedRuntimeSlots() {
  return [
    ...(assetRegistry.assets ?? []),
    ...(assetRegistry.presentation?.scenes ?? []),
    ...(assetRegistry.presentation?.audio ?? []),
    ...(assetRegistry.presentation?.animations ?? []),
  ].filter((record) => record.status === "approved").length;
}

function sha256File(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
