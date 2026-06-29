import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const conversionReportPath = path.join(repoRoot, `reports/conversion/${importJobId}.json`);
const humanReviewPath = path.join(repoRoot, `reports/human-review/${importJobId}-request.json`);
const licenseProvenancePath = path.join(repoRoot, `reports/license-provenance/${importJobId}.json`);
const failures = [];

if (!existsSync(conversionReportPath)) {
  console.log(JSON.stringify({
    status: "review-packets-pending-conversion",
    importJobId,
  }, null, 2));
  process.exit(0);
}

expect(existsSync(humanReviewPath), "human-review-request-missing");
expect(existsSync(licenseProvenancePath), "license-provenance-report-missing");
assert(failures.length === 0, `review packets invalid: ${failures.join(", ")}`);

const conversion = readJson(conversionReportPath);
const humanReview = readJson(humanReviewPath);
const licenseProvenance = readJson(licenseProvenancePath);

expect(humanReview.schema === "nexusengine.goldrush.human-review-request.v1", "invalid-human-review-schema");
expect(licenseProvenance.schema === "nexusengine.goldrush.license-provenance.v1", "invalid-license-provenance-schema");
expect(humanReview.importJobId === importJobId, "wrong-human-review-job");
expect(licenseProvenance.importJobId === importJobId, "wrong-license-provenance-job");
expect(humanReview.status === "pending-human-review", "human-review-status-must-be-pending");
expect(licenseProvenance.status === "pending-license-provenance-review", "license-provenance-status-must-be-pending");
expect(humanReview.publicPromotion === false, "human-review-must-not-promote-public-assets");
expect(humanReview.runtimePromotion === false, "human-review-must-not-promote-runtime-assets");
expect(licenseProvenance.publicPromotion === false, "license-provenance-must-not-promote-public-assets");
expect(licenseProvenance.runtimePromotion === false, "license-provenance-must-not-promote-runtime-assets");

validateRules(humanReview.rules, "human-review");
validateRules(licenseProvenance.rules, "license-provenance");
validateEvidence(humanReview.evidence, "human-review");
validateEvidence(licenseProvenance.evidence, "license-provenance");

const outputs = conversion.outputs ?? [];
const reviewItems = humanReview.items ?? [];
const licenseItems = licenseProvenance.items ?? [];
expect(reviewItems.length === outputs.length, "human-review-item-count-mismatch");
expect(licenseItems.length === outputs.length, "license-provenance-item-count-mismatch");
expect(humanReview.totals?.pendingHumanReview === outputs.length, "pending-human-review-total-mismatch");
expect(humanReview.totals?.pendingLicenseReview === outputs.length, "pending-license-review-total-mismatch");
expect(humanReview.totals?.approved === 0, "human-review-must-have-zero-approved");
expect(humanReview.totals?.publicPromoted === 0, "human-review-must-have-zero-public-promoted");
expect(humanReview.totals?.runtimePromoted === 0, "human-review-must-have-zero-runtime-promoted");
expect(licenseProvenance.totals?.approved === 0, "license-provenance-must-have-zero-approved");
expect(licenseProvenance.totals?.publicPromoted === 0, "license-provenance-must-have-zero-public-promoted");
expect(licenseProvenance.totals?.runtimePromoted === 0, "license-provenance-must-have-zero-runtime-promoted");

const outputByKey = new Map(outputs.map((output) => [assetKey(output), output]));
const licenseByItemId = new Map(licenseItems.map((item) => [item.itemId, item]));
const seenItemIds = new Set();
const seenOutputPaths = new Set();

for (const item of reviewItems) {
  const label = item.itemId ?? "missing-item-id";
  expect(hasFilledString(item.itemId), `${label}:missing-item-id`);
  expect(!seenItemIds.has(item.itemId), `${label}:duplicate-review-item-id`);
  seenItemIds.add(item.itemId);
  expect(isSafeReportPath(item.sourcePath), `${label}:unsafe-source-path`);
  expect(isSafeSanitizedPath(item.outputPath), `${label}:unsafe-output-path`);
  expect(!seenOutputPaths.has(item.outputPath), `${label}:duplicate-output-path`);
  seenOutputPaths.add(item.outputPath);
  expect(isSha256(item.sourceHash), `${label}:invalid-source-hash`);
  expect(isSha256(item.outputHash), `${label}:invalid-output-hash`);
  expect(item.reviewStatus === "pending-human-review", `${label}:review-status-must-be-pending`);
  expect(item.licenseStatus === "pending-provenance-review", `${label}:license-status-must-be-pending`);
  expect(item.approvalId === null, `${label}:approval-id-must-be-null`);
  expect(item.publicPromotion === false, `${label}:public-promotion-must-be-false`);
  expect(item.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`);
  expect(item.promotionReady === false, `${label}:promotion-ready-must-be-false`);
  expect(!("runtimePath" in item), `${label}:runtime-path-not-allowed`);
  expect(Array.isArray(item.requiredGates) && item.requiredGates.includes("human-review"), `${label}:missing-human-review-gate`);
  expect(item.requiredGates.includes("license-provenance"), `${label}:missing-license-provenance-gate`);
  expect(item.requiredGates.includes("approved-runtime-record"), `${label}:missing-approved-runtime-record-gate`);

  const output = outputByKey.get(assetKey(item));
  expect(Boolean(output), `${label}:no-matching-conversion-output`);
  if (output) {
    expect(item.slotId === output.slotId, `${label}:slot-id-mismatch`);
    expect(item.mediaKind === output.mediaKind, `${label}:media-kind-mismatch`);
    expect(item.outputKind === output.outputKind, `${label}:output-kind-mismatch`);
    expect(item.conversionStatus === output.conversionStatus, `${label}:conversion-status-mismatch`);
  }

  const license = licenseByItemId.get(item.itemId);
  expect(Boolean(license), `${label}:license-item-missing`);
  if (license) validateLicenseItem(license, item);
}

validateDomains(humanReview.reviewDomains ?? [], reviewItems);
validateNoApprovalFields(humanReview, "human-review");
validateNoApprovalFields(licenseProvenance, "license-provenance");

assert(failures.length === 0, `review packets invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "review-packets-ready",
  importJobId,
  reviewItems: reviewItems.length,
  domains: (humanReview.reviewDomains ?? []).length,
  pendingHumanReview: humanReview.totals.pendingHumanReview,
  pendingLicenseReview: licenseProvenance.totals.pendingLicenseReview,
  publicPromotion: humanReview.publicPromotion,
  runtimePromotion: humanReview.runtimePromotion,
}, null, 2));

function validateRules(rules, label) {
  expect(rules?.writesPublicAssets === false, `${label}:must-not-write-public-assets`);
  expect(rules?.promotesRuntimeAssets === false, `${label}:must-not-promote-runtime-assets`);
  expect(rules?.requiresHumanReviewBeforePromotion === true, `${label}:must-require-human-review`);
  expect(rules?.requiresLicenseProvenanceBeforePromotion === true, `${label}:must-require-license-provenance`);
  expect(rules?.requiresApprovedRuntimeRecordBeforePromotion === true, `${label}:must-require-approved-runtime-record`);
  expect(rules?.allowsApprovalByInference === false, `${label}:must-not-allow-inferred-approval`);
}

function validateEvidence(evidence, label) {
  for (const [key, value] of Object.entries(evidence ?? {})) {
    expect(isSafeReportPath(value), `${label}:unsafe-evidence-path:${key}`);
    expect(existsSync(path.join(repoRoot, value)), `${label}:evidence-missing:${key}`);
  }
}

function validateLicenseItem(license, review) {
  const label = review.itemId;
  expect(license.slotId === review.slotId, `${label}:license-slot-id-mismatch`);
  expect(license.sourcePath === review.sourcePath, `${label}:license-source-path-mismatch`);
  expect(license.sourceHash === review.sourceHash, `${label}:license-source-hash-mismatch`);
  expect(license.outputPath === review.outputPath, `${label}:license-output-path-mismatch`);
  expect(license.outputHash === review.outputHash, `${label}:license-output-hash-mismatch`);
  expect(license.licenseStatus === "pending-provenance-review", `${label}:license-status-must-be-pending`);
  expect(license.approvalId === null, `${label}:license-approval-id-must-be-null`);
  expect(license.publicPromotion === false, `${label}:license-public-promotion-must-be-false`);
  expect(license.runtimePromotion === false, `${label}:license-runtime-promotion-must-be-false`);
  expect(Array.isArray(license.promotionBlockedBy) && license.promotionBlockedBy.includes("license-provenance"), `${label}:license-missing-promotion-blocker`);
}

function validateDomains(domains, reviewItems) {
  const itemIds = new Set(reviewItems.map((item) => item.itemId));
  const domainItemIds = new Set();
  for (const domain of domains) {
    const label = domain.domainId ?? "missing-domain-id";
    expect(hasFilledString(domain.domainId), `${label}:missing-domain-id`);
    expect(domain.status === "pending-review", `${label}:domain-status-must-be-pending`);
    expect(domain.publicPromotion === false, `${label}:domain-public-promotion-must-be-false`);
    expect(domain.runtimePromotion === false, `${label}:domain-runtime-promotion-must-be-false`);
    expect(Array.isArray(domain.itemIds), `${label}:domain-item-ids-must-be-array`);
    expect(domain.itemCount === domain.itemIds?.length, `${label}:domain-item-count-mismatch`);
    for (const itemId of domain.itemIds ?? []) {
      expect(itemIds.has(itemId), `${label}:unknown-domain-item:${itemId}`);
      domainItemIds.add(itemId);
    }
    expect(Array.isArray(domain.requiredGates) && domain.requiredGates.includes("human-review"), `${label}:domain-missing-human-review-gate`);
  }
  expect(domainItemIds.size === reviewItems.length, "review-domains-do-not-cover-all-items");
}

function validateNoApprovalFields(value, label) {
  const text = JSON.stringify(value);
  expect(!/"status":"approved"/.test(text), `${label}:must-not-contain-approved-status`);
  expect(!/"runtimePath":/.test(text), `${label}:must-not-contain-runtime-path`);
  expect(!/"approvalId":"[^"]+"/.test(text), `${label}:must-not-contain-filled-approval-id`);
}

function assetKey(record) {
  return [
    record.slotId,
    record.sourcePath,
    record.sourceHash,
    record.outputPath,
    record.outputHash,
  ].join("\n");
}

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

function isSafeSanitizedPath(value) {
  return isSafeReportPath(value) && value.startsWith(`sanitized/converted/${importJobId}/`);
}

function isSha256(value) {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
