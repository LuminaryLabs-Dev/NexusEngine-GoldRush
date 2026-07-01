import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { createApprovalDecisionApplicationPlan } from "../import-sanitize/plan-approval-decision-application.mjs";
import { writeSanitizedJsonArtifactSync } from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const importJobId = "goldrush-dual-source-001";
const sourcePacketDir = `reports/approval-decisions/${importJobId}`;
const fixtureRoot = `.approval-decision-fixtures/${Date.now()}-approved-ready-audio`;
const failures = [];

try {
  createFixturePacketDirectory();
  const report = createApprovalDecisionApplicationPlan({
    generatedAt: "2026-06-30T00:00:00.000Z",
    packetDir: fixtureRoot,
  });

  expect(report.schema === "nexusengine.goldrush.approval-decision-application-plan.v1", "invalid-report-schema");
  expect(report.status === "approval-decision-application-ready", "fixture-status-must-be-ready");
  expect(report.write === false, "fixture-plan-must-not-write-report");
  expect(report.publicPromotion === false, "fixture-must-not-promote-public");
  expect(report.runtimePromotion === false, "fixture-must-not-promote-runtime");
  expect(report.promotionReady === true, "fixture-must-mark-promotion-ready");
  expect(report.totals?.decisionItems === 737, "fixture-decision-items-must-be-737");
  expect(report.totals?.pending === 736, "fixture-pending-must-be-736");
  expect(report.totals?.approvedReady === 1, "fixture-approved-ready-must-be-one");
  expect(report.totals?.rejectedReady === 0, "fixture-rejected-ready-must-be-zero");
  expect(report.totals?.blocked === 0, "fixture-blocked-must-be-zero");
  expect(report.totals?.invalid === 0, "fixture-invalid-must-be-zero");
  expect(report.totals?.publicPromoted === 0, "fixture-public-promoted-must-be-zero");
  expect(report.totals?.runtimePromoted === 0, "fixture-runtime-promoted-must-be-zero");
  expect(report.readyUpdates?.length === 1, "fixture-ready-updates-must-have-one");
  expect(report.blockedItems?.length === 0, "fixture-blocked-items-must-be-empty");

  const ready = report.readyUpdates?.[0] ?? {};
  expect(ready.itemId === "goldrush-dual-source-001.next.001.audio-music-and-sfx.review.003", "fixture-ready-item-id-mismatch");
  expect(ready.owner === "audio-licensing", "fixture-ready-owner-mismatch");
  expect(ready.sourceId === "goldrush-dual-source-001.next.001.audio-music-and-sfx", "fixture-ready-source-mismatch");
  expect(ready.decisionStatus === "approved", "fixture-ready-decision-status-mismatch");
  expect(ready.approvalId === "goldrush-approval-fixture-audio-001", "fixture-ready-approval-id-mismatch");
  expect(ready.nextGate === "approved-runtime-promotion-planner", "fixture-next-gate-mismatch");
  expect(ready.publicPromotion === false, "fixture-ready-public-promotion-must-be-false");
  expect(ready.runtimePromotion === false, "fixture-ready-runtime-promotion-must-be-false");
  expect(!("runtimePath" in ready), "fixture-ready-runtime-path-forbidden");

  assert(failures.length === 0, `approval decision approved fixture invalid: ${failures.join(", ")}`);

  console.log(JSON.stringify({
    status: "approval-decision-approved-fixture-ready",
    importJobId,
    decisionItems: report.totals.decisionItems,
    pending: report.totals.pending,
    approvedReady: report.totals.approvedReady,
    readyItemId: ready.itemId,
    nextGate: ready.nextGate,
    publicPromotion: false,
    runtimePromotion: false,
  }, null, 2));
} finally {
  rmSync(path.join(repoRoot, fixtureRoot), { recursive: true, force: true });
  rmSync(path.join(repoRoot, ".approval-decision-fixtures"), { recursive: true, force: true });
}

function createFixturePacketDirectory() {
  const index = readJson(`${sourcePacketDir}/index.json`);
  const fixtureRefs = [];
  mkdirSync(path.join(repoRoot, fixtureRoot), { recursive: true });

  for (const ref of index.packetRefs ?? []) {
    const packet = readJson(ref.packetPath);
    const fixturePacketPath = `${fixtureRoot}/${path.basename(ref.packetPath)}`;
    if (ref.owner === "audio-licensing") markFirstAudioItemApproved(packet);
    writeSanitizedJsonArtifactSync(path.join(repoRoot, fixturePacketPath), packet, { repoRoot });
    fixtureRefs.push({
      ...ref,
      packetPath: fixturePacketPath,
    });
  }

  writeSanitizedJsonArtifactSync(path.join(repoRoot, fixtureRoot, "index.json"), {
    ...index,
    packetRefs: fixtureRefs,
  }, { repoRoot });
}

function markFirstAudioItemApproved(packet) {
  const item = packet.domains?.[0]?.items?.[0];
  assert(item?.itemId === "goldrush-dual-source-001.next.001.audio-music-and-sfx.review.003", "fixture audio item not found");
  item.reviewerDecision = {
    ...item.reviewerDecision,
    humanDecision: "approved",
    licenseDecision: "approved",
    approvalId: "goldrush-approval-fixture-audio-001",
    attributionRequired: true,
    attributionText: "Fixture attribution for approval pipeline validation only.",
    sourceEvidenceUrl: "https://example.com/goldrush-fixture-source-evidence",
    licenseIdentifier: "CC-BY-4.0",
    reviewerNotes: "Fixture approval proves the application preflight detects approved-ready decisions without mutating canonical packets.",
  };
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

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
