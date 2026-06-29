import { createRealtimeGame } from "nexusrealtime";
import { assetRegistry } from "../content/assetRegistry.js";
import { createGoldRushDomainKits } from "./goldRushDomainKits.js";

export function createGoldRushRuntime({ orchestrator }) {
  const kits = createGoldRushDomainKits({ orchestrator, assetRegistry });
  const engine = createRealtimeGame({ kits });

  function generateMatch({ players, phase }) {
    engine.n.goldrushScenario.generateMatch({ players, phase });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
  }

  function setCameraMode(cameraMode) {
    engine.n.goldrushPerspective.set(cameraMode);
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
  }

  function mineGold({ playerId = "player-1" } = {}) {
    const node = engine.n.goldrushMining.snapshot().find((entry) => !entry.depleted);
    if (!node) {
      return { accepted: false, reason: "no-gold-nodes" };
    }
    const mined = engine.n.goldrushMining.mine({ nodeId: node.id, amount: 35 });
    const cargo = engine.n.goldrushCargo.add({ playerId, amount: mined.yieldedGold });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.n.goldrushReplaySummary.appendEvent({
      type: "goldMined",
      tick: engine.clock.frame,
      payload: { playerId, nodeId: node.id, yieldedGold: mined.yieldedGold, carriedGold: cargo.carriedGold },
    });
    engine.tick();
    return { accepted: true, nodeId: node.id, ...mined, ...cargo };
  }

  function cashOut({ playerId = "player-1" } = {}) {
    const beforeCargo = engine.n.goldrushCargo.snapshot()[playerId] ?? 0;
    const receipt = engine.n.goldrushCashout.deposit({
      playerId,
      depositId: `deposit-${engine.clock.frame + 1}`,
    });
    if (receipt.accepted) {
      engine.n.goldrushScenario.simulateExtraction({
        playerId,
        goldAmount: receipt.depositedGold,
        cargoValue: beforeCargo,
        receiptId: `extract.${playerId}.${engine.clock.frame + 1}`,
      });
    }
    engine.n.goldrushScenario.advancePhase("extract");
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return receipt;
  }

  function takeDamage({ playerId = "player-1" } = {}) {
    engine.n.goldrushPerspective.set("combat");
    engine.n.goldrushScenes.phase("combat");
    engine.n.goldrushMatch.advancePhase({ phase: "combat", reason: "runtime.ambush" });
    const receipt = engine.n.goldrushCombat.damage({ playerId, percent: 0.3 });
    engine.n.goldrushScoring.applyCombatResult({
      combatReceiptId: `combat.damage.${playerId}.${engine.clock.frame + 1}`,
      playerId,
      value: Math.max(0, receipt.loss),
    });
    engine.n.goldrushReplaySummary.appendEvent({
      type: "combatDamage",
      tick: engine.clock.frame,
      payload: receipt,
    });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return receipt;
  }

  function transitionScene({ phase }) {
    const receipt = engine.n.goldrushScenario.advancePhase(phase);
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return receipt;
  }

  function setLegacyMode({ modeId }) {
    const receipt = engine.n.goldrushLegacyModes.set({ modeId, reason: "runtime-control" });
    engine.n.goldrushReplaySummary.appendEvent({
      type: "legacyModeChanged",
      tick: engine.clock.frame,
      payload: { modeId },
    });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return receipt;
  }

  function startFinalRush() {
    const snapshot = engine.n.goldrushScenario.triggerFinalRush();
    engine.n.goldrushFinalRush.tick({ dt: 35, phase: "finalRush" });
    engine.n.goldrushMatch.tick({ dt: 35 });
    engine.tick();
    return snapshot;
  }

  function advanceCollapse() {
    engine.n.goldrushScenario.advancePhase("collapse");
    const snapshot = engine.n.goldrushFinalRush.tick({ dt: 30, phase: "collapse" });
    engine.n.goldrushMatch.tick({ dt: 30 });
    engine.tick();
    return snapshot;
  }

  function requestHandoff({ playerIds = ["player-1"] } = {}) {
    const receipt = engine.n.goldrushScenario.requestHandoff({ playerIds });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return receipt;
  }

  function endMatch({ reason = "manual" } = {}) {
    const snapshot = engine.n.goldrushScenario.endMatch({ reason });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return snapshot;
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
    setLegacyMode,
    startFinalRush,
    advanceCollapse,
    requestHandoff,
    endMatch,
    snapshot,
  };
}
