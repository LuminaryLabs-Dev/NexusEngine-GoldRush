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
const outputRoot = path.resolve(args.out ?? "output/playwright/cargo-visual-proof");
const timeoutMs = Number(args.timeout ?? 45000);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(outputRoot, `cargo-visual-${runId}.json`);
const screenshotPath = path.join(outputRoot, `cargo-visual-${runId}.png`);

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
  const placed = await page.evaluate(() => window.GoldRushHost?.actions?.publicSmokePlaceAtTrainDoor?.());
  assert(placed?.accepted, `train placement should be accepted: ${placed?.reason ?? "missing"}`);
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
    const state = host.getState();
    return {
      accepted: Boolean(receipt?.accepted && receipt?.receipt?.complete),
      reason: receipt?.receipt?.reason ?? receipt?.reason ?? null,
      placed,
      objectInteraction: state.objectInteraction ?? null,
      playerActionSurface: state.playerActionSurface ?? null,
      miningReceiptId: receipt?.receipt?.miningReceipt?.receiptId ?? null,
      cargoMobility: state.extractionLoop?.player?.cargo?.mobility ?? null,
      cargoNoisePressure: state.extractionLoop?.player?.cargo?.noisePressure ?? null,
      threatCargoNoise: state.extractionLoop?.combat?.readability?.threats?.["claim-jumper-01"]?.cargoNoisePressure ?? null,
      cargoVisual: state.extractionLoop?.player?.cargo?.visual ?? null,
      rendererCargoVisual: state.renderer?.procedural?.playerRig?.cargoVisual ?? null,
      movementModifiers: state.localPlayer?.movementModifiers ?? null,
    };
  });
  assert(miningSetup.accepted, `mining setup should complete: ${miningSetup.reason ?? "unknown"}`);
  assert(miningSetup.placed?.selection?.selected?.action === "mine-gold", "object affordance placement should select a mine-gold protokit");
  assert(miningSetup.placed?.selection?.selected?.target?.siteId === "mine-seam-01", "selected object affordance should target mine-seam-01");
  assert(miningSetup.objectInteraction?.contract === "goldrush-object-interaction-host-v1", "app state should expose object interaction host contract");
  assert(miningSetup.objectInteraction?.last?.selection?.contract === "goldrush-nearest-object-affordance-v1", "last interaction should keep nearest affordance selector proof");
  assert(miningSetup.playerActionSurface?.contract === "goldrush-player-action-surface-v1", "app state should expose player action surface contract");
  assert(miningSetup.playerActionSurface?.domainPath === "n:goldrush:player-action-surface", "player action surface should stay GoldRush-owned");
  assert(miningSetup.playerActionSurface?.primaryAction?.action === "mine-gold" || miningSetup.playerActionSurface?.cargo?.nextAction === "extract-cashout", "player action surface should compose mining/cargo next action");
  assert(miningSetup.cargoMobility?.contract === "goldrush-cargo-mobility-v1", "cargo state should expose carried-gold mobility contract");
  assert(miningSetup.cargoMobility.speedMultiplier < 1, "cargo mobility should reduce movement speed");
  assert(miningSetup.cargoNoisePressure?.contract === "goldrush-cargo-noise-pressure-v1", "cargo state should expose carried-gold noise pressure contract");
  assert(miningSetup.cargoNoisePressure.detectionRadiusBonus > 0, "cargo noise pressure should widen detection radius");
  assert(miningSetup.threatCargoNoise?.affectsThreat === true, "threat readability should show cargo noise affects claim jumper state");
  assert(miningSetup.cargoVisual?.contract === "goldrush-cargo-visual-v1", "cargo state should expose carried-gold visual contract");
  assert(miningSetup.cargoVisual?.mobility?.contract === "goldrush-cargo-mobility-v1", "cargo visual should include paired mobility contract");
  assert(miningSetup.movementModifiers?.cargo?.contract === "goldrush-cargo-mobility-v1", "movement controller should consume carried-gold mobility contract");

  await page.waitForFunction(() => {
    const state = window.GoldRushHost?.getState?.();
    const cargo = state?.renderer?.procedural?.playerRig?.cargoVisual;
    return cargo?.contract === "goldrush-cargo-visual-v1"
      && cargo?.domainPath === "n:goldrush:gold-carrying"
      && cargo?.visible === true
      && cargo?.amount > 0
      && cargo?.visibleNuggetCount > 0;
  }, null, { timeout: timeoutMs });

  const movementProof = await page.evaluate(() => {
    window.GameHost?.setInput?.({ keys: ["w"] });
    window.GameHost?.tick?.(0.2, { keys: ["w"] });
    const moving = window.GoldRushHost?.getState?.();
    window.GameHost?.setInput?.({ keys: [] });
    window.GameHost?.tick?.(0.05, { keys: [] });
    return {
      speed: moving?.localPlayer?.speed ?? null,
      movementModifiers: moving?.localPlayer?.movementModifiers ?? null,
    };
  });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  const state = await page.evaluate(() => window.GoldRushHost?.getState?.());
  const cargoVisual = state.extractionLoop.player.cargo.visual;
  const cargoMobility = state.extractionLoop.player.cargo.mobility;
  const cargoNoisePressure = state.extractionLoop.player.cargo.noisePressure;
  const threatCargoNoise = state.extractionLoop.combat.readability.threats["claim-jumper-01"].cargoNoisePressure;
  const rendererCargoVisual = state.renderer.procedural.playerRig.cargoVisual;
  const markerReadability = state.renderer.procedural.objectMicroKits.markerReadability;
  const selectedAffordanceCue = state.renderer.procedural.objectMicroKits.selectedAffordanceCue;
  const proximityReadability = state.renderer.procedural.objectMicroKits.proximityReadability;
  const resourceVisualForms = state.renderer.procedural.objectMicroKits.resourceVisualForms;
  const extractionCashoutCue = state.renderer.procedural.gameplay.extractionLoopMarkers.extractionCue;
  const extractionSetpiece = state.renderer.procedural.gameplay.extractionLoopMarkers.extractionSetpiece;
  const extractionInteractionCue = state.renderer.procedural.gameplay.extractionLoopMarkers.extractionInteractionCue;
  const playerActionSurface = state.playerActionSurface;
  const playerActionSurfacePrompt = state.renderer.procedural.gameplay.playerActionSurfacePrompt;
  assert(playerActionSurface.contract === "goldrush-player-action-surface-v1", "final state should retain player action surface contract");
  assert(playerActionSurface.domainPath === "n:goldrush:player-action-surface", "final player action surface should stay GoldRush-owned");
  assert(playerActionSurface.consumes.includes("n:gameplay:interaction-hold"), "player action surface should consume interaction-hold");
  assert(playerActionSurface.consumes.includes("n:gameplay:extraction"), "player action surface should consume gameplay extraction");
  assert(playerActionSurface.availableActions.some((action) => action.action === "cashout-gold"), "player action surface should include cashout after mining cargo");
  assert(playerActionSurface.cargo.amount > 0, "player action surface should expose carried cargo amount");
  assert(playerActionSurfacePrompt.contract === "goldrush-player-action-surface-visual-v1", "renderer should expose player action surface visual contract");
  assert(playerActionSurfacePrompt.domainPath === "n:render:micro-object-instancing", "player action visual should stay renderer-owned");
  assert(playerActionSurfacePrompt.consumes?.includes("n:goldrush:player-action-surface"), "player action visual should consume the player action surface");
  assert(playerActionSurfacePrompt.sourceContract === playerActionSurface.contract, "player action visual should name the gameplay source contract");
  assert(playerActionSurfacePrompt.visible === true, "player action visual should be visible during active run interactions");
  assert(playerActionSurfacePrompt.availableActionCount >= 2, "player action visual should retain multiple available action choices");
  assert(rendererCargoVisual.contract === cargoVisual.contract, "renderer cargo contract should match gameplay cargo contract");
  assert(rendererCargoVisual.domainPath === "n:goldrush:gold-carrying", "renderer cargo should stay owned by the gold-carrying kit domain");
  assert(rendererCargoVisual.renderRole === "carried-object", "renderer cargo should expose carried-object role");
  assert(rendererCargoVisual.mobility?.contract === "goldrush-cargo-mobility-v1", "renderer cargo should preserve mobility contract");
  assert(rendererCargoVisual.postureLean > 0, "renderer cargo should expose posture lean from mobility data");
  assert(rendererCargoVisual.visible === true, "renderer cargo should be visible after mining");
  assert(rendererCargoVisual.visibleNuggetCount > 0, "renderer cargo should show visible gold nuggets after mining");
  assert(rendererCargoVisual.nextAction === "extract-cashout", "renderer cargo should preserve next-action cue");
  assert(movementProof.movementModifiers?.cargo?.contract === "goldrush-cargo-mobility-v1", "movement proof should retain cargo mobility contract");
  assert(movementProof.movementModifiers.speedMultiplier === cargoMobility.speedMultiplier, "movement proof should use cargo speed multiplier");
  assert(movementProof.speed > 0 && movementProof.speed < 4.4, "carried cargo should reduce controller walk speed below unloaded base walk speed");
  assert(cargoNoisePressure.contract === "goldrush-cargo-noise-pressure-v1", "final cargo state should retain noise pressure contract");
  assert(threatCargoNoise.affectsThreat === true, "final threat readability should retain cargo-noise effect");
  assert(markerReadability.contract === "goldrush-affordance-marker-readability-v1", "object marker readability contract should be present");
  assert(markerReadability.visibleMarkerCount <= markerReadability.selectedVisible + markerReadability.maxNearbyVisible, "object marker readability should cap visible affordance rings");
  assert(markerReadability.roles.selected === 1, "exactly one selected object affordance marker should be loud");
  assert(markerReadability.hiddenMarkerCount > markerReadability.visibleMarkerCount, "non-selected object affordance markers should be hidden by default");
  assert(selectedAffordanceCue.contract === "goldrush-selected-affordance-cue-v1", "selected object affordance cue contract should be present");
  assert(selectedAffordanceCue.domainPath === "n:render:micro-object-instancing", "selected affordance cue should stay owned by the renderer micro-object domain");
  assert(selectedAffordanceCue.visible === true, "selected affordance cue should be visible for the selected object");
  assert(selectedAffordanceCue.selectedKitId === markerReadability.selectedKitId, "selected affordance cue should point at the same selected kit as the marker readability policy");
  assert(selectedAffordanceCue.action === "mine-gold", "selected affordance cue should preserve the protokit interaction action");
  assert(selectedAffordanceCue.progress >= 0 && selectedAffordanceCue.progress <= 1, "selected affordance cue progress should be normalized");
  assert(proximityReadability.contract === "goldrush-object-proximity-readability-v1", "object proximity readability contract should be present");
  assert(proximityReadability.domainPath === "n:render:micro-object-instancing", "object proximity readability should stay renderer-owned");
  assert(proximityReadability.selectedKitId === markerReadability.selectedKitId, "object proximity readability should protect the same selected kit");
  assert(proximityReadability.selectedProtected === 1, "object proximity readability should preserve one selected object at full readable scale");
  assert(proximityReadability.compressedCount > 0, "object proximity readability should compress nearby nonselected clutter");
  assert(resourceVisualForms.contract === "goldrush-resource-visual-forms-v1", "resource visual forms contract should be present");
  assert(resourceVisualForms.domainPath === "n:render:micro-object-instancing", "resource visual forms should stay renderer-owned");
  assert(resourceVisualForms.allRequiredFormsPresent === true, "resource visual forms should cover nuggets, ore lodes, seams, and tailings");
  assert(resourceVisualForms.goldReadableCount > 0 && resourceVisualForms.oreReadableCount > 0, "resource visual forms should keep both gold and ore families readable");
  assert(extractionCashoutCue.contract === "goldrush-extraction-cashout-cue-v1", "extraction cashout cue contract should be present");
  assert(extractionCashoutCue.domainPath === "n:render:micro-object-instancing", "extraction cashout cue should stay renderer-owned");
  assert(extractionCashoutCue.consumes === "n:gameplay:extraction", "extraction cashout cue should consume the gameplay extraction marker state");
  assert(extractionCashoutCue.visibleCueCount >= 1, "cashout cue should keep at least one visible extraction beacon");
  assert(extractionCashoutCue.primary?.nextAction === "route-to-cashout" || extractionCashoutCue.primary?.nextAction === "hold-cashout", "cashout cue should guide the player toward or through extraction");
  assert(extractionSetpiece.contract === "goldrush-extraction-setpiece-v1", "extraction setpiece contract should be present");
  assert(extractionSetpiece.domainPath === "n:render:micro-object-instancing", "extraction setpiece should stay renderer-owned");
  assert(extractionSetpiece.consumes?.includes("n:gameplay:extraction"), "extraction setpiece should consume gameplay extraction state");
  assert(extractionSetpiece.consumes?.includes("goldrush-extraction-cashout-cue-v1"), "extraction setpiece should compose from the cashout cue contract");
  assert(extractionSetpiece.setpieceRole === "rail-depot-cashout-landmark", "extraction setpiece should expose a rail depot landmark role");
  assert(extractionSetpiece.visibleSetpieceCount >= 1, "extraction setpiece should keep at least one visible destination landmark");
  assert(extractionSetpiece.primary?.hasVerticalSilhouette === true, "extraction setpiece should expose vertical silhouette proof");
  assert(extractionSetpiece.primary?.hasSmokeCue === true, "extraction setpiece should expose smoke cue proof");
  assert(extractionSetpiece.primary?.hasRailLanguage === true, "extraction setpiece should expose rail language proof");
  assert(extractionSetpiece.primary?.nextAction === extractionCashoutCue.primary?.nextAction, "extraction setpiece should preserve the cashout next action");
  assert(extractionInteractionCue.contract === "goldrush-extraction-interaction-cue-v1", "extraction interaction cue contract should be present");
  assert(extractionInteractionCue.domainPath === "n:render:micro-object-instancing", "extraction interaction cue should stay renderer-owned");
  assert(extractionInteractionCue.consumes?.includes("goldrush-extraction-cashout-cue-v1"), "extraction interaction cue should compose from the cashout cue");
  assert(extractionInteractionCue.primary?.nextAction === "route-to-cashout" || extractionInteractionCue.primary?.nextAction === "hold-cashout" || extractionInteractionCue.primary?.nextAction === "keep-holding-cashout", "extraction interaction cue should expose the next cashout action");

  report.status = "passed";
  report.checks.push(
    "object-affordance-selected",
    "object-affordance-mines-gold",
    "mining-completes",
    "cargo-mobility-contract",
    "cargo-noise-pressure-contract",
    "threat-detection-noise-pressure",
    "movement-controller-load-contract",
    "movement-speed-reduced",
    "cargo-visual-contract",
    "renderer-cargo-contract",
    "renderer-cargo-posture",
    "visible-carried-gold",
    "visible-nugget-count",
    "next-action-extract-cashout",
    "affordance-marker-readability-contract",
    "affordance-marker-clutter-capped",
    "selected-affordance-cue-contract",
    "selected-affordance-cue-visible",
    "object-proximity-readability-contract",
    "object-proximity-clutter-compressed",
    "resource-visual-forms-contract",
    "resource-visual-forms-complete",
    "extraction-cashout-cue-contract",
    "extraction-cashout-cue-visible",
    "extraction-setpiece-contract",
    "extraction-setpiece-visible",
    "extraction-setpiece-composes-cashout-cue",
    "extraction-interaction-cue-contract",
    "extraction-interaction-next-action",
    "player-action-surface-contract",
    "player-action-surface-cashout-action",
    "player-action-surface-visual-contract",
    "player-action-surface-visual-visible",
  );
  report.finalState = {
    screen: state.screen,
    activeSite: state.activeSite?.id,
    miningReceiptId: miningSetup.miningReceiptId,
    objectInteraction: state.objectInteraction,
    cargoMobility,
    cargoNoisePressure,
    threatCargoNoise,
    cargoVisual,
    rendererCargoVisual,
    markerReadability,
    selectedAffordanceCue,
    proximityReadability,
    resourceVisualForms,
    extractionCashoutCue,
    extractionSetpiece,
    extractionInteractionCue,
    playerActionSurface,
    playerActionSurfacePrompt,
    movementProof,
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
  nextUrl.searchParams.set("cargoVisualProof", Date.now().toString(36));
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
