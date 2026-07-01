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
const outputRoot = path.resolve(args.out ?? "output/playwright/player-guidance-cue-proof");
const timeoutMs = Number(args.timeout ?? 60000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `player-guidance-cue-${runId}.json`);
const screenshotPath = path.join(outputRoot, `player-guidance-cue-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  initialCue: null,
  inRangeCue: null,
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
    window.GameHost?.tick?.(0.05, { keys: [] });
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
  assert(boarding.accepted, `natural simulator boarding should enter run, got ${boarding.finalScreen}`);
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });

  const cueProof = await page.evaluate(() => {
    const initial = summarizeCue(window.GoldRushHost?.getState?.());
    const walk = walkGuidanceTarget({ targetKind: "resource", readyAction: "hold-mine", maxTicks: 220 });
    const inRange = summarizeCue(window.GoldRushHost?.getState?.());
    window.GameHost?.tick?.(0.05, { keys: [] });
    return { accepted: walk.accepted, reason: walk.reason, initial, walk, inRange };

    function walkGuidanceTarget({ targetKind, readyAction, maxTicks }) {
      const samples = [];
      let state = window.GoldRushHost?.getState?.();
      for (let index = 0; index < maxTicks; index += 1) {
        state = window.GoldRushHost?.getState?.();
        const guidance = state?.playerRouteGuidance;
        const target = guidance?.target;
        const cue = state?.playerGuidanceCue;
        const visualCue = state?.renderer?.procedural?.gameplay?.playerGuidanceCue;
        if (target?.kind !== targetKind) {
          return { accepted: false, reason: `expected-${targetKind}-target`, samples, cue: summarizeCue(state) };
        }
        if (target.inRange && guidance.nextAction === readyAction) {
          window.GameHost?.tick?.(0.05, { keys: [] });
          return { accepted: true, ticks: index, samples, cue: summarizeCue(window.GoldRushHost?.getState?.()) };
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
            cueRole: cue?.cue?.role,
            visualCueRole: visualCue?.cue?.role,
            cueVisible: cue?.visible,
            visualCueVisible: visualCue?.visible,
          });
        }
      }
      return { accepted: false, reason: "timeout", samples, cue: summarizeCue(state) };
    }

    function summarizeCue(state) {
      const cue = state?.playerGuidanceCue;
      const visual = state?.renderer?.procedural?.gameplay?.playerGuidanceCue;
      return {
        sourceContract: cue?.contract ?? null,
        visualContract: visual?.contract ?? null,
        sourceDomainPath: cue?.domainPath ?? null,
        visible: cue?.visible ?? null,
        visualVisible: visual?.visible ?? null,
        noDebugOverlay: cue?.noDebugOverlay ?? null,
        target: cue?.target ? {
          kind: cue.target.kind,
          id: cue.target.id,
          distance: cue.target.distance,
          distanceBand: cue.target.distanceBand,
          inRange: cue.target.inRange,
          actionInRange: cue.target.actionInRange,
        } : null,
        cue: cue?.cue ? {
          role: cue.cue.role,
          shape: cue.cue.shape,
          colorOnly: cue.cue.colorOnly,
          suggestedKeys: cue.cue.suggestedKeys,
          primaryInput: cue.cue.primaryInput,
        } : null,
        visualCue: visual?.cue ?? null,
        readability: cue?.readability ?? null,
      };
    }
  });

  assert(cueProof.initial.sourceContract === "goldrush-player-guidance-cue-v1", "initial state should expose source guidance cue contract");
  assert(cueProof.initial.visualContract === "goldrush-player-guidance-cue-visual-v1", "initial state should expose rendered guidance cue contract");
  assert(cueProof.initial.visible === true && cueProof.initial.visualVisible === true, "initial guidance cue should be visible");
  assert(cueProof.initial.noDebugOverlay === true, "guidance cue should not require debug overlay");
  assert(cueProof.initial.target?.kind === "resource", "initial cue should guide toward a resource");
  assert(cueProof.initial.cue?.role === "world-route-direction", "initial cue should be a route direction cue");
  assert(cueProof.initial.cue?.colorOnly === false, "initial cue must not be color-only");
  assert(cueProof.accepted, `route walk to cue target should succeed: ${cueProof.reason ?? "unknown"}`);
  assert(cueProof.inRange.target?.kind === "resource", "in-range cue should still target the resource");
  assert(cueProof.inRange.cue?.role === "hold-readiness", "in-range cue should switch to hold-readiness");
  assert(cueProof.inRange.cue?.primaryInput === "E", "in-range cue should expose the hold input");
  assert(cueProof.inRange.visualVisible === true, "in-range rendered cue should stay visible");

  await page.screenshot({ path: screenshotPath, fullPage: false });
  report.status = "passed";
  report.checks.push(
    "natural-loading-yard-boarding",
    "source-guidance-cue-contract",
    "rendered-guidance-cue-contract",
    "world-route-direction-visible",
    "no-debug-overlay",
    "not-color-only",
    "walk-to-resource-with-cue",
    "hold-readiness-cue"
  );
  report.initialCue = cueProof.initial;
  report.inRangeCue = cueProof.inRange;
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
    initialCue: publicReport.initialCue,
    inRangeCue: publicReport.inRangeCue,
    error: publicReport.error,
  }));
}

async function waitForScreen(page, screen) {
  await page.waitForFunction(
    (targetScreen) => window.GoldRushHost?.getState?.().screen === targetScreen,
    screen,
    { timeout: timeoutMs }
  );
}

function withProofParams(url) {
  const next = new URL(url);
  next.searchParams.set("publicSmoke", "1");
  next.searchParams.set("proofMode", "player-guidance-cue");
  return next.toString();
}

function parseArgs(rawArgs) {
  return rawArgs.reduce((next, entry) => {
    const [key, value = "true"] = entry.replace(/^--/, "").split("=");
    next[key] = value;
    return next;
  }, {});
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
