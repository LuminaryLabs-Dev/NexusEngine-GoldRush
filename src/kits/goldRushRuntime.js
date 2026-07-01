import { createRealtimeGame } from "nexusrealtime";
import { assetRegistry } from "../content/assetRegistry.js";
import { createGoldRushDomainKits } from "./goldRushDomainKits.js";

export function createGoldRushRuntime({ orchestrator }) {
  const kits = createGoldRushDomainKits({ orchestrator, assetRegistry });
  const engine = createRealtimeGame({ kits });

  function generateMatch({ players, phase }) {
    engine.n.goldrushScenario.generateMatch({ players, phase });
    engine.n.goldrushProtoKitBridge.reset({ reason: "goldrush-runtime.generateMatch" });
    engine.n.goldrushExtractionLoop.startRun({
      runId: `goldrush-run-${engine.clock.frame + 1}`,
      playerId: "player-1",
    });
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
  }

  function setCameraMode(cameraMode) {
    engine.n.goldrushPerspective.set(cameraMode);
    engine.n.goldrushCamera.set(cameraMode);
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
    syncProtoKitMine({ amount: mined.yieldedGold, sourceId: node.id });
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
      syncProtoKitCashout({ amount: beforeCargo, sourceId: receipt.depositId });
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
    syncProtoKitPressure({ amount: 18, sourceId: `damage.${playerId}` });
    if (receipt.loss > 0) {
      engine.n.goldrushProtoKitBridge.deliverGold({
        amount: receipt.loss,
        commandId: `goldrush.live.cargo-loss.${playerId}.${engine.clock.frame}`,
      });
    }
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

  function tickExtractionLoop({ localPlayer = null, input = {}, dt = 0.1 } = {}) {
    const snapshot = engine.n.goldrushExtractionLoop.tick({ localPlayer, input, dt });
    syncExtractionLoopCombatPresentation({ snapshot, reason: "extraction-loop.tick" });
    engine.n.goldrushMatch.tick({ dt });
    engine.tick();
    return snapshot;
  }

  function holdExtractionLoopMine({ siteId = null, dt = 0.3 } = {}) {
    const receipt = engine.n.goldrushExtractionLoop.holdMine({ siteId, dt });
    if (receipt.accepted && receipt.complete) {
      syncProtoKitMine({ amount: receipt.payout, sourceId: receipt.siteId });
    }
    engine.n.goldrushMatch.tick({ dt });
    engine.tick();
    return receipt;
  }

  function holdExtractionLoopCashout({ dt = 0.3 } = {}) {
    const receipt = engine.n.goldrushExtractionLoop.holdExtraction({ dt });
    if (receipt.accepted && receipt.complete && receipt.receipt) {
      syncProtoKitCashout({
        amount: receipt.receipt.depositedGold,
        sourceId: receipt.receipt.receiptId,
      });
    }
    engine.n.goldrushMatch.tick({ dt });
    engine.tick();
    return receipt;
  }

  function fireExtractionLoop() {
    const receipt = engine.n.goldrushExtractionLoop.fire();
    if (receipt.hit) syncProtoKitPressure({ amount: -8, sourceId: receipt.threatId ?? "threat" });
    syncExtractionLoopCombatPresentation({
      snapshot: engine.n.goldrushExtractionLoop.getState(),
      reason: "extraction-loop.fire",
      forceCombat: true,
    });
    engine.n.goldrushMatch.tick({ dt: 0.1 });
    engine.tick();
    return receipt;
  }

  function transitionScene({ phase }) {
    const receipt = engine.n.goldrushScenario.advancePhase(phase);
    engine.n.goldrushMatch.tick({ dt: 1 });
    engine.tick();
    return receipt;
  }

  function setSceneForScreen({ screen }) {
    const legacyMode = engine.n.goldrushLegacyModes.snapshot().activeMode;
    const transition = screenTransition(screen, { legacyMode });
    if (!transition) return snapshot();
    engine.n.goldrushScenes.transition({
      ...transition,
      reason: `screen:${screen}`,
    });
    const transitionPhase = screen === "run" && legacyMode?.cameraMode === "combat"
      ? "combat"
      : phaseForScreen(screen);
    engine.n.goldrushCamera.resetForTransition({
      phase: transitionPhase,
      reason: `screen:${screen}`,
    });
    engine.n.goldrushMatch.tick({ dt: 0 });
    engine.tick();
    return snapshot();
  }

  function setLegacyMode({ modeId }) {
    const receipt = engine.n.goldrushLegacyModes.set({ modeId, reason: "runtime-control" });
    engine.n.goldrushCamera.set(receipt.cameraMode);
    engine.n.goldrushCamera.resetForTransition({
      phase: receipt.cameraMode === "combat" ? "combat" : "prospect",
      reason: `legacy-mode:${modeId}`,
    });
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

  function syncProtoKitMine({ amount = 0, sourceId = "unknown" } = {}) {
    if (amount <= 0) return;
    engine.n.goldrushProtoKitBridge.pickupGold({
      amount,
      commandId: `goldrush.live.mine.${sourceId}.${engine.clock.frame}`,
    });
    completeProtoKitCheckpointOnce("mine-seam", `goldrush.live.checkpoint.mine.${sourceId}.${engine.clock.frame}`);
  }

  function syncProtoKitCashout({ amount = 0, sourceId = "unknown" } = {}) {
    completeProtoKitCheckpointOnce("carry-gold", `goldrush.live.checkpoint.carry.${sourceId}.${engine.clock.frame}`);
    if (amount > 0) {
      engine.n.goldrushProtoKitBridge.deliverGold({
        amount,
        commandId: `goldrush.live.cashout.${sourceId}.${engine.clock.frame}`,
      });
    }
    completeProtoKitCheckpointOnce("cashout-site", `goldrush.live.checkpoint.cashout.${sourceId}.${engine.clock.frame}`);
  }

  function syncProtoKitPressure({ amount = 0, sourceId = "unknown" } = {}) {
    if (amount === 0) return;
    engine.n.goldrushProtoKitBridge.adjustPressure({
      amount,
      commandId: `goldrush.live.pressure.${sourceId}.${engine.clock.frame}`,
    });
  }

  function syncExtractionLoopCombatPresentation({ snapshot, reason = "extraction-loop", forceCombat = false } = {}) {
    const loop = snapshot ?? engine.n.goldrushExtractionLoop.getState();
    const legacyMode = engine.n.goldrushLegacyModes.snapshot().activeMode;
    const activeThreatCount = Number(loop?.combat?.activeThreatCount ?? 0);
    const combatPressure = Number(loop?.combat?.pressure ?? 0);
    const readableThreatActive = Object.values(loop?.combat?.readability?.threats ?? {})
      .some((threat) => threat.status === "active" || threat.telegraph?.readableBeforeDamage === true);
    const combatWanted = forceCombat
      || legacyMode.cameraMode === "combat"
      || loop?.player?.aimMode === true
      || loop?.phase === "combat"
      || activeThreatCount > 0
      || readableThreatActive;

    engine.n.goldrushPerspective.set(combatWanted ? "combat" : "exploration");
    engine.n.goldrushCamera.set(combatWanted ? "combat" : "exploration");
    engine.n.goldrushCamera.resetForTransition({
      phase: combatWanted ? "combat" : "prospect",
      reason,
    });
    if (combatWanted) {
      engine.n.goldrushScenes.phase("combat");
      return {
        mode: "combat",
        reason,
        activeThreatCount,
        combatPressure,
        readableThreatActive,
      };
    }
    if (engine.n.goldrushScenario.snapshot().phase !== "results") {
      engine.n.goldrushScenes.phase("prospect");
    }
    return {
      mode: "exploration",
      reason,
      activeThreatCount,
      combatPressure,
      readableThreatActive,
    };
  }

  function completeProtoKitCheckpointOnce(checkpointId, commandId) {
    const completedIds = engine.n.goldrushProtoKitBridge.snapshot().protoSnapshot?.route?.completedIds ?? [];
    if (completedIds.includes(checkpointId)) return;
    engine.n.goldrushProtoKitBridge.completeCheckpoint({ checkpointId, commandId });
  }

  return {
    engine,
    generateMatch,
    setCameraMode,
    mineGold,
    cashOut,
    takeDamage,
    tickExtractionLoop,
    holdExtractionLoopMine,
    holdExtractionLoopCashout,
    fireExtractionLoop,
    transitionScene,
    setSceneForScreen,
    setLegacyMode,
    startFinalRush,
    advanceCollapse,
    requestHandoff,
    endMatch,
    syncExtractionLoopCombatPresentation,
    snapshot,
  };
}

function screenTransition(screen, { legacyMode = null } = {}) {
  if (screen === "start") {
    return {
      toSceneId: "goldrush.scene.mainMenu",
      transitionId: "goldrush.transition.bootToMainMenu",
    };
  }
  if (screen === "lobby") {
    return {
      toSceneId: "goldrush.scene.lobby",
      transitionId: "goldrush.transition.mainMenuToLobby",
    };
  }
  if (screen === "loading") {
    return {
      toSceneId: "goldrush.scene.loading",
      transitionId: "goldrush.transition.roomHandoffStart",
    };
  }
  if (screen === "run") {
    if (legacyMode?.sceneId && legacyMode.sceneId !== "goldrush.scene.arena") {
      return {
        toSceneId: legacyMode.sceneId,
        transitionId: legacyMode.modeId === "classicCombat"
          ? "goldrush.transition.explorationToCombat"
          : "goldrush.transition.direct",
      };
    }
    return {
      toSceneId: "goldrush.scene.arena",
      transitionId: "goldrush.transition.lobbyToArena",
    };
  }
  if (screen === "results") {
    return {
      toSceneId: "goldrush.scene.results",
      transitionId: "goldrush.transition.cashoutComplete",
    };
  }
  return null;
}

function phaseForScreen(screen) {
  if (screen === "results") return "results";
  if (screen === "run") return "prospect";
  if (screen === "loading") return "loading";
  if (screen === "lobby") return "lobby";
  return "title";
}
