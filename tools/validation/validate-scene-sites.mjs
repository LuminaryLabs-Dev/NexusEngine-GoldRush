import { readFileSync } from "node:fs";
import { createGoldRushSceneKitLoader, validateGoldRushSceneKitLoaderSnapshot } from "../../src/scenes/goldRushSceneKitLoader.js";
import { getGoldRushSceneKitGroups, goldRushSceneSites, validateGoldRushSceneSites } from "../../src/scenes/goldRushSceneSites.js";

const validation = validateGoldRushSceneSites(goldRushSceneSites);
assert(validation.passed, `scene site validation failed: ${validation.failures.join(", ")}`);

const lobbySite = goldRushSceneSites.find((site) => site.id === "site.lobby-character");
const loadingSite = goldRushSceneSites.find((site) => site.id === "site.loading-yard");
const fieldSite = goldRushSceneSites.find((site) => site.id === "site.gold-field");
const resultsSite = goldRushSceneSites.find((site) => site.id === "site.results");
assert(lobbySite?.kitGroups.includes("three-lobby-character"), "lobby site must load the Three.js character kit group");
assert(lobbySite?.kitGroups.includes("frontier-condition-briefing"), "lobby site must expose the frontier condition briefing kit group");
assert(loadingSite?.kitGroups.includes("train-departure"), "loading-yard site must load the train departure kit group");
assert(loadingSite?.kitGroups.includes("frontier-condition-briefing"), "loading-yard site must retain the frontier condition briefing kit group");
assert(fieldSite?.kitGroups.includes("goldrush-runtime"), "gold-field site must load the full runtime kit group");
assert(resultsSite?.kitGroups.includes("results-summary"), "results site must activate the results-summary kit group");
assert(resultsSite?.kitGroups.includes("replay-summary"), "results site must activate the replay-summary kit group");
assert(getGoldRushSceneKitGroups("run").includes("procedural-terrain"), "scene-site helper must expose run-specific terrain kits");
assert(getGoldRushSceneKitGroups("results").includes("results-summary"), "scene-site helper must expose results-specific summary kits");

const loader = createGoldRushSceneKitLoader();
await loader.activate("start");
let loaderSnapshot = loader.snapshot();
assert(validateGoldRushSceneKitLoaderSnapshot(loaderSnapshot).passed, "start scene kit activation should validate");
assertDeepEqual(loaderSnapshot.activeKitGroups, ["title-audio"], "start site should activate only title audio");
assertDeepEqual(loaderSnapshot.loadedModules, [], "start site should not import Three renderers");

await loader.activate("lobby");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("three-lobby-character"), "lobby site should activate the lobby character kit");
assert(loaderSnapshot.activeKitGroups.includes("frontier-condition-briefing"), "lobby site should activate condition briefing state");
assert(loaderSnapshot.loadedModules.includes("three-lobby-character"), "lobby site should dynamically import the lobby character renderer");

await loader.activate("loading");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("train-departure"), "loading site should activate train departure kit");
assert(loaderSnapshot.activeKitGroups.includes("frontier-condition-briefing"), "loading site should activate condition briefing state");
assert(loaderSnapshot.loadedModules.includes("loading-yard-terrain"), "loading site should dynamically import loading-yard renderer");

await loader.activate("run");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("goldrush-runtime"), "run site should activate runtime kit");
assert(loaderSnapshot.loadedModules.includes("procedural-terrain"), "run site should dynamically import the gold-field renderer");
assert(loaderSnapshot.activationReceipts.some((receipt) => receipt.deactivated.includes("train-departure")), "run activation should record loading kit deactivation");

await loader.activate("results");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("results-summary"), "results site should activate results summary state");
assert(loaderSnapshot.activeKitGroups.includes("replay-summary"), "results site should activate replay summary state");
assert(loaderSnapshot.activationReceipts.some((receipt) => receipt.siteId === "site.results"), "results site activation should create a receipt");

const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
const lobbyRendererSource = readFileSync(new URL("../../src/renderer/lobbyCharacterRenderer.js", import.meta.url), "utf8");
const loadingRendererSource = readFileSync(new URL("../../src/renderer/loadingTrainSceneRenderer.js", import.meta.url), "utf8");
const publicSmokeSource = readFileSync(new URL("../proof/public-deploy-smoke.mjs", import.meta.url), "utf8");

assert(appSource.includes('data-screen-panel="loading"'), "app must expose the loading-yard screen site");
assert(appSource.includes("startLoadingYard"), "leader start must route through the loading-yard scene");
assert(appSource.includes("firstSequence.startLoading"), "loading-yard scene must register the first-sequence loading phase");
assert(appSource.includes("firstSequence.consumeHandoffPayload"), "loading-yard scene must consume first-sequence handoff payloads");
assert(appSource.includes("if (handoffPayload) startMassMatch(handoffPayload)"), "loading-yard scene must hand off into the mass match");
assert(appSource.includes('audio.sync({ screen: "loading", scenario: runtime.snapshot(), loadingPhase, trainReadout })'), "loading-yard audio must consume first-sequence train readout cues");
assert(appSource.includes("data-frontier-condition-briefing"), "lobby must render a frontier condition briefing before train boarding");
assert(appSource.includes('data-screen-panel="results"'), "app must expose a results screen site");
assert(appSource.includes("completeRunToResults"), "app must hand off completed extractions into the results screen");
assert(appSource.includes("publicSmokeCompleteRunToResults"), "app must expose a query-gated proof path for extraction-to-results browser validation");
assert(appSource.includes('showScreen("results")'), "app must activate the results scene site after finalizing");
assert(appSource.includes("runtime.endMatch"), "results handoff must finalize through the match/result kits");
assert(appSource.includes("data-results-replay"), "results screen must render replay summary moments");
assert(appSource.includes("createFrontierConditionBriefing"), "app must derive condition briefing from runtime condition state");
assert(appSource.includes("frontierConditionBriefing"), "first sequence payloads must carry the condition briefing");
assert(appSource.includes("loadedKitGroups"), "app debug state must expose the active site kit groups");
assert(appSource.includes("createGoldRushSceneKitLoader"), "app must use the scene kit loader");
assert(appSource.includes("sceneKitLoader.activate"), "app must activate scene kits during screen transitions");
assert(!appSource.includes("../renderer/goldRushRenderer.js"), "app should not statically import the gold-field renderer");
assert(!appSource.includes("../renderer/lobbyCharacterRenderer.js"), "app should not statically import the lobby character renderer");
assert(!appSource.includes("../renderer/loadingTrainSceneRenderer.js"), "app should not statically import the loading-yard renderer");
assert(lobbyRendererSource.includes("pointermove"), "lobby character must support drag/spin pointer movement");
assert(lobbyRendererSource.includes("WebGLRenderer"), "lobby character must be rendered with Three.js");
assert(loadingRendererSource.includes("createTrain"), "loading-yard scene must include a train kit");
assert(loadingRendererSource.includes("createTrainPathKit"), "loading-yard train must follow a path kit");
assert(loadingRendererSource.includes("sampleCubicBezier"), "loading-yard train path must use Bezier sampling");
assert(loadingRendererSource.includes("animateTrainDoor"), "loading-yard train must animate a visible door");
assert(loadingRendererSource.includes("playerLockedToTrain"), "loading-yard scene must support locking the player to the train");
assert(loadingRendererSource.includes("createBoardingCue"), "loading-yard scene must create an in-world train boarding cue");
assert(loadingRendererSource.includes("goldrush-train-boarding-cue-v1"), "loading-yard boarding cue must expose a stable snapshot contract");
assert(loadingRendererSource.includes("trainReadout"), "loading-yard renderer must consume the first-sequence train readout");
assert(!loadingRendererSource.includes("train.position.x = departureProgress * 30"), "train must not depart with sideways linear drift");
assert(loadingRendererSource.includes("isNearTrainBoardingZone"), "loading-yard scene must expose a train boarding trigger");
assert(publicSmokeSource.includes("natural-walk-from-loading-yard-spawn"), "public smoke proof must record natural loading-yard walk boarding");
assert(publicSmokeSource.includes("public smoke must board the train through natural camera-relative walking"), "public smoke proof must fail when natural walk boarding does not reach run");
assert(!publicSmokeSource.includes("publicSmokePlaceAtTrainDoor"), "public smoke proof must not teleport to the train door as a fallback");

const audioSource = readFileSync(new URL("../../src/audio/goldRushAudioManager.js", import.meta.url), "utf8");
assert(audioSource.includes("goldrush-train-transition-audio-cues-v1"), "audio manager must expose the train transition cue-state contract");
assert(audioSource.includes("collectTrainTransitionCueShots"), "audio manager must collect train transition cue shots from the readout");
assert(audioSource.includes("lastTrainCueShots"), "audio manager snapshot must retain recent train transition cue shots");
assert(audioSource.includes('fallbackPattern: "train-arrival"'), "train arrival cue must have a distinct fallback pattern");
assert(audioSource.includes('fallbackPattern: "train-door"'), "train door cue must have a distinct fallback pattern");
assert(audioSource.includes('fallbackPattern: "train-board"'), "train boarding cue must have a distinct fallback pattern");
assert(audioSource.includes('fallbackPattern: "train-wait"'), "party wait cue must have a distinct fallback pattern");
assert(audioSource.includes('fallbackPattern: "train-depart"'), "train departure cue must have a distinct fallback pattern");

console.log(JSON.stringify({
  status: "scene-sites-ready",
  loader: loaderSnapshot,
  sites: goldRushSceneSites.map((site) => ({
    id: site.id,
    screen: site.screen,
    kitGroups: site.kitGroups,
    loadMode: site.loadMode,
  })),
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDeepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`${label}: expected ${expectedText}, received ${actualText}`);
  }
}
