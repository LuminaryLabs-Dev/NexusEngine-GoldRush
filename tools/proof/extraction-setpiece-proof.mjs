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
const outputRoot = path.resolve(args.out ?? "output/playwright/extraction-setpiece-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `extraction-setpiece-${runId}.json`);
const screenshotPath = path.join(outputRoot, `extraction-setpiece-${runId}.png`);

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
  const trainPlacement = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.());
  assert(trainPlacement?.accepted, `train placement should be accepted: ${trainPlacement?.reason ?? "missing"}`);
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  const miningSetup = await page.evaluate(() => {
    const host = window.GoldRushHost;
    const placed = host?.actions?.publicSmokePlaceAtNearestObjectAffordance?.({ action: "mine-gold" });
    if (!placed?.accepted) return { accepted: false, reason: placed?.reason ?? "object-affordance-placement-failed", placed };
    let receipt = null;
    for (let index = 0; index < 8; index += 1) {
      receipt = host.actions.interact();
      if (receipt?.receipt?.complete) break;
    }
    window.GameHost?.render?.();
    return {
      accepted: Boolean(receipt?.accepted && receipt?.receipt?.complete),
      reason: receipt?.receipt?.reason ?? receipt?.reason ?? null,
      placed,
      miningReceiptId: receipt?.receipt?.miningReceipt?.receiptId ?? null,
      carriedGold: host.getState?.().extractionLoop?.player?.cargo?.goldDust ?? 0,
    };
  });
  assert(miningSetup.accepted, `mining setup should complete before extraction proof: ${miningSetup.reason ?? "unknown"}`);
  assert(miningSetup.carriedGold > 0, "player should carry gold before proving ready cashout landmark");

  const extractionPlacement = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtExtractionSetpiece?.());
  assert(extractionPlacement?.accepted, `extraction setpiece placement should be accepted: ${extractionPlacement?.reason ?? "missing"}`);
  const holdReceipt = await page.evaluate(() => window.GoldRushHost?.actions?.extract?.());
  assert(holdReceipt?.accepted, `cashout hold should be accepted at the setpiece: ${holdReceipt?.reason ?? "missing"}`);
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    const markerSnapshot = state?.renderer?.procedural?.gameplay?.extractionLoopMarkers;
    const setpiece = markerSnapshot?.extractionSetpiece;
    const interactionCue = markerSnapshot?.extractionInteractionCue;
    return setpiece?.contract === "goldrush-extraction-setpiece-v1"
      && setpiece?.primary?.hasVerticalSilhouette === true
      && setpiece?.primary?.hasSmokeCue === true
      && setpiece?.primary?.hasRailLanguage === true
      && interactionCue?.contract === "goldrush-extraction-interaction-cue-v1"
      && interactionCue?.primary?.holdState === "holding"
      && interactionCue?.primary?.progress > 0
      && state?.localPlayer?.look?.movementRelativeToCamera === true
      && state?.localPlayer?.inputModel?.id === "camera-relative-wasd";
  }, null, { timeout: timeoutMs });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  const markerSnapshot = state.renderer.procedural.gameplay.extractionLoopMarkers;
  const extractionCashoutCue = markerSnapshot.extractionCue;
  const extractionSetpiece = markerSnapshot.extractionSetpiece;
  const extractionInteractionCue = markerSnapshot.extractionInteractionCue;
  const localPlayer = state.localPlayer;

  assert(extractionCashoutCue.contract === "goldrush-extraction-cashout-cue-v1", "cashout cue should remain present");
  assert(extractionCashoutCue.primary?.inRange === true && extractionCashoutCue.primary?.active === true, "cashout cue should be active and in range after starting the hold");
  assert(extractionSetpiece.contract === "goldrush-extraction-setpiece-v1", "setpiece contract should remain present");
  assert(extractionSetpiece.domainPath === "n:render:micro-object-instancing", "setpiece should be renderer-owned");
  assert(extractionSetpiece.primary?.markerId === extractionCashoutCue.primary?.markerId, "setpiece should frame the same primary extraction marker as the cashout cue");
  assert(extractionSetpiece.primary?.hasVerticalSilhouette === true, "setpiece should prove vertical silhouette");
  assert(extractionSetpiece.primary?.hasSmokeCue === true, "setpiece should prove smoke cue");
  assert(extractionSetpiece.primary?.hasRailLanguage === true, "setpiece should prove rail language");
  assert(extractionSetpiece.primary?.hasCashoutBell === true, "setpiece should prove cashout bell");
  assert(extractionInteractionCue.contract === "goldrush-extraction-interaction-cue-v1", "extraction interaction cue should be present");
  assert(extractionInteractionCue.domainPath === "n:render:micro-object-instancing", "extraction interaction cue should stay renderer-owned");
  assert(extractionInteractionCue.consumes?.includes("n:gameplay:extraction"), "interaction cue should consume gameplay extraction state");
  assert(extractionInteractionCue.primary?.inRange === true, "interaction cue should prove the player is in the cashout volume");
  assert(extractionInteractionCue.primary?.active === true, "interaction cue should prove cashout hold is active");
  assert(extractionInteractionCue.primary?.holdState === "holding", "interaction cue should expose holding state");
  assert(extractionInteractionCue.primary?.progress > 0, "interaction cue should expose cashout hold progress");
  assert(extractionInteractionCue.primary?.nextAction === "keep-holding-cashout", "interaction cue should tell the player to keep holding");
  assert(localPlayer.look?.movementRelativeToCamera === true, "player view should remain camera-relative");
  assert(localPlayer.inputModel?.wasdFollowsCameraYaw === true, "WASD should still follow camera yaw");

  report.status = "passed";
  report.checks.push(
    "mining-before-cashout-proof",
    "proof-placement-at-extraction-setpiece",
    "cashout-cue-ready",
    "setpiece-contract",
    "setpiece-composes-cashout-marker",
    "vertical-silhouette-proof",
    "smoke-cue-proof",
    "rail-language-proof",
    "cashout-bell-proof",
    "cashout-interaction-cue-contract",
    "cashout-hold-progress-proof",
    "cashout-next-action-proof",
    "camera-relative-player-view",
  );
  report.finalState = {
    screen: state.screen,
    activeSite: state.activeSite?.id,
    miningReceiptId: miningSetup.miningReceiptId,
    extractionPlacement,
    localPlayer: {
      position: localPlayer.position,
      look: localPlayer.look,
      inputModel: localPlayer.inputModel,
      ground: localPlayer.ground,
    },
    holdReceipt,
    extractionCashoutCue,
    extractionSetpiece,
    extractionInteractionCue,
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
    finalState: publicReport.finalState,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("extractionSetpieceProof", Date.now().toString(36));
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
