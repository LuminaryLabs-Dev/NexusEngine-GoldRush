import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const conversionId = `${importJobId}.next.005-008.mine-town-terrain-props-source-metadata`;
const batchIds = [
  `${importJobId}.next.005.mine-town-terrain-props`,
  `${importJobId}.next.006.mine-town-terrain-props`,
  `${importJobId}.next.007.mine-town-terrain-props`,
  `${importJobId}.next.008.mine-town-terrain-props`,
];
const reportPath = `reports/conversion/remaining-batches/${conversionId}.json`;
const registryPath = `sanitized/registry/remaining-batches/${conversionId}.json`;
const sanitizedRootPath = path.join(repoRoot, "sanitized", "converted", importJobId, "remaining-batches", conversionId);
const sanitizedRoot = existsSync(sanitizedRootPath) ? realpathSync(sanitizedRootPath) : null;
const failures = [];

expect(existsRepoFile(reportPath), "source-metadata-conversion-report-missing");
expect(existsRepoFile(registryPath), "source-metadata-sanitized-registry-missing");
for (const batchId of batchIds) {
  expect(existsRepoFile(`reports/provenance/remaining-batches/${batchId}/raw-copy.receipt.json`), `${batchId}:raw-copy-receipt-missing`);
}
assert(failures.length === 0, `remaining source metadata conversion invalid: ${failures.join(", ")}`);

const report = readJson(reportPath);
const registry = readJson(registryPath);

expect(report.schema === "nexusengine.goldrush.remaining-mine-town-terrain-source-metadata-conversion-report.v1", "invalid-report-schema");
expect(registry.schema === "nexusengine.goldrush.remaining-mine-town-terrain-source-metadata-sanitized-registry.v1", "invalid-registry-schema");
expect(report.importJobId === importJobId, "wrong-report-job");
expect(report.conversionId === conversionId, "wrong-report-conversion-id");
expect(registry.importJobId === importJobId, "wrong-registry-job");
expect(registry.conversionId === conversionId, "wrong-registry-conversion-id");
expect(sameArray(report.batchIds, batchIds), "wrong-report-batches");
expect(sameArray(registry.batchIds, batchIds), "wrong-registry-batches");
expect(report.status === "remaining-mine-town-terrain-source-metadata-converted-for-review", "wrong-report-status");
expect(report.publicPromotion === false, "report-must-not-promote-public");
expect(report.runtimePromotion === false, "report-must-not-promote-runtime");
expect(registry.publicPromotion === false, "registry-must-not-promote-public");
expect(registry.runtimePromotion === false, "registry-must-not-promote-runtime");
expect(report.rules?.writesPublicAssets === false, "report-must-not-write-public-assets");
expect(report.rules?.promotesRuntimeAssets === false, "report-must-not-promote-runtime-rule");
expect(report.rules?.requiresExternalModelConversion === true, "report-must-require-external-model-conversion");
expect(report.rules?.requiresMaterialRemapReview === true, "report-must-require-material-remap-review");
expect(report.rules?.requiresTerrainAssetReview === true, "report-must-require-terrain-asset-review");
expect(report.rules?.requiresLicenseProvenanceBeforePromotion === true, "report-must-require-license-provenance");
expect(report.rules?.requiresHumanReviewBeforePromotion === true, "report-must-require-human-review");
expect(report.rules?.requiresApprovedRuntimeRecordBeforePromotion === true, "report-must-require-approved-runtime-record");
expect(report.rules?.batchScopedDoesNotModifyFirst31Gate === true, "report-must-be-batch-scoped");

const expectedBatchCounts = {
  [`${importJobId}.next.005.mine-town-terrain-props`]: 125,
  [`${importJobId}.next.006.mine-town-terrain-props`]: 125,
  [`${importJobId}.next.007.mine-town-terrain-props`]: 125,
  [`${importJobId}.next.008.mine-town-terrain-props`]: 61,
};
const expectedTotalOutputs = Object.values(expectedBatchCounts).reduce((sum, value) => sum + value, 0);
const outputs = report.outputs ?? [];
expect(outputs.length === expectedTotalOutputs, "output-count-must-match-batches");
expect(registry.assets?.length === outputs.length, "registry-output-count-mismatch");
expect(report.totals?.outputs === outputs.length, "totals-output-count-mismatch");
expect(report.totals?.metadataExtracted === 392, "expected-392-metadata-extracts");
expect(report.totals?.materialMetadata === 367, "expected-367-material-metadata-extracts");
expect(report.totals?.terrainAssetMetadata === 25, "expected-25-terrain-asset-metadata-extracts");
expect(report.totals?.externalConversionRequests === 44, "expected-44-fbx-external-conversion-requests");
expect(report.totals?.promotionReady === 0, "outputs-must-not-be-promotion-ready");
for (const [batchId, count] of Object.entries(expectedBatchCounts)) {
  expect(report.totals?.byBatch?.[batchId] === count, `${batchId}:batch-count-mismatch`);
}
for (const role of ["train-material-or-model", "frontier-town-material-or-model", "terrain-source-asset"]) {
  expect((report.totals?.byRole?.[role] ?? 0) > 0, `expected-role:${role}`);
}

const registryByOutput = new Map((registry.assets ?? []).map((asset) => [asset.outputPath, asset]));
const seenOutputPaths = new Set();
for (const output of outputs) {
  const label = `${output.batchId}:${output.role}:${output.sourcePath}`;
  expect(batchIds.includes(output.batchId), `${label}:unknown-batch`);
  expect(isSafeSourcePath(output.sourcePath), `${label}:unsafe-source-path`);
  expect(isSafeRawPath(output.sourceRawPath), `${label}:unsafe-source-raw-path`);
  expect(isSha256(output.sourceHash), `${label}:invalid-source-hash`);
  expect([".mat", ".asset", ".fbx"].includes(output.sourceExtension), `${label}:invalid-source-extension`);
  expect(isSafeSanitizedPath(output.outputPath), `${label}:unsafe-output-path`);
  expect(isSha256(output.outputHash), `${label}:invalid-output-hash`);
  expect(["material-metadata", "terrain-asset-metadata", "external-conversion-request", "review-only"].includes(output.outputKind), `${label}:invalid-output-kind`);
  expect(["metadata-extracted", "requires-external-conversion", "requires-manual-review"].includes(output.conversionStatus), `${label}:invalid-conversion-status`);
  expect(output.promotionReady === false, `${label}:promotion-ready-must-be-false`);
  expect(output.publicPromotion === false, `${label}:public-promotion-must-be-false`);
  expect(output.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`);
  expect(Array.isArray(output.promoteOnlyAfter) && output.promoteOnlyAfter.includes("human-review"), `${label}:missing-human-review-gate`);
  expect(!("runtimePath" in output), `${label}:runtime-path-not-allowed`);
  expect(!seenOutputPaths.has(output.outputPath), `${label}:duplicate-output-path`);
  seenOutputPaths.add(output.outputPath);

  const absoluteOutput = path.join(repoRoot, output.outputPath);
  expect(existsSync(absoluteOutput), `${label}:output-file-missing`);
  if (existsSync(absoluteOutput)) {
    expect(statSync(absoluteOutput).isFile(), `${label}:output-not-file`);
    expect(Boolean(sanitizedRoot) && realpathSync(absoluteOutput).startsWith(`${sanitizedRoot}${path.sep}`), `${label}:output-escapes-sanitized-root`);
    expect(`sha256:${sha256File(absoluteOutput)}` === output.outputHash, `${label}:output-hash-mismatch`);
  }

  const asset = registryByOutput.get(output.outputPath);
  expect(Boolean(asset), `${output.outputPath}:missing-registry-asset`);
  if (!asset) continue;
  expect(asset.batchId === output.batchId, `${output.outputPath}:registry-batch-mismatch`);
  expect(asset.slotId === output.slotId, `${output.outputPath}:registry-slot-mismatch`);
  expect(asset.role === output.role, `${output.outputPath}:registry-role-mismatch`);
  expect(asset.sourceHash === output.sourceHash, `${output.outputPath}:registry-source-hash-mismatch`);
  expect(asset.outputHash === output.outputHash, `${output.outputPath}:registry-output-hash-mismatch`);
  expect(asset.promotionReady === false, `${output.outputPath}:registry-promotion-ready-must-be-false`);
  expect(asset.publicPromotion === false, `${output.outputPath}:registry-public-promotion-must-be-false`);
  expect(asset.runtimePromotion === false, `${output.outputPath}:registry-runtime-promotion-must-be-false`);
}

const serialized = JSON.stringify({ report, registry });
expect(!/"runtimePath":/.test(serialized), "must-not-contain-runtime-path");
expect(!/"status":"approved"/.test(serialized), "must-not-claim-approval");

assert(failures.length === 0, `remaining source metadata conversion invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "remaining-mine-town-terrain-source-metadata-conversion-ready",
  importJobId,
  conversionId,
  batches: batchIds.length,
  outputs: outputs.length,
  metadataExtracted: report.totals.metadataExtracted,
  externalConversionRequests: report.totals.externalConversionRequests,
  roles: Object.keys(report.totals.byRole).length,
  publicPromotion: false,
  runtimePromotion: false,
}, null, 2));

function existsRepoFile(relPath) {
  return existsSync(path.join(repoRoot, normalizeRepoPath(relPath)));
}

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
}

function normalizeRepoPath(value) {
  if (!isSafeSourcePath(value)) return "";
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

function isSafeRawPath(value) {
  return isSafeSourcePath(value) && value.startsWith(`raw/imported/${importJobId}/`);
}

function isSafeSanitizedPath(value) {
  return isSafeSourcePath(value) && value.startsWith(`sanitized/converted/${importJobId}/remaining-batches/${conversionId}/`);
}

function isSha256(value) {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
}

function sameArray(left, right) {
  return Array.isArray(left) && left.length === right.length && left.every((value, index) => value === right[index]);
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
