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
const batchId = `${importJobId}.next.003.mine-town-terrain-props`;
const receiptRoot = `reports/provenance/remaining-batches/${batchId}`;
const defaultOutRoot = `sanitized/converted/${importJobId}/remaining-batches/${batchId}`;
const defaultReportPath = `reports/conversion/remaining-batches/${batchId}.json`;
const defaultRegistryPath = `sanitized/registry/remaining-batches/${batchId}.json`;
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png"]);

export function convertRemainingMineTownTerrainPropsBatch({
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
  expect(rawCopy.mode === "raw-files-written", "mine-town-terrain-batch-requires-written-raw-files", failures);
  expect(secretScan.findingCount === 0, "secret-scan-must-have-zero-findings", failures);
  expect(source.itemCount === 125, "source-receipt-item-count-must-be-125", failures);
  expect(source.totalBytes === 189766893, "source-receipt-byte-count-must-match", failures);

  const hashByPath = new Map((hashes.files ?? []).map((file) => [file.path, file]));
  const outputs = [];
  for (const file of rawCopy.fetchedFiles ?? []) {
    const hash = hashByPath.get(file.targetRawPath);
    expect(Boolean(hash), `missing-hash-record:${file.targetRawPath}`, failures);
    expect(file.sourceHash === hash?.sha256, `hash-record-mismatch:${file.targetRawPath}`, failures);
    expect(isSafeRawPath(file.targetRawPath), `invalid-raw-path:${file.targetRawPath}`, failures);
    const extension = extname(file.sourcePath).toLowerCase();
    expect(allowedImageExtensions.has(extension), `non-image-extension:${file.sourcePath}`, failures);

    const absoluteRawPath = join(repoRoot, normalizeRepoPath(file.targetRawPath ?? ""));
    expect(existsSync(absoluteRawPath), `raw-image-file-missing:${file.targetRawPath}`, failures);
    if (!existsSync(absoluteRawPath)) continue;

    const bytes = readFileSync(absoluteRawPath);
    expect(bytes.length === file.sizeBytes, `raw-image-size-mismatch:${file.targetRawPath}`, failures);
    expect(sha256(bytes) === file.sourceHash, `raw-image-hash-mismatch:${file.targetRawPath}`, failures);

    const candidate = classifyTextureCandidate(file, bytes);
    const outputPath = `${outRoot}/textures/${candidate.role}/${shortHash(file.sourceHash)}-${safeBaseName(file.sourcePath)}`;
    if (write) writeBytes(outputPath, bytes);
    outputs.push({
      slotId: candidate.slotId,
      mediaKind: "texture",
      role: candidate.role,
      textureIntent: candidate.textureIntent,
      sourcePath: file.sourcePath,
      sourceRawPath: file.targetRawPath,
      sourceHash: file.sourceHash,
      sourceBytes: file.sizeBytes,
      sourceExtension: extension,
      referencedByDomains: file.referencedByDomains ?? [],
      outputKind: "texture-review-copy",
      outputPath,
      outputHash: sha256(bytes),
      outputBytes: bytes.length,
      dimensions: candidate.dimensions,
      colorSpaceHint: candidate.colorSpaceHint,
      compressionRecommendation: candidate.compressionRecommendation,
      conversionStatus: "browser-ready-texture-review-copy",
      promotionReady: false,
      publicPromotion: false,
      runtimePromotion: false,
      promoteOnlyAfter: [
        "texture-role-review",
        "license-provenance",
        "human-review",
        "approved-runtime-record",
        "public-assets-copy",
      ],
    });
  }

  assert(failures.length === 0, `remaining mine/town/terrain props conversion failed: ${failures.join(", ")}`);

  const report = {
    schema: "nexusengine.goldrush.remaining-mine-town-terrain-props-conversion-report.v1",
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
    status: "remaining-mine-town-terrain-props-converted-for-review",
    publicPromotion: false,
    runtimePromotion: false,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresTextureRoleReview: true,
      requiresLicenseProvenanceBeforePromotion: true,
      requiresHumanReviewBeforePromotion: true,
      requiresApprovedRuntimeRecordBeforePromotion: true,
      requiresPublicAssetHashValidationBeforeRuntime: true,
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
  const { report } = convertRemainingMineTownTerrainPropsBatch(args);
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

function classifyTextureCandidate(file, bytes) {
  const lower = file.sourcePath.toLowerCase();
  const textureIntent = inferTextureIntent(lower);
  let role = "misc-texture";
  let slotId = "goldrush.texture.misc";

  if (lower.includes("/05_images/") || lower.includes("textmesh pro") || lower.includes("/deprecated/")) {
    role = "legacy-ui-reference";
    slotId = "goldrush.ui.legacyReference";
  } else if (lower.includes("train-track")) {
    role = "train-track-material";
    slotId = "goldrush.material.trainTrack";
  } else if (lower.includes("freight-train")) {
    role = "train-car-material";
    slotId = "goldrush.material.trainCar";
  } else if (lower.includes("cactus") || lower.includes("aloe")) {
    role = "desert-plant-material";
    slotId = "goldrush.material.desertPlant";
  } else if (lower.includes("desert-rock") || lower.includes("rocks-stones")) {
    role = "desert-rock-material";
    slotId = "goldrush.material.desertRock";
  } else if (lower.includes("fence")) {
    role = "fence-material";
    slotId = "goldrush.material.fence";
  } else if (lower.includes("wild-west-farm") || lower.includes("curch") || lower.includes("church")) {
    role = "town-structure-material";
    slotId = "goldrush.material.townStructure";
  } else if (lower.includes("/carts/") || lower.includes("cart_")) {
    role = "mine-cart-material";
    slotId = "goldrush.material.mineCart";
  } else if (lower.includes("/09_textures/") || lower.includes("sand") || lower.includes("dirt") || lower.includes("grass") || lower.includes("road") || lower.includes("ground")) {
    role = "terrain-surface-material";
    slotId = "goldrush.material.terrainSurface";
  } else if (lower.includes("mannequin")) {
    role = "legacy-character-material";
    slotId = "goldrush.material.legacyCharacter";
  }

  return {
    role,
    slotId,
    textureIntent,
    dimensions: readImageDimensions(bytes, file.extension),
    colorSpaceHint: textureIntent === "color" ? "SRGBColorSpace" : "NoColorSpace",
    compressionRecommendation: role === "legacy-ui-reference" ? "keep-lossless-review-copy" : "future-ktx2-basisu-review",
  };
}

function inferTextureIntent(lower) {
  if (/(normal|nmap|_nrm|nrm\.|normal_map)/i.test(lower)) return "normal";
  if (/(rough|roughness|metal|metallic|metalness|spec|gls|ao|ambient|displacement|height)/i.test(lower)) return "data";
  return "color";
}

function readImageDimensions(bytes, extension) {
  const normalized = extension.toLowerCase();
  if (normalized === ".png" && bytes.length >= 24 && bytes.toString("ascii", 1, 4) === "PNG") {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if ((normalized === ".jpg" || normalized === ".jpeg") && bytes.length > 4) {
    let offset = 2;
    while (offset < bytes.length - 9) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      offset += 2 + Math.max(length, 2);
    }
  }
  return { width: null, height: null };
}

function createRegistry(report) {
  return {
    schema: "nexusengine.goldrush.remaining-mine-town-terrain-props-sanitized-registry.v1",
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
      role: output.role,
      textureIntent: output.textureIntent,
      sourcePath: output.sourcePath,
      sourceRawPath: output.sourceRawPath,
      sourceHash: output.sourceHash,
      outputKind: output.outputKind,
      outputPath: output.outputPath,
      outputHash: output.outputHash,
      conversionStatus: output.conversionStatus,
      dimensions: output.dimensions,
      colorSpaceHint: output.colorSpaceHint,
      promotionReady: false,
      publicPromotion: false,
      runtimePromotion: false,
    })),
  };
}

function summarizeOutputs(outputs) {
  const byRole = {};
  const byTextureIntent = {};
  const byColorSpaceHint = {};
  for (const output of outputs) {
    byRole[output.role] = (byRole[output.role] ?? 0) + 1;
    byTextureIntent[output.textureIntent] = (byTextureIntent[output.textureIntent] ?? 0) + 1;
    byColorSpaceHint[output.colorSpaceHint] = (byColorSpaceHint[output.colorSpaceHint] ?? 0) + 1;
  }
  return {
    candidates: outputs.length,
    outputs: outputs.length,
    textureReviewCopies: outputs.length,
    promotionReady: outputs.filter((output) => output.promotionReady).length,
    totalOutputBytes: outputs.reduce((sum, output) => sum + output.outputBytes, 0),
    byRole,
    byTextureIntent,
    byColorSpaceHint,
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
