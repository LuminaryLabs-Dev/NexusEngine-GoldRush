import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createAudioCueApprovalPlan } from "../import-sanitize/generate-audio-cue-approval-plan.mjs";
import { sanitizedConsoleJson } from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const batchId = "goldrush-dual-source-001.next.001.audio-music-and-sfx";
const reportPath = "reports/audio-cue-approval/goldrush-train-title-audio-cue-plan.json";
const requiredTargets = new Set([
  "title.music",
  "title.voice",
  "train.arrival",
  "train.door",
  "train.board",
  "train.wait",
  "train.depart",
  "run.exploration",
  "run.combat",
]);
const requiredTrainFallbacks = new Set([
  "train-arrival",
  "train-door",
  "train-board",
  "train-wait",
  "train-depart",
]);
const failures = [];

const absoluteReportPath = path.join(repoRoot, reportPath);
expect(existsSync(absoluteReportPath), "audio-cue-approval-plan-report-missing");
assert(failures.length === 0, `audio cue approval plan invalid: ${failures.join(", ")}`);

const report = readJson(absoluteReportPath);
const generated = createAudioCueApprovalPlan({
  generatedAt: report.generatedAt ?? "STATIC_VALIDATION_TIMESTAMP",
  write: false,
  reportPath,
});

expect(report.schema === "nexusengine.goldrush.audio-cue-approval-plan.v1", "invalid-schema");
expect(report.importJobId === importJobId, "wrong-import-job");
expect(report.batchId === batchId, "wrong-batch");
expect(report.status === "pending-audio-approval-decisions", "wrong-status");
expect(report.publicPromotion === false, "report-must-not-promote-public");
expect(report.runtimePromotion === false, "report-must-not-promote-runtime");
expect(report.rules?.plannerOnly === true, "missing-planner-only-rule");
expect(report.rules?.writesPublicAssets === false, "plan-must-not-write-public-assets");
expect(report.rules?.promotesRuntimeAssets === false, "plan-must-not-promote-runtime-assets");
expect(report.rules?.approvalsMayNotBeInferredFromFilenames === true, "must-not-infer-approval");
expect(report.rules?.approvedRuntimePromotionPlannerRemainsOnlyPromotionBridge === true, "promotion-bridge-rule-missing");
expect(report.rules?.trainCueFallbacksRemainActiveUntilApproval === true, "fallback-rule-missing");
expect(report.rules?.missingSlotsDoNotBlockCurrentBuild === true, "missing-slot-build-rule-missing");
expect(JSON.stringify(report) === JSON.stringify(generated), "report-does-not-match-current-inputs");
expect(!/"runtimePath"\s*:/.test(JSON.stringify(report)), "runtime-path-must-not-appear");

const targets = report.targets ?? [];
expect(targets.length === requiredTargets.size, "target-count-mismatch");
expect(report.totals?.targets === requiredTargets.size, "totals-target-count-mismatch");
expect(report.totals?.targetsWithCandidates === 6, "targets-with-candidates-must-be-6");
expect(report.totals?.missingCandidateTargets === 3, "missing-candidate-targets-must-be-3");
expect(report.totals?.uniqueReviewCandidates === 15, "unique-review-candidates-must-be-15");
expect(report.totals?.approvedCandidates === 0, "approved-candidates-must-be-zero");
expect(report.totals?.publicPromoted === 0, "public-promoted-must-be-zero");
expect(report.totals?.runtimePromoted === 0, "runtime-promoted-must-be-zero");

const seenTargets = new Set();
const seenCandidateIds = new Set();
const seenMissingSlots = new Set((report.missingSlots ?? []).map((slot) => slot.slotId));
for (const target of targets) {
  const label = target.targetId ?? "missing-target-id";
  expect(requiredTargets.has(target.targetId), `${label}:unexpected-target`);
  expect(!seenTargets.has(target.targetId), `${label}:duplicate-target`);
  seenTargets.add(target.targetId);
  expect(hasFilledString(target.slotId), `${label}:missing-slot-id`);
  expect(hasFilledString(target.purpose), `${label}:missing-purpose`);
  expect(hasFilledString(target.desiredCueRole), `${label}:missing-desired-cue-role`);
  expect(hasFilledString(target.fallbackPattern), `${label}:missing-fallback-pattern`);
  expect(target.publicPromotion === false, `${label}:target-public-promotion-must-be-false`);
  expect(target.runtimePromotion === false, `${label}:target-runtime-promotion-must-be-false`);
  if (label.startsWith("train.")) {
    expect(requiredTrainFallbacks.has(target.fallbackPattern), `${label}:missing-distinct-train-fallback`);
  }

  const candidates = target.candidates ?? [];
  expect(target.candidateCount === candidates.length, `${label}:candidate-count-mismatch`);
  expect(target.status === (candidates.length > 0 ? "pending-review-candidates" : "missing-sanitized-candidate"), `${label}:status-mismatch`);
  for (const candidate of candidates) {
    const candidateLabel = `${label}:${candidate.itemId ?? "missing-item-id"}`;
    expect(hasFilledString(candidate.itemId), `${candidateLabel}:missing-item-id`);
    expect(hasFilledString(candidate.slotId), `${candidateLabel}:missing-slot-id`);
    expect(candidate.slotId === target.slotId, `${candidateLabel}:slot-mismatch`);
    expect(isSafeSanitizedAudioPath(candidate.outputPath), `${candidateLabel}:unsafe-output-path`);
    expect(existsSync(path.join(repoRoot, candidate.outputPath)), `${candidateLabel}:output-missing`);
    expect(isSha256(candidate.outputHash), `${candidateLabel}:invalid-output-hash`);
    expect(Number.isInteger(candidate.outputBytes) && candidate.outputBytes > 0, `${candidateLabel}:invalid-output-bytes`);
    expect(candidate.reviewStatus === "pending-human-review", `${candidateLabel}:review-status-must-stay-pending`);
    expect(candidate.licenseStatus === "pending-provenance-review", `${candidateLabel}:license-status-must-stay-pending`);
    expect(hasFilledString(candidate.licenseEvidenceStatus), `${candidateLabel}:missing-license-evidence-status`);
    expect(candidate.approvalId === null, `${candidateLabel}:approval-id-must-stay-null`);
    expect(candidate.promotionReady === false, `${candidateLabel}:promotion-ready-must-be-false`);
    seenCandidateIds.add(candidate.itemId);
  }
}

for (const targetId of requiredTargets) expect(seenTargets.has(targetId), `${targetId}:required-target-missing`);
for (const fallbackPattern of requiredTrainFallbacks) {
  expect(targets.some((target) => target.fallbackPattern === fallbackPattern), `${fallbackPattern}:required-train-fallback-missing`);
}
expect(seenCandidateIds.size === 15, "unique-candidate-id-count-mismatch");
expect(seenMissingSlots.has("goldrush.audio.sfx.goldPickup"), "gold-pickup-slot-gap-missing");
expect(seenMissingSlots.has("goldrush.audio.sfx.ambush"), "ambush-slot-gap-missing");

assert(failures.length === 0, `audio cue approval plan invalid: ${failures.join(", ")}`);

console.log(sanitizedConsoleJson({
  status: "audio-cue-approval-plan-ready",
  importJobId,
  batchId,
  reportPath,
  targets: report.totals.targets,
  targetsWithCandidates: report.totals.targetsWithCandidates,
  missingCandidateTargets: report.totals.missingCandidateTargets,
  uniqueReviewCandidates: report.totals.uniqueReviewCandidates,
  missingSlots: report.missingSlots.map((slot) => slot.slotId),
  publicPromotion: report.publicPromotion,
  runtimePromotion: report.runtimePromotion,
}, { repoRoot }));

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function isSafeSanitizedAudioPath(value) {
  return hasFilledString(value)
    && value.startsWith(`sanitized/converted/${importJobId}/remaining-batches/${batchId}/audio/`)
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isSha256(value) {
  return typeof value === "string" && /^sha256:[a-f0-9]{64}$/.test(value);
}

function hasFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
