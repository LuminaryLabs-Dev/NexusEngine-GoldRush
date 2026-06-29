import { createHash } from "node:crypto";
import { dirname, extname, join, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const defaultClassificationPath = `reports/asset-classification/${importJobId}-classification.json`;
const defaultHashManifestPath = `reports/provenance/${importJobId}-hashes.json`;
const defaultOutRoot = `sanitized/converted/${importJobId}`;
const defaultConversionReportPath = `reports/conversion/${importJobId}.json`;
const defaultSanitizedRegistryPath = "sanitized/registry/assets.json";

const directCopyExtensions = new Set([".mp3", ".ogg", ".wav", ".png", ".jpg", ".jpeg", ".webp"]);
const metadataExtensions = new Set([".unity", ".prefab", ".anim", ".controller", ".mat", ".asset"]);
const externalConversionExtensions = new Set([".fbx", ".glb", ".gltf"]);

export function createGoldRushConversionReport({
  classificationPath = defaultClassificationPath,
  hashManifestPath = defaultHashManifestPath,
  outRoot = defaultOutRoot,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const classification = readJson(classificationPath);
  const hashManifest = readJson(hashManifestPath);
  const hashBySourcePath = new Map((hashManifest.files ?? []).map((record) => [record.sourcePath, record]));
  const failures = [];
  const outputs = [];

  expect(classification.schema === "nexusengine.goldrush.asset-intake-classification.v1", "invalid-classification-schema", failures);
  expect(classification.importJobId === importJobId, "wrong-classification-job", failures);
  expect((classification.blocked ?? []).length === 0, "classification-has-blocked-records", failures);
  expect((classification.unmapped ?? []).length === 0, "classification-has-unmapped-records", failures);

  for (const candidate of classification.candidates ?? []) {
    const sourceRecord = hashBySourcePath.get(candidate.path);
    expect(Boolean(sourceRecord), `missing-hash-record:${candidate.path}`, failures);
    const rawPath = sourceRecord?.path;
    expect(rawPath?.startsWith(`raw/imported/${importJobId}/`), `invalid-raw-path:${candidate.path}`, failures);
    const absoluteRawPath = join(repoRoot, normalizeRepoPath(rawPath ?? ""));
    expect(existsSync(absoluteRawPath), `raw-file-missing:${candidate.path}`, failures);
    if (!existsSync(absoluteRawPath)) continue;

    const extension = extname(candidate.path).toLowerCase();
    const bytes = readFileSync(absoluteRawPath);
    const sourceHash = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
    expect(sourceHash === candidate.sourceHash, `source-hash-mismatch:${candidate.path}`, failures);

    if (directCopyExtensions.has(extension)) {
      outputs.push(createDirectCopyOutput({ candidate, bytes, outRoot, extension, write }));
      continue;
    }

    if (metadataExtensions.has(extension)) {
      outputs.push(createMetadataOutput({ candidate, bytes, outRoot, extension, write }));
      continue;
    }

    if (externalConversionExtensions.has(extension)) {
      outputs.push(createExternalConversionOutput({ candidate, bytes, outRoot, extension, write }));
      continue;
    }

    outputs.push(createReviewOnlyOutput({ candidate, bytes, outRoot, extension, write }));
  }

  assert(failures.length === 0, `conversion failed: ${failures.join(", ")}`);

  const report = {
    schema: "nexusengine.goldrush.conversion-report.v1",
    version: "0.1.0",
    importJobId,
    generatedAt,
    sourceClassification: classificationPath,
    sourceHashManifest: hashManifestPath,
    outRoot,
    status: "converted-candidates-ready-for-review",
    publicPromotion: false,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresHumanReviewBeforePromotion: true,
      rawTextCopiedIntoReport: false,
    },
    totals: summarizeOutputs(outputs),
    outputs,
  };

  if (write) {
    writeJson(defaultConversionReportPath, report);
    writeJson(defaultSanitizedRegistryPath, createSanitizedRegistry(report));
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createGoldRushConversionReport(args);
  console.log(JSON.stringify({
    status: report.status,
    importJobId: report.importJobId,
    totals: report.totals,
    conversionReport: args.write ? defaultConversionReportPath : null,
    sanitizedRegistry: args.write ? defaultSanitizedRegistryPath : null,
  }, null, 2));
}

function createDirectCopyOutput({ candidate, bytes, outRoot, extension, write }) {
  const kind = ["music", "sfx"].includes(candidate.mediaKind) ? "audio" : "textures";
  const relPath = `${outRoot}/${kind}/${candidate.slotId}/${safeBaseName(candidate.path)}`;
  if (write) writeBytes(relPath, bytes);
  return {
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    handling: candidate.handling,
    sourcePath: candidate.path,
    sourceHash: candidate.sourceHash,
    outputKind: kind,
    outputPath: relPath,
    outputHash: sha256(bytes),
    outputBytes: bytes.length,
    conversionStatus: "browser-ready-copy",
    promotionReady: false,
    promoteOnlyAfter: ["license-provenance", "human-review", "approved-runtime-record"],
  };
}

function createMetadataOutput({ candidate, bytes, outRoot, extension, write }) {
  const text = bytes.toString("utf8");
  const metadata = extractUnityTextMetadata(candidate, text);
  const body = Buffer.from(`${JSON.stringify(metadata, null, 2)}\n`);
  const relPath = `${outRoot}/metadata/${candidate.slotId}/${safeBaseName(candidate.path)}.json`;
  if (write) writeBytes(relPath, body);
  return {
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    handling: candidate.handling,
    sourcePath: candidate.path,
    sourceHash: candidate.sourceHash,
    outputKind: "metadata",
    outputPath: relPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "metadata-extracted",
    promotionReady: false,
    promoteOnlyAfter: ["layout-review", "license-provenance", "human-review", "approved-runtime-record"],
    metadataSummary: metadata.summary,
  };
}

function createExternalConversionOutput({ candidate, bytes, outRoot, extension, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.external-conversion-request.v1",
    importJobId,
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    sourcePath: candidate.path,
    sourceHash: candidate.sourceHash,
    sourceBytes: bytes.length,
    sourceExtension: extension,
    requestedOutput: candidate.mediaKind === "animation" ? "retargeted-animation-map" : "browser-ready-glb-or-gltf",
    status: "requires-external-conversion",
    notes: [
      "Raw model data is retained only under raw/imported.",
      "This descriptor does not copy FBX bytes into sanitized output.",
      "Promotion requires converted browser output, provenance, and human review.",
    ],
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const relPath = `${outRoot}/external-conversion/${candidate.slotId}/${safeBaseName(candidate.path)}.json`;
  if (write) writeBytes(relPath, body);
  return {
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    handling: candidate.handling,
    sourcePath: candidate.path,
    sourceHash: candidate.sourceHash,
    outputKind: "external-conversion-request",
    outputPath: relPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-external-conversion",
    promotionReady: false,
    promoteOnlyAfter: ["model-conversion", "license-provenance", "human-review", "approved-runtime-record"],
  };
}

function createReviewOnlyOutput({ candidate, bytes, outRoot, extension, write }) {
  const descriptor = {
    schema: "nexusengine.goldrush.review-only-conversion.v1",
    importJobId,
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    sourcePath: candidate.path,
    sourceHash: candidate.sourceHash,
    sourceBytes: bytes.length,
    sourceExtension: extension,
    status: "requires-manual-review",
  };
  const body = Buffer.from(`${JSON.stringify(descriptor, null, 2)}\n`);
  const relPath = `${outRoot}/review-only/${candidate.slotId}/${safeBaseName(candidate.path)}.json`;
  if (write) writeBytes(relPath, body);
  return {
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    handling: candidate.handling,
    sourcePath: candidate.path,
    sourceHash: candidate.sourceHash,
    outputKind: "review-only",
    outputPath: relPath,
    outputHash: sha256(body),
    outputBytes: body.length,
    conversionStatus: "requires-manual-review",
    promotionReady: false,
    promoteOnlyAfter: ["manual-conversion-plan", "license-provenance", "human-review"],
  };
}

function extractUnityTextMetadata(candidate, text) {
  const lines = text.split(/\r?\n/);
  const guids = [...new Set([...text.matchAll(/guid:\s*([a-f0-9]{32})/gi)].map((match) => match[1]))].sort();
  const fileIds = [...new Set([...text.matchAll(/fileID:\s*(-?\d+)/g)].map((match) => match[1]))].slice(0, 250);
  const names = [...new Set([...text.matchAll(/\bm_Name:\s*([^\n\r]+)/g)].map((match) => match[1].trim()).filter(Boolean))].slice(0, 120);
  const yamlTags = {};
  for (const match of text.matchAll(/^--- !u!(\d+) /gm)) {
    yamlTags[match[1]] = (yamlTags[match[1]] ?? 0) + 1;
  }
  return {
    schema: "nexusengine.goldrush.unity-text-metadata.v1",
    importJobId,
    slotId: candidate.slotId,
    mediaKind: candidate.mediaKind,
    sourcePath: candidate.path,
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

function createSanitizedRegistry(report) {
  return {
    schema: "nexusengine.goldrush.sanitized-registry.v1",
    version: "0.1.0",
    importJobId: report.importJobId,
    generatedAt: report.generatedAt,
    conversionReport: defaultConversionReportPath,
    publicPromotion: false,
    totals: report.totals,
    assets: report.outputs.map((output) => ({
      slotId: output.slotId,
      mediaKind: output.mediaKind,
      sourcePath: output.sourcePath,
      sourceHash: output.sourceHash,
      outputPath: output.outputPath,
      outputHash: output.outputHash,
      conversionStatus: output.conversionStatus,
      promotionReady: false,
    })),
  };
}

function summarizeOutputs(outputs) {
  const byStatus = {};
  const byKind = {};
  for (const output of outputs) {
    byStatus[output.conversionStatus] = (byStatus[output.conversionStatus] ?? 0) + 1;
    byKind[output.outputKind] = (byKind[output.outputKind] ?? 0) + 1;
  }
  return {
    candidates: outputs.length,
    outputs: outputs.length,
    browserReadyCopies: byStatus["browser-ready-copy"] ?? 0,
    metadataExtracted: byStatus["metadata-extracted"] ?? 0,
    externalConversionRequests: byStatus["requires-external-conversion"] ?? 0,
    reviewOnly: byStatus["requires-manual-review"] ?? 0,
    promotionReady: outputs.filter((output) => output.promotionReady).length,
    byStatus,
    byKind,
  };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--classification") args.classificationPath = argv[++index];
    else if (arg === "--hash-manifest") args.hashManifestPath = argv[++index];
    else if (arg === "--out-root") args.outRoot = argv[++index];
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
