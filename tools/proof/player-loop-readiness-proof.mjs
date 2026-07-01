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
const outputRoot = path.resolve(args.out ?? "output/playwright/player-loop-readiness-proof");
const timeoutMs = Number(args.timeout ?? 80000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `player-loop-readiness-${runId}.json`);
const screenshotPath = path.join(outputRoot, `player-loop-readiness-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  boarding: null,
  runRoute: null,
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
    const samples = [];
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
      if (index % 35 === 0) {
        samples.push({
          index,
          screen: state?.screen,
          phase: state?.loadingScene?.loadingPhase,
          position: roundPosition(state?.loadingPlayer?.position),
          distance: input.distance,
        });
      }
    }
    window.GameHost?.tick?.(0.05, { keys: [] });
    return {
      accepted: state?.screen === "run",
      finalScreen: state?.screen,
      samples,
      noPlacementHelper: true,
    };

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

    function roundPosition(position) {
      if (!position) return null;
      return {
        x: Number(Number(position.x ?? 0).toFixed(3)),
        y: Number(Number(position.y ?? 0).toFixed(3)),
        z: Number(Number(position.z ?? 0).toFixed(3)),
      };
    }
  });
  assert(boarding.accepted, `natural simulator boarding should enter run, got ${boarding.finalScreen}`);
  report.boarding = boarding;

  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  const runRoute = await page.evaluate(() => {
    const route = {
      noRunPlacementHelpers: true,
      noDirectCompletionHelper: true,
      mineWalk: null,
      mineHold: null,
      cashoutWalk: null,
      cashoutHold: null,
    };

    route.mineWalk = walkGuidanceTarget({
      targetKind: "resource",
      readyAction: "hold-mine",
      maxTicks: 220,
    });
    if (!route.mineWalk.accepted) return { accepted: false, reason: "mine-walk-failed", route, state: window.GoldRushHost?.getState?.() };

    route.mineHold = holdInteractUntil({
      maxTicks: 90,
      done: (state) => (state?.extractionLoop?.player?.cargo?.goldDust ?? 0) > 0,
    });
    if (!route.mineHold.accepted) return { accepted: false, reason: "mine-hold-failed", route, state: window.GoldRushHost?.getState?.() };

    route.cashoutWalk = walkGuidanceTarget({
      targetKind: "cashout",
      readyAction: "hold-cashout",
      maxTicks: 360,
    });
    if (!route.cashoutWalk.accepted) return { accepted: false, reason: "cashout-walk-failed", route, state: window.GoldRushHost?.getState?.() };

    route.cashoutHold = holdInteractUntil({
      maxTicks: 130,
      done: (state) => state?.screen === "results" || state?.extractionLoop?.receipt?.extracted === true,
    });
    window.GameHost?.tick?.(0.05, { keys: [], interact: false });
    if (!route.cashoutHold.accepted) return { accepted: false, reason: "cashout-hold-failed", route, state: window.GoldRushHost?.getState?.() };
    return { accepted: true, route, state: window.GoldRushHost?.getState?.() };

    function walkGuidanceTarget({ targetKind, readyAction, maxTicks }) {
      const samples = [];
      let state = window.GoldRushHost?.getState?.();
      for (let index = 0; index < maxTicks; index += 1) {
        state = window.GoldRushHost?.getState?.();
        const guidance = state?.playerRouteGuidance;
        const target = guidance?.target;
        if (target?.kind !== targetKind) {
          return {
            accepted: false,
            reason: `expected-${targetKind}-target`,
            guidance: summarizeGuidance(guidance),
            readiness: summarizeReadiness(state?.playerLoopReadiness),
            samples,
          };
        }
        if (target.inRange && guidance.nextAction === readyAction) {
          window.GameHost?.tick?.(0.05, { keys: [] });
          return {
            accepted: true,
            ticks: index,
            guidance: summarizeGuidance(window.GoldRushHost?.getState?.().playerRouteGuidance),
            readiness: summarizeReadiness(window.GoldRushHost?.getState?.().playerLoopReadiness),
            samples,
          };
        }
        const input = guidance?.cameraRelativeInput ?? { keys: [] };
        state = window.GameHost?.tick?.(0.1, {
          keys: input.keys ?? [],
          lookDelta: input.lookDelta ?? { x: 0, y: 0 },
        });
        if (index % 20 === 0) {
          samples.push({
            index,
            targetId: target.id,
            distance: target.distance,
            position: roundPosition(state?.localPlayer?.position),
            leg: guidance.currentLegId,
            readiness: summarizeReadiness(state?.playerLoopReadiness),
            terrainBlocked: state?.localPlayer?.terrainCollider?.blocked ?? false,
          });
        }
      }
      return {
        accepted: false,
        reason: "timeout",
        guidance: summarizeGuidance(state?.playerRouteGuidance),
        readiness: summarizeReadiness(state?.playerLoopReadiness),
        samples,
      };
    }

    function holdInteractUntil({ maxTicks, done }) {
      let state = window.GoldRushHost?.getState?.();
      const samples = [];
      for (let index = 0; index < maxTicks; index += 1) {
        state = window.GameHost?.tick?.(0.06, { keys: [], interact: true });
        if (index % 15 === 0) {
          samples.push({
            index,
            screen: state?.screen,
            cargo: state?.extractionLoop?.player?.cargo?.goldDust ?? 0,
            miningProgress: state?.extractionLoop?.mining?.progress ?? 0,
            extractionProgress: state?.extractionLoop?.extraction?.progress ?? 0,
            receipt: Boolean(state?.extractionLoop?.receipt?.extracted),
            readiness: summarizeReadiness(state?.playerLoopReadiness),
          });
        }
        if (done(state)) {
          window.GameHost?.tick?.(0.05, { keys: [], interact: false });
          return {
            accepted: true,
            ticks: index + 1,
            samples,
          };
        }
      }
      window.GameHost?.tick?.(0.05, { keys: [], interact: false });
      return {
        accepted: false,
        reason: "timeout",
        samples,
      };
    }

    function summarizeGuidance(guidance) {
      if (!guidance) return null;
      return {
        routeStatus: guidance.routeStatus,
        currentLegId: guidance.currentLegId,
        nextAction: guidance.nextAction,
        target: guidance.target ? {
          kind: guidance.target.kind,
          id: guidance.target.id,
          distance: guidance.target.distance,
          inRange: guidance.target.inRange,
          actionInRange: guidance.target.actionInRange,
        } : null,
        input: guidance.cameraRelativeInput ? {
          mode: guidance.cameraRelativeInput.mode,
          keys: guidance.cameraRelativeInput.keys,
          distance: guidance.cameraRelativeInput.distance,
        } : null,
      };
    }

    function summarizeReadiness(readiness) {
      if (!readiness) return null;
      return {
        routeStatus: readiness.matrix?.routeStatus,
        resolvedCount: readiness.matrix?.resolvedCount,
        blockedStages: readiness.matrix?.blockedStages,
        helperDebt: readiness.helperDebt?.map((entry) => entry.id) ?? [],
      };
    }

    function roundPosition(position) {
      if (!position) return null;
      return {
        x: Number(Number(position.x ?? 0).toFixed(3)),
        y: Number(Number(position.y ?? 0).toFixed(3)),
        z: Number(Number(position.z ?? 0).toFixed(3)),
      };
    }
  });
  assert(runRoute.accepted, `route-guided run should complete: ${runRoute.reason ?? "unknown"}`);
  report.runRoute = runRoute.route;

  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.screen === "results"
      && state?.playerLoopReadiness?.matrix?.routeStatus === "resolved"
      && state?.playerLoopReadiness?.matrix?.resolvedCount === 6;
  }, null, { timeout: timeoutMs });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  const finalState = await page.evaluate(() => window.GoldRushHost?.getState?.());
  assert(finalState.playerLoopReadiness.contract === "goldrush-player-loop-readiness-v1", "loop readiness contract should be exposed");
  assert(finalState.playerLoopReadiness.domainPath === "n:goldrush:player-loop-readiness", "loop readiness domain should stay GoldRush-owned");
  assert(finalState.playerLoopReadiness.matrix.routeStatus === "resolved", "loop readiness should resolve after player-driven cashout");
  assert(finalState.playerLoopReadiness.matrix.resolvedStages.length === 6, "all loop readiness stages should resolve");
  assert(finalState.playerLoopReadiness.helperDebt.length === 0, "proof should not carry helper debt");
  assert(finalState.playerLoopReadiness.proofPolicy.noDirectCompletionHelper === true, "proof should avoid direct completion helper");
  assert(finalState.playerLoopReadiness.proofPolicy.noPlacementHelperRequired === true, "proof should avoid placement helpers");
  assert(finalState.playerLoopReadinessValidation?.passed === true, "loop readiness validation should pass in app state");
  assert(finalState.playerRouteGuidance.routeStatus === "resolved", "route guidance should still resolve");
  assert(finalState.playerDrivenExtractionRoute.matrix.routeStatus === "resolved", "player-driven route should still resolve");

  report.status = "passed";
  report.checks.push(
    "natural-loading-yard-boarding",
    "loop-readiness-resource-cue",
    "loop-readiness-mine-hold",
    "loop-readiness-cargo-visual",
    "loop-readiness-cashout-cue",
    "loop-readiness-cashout-hold",
    "loop-readiness-receipt-results",
    "no-placement-or-completion-helpers",
  );
  report.finalState = {
    screen: finalState.screen,
    activeSite: finalState.activeSite?.id,
    loopReadiness: finalState.playerLoopReadiness,
    routeGuidance: finalState.playerRouteGuidance,
    extractionRoute: finalState.playerDrivenExtractionRoute,
    receipt: finalState.extractionLoop?.receipt ?? null,
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
    routeStatus: publicReport.finalState?.loopReadiness?.matrix?.routeStatus ?? null,
    resolvedCount: publicReport.finalState?.loopReadiness?.matrix?.resolvedCount ?? null,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function waitForScreen(page, screen) {
  return page.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("playerLoopReadinessProof", Date.now().toString(36));
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
