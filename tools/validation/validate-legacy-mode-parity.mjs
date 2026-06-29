import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 72, phase: "prospect" });

const modes = [
  { modeId: "modernExtraction", sceneId: "goldrush.scene.arena", cameraMode: "exploration" },
  { modeId: "classicCombat", sceneId: "goldrush.scene.legacyGame", cameraMode: "combat" },
  { modeId: "classicSolo", sceneId: "goldrush.scene.legacySinglePlayer", cameraMode: "exploration" },
];

for (const mode of modes) {
  runtime.setLegacyMode({ modeId: mode.modeId });
  const state = runtime.snapshot();
  assert(state.legacyMode.activeMode.modeId === mode.modeId, `${mode.modeId} should become active`);
  assert(state.sceneState.currentSceneId === mode.sceneId, `${mode.modeId} should target ${mode.sceneId}`);
  assert(state.cameraMode === mode.cameraMode, `${mode.modeId} should use ${mode.cameraMode} perspective`);
  assert(
    state.legacyMode.activeMode.requiredRuntimeApis.every((apiName) => runtime.engine.n[apiName]),
    `${mode.modeId} should reference installed runtime APIs`
  );
}

const validation = runtime.engine.n.goldrushLegacyModes.validate();
assert(validation.passed, `legacy modes should validate: ${validation.failures.join(", ")}`);

const final = runtime.snapshot();
assert(final.legacyMode.modes.length === 3, "unified runtime should expose modern, classic combat, and classic solo modes");
assert(final.legacyMode.unifiedRuntime.oneGame === true, "legacy modes should stay in one runtime");

console.log("legacy mode parity passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
