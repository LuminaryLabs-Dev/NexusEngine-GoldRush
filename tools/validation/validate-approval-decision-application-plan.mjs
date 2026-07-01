import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const reportPath = `reports/approval-decisions/${importJobId}/application-plan.json`;
const failures = [];

expect(existsSync(path.join(repoRoot, reportPath)), "approval-decision-application-plan-missing");
assert(failures.length === 0, `approval decision application plan invalid: ${failures.join(", ")}`);

const report = readJson(reportPath);

expect(report.schema === "nexusengine.goldrush.approval-decision-application-plan.v1", "invalid-schema");
expect(report.importJobId === importJobId, "wrong-import-job");
expect(report.status === "approval-decision-application-noop", "current-plan-must-be-noop");
expect(report.write === true, "plan-report-must-be-written-by-generator");
expect(report.publicPromotion === false, "public-promotion-must-be-false");
expect(report.runtimePromotion === false, "runtime-promotion-must-be-false");
expect(report.promotionReady === false, "promotion-ready-must-be-false");
expect(report.rules?.writesPublicAssets === false, "must-not-write-public-assets");
expect(report.rules?.promotesRuntimeAssets === false, "must-not-promote-runtime");
expect(report.rules?.preflightOnly === true, "must-be-preflight-only");
expect(report.rules?.mutatesReviewPackets === false, "must-not-mutate-review-packets");
expect(report.rules?.requiresHumanDecisionApproved === true, "must-require-human-approved");
expect(report.rules?.requiresLicenseDecisionApproved === true, "must-require-license-approved");
expect(report.rules?.requiresMatchingApprovalId === true, "must-require-matching-approval-id");
expect(report.rules?.requiresSourceEvidenceUrl === true, "must-require-source-evidence-url");
expect(report.rules?.requiresLicenseIdentifier === true, "must-require-license-identifier");
expect(report.rules?.requiresAttributionWhenRequired === true, "must-require-attribution");
expect(report.rules?.canonicalReviewPacketsRemainPendingUntilSeparateApprovedWrite === true, "must-keep-canonical-review-pending");

expect(report.sources?.length === 2, "source-count-must-be-2");
for (const source of report.sources ?? []) {
  expect(hasFilledString(source.sourceId), "source-missing-id");
  expect(isSafeReportPath(source.humanReview), `${source.sourceId}:unsafe-human-review-path`);
  expect(isSafeReportPath(source.licenseProvenance), `${source.sourceId}:unsafe-license-path`);
  expect(existsSync(path.join(repoRoot, source.humanReview)), `${source.sourceId}:human-review-missing`);
  expect(existsSync(path.join(repoRoot, source.licenseProvenance)), `${source.sourceId}:license-provenance-missing`);
}

expect(report.totals?.decisionItems === 737, "decision-items-must-be-737");
expect(report.totals?.pending === 737, "pending-must-be-737");
expect(report.totals?.approvedReady === 0, "approved-ready-must-be-zero");
expect(report.totals?.rejectedReady === 0, "rejected-ready-must-be-zero");
expect(report.totals?.blocked === 0, "blocked-must-be-zero");
expect(report.totals?.invalid === 0, "invalid-must-be-zero");
expect(report.totals?.publicPromoted === 0, "public-promoted-must-be-zero");
expect(report.totals?.runtimePromoted === 0, "runtime-promoted-must-be-zero");
expect(Array.isArray(report.readyUpdates) && report.readyUpdates.length === 0, "ready-updates-must-be-empty");
expect(Array.isArray(report.blockedItems) && report.blockedItems.length === 0, "blocked-items-must-be-empty");

const serialized = JSON.stringify(report);
expect(!/"runtimePath"\s*:/.test(serialized), "must-not-contain-runtime-path");
expect(!/"publicPromotion"\s*:\s*true/.test(serialized), "must-not-public-promote");
expect(!/"runtimePromotion"\s*:\s*true/.test(serialized), "must-not-runtime-promote");
expect(!/"approvalId"\s*:\s*"[^"]+"/.test(serialized), "must-not-contain-filled-approval-id");
expect(!/"humanDecision"\s*:\s*"approved"/.test(serialized), "must-not-contain-approved-human-decision");
expect(!/"licenseDecision"\s*:\s*"approved"/.test(serialized), "must-not-contain-approved-license-decision");

assert(failures.length === 0, `approval decision application plan invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "approval-decision-application-plan-ready",
  importJobId,
  decisionItems: report.totals.decisionItems,
  pending: report.totals.pending,
  approvedReady: report.totals.approvedReady,
  rejectedReady: report.totals.rejectedReady,
  publicPromotion: false,
  runtimePromotion: false,
}, null, 2));

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

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
