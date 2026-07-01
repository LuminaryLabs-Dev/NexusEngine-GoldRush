import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  sanitizedConsoleJson,
  writeSanitizedJsonArtifactSync,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const batchId = "goldrush-dual-source-001.next.001.audio-music-and-sfx";
const humanReviewPath = `reports/human-review/remaining-batches/${batchId}-request.json`;
const licenseProvenancePath = `reports/license-provenance/remaining-batches/${batchId}.json`;
const defaultReportPath = "reports/audio-cue-approval/goldrush-train-title-audio-cue-plan.json";

const runtimeCueTargets = [
  {
    targetId: "title.music",
    slotId: "goldrush.audio.music.titleIntro",
    purpose: "Title screen and main-menu bed.",
    priority: "P0",
    desiredCueRole: "title-intro",
    fallbackPattern: "title",
  },
  {
    targetId: "title.voice",
    slotId: "goldrush.audio.voice.titleIntro",
    purpose: "Title voice callout plus train arrival/departure placeholder voice slot.",
    priority: "P0",
    desiredCueRole: "title-voice",
    fallbackPattern: "title",
  },
  {
    targetId: "train.arrival",
    slotId: "goldrush.audio.voice.titleIntro",
    purpose: "Readable train arrival callout in the loading yard.",
    priority: "P0",
    desiredCueRole: "title-voice",
    fallbackPattern: "train-arrival",
  },
  {
    targetId: "train.door",
    slotId: "goldrush.audio.sfx.goldPickup",
    purpose: "Distinct train door opening cue.",
    priority: "P0",
    desiredCueRole: "short-mechanical-sfx",
    fallbackPattern: "train-door",
  },
  {
    targetId: "train.board",
    slotId: "goldrush.audio.sfx.goldPickup",
    purpose: "Player board-now confirmation cue.",
    priority: "P0",
    desiredCueRole: "short-confirmation-sfx",
    fallbackPattern: "train-board",
  },
  {
    targetId: "train.wait",
    slotId: "goldrush.audio.sfx.ambush",
    purpose: "Party readiness wait cue while boarded players wait for the active roster.",
    priority: "P1",
    desiredCueRole: "low-attention-wait-sfx",
    fallbackPattern: "train-wait",
  },
  {
    targetId: "train.depart",
    slotId: "goldrush.audio.voice.titleIntro",
    purpose: "Train departure callout after boarding readiness releases.",
    priority: "P0",
    desiredCueRole: "title-voice",
    fallbackPattern: "train-depart",
  },
  {
    targetId: "run.exploration",
    slotId: "goldrush.audio.music.wandering",
    purpose: "Exploration/wandering gold-field music.",
    priority: "P1",
    desiredCueRole: "exploration-bed",
    fallbackPattern: "wandering",
  },
  {
    targetId: "run.combat",
    slotId: "goldrush.audio.music.combat",
    purpose: "Combat pressure music layer.",
    priority: "P1",
    desiredCueRole: "combat-intensity",
    fallbackPattern: "combat",
  },
];

export function createAudioCueApprovalPlan({
  generatedAt = new Date().toISOString(),
  write = false,
  reportPath = defaultReportPath,
} = {}) {
  const humanReview = readJson(humanReviewPath);
  const licenseProvenance = readJson(licenseProvenancePath);
  const licenseByItemId = new Map((licenseProvenance.items ?? []).map((item) => [item.itemId, item]));
  const reviewItems = humanReview.items ?? [];
  const itemsBySlot = groupBy(reviewItems, (item) => item.slotId);
  const targets = runtimeCueTargets.map((target) => {
    const candidates = (itemsBySlot.get(target.slotId) ?? []).map((item) => {
      const license = licenseByItemId.get(item.itemId);
      return {
        itemId: item.itemId,
        slotId: item.slotId,
        cueRole: item.cueRole,
        mediaKind: item.mediaKind,
        legacySourcePath: item.legacySourcePath,
        outputPath: item.outputPath,
        outputHash: item.outputHash,
        outputBytes: item.outputBytes,
        mediaType: item.mediaType,
        reviewStatus: item.reviewStatus,
        licenseStatus: license?.licenseStatus ?? "missing-license-item",
        licenseEvidenceStatus: license?.licenseEvidenceStatus ?? "missing-license-item",
        approvalId: item.approvalId ?? null,
        promotionReady: false,
      };
    });
    return {
      ...target,
      status: candidates.length > 0 ? "pending-review-candidates" : "missing-sanitized-candidate",
      candidateCount: candidates.length,
      candidates,
      requiredNextGates: candidates.length > 0
        ? [
          "audio-identity-review",
          "track-level-license-provenance",
          "explicit-human-approval",
          "matching-approval-id",
          "approved-runtime-promotion-planner",
        ]
        : [
          "copy-or-map-source-audio",
          "sanitized-browser-ready-audio",
          "review-packet",
          "license-provenance-packet",
        ],
      publicPromotion: false,
      runtimePromotion: false,
    };
  });

  const report = {
    schema: "nexusengine.goldrush.audio-cue-approval-plan.v1",
    version: "0.1.0",
    importJobId,
    batchId,
    generatedAt,
    status: "pending-audio-approval-decisions",
    publicPromotion: false,
    runtimePromotion: false,
    sources: {
      humanReview: humanReviewPath,
      licenseProvenance: licenseProvenancePath,
    },
    rules: {
      plannerOnly: true,
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      approvalsMayNotBeInferredFromFilenames: true,
      approvedRuntimePromotionPlannerRemainsOnlyPromotionBridge: true,
      trainCueFallbacksRemainActiveUntilApproval: true,
      missingSlotsDoNotBlockCurrentBuild: true,
    },
    totals: {
      targets: targets.length,
      targetsWithCandidates: targets.filter((target) => target.candidateCount > 0).length,
      missingCandidateTargets: targets.filter((target) => target.candidateCount === 0).length,
      uniqueReviewCandidates: new Set(targets.flatMap((target) => target.candidates.map((candidate) => candidate.itemId))).size,
      approvedCandidates: 0,
      publicPromoted: 0,
      runtimePromoted: 0,
    },
    targets,
    missingSlots: targets
      .filter((target) => target.candidateCount === 0)
      .map((target) => ({
        targetId: target.targetId,
        slotId: target.slotId,
        purpose: target.purpose,
        fallbackPattern: target.fallbackPattern,
      })),
  };

  validatePlan(report, { humanReview, licenseProvenance });
  if (write) writeSanitizedJsonArtifactSync(path.join(repoRoot, normalizeRepoPath(reportPath)), report, { repoRoot });
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createAudioCueApprovalPlan(args);
  console.log(sanitizedConsoleJson({
    status: report.status,
    importJobId,
    batchId,
    write: args.write,
    report: args.write ? (args.reportPath ?? defaultReportPath) : null,
    targets: report.totals.targets,
    targetsWithCandidates: report.totals.targetsWithCandidates,
    missingCandidateTargets: report.totals.missingCandidateTargets,
    publicPromotion: report.publicPromotion,
    runtimePromotion: report.runtimePromotion,
  }, { repoRoot }));
}

function validatePlan(report, { humanReview, licenseProvenance }) {
  const failures = [];
  expect(humanReview.importJobId === importJobId, "wrong-human-review-job", failures);
  expect(licenseProvenance.importJobId === importJobId, "wrong-license-provenance-job", failures);
  expect(humanReview.publicPromotion === false, "human-review-must-not-promote-public", failures);
  expect(licenseProvenance.publicPromotion === false, "license-must-not-promote-public", failures);
  expect(report.publicPromotion === false, "plan-must-not-promote-public", failures);
  expect(report.runtimePromotion === false, "plan-must-not-promote-runtime", failures);
  expect(report.targets.length === runtimeCueTargets.length, "target-count-mismatch", failures);
  for (const target of report.targets) {
    expect(hasFilledString(target.targetId), "missing-target-id", failures);
    expect(hasFilledString(target.slotId), `${target.targetId}:missing-slot-id`, failures);
    expect(hasFilledString(target.fallbackPattern), `${target.targetId}:missing-fallback-pattern`, failures);
    expect(target.publicPromotion === false, `${target.targetId}:must-not-promote-public`, failures);
    expect(target.runtimePromotion === false, `${target.targetId}:must-not-promote-runtime`, failures);
    for (const candidate of target.candidates) {
      expect(isSafeReviewOutputPath(candidate.outputPath), `${target.targetId}:${candidate.itemId}:unsafe-output-path`, failures);
      expect(!("runtimePath" in candidate), `${target.targetId}:${candidate.itemId}:runtime-path-forbidden`, failures);
      expect(candidate.reviewStatus === "pending-human-review", `${target.targetId}:${candidate.itemId}:review-status-must-stay-pending`, failures);
      expect(candidate.licenseStatus === "pending-provenance-review", `${target.targetId}:${candidate.itemId}:license-status-must-stay-pending`, failures);
      expect(candidate.approvalId === null, `${target.targetId}:${candidate.itemId}:approval-id-must-stay-null`, failures);
    }
  }
  expect(report.missingSlots.some((slot) => slot.slotId === "goldrush.audio.sfx.goldPickup"), "gold-pickup-sfx-gap-should-be-visible", failures);
  expect(report.missingSlots.some((slot) => slot.slotId === "goldrush.audio.sfx.ambush"), "ambush-sfx-gap-should-be-visible", failures);
  assert(failures.length === 0, `audio cue approval plan invalid: ${failures.join(", ")}`);
}

function groupBy(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--report") args.reportPath = argv[++index];
    else if (arg === "--write") args.write = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(repoRoot, normalizeRepoPath(relPath)), "utf8"));
}

function normalizeRepoPath(value) {
  assert(hasFilledString(value), "path is required");
  assert(!value.startsWith("/"), `absolute path is not allowed: ${value}`);
  assert(!value.includes("\\"), `backslash path is not allowed: ${value}`);
  assert(!value.includes("\0"), "null byte path is not allowed");
  assert(!value.split("/").includes(".."), `path traversal is not allowed: ${value}`);
  assert(!/^(https?:|data:|blob:|file:|\/\/)/i.test(value), `url path is not allowed: ${value}`);
  return value;
}

function isSafeReviewOutputPath(value) {
  return hasFilledString(value)
    && value.startsWith(`sanitized/converted/${importJobId}/`)
    && !value.includes("/metadata/")
    && !value.includes("/external-conversion/")
    && !value.includes("/review-only/")
    && existsSync(path.join(repoRoot, normalizeRepoPath(value)));
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
