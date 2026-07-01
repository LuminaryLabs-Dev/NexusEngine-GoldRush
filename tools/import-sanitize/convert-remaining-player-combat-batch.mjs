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
const batchId = `${importJobId}.next.002.player-combat-character`;
const receiptRoot = `reports/provenance/remaining-batches/${batchId}`;
const defaultOutRoot = `sanitized/converted/${importJobId}/remaining-batches/${batchId}`;
const defaultReportPath = `reports/conversion/remaining-batches/${batchId}.json`;
const defaultRegistryPath = `sanitized/registry/remaining-batches/${batchId}.json`;
const directCopyExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const metadataExtensions = new Set([".prefab", ".anim", ".controller", ".mat", ".asset"]);
const externalConversionExtensions = new Set([".fbx", ".glb", ".gltf"]);

export function convertRemainingPlayerCombatBatch({
  outRoot = defaultOutRoot,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const rawCopy = readJson(`${receiptRoot}/raw-copy.receipt.json`);
  const hashes = readJson(`${receiptRoot}/hashes.receipt.json`);
  const secretScan = readJson(`${receiptRoot}/secret-scan.receipt.json`);
  const validator = readJson(`${receiptRoot}/validator.receipt.json`);
  const failures = [];
  validateReceipt(rawCopy, "remaining-batch-raw-copy", failures);
  validateReceipt(hashes, "remaining-batch-hash", failures);
  validateReceipt(secretScan, "remaining-batch-secret-scan", failures);
  validateReceipt(validator, "remaining-batch-validator", failures);
  expect(rawCopy.mode === "raw-files-written", "player-combat-batch-requires-written-raw-files", failures);
  expect(secretScan.findingCount === 0, "secret-scan-must-have-zero-findings", failures);

  const hashByPath = new Map((hashes.files ?? []).map((file) => [file.path, file]));
  const outputs = [];
  for (const file of rawCopy.fetchedFiles ?? []) {
    const hash = hashByPath.get(file.targetRawPath);
    expect(Boolean(hash), `missing-hash-record:${file.targetRawPath}`, failures);
    expect(file.sourceHash === hash?.sha256, `hash-record-mismatch:${file.targetRawPath}`, failures);
    expect(file.targetRawPath?.startsWith(`raw/imported/${importJobId}/`), `invalid-raw-path:${file.targetRawPath}`, failures);
    const absoluteRawPath = join(repoRoot, normalizeRepoPath(file.targetRawPath ?? ""));
    expect(existsSync(absoluteRawPath), `raw-file-missing:${file.targetRawPath}`, failures);
    if (!existsSync(absoluteRawPath)) continue;
    const bytes = readFileSync(absoluteRawPath);
    expect(bytes.length === file.sizeBytes, `raw-file-size-mismatch:${file.targetRawPath}`, failures);
    expect(sha256(bytes) === file.sourceHash, `raw-file-hash-mismatch:${file.targetRawPath}`, failures);

    const candidate = classifyCandidate(file);
    const extension = extname(file.sourcePath).toLowerCase();
    if (directCopyExtensions.has(extension)) {
      outputs.push(createDirectCopyOutput({ candidate, file, bytes, outRoot, write }));
    } else if (metadataExtensions.has(extension)) {
      outputs.push(createMetadataOutput({ candidate, file, bytes, outRoot, write }));
    } else if (externalConversionExtensions.has(extension)) {
      outputs.push(createExternalConversionOutput({ candidate, file, bytes, outRoot, write }));
    } else {
      outputs.push(createReviewOnlyOutput({ candidate, file, bytes, outRoot, write }));
    }
  }

  assert(failures.length === 0, `remaining player/combat conversion failed: ${failures.join(", ")}`);

  const report = {
    schema: "nexusengine.goldrush.remaining-player-combat-conversion-report.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt,
    sourceReceipts: {
      rawCopy: `${receiptRoot}/raw-copy.receipt.json`,
      hashes: `${receiptRoot}/hashes.receipt.json`,
      secretScan: `${receiptRoot}/secret-scan.receipt.json`,
      validator: `${receiptRoot}/validator.receipt.json`,
    },
    outRoot,
    status: "remaining-player-combat-converted-for-review",
    publicPromotion: false,
    runtimePromotion: false,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresExternalModelConversion: true,
      requiresLicenseProvenanceBeforePromotion: true,
      requiresHumanReviewBeforePromotion: true,
      requiresApprovedRuntimeRecordBeforePromotion: true,
      rawTextCopiedIntoReport: false,
      batchScopedDoesNotModifyFirst31Gate: true,
    },
    totals: summarizeOutputs(outputs),
    outputs,
  };
  const registry = createRegistry(report);

  if (write) {
    writeJson(defaultReportPath, report);
    writeJson(defaultRegistryPath, registry);
  }

  return { report, registry };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const { report } = convertRemainingPlayerCombatBatch(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId,
    batchId,
    write: args.write,
    conversionReport: args.write ? defaultReportPath : null,
    sanitizedRegistry: args.write ? defaultRegistryPath : null,
    totals: report.totals,
    publicPromotion: false,
    runtimePromotion: false,
  }, { repoRoot }));
}

function classifyCandidate(file) {
  const lower = file.sourcePath.toLowerCase();
  const base = safeBaseName(file.sourcePath).toLowerCase();
  if (lower.includes("revolver") || lower.includes("gun_base")) return candidate(file, "goldrush.weapon.revolver", "weapon", "weapon-source-candidate");
  if (lower.includes("playercamera")) return candidate(file, "goldrush.scene.playerTest", "camera-metadata", "player-camera-source-metadata");
  if (lower.includes("pistol idle")) return candidate(file, "goldrush.anim.player.aimIdle", "animation", "retarget-animation-clip");
  if (lower.includes("pistol run")) return candidate(file, "goldrush.anim.player.aimRun", "animation", "retarget-animation-clip");
  if (lower.includes("pistol jump")) return candidate(file, "goldrush.anim.player.aimJump", "animation", "retarget-animation-clip");
  if (base.includes("running") || base.includes("move01")) return candidate(file, "goldrush.anim.player.run", "animation", "retarget-animation-clip");
  if (base.includes("idle")) return candidate(file, "goldrush.anim.player.idle", "animation", "retarget-animation-clip");
  if (base.includes("gunplay") || base.includes("attack01")) return candidate(file, "goldrush.anim.player.shooting", "animation", "retarget-animation-clip");
  if (base.includes("die01") || base.includes("dead")) return candidate(file, "goldrush.anim.player.dead", "animation", "retarget-animation-clip");
  if (base.includes("gold") || lower.includes("/goldanimations/")) return candidate(file, "goldrush.prop.goldPile", "prop-animation", "gold-prop-source-metadata");
  if (lower.includes("mainmenu") || lower.includes("rushslide")) return candidate(file, "goldrush.scene.mainMenu", "scene-animation", "menu-animation-source-metadata");
  return candidate(file, "goldrush.player.prospector", "character", "character-source-candidate");
}

function candidate(file, slotId, mediaKind, handling) {
  return {
    slotId,
    mediaKind,
    handling,
    sourcePath: file.sourcePath,
    sourceRawPath: file.targetRawPath,
    sourceHash: file.sourceHash,
    sourceBytes: file.sizeBytes,
    sourceExtension: file.extension,
    referencedByDomains: file.referencedByDomains ?? [],
  };
}

function createDirectCopyOutput({ candidate, file, bytes, outRoot, write }) {
  const relPath = `${outRoot}/textures/${candidate.slotId}/${safeBaseName(file.sourcePath)}`;
  if (write) writeBytes(relPath, bytes);
  return outputBase({
    candidate,
    outputKind: "textures",
    outputPath: relPath,
    outputHash: sha256(bytes),
    outputBytes: bytes.length,
    conversionStatus: "browser-ready-review-copy",
    promoteOnlyAfter: ["license-provenance", "human-review", "approved-runtime-record", "public-assets-copy"],
  });
}

function createMetadataOutput({ candidate, file, bytes, outRoot, write }) {
  const text = bytes.toString("utf8");
  const metadata = extractUnityTextMetadata(candidate, text);
  const body = Buffer.from(`${JSON.stringify(metadata, null, 2)}\n`);
  const relPath = `${outRoot}/metadata/${candidate.slotId}/${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(relPath, body);
  return outputBase({
    candidate,
    outputKind: "metadata",
    outputPath: relPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "metadata-extracted",
    promoteOnlyAfter: ["metadata-review", "license-provenance", "human-review", "approved-runtime-record"],
    extra: { metadataSummary: metadata.summary },
  });
}

function createExternalConversionOutput({ candidate, file, bytes, outRoot, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.remaining-player-combat-external-conversion-request.v1",
    importJobId,
    batchId,
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    handling: candidate.handling,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    sourceBytes: bytes.length,
    sourceExtension: file.extension,
    requestedOutput: candidate.mediaKind === "animation" ? "retargeted-animation-map" : "browser-ready-glb-or-gltf",
    status: "requires-external-conversion",
    notes: [
      "Raw model/animation bytes remain under raw/imported.",
      "This descriptor does not promote FBX bytes to runtime.",
      "Promotion requires converted browser output, provenance, human review, approved runtime record, and public asset hash validation.",
    ],
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const relPath = `${outRoot}/external-conversion/${candidate.slotId}/${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(relPath, body);
  return outputBase({
    candidate,
    outputKind: "external-conversion-request",
    outputPath: relPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-external-conversion",
    promoteOnlyAfter: ["model-conversion", "license-provenance", "human-review", "approved-runtime-record"],
  });
}

function createReviewOnlyOutput({ candidate, file, bytes, outRoot, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.remaining-player-combat-review-only.v1",
    importJobId,
    batchId,
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    sourceBytes: bytes.length,
    sourceExtension: file.extension,
    status: "requires-manual-review",
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const relPath = `${outRoot}/review-only/${candidate.slotId}/${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(relPath, body);
  return outputBase({
    candidate,
    outputKind: "review-only",
    outputPath: relPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-manual-review",
    promoteOnlyAfter: ["manual-conversion-plan", "license-provenance", "human-review"],
  });
}

function outputBase({ candidate, outputKind, outputPath, outputHash, outputBytes, conversionStatus, promoteOnlyAfter, extra = {} }) {
  return {
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    handling: candidate.handling,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    sourceBytes: candidate.sourceBytes,
    sourceExtension: candidate.sourceExtension,
    outputKind,
    outputPath,
    outputHash,
    outputBytes,
    conversionStatus,
    promotionReady: false,
    publicPromotion: false,
    runtimePromotion: false,
    promoteOnlyAfter,
    ...extra,
  };
}

function extractUnityTextMetadata(candidate, text) {
  const lines = text.split(/\r?\n/);
  const guids = [...new Set([...text.matchAll(/guid:\s*([a-f0-9]{32})/gi)].map((match) => match[1]))].sort();
  const fileIds = [...new Set([...text.matchAll(/fileID:\s*(-?\d+)/g)].map((match) => match[1]))].slice(0, 300);
  const names = [...new Set([...text.matchAll(/\bm_Name:\s*([^\n\r]+)/g)].map((match) => match[1].trim()).filter(Boolean))].slice(0, 160);
  const yamlTags = {};
  for (const match of text.matchAll(/^--- !u!(\d+) /gm)) {
    yamlTags[match[1]] = (yamlTags[match[1]] ?? 0) + 1;
  }
  return {
    schema: "nexusengine.goldrush.remaining-player-combat-unity-text-metadata.v1",
    importJobId,
    batchId,
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    summary: {
      lineCount: lines.length,
      guidCount: guids.length,
      fileIdCount: fileIds.length,
      namedObjectCount: names.length,
      yamlTagTypes: Object.keys(yamlTags).length,
    },
    references: {
      guids,
      fileIds,
      names,
      yamlTags,
    },
  };
}

function createRegistry(report) {
  return {
    schema: "nexusengine.goldrush.remaining-player-combat-sanitized-registry.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt: report.generatedAt,
    conversionReport: defaultReportPath,
    publicPromotion: false,
    runtimePromotion: false,
    totals: report.totals,
    assets: report.outputs.map((output) => ({
      slotId: output.slotId,
      mediaKind: output.mediaKind,
      sourcePath: output.sourcePath,
      sourceRawPath: output.sourceRawPath,
      sourceHash: output.sourceHash,
      outputKind: output.outputKind,
      outputPath: output.outputPath,
      outputHash: output.outputHash,
      conversionStatus: output.conversionStatus,
      promotionReady: false,
      publicPromotion: false,
      runtimePromotion: false,
    })),
  };
}

function summarizeOutputs(outputs) {
  const byStatus = {};
  const byKind = {};
  const bySlotId = {};
  for (const output of outputs) {
    byStatus[output.conversionStatus] = (byStatus[output.conversionStatus] ?? 0) + 1;
    byKind[output.outputKind] = (byKind[output.outputKind] ?? 0) + 1;
    bySlotId[output.slotId] = (bySlotId[output.slotId] ?? 0) + 1;
  }
  return {
    candidates: outputs.length,
    outputs: outputs.length,
    browserReadyCopies: byStatus["browser-ready-review-copy"] ?? 0,
    metadataExtracted: byStatus["metadata-extracted"] ?? 0,
    externalConversionRequests: byStatus["requires-external-conversion"] ?? 0,
    reviewOnly: byStatus["requires-manual-review"] ?? 0,
    promotionReady: outputs.filter((output) => output.promotionReady).length,
    totalOutputBytes: outputs.reduce((sum, output) => sum + output.outputBytes, 0),
    byStatus,
    byKind,
    bySlotId,
  };
}

function validateReceipt(receipt, expectedNamePart, failures) {
  expect(receipt.receiptKind === "remaining-batch", `invalid-receipt-kind:${expectedNamePart}`, failures);
  expect(receipt.importJobId === importJobId, `wrong-receipt-job:${expectedNamePart}`, failures);
  expect(receipt.batchId === batchId, `wrong-batch-id:${expectedNamePart}`, failures);
  expect(receipt.doesNotModifyFirst31Gate === true, `receipt-modifies-first31:${expectedNamePart}`, failures);
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
  const body = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  writeBytes(relPath, body);
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

function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
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

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
