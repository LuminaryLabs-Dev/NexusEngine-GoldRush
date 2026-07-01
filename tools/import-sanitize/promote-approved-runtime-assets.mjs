import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
  writeSanitizedTextArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const defaultReportPath = "reports/promotion/goldrush-approved-runtime-promotion-plan.json";
const approvedRegistryPath = "src/content/goldrushApprovedAssets.js";
const publicManifestPath = "public/assets/manifests/goldrush-assets.json";
const publicRuntimeRoot = "public/assets/goldrush-approved";

export function createApprovedRuntimePromotionPlan({
  generatedAt = new Date().toISOString(),
  write = false,
  confirmApprovedRuntimePromotion = false,
  reportPath = defaultReportPath,
  writeReport = false,
} = {}) {
  const failures = [];
  expect(!write || confirmApprovedRuntimePromotion, "write-requires-confirm-approved-runtime-promotion", failures);

  const reviewPairs = discoverReviewPairs();
  const approvedRecords = [];
  const blockedItems = [];

  for (const pair of reviewPairs) {
    const human = readJson(pair.humanReviewPath);
    const license = readJson(pair.licenseProvenancePath);
    validatePacketPair(pair, human, license, failures);

    const licenseByItemId = new Map((license.items ?? []).map((item) => [item.itemId, item]));
    for (const humanItem of human.items ?? []) {
      const licenseItem = licenseByItemId.get(humanItem.itemId);
      const candidate = createCandidate(pair, human, humanItem, licenseItem);
      if (candidate.ready) approvedRecords.push(candidate.record);
      else blockedItems.push(candidate.blocked);
    }
  }

  const duplicateSlots = duplicates(approvedRecords.map((record) => record.id));
  const duplicateRuntimePaths = duplicates(approvedRecords.map((record) => record.runtimePath));
  const duplicateApprovalIds = duplicates(approvedRecords.map((record) => record.approvalId));
  for (const id of duplicateSlots) failures.push(`duplicate-approved-slot:${id}`);
  for (const runtimePath of duplicateRuntimePaths) failures.push(`duplicate-runtime-path:${runtimePath}`);
  for (const approvalId of duplicateApprovalIds) failures.push(`duplicate-approval-id:${approvalId}`);

  const catalog = createApprovedCatalog(generatedAt, approvedRecords);
  const manifest = createPublicManifest(approvedRecords);
  const report = {
    schema: "nexusengine.goldrush.approved-runtime-promotion-plan.v1",
    version: "0.1.0",
    importJobId,
    generatedAt,
    status: approvedRecords.length > 0 ? "approved-runtime-promotion-ready" : "no-approved-assets-to-promote",
    write,
    publicPromotion: write && approvedRecords.length > 0,
    runtimePromotion: write && approvedRecords.length > 0,
    reviewPairs: reviewPairs.length,
    totals: {
      reviewedItems: approvedRecords.length + blockedItems.length,
      approvedRecords: approvedRecords.length,
      blockedItems: blockedItems.length,
      outputBytes: approvedRecords.reduce((sum, record) => sum + record.outputBytes, 0),
    },
    outputs: {
      approvedRegistry: approvedRegistryPath,
      publicManifest: publicManifestPath,
      runtimeRoot: publicRuntimeRoot,
    },
    approvedRecords,
    blockedItems,
    rules: {
      requiresHumanApproval: true,
      requiresLicenseApproval: true,
      requiresMatchingApprovalId: true,
      requiresSanitizedSourceOutput: true,
      runtimePathMustStayUnderAssets: true,
      rawOrReviewOnlyPromotionBlocked: true,
      writesOnlyWithExplicitConfirmation: true,
    },
  };

  assert(failures.length === 0, `approved runtime promotion plan invalid: ${failures.join(", ")}`);

  if (write && approvedRecords.length > 0) {
    writeRuntimeAssets(approvedRecords);
    writeSanitizedTextArtifactSync(path.join(repoRoot, approvedRegistryPath), renderApprovedRegistryModule(catalog), { repoRoot });
    writeSanitizedJsonArtifactSync(path.join(repoRoot, publicManifestPath), manifest, { repoRoot });
  }
  if (writeReport) {
    writeSanitizedJsonArtifactSync(path.join(repoRoot, normalizeRepoPath(reportPath)), report, { repoRoot });
  }

  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  args.writeReport = true;
  const report = createApprovedRuntimePromotionPlan(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId,
    write: report.write,
    approvedRecords: report.totals.approvedRecords,
    blockedItems: report.totals.blockedItems,
    report: args.reportPath ?? defaultReportPath,
    publicPromotion: report.publicPromotion,
    runtimePromotion: report.runtimePromotion,
  }, { repoRoot }));
}

function discoverReviewPairs() {
  const humanPaths = collectJsonFiles(path.join(repoRoot, "reports/human-review"));
  return humanPaths.map((absoluteHumanPath) => {
    const humanReviewPath = toRepoPath(absoluteHumanPath);
    const human = readJson(humanReviewPath);
    const licenseProvenancePath = normalizeRepoPath(human.evidence?.licenseProvenance);
    return {
      humanReviewPath,
      licenseProvenancePath,
    };
  }).filter((pair) => existsSync(path.join(repoRoot, pair.licenseProvenancePath)));
}

function createCandidate(pair, human, humanItem, licenseItem) {
  const blockedBy = [];
  if (!licenseItem) blockedBy.push("missing-license-item");
  if (!isApprovedHumanReview(humanItem)) blockedBy.push("human-review-not-approved");
  if (!isApprovedLicense(licenseItem)) blockedBy.push("license-not-approved");
  if (!hasFilledString(humanItem.approvalId)) blockedBy.push("missing-human-approval-id");
  if (!hasFilledString(licenseItem?.approvalId)) blockedBy.push("missing-license-approval-id");
  if (humanItem.approvalId !== licenseItem?.approvalId) blockedBy.push("approval-id-mismatch");
  if (humanItem.sourceHash !== licenseItem?.sourceHash) blockedBy.push("source-hash-mismatch");
  if (humanItem.outputHash !== licenseItem?.outputHash) blockedBy.push("output-hash-mismatch");
  if (humanItem.outputPath !== licenseItem?.outputPath) blockedBy.push("output-path-mismatch");
  if (!isPromotableOutputPath(humanItem.outputPath)) blockedBy.push("output-path-not-sanitized-review-output");
  if (!isSafeSourcePath(humanItem.sourcePath ?? humanItem.legacySourcePath)) blockedBy.push("unsafe-source-path");

  const absoluteOutputPath = path.join(repoRoot, normalizeRepoPath(humanItem.outputPath ?? "missing"));
  if (!existsSync(absoluteOutputPath)) blockedBy.push("output-file-missing");
  else {
    const outputHash = `sha256:${createHash("sha256").update(readFileSync(absoluteOutputPath)).digest("hex")}`;
    if (outputHash !== humanItem.outputHash) blockedBy.push("output-file-hash-mismatch");
  }

  const category = categoryForItem(humanItem);
  if (!category) blockedBy.push("unsupported-runtime-category");
  const runtimePath = runtimePathForItem(humanItem, category);
  if (!isSafeRuntimePath(runtimePath)) blockedBy.push("unsafe-runtime-path");

  const base = {
    itemId: humanItem.itemId,
    slotId: humanItem.slotId,
    mediaKind: humanItem.mediaKind,
    sourcePath: humanItem.sourcePath ?? humanItem.legacySourcePath,
    outputPath: humanItem.outputPath,
    approvalId: humanItem.approvalId ?? null,
    blockedBy,
    humanReview: pair.humanReviewPath,
    licenseProvenance: pair.licenseProvenancePath,
  };

  if (blockedBy.length > 0) return { ready: false, blocked: base };

  return {
    ready: true,
    record: {
      id: humanItem.slotId,
      status: "approved",
      sourceJobId: importJobId,
      sourcePath: humanItem.sourcePath ?? humanItem.legacySourcePath,
      sourceHash: humanItem.sourceHash,
      outputHash: humanItem.outputHash,
      outputBytes: statSync(absoluteOutputPath).size,
      provenance: "approved-license-and-human-review",
      provenanceEvidence: {
        status: "approved",
        humanReview: pair.humanReviewPath,
        licenseProvenance: pair.licenseProvenancePath,
        reviewItemId: humanItem.itemId,
      },
      approvalId: humanItem.approvalId,
      runtimePath,
      sourceOutputPath: humanItem.outputPath,
      category,
    },
  };
}

function createApprovedCatalog(generatedAt, records) {
  const groups = {
    assets: [],
    scenes: [],
    audio: [],
    animations: [],
  };
  for (const record of records) {
    const { category, sourceOutputPath, outputBytes, ...approvedRecord } = record;
    if (category === "asset") groups.assets.push(approvedRecord);
    if (category === "scene") groups.scenes.push(approvedRecord);
    if (category === "audio") groups.audio.push(approvedRecord);
    if (category === "animation") groups.animations.push(approvedRecord);
  }
  return {
    schema: "nexusengine.goldrush.approved-assets.v1",
    version: "0.1.0",
    source: "cloud-reviewed-public-runtime-assets",
    generatedAt,
    pendingCloudImport: records.length === 0,
    assets: groups.assets,
    presentation: {
      scenes: groups.scenes,
      audio: groups.audio,
      animations: groups.animations,
    },
  };
}

function createPublicManifest(records) {
  return {
    version: "0.1.0",
    pendingCloudImport: records.length === 0,
    assets: records.map((record) => ({
      id: record.id,
      category: record.category,
      runtimePath: record.runtimePath,
      outputHash: record.outputHash,
      approvalId: record.approvalId,
    })),
  };
}

function writeRuntimeAssets(records) {
  for (const record of records) {
    const sourcePath = path.join(repoRoot, normalizeRepoPath(record.sourceOutputPath));
    const destinationPath = path.join(repoRoot, "public", normalizeRepoPath(record.runtimePath));
    mkdirSync(path.dirname(destinationPath), { recursive: true });
    copyFileSync(sourcePath, destinationPath);
  }
}

function renderApprovedRegistryModule(catalog) {
  return `export const approvedAssetRecordRequiredFields = [
  "id",
  "status",
  "sourceJobId",
  "sourcePath",
  "sourceHash",
  "outputHash",
  "provenance",
  "approvalId",
  "runtimePath",
];

export const approvedAssetRecordGroups = [
  { category: "asset", key: "assets" },
  { category: "scene", key: "scenes", parent: "presentation" },
  { category: "audio", key: "audio", parent: "presentation" },
  { category: "animation", key: "animations", parent: "presentation" },
];

export const goldRushApprovedAssets = ${JSON.stringify(catalog, null, 2)};

export function applyGoldRushApprovedOverlay(baseRegistry, approvedCatalog = goldRushApprovedAssets) {
  const approvedRecords = collectGoldRushApprovedAssetRecords(approvedCatalog);
  const approvedCount = approvedRecords.length;
  const presentation = baseRegistry.presentation ?? {};

  return {
    ...baseRegistry,
    pendingCloudImport: approvedCatalog.pendingCloudImport ?? approvedCount === 0,
    approvedAssetOverlay: {
      schema: approvedCatalog.schema,
      version: approvedCatalog.version,
      source: approvedCatalog.source,
      approvedCount,
      status: approvedCount > 0 ? "partial-approved-runtime-assets" : "pending-cloud-import",
    },
    assets: overlayApprovedRecords(baseRegistry.assets ?? [], approvedCatalog.assets ?? []),
    presentation: {
      ...presentation,
      scenes: overlayApprovedRecords(presentation.scenes ?? [], approvedCatalog.presentation?.scenes ?? []),
      audio: overlayApprovedRecords(presentation.audio ?? [], approvedCatalog.presentation?.audio ?? []),
      animations: overlayApprovedRecords(presentation.animations ?? [], approvedCatalog.presentation?.animations ?? []),
    },
  };
}

export function collectGoldRushApprovedAssetRecords(approvedCatalog = goldRushApprovedAssets) {
  return approvedAssetRecordGroups.flatMap((group) => {
    const container = group.parent ? approvedCatalog[group.parent] : approvedCatalog;
    const records = Array.isArray(container?.[group.key]) ? container[group.key] : [];
    return records.map((record) => ({
      category: group.category,
      record,
    }));
  });
}

function overlayApprovedRecords(baseRecords, approvedRecords) {
  const approvedById = new Map(approvedRecords.map((record) => [record.id, record]));
  return baseRecords.map((baseRecord) => {
    const approvedRecord = approvedById.get(baseRecord.id);
    if (!approvedRecord) return { ...baseRecord };
    return {
      ...baseRecord,
      ...approvedRecord,
      status: "approved",
      placeholder: baseRecord.placeholder,
    };
  });
}
`;
}

function validatePacketPair(pair, human, license, failures) {
  expect(human.importJobId === importJobId, `${pair.humanReviewPath}:wrong-import-job`, failures);
  expect(license.importJobId === importJobId, `${pair.licenseProvenancePath}:wrong-import-job`, failures);
  expect(human.publicPromotion === false, `${pair.humanReviewPath}:must-not-already-promote-public`, failures);
  expect(human.runtimePromotion === false, `${pair.humanReviewPath}:must-not-already-promote-runtime`, failures);
  expect(license.publicPromotion === false, `${pair.licenseProvenancePath}:must-not-already-promote-public`, failures);
  expect(license.runtimePromotion === false, `${pair.licenseProvenancePath}:must-not-already-promote-runtime`, failures);
  expect(Array.isArray(human.items), `${pair.humanReviewPath}:missing-items`, failures);
  expect(Array.isArray(license.items), `${pair.licenseProvenancePath}:missing-items`, failures);
}

function isApprovedHumanReview(item) {
  return item?.reviewStatus === "approved" || item?.humanReviewStatus === "approved";
}

function isApprovedLicense(item) {
  return item?.licenseStatus === "approved";
}

function categoryForItem(item) {
  if (["music", "sfx", "voice"].includes(item.mediaKind)) return "audio";
  if (item.mediaKind === "scene-reference") return "scene";
  if (item.mediaKind === "animation" || item.mediaKind === "scene-animation" || item.mediaKind === "prop-animation") return "animation";
  if (["textures", "metadata", "external-conversion-request", "review-only"].includes(item.outputKind)) return null;
  return "asset";
}

function runtimePathForItem(item, category) {
  const extension = path.extname(item.outputPath ?? "").toLowerCase();
  const baseName = `${safePathSegment(item.slotId)}${extension || ".asset"}`;
  return `assets/goldrush-approved/${category}/${baseName}`;
}

function collectJsonFiles(root) {
  if (!existsSync(root)) return [];
  const info = statSync(root);
  if (info.isDirectory()) {
    return readdirSync(root).flatMap((entry) => collectJsonFiles(path.join(root, entry)));
  }
  return root.endsWith(".json") ? [root] : [];
}

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--report") args.reportPath = argv[++index];
    else if (arg === "--write") args.write = true;
    else if (arg === "--confirm-approved-runtime-promotion") args.confirmApprovedRuntimePromotion = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function isPromotableOutputPath(value) {
  return hasFilledString(value)
    && value.startsWith(`sanitized/converted/${importJobId}/`)
    && !hasUnsafePathText(value)
    && !value.includes("/external-conversion/")
    && !value.includes("/review-only/")
    && !value.includes("/metadata/");
}

function isSafeSourcePath(value) {
  return hasFilledString(value)
    && !hasUnsafePathText(value)
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.split("/").includes("..");
}

function isSafeRuntimePath(value) {
  return hasFilledString(value)
    && value.startsWith("assets/goldrush-approved/")
    && !value.startsWith("public/")
    && !hasUnsafePathText(value)
    && !value.includes("?")
    && !value.includes("#")
    && path.posix.normalize(value) === value;
}

function hasUnsafePathText(value) {
  if (typeof value !== "string") return true;
  if (/[\u0000-\u001f\u007f]/.test(value)) return true;
  if (/^(https?:|data:|blob:|file:|\/\/)/i.test(value)) return true;
  if (value.includes("\\") || value.split("/").includes("..")) return true;
  return ["raw", "quarantine"].some((segment) => value.toLowerCase().split("/").includes(segment));
}

function normalizeRepoPath(value) {
  assert(hasFilledString(value), "path is required");
  assert(!value.startsWith("/"), `absolute path is not allowed: ${value}`);
  assert(!value.includes("\\"), `backslash path is not allowed: ${value}`);
  assert(!value.includes("\0"), "null byte path is not allowed");
  assert(!value.split("/").includes(".."), `path traversal is not allowed: ${value}`);
  assert(!/^(https?:|data:|blob:|file:|\/\/)/i.test(value), `url path is not allowed: ${value}`);
  return value;
}

function toRepoPath(absolutePath) {
  return path.relative(repoRoot, absolutePath).split(path.sep).join("/");
}

function safePathSegment(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "");
}

function duplicates(values) {
  const seen = new Set();
  const duplicateSet = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicateSet.add(value);
    seen.add(value);
  }
  return [...duplicateSet];
}

function hasFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
