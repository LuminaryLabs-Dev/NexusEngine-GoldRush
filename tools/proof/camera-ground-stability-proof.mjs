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
const outputRoot = path.resolve(args.out ?? "output/playwright/camera-ground-stability-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const sampleCount = Number(args.samples ?? 160);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `camera-ground-stability-${runId}.json`);
const screenshotPath = path.join(outputRoot, `camera-ground-stability-${runId}.png`);

await mkdir(outputRoot, { recursive: true });

const report = {
  status: "pending",
  url: proofUrl,
  startedAt: new Date().toISOString(),
  screenshot: sanitizePathForOutput(screenshotPath),
  checks: [],
  setup: null,
  metrics: null,
  samples: [],
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
  await page.locator('[data-screen-panel="loading"]').click({ position: { x: 720, y: 450 } });
  await waitForBoardingCue(page);

  const walkedToRun = await walkToTrainUntilRun(page, 30000);
  assert(walkedToRun, "camera stability proof must enter run through natural camera-relative train boarding");
  await waitForScreen(page, "run");
  await page.waitForFunction(() => window.GoldRushHost?.getState?.().renderer?.mounted === true, null, { timeout: timeoutMs });
  await page.locator('[data-screen-panel="run"]').click({ position: { x: 720, y: 450 } });

  const setupState = await getHostState(page);
  report.setup = summarizeSetup(setupState);
  assert(setupState?.localPlayer?.inputModel?.id === "camera-relative-wasd", "run player must use camera-relative WASD");
  assert(setupState?.localPlayer?.inputModel?.mouseLookDrivesCamera === true, "mouse look must drive camera");
  assert(setupState?.localPlayer?.ground?.placement === "downward-triangle-raycast", "player grounding must use terrain raycast placement");
  assert(setupState?.terrainPhysics?.engine === "cannon-es", "terrain physics backend must be cannon-es for this proof slice");

  const samples = await page.evaluate(async ({ sampleCount: nextSampleCount }) => {
    const frames = [];
    const getState = () => window.GoldRushHost?.getState?.() ?? null;
    const compact = (index, phase) => {
      const state = getState();
      const player = state?.localPlayer ?? {};
      const camera = state?.camera ?? {};
      const rendererCamera = state?.renderer?.procedural?.camera ?? state?.runRenderer?.procedural?.camera ?? null;
      return {
        index,
        phase,
        screen: state?.screen ?? null,
        activeSite: state?.activeSite?.id ?? null,
        rendererFrame: state?.renderer?.frameCount ?? state?.runRenderer?.frameCount ?? null,
        selectedPerspectiveId: camera?.selectedPerspective?.id ?? null,
        selectedPerspectiveFamily: camera?.selectedPerspective?.family ?? null,
        cameraMode: camera?.mode ?? state?.scenario?.cameraMode ?? null,
        motionAuthority: camera?.motionAuthority ?? null,
        descriptorPosition: camera?.threeDescriptor?.position ?? null,
        descriptorLookAt: camera?.threeDescriptor?.lookAt ?? null,
        rendererCamera,
        playerPosition: player?.position ?? null,
        playerLook: player?.look ?? null,
        playerSpeed: player?.speed ?? 0,
        playerGround: player?.ground ?? null,
        playerRenderGround: player?.renderGround ?? null,
        inputModel: player?.inputModel ?? null,
      };
    };

    for (let index = 0; index < nextSampleCount; index += 1) {
      const phase = index < nextSampleCount * 0.2
        ? "idle"
        : index < nextSampleCount * 0.7
          ? "move-look"
          : "settle";
      const input = phase === "move-look"
        ? { keys: ["w"], lookDelta: { x: index % 2 === 0 ? 2.5 : -1.25, y: 0 } }
        : { keys: [] };
      window.GameHost?.tick?.(1 / 30, input);
      window.GameHost?.render?.();
      frames.push(compact(index, phase));
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    window.GameHost?.setInput?.({ keys: [] });
    window.GameHost?.render?.();
    return frames;
  }, { sampleCount });

  report.samples = samples;
  const metrics = calculateMetrics(samples);
  report.metrics = metrics;

  assert(metrics.sampleCount >= 120, "camera proof must sample at least 120 frames");
  assert(metrics.screenSet.size === 1 && metrics.screenSet.has("run"), "all samples must stay in run screen");
  assert(metrics.siteSet.size === 1 && metrics.siteSet.has("site.gold-field"), "all samples must stay in gold-field site");
  assert(metrics.perspectiveIdSet.size === 1, "selected camera perspective must not reselect during same run phase");
  assert(metrics.motionAuthoritySet.size === 1 && metrics.motionAuthoritySet.has("transition-latched-player-follow"), "camera motion authority must stay transition-latched player-follow");
  assert(metrics.maxGroundMismatch <= 0.015, `player y must match sampled ground height; max mismatch ${metrics.maxGroundMismatch}`);
  assert(metrics.maxRenderGroundMismatch <= 0.015, `render ground must match movement-owned ground; max mismatch ${metrics.maxRenderGroundMismatch}`);
  assert(metrics.unstableFrameCount === 0, `frame samples must not include invalid camera/player data: ${metrics.unstableFrameCount}`);
  assert(metrics.lookYawDelta > 0.01, "lookDelta input should move player yaw enough to prove mouse-look path is active");
  assert(metrics.moveDistance > 0.1, "WASD movement should move the player enough to prove camera-relative movement path is active");
  assert(metrics.maxOneFrameCameraJump <= 4.5, `camera should not jump back and forth; max jump ${metrics.maxOneFrameCameraJump}`);
  assert(metrics.maxOneFrameGroundDelta <= 0.85, `ground samples should not pulse violently; max delta ${metrics.maxOneFrameGroundDelta}`);

  await page.screenshot({ path: screenshotPath, fullPage: false });

  report.status = "passed";
  report.checks.push(
    "natural-train-boarding",
    "run-site-stable",
    "camera-perspective-latched",
    "motion-authority-stable",
    "mouse-look-yaw-active",
    "camera-relative-wasd-active",
    "movement-ground-matches-player-y",
    "render-ground-matches-movement-ground",
    "no-large-camera-jumps",
    "no-large-ground-pulses",
  );
} catch (error) {
  report.status = "failed";
  report.error = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await browser?.close();
  const publicReport = await writeSanitizedJsonArtifact(reportPath, {
    ...report,
    metrics: serializeMetrics(report.metrics),
    samples: summarizeSamples(report.samples),
  }, { repoRoot });
  console.log(sanitizedConsoleJson({
    status: publicReport.status,
    report: sanitizePathForOutput(reportPath),
    screenshot: publicReport.screenshot,
    checks: publicReport.checks,
    setup: publicReport.setup,
    metrics: publicReport.metrics,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

async function waitForScreen(nextPage, screen) {
  return nextPage.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

async function waitForBoardingCue(nextPage) {
  await nextPage.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.loadingScene?.doorOpen === true
      && state?.loadingScene?.boardingCue?.visible === true
      && state?.firstSequence?.trainReadout?.nextPlayerAction === "board-train";
  }, null, { timeout: timeoutMs });
}

async function walkToTrainUntilRun(nextPage, durationMs) {
  const startedAt = Date.now();
  let pressedKeys = new Set();
  try {
    while (Date.now() - startedAt < durationMs) {
      const state = await getHostState(nextPage);
      if (state?.screen === "run") return true;
      const nextKeys = chooseCameraRelativeKeysTowardTrain(state);
      await syncMovementKeys(nextPage, pressedKeys, nextKeys);
      pressedKeys = nextKeys;
      await nextPage.waitForTimeout(250);
    }
    return false;
  } finally {
    await syncMovementKeys(nextPage, pressedKeys, new Set());
  }
}

function chooseCameraRelativeKeysTowardTrain(state) {
  const position = state?.loadingPlayer?.position;
  const anchor = state?.loadingScene?.boardingCue?.anchor ?? { x: 0, z: -7.4 };
  const inputModel = state?.loadingPlayer?.inputModel;
  const forward = inputModel?.forwardOnGround ?? { x: 0, z: -1 };
  if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.z)) return new Set(["w"]);

  const toTarget = { x: anchor.x - position.x, z: anchor.z - position.z };
  const distance = Math.hypot(toTarget.x, toTarget.z);
  if (distance <= 0.15) return new Set();
  const desired = { x: toTarget.x / distance, z: toTarget.z / distance };
  const forwardLength = Math.hypot(forward.x, forward.z) || 1;
  const fwd = { x: forward.x / forwardLength, z: forward.z / forwardLength };
  const right = { x: fwd.z, z: -fwd.x };
  const forwardDot = desired.x * fwd.x + desired.z * fwd.z;
  const rightDot = desired.x * right.x + desired.z * right.z;
  const keys = new Set();
  if (forwardDot >= 0.22) keys.add("w");
  if (forwardDot <= -0.22) keys.add("s");
  if (rightDot >= 0.22) keys.add("d");
  if (rightDot <= -0.22) keys.add("a");
  if (!keys.size) keys.add(forwardDot >= 0 ? "w" : "s");
  if (distance > 3.2) keys.add("Shift");
  return keys;
}

async function syncMovementKeys(nextPage, previousKeys, nextKeys) {
  for (const key of previousKeys) {
    if (!nextKeys.has(key)) await sendMovementKey(nextPage, key, "keyup");
  }
  for (const key of nextKeys) {
    if (!previousKeys.has(key)) await sendMovementKey(nextPage, key, "keydown");
  }
}

async function sendMovementKey(nextPage, key, type) {
  const code = { w: "KeyW", a: "KeyA", s: "KeyS", d: "KeyD", Shift: "ShiftLeft" }[key];
  await nextPage.evaluate(({ eventType, keyValue, codeValue }) => {
    window.dispatchEvent(new KeyboardEvent(eventType, {
      key: keyValue,
      code: codeValue,
      bubbles: true,
      cancelable: true,
    }));
  }, { eventType: type, keyValue: key, codeValue: code });
  const operation = type === "keydown" ? "down" : "up";
  await nextPage.keyboard[operation](key).catch(() => {});
}

async function getHostState(nextPage) {
  return nextPage.evaluate(() => window.GoldRushHost?.getState?.() ?? null);
}

function summarizeSetup(state) {
  return {
    screen: state?.screen ?? null,
    activeSite: state?.activeSite?.id ?? null,
    inputModel: state?.localPlayer?.inputModel ?? null,
    ground: {
      height: state?.localPlayer?.ground?.height ?? null,
      placement: state?.localPlayer?.ground?.placement ?? null,
      walkable: state?.localPlayer?.ground?.walkable ?? null,
    },
    camera: {
      mode: state?.camera?.mode ?? null,
      motionAuthority: state?.camera?.motionAuthority ?? null,
      selectedPerspectiveId: state?.camera?.selectedPerspective?.id ?? null,
    },
    terrainPhysics: state?.terrainPhysics ?? null,
    physicsBackend: state?.physicsBackend ?? null,
  };
}

function calculateMetrics(samples) {
  const screenSet = new Set();
  const siteSet = new Set();
  const perspectiveIdSet = new Set();
  const motionAuthoritySet = new Set();
  let maxGroundMismatch = 0;
  let maxRenderGroundMismatch = 0;
  let maxOneFrameCameraJump = 0;
  let maxOneFrameGroundDelta = 0;
  let unstableFrameCount = 0;
  let previousCamera = null;
  let previousGround = null;

  for (const sample of samples) {
    if (sample.screen) screenSet.add(sample.screen);
    if (sample.activeSite) siteSet.add(sample.activeSite);
    if (sample.selectedPerspectiveId) perspectiveIdSet.add(sample.selectedPerspectiveId);
    if (sample.motionAuthority) motionAuthoritySet.add(sample.motionAuthority);
    const playerY = Number(sample.playerPosition?.y);
    const groundY = Number(sample.playerGround?.height);
    const renderGroundY = Number(sample.playerRenderGround?.height);
    if (!Number.isFinite(playerY) || !Number.isFinite(groundY)) unstableFrameCount += 1;
    if (Number.isFinite(playerY) && Number.isFinite(groundY)) maxGroundMismatch = Math.max(maxGroundMismatch, Math.abs(playerY - groundY));
    if (Number.isFinite(renderGroundY) && Number.isFinite(groundY)) maxRenderGroundMismatch = Math.max(maxRenderGroundMismatch, Math.abs(renderGroundY - groundY));
    if (!sample.descriptorPosition?.every(Number.isFinite) || !sample.descriptorLookAt?.every(Number.isFinite)) unstableFrameCount += 1;
    const cameraPoint = getCameraPoint(sample);
    if (previousCamera && cameraPoint) maxOneFrameCameraJump = Math.max(maxOneFrameCameraJump, distance3(previousCamera, cameraPoint));
    if (Number.isFinite(previousGround) && Number.isFinite(groundY)) maxOneFrameGroundDelta = Math.max(maxOneFrameGroundDelta, Math.abs(groundY - previousGround));
    previousCamera = cameraPoint ?? previousCamera;
    previousGround = Number.isFinite(groundY) ? groundY : previousGround;
  }

  const first = samples[0] ?? {};
  const last = samples[samples.length - 1] ?? {};
  return {
    sampleCount: samples.length,
    screenSet,
    siteSet,
    perspectiveIdSet,
    motionAuthoritySet,
    maxGroundMismatch: round(maxGroundMismatch),
    maxRenderGroundMismatch: round(maxRenderGroundMismatch),
    maxOneFrameCameraJump: round(maxOneFrameCameraJump),
    maxOneFrameGroundDelta: round(maxOneFrameGroundDelta),
    unstableFrameCount,
    lookYawDelta: round(Math.abs(Number(last.playerLook?.yaw ?? 0) - Number(first.playerLook?.yaw ?? 0))),
    moveDistance: round(distance2(first.playerPosition, last.playerPosition)),
    firstFrame: first.rendererFrame ?? null,
    lastFrame: last.rendererFrame ?? null,
  };
}

function getCameraPoint(sample) {
  const descriptor = sample.descriptorPosition;
  if (descriptor?.every(Number.isFinite)) return { x: descriptor[0], y: descriptor[1], z: descriptor[2] };
  const renderer = sample.rendererCamera?.position;
  if (renderer && [renderer.x, renderer.y, renderer.z].every(Number.isFinite)) return renderer;
  return null;
}

function serializeMetrics(metrics) {
  if (!metrics) return null;
  return {
    ...metrics,
    screenSet: [...metrics.screenSet],
    siteSet: [...metrics.siteSet],
    perspectiveIdSet: [...metrics.perspectiveIdSet],
    motionAuthoritySet: [...metrics.motionAuthoritySet],
  };
}

function summarizeSamples(samples) {
  if (!Array.isArray(samples)) return [];
  const keep = new Set([0, 1, 2, Math.floor(samples.length * 0.2), Math.floor(samples.length * 0.5), Math.floor(samples.length * 0.7), samples.length - 3, samples.length - 2, samples.length - 1]);
  return samples
    .filter((sample) => keep.has(sample.index))
    .map((sample) => ({
      index: sample.index,
      phase: sample.phase,
      screen: sample.screen,
      activeSite: sample.activeSite,
      rendererFrame: sample.rendererFrame,
      selectedPerspectiveId: sample.selectedPerspectiveId,
      motionAuthority: sample.motionAuthority,
      playerPosition: sample.playerPosition,
      playerLook: sample.playerLook,
      playerGround: {
        height: sample.playerGround?.height ?? null,
        placement: sample.playerGround?.placement ?? null,
        walkable: sample.playerGround?.walkable ?? null,
      },
      playerRenderGround: sample.playerRenderGround,
    }));
}

function distance2(a, b) {
  if (!a || !b) return 0;
  const dx = Number(b.x ?? 0) - Number(a.x ?? 0);
  const dz = Number(b.z ?? 0) - Number(a.z ?? 0);
  return Math.hypot(dx, dz);
}

function distance3(a, b) {
  const dx = Number(b.x ?? 0) - Number(a.x ?? 0);
  const dy = Number(b.y ?? 0) - Number(a.y ?? 0);
  const dz = Number(b.z ?? 0) - Number(a.z ?? 0);
  return Math.hypot(dx, dy, dz);
}

function round(value) {
  return Number(Number(value ?? 0).toFixed(4));
}

function withProofParams(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", "1");
  nextUrl.searchParams.set("cameraGroundStabilityProof", Date.now().toString(36));
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
