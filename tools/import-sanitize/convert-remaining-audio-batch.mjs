import { createHash } from "node:crypto";
import { dirname, extname, join, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const batchId = "goldrush-dual-source-001.next.001.audio-music-and-sfx";
const receiptRoot = `reports/provenance/remaining-batches/${batchId}`;
const defaultOutRoot = `sanitized/converted/${importJobId}/remaining-batches/${batchId}`;
const defaultReportPath = `reports/conversion/remaining-batches/${batchId}.json`;
const defaultRegistryPath = `sanitized/registry/remaining-batches/${batchId}.json`;
const allowedAudioExtensions = new Set([".mp3", ".ogg", ".wav"]);

export function createRemainingAudioBatchConversionReport({
  outRoot = defaultOutRoot,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const hashes = readJson(`${receiptRoot}/hashes.receipt.json`);
  const rawCopy = readJson(`${receiptRoot}/raw-copy.receipt.json`);
  const secretScan = readJson(`${receiptRoot}/secret-scan.receipt.json`);
  const source = readJson(`${receiptRoot}/source.receipt.json`);
  const validator = readJson(`${receiptRoot}/validator.receipt.json`);
  const failures = [];

  validateReceipt(hashes, "remaining-batch-hash", failures);
  validateReceipt(rawCopy, "remaining-batch-raw-copy", failures);
  validateReceipt(secretScan, "remaining-batch-secret-scan", failures);
  validateReceipt(source, "remaining-batch-source", failures);
  validateReceipt(validator, "remaining-batch-validator", failures);
  expect(rawCopy.rawFilesWritten === true, "raw-copy-receipt-must-prove-written-files", failures);
  expect(secretScan.findingCount === 0, "secret-scan-must-have-zero-findings", failures);
  expect(validator.result === "pass", "batch-validator-must-pass", failures);
  expect(source.itemCount === 15, "source-receipt-item-count-must-be-15", failures);
  expect(source.totalBytes === 90145108, "source-receipt-byte-count-must-match", failures);

  const outputs = [];
  for (const record of hashes.files ?? []) {
    const rawPath = record.path;
    expect(isSafeRawPath(rawPath), `unsafe-raw-path:${rawPath}`, failures);
    const extension = extname(rawPath).toLowerCase();
    expect(allowedAudioExtensions.has(extension), `non-audio-extension:${rawPath}`, failures);
    const absoluteRawPath = join(repoRoot, normalizeRepoPath(rawPath ?? ""));
    expect(existsSync(absoluteRawPath), `raw-audio-file-missing:${rawPath}`, failures);
    if (!existsSync(absoluteRawPath)) continue;

    const bytes = readFileSync(absoluteRawPath);
    const sourceHash = sha256(bytes);
    expect(sourceHash === record.sha256, `raw-audio-hash-mismatch:${rawPath}`, failures);
    expect(bytes.length === record.sizeBytes, `raw-audio-size-mismatch:${rawPath}`, failures);

    const cue = classifyAudioCue(rawPath);
    const outputPath = `${outRoot}/audio/${cue.slotId}/${safeBaseName(rawPath)}`;
    if (write) writeBytes(outputPath, bytes);
    outputs.push({
      slotId: cue.slotId,
      cueRole: cue.role,
      mediaKind: cue.mediaKind,
      sourceRawPath: rawPath,
      legacySourcePath: rawPath.replace(`raw/imported/${importJobId}/`, ""),
      sourceHash,
      blobSha: record.blobSha,
      outputKind: "audio",
      outputPath,
      outputHash: sourceHash,
      outputBytes: bytes.length,
      mediaType: mediaTypeForExtension(extension),
      conversionStatus: "browser-ready-audio-copy",
      promotionReady: false,
      promoteOnlyAfter: ["license-provenance", "human-review", "approved-runtime-record", "public-assets-copy"],
    });
  }

  assert(failures.length === 0, `remaining audio conversion failed: ${failures.join(", ")}`);

  const report = {
    schema: "nexusengine.goldrush.remaining-audio-conversion-report.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt,
    sourceReceipts: {
      source: `${receiptRoot}/source.receipt.json`,
      rawCopy: `${receiptRoot}/raw-copy.receipt.json`,
      hashes: `${receiptRoot}/hashes.receipt.json`,
      secretScan: `${receiptRoot}/secret-scan.receipt.json`,
      validator: `${receiptRoot}/validator.receipt.json`,
    },
    outRoot,
    status: "remaining-audio-converted-for-review",
    publicPromotion: false,
    runtimePromotion: false,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresLicenseReviewBeforePromotion: true,
      requiresHumanReviewBeforePromotion: true,
      receiptScope: "batch-only-does-not-modify-first31-gate",
    },
    totals: summarizeOutputs(outputs),
    outputs,
  };

  if (write) {
    writeJson(defaultReportPath, report);
    writeJson(defaultRegistryPath, createRemainingAudioRegistry(report));
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createRemainingAudioBatchConversionReport(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId: report.importJobId,
    batchId: report.batchId,
    totals: report.totals,
    conversionReport: args.write ? defaultReportPath : null,
    sanitizedRegistry: args.write ? defaultRegistryPath : null,
  }, { repoRoot }));
}

function validateReceipt(receipt, expectedNamePart, failures) {
  expect(receipt.schema?.includes(expectedNamePart), `invalid-receipt-schema:${expectedNamePart}`, failures);
  expect(receipt.receiptKind === "remaining-batch", `invalid-receipt-kind:${expectedNamePart}`, failures);
  expect(receipt.importJobId === importJobId, `wrong-import-job:${expectedNamePart}`, failures);
  expect(receipt.batchId === batchId, `wrong-batch-id:${expectedNamePart}`, failures);
  expect(receipt.doesNotModifyFirst31Gate === true, `must-not-modify-first31-gate:${expectedNamePart}`, failures);
}

function classifyAudioCue(rawPath) {
  const fileName = rawPath.split("/").pop().toLowerCase();
  if (rawPath.includes("/CombatSongs/")) {
    return { slotId: "goldrush.audio.music.combat", role: "combat-intensity", mediaKind: "music" };
  }
  if (rawPath.includes("/WanderingSongs/")) {
    return { slotId: "goldrush.audio.music.wandering", role: "exploration-bed", mediaKind: "music" };
  }
  if (fileName.includes("introvoice")) {
    return { slotId: "goldrush.audio.voice.titleIntro", role: "title-voice", mediaKind: "voice" };
  }
  if (fileName.includes("introfull")) {
    return { slotId: "goldrush.audio.music.titleIntro", role: "title-intro", mediaKind: "music" };
  }
  return { slotId: "goldrush.audio.sfx.misc", role: "unmapped-sfx-review", mediaKind: "sfx" };
}

function createRemainingAudioRegistry(report) {
  return {
    schema: "nexusengine.goldrush.remaining-audio-sanitized-registry.v1",
    version: "0.1.0",
    importJobId: report.importJobId,
    batchId: report.batchId,
    generatedAt: report.generatedAt,
    conversionReport: defaultReportPath,
    publicPromotion: false,
    runtimePromotion: false,
    totals: report.totals,
    assets: report.outputs.map((output) => ({
      slotId: output.slotId,
      mediaKind: output.mediaKind,
      cueRole: output.cueRole,
      sourceRawPath: output.sourceRawPath,
      sourceHash: output.sourceHash,
      outputPath: output.outputPath,
      outputHash: output.outputHash,
      mediaType: output.mediaType,
      conversionStatus: output.conversionStatus,
      promotionReady: false,
    })),
  };
}

function summarizeOutputs(outputs) {
  const bySlotId = {};
  const byMediaKind = {};
  for (const output of outputs) {
    bySlotId[output.slotId] = (bySlotId[output.slotId] ?? 0) + 1;
    byMediaKind[output.mediaKind] = (byMediaKind[output.mediaKind] ?? 0) + 1;
  }
  return {
    candidates: outputs.length,
    outputs: outputs.length,
    browserReadyAudioCopies: outputs.length,
    totalBytes: outputs.reduce((sum, output) => sum + output.outputBytes, 0),
    promotionReady: outputs.filter((output) => output.promotionReady).length,
    bySlotId,
    byMediaKind,
  };
}

function mediaTypeForExtension(extension) {
  if (extension === ".mp3") return "audio/mpeg";
  if (extension === ".ogg") return "audio/ogg";
  if (extension === ".wav") return "audio/wav";
  return "application/octet-stream";
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--out-root") args.outRoot = argv[++index];
    else if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--write") args.write = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relPath) {
  return JSON.parse(readFileSync(join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
}

function writeJson(relPath, value) {
  writeBytes(relPath, Buffer.from(`${JSON.stringify(value, null, 2)}\n`));
}

function writeBytes(relPath, bytes) {
  const absolute = join(repoRoot, normalizeRepoPath(relPath));
  if (relPath.endsWith(".json")) {
    writeSanitizedJsonArtifactSync(absolute, JSON.parse(bytes.toString("utf8")), { repoRoot });
    return;
  }
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, bytes);
}

function safeBaseName(sourcePath) {
  return sourcePath.split("/").pop().replace(/[^a-z0-9._-]+/gi, "-");
}

function isSafeRawPath(value) {
  return typeof value === "string"
    && value.startsWith(`raw/imported/${importJobId}/`)
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
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

function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
