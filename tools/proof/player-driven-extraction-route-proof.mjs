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
const outputRoot = path.resolve(args.out ?? "output/playwright/player-driven-extraction-route-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `player-driven-route-${runId}.json`);
const screenshotPath = path.join(outputRoot, `player-driven-route-${runId}.png`);

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
try {
  browser = await chromium.launch({ headless: args.headed !== "true" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(proofUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
  await page.locator('[data-action="play-title"]').click();
  await page.locator('[data-action="enter-run"]').click();
  await waitForScreen(page, "loading");
  const trainPlacement = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.());
  assert(trainPlacement?.accepted, `train placement should be accepted: ${trainPlacement?.reason ?? "missing"}`);
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  const mining = await page.evaluate(() => {
    const host = window.GoldRushHost;
    const placed = host?.actions?.publicSmokePlaceAtNearestObjectAffordance?.({ action: "mine-gold" });
    if (!placed?.accepted) return { accepted: false, reason: placed?.reason ?? "object-placement-failed", placed };
    let state = host.getState?.();
    for (let index = 0; index < 60; index += 1) {
      state = window.GameHost?.tick?.(0.05, { interact: true });
      if ((state?.extractionLoop?.player?.cargo?.goldDust ?? 0) > 0) break;
    }
    window.GameHost?.tick?.(0.05, { interact: false });
    window.GameHost?.render?.();
    state = host.getState?.();
    return {
      accepted: (state?.extractionLoop?.player?.cargo?.goldDust ?? 0) > 0,
      placed,
      carriedGold: state?.extractionLoop?.player?.cargo?.goldDust ?? 0,
      route: state?.playerDrivenExtractionRoute,
    };
  });
  assert(mining.accepted, `input-driven mining should carry gold: ${mining.reason ?? "no cargo"}`);
  assert(mining.route?.matrix?.resolvedStages?.includes("mine-hold"), "route matrix should resolve mine-hold after input ticks");
  assert(mining.route?.matrix?.resolvedStages?.includes("carry-gold"), "route matrix should resolve carry-gold after input ticks");

  const extraction = await page.evaluate(() => {
    const host = window.GoldRushHost;
    const placed = host?.actions?.publicSmokePlaceAtExtractionSetpiece?.();
    if (!placed?.accepted) return { accepted: false, reason: placed?.reason ?? "cashout-placement-failed", placed };
    let state = host.getState?.();
    for (let index = 0; index < 90; index += 1) {
      state = window.GameHost?.tick?.(0.1, { interact: true });
      if (state?.screen === "results" || state?.extractionLoop?.receipt?.extracted) break;
    }
    window.GameHost?.tick?.(0.05, { interact: false });
    return {
      accepted: Boolean(state?.extractionLoop?.receipt?.extracted || state?.screen === "results"),
      placed,
      screen: state?.screen,
      route: state?.playerDrivenExtractionRoute,
      receipt: state?.extractionLoop?.receipt ?? null,
      protoCompletedIds: state?.protoKitBridge?.protoSnapshot?.route?.completedIds ?? [],
    };
  });
  assert(extraction.accepted, `input-driven cashout should extract: ${extraction.reason ?? "no extraction receipt"}`);
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.screen === "results"
      && state?.playerDrivenExtractionRoute?.matrix?.routeStatus === "resolved";
  }, null, { timeout: timeoutMs });
  await page.screenshot({ path: screenshotPath, fullPage: false });
  const finalState = await page.evaluate(() => window.GoldRushHost?.getState?.());
  const route = finalState.playerDrivenExtractionRoute;

  assert(route.contract === "goldrush-player-driven-extraction-route-v1", "route contract should be exposed in browser state");
  assert(route.domainPath === "n:goldrush:player-driven-extraction-route", "route domain should stay GoldRush-owned");
  assert(route.matrix.routeStatus === "resolved", "browser route matrix should resolve");
  assert(route.matrix.resolvedStages.length === 5, "browser route matrix should resolve all five route stages");
  assert(route.matrix.playerDrivenStages.includes("cashout-hold"), "cashout hold should be marked player-driven");
  assert(finalState.protoKitBridge.protoSnapshot.route.completedIds.includes("cashout-site"), "ProtoKit bridge should see cashout completion");

  report.status = "passed";
  report.checks.push(
    "title-to-run",
    "input-driven-mining",
    "input-driven-cashout",
    "route-matrix-resolved",
    "protokit-route-completed",
  );
  report.finalState = {
    screen: finalState.screen,
    activeSite: finalState.activeSite?.id,
    route,
    receipt: finalState.extractionLoop?.receipt ?? null,
    protoRoute: finalState.protoKitBridge?.protoSnapshot?.route ?? null,
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
    routeStatus: publicReport.finalState?.route?.matrix?.routeStatus ?? null,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function waitForScreen(page, screen) {
  return page.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("playerDrivenRouteProof", Date.now().toString(36));
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
