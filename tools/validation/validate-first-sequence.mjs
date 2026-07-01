import {
  createGoldRushFirstSequenceController,
  validateFirstSequenceSnapshot,
} from "../../src/scenes/goldRushFirstSequence.js";
import {
  collectTrainTransitionCueShots,
  trainTransitionAudioContract,
} from "../../src/audio/goldRushAudioManager.js";

const sequence = createGoldRushFirstSequenceController();
const failures = [];
const frontierConditionBriefing = {
  conditionId: "goldrush.condition.high-fever-seam",
  label: "High Fever Seam",
  playerRead: "One seam is unusually valuable and turns the field into a moving contest.",
  goldYield: 1.5,
  extractionRisk: 1.55,
  routeCue: "rich-seam-markers",
};

expect(sequence.startTitle().phase === "title", "title-start-failed");
const lobby = sequence.enterLobby({ groupType: "crew", modeId: "classicSolo", frontierConditionBriefing });
expect(lobby.phase === "lobby", "lobby-enter-failed");
expect(lobby.frontierConditionBriefing.conditionId === frontierConditionBriefing.conditionId, "lobby-briefing-missing");

sequence.startLoading({
  payload: {
    players: 20,
    groupType: "outfit",
    legacyModeId: "modernExtraction",
    localPlayerId: "player-1",
    partyLeaderId: "player-1",
    partyMembers: [
      { id: "player-1", label: "Prospector", role: "Leader" },
      { id: "player-2", label: "Trail Scout", role: "Member" },
      { id: "player-3", label: "Claim Guard", role: "Member" },
    ],
    frontierConditionBriefing,
  },
  now: 1000,
});
let loading = sequence.updateLoading({ now: 2000, canBoardTrain: false });
expect(loading.phase === "train-approaching", "approach-phase-failed");
expect(loading.trainReadout.currentBeat === "train-arrival", "train-readout-arrival-beat-missing");
let trainCueShots = collectTrainTransitionCueShots(loading.trainReadout);
expect(trainCueShots.length === 1, "train-audio-arrival-cue-missing");
expect(trainCueShots[0].fallbackPattern === "train-arrival", "train-audio-arrival-fallback-missing");
expect(!loading.playerLockedToTrain, "player-locked-too-early");
expect(loading.frontierConditionBriefing.conditionId === frontierConditionBriefing.conditionId, "loading-briefing-missing");
expect(loading.boardingStatus.contract === "goldrush-train-boarding-v1", "boarding-contract-missing");
expect(loading.boardingStatus.expectedCount === 3, "boarding-party-count-missing");
expect(loading.boardingStatus.missingPlayerIds.length === 3, "boarding-manifest-should-wait-for-party");

loading = sequence.updateLoading({ now: 4000, canBoardTrain: false });
expect(loading.phase === "door-opening", "door-opening-phase-failed");
expect(loading.trainReadout.currentBeat === "door-opening", "train-readout-door-beat-missing");
trainCueShots = collectTrainTransitionCueShots(loading.trainReadout);
expect(trainCueShots.length === 1, "train-audio-door-cue-missing");
expect(trainCueShots[0].fallbackPattern === "train-door", "train-audio-door-fallback-missing");

loading = sequence.updateLoading({ now: 4800, canBoardTrain: false });
expect(loading.phase === "boarding-open", "boarding-open-phase-failed");
expect(!loading.playerLockedToTrain, "player-locked-before-boarding-zone");
expect(loading.boardingStatus.openedAt === 4800, "boarding-open-receipt-time-missing");
expect(!loading.boardingStatus.localBoarded, "local-boarded-too-early");
expect(loading.trainReadout.contract === "goldrush-train-sequence-readout-v1", "train-readout-contract-missing");
expect(loading.trainReadout.sequenceId?.startsWith("train-sequence-"), "train-readout-sequence-id-missing");
expect(loading.trainReadout.currentBeat === "player-boarding", "train-readout-boarding-beat-missing");
expect(loading.trainReadout.nextPlayerAction === "board-train", "train-readout-board-action-missing");
expect(loading.trainReadout.boardingCueVisible, "train-readout-boarding-cue-should-be-visible");
trainCueShots = collectTrainTransitionCueShots(loading.trainReadout);
expect(trainCueShots.length === 1, "train-audio-boarding-cue-missing");
expect(trainCueShots[0].contract === trainTransitionAudioContract, "train-audio-contract-missing");
expect(trainCueShots[0].trainBeat === "player-boarding", "train-audio-boarding-beat-missing");
expect(trainCueShots[0].fallbackPattern === "train-board", "train-audio-boarding-fallback-missing");
expect(trainCueShots[0].dedupeId.includes(loading.trainReadout.sequenceId), "train-audio-dedupe-should-include-sequence-id");

loading = sequence.updateLoading({ now: 4900, canBoardTrain: true, playerId: "player-1" });
expect(loading.phase === "boarding-syncing", "peer-sync-phase-failed");
expect(loading.playerLockedToTrain, "player-not-locked-to-train");
expect(loading.lockedThisFrame, "missing-locked-this-frame");
expect(loading.trainReadout.currentBeat === "party-readiness-sync", "train-readout-party-sync-beat-missing");
expect(loading.trainReadout.cameraDirective === "follow-train", "train-readout-lock-should-follow-train");
trainCueShots = collectTrainTransitionCueShots(loading.trainReadout);
expect(trainCueShots[0]?.trainBeat === "party-readiness-sync", "train-audio-party-sync-beat-missing");
expect(trainCueShots[0]?.fallbackPattern === "train-wait", "train-audio-party-sync-fallback-missing");
expect(loading.boardingStatus.localBoarded, "local-boarding-status-missing");
expect(loading.boardingStatus.allReady, "party-boarding-ready-missing");
expect(loading.boardingStatus.boardedCount === 3, "party-boarded-count-missing");
expect(loading.boardingStatus.autoBoardedCount === 2, "party-auto-follow-count-missing");
expect(loading.boardingStatus.missingPlayerIds.length === 0, "party-boarding-still-missing-members");
expect(loading.peerHandoffGate.contract === "goldrush-peer-handoff-gate-v1", "peer-handoff-gate-missing");
expect(loading.peerHandoffGate.required, "peer-handoff-gate-should-be-required");
expect(!loading.peerHandoffGate.ready, "peer-handoff-gate-ready-too-early");
expect(receiptTypes(loading).includes("player-boarded-train"), "player-boarded-receipt-missing");
expect(receiptTypes(loading).includes("party-member-auto-boarded"), "party-auto-boarded-receipt-missing");
expect(receiptTypes(loading).includes("train-party-boarding-ready"), "party-ready-receipt-missing");

loading = sequence.updateLoading({
  now: 5000,
  canBoardTrain: true,
  playerId: "player-1",
  peerBoardingSync: {
    contract: "goldrush-peer-party-boarding-sync-v1",
    expectedCount: 3,
    readyCount: 3,
    allReady: true,
    missingMemberIds: [],
  },
});
expect(loading.phase === "train-departing", "departing-phase-failed");
expect(loading.peerHandoffGate.ready, "peer-handoff-gate-not-ready");
expect(loading.trainReadout.currentBeat === "train-departure", "train-readout-departure-beat-missing");
expect(loading.trainReadout.nextPlayerAction === "ride-train", "train-readout-ride-action-missing");
trainCueShots = collectTrainTransitionCueShots(loading.trainReadout);
expect(trainCueShots[0]?.trainBeat === "train-departure", "train-audio-departure-beat-missing");
expect(trainCueShots[0]?.fallbackPattern === "train-depart", "train-audio-departure-fallback-missing");
expect(receiptTypes(loading).includes("train-departure-started"), "train-departure-started-receipt-missing");

loading = sequence.updateLoading({
  now: 8400,
  canBoardTrain: true,
  playerId: "player-1",
  peerBoardingSync: {
    contract: "goldrush-peer-party-boarding-sync-v1",
    expectedCount: 3,
    readyCount: 3,
    allReady: true,
    missingMemberIds: [],
  },
});
expect(loading.phase === "handoff-ready", "handoff-ready-phase-failed");
expect(loading.departureProgress === 1, "departure-should-complete");

const payload = sequence.consumeHandoffPayload();
expect(payload?.players === 20, "handoff-payload-missing");
expect(sequence.consumeHandoffPayload() === null, "handoff-payload-consumed-twice");

const run = sequence.enterRun({ players: 20, modeId: "modernExtraction" });
expect(run.phase === "gold-field-runtime", "run-phase-failed");
expect(run.validation.passed, "run-validation-failed");
expect(validateFirstSequenceSnapshot(run).passed, "exported-validator-failed");

const disconnectSequence = createGoldRushFirstSequenceController();
disconnectSequence.enterLobby({ groupType: "crew", modeId: "modernExtraction", frontierConditionBriefing });
disconnectSequence.startLoading({
  payload: {
    players: 20,
    groupType: "crew",
    legacyModeId: "modernExtraction",
    localPlayerId: "player-1",
    partyLeaderId: "player-1",
    partyMembers: [
      { id: "player-1", label: "Prospector", role: "Leader" },
      { id: "player-2", label: "Trail Scout", role: "Member" },
    ],
    frontierConditionBriefing,
  },
  now: 1000,
});
let disconnectLoading = disconnectSequence.updateLoading({ now: 4900, canBoardTrain: true, playerId: "player-1" });
expect(disconnectLoading.phase === "boarding-syncing", "disconnect-case-should-wait-for-peer");
expect(disconnectLoading.peerHandoffGate.required, "disconnect-case-peer-gate-should-start-required");
expect(!disconnectLoading.peerHandoffGate.ready, "disconnect-case-peer-gate-ready-too-early");
disconnectLoading = disconnectSequence.updateLoading({
  now: 5100,
  canBoardTrain: true,
  playerId: "player-1",
  peerBoardingSync: {
    contract: "goldrush-peer-party-boarding-sync-v1",
    expectedCount: 1,
    readyCount: 1,
    allReady: true,
    missingMemberIds: [],
    disconnects: [
      {
        memberId: "player-2",
        reason: "peer-connection-closed",
        policy: "reduce-roster-require-remaining",
      },
    ],
  },
});
expect(disconnectLoading.phase === "train-departing", "disconnect-case-remaining-roster-should-depart");
expect(!disconnectLoading.peerHandoffGate.required, "disconnect-case-peer-gate-should-become-local-after-roster-reduction");
expect(disconnectLoading.peerHandoffGate.ready, "disconnect-case-peer-gate-should-release");

if (failures.length > 0) {
  throw new Error(`first sequence invalid: ${failures.join(", ")}`);
}

console.log(JSON.stringify({
  status: "first-sequence-ready",
  finalPhase: run.phase,
  receipts: run.receipts.length,
  validation: run.validation,
}, null, 2));

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function receiptTypes(snapshot) {
  return snapshot.receipts.map((receipt) => receipt.type);
}
