import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const queueId = `${importJobId}.remaining-review-domain-queue`;
const queuePath = `reports/review-queues/${queueId}.json`;
const absoluteQueuePath = path.join(repoRoot, queuePath);
const failures = [];

expect(existsSync(absoluteQueuePath), "remaining-review-domain-queue-missing");
assert(failures.length === 0, `remaining review domain queue invalid: ${failures.join(", ")}`);

const report = readJson(absoluteQueuePath);

expect(report.schema === "nexusengine.goldrush.remaining-review-domain-queue.v1", "invalid-queue-schema");
expect(report.importJobId === importJobId, "wrong-import-job");
expect(report.queueId === queueId, "wrong-queue-id");
expect(report.status === "remaining-review-domain-queue-ready", "wrong-queue-status");
expect(report.publicPromotion === false, "queue-must-not-promote-public");
expect(report.runtimePromotion === false, "queue-must-not-promote-runtime");
expect(report.rules?.writesPublicAssets === false, "queue-must-not-write-public-assets");
expect(report.rules?.promotesRuntimeAssets === false, "queue-must-not-promote-runtime-rule");
expect(report.rules?.permitsApprovalByQueue === false, "queue-must-not-permit-approval");
expect(report.rules?.requiresLicenseProvenanceBeforePromotion === true, "queue-must-require-license-provenance");
expect(report.rules?.requiresHumanReviewBeforePromotion === true, "queue-must-require-human-review");
expect(report.rules?.requiresApprovedRuntimeRecordBeforePromotion === true, "queue-must-require-runtime-record");
expect(report.rules?.requiresRuntimeHashValidationBeforePromotion === true, "queue-must-require-hash-validation");

const queue = report.queue ?? [];
expect(report.sources?.length === 2, "queue-source-count-must-be-2");
expect(queue.length === 43, "queue-domain-count-must-be-43");
expect(report.totals?.reviewItems === 737, "queue-review-items-must-be-737");
expect(report.totals?.licenseItems === 737, "queue-license-items-must-be-737");
expect(report.totals?.reviewDomains === queue.length, "queue-domain-total-mismatch");
expect(report.totals?.pendingHumanReview === 737, "queue-pending-human-review-must-be-737");
expect(report.totals?.pendingLicenseReview === 737, "queue-pending-license-review-must-be-737");
expect(report.totals?.approved === 0, "queue-approved-must-be-zero");
expect(report.totals?.publicPromoted === 0, "queue-public-promoted-must-be-zero");
expect(report.totals?.runtimePromoted === 0, "queue-runtime-promoted-must-be-zero");
expect((report.totals?.byPriority?.P0 ?? 0) > 0, "queue-must-have-p0-items");
expect((report.totals?.byPriority?.P1 ?? 0) > 0, "queue-must-have-p1-items");
expect((report.totals?.byOwner?.["audio-licensing"] ?? 0) > 0, "queue-must-have-audio-owner");
expect((report.totals?.byOwner?.["character-combat-art"] ?? 0) > 0, "queue-must-have-character-owner");
expect((report.totals?.byOwner?.["world-technical-art"] ?? 0) > 0, "queue-must-have-world-tech-owner");

const seenQueueIds = new Set();
const seenSourceItemIds = new Set();
let itemTotal = 0;
let previousRank = 0;
for (const item of queue) {
  const label = item.queueItemId ?? "missing-queue-item";
  expect(hasFilledString(item.queueItemId), `${label}:missing-queue-item-id`);
  expect(!seenQueueIds.has(item.queueItemId), `${label}:duplicate-queue-item-id`);
  seenQueueIds.add(item.queueItemId);
  expect(item.rank > previousRank, `${label}:rank-must-increase`);
  previousRank = item.rank;
  expect(["P0", "P1", "P2", "P3"].includes(item.priority), `${label}:invalid-priority`);
  expect(hasFilledString(item.owner), `${label}:missing-owner`);
  expect(hasFilledString(item.reviewLane), `${label}:missing-review-lane`);
  expect(item.status === "pending-review", `${label}:status-must-be-pending`);
  expect(item.publicPromotion === false, `${label}:public-promotion-must-be-false`);
  expect(item.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`);
  expect(item.promotionReady === false, `${label}:promotion-ready-must-be-false`);
  expect(item.blockedBy?.includes("license-provenance"), `${label}:missing-license-blocker`);
  expect(item.blockedBy?.includes("human-review"), `${label}:missing-human-review-blocker`);
  expect(item.blockedBy?.includes("approved-runtime-record"), `${label}:missing-runtime-record-blocker`);
  expect(item.blockedBy?.includes("runtime-hash-validation"), `${label}:missing-hash-blocker`);
  expect(item.requiredEvidence?.includes("source-page-or-repo-evidence"), `${label}:missing-source-evidence`);
  expect(item.requiredEvidence?.includes("license-terms"), `${label}:missing-license-evidence`);
  expect(item.requiredEvidence?.includes("human-review-decision"), `${label}:missing-human-decision-evidence`);
  expect(item.itemCount === item.sourceItemIds?.length, `${label}:item-count-mismatch`);
  itemTotal += item.itemCount;
  for (const itemId of item.sourceItemIds ?? []) {
    expect(hasFilledString(itemId), `${label}:blank-source-item-id`);
    expect(!seenSourceItemIds.has(itemId), `${label}:duplicate-source-item-id:${itemId}`);
    seenSourceItemIds.add(itemId);
  }
  for (const sample of item.sampleOutputs ?? []) {
    expect(isSafeReportPath(sample.outputPath), `${label}:unsafe-sample-output-path`);
    expect(isSafeReportPath(sample.sourcePath), `${label}:unsafe-sample-source-path`);
    if (sample.sourceRawPath) expect(isSafeRawPath(sample.sourceRawPath), `${label}:unsafe-sample-source-raw-path`);
  }
}

expect(itemTotal === report.totals.reviewItems, "queue-item-total-mismatch");
expect(seenSourceItemIds.size === report.totals.reviewItems, "queue-source-item-coverage-mismatch");

const serialized = JSON.stringify(report);
expect(!/"status":"approved"/.test(serialized), "queue-must-not-contain-approved-status");
expect(!/"runtimePath":/.test(serialized), "queue-must-not-contain-runtime-path");
expect(!/"approvalId":"[^"]+"/.test(serialized), "queue-must-not-contain-filled-approval-id");

assert(failures.length === 0, `remaining review domain queue invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "remaining-review-domain-queue-ready",
  importJobId,
  queueId,
  reviewItems: report.totals.reviewItems,
  reviewDomains: report.totals.reviewDomains,
  priority: report.totals.byPriority,
  owners: report.totals.byOwner,
  publicPromotion: false,
  runtimePromotion: false,
}, null, 2));

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function hasFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeReportPath(value) {
  if (!hasFilledString(value)) return false;
  if (value.startsWith("/") || value.includes("\\") || value.includes("\0") || /^[a-z]:/i.test(value)) return false;
  if (/^(https?:|data:|blob:|file:|\/\/)/i.test(value)) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && !normalized.startsWith("../") && normalized !== "..";
}

function isSafeRawPath(value) {
  return isSafeReportPath(value) && value.startsWith(`raw/imported/${importJobId}/`);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
