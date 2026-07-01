import { dirname, join, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const queueId = `${importJobId}.remaining-review-domain-queue`;
const defaultQueuePath = `reports/review-queues/${queueId}.json`;
const reviewSources = [
  {
    sourceId: `${importJobId}.next.001.audio-music-and-sfx`,
    sourceKind: "audio-music-and-sfx",
    humanReview: `reports/human-review/remaining-batches/${importJobId}.next.001.audio-music-and-sfx-request.json`,
    licenseProvenance: `reports/license-provenance/remaining-batches/${importJobId}.next.001.audio-music-and-sfx.json`,
  },
  {
    sourceId: `${importJobId}.remaining-non-audio`,
    sourceKind: "non-audio-remaining-assets",
    humanReview: `reports/human-review/remaining-batches/${importJobId}.remaining-non-audio-request.json`,
    licenseProvenance: `reports/license-provenance/remaining-batches/${importJobId}.remaining-non-audio.json`,
  },
];

export function generateRemainingReviewDomainQueue({
  generatedAt = new Date().toISOString(),
  write = false,
  out = defaultQueuePath,
} = {}) {
  const loadedSources = reviewSources.map(loadReviewSource);
  const domains = loadedSources.flatMap(createQueueDomains);
  const queue = domains
    .map((domain, index) => ({ ...domain, sequence: index + 1 }))
    .sort(compareQueueDomains)
    .map((domain, index) => ({ ...domain, rank: index + 1 }));

  const report = {
    schema: "nexusengine.goldrush.remaining-review-domain-queue.v1",
    version: "0.1.0",
    importJobId,
    queueId,
    generatedAt,
    status: "remaining-review-domain-queue-ready",
    publicPromotion: false,
    runtimePromotion: false,
    sources: loadedSources.map((source) => ({
      sourceId: source.sourceId,
      sourceKind: source.sourceKind,
      humanReview: source.humanReviewPath,
      licenseProvenance: source.licensePath,
      reviewItems: source.reviewItems.length,
      reviewDomains: source.reviewDomains.length,
      pendingHumanReview: source.humanReview.totals?.pendingHumanReview ?? source.reviewItems.length,
      pendingLicenseReview: source.licenseProvenance.totals?.pendingLicenseReview ?? source.licenseItems.length,
    })),
    totals: summarizeQueue(queue, loadedSources),
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      permitsApprovalByQueue: false,
      requiresLicenseProvenanceBeforePromotion: true,
      requiresHumanReviewBeforePromotion: true,
      requiresApprovedRuntimeRecordBeforePromotion: true,
      requiresRuntimeHashValidationBeforePromotion: true,
    },
    queue,
  };

  validateReportShape(report);
  if (write) writeJson(out, report);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = generateRemainingReviewDomainQueue(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId,
    queueId,
    write: args.write,
    queuePath: args.write ? (args.out ?? defaultQueuePath) : null,
    reviewItems: report.totals.reviewItems,
    reviewDomains: report.totals.reviewDomains,
    priority: report.totals.byPriority,
    owners: report.totals.byOwner,
    publicPromotion: false,
    runtimePromotion: false,
  }, { repoRoot }));
}

function loadReviewSource(source) {
  const humanReview = readJson(source.humanReview);
  const licenseProvenance = readJson(source.licenseProvenance);
  return {
    ...source,
    humanReviewPath: source.humanReview,
    licensePath: source.licenseProvenance,
    humanReview,
    licenseProvenance,
    reviewItems: humanReview.items ?? [],
    licenseItems: licenseProvenance.items ?? [],
    reviewDomains: humanReview.reviewDomains ?? [],
  };
}

function createQueueDomains(source) {
  const itemById = new Map(source.reviewItems.map((item) => [item.itemId, item]));
  const licenseById = new Map(source.licenseItems.map((item) => [item.itemId, item]));
  return source.reviewDomains.map((domain, index) => {
    const items = (domain.itemIds ?? []).map((itemId) => itemById.get(itemId)).filter(Boolean);
    const licenses = (domain.itemIds ?? []).map((itemId) => licenseById.get(itemId)).filter(Boolean);
    const sample = items[0] ?? {};
    const profile = classifyDomain({ source, domain, sample, items });
    return {
      queueItemId: `${source.sourceId}.domain.${String(index + 1).padStart(3, "0")}`,
      sourceId: source.sourceId,
      sourceKind: source.sourceKind,
      domainId: domain.domainId,
      slotId: domain.slotId ?? sample.slotId ?? null,
      role: domain.role ?? sample.role ?? sample.cueRole ?? null,
      mediaKind: sample.mediaKind ?? null,
      itemCount: items.length,
      licenseItemCount: licenses.length,
      status: "pending-review",
      priority: profile.priority,
      owner: profile.owner,
      reviewLane: profile.reviewLane,
      publicPromotion: false,
      runtimePromotion: false,
      promotionReady: false,
      blockedBy: [
        "license-provenance",
        "human-review",
        "approved-runtime-record",
        "public-assets-copy",
        "runtime-hash-validation",
      ],
      requiredEvidence: profile.requiredEvidence,
      sourceItemIds: domain.itemIds ?? [],
      sampleOutputs: items.slice(0, 5).map((item) => ({
        itemId: item.itemId,
        outputKind: item.outputKind,
        outputPath: item.outputPath,
        sourcePath: item.sourcePath ?? item.legacySourcePath,
        sourceRawPath: item.sourceRawPath,
      })),
    };
  });
}

function classifyDomain({ source, domain, sample, items }) {
  const text = [
    source.sourceKind,
    domain.domainId,
    domain.role,
    sample.role,
    sample.slotId,
    sample.mediaKind,
    sample.outputKind,
    sample.conversionStatus,
  ].filter(Boolean).join(" ").toLowerCase();
  const requiredEvidence = [
    "source-page-or-repo-evidence",
    "license-terms",
    "human-review-decision",
    "approved-runtime-record",
    "public-asset-hash",
  ];

  if (source.sourceKind === "audio-music-and-sfx") {
    return {
      priority: text.includes("title") || text.includes("combat") ? "P0" : "P1",
      owner: "audio-licensing",
      reviewLane: "audio-identity-license",
      requiredEvidence: [...requiredEvidence, "attribution-text", "cue-role-confirmation"],
    };
  }

  if (text.includes("character") || text.includes("player") || text.includes("weapon") || text.includes("animation") || text.includes("revolver")) {
    return {
      priority: "P0",
      owner: "character-combat-art",
      reviewLane: "character-combat-runtime",
      requiredEvidence: [...requiredEvidence, "rig-or-animation-review", "scale-origin-review"],
    };
  }

  if (text.includes("terrain-source") || text.includes("terrain asset")) {
    return {
      priority: "P0",
      owner: "world-technical-art",
      reviewLane: "terrain-source-interpretation",
      requiredEvidence: [...requiredEvidence, "heightfield-interpretation", "collider-policy"],
    };
  }

  if (text.includes("external-conversion") || items.some((item) => item.outputKind === "external-conversion-request")) {
    return {
      priority: "P1",
      owner: "environment-model-art",
      reviewLane: "model-glb-conversion",
      requiredEvidence: [...requiredEvidence, "glb-conversion", "lod-policy", "collider-policy"],
    };
  }

  if (text.includes("material") || text.includes("texture")) {
    return {
      priority: text.includes("train") || text.includes("town") || text.includes("rock") ? "P1" : "P2",
      owner: "environment-material-art",
      reviewLane: "pbr-material-review",
      requiredEvidence: [...requiredEvidence, "pbr-material-map", "color-space-policy"],
    };
  }

  if (text.includes("manual-review")) {
    return {
      priority: "P3",
      owner: "content-review",
      reviewLane: "manual-triage",
      requiredEvidence,
    };
  }

  return {
    priority: "P2",
    owner: "environment-art",
    reviewLane: "asset-role-review",
    requiredEvidence,
  };
}

function summarizeQueue(queue, loadedSources) {
  const byPriority = {};
  const byOwner = {};
  const byLane = {};
  const bySourceKind = {};
  for (const item of queue) {
    byPriority[item.priority] = (byPriority[item.priority] ?? 0) + 1;
    byOwner[item.owner] = (byOwner[item.owner] ?? 0) + 1;
    byLane[item.reviewLane] = (byLane[item.reviewLane] ?? 0) + 1;
    bySourceKind[item.sourceKind] = (bySourceKind[item.sourceKind] ?? 0) + 1;
  }
  return {
    reviewItems: loadedSources.reduce((sum, source) => sum + source.reviewItems.length, 0),
    licenseItems: loadedSources.reduce((sum, source) => sum + source.licenseItems.length, 0),
    reviewDomains: queue.length,
    pendingHumanReview: loadedSources.reduce((sum, source) => sum + (source.humanReview.totals?.pendingHumanReview ?? source.reviewItems.length), 0),
    pendingLicenseReview: loadedSources.reduce((sum, source) => sum + (source.licenseProvenance.totals?.pendingLicenseReview ?? source.licenseItems.length), 0),
    approved: 0,
    publicPromoted: 0,
    runtimePromoted: 0,
    byPriority,
    byOwner,
    byLane,
    bySourceKind,
  };
}

function compareQueueDomains(a, b) {
  const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)
    || b.itemCount - a.itemCount
    || a.sourceKind.localeCompare(b.sourceKind)
    || a.domainId.localeCompare(b.domainId);
}

function validateReportShape(report) {
  const failures = [];
  expect(report.publicPromotion === false, "queue-must-not-promote-public", failures);
  expect(report.runtimePromotion === false, "queue-must-not-promote-runtime", failures);
  expect(report.totals.reviewItems === 737, "queue-review-items-must-be-737", failures);
  expect(report.totals.licenseItems === 737, "queue-license-items-must-be-737", failures);
  expect(report.totals.reviewDomains === 43, "queue-domains-must-be-43", failures);
  expect(report.totals.pendingHumanReview === 737, "queue-human-review-pending-must-be-737", failures);
  expect(report.totals.pendingLicenseReview === 737, "queue-license-review-pending-must-be-737", failures);
  expect(report.totals.approved === 0, "queue-approved-must-be-zero", failures);
  for (const item of report.queue) {
    expect(["P0", "P1", "P2", "P3"].includes(item.priority), `${item.queueItemId}:invalid-priority`, failures);
    expect(Boolean(item.owner), `${item.queueItemId}:missing-owner`, failures);
    expect(Boolean(item.reviewLane), `${item.queueItemId}:missing-review-lane`, failures);
    expect(item.status === "pending-review", `${item.queueItemId}:status-must-be-pending`, failures);
    expect(item.publicPromotion === false, `${item.queueItemId}:public-promotion-must-be-false`, failures);
    expect(item.runtimePromotion === false, `${item.queueItemId}:runtime-promotion-must-be-false`, failures);
    expect(item.promotionReady === false, `${item.queueItemId}:promotion-ready-must-be-false`, failures);
    expect(item.blockedBy.includes("license-provenance"), `${item.queueItemId}:missing-license-blocker`, failures);
    expect(item.blockedBy.includes("human-review"), `${item.queueItemId}:missing-human-review-blocker`, failures);
    expect(item.blockedBy.includes("approved-runtime-record"), `${item.queueItemId}:missing-runtime-record-blocker`, failures);
    expect(item.itemCount === item.sourceItemIds.length, `${item.queueItemId}:item-count-mismatch`, failures);
  }
  assert(failures.length === 0, `remaining review domain queue invalid: ${failures.join(", ")}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--out") args.out = argv[++index];
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
