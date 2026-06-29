import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const reportPath = path.join(repoRoot, `reports/conversion/${importJobId}.json`);
const registryPath = path.join(repoRoot, "sanitized/registry/assets.json");
const failures = [];

if (!existsSync(reportPath)) {
  console.log(JSON.stringify({
    status: "conversion-report-pending",
    importJobId,
  }, null, 2));
  process.exit(0);
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
const registry = existsSync(registryPath)
  ? JSON.parse(readFileSync(registryPath, "utf8"))
  : null;

expect(report.schema === "nexusengine.goldrush.conversion-report.v1", "invalid-conversion-schema");
expect(report.importJobId === importJobId, "wrong-import-job");
expect(report.status === "converted-candidates-ready-for-review", "wrong-conversion-status");
expect(report.publicPromotion === false, "conversion-must-not-promote-public-assets");
expect(report.rules?.writesPublicAssets === false, "conversion-must-not-write-public-assets");
expect(report.rules?.promotesRuntimeAssets === false, "conversion-must-not-promote-runtime-assets");
expect(report.rules?.requiresHumanReviewBeforePromotion === true, "conversion-must-require-human-review");
expect(Array.isArray(report.outputs), "conversion-outputs-must-be-array");
expect(report.outputs.length === report.totals?.outputs, "conversion-output-total-mismatch");
expect(report.outputs.length === report.totals?.candidates, "conversion-candidate-total-mismatch");
expect(report.totals?.promotionReady === 0, "conversion-outputs-must-not-be-promotion-ready");

const seenOutputPaths = new Set();
for (const output of report.outputs ?? []) {
  const label = `${output.slotId}:${output.sourcePath}`;
  expect(isSafeSourcePath(output.sourcePath), `${label}:unsafe-source-path`);
  expect(isSha256(output.sourceHash), `${label}:invalid-source-hash`);
  expect(isSafeSanitizedPath(output.outputPath), `${label}:unsafe-output-path`);
  expect(isSha256(output.outputHash), `${label}:invalid-output-hash`);
  expect(output.promotionReady === false, `${label}:promotion-ready-must-be-false`);
  expect(Array.isArray(output.promoteOnlyAfter) && output.promoteOnlyAfter.includes("human-review"), `${label}:missing-human-review-gate`);
  expect(!seenOutputPaths.has(output.outputPath), `${label}:duplicate-output-path`);
  seenOutputPaths.add(output.outputPath);
  const absoluteOutput = path.join(repoRoot, output.outputPath);
  expect(existsSync(absoluteOutput), `${label}:output-file-missing`);
  if (existsSync(absoluteOutput)) {
    expect(statSync(absoluteOutput).isFile(), `${label}:output-not-file`);
    expect(realpathSync(absoluteOutput).startsWith(`${realpathSync(path.join(repoRoot, "sanitized", "converted"))}${path.sep}`), `${label}:output-escapes-sanitized-root`);
    expect(`sha256:${sha256File(absoluteOutput)}` === output.outputHash, `${label}:output-hash-mismatch`);
  }
}

expect(registry?.schema === "nexusengine.goldrush.sanitized-registry.v1", "invalid-sanitized-registry-schema");
expect(registry?.importJobId === importJobId, "sanitized-registry-wrong-job");
expect(registry?.publicPromotion === false, "sanitized-registry-must-not-promote-public-assets");
expect((registry?.assets ?? []).length === report.outputs.length, "sanitized-registry-asset-count-mismatch");

assert(failures.length === 0, `conversion report invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "conversion-report-ready",
  importJobId,
  outputs: report.outputs.length,
  browserReadyCopies: report.totals.browserReadyCopies,
  metadataExtracted: report.totals.metadataExtracted,
  externalConversionRequests: report.totals.externalConversionRequests,
  promotionReady: report.totals.promotionReady,
}, null, 2));

function isSafeSourcePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isSafeSanitizedPath(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (!value.startsWith(`sanitized/converted/${importJobId}/`)) return false;
  if (value.includes("\\") || value.includes("\0") || value.split("/").includes("..")) return false;
  if (/^(https?:|data:|blob:|file:|\/\/)/i.test(value)) return false;
  return path.posix.normalize(value) === value;
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
