import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createRoomOrchestrator } from "../../src/rooms/roomOrchestrator.js";

const runtime = createGoldRushRuntime({ orchestrator: createRoomOrchestrator() });

runtime.generateMatch({ players: 72, phase: "prospect" });
let state = runtime.snapshot();
assert(state.match.status === "running", "match should start running");
assert(state.rooms.shards.length === 2, "72 players should produce two room shards");
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
