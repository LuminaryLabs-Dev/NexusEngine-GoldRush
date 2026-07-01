import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
  sanitizePathForOutput,
  sanitizedConsoleJson,
  writeSanitizedJsonArtifact,
  writeSanitizedTextArtifact,
} from "../safety/publicArtifactSanitizer.mjs";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const publicUrl = args.url || process.env.GOLDRUSH_PUBLIC_URL || "https://luminarylabs-dev.github.io/NexusEngine-GoldRush/";
const cacheBustUrl = withCacheBust(publicUrl);
const outputRoot = path.resolve(args.out ?? "reports/public-smoke");
const screenshotRoot = path.resolve(args.screenshots ?? "screenshots/public-smoke");
const timeoutMs = Number(args.timeout ?? 45000);
const headed = args.headed === "true" || args.headed === true;
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `public-smoke-${runId}.json`);
const markdownPath = path.join(outputRoot, `public-smoke-${runId}.md`);

await mkdir(outputRoot, { recursive: true });
await mkdir(screenshotRoot, { recursive: true });

const report = {
  status: "pending",
  url: cacheBustUrl,
  startedAt: new Date().toISOString(),
  steps: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  loadingCheckpoint: null,
  boardingPath: null,
  finalState: null,
};

let browser;
let page;
try {
  browser = await chromium.launch({ headless: !headed });
  page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      report.consoleErrors.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => {
    report.pageErrors.push(error.message);
  });

  await step("load-public-url", async () => {
    await gotoWithRetry(page, cacheBustUrl, { timeoutMs });
    await page.locator('[data-action="play-title"]').waitFor({ state: "visible", timeout: timeoutMs });
    await assertHostState(page, (state) => state.screen === "start", "expected start screen after public load");
    await capture(page, "01-title");
  });

  await step("enter-lobby", async () => {
    await page.locator('[data-action="play-title"]').click();
    await page.locator('[data-action="enter-run"]').waitFor({ state: "visible", timeout: timeoutMs });
    await assertHostState(page, (state) => state.screen === "lobby", "expected lobby after Play");
    await capture(page, "02-lobby");
  });

  await step("select-classic-combat-version", async () => {
    await page.locator(".advancedPanel summary").click();
    await page.locator("[data-legacy-mode-select]").selectOption("classicCombat");
    await assertHostState(page, (state) => {
      return state.selectedLegacyMode?.modeId === "classicCombat"
        && state.scenario?.legacyMode?.activeMode?.modeId === "classicCombat";
    }, "expected lobby to select classic combat legacy mode");
  });

  await step("start-loading-yard", async () => {
    await page.locator('[data-action="enter-run"]').click();
    await waitForScreen(page, "loading", timeoutMs);
    await waitForActiveSite(page, "site.loading-yard", timeoutMs);
    await page.locator('[data-screen-panel="loading"]').click({ position: { x: 720, y: 450 } });
    await capture(page, "03-loading-yard");
  });

  await step("board-train-and-enter-match", async () => {
    await page.waitForFunction(() => {
      const state = window.GoldRushHost?.getState?.();
      return state?.loadingScene?.doorOpen === true
        && state?.loadingScene?.boardingCue?.contract === "goldrush-train-boarding-cue-v1"
        && state?.loadingScene?.boardingCue?.visible === true
        && state?.firstSequence?.trainReadout?.nextPlayerAction === "board-train"
        && state?.audioManager?.lastTrainCueShots?.some((shot) => {
          return shot.contract === "goldrush-train-transition-audio-cues-v1"
            && shot.trainBeat === "player-boarding";
        });
    }, null, { timeout: timeoutMs });
    const loadingState = await getHostState(page);
    report.loadingCheckpoint = summarizeState(loadingState);
    assert(report.loadingCheckpoint?.screen === "loading", "loading checkpoint should be captured before match handoff");
    assert(report.loadingCheckpoint?.audioManager?.lastTrainCueShots?.some((shot) => {
      return shot.contract === "goldrush-train-transition-audio-cues-v1"
        && shot.trainBeat === "player-boarding"
        && shot.fallbackPattern === "train-board";
    }), "loading checkpoint should retain the train boarding audio fallback cue");
    const walkedToRun = await walkToTrainUntilRun(page, 14000);
    const screenAfterWalk = await getHostState(page);
    report.boardingPath = summarizeBoardingPath(screenAfterWalk, { walkedToRun });
    assert(walkedToRun || screenAfterWalk?.screen === "run", "public smoke must board the train through natural camera-relative walking from the loading-yard spawn");
    await waitForScreen(page, "run", timeoutMs);
    await waitForActiveSite(page, "site.gold-field", timeoutMs);
    await capture(page, "04-gold-field");
  });

  await step("validate-runtime-state", async () => {
    const state = await getHostState(page);
    report.finalState = summarizeState(state);
    assert(state.screen === "run", "public smoke should end in run screen");
    assert(state.scenario?.players === 20, "leader launch should create a 20-player match");
    assert(state.scenario?.legacyMode?.activeMode?.modeId === "classicCombat", "classic combat mode should survive launch");
    assert(state.scenario?.cameraMode === "combat", "classic combat should launch with combat camera mode");
    assert(state.scenario?.sceneState?.currentSceneId === "goldrush.scene.legacyGame", "classic combat should target legacy Game scene");
    assert(state.scenario?.legacyMode?.unifiedRuntime?.oneGame === true, "legacy modes should stay inside one runtime");
    assert(state.activeSite?.id === "site.gold-field", "run screen should activate the gold-field site");
    assert(state.loadedKitGroups?.includes("procedural-terrain"), "run screen should load procedural-terrain kit group");
    assert(state.localPlayer?.inputModel?.id === "camera-relative-wasd", "run player should use camera-relative WASD");
    assert(state.terrainCollider?.raycast?.placement === "highest-visible-banded-triangle-hit", "terrain collider should use visible-band raycast placement");
    assert(state.terrainPhysics?.engine === "cannon-es", "terrain physics should expose cannon-es engine");
    assert(state.physicsBackend?.activeBackend === "cannon-es", "physics backend kit should select cannon-es");
    assert(state.realityValidation?.passed === true, "reality-status validation should pass");
  });

  await step("complete-extraction-and-results", async () => {
    const receipt = await page.evaluate(async () => window.GoldRushHost?.actions?.publicSmokeCompleteRunToResults?.() ?? { accepted: false, reason: "missing-action" });
    if (!receipt.accepted) throw new Error(`public smoke result completion failed: ${receipt.reason}`);
    await waitForScreen(page, "results", timeoutMs);
    await waitForActiveSite(page, "site.results", timeoutMs);
    await page.waitForFunction(() => {
      const state = window.GoldRushHost?.getState?.();
      return state?.loadedKitGroups?.includes("results-summary")
        && state?.loadedKitGroups?.includes("replay-summary")
        && state?.results?.status === "final";
    }, null, { timeout: timeoutMs });
    const resultsText = await page.locator('[data-screen-panel="results"]').innerText({ timeout: timeoutMs });
    assert(/Lockdown/i.test(resultsText), "results screen should show lockdown extraction context");
    assert(/Replay Moments/i.test(resultsText), "results screen should show replay moments");
    assert(!/GOLDRUSH\.CONDITION/i.test(resultsText), "results screen should not leak raw condition ids");
    assert(!/claim-jumper-01/i.test(resultsText), "results screen should not leak raw threat ids");
    assert(!/rail-depot-extract-01/i.test(resultsText), "results screen should not leak raw cashout site ids");
    const actionVisibility = await getResultActionVisibility(page);
    assert(actionVisibility.every((entry) => entry.visible), `results action buttons should stay in first viewport: ${JSON.stringify(actionVisibility)}`);
    const state = await getHostState(page);
    report.finalState = summarizeState(state);
    assert(state.results?.extractionContestSummary?.lockdownCount === 1, "results should count one lockdown extraction");
    assert(state.results?.extractionContestSummary?.calledThreatIds?.includes("claim-jumper-01"), "results should preserve called contest threat");
    assert(state.replaySummary?.extractionContestSummary?.lockdownCount === 1, "replay should count one lockdown extraction");
    await capture(page, "05-results");
  });

  report.status = "passed";
} catch (error) {
  report.status = "failed";
  if (page) {
    try {
      report.finalState = summarizeState(await getHostState(page));
      await capture(page, "99-failure");
    } catch (captureError) {
      report.captureError = captureError.message;
    }
  }
  report.error = {
    message: error.message,
    stack: error.stack,
  };
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await browser?.close();
  const publicReport = await writeSanitizedJsonArtifact(reportPath, report, { repoRoot });
  await writeSanitizedTextArtifact(markdownPath, renderMarkdown(publicReport), { repoRoot });
  console.log(sanitizedConsoleJson({
    status: publicReport.status,
    url: publicReport.url,
    report: sanitizePathForOutput(reportPath),
    markdown: sanitizePathForOutput(markdownPath),
    screenshots: publicReport.screenshots,
    loadingCheckpoint: publicReport.loadingCheckpoint,
    boardingPath: publicReport.boardingPath,
    finalState: publicReport.finalState,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
}

async function step(name, callback) {
  const startedAt = Date.now();
  try {
    await callback();
    report.steps.push({ name, status: "passed", durationMs: Date.now() - startedAt });
  } catch (error) {
    report.steps.push({ name, status: "failed", durationMs: Date.now() - startedAt, error: error.message });
    throw error;
  }
}

async function gotoWithRetry(page, url, { timeoutMs: timeout, attempts = 6 } = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout });
      if (!response?.ok()) throw new Error(`public URL returned HTTP ${response?.status() ?? "unknown"}`);
      await page.waitForLoadState("networkidle", { timeout: Math.min(timeout, 15000) }).catch(() => {});
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await page.waitForTimeout(3500 * attempt);
    }
  }
  throw lastError;
}

async function capture(page, name) {
  const file = path.join(screenshotRoot, `${name}-${runId}.png`);
  await page.screenshot({ path: file, fullPage: false });
  report.screenshots.push(sanitizePathForOutput(file));
}

async function waitForScreen(page, screen, timeout) {
  await page.waitForFunction((expected) => window.GoldRushHost?.getState?.().screen === expected, screen, { timeout });
}

async function waitForActiveSite(page, siteId, timeout) {
  await page.waitForFunction((expected) => {
    const state = window.GoldRushHost?.getState?.();
    return state?.sceneKitLoader?.activeSite?.id === expected;
  }, siteId, { timeout });
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

  const toTarget = {
    x: anchor.x - position.x,
    z: anchor.z - position.z,
  };
  const distance = Math.hypot(toTarget.x, toTarget.z);
  if (distance <= 0.15) return new Set();

  const desired = {
    x: toTarget.x / distance,
    z: toTarget.z / distance,
  };
  const forwardLength = Math.hypot(forward.x, forward.z) || 1;
  const fwd = {
    x: forward.x / forwardLength,
    z: forward.z / forwardLength,
  };
  const right = { x: fwd.z, z: -fwd.x };
  const forwardDot = desired.x * fwd.x + desired.z * fwd.z;
  const rightDot = desired.x * right.x + desired.z * right.z;
  const keys = new Set();
  if (forwardDot >= 0.22) keys.add("w");
  if (forwardDot <= -0.22) keys.add("s");
  if (rightDot >= 0.22) keys.add("d");
  if (rightDot <= -0.22) keys.add("a");
  if (!keys.size) keys.add(forwardDot >= 0 ? "w" : "s");
  return keys;
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
  const code = {
    w: "KeyW",
    a: "KeyA",
    s: "KeyS",
    d: "KeyD",
  }[key];
  const isDown = type === "keydown";
  await page.evaluate(({ eventType, keyValue, codeValue }) => {
    window.dispatchEvent(new KeyboardEvent(eventType, {
      key: keyValue,
      code: codeValue,
      bubbles: true,
      cancelable: true,
    }));
  }, { eventType: type, keyValue: key, codeValue: code });
  const operation = isDown ? "down" : "up";
  await page.keyboard[operation](key).catch(() => {});
}

async function getHostState(page) {
  return page.evaluate(() => window.GoldRushHost?.getState?.() ?? null);
}

async function getResultActionVisibility(page) {
  return page.evaluate(() => {
    return ["results-lobby", "results-next-run"].map((action) => {
      const element = document.querySelector(`[data-action="${action}"]`);
      const rect = element?.getBoundingClientRect();
      return {
        action,
        visible: Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom <= window.innerHeight && rect.top >= 0),
        top: Number(rect?.top?.toFixed(1) ?? 0),
        bottom: Number(rect?.bottom?.toFixed(1) ?? 0),
        viewportHeight: window.innerHeight,
      };
    });
  });
}

async function assertHostState(page, predicate, message) {
  const state = await getHostState(page);
  assert(state && predicate(state), message);
  return state;
}

function summarizeState(state) {
  if (!state) return null;
  return {
    screen: state.screen,
    activeSite: state.activeSite?.id,
    players: state.scenario?.players,
    legacyMode: state.scenario?.legacyMode ? {
      activeModeId: state.scenario.legacyMode.activeMode?.modeId,
      sourceVersionRole: state.scenario.legacyMode.activeMode?.sourceVersionRole,
      oneGame: state.scenario.legacyMode.unifiedRuntime?.oneGame,
      perspectiveSwitchesInCombat: state.scenario.legacyMode.unifiedRuntime?.perspectiveSwitchesInCombat,
    } : null,
    cameraMode: state.scenario?.cameraMode,
    sceneState: {
      currentSceneId: state.scenario?.sceneState?.currentSceneId,
      activeAudioCueId: state.scenario?.sceneState?.activeAudioCueId,
    },
    loadedKitGroups: state.loadedKitGroups,
    party: {
      status: state.party?.status,
      members: state.party?.members?.length,
      capacity: state.party?.capacity,
      isLeader: state.party?.isLeader,
    },
    loadingScene: state.loadingScene ? {
      loadingPhase: state.loadingScene.loadingPhase,
      trainDeparting: state.loadingScene.trainDeparting,
      playerLockedToTrain: state.loadingScene.playerLockedToTrain,
      trainPosition: state.loadingScene.trainPosition,
      trainReadout: state.firstSequence?.trainReadout ? {
        contract: state.firstSequence.trainReadout.contract,
        currentBeat: state.firstSequence.trainReadout.currentBeat,
        nextPlayerAction: state.firstSequence.trainReadout.nextPlayerAction,
      } : null,
    } : null,
    audioManager: state.audioManager ? {
      status: state.audioManager.status,
      trainTransitionAudioContract: state.audioManager.trainTransitionAudioContract,
      lastTrainCueShots: state.audioManager.lastTrainCueShots,
    } : null,
    loadingPlayer: state.loadingPlayer ? {
      position: state.loadingPlayer.position,
      controls: state.loadingPlayer.controls,
    } : null,
    localPlayer: {
      position: state.localPlayer?.position,
      inputModel: state.localPlayer?.inputModel,
      ground: {
        height: state.localPlayer?.ground?.height,
        placement: state.localPlayer?.ground?.placement,
        walkable: state.localPlayer?.ground?.walkable,
      },
    },
    terrainCollider: {
      algorithm: state.terrainCollider?.algorithm,
      raycastPlacement: state.terrainCollider?.raycast?.placement,
    },
    terrainPhysics: {
      engine: state.terrainPhysics?.engine,
      bodyShape: state.terrainPhysics?.body?.shape,
    },
    physicsBackend: {
      activeBackend: state.physicsBackend?.activeBackend,
      recommendation: state.physicsBackend?.recommendation,
    },
    realityValidation: state.realityValidation,
    results: state.results ? {
      status: state.results.status,
      winner: state.results.winner,
      placementCount: state.results.placements?.length ?? 0,
      contest: state.results.extractionContestSummary ? {
        lockdownCount: state.results.extractionContestSummary.lockdownCount,
        calledThreatIds: state.results.extractionContestSummary.calledThreatIds,
        highestPressure: state.results.extractionContestSummary.highestPressure,
      } : null,
      finalRushPressure: state.results.finalRushPressureSummary ? {
        pressureLinkedReceiptCount: state.results.finalRushPressureSummary.pressureLinkedReceiptCount,
        highestPressure: state.results.finalRushPressureSummary.highestPressure,
        maxMultiplier: state.results.finalRushPressureSummary.maxMultiplier,
      } : null,
      awards: state.results.awards?.map((award) => award.id) ?? [],
    } : null,
    replaySummary: state.replaySummary ? {
      resultStatus: state.replaySummary.resultStatus,
      keyMoments: state.replaySummary.keyMoments?.length ?? 0,
      contest: state.replaySummary.extractionContestSummary ? {
        lockdownCount: state.replaySummary.extractionContestSummary.lockdownCount,
        calledThreatIds: state.replaySummary.extractionContestSummary.calledThreatIds,
      } : null,
    } : null,
  };
}

function summarizeBoardingPath(state, { walkedToRun }) {
  return {
    method: walkedToRun || state?.screen === "run" ? "natural-walk-from-loading-yard-spawn" : "failed-before-run",
    screen: state?.screen ?? null,
    loadingPhase: state?.loadingScene?.loadingPhase ?? null,
    trainDeparting: state?.loadingScene?.trainDeparting ?? null,
    playerLockedToTrain: state?.loadingScene?.playerLockedToTrain ?? null,
    nextPlayerAction: state?.firstSequence?.trainReadout?.nextPlayerAction ?? null,
    loadingPlayerPosition: state?.loadingPlayer?.position ?? null,
  };
}

function renderMarkdown(nextReport) {
  const stepLines = nextReport.steps.map((step) => {
    return `- ${step.status}: ${step.name} (${step.durationMs}ms)${step.error ? ` - ${step.error}` : ""}`;
  }).join("\n");
  const screenshotLines = nextReport.screenshots.map((file) => `- ${file}`).join("\n");
  return `# Public Deploy Smoke

Status: ${nextReport.status}

URL: ${nextReport.url}

## Steps

${stepLines}

## Screenshots

${screenshotLines}

## Loading Checkpoint

\`\`\`json
${JSON.stringify(nextReport.loadingCheckpoint, null, 2)}
\`\`\`

## Boarding Path

\`\`\`json
${JSON.stringify(nextReport.boardingPath, null, 2)}
\`\`\`

## Final State

\`\`\`json
${JSON.stringify(nextReport.finalState, null, 2)}
\`\`\`

## Errors

\`\`\`json
${JSON.stringify({ consoleErrors: nextReport.consoleErrors, pageErrors: nextReport.pageErrors, error: nextReport.error ?? null }, null, 2)}
\`\`\`
`;
}

function withCacheBust(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("publicSmoke", Date.now().toString(36));
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
