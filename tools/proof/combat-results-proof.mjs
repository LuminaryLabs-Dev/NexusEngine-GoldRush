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
const outputRoot = path.resolve(args.out ?? "output/playwright/combat-results-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `combat-results-${runId}.json`);
const screenshotPath = path.join(outputRoot, `combat-results-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  finalState: null,
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
  const placed = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.());
  assert(placed?.accepted, `train placement should be accepted: ${placed?.reason ?? "missing"}`);
  await waitForScreen(page, "run");

  const combatSetup = await page.evaluate(() => {
    const host = window.GoldRushHost;
    const loopApi = host?.runtime?.engine?.n?.goldrushExtractionLoop;
    if (!loopApi) return { accepted: false, reason: "missing-extraction-loop-api" };
    const mine = loopApi.getState().mining.sites["mine-seam-01"];
    loopApi.setPlayerPose({ position: { x: mine.worldPosition.x, y: 0, z: mine.worldPosition.z }, heading: 0 });
    let mineReceipt = null;
    for (let index = 0; index < 8; index += 1) {
      mineReceipt = loopApi.holdMine({ siteId: mine.id, dt: 0.3 });
      if (mineReceipt?.complete) break;
    }
    loopApi.setPlayerPose({ position: { x: -9.5, y: 0, z: -13.4 }, heading: 0 });
    loopApi.setAim({ active: true });
    const shot = loopApi.fire({});
    const damage = loopApi.takeDamage({ amount: 9, reason: "browser-combat-results-proof" });
    const loop = loopApi.getState();
    return {
      accepted: true,
      mineReceipt,
      miningReadability: loop.mining.readability,
      shot,
      damage,
      receiptCount: loop.combat.readability.receipts.length,
      laneIds: loop.combat.readability.activeLaneIds,
    };
  });
  assert(combatSetup.accepted, `combat setup should be accepted: ${combatSetup.reason ?? "unknown"}`);
  assert(combatSetup.mineReceipt?.miningReceipt?.receiptId?.startsWith("mining."), "browser proof mining should return deterministic mining receipt");
  assert(combatSetup.miningReadability?.contract === "goldrush-mining-claim-pressure-v1", "browser proof should expose mining claim pressure contract");
  assert(combatSetup.miningReadability?.lastReceipt?.receiptId === combatSetup.mineReceipt.miningReceipt.receiptId, "browser proof mining readability should preserve last mining receipt");
  assert(combatSetup.miningReadability?.sites?.["mine-seam-01"]?.claimHeat > 0, "browser proof mining readability should expose claim heat");
  assert(combatSetup.receiptCount >= 2, "combat setup should create shot and damage receipts");
  assert(combatSetup.laneIds.includes("lane.claim-jumper-01"), "combat setup should expose claim-jumper lane");

  const resultReceipt = await page.evaluate(async () => window.GoldRushHost?.actions?.publicSmokeCompleteRunToResults?.() ?? { accepted: false, reason: "missing-action" });
  assert(resultReceipt.accepted, `result completion should be accepted: ${resultReceipt.reason ?? "unknown"}`);
  await waitForScreen(page, "results");
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.results?.status === "final"
      && state?.results?.combatOutcomeSummary?.receiptCount >= 2
      && state?.replaySummary?.keyMoments?.some((moment) => moment.type === "combatDamageTaken" && moment.laneId === "lane.claim-jumper-01");
  }, null, { timeout: timeoutMs });

  const resultsText = await page.locator('[data-screen-panel="results"]').innerText({ timeout: timeoutMs });
  await page.screenshot({ path: screenshotPath, fullPage: false });
  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  assert(/Combat/i.test(resultsText), "results screen should include a Combat field");
  assert(/receipt/i.test(resultsText), "results screen should include combat receipt count");
  assert(/damage/i.test(resultsText), "results screen should include combat damage");
  assert(/Under Fire Extractor/i.test(resultsText), "results screen should include under-fire award");
  assert(/Claim Jumper/i.test(resultsText), "results replay should expose a readable combat lane label");
  assert(!/lane\.claim-jumper-01/i.test(resultsText), "results screen should not leak raw combat lane ids");
  assert(!/claim-jumper-01/i.test(resultsText), "results screen should not leak raw threat ids");
  assert(state.results.combatOutcomeSummary.contract === "goldrush-combat-outcome-summary-v1", "result state should expose combat outcome contract");
  assert(state.results.combatOutcomeSummary.damageTaken >= 9, "result state should preserve damage taken");
  assert(state.results.awards.some((award) => award.id === "award.under-fire-extractor"), "result state should award under-fire extraction");

  report.status = "passed";
  report.checks.push(
    "combat-receipts-created",
    "mining-claim-pressure-visible",
    "mining-receipt-created",
    "results-combat-field-visible",
    "under-fire-award-visible",
    "combat-replay-lane-visible",
    "kit-result-state-contract",
  );
  report.finalState = summarizeState(state);
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
    finalState: publicReport.finalState,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function summarizeState(state) {
  return {
    screen: state?.screen,
    activeSite: state?.activeSite?.id,
    results: {
      status: state?.results?.status,
      winner: state?.results?.winner,
      combatOutcomeSummary: state?.results?.combatOutcomeSummary,
      awards: state?.results?.awards?.map((award) => award.id) ?? [],
    },
    replaySummary: {
      combatOutcomeSummary: state?.replaySummary?.combatOutcomeSummary,
      combatMomentCount: state?.replaySummary?.keyMoments?.filter((moment) => String(moment.type).startsWith("combat")).length ?? 0,
    },
  };
}

function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("combatResultsProof", Date.now().toString(36));
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
