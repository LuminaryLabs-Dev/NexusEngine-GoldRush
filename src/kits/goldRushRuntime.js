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

  function mineGold({ playerId = "player-1" } = {}) {
    const node = engine.n.goldrushMining.snapshot().find((entry) => !entry.depleted);
    if (!node) {
      return { accepted: false, reason: "no-gold-nodes" };
    }
    const mined = engine.n.goldrushMining.mine({ nodeId: node.id, amount: 35 });
    const cargo = engine.n.goldrushCargo.add({ playerId, amount: mined.yieldedGold });
    engine.tick();
    return { accepted: true, nodeId: node.id, ...mined, ...cargo };
  }

  function cashOut({ playerId = "player-1" } = {}) {
    const receipt = engine.n.goldrushCashout.deposit({
      playerId,
      depositId: `deposit-${engine.clock.frame + 1}`,
    });
    engine.n.goldrushScenario.advancePhase("extract");
    engine.tick();
    return receipt;
  }

  function takeDamage({ playerId = "player-1" } = {}) {
    engine.n.goldrushPerspective.set("combat");
    engine.n.goldrushScenes.phase("combat");
    const receipt = engine.n.goldrushCombat.damage({ playerId, percent: 0.3 });
    engine.tick();
    return receipt;
  }

  function transitionScene({ phase }) {
    const receipt = engine.n.goldrushScenario.advancePhase(phase);
    engine.tick();
    return receipt;
  }

  function snapshot() {
    return engine.n.goldrushScenario.snapshot();
  }

  return {
    engine,
    generateMatch,
    setCameraMode,
    mineGold,
    cashOut,
    takeDamage,
    transitionScene,
    snapshot,
  };
}
