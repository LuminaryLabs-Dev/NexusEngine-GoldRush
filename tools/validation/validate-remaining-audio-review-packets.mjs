import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const batchId = "goldrush-dual-source-001.next.001.audio-music-and-sfx";
const conversionPath = path.join(repoRoot, `reports/conversion/remaining-batches/${batchId}.json`);
const registryPath = path.join(repoRoot, `sanitized/registry/remaining-batches/${batchId}.json`);
const humanReviewPath = path.join(repoRoot, `reports/human-review/remaining-batches/${batchId}-request.json`);
const licenseProvenancePath = path.join(repoRoot, `reports/license-provenance/remaining-batches/${batchId}.json`);
const failures = [];

expect(existsSync(conversionPath), "remaining-audio-conversion-report-missing");
expect(existsSync(registryPath), "remaining-audio-registry-missing");
expect(existsSync(humanReviewPath), "remaining-audio-human-review-request-missing");
expect(existsSync(licenseProvenancePath), "remaining-audio-license-provenance-missing");
assert(failures.length === 0, `remaining audio review packets invalid: ${failures.join(", ")}`);

const conversion = readJson(conversionPath);
const registry = readJson(registryPath);
const humanReview = readJson(humanReviewPath);
const licenseProvenance = readJson(licenseProvenancePath);

expect(humanReview.schema === "nexusengine.goldrush.remaining-audio-human-review-request.v1", "invalid-human-review-schema");
expect(licenseProvenance.schema === "nexusengine.goldrush.remaining-audio-license-provenance.v1", "invalid-license-provenance-schema");
expect(humanReview.importJobId === importJobId, "wrong-human-review-job");
expect(humanReview.batchId === batchId, "wrong-human-review-batch");
expect(licenseProvenance.importJobId === importJobId, "wrong-license-provenance-job");
expect(licenseProvenance.batchId === batchId, "wrong-license-provenance-batch");
expect(humanReview.status === "pending-human-review", "human-review-status-must-be-pending");
expect(licenseProvenance.status === "pending-license-provenance-review", "license-status-must-be-pending");
expect(humanReview.publicPromotion === false, "human-review-must-not-promote-public-assets");
expect(humanReview.runtimePromotion === false, "human-review-must-not-promote-runtime-assets");
expect(licenseProvenance.publicPromotion === false, "license-must-not-promote-public-assets");
expect(licenseProvenance.runtimePromotion === false, "license-must-not-promote-runtime-assets");
validateRules(humanReview.rules, "human-review");
validateRules(licenseProvenance.rules, "license-provenance");
validateEvidence(humanReview.evidence, "human-review");
validateEvidence(licenseProvenance.evidence, "license-provenance");

const outputs = conversion.outputs ?? [];
const registryAssets = registry.assets ?? [];
const reviewItems = humanReview.items ?? [];
const licenseItems = licenseProvenance.items ?? [];
expect(outputs.length === 15, "conversion-output-count-must-be-15");
expect(registryAssets.length === 15, "registry-asset-count-must-be-15");
expect(reviewItems.length === outputs.length, "human-review-item-count-mismatch");
expect(licenseItems.length === outputs.length, "license-item-count-mismatch");
expect(humanReview.totals?.pendingHumanReview === outputs.length, "pending-human-review-total-mismatch");
expect(humanReview.totals?.pendingLicenseReview === outputs.length, "pending-license-review-total-mismatch");
expect(humanReview.totals?.approved === 0, "human-review-approved-must-be-zero");
expect(humanReview.totals?.publicPromoted === 0, "human-review-public-promoted-must-be-zero");
expect(humanReview.totals?.runtimePromoted === 0, "human-review-runtime-promoted-must-be-zero");
expect(licenseProvenance.totals?.approved === 0, "license-approved-must-be-zero");
expect(licenseProvenance.totals?.publicPromoted === 0, "license-public-promoted-must-be-zero");
expect(licenseProvenance.totals?.runtimePromoted === 0, "license-runtime-promoted-must-be-zero");

const outputByKey = new Map(outputs.map((output) => [assetKey(output), output]));
const licenseByItemId = new Map(licenseItems.map((item) => [item.itemId, item]));
const seenItemIds = new Set();
const seenOutputs = new Set();

for (const item of reviewItems) {
  const label = item.itemId ?? "missing-item-id";
  expect(hasFilledString(item.itemId), `${label}:missing-item-id`);
  expect(!seenItemIds.has(item.itemId), `${label}:duplicate-item-id`);
  seenItemIds.add(item.itemId);
  expect(isSafeRawPath(item.sourceRawPath), `${label}:unsafe-source-raw-path`);
  expect(isSafeLegacyPath(item.legacySourcePath), `${label}:unsafe-legacy-source-path`);
  expect(isSafeSanitizedPath(item.outputPath), `${label}:unsafe-output-path`);
  expect(!seenOutputs.has(item.outputPath), `${label}:duplicate-output-path`);
  seenOutputs.add(item.outputPath);
  expect(isSha256(item.sourceHash), `${label}:invalid-source-hash`);
  expect(isSha256(item.outputHash), `${label}:invalid-output-hash`);
  expect(item.reviewStatus === "pending-human-review", `${label}:review-status-must-be-pending`);
  expect(item.licenseStatus === "pending-provenance-review", `${label}:license-status-must-be-pending`);
  expect(item.approvalId === null, `${label}:approval-id-must-be-null`);
  expect(item.publicPromotion === false, `${label}:public-promotion-must-be-false`);
  expect(item.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`);
  expect(item.promotionReady === false, `${label}:promotion-ready-must-be-false`);
  expect(!("runtimePath" in item), `${label}:runtime-path-not-allowed`);
  expect(item.requiredGates?.includes("track-level-license-provenance"), `${label}:missing-track-license-gate`);
  expect(item.requiredGates?.includes("human-review"), `${label}:missing-human-review-gate`);
  expect(item.requiredGates?.includes("approved-runtime-record"), `${label}:missing-approved-runtime-record-gate`);
  expect(item.requiredGates?.includes("public-assets-copy"), `${label}:missing-public-assets-copy-gate`);

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

assert(failures.length === 0, `remaining audio review packets invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "remaining-audio-review-packets-ready",
  importJobId,
  batchId,
  reviewItems: reviewItems.length,
  domains: humanReview.reviewDomains.length,
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
  expect(rules?.batchScopedDoesNotModifyFirst31Gate === true, `${label}:must-be-batch-scoped`);
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
  expect(license.legacySourcePath === review.legacySourcePath, `${label}:license-source-path-mismatch`);
  expect(license.sourceHash === review.sourceHash, `${label}:license-source-hash-mismatch`);
  expect(license.outputPath === review.outputPath, `${label}:license-output-path-mismatch`);
  expect(license.outputHash === review.outputHash, `${label}:license-output-hash-mismatch`);
  expect(license.licenseStatus === "pending-provenance-review", `${label}:license-status-must-be-pending`);
  expect(license.approvalId === null, `${label}:license-approval-id-must-be-null`);
  expect(license.attributionRequired === null, `${label}:attribution-required-must-be-null-until-reviewed`);
  expect(license.attributionText === null, `${label}:attribution-text-must-be-null-until-reviewed`);
  expect(license.publicPromotion === false, `${label}:license-public-promotion-must-be-false`);
  expect(license.runtimePromotion === false, `${label}:license-runtime-promotion-must-be-false`);
  expect(license.promotionBlockedBy?.includes("track-level-license-provenance"), `${label}:license-missing-track-license-blocker`);
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
    expect(domain.itemCount === domain.itemIds?.length, `${label}:domain-item-count-mismatch`);
    for (const itemId of domain.itemIds ?? []) {
      expect(itemIds.has(itemId), `${label}:unknown-domain-item:${itemId}`);
      domainItemIds.add(itemId);
    }
    expect(domain.requiredGates?.includes("human-review"), `${label}:domain-missing-human-review-gate`);
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
    record.legacySourcePath,
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

function isSafeRawPath(value) {
  return isSafeReportPath(value) && value.startsWith(`raw/imported/${importJobId}/`);
}

function isSafeLegacyPath(value) {
  return isSafeReportPath(value) && value.startsWith("GoldRush_Old/");
}

function isSafeSanitizedPath(value) {
  return isSafeReportPath(value) && value.startsWith(`sanitized/converted/${importJobId}/remaining-batches/${batchId}/`);
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
