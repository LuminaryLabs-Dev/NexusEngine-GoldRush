import { defineDomainServiceKit } from "nexusrealtime";
import {
  createExtractionLoopScenario,
  validateExtractionLoopScenario,
} from "../content/goldrushGameplayLoop.js";

const version = "0.1.0";
const stability = "prototype";

export function createGoldRushExtractionLoopKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-extraction-loop-kit",
    domain: "goldrush-extraction-loop",
    apiName: "goldrushExtractionLoop",
    stability,
    version,
    requires: [
      "n:goldrush-cargo",
      "n:goldrush-cashout",
      "n:goldrush-extraction-receipts",
      "n:goldrush-scoring",
      "n:goldrush-replay-summary",
    ],
    services: [
      "start-run",
      "set-player-pose",
      "set-aim",
      "hold-mine",
      "fire",
      "take-damage",
      "hold-extraction",
      "complete-extraction",
      "get-state",
      "get-receipt",
      "validate",
    ],
    metadata: {
      purpose: "Own the local playable mining, combat pressure, cargo, and extraction receipt loop.",
    },
    createApi({ engine }) {
      let state = createInitialState();

      function reset({ runId = "goldrush-run-001", playerId = "player-1", position = null, heading = 0 } = {}) {
        const scenario = createExtractionLoopScenario();
        state = createInitialState({ scenario, runId, playerId, position: position ?? scenario.spawn, heading });
        pushEvent({ type: "run-started", payload: { runId, playerId } });
        return snapshot();
      }

      function snapshot() {
        const cargoValue = engine.n.goldrushCargo.snapshot()[state.player.id] ?? state.player.cargo.goldDust;
        const nextState = {
          ...state,
          player: {
            ...state.player,
            cargo: createCargoState(cargoValue),
          },
          worldSpaceMarkers: createWorldSpaceMarkers(state, cargoValue),
        };
        return structuredClone(nextState);
      }

      function pushEvent({ type, payload = {} }) {
        state.events.push({
          id: `${type}.${state.tick}.${state.events.length + 1}`,
          type,
          tick: state.tick,
          payload,
        });
        state.events = state.events.slice(-state.scenario.receiptRules.maxRecentEvents);
      }

      function updateRanges() {
        const player = state.player.position;
        state.mining.sites = Object.fromEntries(Object.entries(state.mining.sites).map(([siteId, site]) => [
          siteId,
          {
            ...site,
            distance: distance2D(player, site.worldPosition),
            inRange: distance2D(player, site.worldPosition) <= site.radius,
          },
        ]));
        state.extraction.sites = Object.fromEntries(Object.entries(state.extraction.sites).map(([siteId, site]) => [
          siteId,
          {
            ...site,
            distance: distance2D(player, site.worldPosition),
            inRange: distance2D(player, site.worldPosition) <= site.radius,
          },
        ]));
        state.combat.threats = Object.fromEntries(Object.entries(state.combat.threats).map(([threatId, threat]) => [
          threatId,
          {
            ...threat,
            distance: distance2D(player, threat.worldPosition),
            active: threat.defeated ? false : threat.active,
          },
        ]));
        if (state.mining.activeSiteId && !state.mining.sites[state.mining.activeSiteId]?.inRange) {
          state.mining.progress = 0;
          state.mining.activeSiteId = null;
          pushEvent({ type: "mining-cancelled", payload: { reason: "left-range" } });
        }
        if (state.extraction.activeSiteId && !state.extraction.sites[state.extraction.activeSiteId]?.inRange) {
          state.extraction.progress = Math.max(0, state.extraction.progress - state.scenario.cashoutRules.progressDecayPerSecond);
          state.extraction.activeSiteId = null;
          state.extraction.inVolume = false;
          state.extraction.interruptedReason = "left-volume";
          if (state.phase === "extracting") state.phase = "exploring";
          pushEvent({ type: "extraction-cancelled", payload: { reason: "left-volume" } });
        }
      }

      function nearestMiningSite(siteId = null) {
        const sites = Object.values(state.mining.sites).filter((site) => !site.depleted);
        if (siteId) return sites.find((site) => site.id === siteId) ?? null;
        return sites.sort((a, b) => a.distance - b.distance)[0] ?? null;
      }

      function nearestExtractionSite(siteId = null) {
        const sites = Object.values(state.extraction.sites);
        if (siteId) return sites.find((site) => site.id === siteId) ?? null;
        return sites.sort((a, b) => a.distance - b.distance)[0] ?? null;
      }

      function activateThreats() {
        const cargo = engine.n.goldrushCargo.snapshot()[state.player.id] ?? 0;
        state.combat.threats = Object.fromEntries(Object.entries(state.combat.threats).map(([threatId, threat]) => {
          const shouldActivate = cargo >= threat.activationCargo && threat.distance <= threat.radius && !threat.defeated;
          return [threatId, { ...threat, active: threat.active || shouldActivate }];
        }));
        const activeThreats = Object.values(state.combat.threats).filter((threat) => threat.active && !threat.defeated);
        state.combat.activeThreatCount = activeThreats.length;
        state.combat.pressure = Number(activeThreats.reduce((sum, threat) => sum + threat.pressure, 0).toFixed(2));
        if (activeThreats.length > 0 && state.phase !== "extracted" && state.phase !== "failed") state.phase = state.player.aimMode ? "combat" : state.phase;
      }

      function holdMine({ siteId = null, dt = 0.2 } = {}) {
        if (state.phase === "extracted" || state.phase === "failed") return reject("run-closed");
        updateRanges();
        const site = nearestMiningSite(siteId);
        if (!site) return reject("no-mining-site");
        if (!site.inRange) {
          state.mining.activeSiteId = null;
          state.mining.progress = 0;
          return reject("mining-out-of-range", { siteId: site.id, distance: site.distance });
        }
        if (site.depleted || site.remaining <= 0) return reject("site-depleted", { siteId: site.id });
        if (state.interruptUntilTick > state.tick) return reject("interrupted", { untilTick: state.interruptUntilTick });
        state.phase = "mining";
        state.mining.activeSiteId = site.id;
        state.mining.progress = Number(Math.min(site.holdSeconds, state.mining.progress + Math.max(0, dt)).toFixed(3));
        if (state.mining.progress < site.holdSeconds) {
          return { accepted: true, complete: false, progress: state.mining.progress, required: site.holdSeconds };
        }
        const payout = Math.min(site.payout, site.remaining);
        const nextSite = {
          ...site,
          remaining: Math.max(0, site.remaining - payout),
          depleted: site.remaining - payout <= 0,
        };
        state.mining.sites[site.id] = nextSite;
        state.mining.progress = 0;
        state.mining.sitesTouched = Array.from(new Set([...state.mining.sitesTouched, site.id]));
        const cargo = engine.n.goldrushCargo.add({ playerId: state.player.id, amount: payout });
        state.player.cargo = createCargoState(cargo.carriedGold);
        state.phase = "exploring";
        pushEvent({ type: "gold-mined", payload: { siteId: site.id, payout, carriedGold: cargo.carriedGold } });
        engine.n.goldrushReplaySummary.appendEvent({
          type: "extractionLoopGoldMined",
          tick: engine.clock?.frame ?? state.tick,
          payload: { siteId: site.id, payout, carriedGold: cargo.carriedGold },
        });
        return { accepted: true, complete: true, siteId: site.id, payout, cargo: cargo.carriedGold, depleted: nextSite.depleted };
      }

      function holdExtraction({ siteId = null, dt = 0.2 } = {}) {
        if (state.phase === "failed") return reject("player-failed");
        if (state.receipt) return { accepted: true, complete: true, receipt: structuredClone(state.receipt), idempotent: true };
        updateRanges();
        const site = nearestExtractionSite(siteId);
        if (!site) return reject("no-extraction-site");
        if (!site.inRange) {
          state.extraction.activeSiteId = null;
          state.extraction.inVolume = false;
          state.extraction.interruptedReason = "outside-volume";
          return reject("extraction-out-of-range", { siteId: site.id, distance: site.distance });
        }
        if (state.interruptUntilTick > state.tick) {
          state.extraction.interruptedReason = "damage";
          return reject("interrupted", { untilTick: state.interruptUntilTick });
        }
        state.phase = "extracting";
        state.extraction.activeSiteId = site.id;
        state.extraction.inVolume = true;
        state.extraction.requiredSeconds = site.requiredSeconds;
        state.extraction.interruptedReason = null;
        state.extraction.progress = Number(Math.min(site.requiredSeconds, state.extraction.progress + Math.max(0, dt)).toFixed(3));
        if (state.extraction.progress < site.requiredSeconds) {
          return { accepted: true, complete: false, progress: state.extraction.progress, required: site.requiredSeconds };
        }
        return completeExtraction({ siteId: site.id });
      }

      function completeExtraction({ siteId = null } = {}) {
        if (state.receipt) return { accepted: true, receipt: structuredClone(state.receipt), idempotent: true };
        const site = nearestExtractionSite(siteId);
        if (!site?.inRange) return reject("extraction-not-in-volume", { siteId: site?.id ?? siteId });
        const beforeCargo = engine.n.goldrushCargo.snapshot()[state.player.id] ?? 0;
        const deposit = engine.n.goldrushCashout.deposit({
          playerId: state.player.id,
          depositId: `${state.scenario.receiptRules.receiptPrefix}.${state.runId}`,
        });
        const cargoValue = beforeCargo * state.scenario.cashoutRules.cargoValueMultiplier;
        const receiptId = `${state.scenario.receiptRules.receiptPrefix}.${state.runId}.receipt`;
        const extractionReceipt = engine.n.goldrushExtractionReceipts.recordExtraction({
          receiptId,
          playerId: state.player.id,
          teamId: "team-01",
          goldAmount: deposit.depositedGold,
          cargoValue,
          cashoutId: `cashout.${site.id}`,
          goldZoneId: state.mining.sitesTouched[0] ?? null,
          roomWindowId: "window.partition-1",
          tick: engine.clock?.frame ?? state.tick,
        });
        if (extractionReceipt.status === "accepted") engine.n.goldrushScoring.applyExtractionReceipt(extractionReceipt.receiptId);
        state.receipt = {
          runId: state.runId,
          receiptId,
          extracted: true,
          cargoValue,
          depositedGold: deposit.depositedGold,
          threatsDefeated: state.combat.threatsDefeated,
          miningSitesTouched: state.mining.sitesTouched,
          durationTicks: state.tick,
          nextSceneId: site.nextSceneId,
          roomHandoffId: site.roomHandoffId,
          extractionReceiptStatus: extractionReceipt.status,
        };
        state.phase = "extracted";
        state.extraction.progress = site.requiredSeconds;
        state.player.cargo = createCargoState(0);
        pushEvent({ type: "extracted", payload: state.receipt });
        engine.n.goldrushReplaySummary.appendEvent({
          type: "extractionLoopComplete",
          tick: engine.clock?.frame ?? state.tick,
          payload: state.receipt,
        });
        return { accepted: true, complete: true, receipt: structuredClone(state.receipt) };
      }

      function reject(reason, extra = {}) {
        const receipt = { accepted: false, reason, ...extra };
        state.lastRejection = receipt;
        return receipt;
      }

      reset();

      return {
        startRun: reset,
        setPlayerPose({ position, heading = state.player.heading, look = state.player.look } = {}) {
          if (position) state.player.position = { ...state.player.position, ...position };
          state.player.heading = heading;
          state.player.look = structuredClone(look ?? state.player.look);
          updateRanges();
          activateThreats();
          return snapshot();
        },
        setAim({ active = false } = {}) {
          state.player.aimMode = Boolean(active);
          if (state.player.aimMode && state.phase !== "extracted" && state.phase !== "failed") state.phase = "combat";
          if (!state.player.aimMode && state.phase === "combat" && state.combat.activeThreatCount === 0) state.phase = "exploring";
          return snapshot();
        },
        fire({ threatId = null } = {}) {
          state.player.aimMode = true;
          const activeThreats = Object.values(state.combat.threats).filter((threat) => threat.active && !threat.defeated);
          const target = threatId
            ? activeThreats.find((threat) => threat.id === threatId)
            : activeThreats.sort((a, b) => a.distance - b.distance)[0];
          if (!target) {
            pushEvent({ type: "shot-missed", payload: { reason: "no-target" } });
            state.combat.recentEvents.push({ type: "miss", tick: state.tick });
            return { accepted: true, hit: false, reason: "no-target" };
          }
          const nextHealth = Math.max(0, target.health - 1);
          state.combat.threats[target.id] = {
            ...target,
            health: nextHealth,
            defeated: nextHealth <= 0,
            active: nextHealth > 0,
          };
          if (nextHealth <= 0) state.combat.threatsDefeated += 1;
          state.combat.lastHitId = target.id;
          state.combat.recentEvents.push({ type: nextHealth <= 0 ? "threat-defeated" : "hit", threatId: target.id, tick: state.tick });
          state.combat.recentEvents = state.combat.recentEvents.slice(-12);
          activateThreats();
          pushEvent({ type: "shot-hit", payload: { threatId: target.id, defeated: nextHealth <= 0 } });
          return { accepted: true, hit: true, threatId: target.id, defeated: nextHealth <= 0 };
        },
        takeDamage({ amount = 18, reason = "local-threat" } = {}) {
          state.player.health = Math.max(0, state.player.health - Math.max(0, amount));
          state.interruptUntilTick = state.tick + Math.ceil(state.scenario.cashoutRules.damageInterruptSeconds * 10);
          state.mining.progress = 0;
          state.extraction.interruptedReason = "damage";
          if (state.player.health <= 0) state.phase = "failed";
          pushEvent({ type: "damage", payload: { amount, reason, health: state.player.health } });
          return { accepted: true, health: state.player.health, failed: state.phase === "failed" };
        },
        holdMine,
        enterExtraction({ siteId = null } = {}) {
          updateRanges();
          const site = nearestExtractionSite(siteId);
          if (!site?.inRange) return reject("extraction-out-of-range", { siteId: site?.id ?? siteId });
          state.extraction.activeSiteId = site.id;
          state.extraction.inVolume = true;
          return snapshot();
        },
        cancelExtraction({ reason = "manual" } = {}) {
          state.extraction.activeSiteId = null;
          state.extraction.inVolume = false;
          state.extraction.interruptedReason = reason;
          if (state.phase === "extracting") state.phase = "exploring";
          pushEvent({ type: "extraction-cancelled", payload: { reason } });
          return snapshot();
        },
        holdExtraction,
        completeExtraction,
        tick({ localPlayer = null, input = {}, dt = 0.1 } = {}) {
          state.tick += 1;
          if (localPlayer?.position) {
            this.setPlayerPose({
              position: localPlayer.position,
              heading: localPlayer.heading,
              look: localPlayer.look,
            });
          }
          this.setAim({ active: Boolean(input.aim) });
          if (input.fire) this.fire({});
          if (input.interact && state.phase !== "extracted" && state.phase !== "failed") {
            const extraction = nearestExtractionSite();
            const cargo = engine.n.goldrushCargo.snapshot()[state.player.id] ?? 0;
            if (extraction?.inRange && (cargo > 0 || state.scenario.cashoutRules.zeroCargoAllowed)) {
              holdExtraction({ siteId: extraction.id, dt });
            } else {
              holdMine({ siteId: nearestMiningSite()?.id, dt });
            }
          } else if (state.phase === "mining" || state.phase === "extracting") {
            state.mining.progress = 0;
            if (state.phase === "extracting") {
              state.extraction.progress = Math.max(0, state.extraction.progress - state.scenario.cashoutRules.progressDecayPerSecond * dt);
            }
            if (state.phase !== "extracted") state.phase = state.combat.activeThreatCount > 0 && state.player.aimMode ? "combat" : "exploring";
          }
          activateThreats();
          return snapshot();
        },
        getState: snapshot,
        snapshot,
        getReceipt() {
          return structuredClone(state.receipt);
        },
        validate() {
          const failures = [...validateExtractionLoopScenario(state.scenario).failures];
          const snap = snapshot();
          if (!snap.runId) failures.push("missing-run-id");
          if (!snap.player?.id) failures.push("missing-player");
          if (Object.keys(snap.mining.sites).length < 1) failures.push("missing-mining-sites");
          if (Object.keys(snap.extraction.sites).length < 1) failures.push("missing-extraction-sites");
          if (Object.keys(snap.combat.threats).length < 1) failures.push("missing-threats");
          if (!Array.isArray(snap.worldSpaceMarkers) || snap.worldSpaceMarkers.length < 3) failures.push("missing-world-space-markers");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createInitialState({
  scenario = createExtractionLoopScenario(),
  runId = "goldrush-run-001",
  playerId = "player-1",
  position = scenario.spawn,
  heading = 0,
} = {}) {
  return {
    version,
    runId,
    phase: "exploring",
    tick: 0,
    scenario,
    player: {
      id: playerId,
      position: structuredClone(position),
      heading,
      look: { yaw: heading, pitch: -0.04 },
      aimMode: false,
      health: 100,
      cargo: createCargoState(0),
    },
    mining: {
      activeSiteId: null,
      progress: 0,
      sitesTouched: [],
      sites: Object.fromEntries(scenario.miningSites.map((site) => [
        site.id,
        { ...structuredClone(site), depleted: false, distance: null, inRange: false },
      ])),
    },
    combat: {
      pressure: 0,
      activeThreatCount: 0,
      lastHitId: null,
      threatsDefeated: 0,
      recentEvents: [],
      threats: Object.fromEntries(scenario.localThreatSpawns.map((threat) => [
        threat.id,
        { ...structuredClone(threat), active: false, defeated: false, distance: null },
      ])),
    },
    extraction: {
      activeSiteId: null,
      inVolume: false,
      progress: 0,
      requiredSeconds: scenario.extractionSites[0]?.requiredSeconds ?? 3,
      interruptedReason: null,
      sites: Object.fromEntries(scenario.extractionSites.map((site) => [
        site.id,
        { ...structuredClone(site), distance: null, inRange: false },
      ])),
    },
    receipt: null,
    events: [],
    lastRejection: null,
    interruptUntilTick: 0,
  };
}

function createCargoState(goldDust = 0) {
  return {
    goldDust,
    nuggets: Math.floor(goldDust / 25),
    totalValue: goldDust * 10,
  };
}

function createWorldSpaceMarkers(state, cargoValue = 0) {
  const mining = Object.values(state.mining.sites).map((site) => ({
    id: `marker.${site.id}`,
    type: "mining-site",
    label: site.prompt,
    worldPosition: site.worldPosition,
    radius: site.radius,
    active: state.mining.activeSiteId === site.id,
    inRange: site.inRange,
    progress: state.mining.activeSiteId === site.id ? state.mining.progress / site.holdSeconds : 0,
    status: site.depleted ? "depleted" : site.inRange ? "ready" : "distant",
  }));
  const extraction = Object.values(state.extraction.sites).map((site) => ({
    id: `marker.${site.id}`,
    type: "extraction-site",
    label: site.prompt,
    worldPosition: site.worldPosition,
    radius: site.radius,
    active: state.extraction.activeSiteId === site.id,
    inRange: site.inRange,
    progress: state.extraction.activeSiteId === site.id ? state.extraction.progress / site.requiredSeconds : 0,
    status: state.receipt ? "complete" : cargoValue > 0 || state.scenario.cashoutRules.zeroCargoAllowed ? "ready" : "needs-gold",
  }));
  const threats = Object.values(state.combat.threats).map((threat) => ({
    id: `marker.${threat.id}`,
    type: "threat",
    label: threat.label,
    worldPosition: threat.worldPosition,
    radius: threat.radius,
    active: threat.active,
    inRange: threat.distance <= threat.radius,
    progress: threat.defeated ? 1 : 1 - threat.health / Math.max(1, state.scenario.localThreatSpawns.find((entry) => entry.id === threat.id)?.health ?? threat.health),
    status: threat.defeated ? "defeated" : threat.active ? "active" : "latent",
  }));
  return [...mining, ...extraction, ...threats];
}

function distance2D(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  return Number(Math.hypot((a.x ?? 0) - (b.x ?? 0), (a.z ?? 0) - (b.z ?? 0)).toFixed(3));
}
