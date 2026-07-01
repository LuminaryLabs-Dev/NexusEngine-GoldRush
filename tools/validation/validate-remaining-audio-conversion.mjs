import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const batchId = "goldrush-dual-source-001.next.001.audio-music-and-sfx";
const reportPath = path.join(repoRoot, `reports/conversion/remaining-batches/${batchId}.json`);
const registryPath = path.join(repoRoot, `sanitized/registry/remaining-batches/${batchId}.json`);
const sanitizedRootPath = path.join(repoRoot, "sanitized", "converted", importJobId, "remaining-batches", batchId);
const sanitizedRoot = existsSync(sanitizedRootPath) ? realpathSync(sanitizedRootPath) : null;
const failures = [];

expect(existsSync(reportPath), "remaining-audio-conversion-report-missing");
expect(existsSync(registryPath), "remaining-audio-sanitized-registry-missing");

const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, "utf8")) : null;
const registry = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, "utf8")) : null;

if (report) {
  expect(report.schema === "nexusengine.goldrush.remaining-audio-conversion-report.v1", "invalid-report-schema");
  expect(report.importJobId === importJobId, "wrong-import-job");
  expect(report.batchId === batchId, "wrong-batch-id");
  expect(report.status === "remaining-audio-converted-for-review", "wrong-status");
  expect(report.publicPromotion === false, "must-not-promote-public-assets");
  expect(report.runtimePromotion === false, "must-not-promote-runtime-assets");
  expect(report.rules?.writesPublicAssets === false, "must-not-write-public-assets");
  expect(report.rules?.promotesRuntimeAssets === false, "must-not-promote-runtime-assets-rule");
  expect(report.rules?.requiresHumanReviewBeforePromotion === true, "must-require-human-review");
  expect(report.rules?.requiresLicenseReviewBeforePromotion === true, "must-require-license-review");
  expect(report.totals?.outputs === 15, "must-convert-15-audio-files");
  expect(report.totals?.totalBytes === 90145108, "total-bytes-must-match-receipt");
  expect(report.totals?.promotionReady === 0, "promotion-ready-must-be-zero");
  expect(report.totals?.bySlotId?.["goldrush.audio.music.wandering"] === 9, "wandering-track-count-mismatch");
  expect(report.totals?.bySlotId?.["goldrush.audio.music.combat"] === 4, "combat-track-count-mismatch");
  expect(report.totals?.bySlotId?.["goldrush.audio.music.titleIntro"] === 1, "title-intro-count-mismatch");
  expect(report.totals?.bySlotId?.["goldrush.audio.voice.titleIntro"] === 1, "title-voice-count-mismatch");

  const seenOutputs = new Set();
  for (const output of report.outputs ?? []) {
    const label = `${output.slotId}:${output.sourceRawPath}`;
    expect(isSafeRawPath(output.sourceRawPath), `${label}:unsafe-source-raw-path`);
    expect(isSafeLegacyPath(output.legacySourcePath), `${label}:unsafe-legacy-source-path`);
    expect(isSafeOutputPath(output.outputPath), `${label}:unsafe-output-path`);
    expect(isSha256(output.sourceHash), `${label}:invalid-source-hash`);
    expect(output.sourceHash === output.outputHash, `${label}:direct-copy-output-hash-must-match-source`);
    expect(["audio/mpeg", "audio/ogg", "audio/wav"].includes(output.mediaType), `${label}:invalid-media-type`);
    expect(output.conversionStatus === "browser-ready-audio-copy", `${label}:wrong-conversion-status`);
    expect(output.promotionReady === false, `${label}:promotion-ready-must-be-false`);
    expect(Array.isArray(output.promoteOnlyAfter) && output.promoteOnlyAfter.includes("human-review"), `${label}:missing-human-review-gate`);
    expect(!seenOutputs.has(output.outputPath), `${label}:duplicate-output-path`);
    seenOutputs.add(output.outputPath);
    const absoluteOutput = path.join(repoRoot, output.outputPath);
    expect(existsSync(absoluteOutput), `${label}:output-file-missing`);
    if (existsSync(absoluteOutput)) {
      expect(statSync(absoluteOutput).isFile(), `${label}:output-not-file`);
      expect(Boolean(sanitizedRoot) && realpathSync(absoluteOutput).startsWith(`${sanitizedRoot}${path.sep}`), `${label}:output-escapes-sanitized-root`);
      expect(`sha256:${sha256File(absoluteOutput)}` === output.outputHash, `${label}:output-hash-mismatch`);
    }
  }
}

if (registry) {
  expect(registry.schema === "nexusengine.goldrush.remaining-audio-sanitized-registry.v1", "invalid-registry-schema");
  expect(registry.importJobId === importJobId, "registry-wrong-import-job");
  expect(registry.batchId === batchId, "registry-wrong-batch-id");
  expect(registry.publicPromotion === false, "registry-must-not-promote-public-assets");
  expect(registry.runtimePromotion === false, "registry-must-not-promote-runtime-assets");
  expect((registry.assets ?? []).length === 15, "registry-asset-count-mismatch");
}

assert(failures.length === 0, `remaining audio conversion invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "remaining-audio-conversion-ready",
  importJobId,
  batchId,
  outputs: report.outputs.length,
  totalBytes: report.totals.totalBytes,
  publicPromotion: report.publicPromotion,
  runtimePromotion: report.runtimePromotion,
}, null, 2));

function isSafeRawPath(value) {
  return typeof value === "string"
    && value.startsWith(`raw/imported/${importJobId}/`)
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isSafeLegacyPath(value) {
  return typeof value === "string"
    && value.startsWith("GoldRush_Old/")
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isSafeOutputPath(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (!value.startsWith(`sanitized/converted/${importJobId}/remaining-batches/${batchId}/`)) return false;
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
