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
const outputRoot = path.resolve(args.out ?? "output/playwright/combat-route-guidance-proof");
const timeoutMs = Number(args.timeout ?? 80000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `combat-route-guidance-${runId}.json`);
const screenshotPath = path.join(outputRoot, `combat-route-guidance-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  boarding: null,
  route: null,
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
      if (index % 40 === 0) {
        samples.push({
          index,
          screen: state?.screen,
          phase: state?.loadingScene?.loadingPhase,
          distance: input.distance,
        });
      }
    }
    window.GameHost?.tick?.(0.05, { keys: [] });
    return {
      accepted: state?.screen === "run",
      finalScreen: state?.screen,
      samples,
      method: "natural-walk-from-loading-yard-spawn",
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
  });
  assert(boarding.accepted, `natural train boarding should enter run, got ${boarding.finalScreen}`);
  report.boarding = boarding;

  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  const route = await page.evaluate(() => {
    const proofRoute = {
      noDirectPoseHelpers: true,
      noDirectCombatSetupHelpers: true,
      mineWalk: null,
      mineHold: null,
      combatWalk: null,
      coverEngage: null,
      receipt: null,
    };

    proofRoute.mineWalk = walkPlayerGuidanceTarget({
      targetKind: "resource",
      readyAction: "hold-mine",
      maxTicks: 240,
    });
    if (!proofRoute.mineWalk.accepted) return { accepted: false, reason: "mine-walk-failed", proofRoute, state: window.GoldRushHost?.getState?.() };

    proofRoute.mineHold = holdInteractUntil({
      maxTicks: 95,
      done: (state) => (state?.extractionLoop?.player?.cargo?.goldDust ?? 0) > 0,
    });
    if (!proofRoute.mineHold.accepted) return { accepted: false, reason: "mine-hold-failed", proofRoute, state: window.GoldRushHost?.getState?.() };

    proofRoute.combatWalk = walkCombatRouteTarget({ maxTicks: 260 });
    if (!proofRoute.combatWalk.accepted) return { accepted: false, reason: "combat-route-walk-failed", proofRoute, state: window.GoldRushHost?.getState?.() };

    proofRoute.coverEngage = holdCoverUntil({ maxTicks: 50 });
    if (!proofRoute.coverEngage.accepted) return { accepted: false, reason: "cover-engage-failed", proofRoute, state: window.GoldRushHost?.getState?.() };

    proofRoute.receipt = fireFromCoverUntil({ maxTicks: 35 });
    if (!proofRoute.receipt.accepted) return { accepted: false, reason: "combat-receipt-failed", proofRoute, state: window.GoldRushHost?.getState?.() };

    const state = window.GoldRushHost?.getState?.();
    return {
      accepted: state?.combatRouteGuidance?.routeStatus === "resolved",
      reason: state?.combatRouteGuidance?.routeStatus,
      proofRoute,
      state,
    };

    function walkPlayerGuidanceTarget({ targetKind, readyAction, maxTicks }) {
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
            guidance: summarizeRoute(guidance),
            samples,
          };
        }
        if (target.inRange && guidance.nextAction === readyAction) {
          window.GameHost?.tick?.(0.05, { keys: [] });
          return {
            accepted: true,
            ticks: index,
            guidance: summarizeRoute(window.GoldRushHost?.getState?.().playerRouteGuidance),
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
            targetId: target?.id,
            distance: target?.distance,
            position: roundPosition(state?.localPlayer?.position),
            leg: guidance?.currentLegId,
          });
        }
      }
      return {
        accepted: false,
        reason: "timeout",
        guidance: summarizeRoute(state?.playerRouteGuidance),
        samples,
      };
    }

    function holdInteractUntil({ maxTicks, done }) {
      const samples = [];
      let state = window.GoldRushHost?.getState?.();
      for (let index = 0; index < maxTicks; index += 1) {
        state = window.GameHost?.tick?.(0.06, { keys: [], interact: true });
        if (index % 15 === 0) {
          samples.push({
            index,
            cargo: state?.extractionLoop?.player?.cargo?.goldDust ?? 0,
            miningProgress: state?.extractionLoop?.mining?.progress ?? 0,
          });
        }
        if (done(state)) {
          window.GameHost?.tick?.(0.05, { keys: [], interact: false });
          return { accepted: true, ticks: index + 1, samples };
        }
      }
      window.GameHost?.tick?.(0.05, { keys: [], interact: false });
      return { accepted: false, reason: "timeout", samples };
    }

    function walkCombatRouteTarget({ maxTicks }) {
      const samples = [];
      let state = window.GoldRushHost?.getState?.();
      for (let index = 0; index < maxTicks; index += 1) {
        state = window.GoldRushHost?.getState?.();
        const guidance = state?.combatRouteGuidance;
        const target = guidance?.target;
        if (guidance?.matrix?.resolvedLegs?.includes("threat-to-cover-route") || target?.actionInRange || guidance?.nextAction === "take-cover") {
          window.GameHost?.tick?.(0.05, { keys: [], aim: true });
          return {
            accepted: true,
            ticks: index,
            guidance: summarizeCombatGuidance(window.GoldRushHost?.getState?.().combatRouteGuidance),
            samples,
          };
        }
        if (!target) {
          state = window.GameHost?.tick?.(0.1, { keys: [], aim: true });
        } else {
          const input = guidance?.cameraRelativeInput ?? { keys: [] };
          state = window.GameHost?.tick?.(0.1, {
            keys: input.keys ?? [],
            lookDelta: input.lookDelta ?? { x: 0, y: 0 },
            aim: guidance?.combatInputHint?.aim ?? false,
          });
        }
        if (index % 20 === 0) {
          samples.push({
            index,
            targetId: target?.id ?? null,
            targetKind: target?.kind ?? null,
            distance: target?.distance ?? null,
            nextAction: guidance?.nextAction,
            resolved: guidance?.matrix?.resolvedLegs ?? [],
            position: roundPosition(state?.localPlayer?.position),
          });
        }
      }
      return {
        accepted: false,
        reason: "timeout",
        guidance: summarizeCombatGuidance(state?.combatRouteGuidance),
        samples,
      };
    }

    function holdCoverUntil({ maxTicks }) {
      const samples = [];
      let state = window.GoldRushHost?.getState?.();
      for (let index = 0; index < maxTicks; index += 1) {
        const guidance = state?.combatRouteGuidance;
        state = window.GameHost?.tick?.(0.08, {
          keys: [],
          aim: true,
          cover: true,
          peek: guidance?.combatInputHint?.peek ?? "right",
        });
        if (index % 10 === 0) {
          samples.push({
            index,
            nextAction: state?.combatRouteGuidance?.nextAction,
            coverId: state?.extractionLoop?.combat?.readability?.coverEngagement?.coverId ?? null,
            resolved: state?.combatRouteGuidance?.matrix?.resolvedLegs ?? [],
          });
        }
        if (state?.combatRouteGuidance?.matrix?.resolvedLegs?.includes("cover-engagement")) {
          return {
            accepted: true,
            ticks: index + 1,
            guidance: summarizeCombatGuidance(state?.combatRouteGuidance),
            samples,
          };
        }
      }
      return {
        accepted: false,
        reason: "timeout",
        guidance: summarizeCombatGuidance(state?.combatRouteGuidance),
        samples,
      };
    }

    function fireFromCoverUntil({ maxTicks }) {
      const samples = [];
      let state = window.GoldRushHost?.getState?.();
      for (let index = 0; index < maxTicks; index += 1) {
        const guidance = state?.combatRouteGuidance;
        state = window.GameHost?.tick?.(0.08, {
          keys: [],
          aim: true,
          cover: true,
          fire: true,
          peek: guidance?.combatInputHint?.peek ?? "right",
        });
        if (index % 8 === 0) {
          samples.push({
            index,
            receiptCount: state?.extractionLoop?.combat?.readability?.receipts?.length ?? 0,
            resolved: state?.combatRouteGuidance?.matrix?.resolvedLegs ?? [],
            nextAction: state?.combatRouteGuidance?.nextAction,
          });
        }
        if (state?.combatRouteGuidance?.matrix?.resolvedLegs?.includes("combat-receipt-ready")) {
          return {
            accepted: true,
            ticks: index + 1,
            guidance: summarizeCombatGuidance(state?.combatRouteGuidance),
            samples,
          };
        }
      }
      return {
        accepted: false,
        reason: "timeout",
        guidance: summarizeCombatGuidance(state?.combatRouteGuidance),
        samples,
      };
    }

    function summarizeRoute(guidance) {
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
        } : null,
      };
    }

    function summarizeCombatGuidance(guidance) {
      if (!guidance) return null;
      return {
        routeStatus: guidance.routeStatus,
        currentLegId: guidance.currentLegId,
        nextAction: guidance.nextAction,
        resolvedLegs: guidance.matrix?.resolvedLegs ?? [],
        target: guidance.target ? {
          kind: guidance.target.kind,
          id: guidance.target.id,
          distance: guidance.target.distance,
          inRange: guidance.target.inRange,
          actionInRange: guidance.target.actionInRange,
        } : null,
        combatInputHint: guidance.combatInputHint,
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

  assert(route.accepted, `combat route proof should resolve: ${route.reason ?? "unknown"}`);
  report.route = summarizeRouteReport(route);

  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  assert(state.combatRouteGuidance.contract === "goldrush-combat-route-guidance-v1", "browser state should expose combat route guidance contract");
  assert(state.combatRouteGuidance.routeStatus === "resolved", "browser state should resolve combat route guidance");
  assert(state.combatRouteGuidance.matrix.resolvedCount === 6, "browser state should resolve all combat route legs");
  assert(state.combatRouteGuidance.proofPolicy.coverCounterplayRouted === true, "browser state should prove cover route counterplay");
  assert(state.combatRouteGuidance.helperDebt.length === 0, "browser route proof should not report helper debt");
  try {
    await page.screenshot({ path: screenshotPath, fullPage: false, timeout: 10000 });
    report.screenshotCaptured = true;
  } catch (error) {
    report.screenshotCaptured = false;
    report.screenshotError = error.message;
  }

  report.status = "passed";
  report.checks.push(
    "natural-train-boarding",
    "route-guided-mine-walk",
    "input-held-mining",
    "combat-route-cover-target",
    "camera-relative-combat-walk",
    "tick-input-cover-engagement",
    "receipt-backed-cover-combat",
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
    route: publicReport.route,
    finalState: publicReport.finalState,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

function summarizeRouteReport(route) {
  return {
    noDirectPoseHelpers: route?.proofRoute?.noDirectPoseHelpers === true,
    noDirectCombatSetupHelpers: route?.proofRoute?.noDirectCombatSetupHelpers === true,
    mineWalk: route?.proofRoute?.mineWalk?.accepted ?? false,
    mineHold: route?.proofRoute?.mineHold?.accepted ?? false,
    combatWalk: route?.proofRoute?.combatWalk?.guidance ?? null,
    coverEngage: route?.proofRoute?.coverEngage?.guidance ?? null,
    receipt: route?.proofRoute?.receipt?.guidance ?? null,
  };
}

function summarizeState(state) {
  return {
    screen: state?.screen,
    combatRouteGuidance: {
      contract: state?.combatRouteGuidance?.contract,
      status: state?.combatRouteGuidance?.routeStatus,
      resolvedLegs: state?.combatRouteGuidance?.matrix?.resolvedLegs,
      nextAction: state?.combatRouteGuidance?.nextAction,
      proofPolicy: state?.combatRouteGuidance?.proofPolicy,
    },
    combatLoopReadiness: {
      contract: state?.combatLoopReadiness?.contract,
      status: state?.combatLoopReadiness?.matrix?.combatStatus,
      resolvedStages: state?.combatLoopReadiness?.matrix?.resolvedStages,
    },
  };
}

function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("combatRouteGuidanceProof", Date.now().toString(36));
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
