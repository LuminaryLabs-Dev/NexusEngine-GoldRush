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
const batchIds = [
  `${importJobId}.next.005.mine-town-terrain-props`,
  `${importJobId}.next.006.mine-town-terrain-props`,
  `${importJobId}.next.007.mine-town-terrain-props`,
  `${importJobId}.next.008.mine-town-terrain-props`,
];
const conversionId = `${importJobId}.next.005-008.mine-town-terrain-props-source-metadata`;
const defaultOutRoot = `sanitized/converted/${importJobId}/remaining-batches/${conversionId}`;
const defaultReportPath = `reports/conversion/remaining-batches/${conversionId}.json`;
const defaultRegistryPath = `sanitized/registry/remaining-batches/${conversionId}.json`;
const metadataExtensions = new Set([".mat", ".asset"]);
const externalConversionExtensions = new Set([".fbx"]);

export function convertRemainingMineTownTerrainSourceMetadataBatches({
  outRoot = defaultOutRoot,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const failures = [];
  const outputs = [];
  const sourceReceipts = {};

  for (const batchId of batchIds) {
    const receiptRoot = `reports/provenance/remaining-batches/${batchId}`;
    const rawCopy = readJson(`${receiptRoot}/raw-copy.receipt.json`);
    const hashes = readJson(`${receiptRoot}/hashes.receipt.json`);
    const secretScan = readJson(`${receiptRoot}/secret-scan.receipt.json`);
    const source = readJson(`${receiptRoot}/source.receipt.json`);
    const validator = readJson(`${receiptRoot}/validator.receipt.json`);
    validateReceipt(rawCopy, batchId, "raw-copy", failures);
    validateReceipt(hashes, batchId, "hashes", failures);
    validateReceipt(secretScan, batchId, "secret-scan", failures);
    validateReceipt(source, batchId, "source", failures);
    validateReceipt(validator, batchId, "validator", failures);
    expect(rawCopy.mode === "raw-files-written", `${batchId}:requires-written-raw-files`, failures);
    expect(secretScan.findingCount === 0, `${batchId}:secret-scan-must-have-zero-findings`, failures);

    sourceReceipts[batchId] = {
      rawCopy: `${receiptRoot}/raw-copy.receipt.json`,
      hashes: `${receiptRoot}/hashes.receipt.json`,
      secretScan: `${receiptRoot}/secret-scan.receipt.json`,
      source: `${receiptRoot}/source.receipt.json`,
      validator: `${receiptRoot}/validator.receipt.json`,
      itemCount: source.itemCount,
      totalBytes: source.totalBytes,
    };

    const hashByPath = new Map((hashes.files ?? []).map((file) => [file.path, file]));
    for (const file of rawCopy.fetchedFiles ?? []) {
      const hash = hashByPath.get(file.targetRawPath);
      expect(Boolean(hash), `${batchId}:missing-hash-record:${file.targetRawPath}`, failures);
      expect(file.sourceHash === hash?.sha256, `${batchId}:hash-record-mismatch:${file.targetRawPath}`, failures);
      expect(isSafeRawPath(file.targetRawPath), `${batchId}:invalid-raw-path:${file.targetRawPath}`, failures);
      const absoluteRawPath = join(repoRoot, normalizeRepoPath(file.targetRawPath ?? ""));
      expect(existsSync(absoluteRawPath), `${batchId}:raw-file-missing:${file.targetRawPath}`, failures);
      if (!existsSync(absoluteRawPath)) continue;
      const bytes = readFileSync(absoluteRawPath);
      expect(bytes.length === file.sizeBytes, `${batchId}:raw-file-size-mismatch:${file.targetRawPath}`, failures);
      expect(sha256(bytes) === file.sourceHash, `${batchId}:raw-file-hash-mismatch:${file.targetRawPath}`, failures);

      const candidate = classifySourceCandidate(file, batchId);
      const extension = extname(file.sourcePath).toLowerCase();
      if (metadataExtensions.has(extension)) {
        outputs.push(createMetadataOutput({ batchId, candidate, file, bytes, outRoot, write }));
      } else if (externalConversionExtensions.has(extension)) {
        outputs.push(createExternalConversionOutput({ batchId, candidate, file, bytes, outRoot, write }));
      } else {
        outputs.push(createReviewOnlyOutput({ batchId, candidate, file, bytes, outRoot, write }));
      }
    }
  }

  assert(failures.length === 0, `remaining source metadata conversion failed: ${failures.join(", ")}`);

  const report = {
    schema: "nexusengine.goldrush.remaining-mine-town-terrain-source-metadata-conversion-report.v1",
    version: "0.1.0",
    importJobId,
    conversionId,
    batchIds,
    generatedAt,
    sourceReceipts,
    outRoot,
    status: "remaining-mine-town-terrain-source-metadata-converted-for-review",
    publicPromotion: false,
    runtimePromotion: false,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresExternalModelConversion: true,
      requiresMaterialRemapReview: true,
      requiresTerrainAssetReview: true,
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
  const { report } = convertRemainingMineTownTerrainSourceMetadataBatches(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId,
    conversionId,
    write: args.write,
    conversionReport: args.write ? defaultReportPath : null,
    sanitizedRegistry: args.write ? defaultRegistryPath : null,
    totals: report.totals,
    publicPromotion: false,
    runtimePromotion: false,
  }, { repoRoot }));
}

function classifySourceCandidate(file, batchId) {
  const lower = file.sourcePath.toLowerCase();
  const base = lower.split("/").pop() ?? lower;
  if (lower.includes("terraindata") || lower.endsWith(".asset")) return candidate(batchId, file, "goldrush.world.terrainAsset", "terrain-source-asset");
  if (lower.includes("train") || lower.includes("locomotive") || lower.includes("vagon") || lower.includes("e2-tank-engine") || lower.includes("freight") || lower.includes("coach")) return candidate(batchId, file, "goldrush.material.train", "train-material-or-model");
  if (lower.includes("fence")) return candidate(batchId, file, "goldrush.material.fence", "fence-material-or-model");
  if (base.includes("coin") || base.includes("diamond") || /\bgold\b/.test(base.replace(/[_-]/g, " "))) return candidate(batchId, file, "goldrush.material.loot", "loot-material-or-model");
  if (lower.includes("cactus") || lower.includes("aloe") || lower.includes("grass") || lower.includes("plant")) return candidate(batchId, file, "goldrush.material.desertFlora", "desert-flora-material-or-model");
  if (lower.includes("rock") || lower.includes("stone")) return candidate(batchId, file, "goldrush.material.desertRock", "desert-rock-material-or-model");
  if (lower.includes("bank") || lower.includes("barn") || lower.includes("chapel") || lower.includes("church") || lower.includes("saloon") || lower.includes("building") || lower.includes("western")) return candidate(batchId, file, "goldrush.material.frontierTown", "frontier-town-material-or-model");
  if (lower.includes("barrel") || lower.includes("box") || lower.includes("bridge") || lower.includes("wagon") || lower.includes("water") || lower.includes("well")) return candidate(batchId, file, "goldrush.material.frontierUtility", "frontier-utility-material-or-model");
  return candidate(batchId, file, "goldrush.material.review", "manual-review-source");
}

function candidate(batchId, file, slotId, role) {
  return {
    batchId,
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

function createMetadataOutput({ batchId, candidate, file, bytes, outRoot, write }) {
  const text = bytes.toString("utf8");
  const metadata = extractUnityMetadata(candidate, text);
  const body = Buffer.from(`${JSON.stringify(metadata, null, 2)}\n`);
  const sourceType = file.extension === ".asset" ? "terrain-asset-metadata" : "material-metadata";
  const outputPath = `${outRoot}/metadata/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(outputPath, body);
  return outputBase({
    batchId,
    candidate,
    outputKind: sourceType,
    outputPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "metadata-extracted",
    promoteOnlyAfter: ["material-remap-review", "license-provenance", "human-review", "approved-runtime-record"],
    extra: { metadataSummary: metadata.summary },
  });
}

function createExternalConversionOutput({ batchId, candidate, file, bytes, outRoot, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.remaining-source-model-external-conversion-request.v1",
    importJobId,
    conversionId,
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
      "Promotion requires GLB/glTF conversion, scale/origin/collider metadata, provenance, human review, approved runtime record, and public asset hash validation.",
    ],
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const outputPath = `${outRoot}/external-conversion/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}.json`;
  if (write) writeBytes(outputPath, body);
  return outputBase({
    batchId,
    candidate,
    outputKind: "external-conversion-request",
    outputPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-external-conversion",
    promoteOnlyAfter: ["model-conversion", "scale-origin-review", "collider-policy", "license-provenance", "human-review", "approved-runtime-record"],
  });
}

function createReviewOnlyOutput({ batchId, candidate, file, bytes, outRoot, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.remaining-source-review-only.v1",
    importJobId,
    conversionId,
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
    batchId,
    candidate,
    outputKind: "review-only",
    outputPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-manual-review",
    promoteOnlyAfter: ["manual-conversion-plan", "license-provenance", "human-review"],
  });
}

function outputBase({ batchId, candidate, outputKind, outputPath, outputHash, outputBytes, conversionStatus, promoteOnlyAfter, extra = {} }) {
  return {
    batchId,
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

function extractUnityMetadata(candidate, text) {
  const guids = [...new Set([...text.matchAll(/guid:\s*([a-f0-9]{32})/gi)].map((match) => match[1]))].sort();
  const names = [...new Set([...text.matchAll(/\bm_Name:\s*([^\n\r]+)/g)].map((match) => match[1].trim()).filter(Boolean))].slice(0, 160);
  const colors = [...text.matchAll(/\bm_Color:\s*\{([^}]+)\}/g)].map((match) => match[1].trim()).slice(0, 40);
  const floats = [...text.matchAll(/\bm_Floats:\s*([\s\S]*?)(?:\n\s*m_|$)/g)].map((match) => match[1].trim()).slice(0, 8);
  const textureRefs = [...new Set([...text.matchAll(/\bm_Texture:\s*\{fileID:\s*[^,}]+,\s*guid:\s*([a-f0-9]{32})/gi)].map((match) => match[1]))].sort();
  return {
    schema: "nexusengine.goldrush.remaining-source-unity-metadata.v1",
    importJobId,
    conversionId,
    batchId: candidate.batchId,
    slotId: candidate.slotId,
    role: candidate.role,
    sourcePath: candidate.sourcePath,
    sourceRawPath: candidate.sourceRawPath,
    sourceHash: candidate.sourceHash,
    summary: {
      lineCount: text.split(/\r?\n/).length,
      guidCount: guids.length,
      textureReferenceCount: textureRefs.length,
      namedObjectCount: names.length,
      colorCount: colors.length,
      floatBlockCount: floats.length,
    },
    references: { guids, textureRefs, names, colors, floatBlocks: floats },
  };
}

function createRegistry(report) {
  return {
    schema: "nexusengine.goldrush.remaining-mine-town-terrain-source-metadata-sanitized-registry.v1",
    version: "0.1.0",
    importJobId,
    conversionId,
    batchIds,
    generatedAt: report.generatedAt,
    conversionReport: defaultReportPath,
    publicPromotion: false,
    runtimePromotion: false,
    totals: report.totals,
    assets: report.outputs.map((output) => ({
      batchId: output.batchId,
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
  const byBatch = {};
  const byStatus = {};
  const byKind = {};
  const byRole = {};
  for (const output of outputs) {
    byBatch[output.batchId] = (byBatch[output.batchId] ?? 0) + 1;
    byStatus[output.conversionStatus] = (byStatus[output.conversionStatus] ?? 0) + 1;
    byKind[output.outputKind] = (byKind[output.outputKind] ?? 0) + 1;
    byRole[output.role] = (byRole[output.role] ?? 0) + 1;
  }
  return {
    candidates: outputs.length,
    outputs: outputs.length,
    metadataExtracted: (byKind["material-metadata"] ?? 0) + (byKind["terrain-asset-metadata"] ?? 0),
    materialMetadata: byKind["material-metadata"] ?? 0,
    terrainAssetMetadata: byKind["terrain-asset-metadata"] ?? 0,
    externalConversionRequests: byKind["external-conversion-request"] ?? 0,
    reviewOnly: byKind["review-only"] ?? 0,
    promotionReady: outputs.filter((output) => output.promotionReady).length,
    totalOutputBytes: outputs.reduce((sum, output) => sum + output.outputBytes, 0),
    byBatch,
    byStatus,
    byKind,
    byRole,
  };
}

function validateReceipt(receipt, batchId, expectedNamePart, failures) {
  expect(receipt.receiptKind === "remaining-batch", `${batchId}:invalid-receipt-kind:${expectedNamePart}`, failures);
  expect(receipt.importJobId === importJobId, `${batchId}:wrong-receipt-job:${expectedNamePart}`, failures);
  expect(receipt.batchId === batchId, `${batchId}:wrong-batch-id:${expectedNamePart}`, failures);
  expect(receipt.doesNotModifyFirst31Gate === true, `${batchId}:receipt-modifies-first31:${expectedNamePart}`, failures);
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
