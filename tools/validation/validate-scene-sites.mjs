import { readFileSync } from "node:fs";
import { createGoldRushSceneKitLoader, validateGoldRushSceneKitLoaderSnapshot } from "../../src/scenes/goldRushSceneKitLoader.js";
import { getGoldRushSceneKitGroups, goldRushSceneSites, validateGoldRushSceneSites } from "../../src/scenes/goldRushSceneSites.js";

const validation = validateGoldRushSceneSites(goldRushSceneSites);
assert(validation.passed, `scene site validation failed: ${validation.failures.join(", ")}`);

const lobbySite = goldRushSceneSites.find((site) => site.id === "site.lobby-character");
const loadingSite = goldRushSceneSites.find((site) => site.id === "site.loading-yard");
const fieldSite = goldRushSceneSites.find((site) => site.id === "site.gold-field");
assert(lobbySite?.kitGroups.includes("three-lobby-character"), "lobby site must load the Three.js character kit group");
assert(loadingSite?.kitGroups.includes("train-departure"), "loading-yard site must load the train departure kit group");
assert(fieldSite?.kitGroups.includes("goldrush-runtime"), "gold-field site must load the full runtime kit group");
assert(getGoldRushSceneKitGroups("run").includes("procedural-terrain"), "scene-site helper must expose run-specific terrain kits");

const loader = createGoldRushSceneKitLoader();
await loader.activate("start");
let loaderSnapshot = loader.snapshot();
assert(validateGoldRushSceneKitLoaderSnapshot(loaderSnapshot).passed, "start scene kit activation should validate");
assertDeepEqual(loaderSnapshot.activeKitGroups, ["title-audio"], "start site should activate only title audio");
assertDeepEqual(loaderSnapshot.loadedModules, [], "start site should not import Three renderers");

await loader.activate("lobby");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("three-lobby-character"), "lobby site should activate the lobby character kit");
assert(loaderSnapshot.loadedModules.includes("three-lobby-character"), "lobby site should dynamically import the lobby character renderer");

await loader.activate("loading");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("train-departure"), "loading site should activate train departure kit");
assert(loaderSnapshot.loadedModules.includes("loading-yard-terrain"), "loading site should dynamically import loading-yard renderer");

await loader.activate("run");
loaderSnapshot = loader.snapshot();
assert(loaderSnapshot.activeKitGroups.includes("goldrush-runtime"), "run site should activate runtime kit");
assert(loaderSnapshot.loadedModules.includes("procedural-terrain"), "run site should dynamically import the gold-field renderer");
assert(loaderSnapshot.activationReceipts.some((receipt) => receipt.deactivated.includes("train-departure")), "run activation should record loading kit deactivation");

const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
const lobbyRendererSource = readFileSync(new URL("../../src/renderer/lobbyCharacterRenderer.js", import.meta.url), "utf8");
const loadingRendererSource = readFileSync(new URL("../../src/renderer/loadingTrainSceneRenderer.js", import.meta.url), "utf8");

assert(appSource.includes('data-screen-panel="loading"'), "app must expose the loading-yard screen site");
assert(appSource.includes("startLoadingYard"), "leader start must route through the loading-yard scene");
assert(appSource.includes("startMassMatch(pendingMatchPayload"), "loading-yard scene must hand off into the mass match");
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
assert(!loadingRendererSource.includes("train.position.x = departureProgress * 30"), "train must not depart with sideways linear drift");
assert(loadingRendererSource.includes("isNearTrainBoardingZone"), "loading-yard scene must expose a train boarding trigger");

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
