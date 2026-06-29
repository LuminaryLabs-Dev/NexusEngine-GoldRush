import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
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
      return state?.loadingScene?.doorOpen === true;
    }, null, { timeout: timeoutMs });
    const walkedToRun = await walkForwardUntilRun(page, 12000);
    const screenAfterWalk = await getHostState(page);
    if (!walkedToRun && screenAfterWalk?.screen !== "run") {
      const receipt = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.() ?? { accepted: false, reason: "missing-action" });
      if (!receipt.accepted) throw new Error(`public smoke train-door placement failed: ${receipt.reason}`);
    }
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
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  await writeFile(markdownPath, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    url: report.url,
    report: reportPath,
    markdown: markdownPath,
    screenshots: report.screenshots,
    finalState: report.finalState,
    error: report.error?.message ?? null,
  }, null, 2));
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
  report.screenshots.push(file);
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

async function walkForwardUntilRun(page, durationMs) {
  const startedAt = Date.now();
  await sendForwardKey(page, "keydown");
  try {
    while (Date.now() - startedAt < durationMs) {
      await sendForwardKey(page, "keydown");
      const state = await getHostState(page);
      if (state?.screen === "run") return true;
      await page.waitForTimeout(250);
    }
    return false;
  } finally {
    await sendForwardKey(page, "keyup");
  }
}

async function sendForwardKey(page, type) {
  const isDown = type === "keydown";
  await page.evaluate((eventType) => {
    ["w", "ArrowUp"].forEach((key) => {
      window.dispatchEvent(new KeyboardEvent(eventType, {
        key,
        code: key === "w" ? "KeyW" : "ArrowUp",
        bubbles: true,
        cancelable: true,
      }));
    });
  }, type);
  const operation = isDown ? "down" : "up";
  await page.keyboard[operation]("w").catch(() => {});
  await page.keyboard[operation]("ArrowUp").catch(() => {});
}

async function getHostState(page) {
  return page.evaluate(() => window.GoldRushHost?.getState?.() ?? null);
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
