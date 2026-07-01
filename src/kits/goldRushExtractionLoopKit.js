import { defineDomainServiceKit } from "nexusrealtime";
import {
  createExtractionLoopScenario,
  validateExtractionLoopScenario,
} from "../content/goldrushGameplayLoop.js";
import { createGoldRushFrontierConditionEffects } from "../content/goldrushFrontierConditions.js";

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
      "n:goldrush-frontier-conditions",
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

      function conditionEffects() {
        return createGoldRushFrontierConditionEffects(engine.n.goldrushFrontierConditions?.snapshot?.());
      }

      function reset({ runId = "goldrush-run-001", playerId = "player-1", position = null, heading = 0 } = {}) {
        const scenario = createExtractionLoopScenario();
        state = createInitialState({ scenario, runId, playerId, position: position ?? scenario.spawn, heading });
        pushEvent({ type: "run-started", payload: { runId, playerId } });
        return snapshot();
      }

      function snapshot() {
        const cargoValue = engine.n.goldrushCargo.snapshot()[state.player.id] ?? state.player.cargo.goldDust;
        const frontierConditionEffects = conditionEffects();
        const miningReadability = createMiningReadability({ state, cargoValue, effects: frontierConditionEffects });
        const combatReadability = createCombatReadability({ state, effects: frontierConditionEffects });
        const finalRushPressure = createFinalRushExtractionPressure();
        const nextState = {
          ...state,
          frontierConditionEffects,
          finalRushPressure,
          mining: {
            ...state.mining,
            readability: miningReadability,
          },
          combat: {
            ...state.combat,
            readability: combatReadability,
          },
          player: {
            ...state.player,
            cargo: createCargoState(cargoValue),
          },
          worldSpaceMarkers: createWorldSpaceMarkers(state, cargoValue, combatReadability, miningReadability),
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
        updateExtractionSiteContest();
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
        const effects = conditionEffects();
        const cargoNoisePressure = createCargoNoisePressureState(cargo);
        state.combat.cargoNoisePressure = cargoNoisePressure;
        state.combat.threats = Object.fromEntries(Object.entries(state.combat.threats).map(([threatId, threat]) => {
          const conditionRadius = Math.max(
            Number((threat.radius * effects.combat.detectionRadiusScalar + cargoNoisePressure.detectionRadiusBonus).toFixed(3)),
            threat.conditionRadius ?? 0
          );
          const shouldActivate = cargo >= threat.activationCargo && threat.distance <= conditionRadius && !threat.defeated;
          return [threatId, {
            ...threat,
            conditionRadius,
            cargoNoisePressure,
            detectionRadiusBonus: cargoNoisePressure.detectionRadiusBonus,
            active: threat.active || shouldActivate,
          }];
        }));
        const activeThreats = Object.values(state.combat.threats).filter((threat) => threat.active && !threat.defeated);
        state.combat.activeThreatCount = activeThreats.length;
        state.combat.pressure = Number((activeThreats.reduce((sum, threat) => sum + threat.pressure + (threat.cargoNoisePressure?.pressureBonus ?? 0), 0) * effects.combat.pressureScalar).toFixed(2));
        state.combat.condition = {
          conditionId: effects.conditionId,
          pressureScalar: effects.combat.pressureScalar,
          surpriseScalar: effects.combat.surpriseScalar,
          audioMasking: effects.combat.audioMasking,
        };
        const extractionContestPressure = Object.values(state.extraction.sites)
          .filter((site) => site.contestState?.status === "contested" || site.contestState?.status === "lockdown")
          .reduce((sum, site) => sum + (site.contestState?.pressure ?? 0), 0);
        state.combat.pressure = Number((state.combat.pressure + extractionContestPressure * 0.2).toFixed(2));
        if (activeThreats.length > 0 && state.phase !== "extracted" && state.phase !== "failed") state.phase = state.player.aimMode ? "combat" : state.phase;
      }

      function recordCombatReceipt(receipt) {
        const nextReceipt = {
          receiptId: `combat.${state.runId}.${state.combat.nextReceiptIndex}`,
          tick: state.tick,
          ...receipt,
        };
        state.combat.nextReceiptIndex += 1;
        state.combat.receipts = [...state.combat.receipts, nextReceipt].slice(-state.scenario.combatRules.maxRecentReceipts);
        return nextReceipt;
      }

      function findCoverTarget({ coverId = null, threatId = null } = {}) {
        const readability = createCombatReadability({ state, effects: conditionEffects() });
        const threatPackets = Object.values(readability.threats)
          .filter((threat) => threat.status !== "defeated")
          .sort((a, b) => {
            const activeScore = (b.status === "active" ? 1 : 0) - (a.status === "active" ? 1 : 0);
            return activeScore || a.distance - b.distance;
          });
        const selectedThreat = threatId
          ? threatPackets.find((threat) => threat.threatId === threatId) ?? null
          : coverId
            ? threatPackets.find((threat) => threat.cover.some((cover) => cover.id === coverId)) ?? null
            : threatPackets.find((threat) => threat.recommendedCoverId) ?? null;
        if (!selectedThreat) return { readability, threat: null, cover: null };
        const selectedCover = coverId
          ? selectedThreat.cover.find((cover) => cover.id === coverId) ?? null
          : selectedThreat.cover.find((cover) => cover.id === selectedThreat.recommendedCoverId)
            ?? selectedThreat.cover.find((cover) => cover.status === "available")
            ?? selectedThreat.cover[0]
            ?? null;
        return { readability, threat: selectedThreat, cover: selectedCover };
      }

      function engageCover({ coverId = null, threatId = null, peekSide = null } = {}) {
        if (state.phase === "extracted" || state.phase === "failed") return reject("run-closed");
        updateRanges();
        activateThreats();
        const target = findCoverTarget({ coverId, threatId });
        if (!target.cover || !target.threat) return reject("no-readable-cover", { coverId, threatId });
        const nextCover = createCoverEngagementState({
          cover: target.cover,
          threat: target.threat,
          tick: state.tick,
          peekSide,
        });
        const alreadyEngaged = state.combat.cover?.engaged && state.combat.cover.coverId === nextCover.coverId && state.combat.cover.status === nextCover.status;
        state.combat.cover = {
          ...nextCover,
          startedAtTick: state.combat.cover?.coverId === nextCover.coverId ? state.combat.cover.startedAtTick : state.tick,
        };
        state.phase = "combat";
        state.player.aimMode = true;
        if (!alreadyEngaged) {
          const receipt = recordCombatReceipt({
            type: "cover-engaged",
            result: "cover",
            threatId: target.threat.threatId,
            coverId: nextCover.coverId,
            laneId: nextCover.laneId,
            peekSide: nextCover.peekSide,
            cameraShoulder: nextCover.cameraShoulder,
            exposure: nextCover.exposure,
            damageReduction: nextCover.damageReduction,
            counterplay: "break-line-of-sight",
          });
          state.combat.cover.lastReceiptId = receipt.receiptId;
          pushEvent({ type: "cover-engaged", payload: { coverId: nextCover.coverId, threatId: nextCover.threatId, receiptId: receipt.receiptId } });
        }
        return snapshot();
      }

      function releaseCover({ reason = "manual" } = {}) {
        if (!state.combat.cover?.engaged) return { accepted: true, idempotent: true, cover: structuredClone(state.combat.cover) };
        const previous = structuredClone(state.combat.cover);
        state.combat.cover = createCoverState({ lastReleasedCoverId: previous.coverId, lastReleaseReason: reason, lastReleaseTick: state.tick });
        const receipt = recordCombatReceipt({
          type: "cover-released",
          result: "released",
          threatId: previous.threatId,
          coverId: previous.coverId,
          laneId: previous.laneId,
          reason,
          counterplay: "reposition",
        });
        pushEvent({ type: "cover-released", payload: { coverId: previous.coverId, reason, receiptId: receipt.receiptId } });
        return { accepted: true, previous, receipt: structuredClone(receipt), cover: structuredClone(state.combat.cover) };
      }

      function peekCover({ side = null } = {}) {
        if (!state.combat.cover?.engaged) return reject("no-cover-engaged");
        const nextSide = side ?? state.combat.cover.peekSide ?? "right";
        state.combat.cover = {
          ...state.combat.cover,
          status: "peeking",
          peekSide: nextSide,
          exposure: round(clamp(state.combat.cover.exposure + 0.16, 0, 1)),
          damageReduction: round(clamp(state.combat.cover.damageReduction - 0.18, 0.1, 0.8)),
          updatedAtTick: state.tick,
        };
        const receipt = recordCombatReceipt({
          type: "cover-peek",
          result: "peek",
          threatId: state.combat.cover.threatId,
          coverId: state.combat.cover.coverId,
          laneId: state.combat.cover.laneId,
          peekSide: nextSide,
          cameraShoulder: state.combat.cover.cameraShoulder,
          exposure: state.combat.cover.exposure,
          damageReduction: state.combat.cover.damageReduction,
          counterplay: "peek-and-fire",
        });
        state.combat.cover.lastReceiptId = receipt.receiptId;
        pushEvent({ type: "cover-peek", payload: { coverId: state.combat.cover.coverId, peekSide: nextSide, receiptId: receipt.receiptId } });
        return snapshot();
      }

      function updateExtractionSiteContest({ siteId = null, effects = conditionEffects(), finalRushPressure = createFinalRushExtractionPressure() } = {}) {
        const cargoValue = engine.n.goldrushCargo.snapshot()[state.player.id] ?? state.player.cargo.goldDust;
        let selectedContest = null;
        state.extraction.sites = Object.fromEntries(Object.entries(state.extraction.sites).map(([id, site]) => {
          const contestState = createExtractionContestState({
            site,
            extraction: state.extraction,
            cargoValue,
            effects,
            finalRushPressure,
            tick: state.tick,
          });
          if (id === siteId) selectedContest = contestState;
          return [id, { ...site, contestState }];
        }));
        return selectedContest;
      }

      function activateExtractionContestThreats({ siteId, contest }) {
        const site = state.extraction.sites[siteId];
        if (!site) return null;
        const eventKey = `${siteId}:${contest.conditionId}:${contest.status}`;
        if (state.extraction.contestEvents.includes(eventKey)) return contest;
        const linkedThreatIds = site.linkedThreatIds?.length
          ? site.linkedThreatIds
          : Object.values(state.combat.threats)
            .sort((a, b) => distance2D(a.worldPosition, site.worldPosition) - distance2D(b.worldPosition, site.worldPosition))
            .slice(0, 1)
            .map((threat) => threat.id);
        const calledThreatIds = [];
        linkedThreatIds.forEach((threatId) => {
          const threat = state.combat.threats[threatId];
          if (!threat || threat.defeated) return;
          calledThreatIds.push(threatId);
          state.combat.threats[threatId] = {
            ...threat,
            active: true,
            conditionRadius: Math.max(threat.conditionRadius ?? 0, contest.threatRadius),
            contestSourceSiteId: siteId,
          };
        });
        state.extraction.contestEvents = [...state.extraction.contestEvents, eventKey].slice(-12);
        state.extraction.sites[siteId] = {
          ...state.extraction.sites[siteId],
          contestState: {
            ...contest,
            calledThreatIds,
          },
        };
        pushEvent({
          type: "extraction-contested",
          payload: {
            siteId,
            conditionId: contest.conditionId,
            status: contest.status,
            pressure: contest.pressure,
            calledThreatIds,
          },
        });
        return state.extraction.sites[siteId].contestState;
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
        const effects = conditionEffects();
        const basePayout = Math.min(site.payout, site.remaining);
        const payout = Math.min(site.remaining, Math.max(1, Math.round(basePayout * effects.mining.payoutScalar)));
        const miningReadabilityBeforePayout = createMiningReadability({ state, cargoValue: engine.n.goldrushCargo.snapshot()[state.player.id] ?? state.player.cargo.goldDust, effects });
        const siteReadability = miningReadabilityBeforePayout.sites[site.id];
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
        const miningReceipt = recordMiningReceipt({
          type: "gold-mined",
          siteId: site.id,
          label: site.label,
          kind: site.kind,
          payout,
          basePayout,
          carriedGold: cargo.carriedGold,
          conditionId: effects.conditionId,
          goldZoneId: site.goldZoneId,
          roomWindowId: site.roomWindowId,
          quality: siteReadability?.quality ?? "unknown",
          depletionRatio: siteReadability?.depletionRatio ?? 0,
          claimHeat: siteReadability?.claimHeat ?? 0,
          noiseRadius: siteReadability?.noiseRadius ?? 0,
          rewardPreview: siteReadability?.rewardPreview ?? null,
        });
        pushEvent({ type: "gold-mined", payload: { siteId: site.id, payout, basePayout, carriedGold: cargo.carriedGold, conditionId: effects.conditionId, receiptId: miningReceipt.receiptId } });
        engine.n.goldrushReplaySummary.appendEvent({
          type: "extractionLoopGoldMined",
          tick: engine.clock?.frame ?? state.tick,
          payload: { siteId: site.id, payout, basePayout, carriedGold: cargo.carriedGold, conditionId: effects.conditionId, miningReceipt },
        });
        return { accepted: true, complete: true, siteId: site.id, payout, basePayout, conditionId: effects.conditionId, cargo: cargo.carriedGold, depleted: nextSite.depleted, miningReceipt: structuredClone(miningReceipt) };
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
        const effects = conditionEffects();
        state.extraction.activeSiteId = site.id;
        state.extraction.inVolume = true;
        const finalRushPressure = createFinalRushExtractionPressure({ site });
        state.extraction.requiredSeconds = Number((site.requiredSeconds * effects.extraction.holdTimeScalar * finalRushPressure.holdTimeScalar).toFixed(3));
        state.extraction.condition = {
          conditionId: effects.conditionId,
          riskScalar: effects.extraction.riskScalar,
          holdTimeScalar: effects.extraction.holdTimeScalar,
          signal: effects.extraction.signal,
        };
        state.extraction.finalRushPressure = finalRushPressure;
        state.extraction.interruptedReason = null;
        state.extraction.progress = Number(Math.min(state.extraction.requiredSeconds, state.extraction.progress + Math.max(0, dt)).toFixed(3));
        const contest = updateExtractionSiteContest({ siteId: site.id, effects, finalRushPressure });
        const activeContest = contest?.shouldCallThreat
          ? activateExtractionContestThreats({ siteId: site.id, contest })
          : contest;
        if (activeContest?.calledThreatIds?.length) activateThreats();
        if (state.extraction.progress < state.extraction.requiredSeconds) {
          return { accepted: true, complete: false, progress: state.extraction.progress, required: state.extraction.requiredSeconds, conditionId: effects.conditionId, extractionSiteContest: activeContest };
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
        const effects = conditionEffects();
        const baseCargoValue = beforeCargo * state.scenario.cashoutRules.cargoValueMultiplier;
        const cargoValue = Math.round(baseCargoValue * effects.extraction.cashoutValueScalar);
        const finalRushPressure = createFinalRushExtractionPressure({ site });
        updateExtractionSiteContest({ siteId: site.id, effects, finalRushPressure });
        const extractionSiteContest = structuredClone(state.extraction.sites[site.id]?.contestState ?? null);
        const receiptId = `${state.scenario.receiptRules.receiptPrefix}.${state.runId}.receipt`;
        const extractionReceipt = engine.n.goldrushExtractionReceipts.recordExtraction({
          receiptId,
          playerId: state.player.id,
          teamId: "team-01",
          goldAmount: deposit.depositedGold,
          cargoValue,
          cashoutId: `cashout.${site.id}`,
          goldZoneId: finalRushPressure.goldZoneId,
          roomWindowId: finalRushPressure.roomWindowId,
          tick: engine.clock?.frame ?? state.tick,
          extractionSiteContest,
          frontierCondition: {
            conditionId: effects.conditionId,
            label: effects.label,
            extractionRisk: effects.extraction.riskScalar,
            cashoutValueScalar: effects.extraction.cashoutValueScalar,
            miningPayoutScalar: effects.mining.payoutScalar,
            combatPressureScalar: effects.combat.pressureScalar,
          },
        });
        if (extractionReceipt.status === "accepted") engine.n.goldrushScoring.applyExtractionReceipt(extractionReceipt.receiptId);
        state.receipt = {
          runId: state.runId,
          receiptId,
          extracted: true,
          cargoValue,
          baseCargoValue,
          frontierCondition: {
            conditionId: effects.conditionId,
            label: effects.label,
            extractionRisk: effects.extraction.riskScalar,
            cashoutValueScalar: effects.extraction.cashoutValueScalar,
          },
          finalRushPressure,
          extractionSiteContest,
          depositedGold: deposit.depositedGold,
          threatsDefeated: state.combat.threatsDefeated,
          miningSitesTouched: state.mining.sitesTouched,
          durationTicks: state.tick,
          nextSceneId: site.nextSceneId,
          roomHandoffId: site.roomHandoffId,
          extractionReceiptStatus: extractionReceipt.status,
        };
        state.phase = "extracted";
        state.extraction.progress = state.extraction.requiredSeconds;
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
            const missReceipt = recordCombatReceipt({
              type: "player-shot",
              result: "miss",
              reason: "no-target",
              targetThreatId: null,
              telegraphId: null,
              laneId: null,
              damageApplied: 0,
            });
            return { accepted: true, hit: false, reason: "no-target", receipt: structuredClone(missReceipt) };
          }
          const nextHealth = Math.max(0, target.health - 1);
          const readability = createCombatReadability({ state, effects: conditionEffects() });
          const targetRead = readability.threats[target.id] ?? null;
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
          const hitReceipt = recordCombatReceipt({
            type: "player-shot",
            result: nextHealth <= 0 ? "threat-defeated" : "hit",
            targetThreatId: target.id,
            telegraphId: targetRead?.telegraph.id ?? null,
            laneId: targetRead?.lane.id ?? null,
            damageApplied: 1,
            targetHealthAfter: nextHealth,
            counterplay: "fire-back",
          });
          pushEvent({ type: "shot-hit", payload: { threatId: target.id, defeated: nextHealth <= 0, receiptId: hitReceipt.receiptId } });
          return { accepted: true, hit: true, threatId: target.id, defeated: nextHealth <= 0, receipt: structuredClone(hitReceipt) };
        },
        takeDamage({ amount = 18, reason = "local-threat" } = {}) {
          const readability = createCombatReadability({ state, effects: conditionEffects() });
          const source = Object.values(readability.threats)
            .filter((threat) => threat.status !== "defeated")
            .sort((a, b) => a.distance - b.distance)[0] ?? null;
          const cover = state.combat.cover?.engaged && source?.threatId === state.combat.cover.threatId
            ? state.combat.cover
            : null;
          const baseDamage = Math.max(0, amount);
          const damageReduction = cover ? Number(cover.damageReduction ?? 0) : 0;
          const damage = Math.max(0, Math.round(baseDamage * (1 - damageReduction)));
          const damageMitigated = Math.max(0, baseDamage - damage);
          state.player.health = Math.max(0, state.player.health - damage);
          if (damage > 0) state.interruptUntilTick = state.tick + Math.ceil(state.scenario.cashoutRules.damageInterruptSeconds * 10);
          state.mining.progress = 0;
          state.extraction.interruptedReason = damage > 0 ? "damage" : "covered";
          if (state.player.health <= 0) state.phase = "failed";
          const damageReceipt = recordCombatReceipt({
            type: "player-damaged",
            result: state.phase === "failed" ? "failed" : "interrupted",
            sourceThreatId: source?.threatId ?? null,
            telegraphId: source?.telegraph.id ?? null,
            laneId: source?.lane.id ?? null,
            coverId: cover?.coverId ?? null,
            coverStatus: cover?.status ?? null,
            peekSide: cover?.peekSide ?? null,
            baseDamage,
            damageApplied: damage,
            damageMitigated,
            damageReduction,
            reason,
            counterplayWindowSeconds: source?.telegraph.reactionWindowSeconds ?? null,
            counterplay: cover ? "cover-mitigated" : "move-or-cover",
          });
          pushEvent({ type: "damage", payload: { amount: damage, baseDamage, damageMitigated, reason, health: state.player.health, receiptId: damageReceipt.receiptId } });
          return { accepted: true, health: state.player.health, failed: state.phase === "failed", receipt: structuredClone(damageReceipt) };
        },
        engageCover,
        releaseCover,
        peekCover,
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
          if (input.cover) {
            if (input.peek) {
              if (state.combat.cover?.engaged) this.peekCover({ side: input.peek });
              else this.engageCover({ peekSide: input.peek });
            } else {
              if (!state.combat.cover?.engaged) this.engageCover({});
            }
          } else if (state.combat.cover?.engaged) {
            this.releaseCover({ reason: "input-released" });
          }
          if (input.fire) this.fire({});
          if (input.interact && state.phase !== "extracted" && state.phase !== "failed") {
            const extraction = nearestExtractionSite();
            const cargo = engine.n.goldrushCargo.snapshot()[state.player.id] ?? 0;
            if (extraction?.inRange && (cargo > 0 || state.scenario.cashoutRules.zeroCargoAllowed)) {
              holdExtraction({ siteId: extraction.id, dt });
            } else {
              holdMine({ siteId: nearestMiningSite()?.id, dt });
            }
          } else if (!input.holdActive && (state.phase === "mining" || state.phase === "extracting")) {
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
          if (snap.mining.readability?.contract !== "goldrush-mining-claim-pressure-v1") failures.push("missing-mining-readability-contract");
          if (!Array.isArray(snap.mining.receipts)) failures.push("missing-mining-receipts");
          if (Object.keys(snap.extraction.sites).length < 1) failures.push("missing-extraction-sites");
          if (Object.keys(snap.combat.threats).length < 1) failures.push("missing-threats");
          if (!Array.isArray(snap.worldSpaceMarkers) || snap.worldSpaceMarkers.length < 3) failures.push("missing-world-space-markers");
          return { passed: failures.length === 0, failures };
        },
      };

      function recordMiningReceipt(receipt) {
        const nextReceipt = {
          receiptId: `mining.${state.runId}.${state.mining.nextReceiptIndex}`,
          tick: state.tick,
          ...receipt,
        };
        state.mining.nextReceiptIndex += 1;
        state.mining.receipts = [...state.mining.receipts, nextReceipt].slice(-state.scenario.receiptRules.maxRecentEvents);
        return nextReceipt;
      }

      function createFinalRushExtractionPressure({ site = null } = {}) {
        const finalRush = engine.n.goldrushFinalRush?.snapshot?.() ?? null;
        const touchedMiningSite = state.mining.sitesTouched
          .map((siteId) => state.mining.sites[siteId])
          .find(Boolean) ?? null;
        const nearestSite = touchedMiningSite ?? Object.values(state.mining.sites)
          .sort((a, b) => (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY))[0] ?? null;
        const goldZoneId = touchedMiningSite?.goldZoneId ?? nearestSite?.goldZoneId ?? site?.goldZoneId ?? null;
        const roomWindowId = touchedMiningSite?.roomWindowId ?? nearestSite?.roomWindowId ?? site?.roomWindowId ?? null;
        const zonePressure = goldZoneId
          ? engine.n.goldrushFinalRush?.pressureForGoldZone?.(goldZoneId) ?? { pressure: 0, status: "unknown", extractionMultiplier: 1 }
          : { pressure: 0, status: "unknown", extractionMultiplier: 1 };
        const pressure = Number(zonePressure.pressure ?? 0);
        const active = Boolean(finalRush && finalRush.status !== "idle");
        return {
          contract: "goldrush-final-rush-extraction-pressure-v1",
          active,
          status: finalRush?.status ?? "idle",
          phase: finalRush?.phase ?? null,
          pressureScalar: Number(finalRush?.pressureScalar ?? 0),
          collapseStage: Number(finalRush?.collapseStage ?? 0),
          remainingSeconds: Number(finalRush?.remainingSeconds ?? 0),
          goldZoneId,
          roomWindowId,
          zoneStatus: zonePressure.status ?? "unknown",
          zonePressure: pressure,
          extractionMultiplier: Number(zonePressure.extractionMultiplier ?? 1),
          holdTimeScalar: Number((1 + pressure * 0.25).toFixed(3)),
          contestPressureBonus: Number((pressure * 0.35).toFixed(3)),
          readout: active ? `${zonePressure.status ?? "pressure"} ${Math.round(pressure * 100)}%` : "no-collapse-pressure",
        };
      }
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
      receipts: [],
      nextReceiptIndex: 1,
      sites: Object.fromEntries(scenario.miningSites.map((site) => [
        site.id,
        { ...structuredClone(site), depleted: false, distance: null, inRange: false },
      ])),
    },
    combat: {
      pressure: 0,
      activeThreatCount: 0,
      cargoNoisePressure: createCargoNoisePressureState(0),
      lastHitId: null,
      threatsDefeated: 0,
      cover: createCoverState(),
      recentEvents: [],
      receipts: [],
      nextReceiptIndex: 1,
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
      condition: null,
      finalRushPressure: null,
      contestEvents: [],
      interruptedReason: null,
      sites: Object.fromEntries(scenario.extractionSites.map((site) => [
        site.id,
        { ...structuredClone(site), distance: null, inRange: false, contestState: createQuietContestState(site) },
      ])),
    },
    receipt: null,
    events: [],
    lastRejection: null,
    interruptUntilTick: 0,
  };
}

function createMiningReadability({ state, cargoValue = 0, effects = null } = {}) {
  const conditionId = effects?.conditionId ?? null;
  const payoutScalar = Number(effects?.mining?.payoutScalar ?? 1);
  const sites = Object.fromEntries(Object.values(state.mining.sites).map((site) => {
    const scenarioSite = state.scenario.miningSites.find((entry) => entry.id === site.id) ?? site;
    const progressRatio = state.mining.activeSiteId === site.id
      ? clamp01(state.mining.progress / Math.max(0.001, site.holdSeconds))
      : 0;
    const startingRemaining = Math.max(1, Number(scenarioSite.remaining ?? site.remaining ?? 1));
    const depletionRatio = round(clamp01(1 - Math.max(0, site.remaining) / startingRemaining));
    const distance = Number.isFinite(site.distance) ? site.distance : distance2D(state.player.position, site.worldPosition);
    const baseYieldPerSecond = round(site.payout / Math.max(0.001, site.holdSeconds));
    const rewardPreview = {
      basePayout: Math.min(site.payout, site.remaining),
      expectedPayout: Math.min(site.remaining, Math.max(1, Math.round(Math.min(site.payout, site.remaining) * payoutScalar))),
      payoutScalar: round(payoutScalar),
      goldZoneId: site.goldZoneId,
      roomWindowId: site.roomWindowId,
    };
    const qualityScore = clamp01(baseYieldPerSecond / 24 + (site.kind === "seam" ? 0.18 : 0) - depletionRatio * 0.2);
    const quality = qualityScore >= 0.82 ? "rich" : qualityScore >= 0.55 ? "workable" : "thin";
    const noiseRadius = round((site.radius * 2.4 + rewardPreview.expectedPayout * 0.18) * (site.inRange ? 1 + progressRatio * 0.35 : 1));
    const claimHeat = round(clamp(
      progressRatio * 0.34
      + clamp01(cargoValue / 80) * 0.24
      + qualityScore * 0.22
      + depletionRatio * 0.16
      + (site.inRange ? 0.08 : 0),
      0,
      1.2,
    ));
    const status = site.depleted
      ? "depleted"
      : state.mining.activeSiteId === site.id
        ? "working"
        : site.inRange ? "ready" : "distant";
    return [site.id, {
      siteId: site.id,
      label: site.label,
      kind: site.kind,
      status,
      quality,
      qualityScore: round(qualityScore),
      distance,
      inRange: Boolean(site.inRange),
      progressRatio,
      depletionRatio,
      remaining: site.remaining,
      noiseRadius,
      claimHeat,
      rewardPreview,
      cue: {
        visual: quality === "rich" ? "gold-fleck-spark" : "dust-chip",
        audio: site.kind === "seam" ? "pick-on-quartz" : "pan-grit-rattle",
        shape: site.kind === "seam" ? "wall-seam-glint" : "wash-pan-ring",
      },
      counterplayTags: claimHeat >= 0.66
        ? ["finish-or-leave", "watch-claim-jumpers", "carry-to-cashout"]
        : ["mine", "listen", "route-to-cashout"],
      conditionId,
    }];
  }));
  const activeSite = state.mining.activeSiteId ? sites[state.mining.activeSiteId] ?? null : null;
  const heat = round(Math.max(0, ...Object.values(sites).map((site) => site.claimHeat)));
  const totalMined = state.mining.receipts.reduce((sum, receipt) => sum + Math.max(0, receipt.payout ?? 0), 0);
  return {
    domainPath: "n:goldrush:mine-hold-action",
    contract: "goldrush-mining-claim-pressure-v1",
    activeSiteId: state.mining.activeSiteId,
    heat,
    activeSite,
    sites,
    receipts: structuredClone(state.mining.receipts),
    lastReceipt: structuredClone(state.mining.receipts.at(-1) ?? null),
    totals: {
      sitesTouched: state.mining.sitesTouched.length,
      receiptCount: state.mining.receipts.length,
      minedGold: totalMined,
      carriedGold: cargoValue,
    },
    nextRisk: heat >= 0.72
      ? "claim-jumper-likely"
      : heat >= 0.42 ? "noise-carrying" : "quiet-prospecting",
    conditionId,
  };
}

function createCargoState(goldDust = 0) {
  return {
    goldDust,
    nuggets: Math.floor(goldDust / 25),
    totalValue: goldDust * 10,
    mobility: createCargoMobilityState(goldDust),
    noisePressure: createCargoNoisePressureState(goldDust),
    visual: createCargoVisualState(goldDust),
  };
}

function createCargoMobilityState(goldDust = 0) {
  const amount = Math.max(0, Number(goldDust) || 0);
  const loadRatio = round(clamp01(amount / 120));
  const speedMultiplier = round(1 - loadRatio * 0.28);
  return {
    domainPath: "n:goldrush:gold-carrying",
    contract: "goldrush-cargo-mobility-v1",
    amount,
    loadRatio,
    speedMultiplier,
    sprintMultiplier: round(1 - loadRatio * 0.42),
    staminaDrainScalar: round(1 + loadRatio * 0.65),
    noiseRadiusBonus: round(loadRatio * 9.5),
    postureLean: round(loadRatio * 0.16),
    turnDrag: round(loadRatio * 0.18),
    weightClass: amount >= 90 ? "heavy" : amount >= 45 ? "loaded" : amount > 0 ? "light" : "empty",
    playerRead: amount > 0 ? "Gold slows the run and makes extraction louder." : "No carried gold weight.",
    nextAction: amount > 0 ? "extract-cashout" : "mine-gold",
  };
}

function createCargoNoisePressureState(goldDust = 0) {
  const mobility = createCargoMobilityState(goldDust);
  const amount = mobility.amount;
  const active = amount > 0;
  return {
    domainPath: "n:goldrush:gold-carrying",
    contract: "goldrush-cargo-noise-pressure-v1",
    amount,
    loadRatio: mobility.loadRatio,
    weightClass: mobility.weightClass,
    sourceMobilityContract: mobility.contract,
    noiseRadiusBonus: mobility.noiseRadiusBonus,
    detectionRadiusBonus: round(mobility.noiseRadiusBonus * 1.35),
    pressureBonus: round(clamp(mobility.loadRatio * 0.18, 0, 0.28)),
    suspicionRatio: round(clamp01(amount / 60 + mobility.noiseRadiusBonus / 18)),
    audibleCue: active ? "clinking-gold-satchel" : "quiet-empty-satchel",
    stealthRead: active ? "Carried gold widens claim-jumper detection." : "No carried-gold noise pressure.",
    nextThreatAction: active ? "track-cargo-noise" : "watch-distance",
  };
}

function createCargoVisualState(goldDust = 0) {
  const amount = Math.max(0, Number(goldDust) || 0);
  const loadRatio = round(clamp01(amount / 120));
  const visible = amount > 0;
  const mobility = createCargoMobilityState(amount);
  const nuggetCount = visible ? clamp(Math.ceil(amount / 18), 1, 6) : 0;
  return {
    domainPath: "n:goldrush:gold-carrying",
    contract: "goldrush-cargo-visual-v1",
    visible,
    amount,
    totalValue: amount * 10,
    loadRatio,
    weightClass: amount >= 90 ? "heavy" : amount >= 45 ? "loaded" : amount > 0 ? "light" : "empty",
    attachTo: "prospector-satchel",
    renderRole: "carried-object",
    silhouette: visible ? "bulging-gold-satchel-with-nuggets" : "empty-satchel",
    nuggetCount,
    swayAmplitude: round(0.015 + loadRatio * 0.055),
    scale: round(1 + loadRatio * 0.34),
    emissiveIntensity: round(0.18 + loadRatio * 0.44),
    mobility,
    cue: visible ? "visible-carried-gold" : "empty-cargo",
    nextAction: visible ? "extract-cashout" : "mine-gold",
  };
}

function createCoverState(extra = {}) {
  return {
    contract: "goldrush-cover-engagement-v1",
    engaged: false,
    status: "none",
    coverId: null,
    threatId: null,
    laneId: null,
    peekSide: null,
    cameraShoulder: null,
    exposure: 1,
    coverScore: 0,
    damageReduction: 0,
    blocksLane: false,
    startedAtTick: null,
    updatedAtTick: null,
    lastReceiptId: null,
    ...extra,
  };
}

function createCoverEngagementState({ cover, threat, tick = 0, peekSide = null } = {}) {
  const status = peekSide ? "peeking" : "engaged";
  const baseReduction = clamp((Number(cover.coverScore ?? 0) * 0.72) + (cover.blocksLane ? 0.08 : 0), 0.18, 0.82);
  return createCoverState({
    engaged: true,
    status,
    coverId: cover.id,
    threatId: threat.threatId,
    laneId: cover.laneId ?? threat.lane?.id ?? null,
    peekSide: peekSide ?? cover.peekSide ?? "right",
    cameraShoulder: cover.cameraShoulder ?? "right-shoulder",
    exposure: round(clamp((cover.exposure ?? 0.5) * (status === "peeking" ? 0.82 : 0.38), 0.04, 1)),
    coverScore: Number(cover.coverScore ?? 0),
    damageReduction: round(status === "peeking" ? Math.max(0.1, baseReduction - 0.18) : baseReduction),
    blocksLane: Boolean(cover.blocksLane),
    cue: cover.cue ?? "hard-cover-silhouette",
    startedAtTick: tick,
    updatedAtTick: tick,
  });
}

function createCoverEngagementReadability(state) {
  return structuredClone(state.combat?.cover ?? createCoverState());
}

function createWorldSpaceMarkers(state, cargoValue = 0, combatReadability = createCombatReadability({ state }), miningReadability = createMiningReadability({ state, cargoValue })) {
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
    mining: miningReadability.sites[site.id] ?? null,
  }));
    const extraction = Object.values(state.extraction.sites).map((site) => ({
    id: `marker.${site.id}`,
    type: "extraction-site",
    label: site.prompt,
    worldPosition: site.worldPosition,
    radius: site.radius,
    active: state.extraction.activeSiteId === site.id,
    inRange: site.inRange,
    progress: state.extraction.activeSiteId === site.id ? state.extraction.progress / Math.max(0.001, state.extraction.requiredSeconds) : 0,
    status: state.receipt
      ? "complete"
      : site.contestState?.status === "lockdown"
        ? "lockdown"
        : site.contestState?.status === "contested"
          ? "contested"
          : cargoValue > 0 || state.scenario.cashoutRules.zeroCargoAllowed ? "ready" : "needs-gold",
    condition: state.extraction.activeSiteId === site.id ? state.extraction.condition : null,
    contest: site.contestState ?? null,
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
    telegraph: combatReadability.threats[threat.id]?.telegraph ?? null,
    lane: combatReadability.threats[threat.id]?.lane ?? null,
    cue: combatReadability.threats[threat.id]?.cue ?? null,
    cargoNoisePressure: combatReadability.threats[threat.id]?.cargoNoisePressure ?? null,
    cover: combatReadability.threats[threat.id]?.cover ?? [],
    recommendedCoverId: combatReadability.threats[threat.id]?.recommendedCoverId ?? null,
    engagedCoverId: combatReadability.coverEngagement?.threatId === threat.id ? combatReadability.coverEngagement.coverId : null,
    coverEngagement: combatReadability.coverEngagement?.threatId === threat.id ? combatReadability.coverEngagement : null,
  }));
  return [...mining, ...extraction, ...threats];
}

function createCombatReadability({ state, effects = null } = {}) {
  const effectSource = effects ?? { conditionId: null, combat: { pressureScalar: 1, audioMasking: "normal" } };
  const coverEngagement = createCoverEngagementReadability(state);
  const cargoNoisePressure = createCargoNoisePressureState(engineCargoPressure(state));
  const threats = Object.fromEntries(Object.values(state.combat.threats).map((threat) => {
    const scenarioThreat = state.scenario.localThreatSpawns.find((entry) => entry.id === threat.id) ?? threat;
    const distance = Number.isFinite(threat.distance) ? threat.distance : distance2D(state.player.position, threat.worldPosition);
    const active = Boolean(threat.active && !threat.defeated);
    const noiseAwareRadius = Math.max(threat.conditionRadius ?? threat.radius, threat.radius + cargoNoisePressure.detectionRadiusBonus);
    const suspicious = !active && !threat.defeated && (engineCargoPressure(state) >= threat.activationCargo * 0.5 || distance <= noiseAwareRadius);
    const phase = threat.defeated
      ? "cleared"
      : active
        ? state.player.aimMode ? "committed" : "aiming"
        : suspicious ? "stalking" : "latent";
    const laneId = `lane.${threat.id}`;
    const telegraphId = `telegraph.${threat.id}.${phase}`;
    const pressure = round(((threat.pressure ?? 0) + (active || suspicious ? cargoNoisePressure.pressureBonus : 0)) * Number(effectSource.combat?.pressureScalar ?? 1));
    const lane = {
      id: laneId,
      threatId: threat.id,
      start: structuredClone(threat.worldPosition),
      end: structuredClone(state.player.position),
      width: Number(scenarioThreat.laneWidth ?? 2.2),
      distance,
      status: threat.defeated ? "clear" : active ? "danger" : suspicious ? "warning" : "latent",
    };
    const telegraph = {
      id: telegraphId,
      threatId: threat.id,
      phase,
      seconds: Number(scenarioThreat.telegraphSeconds ?? 0.75),
      reactionWindowSeconds: Number(scenarioThreat.reactionWindowSeconds ?? 1),
      readableBeforeDamage: phase === "aiming" || phase === "committed",
      multisensory: {
        visual: scenarioThreat.cue?.visual ?? "danger-line",
        audio: scenarioThreat.cue?.audio ?? "threat-rustle",
        shape: scenarioThreat.cue?.shape ?? "danger-lane",
      },
    };
    const cover = createThreatCoverDescriptors({
      state,
      threat,
      scenarioThreat,
      lane,
      status: threat.defeated ? "defeated" : active ? "active" : suspicious ? "stalking" : "latent",
    });
    const recommendedCover = cover.find((entry) => entry.status === "available") ?? cover[0] ?? null;
    return [threat.id, {
      threatId: threat.id,
      label: threat.label,
      archetype: scenarioThreat.archetype ?? "ambusher",
      status: threat.defeated ? "defeated" : active ? "active" : suspicious ? "stalking" : "latent",
      distance,
      pressure,
      health: threat.health,
      lane,
      telegraph,
      cue: telegraph.multisensory,
      cargoNoisePressure: {
        ...structuredClone(cargoNoisePressure),
        noiseAwareRadius,
        affectsThreat: active || suspicious,
      },
      cover,
      recommendedCoverId: recommendedCover?.id ?? null,
      coverEngagement: coverEngagement.threatId === threat.id ? coverEngagement : null,
      counterplayTags: structuredClone(scenarioThreat.counterplayTags ?? ["move", "aim"]),
      nextThreatAction: threat.defeated ? "none" : active ? "fire-after-telegraph" : "watch-cargo-and-distance",
      nextPlayerCounterplay: threat.defeated
        ? "resume-extraction"
        : coverEngagement.engaged && coverEngagement.threatId === threat.id
          ? coverEngagement.status === "peeking" ? `peek-${coverEngagement.peekSide}-from-cover-and-fire` : `hold-${coverEngagement.peekSide}-cover`
          : recommendedCover ? `move-to-${recommendedCover.peekSide}-cover` : "break-line-of-sight",
      conditionId: effectSource.conditionId ?? null,
    }];
  }));
  const threatPackets = Object.values(threats);
  return {
    domainPath: "n:goldrush:ambush-pressure",
    contract: "readable-threat-lanes-v1",
    coverContract: "readable-threat-cover-v1",
    threats,
    coverEngagement,
    cargoNoisePressure,
    activeLaneIds: threatPackets.filter((threat) => threat.lane.status === "danger").map((threat) => threat.lane.id),
    warningLaneIds: threatPackets.filter((threat) => threat.lane.status === "warning").map((threat) => threat.lane.id),
    coverIds: threatPackets.flatMap((threat) => threat.cover.map((entry) => entry.id)),
    recommendedCoverIds: threatPackets.map((threat) => threat.recommendedCoverId).filter(Boolean),
    receipts: structuredClone(state.combat.receipts),
    lastReceipt: structuredClone(state.combat.receipts.at(-1) ?? null),
    conditionId: effectSource.conditionId ?? null,
    audioMasking: effectSource.combat?.audioMasking ?? "normal",
  };
}

function createThreatCoverDescriptors({ state, threat, scenarioThreat, lane, status }) {
  const player = state.player?.position ?? { x: 0, y: 0, z: 0 };
  const threatPosition = threat.worldPosition ?? { x: 0, y: 0, z: 0 };
  const dx = (player.x ?? 0) - (threatPosition.x ?? 0);
  const dz = (player.z ?? 0) - (threatPosition.z ?? 0);
  const length = Math.max(0.001, Math.hypot(dx, dz));
  const forward = { x: dx / length, z: dz / length };
  const perpendicular = { x: -forward.z, z: forward.x };
  const midpoint = {
    x: (threatPosition.x ?? 0) + dx * 0.56,
    z: (threatPosition.z ?? 0) + dz * 0.56,
  };
  const baseExposure = status === "active" ? 0.28 : status === "stalking" ? 0.4 : status === "latent" ? 0.56 : 1;
  const templates = [
    { suffix: "left-rock", kind: "rock-outcrop", side: "left", sideOffset: -3.2, forwardOffset: -0.5, exposure: baseExposure, blocksLane: true, height: 1.05 },
    { suffix: "right-cart", kind: "ore-cart", side: "right", sideOffset: 3.1, forwardOffset: 0.35, exposure: baseExposure + 0.08, blocksLane: true, height: 0.82 },
    { suffix: "fallback-ridge", kind: "ridge-shoulder", side: "rear", sideOffset: 0.9, forwardOffset: 4.6, exposure: baseExposure + 0.16, blocksLane: false, height: 1.22 },
  ];
  return templates.map((template, index) => {
    const x = midpoint.x + perpendicular.x * template.sideOffset + forward.x * template.forwardOffset;
    const z = midpoint.z + perpendicular.z * template.sideOffset + forward.z * template.forwardOffset;
    const distanceToPlayer = distance2D(player, { x, z });
    const distanceToThreat = distance2D(threatPosition, { x, z });
    const coverScore = round(clamp(1 - template.exposure + (template.blocksLane ? 0.22 : 0.08) - index * 0.045, 0, 1));
    const id = `cover.${threat.id}.${template.suffix}`;
    const engaged = state.combat.cover?.engaged && state.combat.cover.coverId === id;
    return {
      id,
      threatId: threat.id,
      laneId: lane.id,
      kind: template.kind,
      worldPosition: { x: round(x), y: 0, z: round(z) },
      peekSide: template.side,
      cameraShoulder: template.side === "left" ? "right-shoulder" : "left-shoulder",
      status: engaged ? state.combat.cover.status : status === "defeated" ? "cleared" : status === "latent" ? "scouted" : "available",
      exposure: engaged ? state.combat.cover.exposure : round(clamp(template.exposure, 0, 1)),
      coverScore,
      damageReduction: engaged ? state.combat.cover.damageReduction : round(clamp(coverScore * 0.72 + (template.blocksLane ? 0.08 : 0), 0.18, 0.82)),
      blocksLane: template.blocksLane,
      height: template.height,
      distanceToPlayer,
      distanceToThreat,
      cue: scenarioThreat.coverCue ?? "hard-cover-silhouette",
    };
  }).sort((a, b) => b.coverScore - a.coverScore);
}

function engineCargoPressure(state) {
  return Number(state.player?.cargo?.goldDust ?? 0);
}

function createQuietContestState(site) {
  return {
    siteId: site.id,
    status: "quiet",
    pressure: 0,
    conditionId: null,
    riskScalar: 1,
    signal: "visible",
    cue: site.contest?.cue ?? "cashout-marker",
    noiseRadius: site.contest?.noiseRadius ?? site.radius * 2,
    threatRadius: site.contest?.threatRadius ?? site.radius * 3,
    interruptRisk: 0,
    shouldCallThreat: false,
    calledThreatIds: [],
    tick: 0,
  };
}

function createExtractionContestState({ site, extraction, cargoValue = 0, effects, finalRushPressure = null, tick = 0 }) {
  const active = extraction.activeSiteId === site.id;
  const requiredSeconds = Math.max(0.001, extraction.requiredSeconds ?? site.requiredSeconds ?? 1);
  const progressRatio = active ? clamp01((extraction.progress ?? 0) / requiredSeconds) : 0;
  const riskScalar = Number(effects?.extraction?.riskScalar ?? 1);
  const combatScalar = Number(effects?.combat?.pressureScalar ?? 1);
  const finalRushBonus = Number(finalRushPressure?.contestPressureBonus ?? 0);
  const cargoPressure = clamp01(cargoValue / 60);
  const basePressure = Number(site.contest?.basePressure ?? 0.18);
  const pressure = round(clamp(basePressure + Math.max(0, riskScalar - 1) * 0.42 + cargoPressure * 0.2 + progressRatio * 0.42 + finalRushBonus + (site.inRange ? 0.05 : 0), 0, 1.2));
  const threatCallPressure = Number(site.contest?.threatCallPressure ?? 0.62);
  const lockdownPressure = Number(site.contest?.lockdownPressure ?? 0.9);
  const status = pressure >= lockdownPressure
    ? "lockdown"
    : pressure >= threatCallPressure
      ? "contested"
      : pressure >= 0.35
        ? "watched"
        : "quiet";
  return {
    siteId: site.id,
    status,
    pressure,
    conditionId: effects?.conditionId ?? null,
    riskScalar: round(riskScalar),
    signal: effects?.extraction?.signal ?? "visible",
    cue: site.contest?.cue ?? "cashout-marker",
    noiseRadius: round((site.contest?.noiseRadius ?? site.radius * 2) * riskScalar * (1 + progressRatio * 0.25)),
    threatRadius: round((site.contest?.threatRadius ?? site.radius * 3) * Math.max(1, combatScalar * 0.75)),
    interruptRisk: round(clamp(Math.max(0, riskScalar - 1) * 0.35 + progressRatio * 0.25 + cargoPressure * 0.12, 0, 0.95)),
    finalRushPressure: finalRushPressure ? structuredClone(finalRushPressure) : null,
    shouldCallThreat: active && progressRatio > 0 && pressure >= threatCallPressure,
    calledThreatIds: site.contestState?.calledThreatIds ?? [],
    tick,
  };
}

function distance2D(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  return Number(Math.hypot((a.x ?? 0) - (b.x ?? 0), (a.z ?? 0) - (b.z ?? 0)).toFixed(3));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function round(value) {
  return Number(Number(value).toFixed(3));
}
