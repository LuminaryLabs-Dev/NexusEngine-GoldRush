import { createApprovedRuntimePromotionPlan } from "../import-sanitize/promote-approved-runtime-assets.mjs";

const reportPath = "reports/promotion/goldrush-approved-runtime-promotion-plan.json";
const failures = [];

const report = createApprovedRuntimePromotionPlan({
  generatedAt: "STATIC_VALIDATION_TIMESTAMP",
  write: false,
  reportPath,
  writeReport: false,
});

expect(report.schema === "nexusengine.goldrush.approved-runtime-promotion-plan.v1", "invalid-schema");
expect(report.importJobId === "goldrush-dual-source-001", "wrong-import-job");
expect(report.write === false, "validator-must-not-write-runtime-assets");
expect(report.publicPromotion === false, "validator-must-not-promote-public-assets");
expect(report.runtimePromotion === false, "validator-must-not-promote-runtime-assets");
expect(report.totals.approvedRecords === 0, "current-review-packets-should-not-have-approved-records");
expect(report.totals.blockedItems >= 31, "current-review-packets-should-still-be-blocked");
expect(report.rules.requiresHumanApproval === true, "missing-human-approval-rule");
expect(report.rules.requiresLicenseApproval === true, "missing-license-approval-rule");
expect(report.rules.writesOnlyWithExplicitConfirmation === true, "missing-explicit-write-confirmation-rule");

assert(failures.length === 0, `approved runtime promotion validation failed: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "approved-runtime-promotion-gate-ready",
  importJobId: report.importJobId,
  reviewPairs: report.reviewPairs,
  approvedRecords: report.totals.approvedRecords,
  blockedItems: report.totals.blockedItems,
  publicPromotion: report.publicPromotion,
  runtimePromotion: report.runtimePromotion,
}, null, 2));

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
