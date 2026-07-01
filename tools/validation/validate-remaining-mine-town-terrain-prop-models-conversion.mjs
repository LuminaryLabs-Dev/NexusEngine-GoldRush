import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const batchId = `${importJobId}.next.004.mine-town-terrain-props`;
const reportPath = `reports/conversion/remaining-batches/${batchId}.json`;
const registryPath = `sanitized/registry/remaining-batches/${batchId}.json`;
const rawCopyPath = `reports/provenance/remaining-batches/${batchId}/raw-copy.receipt.json`;
const sanitizedRootPath = path.join(repoRoot, "sanitized", "converted", importJobId, "remaining-batches", batchId);
const sanitizedRoot = existsSync(sanitizedRootPath) ? realpathSync(sanitizedRootPath) : null;
const failures = [];

expect(existsRepoFile(reportPath), "prop-model-conversion-report-missing");
expect(existsRepoFile(registryPath), "prop-model-sanitized-registry-missing");
expect(existsRepoFile(rawCopyPath), "prop-model-raw-copy-receipt-missing");
assert(failures.length === 0, `remaining prop model conversion invalid: ${failures.join(", ")}`);

const report = readJson(reportPath);
const registry = readJson(registryPath);
const rawCopy = readJson(rawCopyPath);

expect(report.schema === "nexusengine.goldrush.remaining-mine-town-terrain-prop-models-conversion-report.v1", "invalid-report-schema");
expect(registry.schema === "nexusengine.goldrush.remaining-mine-town-terrain-prop-models-sanitized-registry.v1", "invalid-registry-schema");
expect(report.importJobId === importJobId, "wrong-report-job");
expect(report.batchId === batchId, "wrong-report-batch");
expect(registry.importJobId === importJobId, "wrong-registry-job");
expect(registry.batchId === batchId, "wrong-registry-batch");
expect(report.status === "remaining-mine-town-terrain-prop-models-converted-for-review", "wrong-report-status");
expect(report.publicPromotion === false, "report-must-not-promote-public");
expect(report.runtimePromotion === false, "report-must-not-promote-runtime");
expect(registry.publicPromotion === false, "registry-must-not-promote-public");
expect(registry.runtimePromotion === false, "registry-must-not-promote-runtime");
expect(report.rules?.writesPublicAssets === false, "report-must-not-write-public-assets");
expect(report.rules?.promotesRuntimeAssets === false, "report-must-not-promote-runtime-rule");
expect(report.rules?.requiresExternalModelConversion === true, "report-must-require-external-model-conversion");
expect(report.rules?.requiresPrefabRoleReview === true, "report-must-require-prefab-role-review");
expect(report.rules?.requiresLicenseProvenanceBeforePromotion === true, "report-must-require-license-provenance");
expect(report.rules?.requiresHumanReviewBeforePromotion === true, "report-must-require-human-review");
expect(report.rules?.requiresApprovedRuntimeRecordBeforePromotion === true, "report-must-require-approved-runtime-record");
expect(report.rules?.batchScopedDoesNotModifyFirst31Gate === true, "report-must-be-batch-scoped");

const outputs = report.outputs ?? [];
expect(rawCopy.fetchedFiles?.length === 125, "raw-copy-count-must-be-125");
expect(outputs.length === rawCopy.fetchedFiles?.length, "output-count-must-match-raw-files");
expect(registry.assets?.length === outputs.length, "registry-output-count-mismatch");
expect(report.totals?.outputs === outputs.length, "totals-output-count-mismatch");
expect(report.totals?.textureReviewCopies === 15, "expected-15-texture-review-copies");
expect(report.totals?.metadataExtracted === 79, "expected-79-prefab-metadata-extracts");
expect(report.totals?.externalConversionRequests === 31, "expected-31-fbx-external-conversion-requests");
expect(report.totals?.promotionReady === 0, "outputs-must-not-be-promotion-ready");

const expectedRoles = [
  "train-rail-prop",
  "mine-cart-prop",
  "desert-flora-prop",
  "frontier-town-prop",
];
for (const role of expectedRoles) {
  expect((report.totals?.byRole?.[role] ?? 0) > 0, `expected-role:${role}`);
}

const seenOutputPaths = new Set();
const registryByOutput = new Map((registry.assets ?? []).map((asset) => [asset.outputPath, asset]));
for (const output of outputs) {
  const label = `${output.role}:${output.sourcePath}`;
  expect(isSafeSourcePath(output.sourcePath), `${label}:unsafe-source-path`);
  expect(isSafeRawPath(output.sourceRawPath), `${label}:unsafe-source-raw-path`);
  expect(isSha256(output.sourceHash), `${label}:invalid-source-hash`);
  expect([".jpg", ".jpeg", ".prefab", ".fbx"].includes(output.sourceExtension), `${label}:invalid-source-extension`);
  expect(isSafeSanitizedPath(output.outputPath), `${label}:unsafe-output-path`);
  expect(isSha256(output.outputHash), `${label}:invalid-output-hash`);
  expect(["texture-review-copy", "prefab-metadata", "external-conversion-request", "review-only"].includes(output.outputKind), `${label}:invalid-output-kind`);
  expect(["browser-ready-texture-review-copy", "metadata-extracted", "requires-external-conversion", "requires-manual-review"].includes(output.conversionStatus), `${label}:invalid-conversion-status`);
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

assert(failures.length === 0, `remaining prop model conversion invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "remaining-mine-town-terrain-prop-models-conversion-ready",
  importJobId,
  batchId,
  outputs: outputs.length,
  textureReviewCopies: report.totals.textureReviewCopies,
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
  return isSafeSourcePath(value) && value.startsWith(`sanitized/converted/${importJobId}/remaining-batches/${batchId}/`);
}

function isSha256(value) {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
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
