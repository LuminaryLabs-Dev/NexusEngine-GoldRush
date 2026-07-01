import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });

runtime.generateMatch({ players: 72, phase: "prospect" });
runtime.engine.n.goldrushFrontierConditions.setCondition({
  conditionId: "goldrush.condition.high-fever-seam",
  reason: "match-lifecycle-validator",
});
let state = runtime.snapshot();
assert(state.match.status === "running", "match should start running");
assert(state.network.partitions.length === 2, "72 players should produce two internal network partitions");
assert(state.match.players === 72, "match lifecycle should track player count");

const backward = runtime.engine.n.goldrushMatch.advancePhase({ phase: "lobby", reason: "validator.backward" });
assert(backward.accepted === false, "match lifecycle should reject backward phase movement");

runtime.startFinalRush();
state = runtime.snapshot();
assert(state.finalRush.status === "collapsing", "final rush should enter collapsing state after deterministic tick");
assert(state.finalRush.pressureScalar > 0 && state.finalRush.pressureScalar <= 1, "collapse pressure should be monotonic and clamped");
const armedAgain = runtime.engine.n.goldrushFinalRush.arm({ commandId: "validator.duplicate-arm" });
assert(armedAgain.accepted === false, "final rush should arm only once");

const duplicateReceiptId = "extract.validator.duplicate";
const frontierConditionEffects = runtime.engine.n.goldrushFrontierConditions.effects();
const extractionSiteContest = {
  siteId: "rail-depot-extract-01",
  status: "lockdown",
  pressure: 0.921,
  conditionId: frontierConditionEffects.conditionId,
  riskScalar: frontierConditionEffects.extraction.riskScalar,
  signal: frontierConditionEffects.extraction.signal,
  cue: "cashout-bell-and-smoke",
  noiseRadius: 34.875,
  threatRadius: 28.8,
  interruptRisk: 0.443,
  calledThreatIds: ["claim-jumper-01"],
};
runtime.engine.n.goldrushExtractionReceipts.recordExtraction({
  receiptId: duplicateReceiptId,
  playerId: "player-1",
  teamId: "team-01",
  goldAmount: 10,
  cargoValue: 5,
  cashoutId: "cashout.validator",
  goldZoneId: state.goldZones[0].goldZoneId,
  roomWindowId: state.goldZones[0].patchWindowIds[0],
  tick: 20,
  extractionSiteContest,
  frontierCondition: {
    conditionId: frontierConditionEffects.conditionId,
    label: frontierConditionEffects.label,
    extractionRisk: frontierConditionEffects.extraction.riskScalar,
    cashoutValueScalar: frontierConditionEffects.extraction.cashoutValueScalar,
    miningPayoutScalar: frontierConditionEffects.mining.payoutScalar,
    combatPressureScalar: frontierConditionEffects.combat.pressureScalar,
  },
});
runtime.engine.n.goldrushExtractionReceipts.recordExtraction({
  receiptId: duplicateReceiptId,
  playerId: "player-1",
  teamId: "team-01",
  goldAmount: 10,
  cargoValue: 5,
  cashoutId: "cashout.validator",
  goldZoneId: state.goldZones[0].goldZoneId,
  roomWindowId: state.goldZones[0].patchWindowIds[0],
  tick: 21,
});
state = runtime.snapshot();
assert(state.extractionReceipts.totals.acceptedCount === 1, "duplicate extraction should not add accepted totals");
assert(state.extractionReceipts.totals.duplicateCount === 1, "duplicate extraction should be tracked");

runtime.engine.n.goldrushScoring.applyExtractionReceipt(duplicateReceiptId);
const duplicateScore = runtime.engine.n.goldrushScoring.applyExtractionReceipt(duplicateReceiptId);
assert(duplicateScore.accepted === false, "scoring should apply extraction receipt once");

runtime.requestHandoff({ playerIds: ["player-1", "player-2"] });
const duplicateHandoffId = "handoff.validator.duplicate";
const gate = state.loadingGates.gates[0];
runtime.engine.n.goldrushRoomHandoffReceipts.recordHandoff({
  handoffId: duplicateHandoffId,
  gateId: gate.id,
  playerIds: ["player-1"],
  fromRoomWindowId: gate.fromRoomWindowId,
  toRoomWindowId: gate.toRoomWindowId,
  triggerPathId: gate.triggerPathId,
  transitionId: gate.transitionId,
  tick: 30,
});
runtime.engine.n.goldrushRoomHandoffReceipts.recordHandoff({
  handoffId: duplicateHandoffId,
  gateId: gate.id,
  playerIds: ["player-1"],
  fromRoomWindowId: gate.fromRoomWindowId,
  toRoomWindowId: gate.toRoomWindowId,
  triggerPathId: gate.triggerPathId,
  transitionId: gate.transitionId,
  tick: 31,
});
state = runtime.snapshot();
assert(state.handoffReceipts.appliedHandoffIds.length === 2, "duplicate handoff should not add accepted totals");
assert(state.handoffReceipts.receipts.some((receipt) => receipt.status === "duplicate"), "duplicate handoff should be tracked");

runtime.endMatch({ reason: "collapseComplete" });
state = runtime.snapshot();
assert(state.results.status === "final", "results should finalize once");
const duplicateResult = runtime.engine.n.goldrushResults.finalize({ reason: "manual" });
assert(duplicateResult.accepted === false, "results should not finalize twice");
assert(state.results.winner.id === "team-01", "result should include winner");
assert(state.results.placements.length >= 1, "result should include placements");
assert(state.results.frontierConditionSummary.conditionId === "goldrush.condition.high-fever-seam", "result should include active frontier condition summary");
assert(state.results.frontierConditionSummary.conditionLinkedReceiptCount === 1, "result should count condition-linked extraction receipts");
assert(state.results.extractionContestSummary.lockdownCount === 1, "result should count lockdown extraction contests");
assert(state.results.extractionContestSummary.calledThreatIds.includes("claim-jumper-01"), "result should summarize called contest threats");
assert(state.results.finalRushPressureSummary.contract === "goldrush-final-rush-result-summary-v1", "result should expose final rush pressure summary");
assert(state.results.finalRushPressureSummary.pressureLinkedReceiptCount === 1, "result should count final-rush-linked extraction receipts");
assert(state.results.finalRushPressureSummary.highestPressure > 0, "result should summarize highest final rush pressure");
assert(state.results.finalRushPressureSummary.maxMultiplier > 1, "result should summarize final rush extraction multiplier");
assert(state.results.finalRushPressureSummary.pressuredGoldZoneIds.includes(state.goldZones[0].goldZoneId), "result should preserve pressured gold zone id");
assert(!state.results.finalRushPressureSummary.readout.includes("gold.zone."), "result final-rush readout should be player-facing");
assert(state.results.combatOutcomeSummary.contract === "goldrush-combat-outcome-summary-v1", "result should expose combat outcome summary");
assert(state.results.awards.some((award) => award.id === "award.lockdown-extractor"), "result should include lockdown extraction award");
assert(state.results.awards.some((award) => award.id === "award.collapse-cashout"), "result should include collapse cashout award");
assert(state.results.awards.some((award) => award.id === "award.frontier-condition-mastered"), "result should include frontier condition award");
assert(state.replaySummary.frontierConditionSummary.conditionId === "goldrush.condition.high-fever-seam", "replay summary should include active frontier condition summary");
assert(state.replaySummary.extractionContestSummary.lockdownCount === 1, "replay summary should count lockdown extraction contests");
assert(state.replaySummary.finalRushPressureSummary.pressureLinkedReceiptCount === 1, "replay summary should count final rush pressure receipts");
assert(state.replaySummary.combatOutcomeSummary.contract === "goldrush-combat-outcome-summary-v1", "replay summary should expose combat outcome summary");
assert(state.replaySummary.keyMoments.some((moment) => moment.contestStatus === "lockdown" && moment.calledThreatIds.includes("claim-jumper-01") && moment.finalRushPressure > 0), "replay key moments should preserve contest and final rush context");
assert(state.replaySummary.deterministicHash === runtime.engine.n.goldrushReplaySummary.snapshot().deterministicHash, "replay summary should be deterministic");

for (const api of [
  "goldrushMatch",
  "goldrushFinalRush",
  "goldrushExtractionReceipts",
  "goldrushRoomHandoffReceipts",
  "goldrushScoring",
  "goldrushResults",
  "goldrushReplaySummary",
]) {
  const validation = runtime.engine.n[api].validate();
  assert(validation.passed, `${api} should validate: ${validation.failures.join(", ")}`);
}

console.log("match lifecycle passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
