import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const queueId = `${importJobId}.remaining-review-domain-queue`;
const queuePath = `reports/review-queues/${queueId}.json`;
const defaultOutDir = `reports/approval-decisions/${importJobId}`;

export function generateApprovalDecisionPackets({
  generatedAt = new Date().toISOString(),
  write = false,
  outDir = defaultOutDir,
} = {}) {
  const queueReport = readJson(queuePath);
  validateQueueReport(queueReport);

  const sourceContexts = queueReport.sources.map(loadSourceContext);
  const itemContextById = new Map();
  for (const context of sourceContexts) {
    for (const reviewItem of context.reviewItems) {
      const licenseItem = context.licenseByItemId.get(reviewItem.itemId);
      itemContextById.set(reviewItem.itemId, { context, reviewItem, licenseItem });
    }
  }

  const ownerPackets = groupQueueByOwner(queueReport.queue).map(([owner, queueItems], index) => {
    const packet = createOwnerPacket({
      generatedAt,
      owner,
      queueItems,
      itemContextById,
      sequence: index + 1,
    });
    validateOwnerPacket(packet);
    return packet;
  });

  const index = createIndex({ generatedAt, ownerPackets });
  validateIndex(index, ownerPackets);

  if (write) {
    for (const packet of ownerPackets) {
      writeSanitizedJsonArtifactSync(
        path.join(repoRoot, normalizeRepoPath(outDir), `${packet.ownerPacketId}.json`),
        packet,
        { repoRoot },
      );
    }
    writeSanitizedJsonArtifactSync(
      path.join(repoRoot, normalizeRepoPath(outDir), "index.json"),
      index,
      { repoRoot },
    );
  }

  return { index, ownerPackets };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const { index } = generateApprovalDecisionPackets(args);
  console.log(sanitizedConsoleJson({
    status: index.status,
    importJobId,
    write: args.write,
    outDir: args.write ? (args.outDir ?? defaultOutDir) : null,
    ownerPackets: index.totals.ownerPackets,
    reviewDomains: index.totals.reviewDomains,
    reviewItems: index.totals.reviewItems,
    pendingHumanReview: index.totals.pendingHumanReview,
    pendingLicenseReview: index.totals.pendingLicenseReview,
    approved: index.totals.approved,
    publicPromotion: false,
    runtimePromotion: false,
  }, { repoRoot }));
}

function createOwnerPacket({ generatedAt, owner, queueItems, itemContextById, sequence }) {
  const ownerPacketId = `${importJobId}.approval-decision.${owner}`;
  const domains = queueItems.map((queueItem) => {
    const itemContexts = queueItem.sourceItemIds.map((itemId) => itemContextById.get(itemId));
    assert(itemContexts.every(Boolean), `${queueItem.queueItemId}:missing-item-context`);
    return {
      queueItemId: queueItem.queueItemId,
      domainId: queueItem.domainId,
      sourceId: queueItem.sourceId,
      sourceKind: queueItem.sourceKind,
      slotId: queueItem.slotId,
      role: queueItem.role,
      mediaKind: queueItem.mediaKind,
      priority: queueItem.priority,
      reviewLane: queueItem.reviewLane,
      status: "pending-review",
      publicPromotion: false,
      runtimePromotion: false,
      promotionReady: false,
      blockedBy: queueItem.blockedBy,
      requiredEvidence: queueItem.requiredEvidence,
      itemCount: itemContexts.length,
      items: itemContexts.map(({ context, reviewItem, licenseItem }) => createDecisionItem({
        context,
        reviewItem,
        licenseItem,
        queueItem,
      })),
    };
  });

  const totals = summarizeDomains(domains);
  return {
    schema: "nexusengine.goldrush.approval-decision-packet.v1",
    version: "0.1.0",
    importJobId,
    queueId,
    ownerPacketId,
    generatedAt,
    sequence,
    owner,
    status: "pending-approval-decisions",
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: false,
    sources: unique(domains.map((domain) => domain.sourceId)).map((sourceId) => {
      const source = domains.find((domain) => domain.sourceId === sourceId);
      return {
        sourceId,
        sourceKind: source.sourceKind,
        humanReview: itemContextById.get(source.items[0].itemId)?.context.humanReviewPath,
        licenseProvenance: itemContextById.get(source.items[0].itemId)?.context.licensePath,
      };
    }),
    totals,
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      packetIsReviewInputOnly: true,
      decisionDefaultsToPending: true,
      approvalRequiresHumanDecision: true,
      approvalRequiresLicenseDecision: true,
      approvalRequiresMatchingApprovalId: true,
      approvalRequiresAttributionWhenRequired: true,
      approvalRequiresRuntimePromotionPlanner: true,
      runtimePathsAreForbiddenInDecisionPackets: true,
    },
    reviewerInstructions: [
      "Fill decision fields only after source identity, license terms, and attribution have been checked.",
      "Use rejected for assets that cannot be shipped or cannot be identified.",
      "Do not add runtimePath or public assets here; promotion is handled only by the approved runtime promotion planner.",
      "Use the same approvalId in humanDecision and licenseDecision only when both sides are approved.",
    ],
    domains,
  };
}

function createDecisionItem({ context, reviewItem, licenseItem, queueItem }) {
  const licenseBlockedBy = licenseItem?.promotionBlockedBy ?? [];
  return {
    itemId: reviewItem.itemId,
    queueItemId: queueItem.queueItemId,
    sourceId: context.sourceId,
    sourceKind: context.sourceKind,
    batchId: reviewItem.batchId ?? context.batchId ?? null,
    slotId: reviewItem.slotId,
    role: reviewItem.role ?? reviewItem.cueRole ?? null,
    mediaKind: reviewItem.mediaKind,
    outputKind: reviewItem.outputKind,
    conversionStatus: reviewItem.conversionStatus,
    sourcePath: reviewItem.sourcePath ?? reviewItem.legacySourcePath,
    sourceRawPath: reviewItem.sourceRawPath ?? null,
    sourceHash: reviewItem.sourceHash,
    sourceBytes: reviewItem.sourceBytes ?? null,
    outputPath: reviewItem.outputPath,
    outputHash: reviewItem.outputHash,
    outputBytes: reviewItem.outputBytes ?? null,
    mediaType: reviewItem.mediaType ?? null,
    currentReviewStatus: reviewItem.reviewStatus,
    currentLicenseStatus: licenseItem?.licenseStatus ?? reviewItem.licenseStatus,
    licenseEvidenceStatus: licenseItem?.licenseEvidenceStatus ?? null,
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: false,
    promotionBlockedBy: unique([
      ...(reviewItem.requiredGates ?? []),
      ...licenseBlockedBy,
      "human-decision-pending",
      "license-decision-pending",
      "approved-runtime-promotion-planner",
    ]),
    reviewerDecision: {
      humanDecision: "pending",
      licenseDecision: "pending",
      approvalId: null,
      attributionRequired: licenseItem?.attributionRequired ?? null,
      attributionText: licenseItem?.attributionText ?? null,
      sourceEvidenceUrl: null,
      licenseIdentifier: null,
      reviewerNotes: null,
    },
  };
}

function createIndex({ generatedAt, ownerPackets }) {
  const packetRefs = ownerPackets.map((packet) => ({
    ownerPacketId: packet.ownerPacketId,
    owner: packet.owner,
    packetPath: `${defaultOutDir}/${packet.ownerPacketId}.json`,
    reviewDomains: packet.totals.reviewDomains,
    reviewItems: packet.totals.reviewItems,
    priority: packet.totals.byPriority,
    status: packet.status,
    publicPromotion: false,
    runtimePromotion: false,
  }));
  return {
    schema: "nexusengine.goldrush.approval-decision-packet-index.v1",
    version: "0.1.0",
    importJobId,
    queueId,
    generatedAt,
    status: "approval-decision-packets-ready",
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: false,
    totals: summarizePackets(ownerPackets),
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      packetCountMustMatchReviewOwners: true,
      packetsDefaultToPending: true,
      approvalRequiresPromotionPlanner: true,
      runtimePathsAreForbiddenInDecisionPackets: true,
    },
    packetRefs,
  };
}

function loadSourceContext(source) {
  const humanReviewPath = normalizeRepoPath(source.humanReview);
  const licensePath = normalizeRepoPath(source.licenseProvenance);
  const humanReview = readJson(humanReviewPath);
  const licenseProvenance = readJson(licensePath);
  const licenseByItemId = new Map((licenseProvenance.items ?? []).map((item) => [item.itemId, item]));
  return {
    sourceId: source.sourceId,
    sourceKind: source.sourceKind,
    batchId: humanReview.batchId ?? humanReview.packetId ?? null,
    humanReviewPath,
    licensePath,
    humanReview,
    licenseProvenance,
    reviewItems: humanReview.items ?? [],
    licenseItems: licenseProvenance.items ?? [],
    licenseByItemId,
  };
}

function summarizeDomains(domains) {
  const byPriority = {};
  const bySourceKind = {};
  const byReviewLane = {};
  let reviewItems = 0;
  for (const domain of domains) {
    byPriority[domain.priority] = (byPriority[domain.priority] ?? 0) + 1;
    bySourceKind[domain.sourceKind] = (bySourceKind[domain.sourceKind] ?? 0) + 1;
    byReviewLane[domain.reviewLane] = (byReviewLane[domain.reviewLane] ?? 0) + 1;
    reviewItems += domain.itemCount;
  }
  return {
    reviewDomains: domains.length,
    reviewItems,
    pendingHumanReview: reviewItems,
    pendingLicenseReview: reviewItems,
    approved: 0,
    rejected: 0,
    publicPromoted: 0,
    runtimePromoted: 0,
    byPriority,
    bySourceKind,
    byReviewLane,
  };
}

function summarizePackets(ownerPackets) {
  const byOwner = {};
  const byPriority = {};
  let reviewDomains = 0;
  let reviewItems = 0;
  for (const packet of ownerPackets) {
    byOwner[packet.owner] = {
      reviewDomains: packet.totals.reviewDomains,
      reviewItems: packet.totals.reviewItems,
    };
    reviewDomains += packet.totals.reviewDomains;
    reviewItems += packet.totals.reviewItems;
    for (const [priority, count] of Object.entries(packet.totals.byPriority)) {
      byPriority[priority] = (byPriority[priority] ?? 0) + count;
    }
  }
  return {
    ownerPackets: ownerPackets.length,
    reviewDomains,
    reviewItems,
    pendingHumanReview: reviewItems,
    pendingLicenseReview: reviewItems,
    approved: 0,
    rejected: 0,
    publicPromoted: 0,
    runtimePromoted: 0,
    byOwner,
    byPriority,
  };
}

function validateQueueReport(report) {
  const failures = [];
  expect(report.schema === "nexusengine.goldrush.remaining-review-domain-queue.v1", "invalid-queue-schema", failures);
  expect(report.importJobId === importJobId, "wrong-import-job", failures);
  expect(report.queueId === queueId, "wrong-queue-id", failures);
  expect(report.publicPromotion === false, "queue-public-promotion-must-be-false", failures);
  expect(report.runtimePromotion === false, "queue-runtime-promotion-must-be-false", failures);
  expect((report.queue ?? []).length === 43, "queue-domain-count-must-be-43", failures);
  expect(report.totals?.reviewItems === 737, "queue-review-items-must-be-737", failures);
  assert(failures.length === 0, `approval decision packet queue invalid: ${failures.join(", ")}`);
}

function validateOwnerPacket(packet) {
  const failures = [];
  expect(packet.schema === "nexusengine.goldrush.approval-decision-packet.v1", `${packet.owner}:invalid-schema`, failures);
  expect(packet.publicPromotion === false, `${packet.owner}:public-promotion-must-be-false`, failures);
  expect(packet.runtimePromotion === false, `${packet.owner}:runtime-promotion-must-be-false`, failures);
  expect(packet.totals.approved === 0, `${packet.owner}:approved-must-be-zero`, failures);
  expect(packet.totals.reviewItems > 0, `${packet.owner}:must-have-items`, failures);
  for (const domain of packet.domains) {
    expect(domain.status === "pending-review", `${domain.queueItemId}:domain-status-must-be-pending`, failures);
    expect(domain.publicPromotion === false, `${domain.queueItemId}:domain-public-promotion-must-be-false`, failures);
    expect(domain.runtimePromotion === false, `${domain.queueItemId}:domain-runtime-promotion-must-be-false`, failures);
    expect(domain.itemCount === domain.items.length, `${domain.queueItemId}:domain-item-count-mismatch`, failures);
    for (const item of domain.items) {
      expect(item.reviewerDecision.humanDecision === "pending", `${item.itemId}:human-decision-must-start-pending`, failures);
      expect(item.reviewerDecision.licenseDecision === "pending", `${item.itemId}:license-decision-must-start-pending`, failures);
      expect(item.reviewerDecision.approvalId === null, `${item.itemId}:approval-id-must-start-null`, failures);
      expect(item.publicPromotion === false, `${item.itemId}:item-public-promotion-must-be-false`, failures);
      expect(item.runtimePromotion === false, `${item.itemId}:item-runtime-promotion-must-be-false`, failures);
      expect(!("runtimePath" in item), `${item.itemId}:runtime-path-forbidden`, failures);
      expect(isSafeReportPath(item.sourcePath), `${item.itemId}:unsafe-source-path`, failures);
      if (item.sourceRawPath) expect(isSafeRawPath(item.sourceRawPath), `${item.itemId}:unsafe-raw-source-path`, failures);
      expect(isSafeReportPath(item.outputPath), `${item.itemId}:unsafe-output-path`, failures);
    }
  }
  assert(failures.length === 0, `approval decision owner packet invalid: ${failures.join(", ")}`);
}

function validateIndex(index, ownerPackets) {
  const failures = [];
  expect(index.publicPromotion === false, "index-public-promotion-must-be-false", failures);
  expect(index.runtimePromotion === false, "index-runtime-promotion-must-be-false", failures);
  expect(index.totals.ownerPackets === 5, "index-owner-packets-must-be-5", failures);
  expect(index.totals.reviewDomains === 43, "index-review-domains-must-be-43", failures);
  expect(index.totals.reviewItems === 737, "index-review-items-must-be-737", failures);
  expect(index.totals.approved === 0, "index-approved-must-be-zero", failures);
  expect(ownerPackets.length === index.packetRefs.length, "packet-ref-count-mismatch", failures);
  assert(failures.length === 0, `approval decision index invalid: ${failures.join(", ")}`);
}

function groupQueueByOwner(queue) {
  const groups = new Map();
  for (const item of queue) {
    if (!groups.has(item.owner)) groups.set(item.owner, []);
    groups.get(item.owner).push(item);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--out-dir") args.outDir = argv[++index];
    else if (arg === "--write") args.write = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relPath) {
  const normalized = normalizeRepoPath(relPath);
  const absolute = path.join(repoRoot, normalized);
  assert(existsSync(absolute), `missing JSON artifact: ${normalized}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
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

function isSafeReportPath(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (value.startsWith("/") || value.includes("\\") || value.includes("\0") || /^[a-z]:/i.test(value)) return false;
  if (/^(https?:|data:|blob:|file:|\/\/)/i.test(value)) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && !normalized.startsWith("../") && normalized !== "..";
}

function isSafeRawPath(value) {
  return isSafeReportPath(value) && value.startsWith(`raw/imported/${importJobId}/`);
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null))];
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
