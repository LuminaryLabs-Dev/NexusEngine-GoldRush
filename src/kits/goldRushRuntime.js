import { createRealtimeGame } from "nexusrealtime";
import { assetRegistry } from "../content/assetRegistry.js";
import { createGoldRushDomainKits } from "./goldRushDomainKits.js";

export function createGoldRushRuntime({ orchestrator }) {
  const kits = createGoldRushDomainKits({ orchestrator, assetRegistry });
  const engine = createRealtimeGame({ kits });

  function generateMatch({ players, phase }) {
    engine.n.goldrushScenario.generateMatch({ players, phase });
    engine.tick();
  }

  function setCameraMode(cameraMode) {
    engine.n.goldrushPerspective.set(cameraMode);
    engine.tick();
  }

  function snapshot() {
    return engine.n.goldrushScenario.snapshot();
  }

  return {
    engine,
    generateMatch,
    setCameraMode,
    snapshot,
  };
}
