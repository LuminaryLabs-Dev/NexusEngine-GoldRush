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
const batchId = `${importJobId}.next.004.mine-town-terrain-props`;
const receiptRoot = `reports/provenance/remaining-batches/${batchId}`;
const defaultOutRoot = `sanitized/converted/${importJobId}/remaining-batches/${batchId}`;
const defaultReportPath = `reports/conversion/remaining-batches/${batchId}.json`;
const defaultRegistryPath = `sanitized/registry/remaining-batches/${batchId}.json`;
const textureExtensions = new Set([".jpg", ".jpeg"]);
const metadataExtensions = new Set([".prefab"]);
const externalConversionExtensions = new Set([".fbx"]);

export function convertRemainingMineTownTerrainPropModelsBatch({
  outRoot = defaultOutRoot,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const rawCopy = readJson(`${receiptRoot}/raw-copy.receipt.json`);
  const hashes = readJson(`${receiptRoot}/hashes.receipt.json`);
  const secretScan = readJson(`${receiptRoot}/secret-scan.receipt.json`);
  const source = readJson(`${receiptRoot}/source.receipt.json`);
  const validator = readJson(`${receiptRoot}/validator.receipt.json`);
  const failures = [];

  validateReceipt(rawCopy, "raw-copy", failures);
  validateReceipt(hashes, "hashes", failures);
  validateReceipt(secretScan, "secret-scan", failures);
  validateReceipt(source, "source", failures);
  validateReceipt(validator, "validator", failures);
  expect(rawCopy.mode === "raw-files-written", "prop-model-batch-requires-written-raw-files", failures);
  expect(secretScan.findingCount === 0, "secret-scan-must-have-zero-findings", failures);
  expect(source.itemCount === 125, "source-receipt-item-count-must-be-125", failures);
  expect(source.totalBytes === 37057275, "source-receipt-byte-count-must-match", failures);

  const hashByPath = new Map((hashes.files ?? []).map((file) => [file.path, file]));
  const outputs = [];
  for (const file of rawCopy.fetchedFiles ?? []) {
    const hash = hashByPath.get(file.targetRawPath);
    expect(Boolean(hash), `missing-hash-record:${file.targetRawPath}`, failures);
    expect(file.sourceHash === hash?.sha256, `hash-record-mismatch:${file.targetRawPath}`, failures);
    expect(isSafeRawPath(file.targetRawPath), `invalid-raw-path:${file.targetRawPath}`, failures);
    const absoluteRawPath = join(repoRoot, normalizeRepoPath(file.targetRawPath ?? ""));
    expect(existsSync(absoluteRawPath), `raw-file-missing:${file.targetRawPath}`, failures);
    if (!existsSync(absoluteRawPath)) continue;
    const bytes = readFileSync(absoluteRawPath);
    expect(bytes.length === file.sizeBytes, `raw-file-size-mismatch:${file.targetRawPath}`, failures);
    expect(sha256(bytes) === file.sourceHash, `raw-file-hash-mismatch:${file.targetRawPath}`, failures);

    const candidate = classifyPropCandidate(file);
    const extension = extname(file.sourcePath).toLowerCase();
    if (textureExtensions.has(extension)) {
      outputs.push(createTextureOutput({ candidate, file, bytes, outRoot, write }));
    } else if (metadataExtensions.has(extension)) {
      outputs.push(createMetadataOutput({ candidate, file, bytes, outRoot, write }));
    } else if (externalConversionExtensions.has(extension)) {
      outputs.push(createExternalConversionOutput({ candidate, file, bytes, outRoot, write }));
    } else {
      outputs.push(createReviewOnlyOutput({ candidate, file, bytes, outRoot, write }));
    }
  }

  assert(failures.length === 0, `remaining prop model conversion failed: ${failures.join(", ")}`);

  const report = {
    schema: "nexusengine.goldrush.remaining-mine-town-terrain-prop-models-conversion-report.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt,
    sourceReceipts: {
      rawCopy: `${receiptRoot}/raw-copy.receipt.json`,
      hashes: `${receiptRoot}/hashes.receipt.json`,
      secretScan: `${receiptRoot}/secret-scan.receipt.json`,
      source: `${receiptRoot}/source.receipt.json`,
      validator: `${receiptRoot}/validator.receipt.json`,
    },
    outRoot,
    status: "remaining-mine-town-terrain-prop-models-converted-for-review",
    publicPromotion: false,
    runtimePromotion: false,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresExternalModelConversion: true,
      requiresPrefabRoleReview: true,
      requiresLicenseProvenanceBeforePromotion: true,
      requiresHumanReviewBeforePromotion: true,
      requiresApprovedRuntimeRecordBeforePromotion: true,
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
  const { report } = convertRemainingMineTownTerrainPropModelsBatch(args);
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

function classifyPropCandidate(file) {
  const lower = file.sourcePath.toLowerCase();
  if (lower.includes("train") || lower.includes("locomotive") || lower.includes("vagon") || lower.includes("rails")) return candidate(file, "goldrush.prop.trainRail", "train-rail-prop");
  if (lower.includes("cart")) return candidate(file, "goldrush.prop.mineCart", "mine-cart-prop");
  if (lower.includes("cactus") || lower.includes("aloe") || lower.includes("grass") || lower.includes("flora")) return candidate(file, "goldrush.prop.desertFlora", "desert-flora-prop");
  if (lower.includes("rock") || lower.includes("stone")) return candidate(file, "goldrush.prop.desertRock", "desert-rock-prop");
  if (lower.includes("boonesville") || lower.includes("bank") || lower.includes("barn") || lower.includes("chapel") || lower.includes("church") || lower.includes("western")) return candidate(file, "goldrush.prop.frontierTown", "frontier-town-prop");
  if (lower.includes("barrel") || lower.includes("box") || lower.includes("bridge")) return candidate(file, "goldrush.prop.frontierUtility", "frontier-utility-prop");
  if (lower.includes("ai") || lower.includes("mannequin") || lower.includes("goblin")) return candidate(file, "goldrush.prop.legacyCharacterReference", "legacy-character-reference");
  return candidate(file, "goldrush.prop.review", "manual-review-prop");
}

function candidate(file, slotId, role) {
  return {
    slotId,
    role,
    sourcePath: file.sourcePath,
    sourceRawPath: file.targetRawPath,
    sourceHash: file.sourceHash,
    sourceBytes: file.sizeBytes,
    sourceExtension: file.extension,
    referencedByDomains: file.referencedByDomains ?? [],
  };
}

function createTextureOutput({ candidate, file, bytes, outRoot, write }) {
  const textureIntent = inferTextureIntent(file.sourcePath);
  const outputPath = `${outRoot}/textures/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}`;
  if (write) writeBytes(outputPath, bytes);
  return outputBase({
    candidate,
    outputKind: "texture-review-copy",
    outputPath,
    outputHash: sha256(bytes),
    outputBytes: bytes.length,
    conversionStatus: "browser-ready-texture-review-copy",
    promoteOnlyAfter: ["texture-role-review", "license-provenance", "human-review", "approved-runtime-record", "public-assets-copy"],
    extra: {
      textureIntent,
      colorSpaceHint: textureIntent === "color" ? "SRGBColorSpace" : "NoColorSpace",
    },
  });
}

function createMetadataOutput({ candidate, file, bytes, outRoot, write }) {
  const text = bytes.toString("utf8");
  const metadata = extractPrefabMetadata(candidate, text);
  const body = Buffer.from(`${JSON.stringify(metadata, null, 2)}\n`);
  const outputPath = `${outRoot}/metadata/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(outputPath, body);
  return outputBase({
    candidate,
    outputKind: "prefab-metadata",
    outputPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "metadata-extracted",
    promoteOnlyAfter: ["prefab-role-review", "license-provenance", "human-review", "approved-runtime-record"],
    extra: { metadataSummary: metadata.summary },
  });
}

function createExternalConversionOutput({ candidate, file, bytes, outRoot, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.remaining-prop-model-external-conversion-request.v1",
    importJobId,
    batchId,
    slotId: candidate.slotId,
    role: candidate.role,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    sourceBytes: bytes.length,
    sourceExtension: file.extension,
    requestedOutput: "browser-ready-glb-or-gltf",
    status: "requires-external-conversion",
    notes: [
      "Raw FBX bytes remain under raw/imported.",
      "This descriptor does not promote FBX bytes to runtime.",
      "Promotion requires converted browser output, provenance, human review, approved runtime record, and public asset hash validation.",
    ],
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const outputPath = `${outRoot}/external-conversion/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(outputPath, body);
  return outputBase({
    candidate,
    outputKind: "external-conversion-request",
    outputPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-external-conversion",
    promoteOnlyAfter: ["model-conversion", "license-provenance", "human-review", "approved-runtime-record"],
  });
}

function createReviewOnlyOutput({ candidate, file, bytes, outRoot, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.remaining-prop-model-review-only.v1",
    importJobId,
    batchId,
    slotId: candidate.slotId,
    role: candidate.role,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    sourceBytes: bytes.length,
    sourceExtension: file.extension,
    status: "requires-manual-review",
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const outputPath = `${outRoot}/review-only/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(outputPath, body);
  return outputBase({
    candidate,
    outputKind: "review-only",
    outputPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-manual-review",
    promoteOnlyAfter: ["manual-conversion-plan", "license-provenance", "human-review"],
  });
}

function outputBase({ candidate, outputKind, outputPath, outputHash, outputBytes, conversionStatus, promoteOnlyAfter, extra = {} }) {
  return {
    slotId: candidate.slotId,
    role: candidate.role,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    sourceBytes: candidate.sourceBytes,
    sourceExtension: candidate.sourceExtension,
    referencedByDomains: candidate.referencedByDomains,
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

function extractPrefabMetadata(candidate, text) {
  const guids = [...new Set([...text.matchAll(/guid:\s*([a-f0-9]{32})/gi)].map((match) => match[1]))].sort();
  const names = [...new Set([...text.matchAll(/\bm_Name:\s*([^\n\r]+)/g)].map((match) => match[1].trim()).filter(Boolean))].slice(0, 160);
  const yamlTags = {};
  for (const match of text.matchAll(/^--- !u!(\d+) /gm)) yamlTags[match[1]] = (yamlTags[match[1]] ?? 0) + 1;
  return {
    schema: "nexusengine.goldrush.remaining-prop-prefab-metadata.v1",
    importJobId,
    batchId,
    slotId: candidate.slotId,
    role: candidate.role,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    summary: {
      lineCount: text.split(/\r?\n/).length,
      guidCount: guids.length,
      namedObjectCount: names.length,
      yamlTagTypes: Object.keys(yamlTags).length,
    },
    references: { guids, names, yamlTags },
  };
}

function createRegistry(report) {
  return {
    schema: "nexusengine.goldrush.remaining-mine-town-terrain-prop-models-sanitized-registry.v1",
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
      role: output.role,
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
  const byRole = {};
  for (const output of outputs) {
    byStatus[output.conversionStatus] = (byStatus[output.conversionStatus] ?? 0) + 1;
    byKind[output.outputKind] = (byKind[output.outputKind] ?? 0) + 1;
    byRole[output.role] = (byRole[output.role] ?? 0) + 1;
  }
  return {
    candidates: outputs.length,
    outputs: outputs.length,
    textureReviewCopies: byKind["texture-review-copy"] ?? 0,
    metadataExtracted: byKind["prefab-metadata"] ?? 0,
    externalConversionRequests: byKind["external-conversion-request"] ?? 0,
    reviewOnly: byKind["review-only"] ?? 0,
    promotionReady: outputs.filter((output) => output.promotionReady).length,
    totalOutputBytes: outputs.reduce((sum, output) => sum + output.outputBytes, 0),
    byStatus,
    byKind,
    byRole,
  };
}

function inferTextureIntent(sourcePath) {
  const lower = sourcePath.toLowerCase();
  if (/(normal|nmap|_nrm|normal_map)/.test(lower)) return "normal";
  if (/(rough|metal|metalness|ao|ambient|height|spec)/.test(lower)) return "data";
  return "color";
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
  writeSanitizedJsonArtifactSync(join(repoRoot, normalizeRepoPath(relPath)), value, { repoRoot });
}

function writeBytes(relPath, bytes) {
  const absolute = join(repoRoot, normalizeRepoPath(relPath));
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, bytes);
}

function safeBaseName(sourcePath) {
  return sourcePath.split("/").pop().replace(/[^a-z0-9._-]+/gi, "-");
}

function shortHash(value) {
  return String(value).replace(/^sha256:/, "").slice(0, 12);
}

function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
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

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
