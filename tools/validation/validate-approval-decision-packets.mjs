import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const packetDir = `reports/approval-decisions/${importJobId}`;
const indexPath = `${packetDir}/index.json`;
const failures = [];

expect(existsSync(path.join(repoRoot, indexPath)), "approval-decision-index-missing");
assert(failures.length === 0, `approval decision packets invalid: ${failures.join(", ")}`);

const index = readJson(indexPath);

expect(index.schema === "nexusengine.goldrush.approval-decision-packet-index.v1", "invalid-index-schema");
expect(index.importJobId === importJobId, "wrong-import-job");
expect(index.status === "approval-decision-packets-ready", "wrong-index-status");
expect(index.publicPromotion === false, "index-public-promotion-must-be-false");
expect(index.runtimePromotion === false, "index-runtime-promotion-must-be-false");
expect(index.promotionReady === false, "index-promotion-ready-must-be-false");
expect(index.rules?.writesPublicAssets === false, "index-must-not-write-public-assets");
expect(index.rules?.promotesRuntimeAssets === false, "index-must-not-promote-runtime");
expect(index.rules?.packetsDefaultToPending === true, "index-must-default-to-pending");
expect(index.rules?.approvalRequiresPromotionPlanner === true, "index-must-require-promotion-planner");
expect(index.rules?.runtimePathsAreForbiddenInDecisionPackets === true, "index-must-forbid-runtime-paths");

const packetRefs = index.packetRefs ?? [];
expect(index.totals?.ownerPackets === 5, "owner-packet-count-must-be-5");
expect(packetRefs.length === 5, "packet-ref-count-must-be-5");
expect(index.totals?.reviewDomains === 43, "review-domain-count-must-be-43");
expect(index.totals?.reviewItems === 737, "review-item-count-must-be-737");
expect(index.totals?.pendingHumanReview === 737, "pending-human-review-must-be-737");
expect(index.totals?.pendingLicenseReview === 737, "pending-license-review-must-be-737");
expect(index.totals?.approved === 0, "approved-must-be-zero");
expect(index.totals?.publicPromoted === 0, "public-promoted-must-be-zero");
expect(index.totals?.runtimePromoted === 0, "runtime-promoted-must-be-zero");

const expectedOwners = new Set([
  "audio-licensing",
  "character-combat-art",
  "environment-material-art",
  "environment-model-art",
  "world-technical-art",
]);
const seenOwners = new Set();
const seenItemIds = new Set();
const seenQueueIds = new Set();
let totalDomains = 0;
let totalItems = 0;

for (const packetRef of packetRefs) {
  const label = packetRef.ownerPacketId ?? "missing-packet-ref";
  expect(hasFilledString(packetRef.owner), `${label}:missing-owner`);
  expect(expectedOwners.has(packetRef.owner), `${label}:unexpected-owner:${packetRef.owner}`);
  expect(!seenOwners.has(packetRef.owner), `${label}:duplicate-owner:${packetRef.owner}`);
  seenOwners.add(packetRef.owner);
  expect(isSafeReportPath(packetRef.packetPath), `${label}:unsafe-packet-path`);
  expect(packetRef.packetPath === `${packetDir}/${packetRef.ownerPacketId}.json`, `${label}:packet-path-mismatch`);
  expect(existsSync(path.join(repoRoot, packetRef.packetPath)), `${label}:packet-file-missing`);
  if (!existsSync(path.join(repoRoot, packetRef.packetPath))) continue;

  const packet = readJson(packetRef.packetPath);
  validatePacket(packet, packetRef);
  totalDomains += packet.totals.reviewDomains;
  totalItems += packet.totals.reviewItems;

  for (const domain of packet.domains ?? []) {
    expect(!seenQueueIds.has(domain.queueItemId), `${domain.queueItemId}:duplicate-domain`);
    seenQueueIds.add(domain.queueItemId);
    for (const item of domain.items ?? []) {
      expect(!seenItemIds.has(item.itemId), `${item.itemId}:duplicate-review-item`);
      seenItemIds.add(item.itemId);
    }
  }
}

expect(seenOwners.size === expectedOwners.size, "owner-coverage-mismatch");
expect(totalDomains === 43, "packet-domain-total-mismatch");
expect(totalItems === 737, "packet-item-total-mismatch");
expect(seenQueueIds.size === 43, "queue-domain-coverage-mismatch");
expect(seenItemIds.size === 737, "review-item-coverage-mismatch");

const serializedIndex = JSON.stringify(index);
expectNoForbiddenPromotionFields("index", serializedIndex);
for (const packetRef of packetRefs) {
  if (!existsSync(path.join(repoRoot, packetRef.packetPath))) continue;
  expectNoForbiddenPromotionFields(packetRef.packetPath, readFileSync(path.join(repoRoot, packetRef.packetPath), "utf8"));
}

assert(failures.length === 0, `approval decision packets invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "approval-decision-packets-ready",
  importJobId,
  ownerPackets: index.totals.ownerPackets,
  reviewDomains: index.totals.reviewDomains,
  reviewItems: index.totals.reviewItems,
  pendingHumanReview: index.totals.pendingHumanReview,
  pendingLicenseReview: index.totals.pendingLicenseReview,
  approved: index.totals.approved,
  publicPromotion: false,
  runtimePromotion: false,
}, null, 2));

function validatePacket(packet, packetRef) {
  const label = packet.ownerPacketId ?? packetRef.ownerPacketId;
  expect(packet.schema === "nexusengine.goldrush.approval-decision-packet.v1", `${label}:invalid-schema`);
  expect(packet.importJobId === importJobId, `${label}:wrong-import-job`);
  expect(packet.ownerPacketId === packetRef.ownerPacketId, `${label}:packet-id-mismatch`);
  expect(packet.owner === packetRef.owner, `${label}:owner-mismatch`);
  expect(packet.status === "pending-approval-decisions", `${label}:status-must-be-pending`);
  expect(packet.publicPromotion === false, `${label}:public-promotion-must-be-false`);
  expect(packet.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`);
  expect(packet.promotionReady === false, `${label}:promotion-ready-must-be-false`);
  expect(packet.rules?.writesPublicAssets === false, `${label}:must-not-write-public-assets`);
  expect(packet.rules?.promotesRuntimeAssets === false, `${label}:must-not-promote-runtime`);
  expect(packet.rules?.packetIsReviewInputOnly === true, `${label}:must-be-review-input-only`);
  expect(packet.rules?.decisionDefaultsToPending === true, `${label}:must-default-to-pending`);
  expect(packet.rules?.approvalRequiresHumanDecision === true, `${label}:must-require-human-decision`);
  expect(packet.rules?.approvalRequiresLicenseDecision === true, `${label}:must-require-license-decision`);
  expect(packet.rules?.approvalRequiresMatchingApprovalId === true, `${label}:must-require-matching-approval-id`);
  expect(packet.rules?.approvalRequiresRuntimePromotionPlanner === true, `${label}:must-require-promotion-planner`);
  expect(packet.rules?.runtimePathsAreForbiddenInDecisionPackets === true, `${label}:must-forbid-runtime-paths`);
  expect(packet.totals?.reviewDomains === packetRef.reviewDomains, `${label}:domain-total-ref-mismatch`);
  expect(packet.totals?.reviewItems === packetRef.reviewItems, `${label}:item-total-ref-mismatch`);
  expect(packet.totals?.pendingHumanReview === packet.totals?.reviewItems, `${label}:pending-human-total-mismatch`);
  expect(packet.totals?.pendingLicenseReview === packet.totals?.reviewItems, `${label}:pending-license-total-mismatch`);
  expect(packet.totals?.approved === 0, `${label}:approved-must-be-zero`);
  expect(packet.totals?.publicPromoted === 0, `${label}:public-promoted-must-be-zero`);
  expect(packet.totals?.runtimePromoted === 0, `${label}:runtime-promoted-must-be-zero`);

  let itemTotal = 0;
  for (const domain of packet.domains ?? []) {
    expect(hasFilledString(domain.queueItemId), `${label}:domain-missing-queue-id`);
    expect(hasFilledString(domain.domainId), `${domain.queueItemId}:missing-domain-id`);
    expect(hasFilledString(domain.priority), `${domain.queueItemId}:missing-priority`);
    expect(hasFilledString(domain.reviewLane), `${domain.queueItemId}:missing-review-lane`);
    expect(domain.status === "pending-review", `${domain.queueItemId}:domain-status-must-be-pending`);
    expect(domain.publicPromotion === false, `${domain.queueItemId}:domain-public-promotion-must-be-false`);
    expect(domain.runtimePromotion === false, `${domain.queueItemId}:domain-runtime-promotion-must-be-false`);
    expect(domain.promotionReady === false, `${domain.queueItemId}:domain-promotion-ready-must-be-false`);
    expect(domain.blockedBy?.includes("license-provenance"), `${domain.queueItemId}:missing-license-blocker`);
    expect(domain.blockedBy?.includes("human-review"), `${domain.queueItemId}:missing-human-blocker`);
    expect(domain.blockedBy?.includes("approved-runtime-record"), `${domain.queueItemId}:missing-runtime-record-blocker`);
    expect(domain.itemCount === domain.items?.length, `${domain.queueItemId}:domain-item-count-mismatch`);
    itemTotal += domain.itemCount;
    for (const item of domain.items ?? []) validateItem(item, domain);
  }
  expect(itemTotal === packet.totals.reviewItems, `${label}:packet-item-total-mismatch`);
}

function validateItem(item, domain) {
  const label = item.itemId ?? "missing-item";
  expect(hasFilledString(item.itemId), `${label}:missing-item-id`);
  expect(item.queueItemId === domain.queueItemId, `${label}:queue-item-mismatch`);
  expect(hasFilledString(item.slotId), `${label}:missing-slot-id`);
  expect(hasFilledString(item.sourceHash), `${label}:missing-source-hash`);
  expect(hasFilledString(item.outputHash), `${label}:missing-output-hash`);
  expect(hasFilledString(item.currentReviewStatus), `${label}:missing-current-review-status`);
  expect(hasFilledString(item.currentLicenseStatus), `${label}:missing-current-license-status`);
  expect(item.currentReviewStatus === "pending-human-review", `${label}:current-review-must-be-pending`);
  expect(item.currentLicenseStatus === "pending-provenance-review", `${label}:current-license-must-be-pending`);
  expect(item.publicPromotion === false, `${label}:item-public-promotion-must-be-false`);
  expect(item.runtimePromotion === false, `${label}:item-runtime-promotion-must-be-false`);
  expect(item.promotionReady === false, `${label}:item-promotion-ready-must-be-false`);
  expect(Array.isArray(item.promotionBlockedBy) && item.promotionBlockedBy.length > 0, `${label}:missing-promotion-blockers`);
  expect(item.promotionBlockedBy.includes("human-decision-pending"), `${label}:missing-human-pending-blocker`);
  expect(item.promotionBlockedBy.includes("license-decision-pending"), `${label}:missing-license-pending-blocker`);
  expect(item.promotionBlockedBy.includes("approved-runtime-promotion-planner"), `${label}:missing-promotion-planner-blocker`);
  expect(item.reviewerDecision?.humanDecision === "pending", `${label}:human-decision-must-start-pending`);
  expect(item.reviewerDecision?.licenseDecision === "pending", `${label}:license-decision-must-start-pending`);
  expect(item.reviewerDecision?.approvalId === null, `${label}:approval-id-must-start-null`);
  expect(item.reviewerDecision?.sourceEvidenceUrl === null, `${label}:source-evidence-url-must-start-null`);
  expect(item.reviewerDecision?.licenseIdentifier === null, `${label}:license-identifier-must-start-null`);
  expect(item.reviewerDecision?.reviewerNotes === null, `${label}:reviewer-notes-must-start-null`);
  expect(!("runtimePath" in item), `${label}:runtime-path-forbidden`);
  expect(isSafeReportPath(item.sourcePath), `${label}:unsafe-source-path`);
  if (item.sourceRawPath) expect(isSafeRawPath(item.sourceRawPath), `${label}:unsafe-source-raw-path`);
  expect(isSafeReportPath(item.outputPath), `${label}:unsafe-output-path`);
}

function expectNoForbiddenPromotionFields(label, serialized) {
  expect(!/"runtimePath"\s*:/.test(serialized), `${label}:must-not-contain-runtime-path`);
  expect(!/"publicPromotion"\s*:\s*true/.test(serialized), `${label}:must-not-public-promote`);
  expect(!/"runtimePromotion"\s*:\s*true/.test(serialized), `${label}:must-not-runtime-promote`);
  expect(!/"promotionReady"\s*:\s*true/.test(serialized), `${label}:must-not-be-promotion-ready`);
  expect(!/"approvalId"\s*:\s*"[^"]+"/.test(serialized), `${label}:must-not-contain-filled-approval-id`);
  expect(!/"humanDecision"\s*:\s*"approved"/.test(serialized), `${label}:must-not-contain-human-approval`);
  expect(!/"licenseDecision"\s*:\s*"approved"/.test(serialized), `${label}:must-not-contain-license-approval`);
}

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
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
