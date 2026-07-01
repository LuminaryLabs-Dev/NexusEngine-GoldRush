import { defineDomainServiceKit } from "nexusrealtime";
import { clampPressure, goldRushDefaultRules, goldRushPhaseOrder, phaseIndex, stableHash } from "../content/goldrushMatchRules.js";

const version = "0.1.0";
const stability = "prototype";

export function createMatchLifecycleKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-match-lifecycle-kit",
    domain: "goldrush-match-lifecycle",
    apiName: "goldrushMatch",
    stability,
    version,
    services: ["start", "advance-phase", "tick", "request-end", "restart", "snapshot", "validate"],
    metadata: {
      purpose: "Own deterministic match status, phase order, lifecycle clock, and end conditions.",
    },
    createApi() {
      let state = createMatchState();

      function start({ matchId = "match.goldrush.local.001", players = 2, seed = goldRushDefaultRules.seed, ruleSetId = goldRushDefaultRules.ruleSetId, phase = "lobby" } = {}) {
        state = {
          ...createMatchState(),
          matchId,
          seed,
          ruleSetId,
          status: "running",
          phase,
          phaseIndex: phaseIndex(phase),
          players: Math.max(2, Math.min(goldRushDefaultRules.maxPlayers, players)),
          phaseHistory: goldRushPhaseOrder.slice(0, phaseIndex(phase) + 1).map((entry, index) => ({
            phase: entry,
            enteredTick: index === 0 ? 0 : index * 600,
            reason: index === phaseIndex(phase) ? "match.start" : "preseed",
          })),
        };
        return this.snapshot();
      }

      return {
        start,
        restart(input = {}) {
          return start(input);
        },
        advancePhase({ phase, reason = "scenario.advance", commandId = null } = {}) {
          const nextIndex = phaseIndex(phase);
          if (nextIndex < state.phaseIndex) {
            return { accepted: false, reason: "phase-regression-blocked", currentPhase: state.phase, requestedPhase: phase };
          }
          state = {
            ...state,
            phase,
            phaseIndex: nextIndex,
            status: phase === "results" ? "complete" : state.status === "idle" ? "running" : state.status,
            phaseHistory: [
              ...state.phaseHistory,
              {
                phase,
                enteredTick: state.tick,
                reason,
                commandId,
              },
            ],
          };
          return { accepted: true, snapshot: this.snapshot() };
        },
        tick({ tickId = null, dt = 1 } = {}) {
          if (state.status === "running" || state.status === "ending") {
            state = {
              ...state,
              tick: state.tick + 1,
              elapsedSeconds: Number((state.elapsedSeconds + Math.max(0, dt)).toFixed(3)),
              lastTickId: tickId,
            };
          }
          return this.snapshot();
        },
        requestEnd({ reason = "manual", commandId = null } = {}) {
          if (state.endCondition.ended) return { accepted: false, reason: "match-already-ended", snapshot: this.snapshot() };
          state = {
            ...state,
            status: "ending",
            endCondition: {
              ended: true,
              reason,
              requestedBy: commandId,
              tick: state.tick,
            },
          };
          return { accepted: true, snapshot: this.snapshot() };
        },
        snapshot() {
          return structuredClone({
            ...state,
            validation: validateMatchState(state),
          });
        },
        validate() {
          return validateMatchState(state);
        },
      };
    },
  });
}

export function createFinalRushKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-final-rush-kit",
    domain: "goldrush-final-rush",
    apiName: "goldrushFinalRush",
    stability,
    version,
    requires: ["n:goldrush-terrain-patch-window", "n:goldrush-gold-zones"],
    services: ["arm", "tick", "pressure-for-window", "pressure-for-gold-zone", "lock-gold-zone", "snapshot", "validate"],
    metadata: {
      purpose: "Own final rush warning, collapse pressure, pressure zones, and lockout state.",
    },
    createApi({ engine }) {
      let state = createFinalRushState();
      const events = [];

      function computePressure() {
        if (state.status === "idle") return 0;
        const collapseTime = Math.max(1, state.elapsedSeconds - state.warningSeconds);
        return clampPressure(collapseTime / state.collapseSeconds);
      }

      function rebuildPressureMaps() {
        const terrain = engine.n.goldrushTerrain.snapshot();
        const zones = engine.n.goldrushGoldZones.snapshot();
        const pressureScalar = computePressure();
        const safeRoomWindowIds = terrain.roomPatchWindows
          .filter((_window, index) => index === terrain.roomPatchWindows.length - 1)
          .map((window) => window.id);
        const windowPressure = Object.fromEntries(terrain.roomPatchWindows.map((window, index) => {
          const pressure = safeRoomWindowIds.includes(window.id)
            ? clampPressure(pressureScalar * 0.35)
            : clampPressure(pressureScalar + index * 0.08);
          return [window.id, { pressure, status: pressure >= 1 ? "locked" : pressure >= 0.45 ? "collapsing" : "warning" }];
        }));
        const zonePressure = Object.fromEntries(zones.map((zone, index) => {
          const pressure = clampPressure(pressureScalar + index * 0.06);
          const locked = state.lockedGoldZoneIds.includes(zone.goldZoneId) || pressure >= 1;
          return [zone.goldZoneId, {
            pressure,
            status: locked ? "locked" : pressure >= 0.45 ? "danger" : "active",
            extractionMultiplier: Number((1 + pressure * goldRushDefaultRules.extractionPressureMultiplier).toFixed(2)),
          }];
        }));
        return {
          pressureScalar,
          safeRoomWindowIds,
          pressuredRoomWindowIds: Object.entries(windowPressure).filter(([, value]) => value.pressure >= 0.45).map(([id]) => id),
          zonePressure,
          windowPressure,
        };
      }

      return {
        arm({ startTick = engine.clock?.frame ?? 0, warningSeconds = goldRushDefaultRules.warningSeconds, collapseSeconds = goldRushDefaultRules.collapseSeconds, commandId = "final-rush.manual" } = {}) {
          if (state.status !== "idle") return { accepted: false, reason: "final-rush-already-armed", snapshot: this.snapshot() };
          state = {
            ...state,
            status: "armed",
            startTick,
            warningSeconds,
            collapseSeconds,
            commandId,
          };
          events.push({ id: `pressure.${events.length + 1}`, tick: startTick, type: "finalRushArmed", targetId: "match" });
          return { accepted: true, snapshot: this.snapshot() };
        },
        tick({ tickId = null, dt = 1, phase = "finalRush" } = {}) {
          if (state.status === "idle" || state.status === "complete") return this.snapshot();
          const elapsedSeconds = Number((state.elapsedSeconds + Math.max(0, dt)).toFixed(3));
          const pressureScalar = clampPressure(Math.max(0, elapsedSeconds - state.warningSeconds) / Math.max(1, state.collapseSeconds));
          const status = pressureScalar >= 1 ? "complete" : elapsedSeconds >= state.warningSeconds ? "collapsing" : "warning";
          state = {
            ...state,
            status,
            phase,
            elapsedSeconds,
            remainingSeconds: Number(Math.max(0, state.warningSeconds + state.collapseSeconds - elapsedSeconds).toFixed(3)),
            collapseStage: Math.min(4, Math.floor(pressureScalar * 5)),
            tickId,
          };
          if (events.at(-1)?.type !== status) {
            events.push({ id: `pressure.${events.length + 1}`, tick: engine.clock?.frame ?? 0, type: status, targetId: "match" });
          }
          return this.snapshot();
        },
        pressureForWindow(roomWindowId) {
          return this.snapshot().windowPressure[roomWindowId] ?? { pressure: 0, status: "unknown" };
        },
        pressureForGoldZone(goldZoneId) {
          return this.snapshot().zonePressure[goldZoneId] ?? { pressure: 0, status: "unknown", extractionMultiplier: 1 };
        },
        lockGoldZone({ goldZoneId, reason = "manual", commandId = null } = {}) {
          if (!state.lockedGoldZoneIds.includes(goldZoneId)) {
            state = { ...state, lockedGoldZoneIds: [...state.lockedGoldZoneIds, goldZoneId] };
            events.push({ id: `pressure.${events.length + 1}`, tick: engine.clock?.frame ?? 0, type: "goldZoneLocked", targetId: goldZoneId, reason, commandId });
          }
          return this.pressureForGoldZone(goldZoneId);
        },
        snapshot() {
          const pressure = rebuildPressureMaps();
          return structuredClone({
            ...state,
            ...pressure,
            lastPressureEvent: events.at(-1) ?? null,
            events: events.slice(-12),
          });
        },
        validate() {
          const snapshot = this.snapshot();
          const failures = [];
          if (snapshot.pressureScalar < 0 || snapshot.pressureScalar > 1) failures.push("pressure-out-of-range");
          if (snapshot.status !== "idle" && snapshot.remainingSeconds < 0) failures.push("negative-remaining-time");
          if (Object.values(snapshot.zonePressure).some((zone) => zone.pressure < 0 || zone.pressure > 1)) failures.push("zone-pressure-out-of-range");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

export function createExtractionReceiptKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-extraction-receipt-kit",
    domain: "goldrush-extraction-receipts",
    apiName: "goldrushExtractionReceipts",
    stability,
    version,
    requires: ["n:goldrush-final-rush"],
    services: ["record-extraction", "reject-extraction", "receipt", "receipts-for-player", "receipts-for-team", "totals", "snapshot", "validate"],
    metadata: {
      purpose: "Own accepted, duplicate, and rejected cashout receipts for replay-safe extraction scoring.",
    },
    createApi({ engine }) {
      const receipts = [];
      const appliedReceiptIds = new Set();
      const rejectedReceiptIds = new Set();

      return {
        recordExtraction({ receiptId, playerId, teamId = "team-01", goldAmount = 0, cargoValue = 0, cashoutId = "cashout.central-yard", goldZoneId = null, roomWindowId = null, tick = engine.clock?.frame ?? 0, frontierCondition = null, extractionSiteContest = null } = {}) {
          if (appliedReceiptIds.has(receiptId) || rejectedReceiptIds.has(receiptId)) {
            const duplicate = { receiptId, status: "duplicate", playerId, teamId, tick, rejectionReason: "duplicate-receipt" };
            receipts.push(duplicate);
            return structuredClone(duplicate);
          }
          if (!receiptId || !playerId || goldAmount < 0 || cargoValue < 0) {
            return this.rejectExtraction({ receiptId: receiptId ?? `extract.rejected.${receipts.length + 1}`, reason: "invalid-extraction", tick });
          }
          const pressure = goldZoneId ? engine.n.goldrushFinalRush.pressureForGoldZone(goldZoneId) : { pressure: 0, extractionMultiplier: 1 };
          const multiplier = pressure.extractionMultiplier ?? 1;
          const receipt = {
            receiptId,
            status: "accepted",
            playerId,
            teamId,
            goldAmount,
            cargoValue,
            scoreValue: Math.round((goldAmount + cargoValue) * multiplier),
            cashoutId,
            goldZoneId,
            roomWindowId,
            tick,
            pressureScalar: pressure.pressure ?? 0,
            multiplier,
            frontierCondition: frontierCondition ? structuredClone(frontierCondition) : null,
            extractionSiteContest: extractionSiteContest ? structuredClone(extractionSiteContest) : null,
            rejectionReason: null,
          };
          appliedReceiptIds.add(receiptId);
          receipts.push(receipt);
          return structuredClone(receipt);
        },
        rejectExtraction({ receiptId, reason = "rejected", tick = engine.clock?.frame ?? 0 } = {}) {
          const receipt = { receiptId, status: "rejected", tick, rejectionReason: reason };
          rejectedReceiptIds.add(receiptId);
          receipts.push(receipt);
          return structuredClone(receipt);
        },
        receipt(receiptId) {
          return structuredClone(receipts.find((receipt) => receipt.receiptId === receiptId) ?? null);
        },
        receiptsForPlayer(playerId) {
          return structuredClone(receipts.filter((receipt) => receipt.playerId === playerId));
        },
        receiptsForTeam(teamId) {
          return structuredClone(receipts.filter((receipt) => receipt.teamId === teamId));
        },
        totals() {
          const accepted = receipts.filter((receipt) => receipt.status === "accepted");
          return {
            extractedGold: accepted.reduce((sum, receipt) => sum + receipt.goldAmount, 0),
            extractedCargoValue: accepted.reduce((sum, receipt) => sum + receipt.cargoValue, 0),
            acceptedCount: accepted.length,
            rejectedCount: receipts.filter((receipt) => receipt.status === "rejected").length,
            duplicateCount: receipts.filter((receipt) => receipt.status === "duplicate").length,
          };
        },
        snapshot() {
          return structuredClone({
            version,
            receipts,
            appliedReceiptIds: [...appliedReceiptIds],
            rejectedReceiptIds: [...rejectedReceiptIds],
            totals: this.totals(),
          });
        },
        validate() {
          const snapshot = this.snapshot();
          const failures = [];
          if (snapshot.receipts.some((receipt) => receipt.status === "accepted" && receipt.scoreValue < 0)) failures.push("negative-score-value");
          if (snapshot.appliedReceiptIds.length !== new Set(snapshot.appliedReceiptIds).size) failures.push("duplicate-applied-receipt-id");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

export function createRoomHandoffReceiptKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-room-handoff-receipt-kit",
    domain: "goldrush-room-handoff-receipts",
    apiName: "goldrushRoomHandoffReceipts",
    stability,
    version,
    requires: ["n:goldrush-loading-gates"],
    services: ["record-handoff", "reject-handoff", "receipt", "receipts-for-gate", "snapshot", "validate"],
    metadata: {
      purpose: "Own room gate handoff receipts that bridge shard windows and loading transitions.",
    },
    createApi({ engine }) {
      const receipts = [];
      const appliedHandoffIds = new Set();

      return {
        recordHandoff({ handoffId, gateId, playerIds = ["player-1"], fromRoomWindowId, toRoomWindowId, triggerPathId, transitionId, tick = engine.clock?.frame ?? 0 } = {}) {
          if (appliedHandoffIds.has(handoffId)) {
            const duplicate = { handoffId, status: "duplicate", gateId, playerIds, playerCount: playerIds.length, tick, rejectionReason: "duplicate-handoff" };
            receipts.push(duplicate);
            return structuredClone(duplicate);
          }
          const gate = engine.n.goldrushLoadingGates.snapshot().gates.find((entry) => entry.id === gateId);
          if (!gate || gate.status !== "ready" || fromRoomWindowId === toRoomWindowId) {
            return this.rejectHandoff({ handoffId, gateId, reason: !gate ? "unknown-gate" : "invalid-room-window-pair", tick });
          }
          const receipt = {
            handoffId,
            status: "accepted",
            gateId,
            fromRoomWindowId: fromRoomWindowId ?? gate.fromRoomWindowId,
            toRoomWindowId: toRoomWindowId ?? gate.toRoomWindowId,
            triggerPathId: triggerPathId ?? gate.triggerPathId,
            transitionId: transitionId ?? gate.transitionId,
            playerIds,
            playerCount: playerIds.length,
            tick,
            rejectionReason: null,
          };
          appliedHandoffIds.add(handoffId);
          receipts.push(receipt);
          return structuredClone(receipt);
        },
        rejectHandoff({ handoffId, gateId = null, reason = "rejected", tick = engine.clock?.frame ?? 0 } = {}) {
          const receipt = { handoffId, status: "rejected", gateId, tick, rejectionReason: reason };
          receipts.push(receipt);
          return structuredClone(receipt);
        },
        receipt(handoffId) {
          return structuredClone(receipts.find((receipt) => receipt.handoffId === handoffId) ?? null);
        },
        receiptsForGate(gateId) {
          return structuredClone(receipts.filter((receipt) => receipt.gateId === gateId));
        },
        snapshot() {
          const latestByGate = {};
          receipts.filter((receipt) => receipt.status === "accepted").forEach((receipt) => {
            latestByGate[receipt.gateId] = receipt.handoffId;
          });
          return structuredClone({
            version,
            receipts,
            appliedHandoffIds: [...appliedHandoffIds],
            latestByGate,
          });
        },
        validate() {
          const snapshot = this.snapshot();
          const gates = engine.n.goldrushLoadingGates.snapshot().gates;
          const gateIds = new Set(gates.map((gate) => gate.id));
          const failures = [];
          if (snapshot.receipts.some((receipt) => receipt.status === "accepted" && !gateIds.has(receipt.gateId))) failures.push("accepted-handoff-missing-gate");
          if (snapshot.receipts.some((receipt) => receipt.status === "accepted" && receipt.fromRoomWindowId === receipt.toRoomWindowId)) failures.push("handoff-same-window");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

export function createScoringKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-scoring-kit",
    domain: "goldrush-scoring",
    apiName: "goldrushScoring",
    stability,
    version,
    requires: ["n:goldrush-extraction-receipts"],
    services: ["apply-extraction-receipt", "apply-combat-result", "apply-survival-bonus", "apply-penalty", "scoreboard", "snapshot", "validate"],
    metadata: {
      purpose: "Own score rules, player/team totals, multipliers, penalties, and placements.",
    },
    createApi({ engine }) {
      const players = {};
      const teams = {};
      const appliedReceiptIds = new Set();

      function ensurePlayer(playerId = "player-1", teamId = "team-01") {
        players[playerId] ??= {
          playerId,
          teamId,
          extractedGold: 0,
          cargoValue: 0,
          combatScore: 0,
          survivalBonus: 0,
          penalties: 0,
          totalScore: 0,
          placement: null,
        };
        teams[teamId] ??= {
          teamId,
          extractedGold: 0,
          cargoValue: 0,
          combatScore: 0,
          survivalBonus: 0,
          penalties: 0,
          totalScore: 0,
          placement: null,
        };
        return players[playerId];
      }

      function recomputePlacements() {
        Object.values(players).forEach((entry) => {
          entry.totalScore = Math.max(0, entry.extractedGold + entry.cargoValue + entry.combatScore + entry.survivalBonus - entry.penalties);
        });
        Object.values(teams).forEach((entry) => {
          entry.totalScore = Math.max(0, entry.extractedGold + entry.cargoValue + entry.combatScore + entry.survivalBonus - entry.penalties);
        });
        Object.values(players)
          .sort((a, b) => b.totalScore - a.totalScore || a.playerId.localeCompare(b.playerId))
          .forEach((entry, index) => { entry.placement = index + 1; });
        Object.values(teams)
          .sort((a, b) => b.totalScore - a.totalScore || a.teamId.localeCompare(b.teamId))
          .forEach((entry, index) => { entry.placement = index + 1; });
      }

      return {
        applyExtractionReceipt(receiptId) {
          if (appliedReceiptIds.has(receiptId)) return { accepted: false, reason: "duplicate-score-receipt" };
          const receipt = engine.n.goldrushExtractionReceipts.receipt(receiptId);
          if (!receipt || receipt.status !== "accepted") return { accepted: false, reason: "missing-or-unaccepted-extraction" };
          const player = ensurePlayer(receipt.playerId, receipt.teamId);
          const team = teams[player.teamId];
          player.extractedGold += receipt.goldAmount;
          player.cargoValue += receipt.cargoValue;
          team.extractedGold += receipt.goldAmount;
          team.cargoValue += receipt.cargoValue;
          appliedReceiptIds.add(receiptId);
          recomputePlacements();
          return { accepted: true, playerId: player.playerId, teamId: team.teamId, totalScore: player.totalScore };
        },
        applyCombatResult({ combatReceiptId, playerId = "player-1", defeatedPlayerId = null, value = 0 } = {}) {
          const receiptId = combatReceiptId ?? `combat.${playerId}.${appliedReceiptIds.size + 1}`;
          if (appliedReceiptIds.has(receiptId)) return { accepted: false, reason: "duplicate-score-receipt" };
          const player = ensurePlayer(playerId);
          const team = teams[player.teamId];
          const score = Math.max(0, value);
          player.combatScore += score;
          team.combatScore += score;
          appliedReceiptIds.add(receiptId);
          recomputePlacements();
          return { accepted: true, playerId, defeatedPlayerId, totalScore: player.totalScore };
        },
        applySurvivalBonus({ playerId = "player-1", reason = "final-rush-survival", value = goldRushDefaultRules.survivalBonus, receiptId = `survival.${playerId}.${appliedReceiptIds.size + 1}` } = {}) {
          if (appliedReceiptIds.has(receiptId)) return { accepted: false, reason: "duplicate-score-receipt" };
          const player = ensurePlayer(playerId);
          const team = teams[player.teamId];
          player.survivalBonus += Math.max(0, value);
          team.survivalBonus += Math.max(0, value);
          appliedReceiptIds.add(receiptId);
          recomputePlacements();
          return { accepted: true, playerId, reason, totalScore: player.totalScore };
        },
        applyPenalty({ playerId = "player-1", reason = "manual", value = 0, receiptId = `penalty.${playerId}.${appliedReceiptIds.size + 1}` } = {}) {
          if (appliedReceiptIds.has(receiptId)) return { accepted: false, reason: "duplicate-score-receipt" };
          const player = ensurePlayer(playerId);
          const team = teams[player.teamId];
          player.penalties += Math.max(0, value);
          team.penalties += Math.max(0, value);
          appliedReceiptIds.add(receiptId);
          recomputePlacements();
          return { accepted: true, playerId, reason, totalScore: player.totalScore };
        },
        scoreboard() {
          recomputePlacements();
          return this.snapshot();
        },
        snapshot() {
          recomputePlacements();
          const playerList = Object.values(players).sort((a, b) => a.placement - b.placement);
          const teamList = Object.values(teams).sort((a, b) => a.placement - b.placement);
          return structuredClone({
            version,
            ruleSetId: goldRushDefaultRules.ruleSetId,
            appliedReceiptIds: [...appliedReceiptIds],
            players,
            teams,
            leaders: {
              playerId: playerList[0]?.playerId ?? null,
              teamId: teamList[0]?.teamId ?? null,
            },
          });
        },
        validate() {
          const snapshot = this.snapshot();
          const values = [
            ...Object.values(snapshot.players).map((entry) => entry.totalScore),
            ...Object.values(snapshot.teams).map((entry) => entry.totalScore),
          ];
          const failures = [];
          if (values.some((value) => !Number.isFinite(value) || value < 0)) failures.push("invalid-score-value");
          if (snapshot.appliedReceiptIds.length !== new Set(snapshot.appliedReceiptIds).size) failures.push("duplicate-scoring-receipt");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

export function createMatchResultsKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-match-results-kit",
    domain: "goldrush-match-results",
    apiName: "goldrushResults",
    stability,
    version,
    requires: ["n:goldrush-match-lifecycle", "n:goldrush-scoring", "n:goldrush-extraction-receipts", "n:goldrush-frontier-conditions"],
    services: ["compute", "finalize", "result", "snapshot", "validate"],
    metadata: {
      purpose: "Own end-of-match winner, placements, awards, reason, and final result state.",
    },
    createApi({ engine }) {
      let current = createPendingResult();
      const archive = [];

      function computeResult({ reason = "manual" } = {}) {
        const match = engine.n.goldrushMatch.snapshot();
        const scoring = engine.n.goldrushScoring.snapshot();
        const extractions = engine.n.goldrushExtractionReceipts.snapshot();
        const frontierConditionSummary = createResultFrontierConditionSummary({
          frontierConditions: engine.n.goldrushFrontierConditions.snapshot(),
          frontierConditionEffects: engine.n.goldrushFrontierConditions.effects(),
          extractions,
        });
        const extractionContestSummary = createExtractionContestSummary(extractions);
        const finalRushPressureSummary = createFinalRushPressureSummary(extractions);
        const combatOutcomeSummary = createCombatOutcomeSummary(engine.n.goldrushExtractionLoop?.getState?.());
        const teamPlacements = Object.values(scoring.teams).sort((a, b) => a.placement - b.placement);
        const winner = teamPlacements[0]
          ? { kind: "team", id: teamPlacements[0].teamId, score: teamPlacements[0].totalScore }
          : { kind: "none", id: null, score: 0 };
        return {
          version,
          resultId: `result.${match.matchId}`,
          status: "pending",
          reason,
          frontierConditionSummary,
          extractionContestSummary,
          finalRushPressureSummary,
          combatOutcomeSummary,
          matchId: match.matchId,
          completedTick: match.tick,
          winner,
          placements: teamPlacements.map((team) => ({
            rank: team.placement,
            teamId: team.teamId,
            score: team.totalScore,
            extractedGold: team.extractedGold,
            extractionCount: extractions.receipts.filter((receipt) => receipt.status === "accepted" && receipt.teamId === team.teamId).length,
          })),
          awards: [
            {
              id: "award.richest-haul",
              targetId: winner.id,
              value: extractions.totals.extractedGold,
            },
            {
              id: "award.frontier-condition-mastered",
              targetId: winner.id,
              value: frontierConditionSummary.conditionId,
            },
            ...(extractionContestSummary.lockdownCount > 0
              ? [{
                id: "award.lockdown-extractor",
                targetId: winner.id,
                value: extractionContestSummary.lockdownCount,
              }]
              : []),
            ...(finalRushPressureSummary.pressureLinkedReceiptCount > 0
              ? [{
                id: "award.collapse-cashout",
                targetId: winner.id,
                value: finalRushPressureSummary.maxMultiplier,
              }]
              : []),
            ...(combatOutcomeSummary.damageReceiptCount > 0
              ? [{
                id: "award.under-fire-extractor",
                targetId: winner.id,
                value: combatOutcomeSummary.damageTaken,
              }]
              : []),
            ...(combatOutcomeSummary.threatsDefeated > 0
              ? [{
                id: "award.claim-jumper-cleared",
                targetId: winner.id,
                value: combatOutcomeSummary.threatsDefeated,
              }]
              : []),
          ],
          finalAudioCueId: "goldrush.audio.sfx.cashout",
          finalAnimationCueId: "goldrush.anim.player.idle",
        };
      }

      return {
        compute(input = {}) {
          current = computeResult(input);
          return structuredClone(current);
        },
        finalize({ resultId = null, reason = "manual", commandId = null } = {}) {
          if (current.status === "final") return { accepted: false, reason: "result-already-final", result: this.snapshot() };
          current = {
            ...computeResult({ reason }),
            resultId: resultId ?? computeResult({ reason }).resultId,
            status: "final",
            commandId,
          };
          archive.push(current);
          return { accepted: true, result: this.snapshot() };
        },
        result(resultId) {
          return structuredClone(archive.find((entry) => entry.resultId === resultId) ?? null);
        },
        snapshot() {
          return structuredClone(current);
        },
        validate() {
          const failures = [];
          if (current.status === "final" && !current.resultId) failures.push("missing-result-id");
          if (current.status === "final" && !Object.hasOwn(current.winner, "score")) failures.push("missing-winner-score");
          if (current.status === "final" && !Number.isFinite(current.completedTick)) failures.push("invalid-completed-tick");
          if (current.status === "final" && !current.frontierConditionSummary?.conditionId) failures.push("missing-frontier-condition-summary");
          if (current.status === "final" && !current.extractionContestSummary) failures.push("missing-extraction-contest-summary");
          if (current.status === "final" && !current.finalRushPressureSummary) failures.push("missing-final-rush-pressure-summary");
          if (current.status === "final" && !current.combatOutcomeSummary) failures.push("missing-combat-outcome-summary");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

export function createReplaySummaryKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-replay-summary-kit",
    domain: "goldrush-replay-summary",
    apiName: "goldrushReplaySummary",
    stability,
    version,
    requires: ["n:goldrush-match-lifecycle", "n:goldrush-extraction-receipts", "n:goldrush-room-handoff-receipts", "n:goldrush-scoring", "n:goldrush-match-results", "n:goldrush-frontier-conditions"],
    services: ["capture", "append-event", "snapshot", "export-summary", "validate"],
    metadata: {
      purpose: "Own deterministic compact replay summaries from match, receipt, scoring, and result ledgers.",
    },
    createApi({ engine }) {
      const events = [];
      let captured = null;

      function createSummary(summaryId = null) {
        const match = engine.n.goldrushMatch.snapshot();
        const extractionReceipts = engine.n.goldrushExtractionReceipts.snapshot();
        const handoffReceipts = engine.n.goldrushRoomHandoffReceipts.snapshot();
        const scoring = engine.n.goldrushScoring.snapshot();
        const results = engine.n.goldrushResults.snapshot();
        const frontierConditionSummary = createResultFrontierConditionSummary({
          frontierConditions: engine.n.goldrushFrontierConditions.snapshot(),
          frontierConditionEffects: engine.n.goldrushFrontierConditions.effects(),
          extractions: extractionReceipts,
        });
        const extractionLoop = engine.n.goldrushExtractionLoop?.getState?.();
        const extractionContestSummary = createExtractionContestSummary(extractionReceipts);
        const finalRushPressureSummary = createFinalRushPressureSummary(extractionReceipts);
        const combatOutcomeSummary = createCombatOutcomeSummary(extractionLoop);
        const topPlayers = Object.values(scoring.players).sort((a, b) => a.placement - b.placement).slice(0, 5);
        const topTeams = Object.values(scoring.teams).sort((a, b) => a.placement - b.placement).slice(0, 5);
        const keyMoments = [
          ...events,
          ...extractionReceipts.receipts.filter((receipt) => receipt.status !== "duplicate").map((receipt) => ({
            tick: receipt.tick,
            type: receipt.status === "accepted" ? "extractionAccepted" : "extractionRejected",
            receiptId: receipt.receiptId,
            contestStatus: receipt.extractionSiteContest?.status ?? null,
            calledThreatIds: receipt.extractionSiteContest?.calledThreatIds ?? [],
            finalRushPressure: receipt.pressureScalar ?? 0,
            extractionMultiplier: receipt.multiplier ?? 1,
            goldZoneId: receipt.goldZoneId ?? null,
          })),
          ...handoffReceipts.receipts.filter((receipt) => receipt.status !== "duplicate").map((receipt) => ({
            tick: receipt.tick,
            type: receipt.status === "accepted" ? "handoffAccepted" : "handoffRejected",
            receiptId: receipt.handoffId,
          })),
          ...createCombatReplayMoments(extractionLoop),
        ].sort((a, b) => a.tick - b.tick || a.type.localeCompare(b.type));
        const summary = {
          version,
          summaryId: summaryId ?? `summary.${match.matchId}`,
          matchId: match.matchId,
          seed: match.seed,
          frames: {
            startTick: 0,
            endTick: match.tick,
            elapsedSeconds: match.elapsedSeconds,
          },
          keyMoments,
          receiptCounts: {
            extractions: extractionReceipts.totals.acceptedCount,
            handoffs: handoffReceipts.appliedHandoffIds.length,
            combat: engine.n.goldrushCombat.snapshot().receipts.length + combatOutcomeSummary.receiptCount,
            scoring: scoring.appliedReceiptIds.length,
          },
          frontierConditionSummary,
          extractionContestSummary,
          finalRushPressureSummary,
          combatOutcomeSummary,
          topPlayers: topPlayers.map((player) => ({ playerId: player.playerId, totalScore: player.totalScore })),
          topTeams: topTeams.map((team) => ({ teamId: team.teamId, totalScore: team.totalScore })),
          resultStatus: results.status,
          winner: results.winner,
        };
        return {
          ...summary,
          deterministicHash: stableHash(summary),
        };
      }

      return {
        capture({ summaryId = null } = {}) {
          captured = createSummary(summaryId);
          return structuredClone(captured);
        },
        appendEvent({ eventId = null, type, tick = engine.clock?.frame ?? 0, payload = {} } = {}) {
          const event = { eventId: eventId ?? `replay.event.${events.length + 1}`, type, tick, payload };
          events.push(event);
          return structuredClone(event);
        },
        snapshot() {
          return structuredClone(captured ?? createSummary());
        },
        exportSummary() {
          return JSON.stringify(this.snapshot(), null, 2);
        },
        validate() {
          const first = createSummary();
          const second = createSummary();
          const failures = [];
          if (first.deterministicHash !== second.deterministicHash) failures.push("summary-not-deterministic");
          if (!first.matchId) failures.push("missing-match-id");
          if (!first.frontierConditionSummary?.conditionId) failures.push("missing-replay-frontier-condition-summary");
          if (!first.extractionContestSummary) failures.push("missing-replay-extraction-contest-summary");
          if (!first.finalRushPressureSummary) failures.push("missing-replay-final-rush-pressure-summary");
          if (!first.combatOutcomeSummary) failures.push("missing-replay-combat-outcome-summary");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createMatchState() {
  return {
    version,
    matchId: "match.goldrush.local.001",
    seed: goldRushDefaultRules.seed,
    status: "idle",
    phase: "lobby",
    phaseIndex: 0,
    tick: 0,
    elapsedSeconds: 0,
    players: 2,
    maxPlayers: goldRushDefaultRules.maxPlayers,
    ruleSetId: goldRushDefaultRules.ruleSetId,
    phaseHistory: [{ phase: "lobby", enteredTick: 0, reason: "initial" }],
    endCondition: {
      ended: false,
      reason: null,
      requestedBy: null,
      tick: null,
    },
    lastTickId: null,
  };
}

function validateMatchState(state) {
  const failures = [];
  if (!goldRushPhaseOrder.includes(state.phase)) failures.push("invalid-phase");
  if (state.players < 2 || state.players > goldRushDefaultRules.maxPlayers) failures.push("invalid-player-count");
  if (!Number.isFinite(state.tick) || state.tick < 0) failures.push("invalid-tick");
  if (state.phaseHistory.some((entry) => !goldRushPhaseOrder.includes(entry.phase))) failures.push("invalid-phase-history");
  return { passed: failures.length === 0, failures };
}

function createFinalRushState() {
  return {
    version,
    status: "idle",
    startTick: null,
    warningSeconds: goldRushDefaultRules.warningSeconds,
    collapseSeconds: goldRushDefaultRules.collapseSeconds,
    elapsedSeconds: 0,
    remainingSeconds: goldRushDefaultRules.warningSeconds + goldRushDefaultRules.collapseSeconds,
    collapseStage: 0,
    lockedGoldZoneIds: [],
    commandId: null,
  };
}

function createPendingResult() {
  return {
    version,
    resultId: null,
    status: "pending",
    reason: null,
    frontierConditionSummary: null,
    extractionContestSummary: null,
    combatOutcomeSummary: null,
    matchId: null,
    completedTick: null,
    winner: { kind: "none", id: null, score: 0 },
    placements: [],
    awards: [],
    finalAudioCueId: null,
    finalAnimationCueId: null,
  };
}

function createCombatOutcomeSummary(extractionLoop) {
  const receipts = extractionLoop?.combat?.readability?.receipts ?? extractionLoop?.combat?.receipts ?? [];
  const shotReceipts = receipts.filter((receipt) => receipt.type === "player-shot");
  const hitReceipts = shotReceipts.filter((receipt) => receipt.result === "hit" || receipt.result === "threat-defeated");
  const damageReceipts = receipts.filter((receipt) => receipt.type === "player-damaged");
  const defeatedThreatIds = Array.from(new Set(shotReceipts
    .filter((receipt) => receipt.result === "threat-defeated")
    .map((receipt) => receipt.targetThreatId)
    .filter(Boolean))).sort();
  const laneIds = Array.from(new Set(receipts.map((receipt) => receipt.laneId).filter(Boolean))).sort();
  const telegraphIds = Array.from(new Set(receipts.map((receipt) => receipt.telegraphId).filter(Boolean))).sort();
  const damageTaken = damageReceipts.reduce((sum, receipt) => sum + Math.max(0, receipt.damageApplied ?? 0), 0);
  const baseDamageTaken = damageReceipts.reduce((sum, receipt) => sum + Math.max(0, receipt.baseDamage ?? receipt.damageApplied ?? 0), 0);
  const damageMitigated = damageReceipts.reduce((sum, receipt) => sum + Math.max(0, receipt.damageMitigated ?? 0), 0);
  const coverReceiptCount = receipts.filter((receipt) => receipt.coverId).length;
  const coverIds = Array.from(new Set(receipts.map((receipt) => receipt.coverId).filter(Boolean))).sort();
  const damageDealt = hitReceipts.reduce((sum, receipt) => sum + Math.max(0, receipt.damageApplied ?? 0), 0);
  const latestReceipt = receipts.at(-1) ?? null;
  return {
    contract: "goldrush-combat-outcome-summary-v1",
    receiptCount: receipts.length,
    shotCount: shotReceipts.length,
    hitCount: hitReceipts.length,
    damageReceiptCount: damageReceipts.length,
    damageDealt,
    damageTaken,
    baseDamageTaken,
    damageMitigated,
    coverReceiptCount,
    coverIds,
    threatsDefeated: Number(extractionLoop?.combat?.threatsDefeated ?? defeatedThreatIds.length),
    defeatedThreatIds,
    laneIds,
    telegraphIds,
    lastCombatReceiptId: latestReceipt?.receiptId ?? null,
    lastCombatType: latestReceipt?.type ?? null,
    readableCombat: Boolean(extractionLoop?.combat?.readability?.contract === "readable-threat-lanes-v1"),
  };
}

function createCombatReplayMoments(extractionLoop) {
  const receipts = extractionLoop?.combat?.readability?.receipts ?? extractionLoop?.combat?.receipts ?? [];
  return receipts.map((receipt) => ({
    tick: receipt.tick,
    type: receipt.type === "player-damaged" ? "combatDamageTaken" : "combatPressureResolved",
    receiptId: receipt.receiptId,
    threatId: receipt.targetThreatId ?? receipt.sourceThreatId ?? null,
    result: receipt.result ?? null,
    damageApplied: receipt.damageApplied ?? 0,
    baseDamage: receipt.baseDamage ?? receipt.damageApplied ?? 0,
    damageMitigated: receipt.damageMitigated ?? 0,
    coverId: receipt.coverId ?? null,
    telegraphId: receipt.telegraphId ?? null,
    laneId: receipt.laneId ?? null,
    counterplay: receipt.counterplay ?? null,
  }));
}

function createExtractionContestSummary(extractions) {
  const accepted = (extractions?.receipts ?? []).filter((receipt) => receipt.status === "accepted");
  const contestReceipts = accepted.filter((receipt) => receipt.extractionSiteContest?.status);
  const statuses = contestReceipts.map((receipt) => receipt.extractionSiteContest.status);
  const calledThreatIds = Array.from(new Set(contestReceipts.flatMap((receipt) => receipt.extractionSiteContest.calledThreatIds ?? []))).sort();
  const highestPressure = contestReceipts.reduce((max, receipt) => Math.max(max, receipt.extractionSiteContest.pressure ?? 0), 0);
  const lockdownReceipt = contestReceipts.find((receipt) => receipt.extractionSiteContest.status === "lockdown");
  const firstContest = contestReceipts[0]?.extractionSiteContest ?? null;
  return {
    contestedCount: statuses.filter((status) => status === "contested" || status === "lockdown").length,
    lockdownCount: statuses.filter((status) => status === "lockdown").length,
    watchedCount: statuses.filter((status) => status === "watched").length,
    calledThreatIds,
    highestPressure: Number(highestPressure.toFixed(3)),
    mostSevereStatus: lockdownReceipt ? "lockdown" : statuses.includes("contested") ? "contested" : statuses.includes("watched") ? "watched" : null,
    primarySiteId: lockdownReceipt?.extractionSiteContest?.siteId ?? firstContest?.siteId ?? null,
    primaryCue: lockdownReceipt?.extractionSiteContest?.cue ?? firstContest?.cue ?? null,
    contestReceiptIds: contestReceipts.map((receipt) => receipt.receiptId),
  };
}

function createFinalRushPressureSummary(extractions) {
  const accepted = (extractions?.receipts ?? []).filter((receipt) => receipt.status === "accepted");
  const pressureReceipts = accepted.filter((receipt) => {
    return Number(receipt.pressureScalar ?? 0) > 0
      || Number(receipt.multiplier ?? 1) > 1
      || receipt.extractionSiteContest?.finalRushPressure?.active === true;
  });
  const pressureValues = pressureReceipts.map((receipt) => Number(receipt.pressureScalar ?? 0));
  const highestPressureReceipt = pressureReceipts
    .slice()
    .sort((a, b) => Number(b.pressureScalar ?? 0) - Number(a.pressureScalar ?? 0))[0] ?? null;
  const averagePressure = pressureValues.length
    ? pressureValues.reduce((sum, value) => sum + value, 0) / pressureValues.length
    : 0;
  const maxMultiplier = pressureReceipts.reduce((max, receipt) => Math.max(max, Number(receipt.multiplier ?? 1)), 1);
  const pressuredGoldZoneIds = Array.from(new Set(pressureReceipts.map((receipt) => receipt.goldZoneId).filter(Boolean))).sort();
  const zoneStatuses = Array.from(new Set(pressureReceipts.map((receipt) => {
    return receipt.extractionSiteContest?.finalRushPressure?.zoneStatus ?? null;
  }).filter(Boolean))).sort();
  return {
    contract: "goldrush-final-rush-result-summary-v1",
    pressureLinkedReceiptCount: pressureReceipts.length,
    acceptedExtractionCount: accepted.length,
    highestPressure: Number(Math.max(0, ...pressureValues).toFixed(3)),
    averagePressure: Number(averagePressure.toFixed(3)),
    maxMultiplier: Number(maxMultiplier.toFixed(3)),
    pressuredGoldZoneIds,
    primaryGoldZoneId: highestPressureReceipt?.goldZoneId ?? pressuredGoldZoneIds[0] ?? null,
    primaryRoomWindowId: highestPressureReceipt?.roomWindowId ?? null,
    zoneStatuses,
    readout: pressureReceipts.length
      ? `${formatResultEntityLabel(pressuredGoldZoneIds[0] ?? "gold zone")} paid ${Number(maxMultiplier.toFixed(2))}x under collapse pressure`
      : "No collapse pressure affected extraction score",
  };
}

function formatResultEntityLabel(value = "") {
  return String(value ?? "")
    .replace(/^gold\.zone\./, "")
    .replace(/^room-window-/, "")
    .split(/[-_.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Gold Zone";
}

function createResultFrontierConditionSummary({ frontierConditions, frontierConditionEffects, extractions }) {
  const accepted = (extractions?.receipts ?? []).filter((receipt) => receipt.status === "accepted");
  const conditionLinkedReceipts = accepted.filter((receipt) => receipt.frontierCondition?.conditionId);
  const receiptConditionIds = Array.from(new Set(conditionLinkedReceipts.map((receipt) => receipt.frontierCondition.conditionId)));
  const active = frontierConditions?.active ?? null;
  const effects = frontierConditionEffects ?? null;

  return {
    conditionId: active?.id ?? effects?.conditionId ?? receiptConditionIds[0] ?? null,
    label: active?.label ?? effects?.label ?? conditionLinkedReceipts[0]?.frontierCondition?.label ?? null,
    family: active?.family ?? effects?.family ?? null,
    playerRead: active?.playerRead ?? effects?.playerRead ?? null,
    extractionRisk: effects?.extraction?.riskScalar ?? conditionLinkedReceipts[0]?.frontierCondition?.extractionRisk ?? null,
    cashoutValueScalar: effects?.extraction?.cashoutValueScalar ?? conditionLinkedReceipts[0]?.frontierCondition?.cashoutValueScalar ?? null,
    miningPayoutScalar: effects?.mining?.payoutScalar ?? conditionLinkedReceipts[0]?.frontierCondition?.miningPayoutScalar ?? null,
    combatPressureScalar: effects?.combat?.pressureScalar ?? conditionLinkedReceipts[0]?.frontierCondition?.combatPressureScalar ?? null,
    audioAmbience: effects?.audio?.ambience ?? null,
    renderLighting: effects?.render?.lightingKey ?? null,
    receiptConditionIds,
    conditionLinkedReceiptCount: conditionLinkedReceipts.length,
    acceptedExtractionCount: accepted.length,
  };
}
