import { dirname, join, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const packetId = `${importJobId}.remaining-non-audio`;
const humanReviewPath = `reports/human-review/remaining-batches/${packetId}-request.json`;
const licenseProvenancePath = `reports/license-provenance/remaining-batches/${packetId}.json`;
const sources = [
  {
    sourceId: `${importJobId}.next.002.player-combat-character`,
    sourceKind: "player-combat-character",
    conversionReport: `reports/conversion/remaining-batches/${importJobId}.next.002.player-combat-character.json`,
    sanitizedRegistry: `sanitized/registry/remaining-batches/${importJobId}.next.002.player-combat-character.json`,
  },
  {
    sourceId: `${importJobId}.next.003.mine-town-terrain-props`,
    sourceKind: "mine-town-terrain-textures",
    conversionReport: `reports/conversion/remaining-batches/${importJobId}.next.003.mine-town-terrain-props.json`,
    sanitizedRegistry: `sanitized/registry/remaining-batches/${importJobId}.next.003.mine-town-terrain-props.json`,
  },
  {
    sourceId: `${importJobId}.next.004.mine-town-terrain-props`,
    sourceKind: "mine-town-terrain-prop-models",
    conversionReport: `reports/conversion/remaining-batches/${importJobId}.next.004.mine-town-terrain-props.json`,
    sanitizedRegistry: `sanitized/registry/remaining-batches/${importJobId}.next.004.mine-town-terrain-props.json`,
  },
  {
    sourceId: `${importJobId}.next.005-008.mine-town-terrain-props-source-metadata`,
    sourceKind: "mine-town-terrain-source-metadata",
    conversionReport: `reports/conversion/remaining-batches/${importJobId}.next.005-008.mine-town-terrain-props-source-metadata.json`,
    sanitizedRegistry: `sanitized/registry/remaining-batches/${importJobId}.next.005-008.mine-town-terrain-props-source-metadata.json`,
  },
];

export function createRemainingNonAudioReviewPackets({
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const loadedSources = sources.map(loadSource);
  const reviewItems = loadedSources.flatMap((source) => (
    (source.conversion.outputs ?? []).map((output, index) => createReviewItem(source, output, index))
  ));
  const totals = summarizeReviewItems(reviewItems);
  const sharedRules = {
    writesPublicAssets: false,
    promotesRuntimeAssets: false,
    requiresHumanReviewBeforePromotion: true,
    requiresLicenseProvenanceBeforePromotion: true,
    requiresApprovedRuntimeRecordBeforePromotion: true,
    allowsApprovalByInference: false,
    batchScopedDoesNotModifyFirst31Gate: true,
  };

  validateInputs({ loadedSources, reviewItems });

  const evidence = {
    sources: loadedSources.map((source) => ({
      sourceId: source.sourceId,
      sourceKind: source.sourceKind,
      conversionReport: source.conversionReport,
      sanitizedRegistry: source.sanitizedRegistry,
      sourceReceipts: source.conversion.sourceReceipts ?? {},
    })),
  };

  const licenseProvenance = {
    schema: "nexusengine.goldrush.remaining-non-audio-license-provenance.v1",
    version: "0.1.0",
    importJobId,
    packetId,
    generatedAt,
    status: "pending-license-provenance-review",
    publicPromotion: false,
    runtimePromotion: false,
    evidence,
    rules: sharedRules,
    totals,
    licenseResearch: {
      status: "needs-source-level-confirmation",
      notes: [
        "SPDX identifiers help normalize license names, but a standardized id is not proof that a copied asset is licensed for this game.",
        "Creative Commons assets can carry attribution, share-alike, non-commercial, or no-derivatives conditions that must be checked against public game deployment.",
        "Open Source Initiative approval is software-license oriented and does not automatically cover art, audio, model, texture, or Unity asset redistribution.",
        "Each promoted asset still needs source-page evidence, license terms, attribution requirements, reviewer approval, and approved runtime hash records.",
      ],
      references: [
        "https://spdx.org/licenses/",
        "https://creativecommons.org/cc-licenses/",
        "https://opensource.org/licenses",
      ],
    },
    items: reviewItems.map((item) => ({
      itemId: item.itemId,
      sourceId: item.sourceId,
      slotId: item.slotId,
      role: item.role,
      mediaKind: item.mediaKind,
      sourcePath: item.sourcePath,
      sourceRawPath: item.sourceRawPath,
      sourceHash: item.sourceHash,
      outputKind: item.outputKind,
      outputPath: item.outputPath,
      outputHash: item.outputHash,
      licenseStatus: "pending-provenance-review",
      licenseEvidenceStatus: classifyLicenseEvidenceStatus(item),
      approvalId: null,
      attributionRequired: null,
      attributionText: null,
      publicPromotion: false,
      runtimePromotion: false,
      promotionBlockedBy: [
        "source-level-license-provenance",
        "human-review",
        "approved-runtime-record",
      ],
    })),
  };

  const humanReview = {
    schema: "nexusengine.goldrush.remaining-non-audio-human-review-request.v1",
    version: "0.1.0",
    importJobId,
    packetId,
    generatedAt,
    status: "pending-human-review",
    publicPromotion: false,
    runtimePromotion: false,
    evidence: {
      ...evidence,
      licenseProvenance: licenseProvenancePath,
    },
    rules: sharedRules,
    totals,
    reviewDomains: createReviewDomains(reviewItems),
    items: reviewItems,
    requiredDecision: {
      decisionType: "explicit-source-asset-approval-or-rejection",
      reviewerMustConfirm: [
        "source identity matches intended Gold Rush legacy content",
        "license/provenance allows public browser game deployment",
        "required attribution text is captured before promotion",
        "content role is correct for player, combat, prop, material, terrain, or reject-only use",
        "model sources have a future GLB/glTF conversion plan before runtime promotion",
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
  const packets = createRemainingNonAudioReviewPackets(args);
  console.log(sanitizedConsoleJson({
    status: "remaining-non-audio-review-packets-ready",
    importJobId,
    packetId,
    write: args.write,
    humanReview: args.write ? humanReviewPath : null,
    licenseProvenance: args.write ? licenseProvenancePath : null,
    reviewItems: packets.humanReview.items.length,
    domains: packets.humanReview.reviewDomains.length,
    publicPromotion: packets.humanReview.publicPromotion,
    runtimePromotion: packets.humanReview.runtimePromotion,
  }, { repoRoot }));
}

function loadSource(source) {
  const conversion = readJson(source.conversionReport);
  const registry = readJson(source.sanitizedRegistry);
  return { ...source, conversion, registry };
}

function createReviewItem(source, output, index) {
  const role = output.role ?? output.handling ?? output.mediaKind ?? output.outputKind;
  return {
    itemId: `${source.sourceId}.review.${String(index + 1).padStart(3, "0")}`,
    sourceId: source.sourceId,
    sourceKind: source.sourceKind,
    batchId: output.batchId ?? source.conversion.batchId ?? null,
    slotId: output.slotId,
    role,
    mediaKind: output.mediaKind ?? inferMediaKind(output),
    sourcePath: output.sourcePath,
    sourceRawPath: output.sourceRawPath,
    sourceHash: output.sourceHash,
    sourceBytes: output.sourceBytes,
    sourceExtension: output.sourceExtension,
    outputKind: output.outputKind,
    outputPath: output.outputPath,
    outputHash: output.outputHash,
    outputBytes: output.outputBytes,
    conversionStatus: output.conversionStatus,
    reviewStatus: "pending-human-review",
    licenseStatus: "pending-provenance-review",
    approvalId: null,
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: false,
    requiredGates: normalizeGates(output.promoteOnlyAfter),
  };
}

function inferMediaKind(output) {
  if (output.outputKind?.includes("texture")) return "texture";
  if (output.outputKind?.includes("material")) return "material";
  if (output.outputKind?.includes("terrain")) return "terrain-source";
  if (output.outputKind?.includes("metadata")) return "unity-metadata";
  if (output.outputKind?.includes("external-conversion")) return "model-source";
  return output.sourceExtension?.replace(".", "") || "source";
}

function normalizeGates(existing = []) {
  return [...new Set([
    ...existing,
    "license-provenance",
    "human-review",
    "approved-runtime-record",
    "explicit-human-approval",
  ])].sort();
}

function classifyLicenseEvidenceStatus(item) {
  if (item.outputKind === "external-conversion-request") return "needs-model-source-license-confirmation";
  if (item.outputKind?.includes("metadata")) return "needs-unity-source-license-confirmation";
  if (item.mediaKind === "texture") return "needs-texture-source-license-confirmation";
  return "needs-source-license-confirmation";
}

function createReviewDomains(items) {
  const domains = new Map();
  for (const item of items) {
    const domainId = `${item.sourceKind}:${item.slotId}:${item.role}`;
    if (!domains.has(domainId)) {
      domains.set(domainId, {
        domainId,
        sourceKind: item.sourceKind,
        slotId: item.slotId,
        role: item.role,
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
  const bySourceKind = {};
  const bySlotId = {};
  const byMediaKind = {};
  const byOutputKind = {};
  const byRole = {};
  for (const item of items) {
    bySourceKind[item.sourceKind] = (bySourceKind[item.sourceKind] ?? 0) + 1;
    bySlotId[item.slotId] = (bySlotId[item.slotId] ?? 0) + 1;
    byMediaKind[item.mediaKind] = (byMediaKind[item.mediaKind] ?? 0) + 1;
    byOutputKind[item.outputKind] = (byOutputKind[item.outputKind] ?? 0) + 1;
    byRole[item.role] = (byRole[item.role] ?? 0) + 1;
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
    bySourceKind,
    bySlotId,
    byMediaKind,
    byOutputKind,
    byRole,
  };
}

function validateInputs({ loadedSources, reviewItems }) {
  const failures = [];
  for (const source of loadedSources) {
    expect(source.conversion.importJobId === importJobId, `${source.sourceId}:wrong-conversion-job`, failures);
    expect(source.conversion.publicPromotion === false, `${source.sourceId}:conversion-must-not-promote-public-assets`, failures);
    expect(source.conversion.runtimePromotion === false, `${source.sourceId}:conversion-must-not-promote-runtime-assets`, failures);
    expect((source.conversion.outputs ?? []).length > 0, `${source.sourceId}:conversion-must-have-outputs`, failures);
    expect((source.registry.assets ?? []).length === (source.conversion.outputs ?? []).length, `${source.sourceId}:registry-output-count-mismatch`, failures);
  }
  for (const item of reviewItems) {
    expect(item.reviewStatus === "pending-human-review", `${item.itemId}:review-must-remain-pending`, failures);
    expect(item.licenseStatus === "pending-provenance-review", `${item.itemId}:license-must-remain-pending`, failures);
    expect(item.approvalId === null, `${item.itemId}:approval-id-must-be-null`, failures);
    expect(item.publicPromotion === false, `${item.itemId}:public-promotion-must-be-false`, failures);
    expect(item.runtimePromotion === false, `${item.itemId}:runtime-promotion-must-be-false`, failures);
    expect(!("runtimePath" in item), `${item.itemId}:runtime-path-not-allowed`, failures);
  }
  assert(failures.length === 0, `remaining non-audio review packet generation invalid: ${failures.join(", ")}`);
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
  writeSanitizedJsonArtifactSync(join(repoRoot, normalizeRepoPath(relPath)), value, { repoRoot });
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
