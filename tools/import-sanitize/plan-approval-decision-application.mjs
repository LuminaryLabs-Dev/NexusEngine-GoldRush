import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const packetDir = `reports/approval-decisions/${importJobId}`;
const defaultReportPath = `${packetDir}/application-plan.json`;
const validDecisionValues = new Set(["pending", "approved", "rejected"]);

export function createApprovalDecisionApplicationPlan({
  generatedAt = new Date().toISOString(),
  write = false,
  packetDir: packetDirOption = packetDir,
  reportPath,
} = {}) {
  const activePacketDir = normalizeRepoPath(packetDirOption);
  const activeReportPath = reportPath ?? `${activePacketDir}/application-plan.json`;
  const index = readJson(`${activePacketDir}/index.json`);
  validateIndex(index);

  const packetRefs = index.packetRefs ?? [];
  const packetItems = packetRefs.flatMap((ref) => {
    const packet = readJson(ref.packetPath);
    return collectPacketItems(packet, ref);
  });

  const packetsBySource = loadPacketSources(index, packetRefs);
  const reviewByItemId = new Map();
  const licenseByItemId = new Map();
  for (const source of packetsBySource.values()) {
    for (const item of source.humanReview.items ?? []) reviewByItemId.set(item.itemId, { source, item });
    for (const item of source.licenseProvenance.items ?? []) licenseByItemId.set(item.itemId, { source, item });
  }

  const decisions = packetItems.map((packetItem) => evaluateDecision({
    packetItem,
    review: reviewByItemId.get(packetItem.itemId),
    license: licenseByItemId.get(packetItem.itemId),
  }));

  const invalidDecisions = decisions.filter((decision) => decision.status === "invalid");
  const approvedReady = decisions.filter((decision) => decision.status === "approved-ready");
  const rejectedReady = decisions.filter((decision) => decision.status === "rejected-ready");
  const pending = decisions.filter((decision) => decision.status === "pending");
  const blocked = decisions.filter((decision) => decision.status === "blocked");

  const report = {
    schema: "nexusengine.goldrush.approval-decision-application-plan.v1",
    version: "0.1.0",
    importJobId,
    generatedAt,
    status: invalidDecisions.length > 0
      ? "approval-decision-application-invalid"
      : approvedReady.length + rejectedReady.length > 0
        ? "approval-decision-application-ready"
        : "approval-decision-application-noop",
    write,
    publicPromotion: false,
    runtimePromotion: false,
    promotionReady: approvedReady.length > 0,
    sources: [...packetsBySource.values()].map((source) => ({
      sourceId: source.sourceId,
      sourceKind: source.sourceKind,
      humanReview: source.humanReviewPath,
      licenseProvenance: source.licensePath,
    })),
    totals: {
      decisionItems: decisions.length,
      pending: pending.length,
      approvedReady: approvedReady.length,
      rejectedReady: rejectedReady.length,
      blocked: blocked.length,
      invalid: invalidDecisions.length,
      publicPromoted: 0,
      runtimePromoted: 0,
    },
    rules: {
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      preflightOnly: true,
      mutatesReviewPackets: false,
      requiresHumanDecisionApproved: true,
      requiresLicenseDecisionApproved: true,
      requiresMatchingApprovalId: true,
      requiresSourceEvidenceUrl: true,
      requiresLicenseIdentifier: true,
      requiresAttributionWhenRequired: true,
      canonicalReviewPacketsRemainPendingUntilSeparateApprovedWrite: true,
    },
    readyUpdates: [
      ...approvedReady.map((decision) => createReadyUpdate(decision, "approved")),
      ...rejectedReady.map((decision) => createReadyUpdate(decision, "rejected")),
    ],
    blockedItems: [
      ...blocked.map(createBlockedUpdate),
      ...invalidDecisions.map(createBlockedUpdate),
    ],
  };

  if (write) writeSanitizedJsonArtifactSync(path.join(repoRoot, normalizeRepoPath(activeReportPath)), report, { repoRoot });
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createApprovalDecisionApplicationPlan(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId,
    write: args.write,
    report: args.write ? (args.reportPath ?? `${args.packetDir ?? packetDir}/application-plan.json`) : null,
    decisionItems: report.totals.decisionItems,
    pending: report.totals.pending,
    approvedReady: report.totals.approvedReady,
    rejectedReady: report.totals.rejectedReady,
    blocked: report.totals.blocked,
    invalid: report.totals.invalid,
    publicPromotion: false,
    runtimePromotion: false,
  }, { repoRoot }));
}

function collectPacketItems(packet, ref) {
  validateDecisionPacket(packet, ref);
  return (packet.domains ?? []).flatMap((domain) => (domain.items ?? []).map((item) => ({
    ...item,
    owner: packet.owner,
    domainId: domain.domainId,
    priority: domain.priority,
    reviewLane: domain.reviewLane,
  })));
}

function evaluateDecision({ packetItem, review, license }) {
  const failures = [];
  const reviewerDecision = packetItem.reviewerDecision ?? {};
  const humanDecision = reviewerDecision.humanDecision;
  const licenseDecision = reviewerDecision.licenseDecision;
  const approvalId = reviewerDecision.approvalId;

  expect(validDecisionValues.has(humanDecision), "invalid-human-decision", failures);
  expect(validDecisionValues.has(licenseDecision), "invalid-license-decision", failures);
  expect(Boolean(review), "missing-human-review-item", failures);
  expect(Boolean(license), "missing-license-item", failures);
  if (review) validatePacketAgainstReview(packetItem, review.item, "human-review", failures);
  if (license) validatePacketAgainstLicense(packetItem, license.item, failures);

  const base = {
    itemId: packetItem.itemId,
    owner: packetItem.owner,
    queueItemId: packetItem.queueItemId,
    sourceId: packetItem.sourceId,
    sourceKind: packetItem.sourceKind,
    slotId: packetItem.slotId,
    mediaKind: packetItem.mediaKind,
    outputKind: packetItem.outputKind,
    outputPath: packetItem.outputPath,
    outputHash: packetItem.outputHash,
    approvalId: approvalId ?? null,
    humanDecision,
    licenseDecision,
  };

  if (failures.length > 0) return { ...base, status: "invalid", blockedBy: failures };

  if (humanDecision === "pending" && licenseDecision === "pending") {
    return { ...base, status: "pending", blockedBy: ["human-decision-pending", "license-decision-pending"] };
  }

  if (humanDecision === "rejected" || licenseDecision === "rejected") {
    return {
      ...base,
      status: "rejected-ready",
      blockedBy: [],
      reviewerNotes: reviewerDecision.reviewerNotes ?? null,
    };
  }

  const approvalFailures = [];
  expect(humanDecision === "approved", "human-decision-not-approved", approvalFailures);
  expect(licenseDecision === "approved", "license-decision-not-approved", approvalFailures);
  expect(isSafeApprovalId(approvalId), "approval-id-required", approvalFailures);
  expect(isHttpsUrl(reviewerDecision.sourceEvidenceUrl), "https-source-evidence-url-required", approvalFailures);
  expect(hasFilledString(reviewerDecision.licenseIdentifier), "license-identifier-required", approvalFailures);
  if (reviewerDecision.attributionRequired === true) {
    expect(hasFilledString(reviewerDecision.attributionText), "attribution-text-required", approvalFailures);
  }

  if (approvalFailures.length > 0) return { ...base, status: "blocked", blockedBy: approvalFailures };

  return {
    ...base,
    status: "approved-ready",
    blockedBy: [],
    attributionRequired: reviewerDecision.attributionRequired,
    attributionText: reviewerDecision.attributionText ?? null,
    sourceEvidenceUrl: reviewerDecision.sourceEvidenceUrl,
    licenseIdentifier: reviewerDecision.licenseIdentifier,
    reviewerNotes: reviewerDecision.reviewerNotes ?? null,
  };
}

function validatePacketAgainstReview(packetItem, reviewItem, label, failures) {
  expect(packetItem.slotId === reviewItem.slotId, `${label}:slot-id-mismatch`, failures);
  expect(packetItem.sourceHash === reviewItem.sourceHash, `${label}:source-hash-mismatch`, failures);
  expect(packetItem.outputPath === reviewItem.outputPath, `${label}:output-path-mismatch`, failures);
  expect(packetItem.outputHash === reviewItem.outputHash, `${label}:output-hash-mismatch`, failures);
  expect(reviewItem.publicPromotion === false, `${label}:public-promotion-must-be-false`, failures);
  expect(reviewItem.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`, failures);
  expect(!("runtimePath" in reviewItem), `${label}:runtime-path-forbidden`, failures);
}

function validatePacketAgainstLicense(packetItem, licenseItem, failures) {
  expect(packetItem.slotId === licenseItem.slotId, "license:slot-id-mismatch", failures);
  expect(packetItem.sourceHash === licenseItem.sourceHash, "license:source-hash-mismatch", failures);
  expect(packetItem.outputPath === licenseItem.outputPath, "license:output-path-mismatch", failures);
  expect(packetItem.outputHash === licenseItem.outputHash, "license:output-hash-mismatch", failures);
  expect(licenseItem.publicPromotion === false, "license:public-promotion-must-be-false", failures);
  expect(licenseItem.runtimePromotion === false, "license:runtime-promotion-must-be-false", failures);
  expect(!("runtimePath" in licenseItem), "license:runtime-path-forbidden", failures);
}

function createReadyUpdate(decision, decisionStatus) {
  return {
    itemId: decision.itemId,
    owner: decision.owner,
    sourceId: decision.sourceId,
    slotId: decision.slotId,
    decisionStatus,
    approvalId: decision.approvalId,
    outputPath: decision.outputPath,
    outputHash: decision.outputHash,
    publicPromotion: false,
    runtimePromotion: false,
    nextGate: decisionStatus === "approved" ? "approved-runtime-promotion-planner" : "review-record-update",
  };
}

function createBlockedUpdate(decision) {
  return {
    itemId: decision.itemId,
    owner: decision.owner,
    sourceId: decision.sourceId,
    slotId: decision.slotId,
    status: decision.status,
    blockedBy: decision.blockedBy,
    publicPromotion: false,
    runtimePromotion: false,
  };
}

function loadPacketSources(index, packetRefs) {
  const sources = new Map();
  for (const ref of packetRefs) {
    const packet = readJson(ref.packetPath);
    for (const source of packet.sources ?? []) {
      if (sources.has(source.sourceId)) continue;
      const humanReviewPath = normalizeRepoPath(source.humanReview);
      const licensePath = normalizeRepoPath(source.licenseProvenance);
      sources.set(source.sourceId, {
        sourceId: source.sourceId,
        sourceKind: source.sourceKind,
        humanReviewPath,
        licensePath,
        humanReview: readJson(humanReviewPath),
        licenseProvenance: readJson(licensePath),
      });
    }
  }
  assert(sources.size === 2, `application-plan-source-count-must-be-2:${sources.size}`);
  return sources;
}

function validateIndex(index) {
  const failures = [];
  expect(index.schema === "nexusengine.goldrush.approval-decision-packet-index.v1", "invalid-index-schema", failures);
  expect(index.importJobId === importJobId, "wrong-import-job", failures);
  expect(index.publicPromotion === false, "index-public-promotion-must-be-false", failures);
  expect(index.runtimePromotion === false, "index-runtime-promotion-must-be-false", failures);
  expect(index.totals?.ownerPackets === 5, "owner-packet-count-must-be-5", failures);
  expect(index.totals?.reviewItems === 737, "review-item-count-must-be-737", failures);
  assert(failures.length === 0, `approval decision application index invalid: ${failures.join(", ")}`);
}

function validateDecisionPacket(packet, ref) {
  const failures = [];
  expect(packet.schema === "nexusengine.goldrush.approval-decision-packet.v1", `${ref.owner}:invalid-packet-schema`, failures);
  expect(packet.ownerPacketId === ref.ownerPacketId, `${ref.owner}:packet-id-mismatch`, failures);
  expect(packet.owner === ref.owner, `${ref.owner}:owner-mismatch`, failures);
  expect(packet.publicPromotion === false, `${ref.owner}:packet-public-promotion-must-be-false`, failures);
  expect(packet.runtimePromotion === false, `${ref.owner}:packet-runtime-promotion-must-be-false`, failures);
  expect(packet.totals?.reviewItems === ref.reviewItems, `${ref.owner}:review-item-count-mismatch`, failures);
  assert(failures.length === 0, `approval decision packet invalid: ${failures.join(", ")}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--packet-dir") args.packetDir = argv[++index];
    else if (arg === "--report") args.reportPath = argv[++index];
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

function isSafeApprovalId(value) {
  return typeof value === "string" && /^goldrush-approval-[a-z0-9][a-z0-9._-]{5,80}$/i.test(value);
}

function isHttpsUrl(value) {
  return typeof value === "string" && /^https:\/\/[^\s"'<>]+$/i.test(value);
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
