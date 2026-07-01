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
const outputRoot = path.resolve(args.out ?? "output/playwright/player-route-guidance-proof");
const timeoutMs = Number(args.timeout ?? 70000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `player-route-guidance-${runId}.json`);
const screenshotPath = path.join(outputRoot, `player-route-guidance-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
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
      if (index % 30 === 0) {
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
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  const runRoute = await page.evaluate(() => {
    const route = {
      noRunPlacementHelpers: true,
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
            samples,
          };
        }
        if (target.inRange && guidance.nextAction === readyAction) {
          window.GameHost?.tick?.(0.05, { keys: [] });
          return {
            accepted: true,
            ticks: index,
            guidance: summarizeGuidance(window.GoldRushHost?.getState?.().playerRouteGuidance),
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
            terrainBlocked: state?.localPlayer?.terrainCollider?.blocked ?? false,
          });
        }
      }
      return {
        accepted: false,
        reason: "timeout",
        guidance: summarizeGuidance(state?.playerRouteGuidance),
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
            radius: guidance.target.radius,
            actionRadius: guidance.target.actionRadius,
          } : null,
        input: guidance.cameraRelativeInput ? {
          mode: guidance.cameraRelativeInput.mode,
          keys: guidance.cameraRelativeInput.keys,
          distance: guidance.cameraRelativeInput.distance,
        } : null,
        resolvedLegs: guidance.matrix?.resolvedLegs ?? [],
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
      && state?.playerDrivenExtractionRoute?.matrix?.routeStatus === "resolved"
      && state?.playerRouteGuidance?.routeStatus === "resolved";
  }, null, { timeout: timeoutMs });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  const finalState = await page.evaluate(() => window.GoldRushHost?.getState?.());
  assert(finalState.playerRouteGuidance.contract === "goldrush-player-route-guidance-v1", "route guidance contract should be exposed");
  assert(finalState.playerRouteGuidance.domainPath === "n:goldrush:player-route-guidance", "route guidance domain should stay GoldRush-owned");
  assert(finalState.playerRouteGuidance.routeStatus === "resolved", "route guidance should resolve after route-guided cashout");
  assert(finalState.playerRouteGuidance.matrix.resolvedLegs.length === 4, "all route guidance legs should resolve");
  assert(finalState.playerDrivenExtractionRoute.matrix.routeStatus === "resolved", "player-driven extraction route should still resolve");
  assert(finalState.protoKitBridge.protoSnapshot.route.completedIds.includes("cashout-site"), "ProtoKit bridge should see cashout completion");

  report.status = "passed";
  report.checks.push(
    "natural-loading-yard-boarding",
    "route-guided-resource-walk",
    "input-held-mining",
    "route-guided-cashout-walk",
    "input-held-cashout",
    "route-guidance-resolved",
  );
  report.finalState = {
    screen: finalState.screen,
    activeSite: finalState.activeSite?.id,
    routeGuidance: finalState.playerRouteGuidance,
    extractionRoute: finalState.playerDrivenExtractionRoute,
    receipt: finalState.extractionLoop?.receipt ?? null,
    boarding,
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
    routeStatus: publicReport.finalState?.routeGuidance?.routeStatus ?? null,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function waitForScreen(page, screen) {
  return page.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("playerRouteGuidanceProof", Date.now().toString(36));
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
