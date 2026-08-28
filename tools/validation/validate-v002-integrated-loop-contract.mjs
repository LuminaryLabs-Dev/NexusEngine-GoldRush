import { createV002GoldRushState } from "../../src/kits/v0.0.2/state.js";
import {
  createV002ProofGroupSnapshots,
  validateV002Registry,
  v002KitRegistry,
} from "../../src/kits/v0.0.2/registry.js";

const validation = validateV002Registry();
assert(validation.passed, `v0.0.2 registry invalid: ${validation.failures.join(", ")}`);

const state = createV002GoldRushState({
  screen: "run",
  scenario: {
    terrainState: {
      authoredSource: {
        revisionId: "rev-8cca010a",
      },
    },
  },
  sceneKitLoader: {
    activeSite: "site.gold-field",
  },
});

const requiredLoop = ["title", "lobby", "train-loading", "gold-field", "move", "mine", "carry", "combat-pressure", "cashout", "score", "results"];
assertDeepEqual(state.snapshots.integratedLoop, requiredLoop, "v0.0.2 integrated loop changed");
assert(state.version === "v0.0.2", "state must expose v0.0.2");
assert(state.validation.passed, "state must carry passing registry validation");
assert(state.kits.length === v002KitRegistry.length, "state must expose all v0.0.2 kits");
assert(state.proofGroups.length === createV002ProofGroupSnapshots().length, "state must expose grouped proof snapshots");

const terrainSource = state.snapshots.terrainSource.source;
const terrainRenderer = state.snapshots.terrainRenderer.source;
const terrainCollider = state.snapshots.terrainCollider.source;
const desertMap = state.snapshots.desertMap;
assert(terrainSource.validation.passed, "terrain source fixture must validate before v0.0.2 consumers install");
assert(terrainRenderer.revisionId === terrainSource.revisionId, "terrain renderer must consume the terrain source revision");
assert(terrainCollider.revisionId === terrainSource.revisionId, "terrain collider must consume the terrain source revision");
assert(desertMap.source.revisionId === terrainSource.revisionId, "desert map must consume the terrain source revision");
assert(desertMap.layout.playableBounds.width === 180 && desertMap.layout.playableBounds.depth === 110, "desert map must expose the normal-area greybox bounds");
assert(desertMap.layout.routes.length === 2, "desert map must expose the main route and mine spur");
assert(desertMap.layout.landmarks.map((landmark) => landmark.role).sort().join(",") === "cashout-depot,gold-seam,mine-entrance", "desert map must expose the three greybox landmarks");

const requiredGoldRushKits = [
  "n:goldrush:prospector",
  "n:goldrush:desert-map",
  "n:goldrush:train-asset-set",
  "n:goldrush:train-route",
  "n:goldrush:train-boarding",
  "n:goldrush:train-boarding-cue",
  "n:goldrush:train-ride-attach",
  "n:goldrush:train-departure-handoff",
  "n:goldrush:mine-carry-cashout",
  "n:goldrush:ambush-pressure",
  "n:goldrush:match-orchestration",
];
for (const domainPath of requiredGoldRushKits) {
  const kit = v002KitRegistry.find((entry) => entry.domainPath === domainPath);
  assert(kit, `missing GoldRush composition kit: ${domainPath}`);
  assert(kit.promotionStatus === "game-specific-v002", `GoldRush kit must stay game-specific: ${domainPath}`);
  assert(kit.dependencies.length > 0, `GoldRush kit must compose generic kits: ${domainPath}`);
}

const mineCarryCashout = v002KitRegistry.find((entry) => entry.domainPath === "n:goldrush:mine-carry-cashout");
assert(mineCarryCashout.dependencies.includes("n:gameplay:mining"), "GoldRush mine-carry-cashout must compose mining");
assert(mineCarryCashout.dependencies.includes("n:gameplay:cargo"), "GoldRush mine-carry-cashout must compose cargo");
assert(mineCarryCashout.dependencies.includes("n:gameplay:extraction"), "GoldRush mine-carry-cashout must compose extraction");

console.log(JSON.stringify({
  status: "v002-integrated-loop-contract-ready",
  version: state.version,
  loopSteps: state.snapshots.integratedLoop.length,
  kits: state.kits.length,
  proofGroups: state.proofGroups.length,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDeepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) throw new Error(`${label}: expected ${expectedText}, received ${actualText}`);
}
