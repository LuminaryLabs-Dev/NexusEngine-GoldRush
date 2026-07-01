import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  sanitizePathForOutput,
  sanitizedConsoleJson,
  writeSanitizedJsonArtifact,
  writeSanitizedTextArtifact,
} from "../safety/publicArtifactSanitizer.mjs";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const localUrl = args.localUrl ?? "http://127.0.0.1:5177/NexusEngine-GoldRush/";
const publicUrl = args.publicUrl ?? "https://luminarylabs-dev.github.io/NexusEngine-GoldRush/";
const targets = selectTargets(args.target ?? "both");
const reportRoot = path.resolve(args.out ?? "reports/live-state-audit");
const screenshotRoot = path.resolve(args.screenshots ?? "screenshots/live-state-audit");
const videoRoot = path.resolve(args.videos ?? "output/live-state-audit-videos");
const timeoutMs = Number(args.timeout ?? 45000);
const boardingTimeoutMs = Number(args.boardingTimeout ?? 90000);
const sampleCount = Number(args.samples ?? 40);
const sampleTimeoutMs = Number(args.sampleTimeout ?? Math.max(timeoutMs + 20000, sampleCount * 3000));
const hardTimeoutMs = Number(args.hardTimeout ?? ((timeoutMs + 20000) * Math.max(1, targets.length) + 30000));
const headed = args.headed === "true" || args.headed === true;
const recordVideo = args.recordVideo !== "false" && args.recordVideo !== false;
const reportPath = path.join(reportRoot, `local-public-live-audit-${runId}.json`);
const markdownPath = path.join(reportRoot, `local-public-live-audit-${runId}.md`);

await mkdir(reportRoot, { recursive: true });
await mkdir(screenshotRoot, { recursive: true });
await mkdir(videoRoot, { recursive: true });

const report = {
  schema: "nexusengine.goldrush.local-public-live-audit.v1",
  status: "pending",
  startedAt: new Date().toISOString(),
  runId,
  proofOptions: {
    recordVideo,
    hardTimeoutMs,
    boardingTimeoutMs,
    sampleCount,
    sampleTimeoutMs,
  },
  targets: [],
  comparison: null,
};

let browser;
let forceExitAfterReport = false;
try {
  browser = await chromium.launch({ headless: !headed });
  await withTimeout((async () => {
    for (const target of targets) {
      report.targets.push(await auditTarget(browser, target));
    }
    report.comparison = compareTargets(report.targets);
    report.status = report.targets.every((target) => target.status === "passed") ? "passed" : "failed";
  })(), hardTimeoutMs, "live-state-audit hard timeout");
  if (report.status !== "passed") process.exitCode = 1;
} catch (error) {
  report.status = "failed";
  report.error = { message: error.message, stack: error.stack };
  forceExitAfterReport = error.message.includes("live-state-audit hard timeout");
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await withTimeout(browser?.close?.(), 10000, "browser.close").catch((error) => {
    report.browserCloseError = error.message;
  });
  const publicReport = await writeSanitizedJsonArtifact(reportPath, report, { repoRoot });
  await writeSanitizedTextArtifact(markdownPath, renderMarkdown(publicReport), { repoRoot });
  console.log(sanitizedConsoleJson({
    status: publicReport.status,
    report: sanitizePathForOutput(reportPath, { repoRoot }),
    markdown: sanitizePathForOutput(markdownPath, { repoRoot }),
    targets: publicReport.targets.map((target) => ({
      name: target.name,
      status: target.status,
      url: target.url,
      screenshots: target.screenshots,
      videos: target.videos,
      issues: target.issues,
      domains: target.domains,
    })),
    comparison: publicReport.comparison,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
  if (forceExitAfterReport) {
    process.exit(process.exitCode || 1);
  }
}

async function auditTarget(browser, target) {
  const targetScreenshotRoot = path.join(screenshotRoot, target.name);
  const targetVideoRoot = path.join(videoRoot, `${target.name}-${runId}`);
  await mkdir(targetScreenshotRoot, { recursive: true });
  await mkdir(targetVideoRoot, { recursive: true });

  const contextOptions = {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  };
  if (recordVideo) {
    contextOptions.recordVideo = { dir: targetVideoRoot, size: { width: 1440, height: 900 } };
  }
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const targetReport = {
    name: target.name,
    status: "pending",
    url: withSmokeParam(target.url),
    startedAt: new Date().toISOString(),
    steps: [],
    screenshots: [],
    screenshotCaptures: [],
    videos: [],
    consoleErrors: [],
    pageErrors: [],
    samples: [],
    states: {},
    domains: {},
    issues: [],
    proofOptions: {
      recordVideo,
    },
  };

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      targetReport.consoleErrors.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => targetReport.pageErrors.push(error.message));

  try {
    await step(targetReport, "load-title", async () => {
      await page.goto(targetReport.url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
      await page.waitForLoadState("networkidle", { timeout: Math.min(timeoutMs, 15000) }).catch(() => {});
      await page.locator('[data-action="play-title"]').waitFor({ state: "visible", timeout: timeoutMs });
      targetReport.states.title = summarizeState(await getHostState(page));
      await capture(page, targetReport, targetScreenshotRoot, "01-title");
    });

    await step(targetReport, "enter-lobby", async () => {
      await page.locator('[data-action="play-title"]').click();
      await page.locator('[data-action="enter-run"]').waitFor({ state: "visible", timeout: timeoutMs });
      await waitForScreen(page, "lobby");
      targetReport.states.lobby = summarizeState(await getHostState(page));
      await capture(page, targetReport, targetScreenshotRoot, "02-lobby");
    });

    await step(targetReport, "start-loading-yard", async () => {
      await page.locator('[data-action="enter-run"]').click();
      await waitForScreen(page, "loading");
      await waitForActiveSite(page, "site.loading-yard");
      await page.locator('[data-screen-panel="loading"]').click({ position: { x: 720, y: 450 } });
      await waitForBoardingCue(page);
      targetReport.states.loading = summarizeState(await getHostState(page));
      await capture(page, targetReport, targetScreenshotRoot, "03-loading-yard");
    });

    await step(targetReport, "walk-board-train", async () => {
      const boarded = await walkToTrainUntilRun(page, boardingTimeoutMs);
      if (!boarded) throw new Error("failed to board train through camera-relative movement before timeout");
      await waitForScreen(page, "run");
      await waitForActiveSite(page, "site.gold-field");
      await bestEffortClick(page, targetReport, '[data-screen-panel="run"]', "run-stage-focus");
      targetReport.states.run = summarizeState(await getHostState(page));
      await capture(page, targetReport, targetScreenshotRoot, "04-gold-field");
    }, { timeoutMs: boardingTimeoutMs + 15000 });

    await step(targetReport, "sample-camera-ground-motion", async () => {
      targetReport.samples = await sampleMotion(page, sampleCount);
      targetReport.domains = summarizeDomains(targetReport.samples, targetReport.states);
      await capture(page, targetReport, targetScreenshotRoot, "05-motion-sampled");
    }, { timeoutMs: sampleTimeoutMs });

    await step(targetReport, "complete-results", async () => {
      const receipt = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokeCompleteRunToResults?.() ?? { accepted: false, reason: "missing-action" });
      if (!receipt.accepted) throw new Error(`result completion failed: ${receipt.reason}`);
      await waitForScreen(page, "results");
      await waitForActiveSite(page, "site.results");
      targetReport.states.results = summarizeState(await getHostState(page));
      targetReport.domains = summarizeDomains(targetReport.samples, targetReport.states);
      targetReport.issues.push(...detectTargetIssues(targetReport));
      await capture(page, targetReport, targetScreenshotRoot, "06-results");
    });

    targetReport.status = targetReport.issues.some((issue) => issue.severity === "fail") ? "failed" : "passed";
  } catch (error) {
    targetReport.status = "failed";
    targetReport.error = { message: error.message, stack: error.stack };
    targetReport.issues.push({ severity: "fail", domain: "proof", issue: error.message });
    try {
      targetReport.states.failure = summarizeState(await getHostState(page));
      await capture(page, targetReport, targetScreenshotRoot, "99-failure");
    } catch (captureError) {
      targetReport.captureError = captureError.message;
    }
  } finally {
    const video = page.video();
    const closed = await withTimeout(context.close(), 10000, "context.close")
      .then(() => true)
      .catch((error) => {
        targetReport.videoError = error.message;
        return false;
      });
    if (video) {
      try {
        if (closed) {
          targetReport.videos.push(sanitizePathForOutput(await withTimeout(video.path(), 5000, "video.path"), { repoRoot }));
        }
      } catch (error) {
        targetReport.videoError = error.message;
      }
    } else if (!recordVideo) {
      targetReport.videoSkipped = "recordVideo=false";
    }
    targetReport.finishedAt = new Date().toISOString();
  }

  return targetReport;
}

function withTimeout(promise, durationMs, label) {
  if (!promise) return Promise.resolve(null);
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${durationMs}ms`)), durationMs);
    timer.unref?.();
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function step(targetReport, name, callback, options = {}) {
  const startedAt = Date.now();
  const stepTimeoutMs = Number(options.timeoutMs ?? timeoutMs + 20000);
  try {
    await withTimeout(callback(), stepTimeoutMs, `step:${name}`);
    targetReport.steps.push({ name, status: "passed", durationMs: Date.now() - startedAt });
  } catch (error) {
    targetReport.steps.push({ name, status: "failed", durationMs: Date.now() - startedAt, error: error.message });
    throw error;
  }
}

async function capture(page, targetReport, targetScreenshotRoot, name) {
  const file = path.join(targetScreenshotRoot, `${name}-${runId}.png`);
  try {
    await page.screenshot({ path: file, fullPage: false, timeout: 10000 });
    targetReport.screenshots.push(sanitizePathForOutput(file, { repoRoot }));
    targetReport.screenshotCaptures.push({
      file: sanitizePathForOutput(file, { repoRoot }),
      name,
      method: "playwright-page",
    });
    return;
  } catch (pageScreenshotError) {
    try {
      const canvasCapture = await captureCanvasPixels(page, file);
      if (canvasCapture.captured) {
        targetReport.screenshots.push(sanitizePathForOutput(file, { repoRoot }));
        targetReport.screenshotCaptures.push({
          file: sanitizePathForOutput(file, { repoRoot }),
          name,
          method: canvasCapture.method,
          width: canvasCapture.width,
          height: canvasCapture.height,
          nonBlackRatio: Number(canvasCapture.nonBlackRatio.toFixed(4)),
        });
        targetReport.issues.push({
          severity: "warn",
          domain: "proof",
          issue: `${name} used ${canvasCapture.method} fallback: ${pageScreenshotError.message}`,
        });
        return;
      }
      await page.locator("canvas").last().screenshot({ path: file, timeout: 10000 });
      targetReport.screenshots.push(sanitizePathForOutput(file, { repoRoot }));
      targetReport.screenshotCaptures.push({
        file: sanitizePathForOutput(file, { repoRoot }),
        name,
        method: "playwright-canvas-element",
      });
      targetReport.issues.push({
        severity: "warn",
        domain: "proof",
        issue: `${name} used canvas screenshot fallback: ${pageScreenshotError.message}`,
      });
      return;
    } catch (canvasScreenshotError) {
      targetReport.issues.push({
        severity: "warn",
        domain: "proof",
        issue: `${name} screenshot failed: ${canvasScreenshotError.message}`,
      });
    }
  }
}

async function captureCanvasPixels(page, file) {
  const capture = await page.evaluate(() => {
    const canvases = [...document.querySelectorAll("canvas")]
      .map((canvas, index) => {
        const rect = canvas.getBoundingClientRect();
        return {
          canvas,
          index,
          width: canvas.width,
          height: canvas.height,
          area: canvas.width * canvas.height,
          visibleArea: Math.max(0, rect.width) * Math.max(0, rect.height),
        };
      })
      .filter((entry) => entry.width >= 64 && entry.height >= 64)
      .sort((a, b) => (b.visibleArea || b.area) - (a.visibleArea || a.area));
    const entry = canvases[0];
    if (!entry) return { captured: false, reason: "no-canvas" };
    try {
      return {
        captured: true,
        method: "webgl-canvas-data-url",
        width: entry.width,
        height: entry.height,
        nonBlackRatio: calculateCanvasNonBlackRatio(entry.canvas),
        dataUrl: entry.canvas.toDataURL("image/png"),
      };
    } catch (error) {
      return { captured: false, reason: error.message };
    }

    function calculateCanvasNonBlackRatio(canvas) {
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 64;
      sampleCanvas.height = 40;
      const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) return 0;
      context.drawImage(canvas, 0, 0, sampleCanvas.width, sampleCanvas.height);
      const pixels = context.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
      let nonBlack = 0;
      const total = sampleCanvas.width * sampleCanvas.height;
      for (let offset = 0; offset < pixels.length; offset += 4) {
        const alpha = pixels[offset + 3];
        const luma = pixels[offset] + pixels[offset + 1] + pixels[offset + 2];
        if (alpha > 8 && luma > 24) nonBlack += 1;
      }
      return nonBlack / total;
    }
  });
  if (!capture.captured || !capture.dataUrl?.startsWith("data:image/png;base64,")) return capture;
  if ((capture.nonBlackRatio ?? 0) < 0.02) {
    return {
      captured: false,
      reason: `blank-canvas:${Number(capture.nonBlackRatio ?? 0).toFixed(4)}`,
    };
  }
  await writeFile(file, Buffer.from(capture.dataUrl.slice("data:image/png;base64,".length), "base64"));
  return capture;
}

async function bestEffortClick(page, targetReport, selector, label) {
  try {
    await page.locator(selector).click({
      position: { x: 720, y: 450 },
      force: true,
      timeout: 3000,
    });
  } catch (error) {
    targetReport.issues.push({
      severity: "warn",
      domain: "proof",
      issue: `${label} click skipped: ${error.message}`,
    });
  }
}

async function sampleMotion(page, sampleCount) {
  return page.evaluate(({ sampleCount: nextSampleCount }) => {
    const frames = [];
    const compact = (index, phase) => {
      const state = window.GoldRushHost?.getState?.() ?? null;
      const player = state?.localPlayer ?? {};
      const camera = state?.camera ?? {};
      const rendererCamera = state?.renderer?.procedural?.camera ?? state?.runRenderer?.procedural?.camera ?? null;
      return {
        index,
        phase,
        screen: state?.screen ?? null,
        activeSite: state?.activeSite?.id ?? state?.sceneKitLoader?.activeSite?.id ?? null,
        motionAuthority: camera?.motionAuthority ?? null,
        selectedPerspectiveId: camera?.selectedPerspective?.id ?? null,
        cameraMode: camera?.mode ?? state?.scenario?.cameraMode ?? null,
        descriptorPosition: camera?.threeDescriptor?.position ?? null,
        rendererCamera,
        playerPosition: player?.position ?? null,
        playerLook: player?.look ?? null,
        playerGround: player?.ground ?? null,
        playerRenderGround: player?.renderGround ?? null,
        inputModel: player?.inputModel ?? null,
      };
    };

    for (let index = 0; index < nextSampleCount; index += 1) {
      const phase = index < nextSampleCount * 0.25 ? "idle" : index < nextSampleCount * 0.75 ? "move-look" : "settle";
      const input = phase === "move-look"
        ? { keys: ["w"], lookDelta: { x: index % 2 === 0 ? 2.5 : -1.25, y: 0 } }
        : { keys: [] };
      window.GameHost?.tick?.(1 / 30, input);
      window.GameHost?.render?.();
      frames.push(compact(index, phase));
    }
    window.GameHost?.setInput?.({ keys: [] });
    window.GameHost?.render?.();
    return frames;
  }, { sampleCount });
}

function summarizeDomains(samples, states) {
  const metrics = calculateMotionMetrics(samples);
  const run = states.run ?? {};
  return {
    sceneFlow: {
      title: states.title?.screen,
      lobby: states.lobby?.screen,
      loading: states.loading?.screen,
      run: states.run?.screen,
      results: states.results?.screen,
      activeSites: unique([states.loading?.activeSite, states.run?.activeSite, states.results?.activeSite]),
    },
    camera: {
      motionAuthoritySet: [...metrics.motionAuthoritySet],
      perspectiveSet: [...metrics.perspectiveSet],
      maxOneFrameCameraJump: metrics.maxOneFrameCameraJump,
      yawDelta: metrics.yawDelta,
      cameraRelativeWasd: run.localPlayer?.inputModel?.id === "camera-relative-wasd",
      mouseLookDrivesCamera: run.localPlayer?.inputModel?.mouseLookDrivesCamera === true,
    },
    terrain: {
      maxGroundMismatch: metrics.maxGroundMismatch,
      maxRenderGroundMismatch: metrics.maxRenderGroundMismatch,
      maxOneFrameGroundDelta: metrics.maxOneFrameGroundDelta,
      placement: run.localPlayer?.ground?.placement,
      colliderPlacement: run.terrainCollider?.raycastPlacement,
      physicsEngine: run.terrainPhysics?.engine,
    },
    interaction: {
      trainBoardingAction: states.loading?.trainReadout?.nextPlayerAction,
      playerLockedToTrain: states.loading?.loadingScene?.playerLockedToTrain,
      finalScreen: states.results?.screen,
      resultStatus: states.results?.results?.status,
    },
    network: {
      partyStatus: states.lobby?.party?.status,
      capacity: states.lobby?.party?.capacity,
      members: states.lobby?.party?.members,
      launchedPlayers: states.run?.players,
    },
    audio: {
      managerStatus: states.loading?.audioManager?.status ?? states.run?.audioManager?.status,
      trainTransitionAudioContract: states.loading?.audioManager?.trainTransitionAudioContract,
    },
  };
}

function detectTargetIssues(targetReport) {
  const issues = [];
  const domains = targetReport.domains;
  if (targetReport.consoleErrors.length) {
    issues.push({ severity: "warn", domain: "runtime", issue: `${targetReport.consoleErrors.length} console warnings/errors captured` });
  }
  if (targetReport.pageErrors.length) {
    issues.push({ severity: "fail", domain: "runtime", issue: `${targetReport.pageErrors.length} page errors captured` });
  }
  if (!domains.camera?.cameraRelativeWasd) {
    issues.push({ severity: "fail", domain: "control", issue: "run player is not reporting camera-relative WASD" });
  }
  if (!domains.camera?.mouseLookDrivesCamera) {
    issues.push({ severity: "fail", domain: "control", issue: "run player is not reporting mouse-look camera control" });
  }
  if (domains.camera?.motionAuthoritySet?.length !== 1) {
    issues.push({ severity: "fail", domain: "camera", issue: "camera motion authority changed during one run sample" });
  }
  if (domains.camera?.perspectiveSet?.length !== 1) {
    issues.push({ severity: "fail", domain: "camera", issue: "camera perspective reselected during one run sample" });
  }
  if ((domains.camera?.maxOneFrameCameraJump ?? 0) > 4.5) {
    issues.push({ severity: "fail", domain: "camera", issue: `camera jumped ${domains.camera.maxOneFrameCameraJump} units between frames` });
  }
  if ((domains.terrain?.maxGroundMismatch ?? 0) > 0.015) {
    issues.push({ severity: "fail", domain: "terrain", issue: `player y does not match ground height; max ${domains.terrain.maxGroundMismatch}` });
  }
  if ((domains.terrain?.maxRenderGroundMismatch ?? 0) > 0.015) {
    issues.push({ severity: "fail", domain: "terrain", issue: `render ground does not match movement ground; max ${domains.terrain.maxRenderGroundMismatch}` });
  }
  if ((domains.terrain?.maxOneFrameGroundDelta ?? 0) > 0.85) {
    issues.push({ severity: "fail", domain: "terrain", issue: `ground sample pulsed ${domains.terrain.maxOneFrameGroundDelta} units between frames` });
  }
  if (domains.terrain?.physicsEngine !== "cannon-es") {
    issues.push({ severity: "warn", domain: "physics", issue: "terrain physics is not reporting cannon-es" });
  }
  if (domains.interaction?.finalScreen !== "results" || domains.interaction?.resultStatus !== "final") {
    issues.push({ severity: "fail", domain: "match", issue: "results screen did not resolve to final status" });
  }
  return issues;
}

function compareTargets(targets) {
  const local = targets.find((target) => target.name === "local");
  const publicTarget = targets.find((target) => target.name === "public");
  if (!local || !publicTarget) return { status: "single-target", notes: ["comparison requires both local and public"] };

  const mismatches = [];
  compareField(mismatches, "sceneFlow.activeSites", local.domains?.sceneFlow?.activeSites, publicTarget.domains?.sceneFlow?.activeSites);
  compareField(mismatches, "camera.motionAuthoritySet", local.domains?.camera?.motionAuthoritySet, publicTarget.domains?.camera?.motionAuthoritySet);
  compareField(mismatches, "camera.perspectiveSet", local.domains?.camera?.perspectiveSet, publicTarget.domains?.camera?.perspectiveSet);
  compareField(mismatches, "terrain.placement", local.domains?.terrain?.placement, publicTarget.domains?.terrain?.placement);
  compareField(mismatches, "terrain.colliderPlacement", local.domains?.terrain?.colliderPlacement, publicTarget.domains?.terrain?.colliderPlacement);
  compareField(mismatches, "terrain.physicsEngine", local.domains?.terrain?.physicsEngine, publicTarget.domains?.terrain?.physicsEngine);
  compareField(mismatches, "network.launchedPlayers", local.domains?.network?.launchedPlayers, publicTarget.domains?.network?.launchedPlayers);

  return {
    status: mismatches.length ? "different" : "matched",
    mismatches,
    localStatus: local.status,
    publicStatus: publicTarget.status,
  };
}

function compareField(mismatches, field, localValue, publicValue) {
  if (JSON.stringify(localValue) !== JSON.stringify(publicValue)) {
    mismatches.push({ field, local: localValue, public: publicValue });
  }
}

function calculateMotionMetrics(samples) {
  let maxGroundMismatch = 0;
  let maxRenderGroundMismatch = 0;
  let maxOneFrameCameraJump = 0;
  let maxOneFrameGroundDelta = 0;
  let moveDistance = 0;
  const motionAuthoritySet = new Set();
  const perspectiveSet = new Set();
  const yawValues = [];

  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    if (sample.motionAuthority) motionAuthoritySet.add(sample.motionAuthority);
    if (sample.selectedPerspectiveId) perspectiveSet.add(sample.selectedPerspectiveId);
    if (Number.isFinite(sample.playerLook?.yaw)) yawValues.push(sample.playerLook.yaw);

    const playerY = sample.playerPosition?.y;
    const groundY = sample.playerGround?.height;
    const renderGroundY = sample.playerRenderGround?.height;
    if (Number.isFinite(playerY) && Number.isFinite(groundY)) {
      maxGroundMismatch = Math.max(maxGroundMismatch, Math.abs(playerY - groundY));
    }
    if (Number.isFinite(playerY) && Number.isFinite(renderGroundY)) {
      maxRenderGroundMismatch = Math.max(maxRenderGroundMismatch, Math.abs(playerY - renderGroundY));
    }

    const previous = samples[index - 1];
    if (previous) {
      maxOneFrameCameraJump = Math.max(maxOneFrameCameraJump, distance3(
        sample.rendererCamera?.position ?? sample.descriptorPosition,
        previous.rendererCamera?.position ?? previous.descriptorPosition,
      ));
      if (Number.isFinite(groundY) && Number.isFinite(previous.playerGround?.height)) {
        maxOneFrameGroundDelta = Math.max(maxOneFrameGroundDelta, Math.abs(groundY - previous.playerGround.height));
      }
      moveDistance += distance3(sample.playerPosition, previous.playerPosition);
    }
  }

  return {
    sampleCount: samples.length,
    motionAuthoritySet,
    perspectiveSet,
    maxGroundMismatch: round(maxGroundMismatch),
    maxRenderGroundMismatch: round(maxRenderGroundMismatch),
    maxOneFrameCameraJump: round(maxOneFrameCameraJump),
    maxOneFrameGroundDelta: round(maxOneFrameGroundDelta),
    yawDelta: round(yawValues.length ? Math.max(...yawValues) - Math.min(...yawValues) : 0),
    moveDistance: round(moveDistance),
  };
}

function summarizeState(state) {
  if (!state) return null;
  return {
    screen: state.screen,
    activeSite: state.activeSite?.id ?? state.sceneKitLoader?.activeSite?.id ?? null,
    players: state.scenario?.players ?? null,
    loadedKitGroups: state.loadedKitGroups ?? [],
    selectedLegacyMode: state.selectedLegacyMode?.modeId ?? state.scenario?.legacyMode?.activeMode?.modeId ?? null,
    cameraMode: state.scenario?.cameraMode ?? state.camera?.mode ?? null,
    camera: {
      motionAuthority: state.camera?.motionAuthority ?? null,
      selectedPerspectiveId: state.camera?.selectedPerspective?.id ?? null,
      selectedPerspectiveFamily: state.camera?.selectedPerspective?.family ?? null,
    },
    party: {
      status: state.party?.status ?? null,
      members: state.party?.members?.length ?? null,
      capacity: state.party?.capacity ?? null,
      isLeader: state.party?.isLeader ?? null,
    },
    loadingScene: state.loadingScene ? {
      loadingPhase: state.loadingScene.loadingPhase,
      trainDeparting: state.loadingScene.trainDeparting,
      playerLockedToTrain: state.loadingScene.playerLockedToTrain,
      doorOpen: state.loadingScene.doorOpen,
    } : null,
    trainReadout: state.firstSequence?.trainReadout ? {
      currentBeat: state.firstSequence.trainReadout.currentBeat,
      nextPlayerAction: state.firstSequence.trainReadout.nextPlayerAction,
    } : null,
    localPlayer: state.localPlayer ? {
      position: state.localPlayer.position,
      inputModel: state.localPlayer.inputModel,
      ground: state.localPlayer.ground,
      renderGround: state.localPlayer.renderGround,
    } : null,
    terrainCollider: {
      algorithm: state.terrainCollider?.algorithm ?? null,
      raycastPlacement: state.terrainCollider?.raycast?.placement ?? null,
    },
    terrainPhysics: {
      engine: state.terrainPhysics?.engine ?? null,
      shape: state.terrainPhysics?.body?.shape ?? null,
    },
    audioManager: state.audioManager ? {
      status: state.audioManager.status,
      trainTransitionAudioContract: state.audioManager.trainTransitionAudioContract,
      lastTrainCueShots: state.audioManager.lastTrainCueShots,
    } : null,
    results: state.results ? {
      status: state.results.status,
      winner: state.results.winner,
      placementCount: state.results.placements?.length ?? 0,
    } : null,
  };
}

async function waitForScreen(page, screen) {
  await page.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout: timeoutMs });
}

async function waitForActiveSite(page, siteId) {
  await page.waitForFunction((expected) => {
    const state = window.GoldRushHost?.getState?.();
    return state?.activeSite?.id === expected || state?.sceneKitLoader?.activeSite?.id === expected;
  }, siteId, { timeout: timeoutMs });
}

async function waitForBoardingCue(page) {
  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    return state?.loadingScene?.doorOpen === true
      && state?.loadingScene?.boardingCue?.visible === true
      && state?.firstSequence?.trainReadout?.nextPlayerAction === "board-train";
  }, null, { timeout: timeoutMs });
}

async function walkToTrainUntilRun(page, durationMs) {
  const startedAt = Date.now();
  let pressedKeys = new Set();
  try {
    while (Date.now() - startedAt < durationMs) {
      const state = await getHostState(page);
      if (state?.screen === "run") return true;
      const nextKeys = chooseCameraRelativeKeysTowardTrain(state);
      await syncMovementKeys(page, pressedKeys, nextKeys);
      pressedKeys = nextKeys;
      await page.waitForTimeout(250);
    }
    return false;
  } finally {
    await syncMovementKeys(page, pressedKeys, new Set());
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

async function driveSimulatorMovementFrame(page, keys) {
  await page.evaluate((nextKeys) => {
    const input = { keys: nextKeys };
    const host = window.GameHost;
    if (host?.tick) {
      host.tick(1 / 15, input);
      host.render?.();
      return;
    }
    for (const key of nextKeys) {
      const code = { w: "KeyW", a: "KeyA", s: "KeyS", d: "KeyD", Shift: "ShiftLeft" }[key];
      window.dispatchEvent(new KeyboardEvent("keydown", {
        key,
        code,
        bubbles: true,
        cancelable: true,
      }));
    }
  }, [...keys]);
}

async function syncMovementKeys(page, previousKeys, nextKeys) {
  for (const key of previousKeys) {
    if (!nextKeys.has(key)) await sendMovementKey(page, key, "keyup");
  }
  for (const key of nextKeys) {
    if (!previousKeys.has(key)) await sendMovementKey(page, key, "keydown");
  }
}

async function sendMovementKey(page, key, type) {
  const code = { w: "KeyW", a: "KeyA", s: "KeyS", d: "KeyD", Shift: "ShiftLeft" }[key];
  await page.evaluate(({ eventType, keyValue, codeValue }) => {
    window.dispatchEvent(new KeyboardEvent(eventType, {
      key: keyValue,
      code: codeValue,
      bubbles: true,
      cancelable: true,
    }));
  }, { eventType: type, keyValue: key, codeValue: code });
  await page.keyboard[type === "keydown" ? "down" : "up"](key).catch(() => {});
}

async function getHostState(page) {
  return page.evaluate(() => window.GoldRushHost?.getState?.() ?? null);
}

function renderMarkdown(nextReport) {
  const targetSections = nextReport.targets.map((target) => {
    const screenshots = target.screenshots.map((file) => `- ${file}`).join("\n");
    const videos = target.videos.map((file) => `- ${file}`).join("\n");
    const issues = target.issues.length
      ? target.issues.map((issue) => `- ${issue.severity}: ${issue.domain} - ${issue.issue}`).join("\n")
      : "- none";
    const steps = target.steps.map((step) => `- ${step.status}: ${step.name} (${step.durationMs}ms)${step.error ? ` - ${step.error}` : ""}`).join("\n");
    return `## ${target.name}

Status: ${target.status}

URL: ${target.url}

### Steps

${steps}

### Domain Audit

\`\`\`json
${JSON.stringify(target.domains, null, 2)}
\`\`\`

### Issues

${issues}

### Screenshots

${screenshots}

### Videos

${videos || "- none"}
`;
  }).join("\n");

  return `# GoldRush Local/Public Live Audit

Status: ${nextReport.status}

## Comparison

\`\`\`json
${JSON.stringify(nextReport.comparison, null, 2)}
\`\`\`

${targetSections}
`;
}

function withSmokeParam(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", runId);
  return nextUrl.toString();
}

function selectTargets(target) {
  if (target === "local") return [{ name: "local", url: localUrl }];
  if (target === "public") return [{ name: "public", url: publicUrl }];
  return [
    { name: "local", url: localUrl },
    { name: "public", url: publicUrl },
  ];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function distance3(a, b) {
  if (!a || !b) return 0;
  const dx = (a.x ?? 0) - (b.x ?? 0);
  const dy = (a.y ?? 0) - (b.y ?? 0);
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.hypot(dx, dy, dz);
}

function round(value) {
  return Number(value.toFixed(4));
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
