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
const outputRoot = path.resolve(args.out ?? "output/playwright/final-rush-results-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const viewport = parseViewport(args.viewport) ?? { width: 1440, height: 900 };
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `final-rush-results-${runId}.json`);
const screenshotPath = path.join(outputRoot, `final-rush-results-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  viewport,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  finalState: null,
};

let browser;
let page;
try {
  browser = await chromium.launch({ headless: args.headed !== "true" });
  page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(proofUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
  await page.locator('[data-action="play-title"]').click();
  await page.locator('[data-action="enter-run"]').click();
  await waitForScreen(page, "loading");
  const placed = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.());
  assert(placed?.accepted, `train placement should be accepted: ${placed?.reason ?? "missing"}`);
  await waitForScreen(page, "run");

  const finalRushSetup = await page.evaluate(() => {
    const host = window.GoldRushHost;
    if (!host?.runtime?.startFinalRush) return { accepted: false, reason: "missing-start-final-rush" };
    host.runtime.startFinalRush();
    const state = host.getState();
    return {
      accepted: state.finalRush?.status !== "idle",
      status: state.finalRush?.status,
      phase: state.finalRush?.phase,
      pressureScalar: state.finalRush?.pressureScalar,
    };
  });
  assert(finalRushSetup.accepted, `final rush should arm before proof extraction: ${finalRushSetup.reason ?? finalRushSetup.status ?? "unknown"}`);

  const resultReceipt = await page.evaluate(async () => {
    return window.GoldRushHost?.actions?.publicSmokeCompleteRunToResults?.() ?? { accepted: false, reason: "missing-action" };
  });
  assert(resultReceipt.accepted, `result completion should be accepted: ${resultReceipt.reason ?? "unknown"}`);
  await waitForScreen(page, "results");
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.results?.status === "final"
      && state?.results?.finalRushPressureSummary?.contract === "goldrush-final-rush-result-summary-v1"
      && state?.results?.finalRushPressureSummary?.pressureLinkedReceiptCount >= 1
      && state?.results?.awards?.some((award) => award.id === "award.collapse-cashout");
  }, null, { timeout: timeoutMs });

  const resultsText = await page.locator('[data-screen-panel="results"]').innerText({ timeout: timeoutMs });
  await page.screenshot({ path: screenshotPath, fullPage: false });
  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  const finalRush = state.results.finalRushPressureSummary;

  assert(/Rush/i.test(resultsText), "results screen should include a Rush field");
  assert(/Pressure/i.test(resultsText), "results screen should label final-rush cashout pressure");
  assert(/Collapse/i.test(resultsText), "results screen should explain collapse pressure");
  assert(/Collapse Cashout/i.test(resultsText), "results screen should show collapse cashout award");
  assert(!/\b1\s+03\b/i.test(resultsText), "results screen should not split decimal multipliers into id-like words");
  assert(/rush\s+[0-9]/i.test(resultsText), "replay moments should show final-rush pressure");
  assert(!/gold\.zone\./i.test(resultsText), "visible result text should not leak raw gold-zone ids");
  assert(!/claim-jumper-01/i.test(resultsText), "visible result text should not leak raw threat ids");
  assert(!/rail-depot-extract-01/i.test(resultsText), "visible result text should not leak raw cashout site ids");
  assert(finalRush.pressureLinkedReceiptCount >= 1, "result state should count pressure-linked receipts");
  assert(finalRush.maxMultiplier > 1, "result state should expose pressure multiplier");
  assert(finalRush.pressuredGoldZoneIds.includes("gold.zone.west-drywash"), "result state should keep stable gold-zone id in data");
  assert(!/gold\.zone\./i.test(finalRush.readout), "result readout should be player-facing, not a raw domain id");
  assert(state.replaySummary.finalRushPressureSummary.pressureLinkedReceiptCount >= 1, "replay should preserve final-rush summary");
  assert(state.replaySummary.keyMoments.some((moment) => Number(moment.finalRushPressure ?? 0) > 0), "replay moments should preserve final-rush pressure");
  assert(state.results.awards.some((award) => award.id === "award.collapse-cashout"), "result state should award collapse cashout");
  const actionVisibility = await page.evaluate(() => {
    return ["results-lobby", "results-next-run"].map((action) => {
      const element = document.querySelector(`[data-action="${action}"]`);
      const rect = element?.getBoundingClientRect();
      return {
        action,
        visible: Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom <= window.innerHeight && rect.top >= 0),
        touchSized: Boolean(rect && rect.width >= 48 && rect.height >= 48),
        width: Number(rect?.width?.toFixed(1) ?? 0),
        height: Number(rect?.height?.toFixed(1) ?? 0),
        top: Number(rect?.top?.toFixed(1) ?? 0),
        bottom: Number(rect?.bottom?.toFixed(1) ?? 0),
        viewportHeight: window.innerHeight,
      };
    });
  });
  assert(actionVisibility.every((entry) => entry.visible), `result actions should be visible in first viewport: ${JSON.stringify(actionVisibility)}`);
  assert(actionVisibility.every((entry) => entry.touchSized), `result actions should meet 48px touch target size: ${JSON.stringify(actionVisibility)}`);
  const actionSpacing = page.viewportSize().width <= 760
    ? await page.evaluate(() => {
      const lobby = document.querySelector('[data-action="results-lobby"]')?.getBoundingClientRect();
      const next = document.querySelector('[data-action="results-next-run"]')?.getBoundingClientRect();
      return {
        gap: Number(((next?.top ?? 0) - (lobby?.bottom ?? 0)).toFixed(1)),
        passed: Boolean(lobby && next && (next.top - lobby.bottom) >= 8),
      };
    })
    : { gap: null, passed: true };
  assert(actionSpacing.passed, `mobile result actions should have at least 8px vertical spacing: ${JSON.stringify(actionSpacing)}`);
  const statOverflow = await page.evaluate(() => {
    return [...document.querySelectorAll(".resultStat")].map((card, index) => {
      const value = card.querySelector("strong");
      const cardRect = card.getBoundingClientRect();
      const valueRect = value?.getBoundingClientRect();
      return {
        index,
        text: value?.textContent ?? "",
        contained: Boolean(valueRect && valueRect.left >= cardRect.left && valueRect.right <= cardRect.right + 0.5),
        truncated: Boolean(value && value.scrollWidth > value.clientWidth + 1),
        cardRight: Number(cardRect.right.toFixed(1)),
        valueRight: Number(valueRect?.right?.toFixed(1) ?? 0),
      };
    });
  });
  assert(statOverflow.every((entry) => entry.contained), `result stat values should stay inside their cards: ${JSON.stringify(statOverflow)}`);
  assert(statOverflow.every((entry) => !entry.truncated), `result stat values should not be visually truncated: ${JSON.stringify(statOverflow)}`);
  const reflow = await page.evaluate(() => {
    const shell = document.querySelector('[data-screen-panel="results"]');
    const viewportWidth = window.innerWidth;
    const overflowElements = [...document.querySelectorAll('[data-screen-panel="results"] *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className,
          text: String(element.textContent ?? "").trim().slice(0, 32),
          left: Number(rect.left.toFixed(1)),
          right: Number(rect.right.toFixed(1)),
        };
      })
      .filter((entry) => entry.left < -0.5 || entry.right > viewportWidth + 0.5)
      .slice(0, 8);
    return {
      viewportWidth,
      documentWidth: document.documentElement.scrollWidth,
      panelWidth: shell?.scrollWidth ?? 0,
      horizontalOverflow: document.documentElement.scrollWidth > viewportWidth + 1,
      overflowElements,
    };
  });
  assert(!reflow.horizontalOverflow, `results screen should not horizontally overflow viewport: ${JSON.stringify(reflow)}`);
  assert(reflow.overflowElements.length === 0, `results screen elements should reflow inside viewport: ${JSON.stringify(reflow.overflowElements)}`);

  report.status = "passed";
  report.checks.push(
    "final-rush-armed",
    "pressure-linked-extraction-result",
    "collapse-cashout-award-visible",
    "replay-pressure-visible",
    "player-facing-readout-sanitized",
    "stable-domain-ids-kept-in-state",
    "result-actions-first-viewport-visible",
    "result-actions-touch-target-sized",
    "result-actions-mobile-spaced",
    "result-stat-values-contained",
    "result-stat-values-not-truncated",
    "result-reflow-no-horizontal-overflow",
  );
  report.finalState = summarizeState(state);
  report.actionVisibility = actionVisibility;
  report.actionSpacing = actionSpacing;
  report.statOverflow = statOverflow;
  report.reflow = reflow;
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
      finalRushPressureSummary: state?.results?.finalRushPressureSummary,
      awards: state?.results?.awards?.map((award) => award.id) ?? [],
    },
    replaySummary: {
      finalRushPressureSummary: state?.replaySummary?.finalRushPressureSummary,
      pressureMomentCount: state?.replaySummary?.keyMoments?.filter((moment) => Number(moment.finalRushPressure ?? 0) > 0).length ?? 0,
    },
  };
}

function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("finalRushResultsProof", Date.now().toString(36));
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

function parseViewport(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d+)x(\d+)$/i);
  if (!match) throw new Error(`invalid viewport format: ${value}`);
  return { width: Number(match[1]), height: Number(match[2]) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
