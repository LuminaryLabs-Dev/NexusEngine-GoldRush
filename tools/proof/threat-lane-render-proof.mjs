import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
  sanitizePathForOutput,
  sanitizedConsoleJson,
  writeSanitizedJsonArtifact,
} from "../safety/publicArtifactSanitizer.mjs";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const baseUrl = args.url ?? "http://127.0.0.1:5177/NexusEngine-GoldRush/";
const proofUrl = withProofParams(baseUrl);
const outputRoot = path.resolve(args.out ?? "output/playwright/threat-lane-render-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `threat-lane-render-${runId}.json`);
const screenshotPath = path.join(outputRoot, `threat-lane-render-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  finalState: null,
  checks: [],
};

let browser;
let page;
try {
  browser = await chromium.launch({ headless: args.headed !== "true" });
  page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(proofUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
  await page.locator('[data-action="play-title"]').click();
  await page.locator('[data-action="enter-run"]').click();
  await waitForScreen(page, "loading");
  await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.());
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  await page.evaluate(() => {
    window.GoldRushHost?.actions?.mine?.();
    window.GoldRushHost?.runtime?.engine?.n?.goldrushExtractionLoop?.setAim?.({ active: true });
    window.GoldRushHost?.actions?.engageCover?.({ threatId: "claim-jumper-01" });
  });
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    const coverId = state?.extractionLoop?.combat?.readability?.coverEngagement?.coverId;
    return state?.extractionLoop?.combat?.readability?.activeLaneIds?.includes("lane.claim-jumper-01")
      && state?.renderer?.procedural?.gameplay?.extractionLoopMarkers?.laneIds?.includes("lane.claim-jumper-01")
      && state?.renderer?.procedural?.gameplay?.extractionLoopMarkers?.coverIds?.some((id) => id.startsWith("cover.claim-jumper-01."))
      && coverId
      && state?.renderer?.procedural?.gameplay?.extractionLoopMarkers?.engagedCoverIds?.includes(coverId);
  }, null, { timeout: timeoutMs });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  const markerSnapshot = state.renderer.procedural.gameplay.extractionLoopMarkers;
  const threatReadability = state.extractionLoop.combat.readability.threats["claim-jumper-01"];
  assert(markerSnapshot.visualContract === "readable-threat-lanes-v1", "renderer marker kit should expose readable threat lane visual contract");
  assert(markerSnapshot.coverContract === "readable-threat-cover-v1", "renderer marker kit should expose readable threat cover visual contract");
  assert(markerSnapshot.laneIds.includes("lane.claim-jumper-01"), "renderer marker kit should create claim-jumper lane mesh");
  assert(markerSnapshot.coverIds.includes(threatReadability.recommendedCoverId), "renderer marker kit should create recommended claim-jumper cover mesh");
  assert(markerSnapshot.engagedCoverIds.includes(state.extractionLoop.combat.readability.coverEngagement.coverId), "renderer marker kit should expose engaged claim-jumper cover mesh");
  assert(threatReadability.telegraph.readableBeforeDamage === true, "active threat should be telegraphed before damage");
  assert(threatReadability.lane.status === "danger", "active threat lane should be danger status");
  assert(threatReadability.cue.visual && threatReadability.cue.audio && threatReadability.cue.shape, "threat readability should retain multisensory cue data");
  assert(threatReadability.cover.some((cover) => cover.status === "available" && cover.blocksLane), "active threat should expose available lane-blocking cover");
  assert(threatReadability.coverEngagement?.engaged === true, "active threat should expose engaged cover counterplay state");

  report.status = "passed";
  report.checks.push(
    "visual-contract",
    "lane-mesh-created",
    "cover-mesh-created",
    "active-threat-telegraph",
    "danger-lane-status",
    "available-cover-counterplay",
    "engaged-cover-counterplay",
    "multisensory-cues",
  );
  report.finalState = {
    markerSnapshot,
    threatReadability,
  };
} catch (error) {
  report.status = "failed";
  report.error = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await browser?.close();
  const publicReport = await writeSanitizedJsonArtifact(reportPath, report, { repoRoot });
  console.log(sanitizedConsoleJson({
    status: publicReport.status,
    report: sanitizePathForOutput(reportPath),
    screenshot: publicReport.screenshot,
    checks: publicReport.checks,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("threatLaneProof", Date.now().toString(36));
  return nextUrl.toString();
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) continue;
    const [key, inlineValue] = arg.slice(2).split("=");
    const value = inlineValue ?? (rawArgs[index + 1]?.startsWith("--") ? true : rawArgs[index + 1]);
    parsed[key] = value ?? true;
    if (inlineValue === undefined && value !== true) index += 1;
  }
  return parsed;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
