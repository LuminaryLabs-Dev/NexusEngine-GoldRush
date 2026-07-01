import { dirname, join, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const conversionReportPath = `reports/conversion/${importJobId}.json`;
const sourceDiscoveryPath = `reports/provenance/${importJobId}-source-discovery.json`;
const copyLedgerPath = `reports/provenance/${importJobId}-copy-ledger.json`;
const hashManifestPath = `reports/provenance/${importJobId}-hashes.json`;
const classificationPath = `reports/asset-classification/${importJobId}-classification.json`;
const humanReviewPath = `reports/human-review/${importJobId}-request.json`;
const licenseProvenancePath = `reports/license-provenance/${importJobId}.json`;

export function createGoldRushReviewPackets({
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const conversion = readJson(conversionReportPath);
  const sourceDiscovery = readJson(sourceDiscoveryPath);
  const copyLedger = readJson(copyLedgerPath);
  const hashManifest = readJson(hashManifestPath);
  const classification = readJson(classificationPath);

  const reviewItems = (conversion.outputs ?? []).map((output, index) => createReviewItem(output, index));
  const totals = summarizeReviewItems(reviewItems);
  const source = {
    repository: sourceDiscovery.source?.nameWithOwner,
    branch: sourceDiscovery.source?.branch,
    commit: sourceDiscovery.source?.commitSha,
    roots: sourceDiscovery.source?.roots ?? [],
    importJobId,
  };

  const sharedRules = {
    writesPublicAssets: false,
    promotesRuntimeAssets: false,
    requiresHumanReviewBeforePromotion: true,
    requiresLicenseProvenanceBeforePromotion: true,
    requiresApprovedRuntimeRecordBeforePromotion: true,
    allowsApprovalByInference: false,
  };

  const licenseProvenance = {
    schema: "nexusengine.goldrush.license-provenance.v1",
    version: "0.1.0",
    importJobId,
    generatedAt,
    status: "pending-license-provenance-review",
    publicPromotion: false,
    runtimePromotion: false,
    source,
    evidence: {
      sourceDiscovery: sourceDiscoveryPath,
      copyLedger: copyLedgerPath,
      hashManifest: hashManifestPath,
      classification: classificationPath,
      conversionReport: conversionReportPath,
    },
    rules: sharedRules,
    totals,
    items: reviewItems.map((item) => ({
      itemId: item.itemId,
      slotId: item.slotId,
      mediaKind: item.mediaKind,
      sourcePath: item.sourcePath,
      sourceHash: item.sourceHash,
      outputPath: item.outputPath,
      outputHash: item.outputHash,
      licenseStatus: "pending-provenance-review",
      approvalId: null,
      publicPromotion: false,
      runtimePromotion: false,
      promotionBlockedBy: [
        "license-provenance",
        "human-review",
        "approved-runtime-record",
      ],
    })),
  };

  const humanReview = {
    schema: "nexusengine.goldrush.human-review-request.v1",
    version: "0.1.0",
    importJobId,
    generatedAt,
    status: "pending-human-review",
    publicPromotion: false,
    runtimePromotion: false,
    source,
    evidence: {
      sourceDiscovery: sourceDiscoveryPath,
      copyLedger: copyLedgerPath,
      hashManifest: hashManifestPath,
      classification: classificationPath,
      conversionReport: conversionReportPath,
      licenseProvenance: licenseProvenancePath,
    },
    rules: sharedRules,
    totals,
    reviewDomains: createReviewDomains(reviewItems),
    items: reviewItems,
    requiredDecision: {
      decisionType: "explicit-human-approval-or-rejection",
      reviewerMustConfirm: [
        "source asset identity matches intended Gold Rush legacy item",
        "license/provenance is acceptable for public browser deployment",
        "sanitized output is sufficient for runtime use or needs more conversion",
        "runtime path, if later assigned, stays under public/assets",
        "approval id is unique and traceable",
      ],
      mayPromoteAfter: [
        "licenseStatus is approved",
        "humanReviewStatus is approved",
        "approvalId is present",
        "approved runtime record validates",
        "public asset file exists and hash matches",
      ],
    },
  };

  validateInputs({ conversion, sourceDiscovery, copyLedger, hashManifest, classification, reviewItems });

  if (write) {
    writeJson(licenseProvenancePath, licenseProvenance);
    writeJson(humanReviewPath, humanReview);
  }

  return {
    humanReview,
    licenseProvenance,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const packets = createGoldRushReviewPackets(args);
  console.log(sanitizedConsoleJson({
    status: "review-packets-ready",
    importJobId,
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
  const conversionGate = output.conversionStatus === "requires-external-conversion"
    ? "external-model-conversion"
    : output.conversionStatus === "metadata-extracted"
      ? "layout-or-animation-review"
      : "asset-identity-review";

  return {
    itemId: `${importJobId}.review.${String(index + 1).padStart(3, "0")}`,
    slotId: output.slotId,
    mediaKind: output.mediaKind,
    sourcePath: output.sourcePath,
    sourceHash: output.sourceHash,
    outputKind: output.outputKind,
    outputPath: output.outputPath,
    outputHash: output.outputHash,
    conversionStatus: output.conversionStatus,
    reviewStatus: "pending-human-review",
    licenseStatus: "pending-provenance-review",
    approvalId: null,
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: false,
    requiredGates: [
      ...new Set([
        conversionGate,
        ...(output.promoteOnlyAfter ?? []),
        "explicit-human-approval",
        "approved-runtime-record",
      ]),
    ],
  };
}

function createReviewDomains(items) {
  const domains = new Map();
  for (const item of items) {
    const domainId = getReviewDomainId(item);
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

function getReviewDomainId(item) {
  if (item.conversionStatus === "requires-external-conversion") return "external-conversion";
  if (item.outputKind === "metadata") return "unity-metadata";
  if (item.outputKind === "audio") return "audio";
  if (item.outputKind === "textures") return "textures";
  return "review-only";
}

function summarizeReviewItems(items) {
  const byStatus = {};
  const byOutputKind = {};
  const byMediaKind = {};
  for (const item of items) {
    byStatus[item.conversionStatus] = (byStatus[item.conversionStatus] ?? 0) + 1;
    byOutputKind[item.outputKind] = (byOutputKind[item.outputKind] ?? 0) + 1;
    byMediaKind[item.mediaKind] = (byMediaKind[item.mediaKind] ?? 0) + 1;
  }
  return {
    candidates: items.length,
    pendingHumanReview: items.length,
    pendingLicenseReview: items.length,
    approved: 0,
    rejected: 0,
    publicPromoted: 0,
    runtimePromoted: 0,
    byStatus,
    byOutputKind,
    byMediaKind,
  };
}

function validateInputs({ conversion, sourceDiscovery, copyLedger, hashManifest, classification, reviewItems }) {
  const failures = [];
  expect(conversion.schema === "nexusengine.goldrush.conversion-report.v1", "invalid-conversion-schema", failures);
  expect(conversion.importJobId === importJobId, "wrong-conversion-job", failures);
  expect(conversion.publicPromotion === false, "conversion-must-not-promote-public-assets", failures);
  expect((conversion.outputs ?? []).length === reviewItems.length, "review-item-count-mismatch", failures);
  expect(sourceDiscovery.importJobId === importJobId, "wrong-source-discovery-job", failures);
  expect(Array.isArray(copyLedger.copiedFiles) && copyLedger.copiedFiles.length === reviewItems.length, "copy-ledger-count-mismatch", failures);
  expect(Array.isArray(hashManifest.files) && hashManifest.files.length === reviewItems.length, "hash-manifest-count-mismatch", failures);
  expect(Array.isArray(classification.candidates) && classification.candidates.length === reviewItems.length, "classification-count-mismatch", failures);
  for (const item of reviewItems) {
    expect(item.reviewStatus === "pending-human-review", `${item.itemId}:review-must-remain-pending`, failures);
    expect(item.licenseStatus === "pending-provenance-review", `${item.itemId}:license-must-remain-pending`, failures);
    expect(item.approvalId === null, `${item.itemId}:approval-id-must-be-null`, failures);
    expect(item.publicPromotion === false, `${item.itemId}:public-promotion-must-be-false`, failures);
    expect(item.runtimePromotion === false, `${item.itemId}:runtime-promotion-must-be-false`, failures);
    expect(!("runtimePath" in item), `${item.itemId}:runtime-path-not-allowed`, failures);
  }
  assert(failures.length === 0, `review packet generation invalid: ${failures.join(", ")}`);
}

function parseArgs(args) {
  return {
    write: args.includes("--write"),
  };
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const absolutePath = join(repoRoot, relativePath);
  writeSanitizedJsonArtifactSync(absolutePath, value, { repoRoot });
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
