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
const outputRoot = path.resolve(args.out ?? "output/playwright/combat-loop-readiness-proof");
const timeoutMs = Number(args.timeout ?? 70000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `combat-loop-readiness-${runId}.json`);
const screenshotPath = path.join(outputRoot, `combat-loop-readiness-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  helperDebt: [],
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

  const boarding = await page.evaluate(() => {
    let state = window.GoldRushHost?.getState?.();
    for (let index = 0; index < 520; index += 1) {
      if (state?.screen === "run") break;
      const target = state?.loadingScene?.boardingCue?.anchor ?? { x: 0, z: -7.4 };
      const input = createInputToward({
        position: state?.loadingPlayer?.position,
        yaw: state?.loadingPlayer?.look?.yaw ?? 0,
        target,
        radius: 0.65,
        sprintDistance: 3,
      });
      state = window.GameHost?.tick?.(0.1, input);
    }
    return { accepted: state?.screen === "run", finalScreen: state?.screen };

    function createInputToward({ position, yaw, target, radius = 1, sprintDistance = 4 }) {
      if (!position || !target) return { keys: [] };
      const dx = Number(target.x ?? 0) - Number(position.x ?? 0);
      const dz = Number(target.z ?? 0) - Number(position.z ?? 0);
      const distance = Math.hypot(dx, dz);
      if (distance <= radius) return { keys: [], distance: Number(distance.toFixed(3)) };
      const desiredYaw = Math.atan2(dx, dz);
      const yawDelta = normalizeAngle(desiredYaw - Number(yaw ?? 0));
      return {
        lookDelta: { x: Number((-yawDelta / 0.0026).toFixed(3)), y: 0 },
        keys: distance > sprintDistance ? ["w", "Shift"] : ["w"],
        distance: Number(distance.toFixed(3)),
      };
    }

    function normalizeAngle(value) {
      let next = Number(value) || 0;
      while (next > Math.PI) next -= Math.PI * 2;
      while (next < -Math.PI) next += Math.PI * 2;
      return next;
    }
  });
  assert(boarding.accepted, `natural train boarding should enter run, got ${boarding.finalScreen}`);
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

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
    loopApi.engageCover({ threatId: "claim-jumper-01" });
    loopApi.peekCover({ side: "left" });
    const shot = loopApi.fire({});
    const damage = loopApi.takeDamage({ amount: 9, reason: "combat-loop-readiness-proof" });
    const loop = loopApi.getState();
    return {
      accepted: true,
      mineReceipt,
      shot,
      damage,
      receiptCount: loop.combat.readability.receipts.length,
      laneIds: loop.combat.readability.activeLaneIds,
      coverId: loop.combat.readability.coverEngagement?.coverId,
    };
  });
  assert(combatSetup.accepted, `combat setup should be accepted: ${combatSetup.reason ?? "unknown"}`);
  assert(combatSetup.receiptCount >= 2, "combat setup should create shot and damage receipts");
  assert(combatSetup.laneIds.includes("lane.claim-jumper-01"), "combat setup should expose claim-jumper lane");
  assert(combatSetup.coverId, "combat setup should engage a cover id");

  const resultReceipt = await page.evaluate(async () => window.GoldRushHost?.actions?.publicSmokeCompleteRunToResults?.() ?? { accepted: false, reason: "missing-action" });
  assert(resultReceipt.accepted, `result completion should be accepted: ${resultReceipt.reason ?? "unknown"}`);
  await waitForScreen(page, "results");
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.combatLoopReadiness?.matrix?.combatStatus === "resolved"
      && state?.combatLoopReadiness?.proofPolicy?.resultBackedCombat === true
      && state?.results?.combatOutcomeSummary?.receiptCount >= 2;
  }, null, { timeout: timeoutMs });

  const withTelemetry = await page.evaluate(() => {
    const host = window.GoldRushHost;
    return host.runtime.engine.n.goldrushCombatLoopReadiness.update({
      renderer: host.getState().renderer,
      proofTelemetry: {
        usedHelpers: ["directCombatSetup", "publicSmokeCompleteRunToResults"],
      },
    });
  });
  await page.screenshot({ path: screenshotPath, fullPage: false });
  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  assert(state.combatLoopReadiness.matrix.resolvedCount === 6, "browser state should resolve all combat readiness stages");
  assert(state.combatLoopReadiness.proofPolicy.multisensoryCriticalCues === true, "browser state should prove multisensory threat cues");
  assert(state.combatLoopReadiness.proofPolicy.receiptBackedCombat === true, "browser state should prove receipt-backed combat");
  assert(withTelemetry.helperDebt.some((entry) => entry.id === "direct-combat-setup-helper"), "proof telemetry should expose direct combat setup helper debt");
  assert(withTelemetry.helperDebt.some((entry) => entry.id === "direct-combat-result-completion-helper"), "proof telemetry should expose direct completion helper debt");

  report.status = "passed";
  report.checks.push(
    "natural-train-boarding",
    "combat-readiness-resolved",
    "multisensory-threat-cues",
    "cover-counterplay-visible",
    "combat-receipts-created",
    "combat-results-backed",
    "helper-debt-exposed",
  );
  report.helperDebt = withTelemetry.helperDebt;
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
    helperDebt: publicReport.helperDebt,
    finalState: publicReport.finalState,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function summarizeState(state) {
  return {
    screen: state?.screen,
    activeSite: state?.activeSite?.id,
    combatLoopReadiness: {
      contract: state?.combatLoopReadiness?.contract,
      status: state?.combatLoopReadiness?.matrix?.combatStatus,
      resolvedStages: state?.combatLoopReadiness?.matrix?.resolvedStages,
      proofPolicy: state?.combatLoopReadiness?.proofPolicy,
    },
    results: {
      status: state?.results?.status,
      combatOutcomeSummary: state?.results?.combatOutcomeSummary,
      awards: state?.results?.awards?.map((award) => award.id) ?? [],
    },
  };
}

function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("combatLoopReadinessProof", Date.now().toString(36));
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
