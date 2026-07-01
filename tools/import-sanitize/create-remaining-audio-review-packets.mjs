import { dirname, join, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const batchId = "goldrush-dual-source-001.next.001.audio-music-and-sfx";
const conversionReportPath = `reports/conversion/remaining-batches/${batchId}.json`;
const registryPath = `sanitized/registry/remaining-batches/${batchId}.json`;
const humanReviewPath = `reports/human-review/remaining-batches/${batchId}-request.json`;
const licenseProvenancePath = `reports/license-provenance/remaining-batches/${batchId}.json`;

export function createRemainingAudioReviewPackets({
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const conversion = readJson(conversionReportPath);
  const registry = readJson(registryPath);
  const reviewItems = (conversion.outputs ?? []).map((output, index) => createReviewItem(output, index));
  const totals = summarizeReviewItems(reviewItems);
  const source = {
    importJobId,
    batchId,
    sourceKind: "remaining-batch-audio",
    sourceReceipts: conversion.sourceReceipts,
  };
  const sharedRules = {
    writesPublicAssets: false,
    promotesRuntimeAssets: false,
    requiresHumanReviewBeforePromotion: true,
    requiresLicenseProvenanceBeforePromotion: true,
    requiresApprovedRuntimeRecordBeforePromotion: true,
    allowsApprovalByInference: false,
    batchScopedDoesNotModifyFirst31Gate: true,
  };

  validateInputs({ conversion, registry, reviewItems });

  const licenseProvenance = {
    schema: "nexusengine.goldrush.remaining-audio-license-provenance.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt,
    status: "pending-license-provenance-review",
    publicPromotion: false,
    runtimePromotion: false,
    source,
    evidence: {
      conversionReport: conversionReportPath,
      sanitizedRegistry: registryPath,
      ...conversion.sourceReceipts,
    },
    rules: sharedRules,
    totals,
    licenseResearch: {
      status: "needs-track-level-confirmation",
      notes: [
        "Some filenames indicate likely public audio libraries, but filename inference is not an approval source.",
        "Kevin MacLeod/Incompetech tracks usually require attribution unless separately licensed.",
        "YouTube Audio Library tracks require checking the exact in-Studio license terms for each track.",
        "Freesound-style numeric filenames require checking the exact sound page license and attribution conditions.",
      ],
      references: [
        "https://incompetech.com/music/royalty-free/licenses/",
        "https://incompetech.com/music/royalty-free/faq.html",
        "https://support.google.com/youtube/answer/3376882",
        "https://freesound.org/",
      ],
    },
    items: reviewItems.map((item) => ({
      itemId: item.itemId,
      slotId: item.slotId,
      cueRole: item.cueRole,
      mediaKind: item.mediaKind,
      legacySourcePath: item.legacySourcePath,
      sourceHash: item.sourceHash,
      outputPath: item.outputPath,
      outputHash: item.outputHash,
      mediaType: item.mediaType,
      licenseStatus: "pending-provenance-review",
      licenseEvidenceStatus: classifyLicenseEvidenceStatus(item),
      approvalId: null,
      attributionRequired: null,
      attributionText: null,
      publicPromotion: false,
      runtimePromotion: false,
      promotionBlockedBy: [
        "track-level-license-provenance",
        "human-review",
        "approved-runtime-record",
      ],
    })),
  };

  const humanReview = {
    schema: "nexusengine.goldrush.remaining-audio-human-review-request.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt,
    status: "pending-human-review",
    publicPromotion: false,
    runtimePromotion: false,
    source,
    evidence: {
      conversionReport: conversionReportPath,
      sanitizedRegistry: registryPath,
      licenseProvenance: licenseProvenancePath,
      ...conversion.sourceReceipts,
    },
    rules: sharedRules,
    totals,
    reviewDomains: createReviewDomains(reviewItems),
    items: reviewItems,
    requiredDecision: {
      decisionType: "explicit-audio-approval-or-rejection",
      reviewerMustConfirm: [
        "track identity matches intended Gold Rush legacy audio",
        "license/provenance allows public browser game deployment",
        "required attribution text is captured before promotion",
        "audio quality is acceptable for title, wandering, combat, or voice use",
        "approved runtime path later stays under public/assets",
      ],
      mayPromoteAfter: [
        "licenseStatus is approved",
        "humanReviewStatus is approved",
        "approvalId is present",
        "attribution requirements are recorded",
        "approved runtime record validates",
        "public asset file exists and hash matches",
      ],
    },
  };

  if (write) {
    writeJson(licenseProvenancePath, licenseProvenance);
    writeJson(humanReviewPath, humanReview);
  }

  return { humanReview, licenseProvenance };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const packets = createRemainingAudioReviewPackets(args);
  console.log(sanitizedConsoleJson({
    status: "remaining-audio-review-packets-ready",
    importJobId,
    batchId,
    write: args.write,
    humanReview: args.write ? humanReviewPath : null,
    licenseProvenance: args.write ? licenseProvenancePath : null,
    reviewItems: packets.humanReview.items.length,
    domains: packets.humanReview.reviewDomains.length,
    publicPromotion: packets.humanReview.publicPromotion,
    runtimePromotion: packets.humanReview.runtimePromotion,
  }, { repoRoot }));
}

function createReviewItem(output, index) {
  return {
    itemId: `${batchId}.review.${String(index + 1).padStart(3, "0")}`,
    slotId: output.slotId,
    cueRole: output.cueRole,
    mediaKind: output.mediaKind,
    sourceRawPath: output.sourceRawPath,
    legacySourcePath: output.legacySourcePath,
    sourceHash: output.sourceHash,
    outputKind: output.outputKind,
    outputPath: output.outputPath,
    outputHash: output.outputHash,
    outputBytes: output.outputBytes,
    mediaType: output.mediaType,
    conversionStatus: output.conversionStatus,
    reviewStatus: "pending-human-review",
    licenseStatus: "pending-provenance-review",
    approvalId: null,
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: false,
    requiredGates: [
      "audio-identity-review",
      "track-level-license-provenance",
      "human-review",
      "approved-runtime-record",
      "public-assets-copy",
      "explicit-human-approval",
    ],
  };
}

function classifyLicenseEvidenceStatus(item) {
  const path = item.legacySourcePath.toLowerCase();
  if (path.includes("kevin macleod")) return "likely-incompetech-needs-attribution-confirmation";
  if (path.includes("__")) return "likely-freesound-needs-page-license-confirmation";
  return "needs-source-library-confirmation";
}

function createReviewDomains(items) {
  const domains = new Map();
  for (const item of items) {
    const domainId = `${item.mediaKind}:${item.slotId}`;
    if (!domains.has(domainId)) {
      domains.set(domainId, {
        domainId,
        status: "pending-review",
        publicPromotion: false,
        runtimePromotion: false,
        itemIds: [],
        requiredGates: new Set(),
      });
    }
    const domain = domains.get(domainId);
    domain.itemIds.push(item.itemId);
    for (const gate of item.requiredGates) domain.requiredGates.add(gate);
  }

  return [...domains.values()].map((domain) => ({
    ...domain,
    itemCount: domain.itemIds.length,
    requiredGates: [...domain.requiredGates].sort(),
  })).sort((a, b) => a.domainId.localeCompare(b.domainId));
}

function summarizeReviewItems(items) {
  const bySlotId = {};
  const byMediaKind = {};
  const byCueRole = {};
  for (const item of items) {
    bySlotId[item.slotId] = (bySlotId[item.slotId] ?? 0) + 1;
    byMediaKind[item.mediaKind] = (byMediaKind[item.mediaKind] ?? 0) + 1;
    byCueRole[item.cueRole] = (byCueRole[item.cueRole] ?? 0) + 1;
  }
  return {
    candidates: items.length,
    pendingHumanReview: items.length,
    pendingLicenseReview: items.length,
    approved: 0,
    rejected: 0,
    publicPromoted: 0,
    runtimePromoted: 0,
    totalBytes: items.reduce((sum, item) => sum + item.outputBytes, 0),
    bySlotId,
    byMediaKind,
    byCueRole,
  };
}

function validateInputs({ conversion, registry, reviewItems }) {
  const failures = [];
  expect(conversion.schema === "nexusengine.goldrush.remaining-audio-conversion-report.v1", "invalid-conversion-schema", failures);
  expect(conversion.importJobId === importJobId, "wrong-conversion-job", failures);
  expect(conversion.batchId === batchId, "wrong-conversion-batch", failures);
  expect(conversion.publicPromotion === false, "conversion-must-not-promote-public-assets", failures);
  expect(conversion.runtimePromotion === false, "conversion-must-not-promote-runtime-assets", failures);
  expect((conversion.outputs ?? []).length === 15, "conversion-output-count-must-be-15", failures);
  expect(registry.schema === "nexusengine.goldrush.remaining-audio-sanitized-registry.v1", "invalid-registry-schema", failures);
  expect((registry.assets ?? []).length === reviewItems.length, "registry-review-count-mismatch", failures);
  for (const item of reviewItems) {
    expect(item.reviewStatus === "pending-human-review", `${item.itemId}:review-must-remain-pending`, failures);
    expect(item.licenseStatus === "pending-provenance-review", `${item.itemId}:license-must-remain-pending`, failures);
    expect(item.approvalId === null, `${item.itemId}:approval-id-must-be-null`, failures);
    expect(item.publicPromotion === false, `${item.itemId}:public-promotion-must-be-false`, failures);
    expect(item.runtimePromotion === false, `${item.itemId}:runtime-promotion-must-be-false`, failures);
    expect(!("runtimePath" in item), `${item.itemId}:runtime-path-not-allowed`, failures);
  }
  assert(failures.length === 0, `remaining audio review packet generation invalid: ${failures.join(", ")}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--write") args.write = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relPath) {
  return JSON.parse(readFileSync(join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
}

function writeJson(relPath, value) {
  const absolute = join(repoRoot, normalizeRepoPath(relPath));
  writeSanitizedJsonArtifactSync(absolute, value, { repoRoot });
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
