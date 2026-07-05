import { resolveTrainDepartureHandoffState } from "../kits/v0.0.2/goldrush/train-departure-handoff/index.js";

export const defaultFirstSequenceTimings = {
  approachMs: 2800,
  doorMs: 900,
  departMs: 3300,
  boardingAutoFollowMs: 0,
  boardingTimeoutMs: 2500,
};

export function createGoldRushFirstSequenceController({ timings = defaultFirstSequenceTimings } = {}) {
  const receipts = [];
  let state = createInitialState({ timings });

  function startTitle() {
    state = {
      ...state,
      screen: "start",
      phase: "title",
    };
    pushReceipt("title-ready", { screen: "start" });
    return snapshot();
  }

  function enterLobby({ groupType = "outfit", modeId = "modernExtraction", frontierConditionBriefing = null } = {}) {
    state = {
      ...state,
      screen: "lobby",
      phase: "lobby",
      selectedGroupType: groupType,
      selectedModeId: modeId,
      frontierConditionBriefing: structuredClone(frontierConditionBriefing),
    };
    pushReceipt("lobby-ready", { groupType, modeId, frontierConditionId: frontierConditionBriefing?.conditionId ?? null });
    return snapshot();
  }

  function startLoading({ payload = {}, now = 0 } = {}) {
    const frontierConditionBriefing = payload.frontierConditionBriefing ?? state.frontierConditionBriefing ?? null;
    const boardingManifest = createBoardingManifest({
      payload,
      timingDefaults: timings,
    });
    const boardingStatus = summarizeBoardingManifest(boardingManifest);
    state = {
      ...state,
      sequenceId: `train-sequence-${String(receipts.length + 1).padStart(4, "0")}`,
      screen: "loading",
      phase: "train-approaching",
      loadingStartedAt: now,
      departureStartedAt: null,
      playerLockedToTrain: false,
      handoffConsumed: false,
      handoffReadyReceiptWritten: false,
      pendingMatchPayload: structuredClone(payload),
      frontierConditionBriefing: structuredClone(frontierConditionBriefing),
      approachProgress: 0,
      doorProgress: 0,
      departureProgress: 0,
      boardingManifest,
      boardingStatus,
      peerHandoffGate: summarizePeerHandoffGate({ boardingManifest, boardingStatus, peerBoardingSync: null }),
    };
    pushReceipt("loading-started", { payload, frontierConditionId: frontierConditionBriefing?.conditionId ?? null });
    return snapshot();
  }

  function updateLoading({
    now = 0,
    canBoardTrain = false,
    playerId = state.boardingManifest?.localPlayerId ?? "player-1",
    peerBoardingSync = null,
  } = {}) {
    if (state.screen !== "loading") return snapshot();
    const elapsed = Math.max(0, now - state.loadingStartedAt);
    const approachProgress = clamp01(elapsed / timings.approachMs);
    const doorProgress = approachProgress >= 1
      ? clamp01((elapsed - timings.approachMs) / timings.doorMs)
      : 0;
    let lockedThisFrame = false;
    let departureStartedAt = state.departureStartedAt;
    let playerLockedToTrain = state.playerLockedToTrain;
    const boardingManifest = structuredClone(state.boardingManifest ?? createBoardingManifest({
      payload: state.pendingMatchPayload ?? {},
      timingDefaults: timings,
    }));

    if (doorProgress >= 1 && boardingManifest.openedAt === null) {
      boardingManifest.openedAt = now;
      pushReceipt("train-boarding-open", {
        openedAt: now,
        expectedCount: boardingManifest.seats.length,
      });
    }

    if (doorProgress >= 1 && canBoardTrain) {
      const boarded = markBoarded({
        manifest: boardingManifest,
        playerId,
        now,
        status: "boarded",
      });
      if (boarded) {
        pushReceipt("player-boarded-train", {
          playerId,
          boardedAt: now,
          seatIndex: boarded.seatIndex,
        });
      }
    }

    const localSeat = boardingManifest.seats.find((seat) => seat.playerId === boardingManifest.localPlayerId);
    const localBoarded = Boolean(localSeat && isSeatReady(localSeat));
    const localBoardedAt = Number.isFinite(localSeat?.boardedAt) ? localSeat.boardedAt : now;
    const canAutoFollowParty = localBoarded
      && boardingManifest.openedAt !== null
      && now - localBoardedAt >= boardingManifest.autoFollowMs;
    if (canAutoFollowParty) {
      boardingManifest.seats.forEach((seat) => {
        if (seat.playerId === boardingManifest.localPlayerId || isSeatReady(seat)) return;
        seat.status = "auto-boarded";
        seat.boardedAt = now;
        seat.autoReason = "local-player-boarded-train";
        pushReceipt("party-member-auto-boarded", {
          playerId: seat.playerId,
          boardedAt: now,
          seatIndex: seat.seatIndex,
          reason: seat.autoReason,
        });
      });
    }

    const boardingStatus = summarizeBoardingManifest(boardingManifest);
    if (boardingStatus.allReady && boardingManifest.readyAt === null) {
      boardingManifest.readyAt = now;
      boardingStatus.readyAt = now;
      pushReceipt("train-party-boarding-ready", {
        readyAt: now,
        expectedCount: boardingStatus.expectedCount,
        boardedCount: boardingStatus.boardedCount,
        autoBoardedCount: boardingStatus.autoBoardedCount,
      });
    }

    const peerHandoffGate = summarizePeerHandoffGate({ boardingManifest, boardingStatus, peerBoardingSync });

    if (!playerLockedToTrain && boardingStatus.localBoarded && boardingStatus.allReady) {
      playerLockedToTrain = true;
      lockedThisFrame = true;
    }

    if (playerLockedToTrain && departureStartedAt === null && peerHandoffGate.ready) {
      departureStartedAt = now;
      pushReceipt("train-departure-started", {
        departureStartedAt: now,
        peerGateRequired: peerHandoffGate.required,
        peerReadyCount: peerHandoffGate.readyCount,
        peerExpectedCount: peerHandoffGate.expectedCount,
      });
    }

    const departureProgress = departureStartedAt !== null
      ? clamp01((now - departureStartedAt) / timings.departMs)
      : 0;
    const trainDepartureHandoff = resolveTrainDepartureHandoffState({
      boardingStatus,
      peerHandoffGate,
      departureStartedAt,
      departureProgress,
      playerLockedToTrain,
    });
    const phase = approachProgress < 1
      ? "train-approaching"
      : doorProgress < 1
        ? "door-opening"
        : trainDepartureHandoff.phase;

    state = {
      ...state,
      phase,
      departureStartedAt,
      playerLockedToTrain,
      approachProgress,
      doorProgress,
      departureProgress,
      lockedThisFrame,
      boardingManifest,
      boardingStatus,
      peerHandoffGate,
      trainDepartureHandoff,
    };
    if (phase === "handoff-ready" && !state.handoffReadyReceiptWritten) {
      state = { ...state, handoffReadyReceiptWritten: true };
      pushReceipt("train-handoff-ready", { departureProgress });
    }
    return snapshot();
  }

  function consumeHandoffPayload() {
    if (state.phase !== "handoff-ready" || state.handoffConsumed) return null;
    state = {
      ...state,
      handoffConsumed: true,
    };
    pushReceipt("train-handoff-consumed", { payload: state.pendingMatchPayload });
    return structuredClone(state.pendingMatchPayload);
  }

  function enterRun({ players = 20, modeId = "modernExtraction" } = {}) {
    state = {
      ...state,
      screen: "run",
      phase: "gold-field-runtime",
      playerLockedToTrain: false,
      activePlayers: players,
      selectedModeId: modeId,
    };
    pushReceipt("run-started", { players, modeId });
    return snapshot();
  }

  function snapshot() {
    return structuredClone({
      ...state,
      trainReadout: createTrainReadout(state),
      receipts: receipts.slice(-20),
      validation: validateFirstSequenceSnapshot(state),
    });
  }

  function pushReceipt(type, payload = {}) {
    receipts.push({
      id: `first-sequence.${String(receipts.length + 1).padStart(4, "0")}`,
      type,
      payload: structuredClone(payload),
    });
  }

  return {
    startTitle,
    enterLobby,
    startLoading,
    updateLoading,
    consumeHandoffPayload,
    enterRun,
    snapshot,
  };
}

export function validateFirstSequenceSnapshot(snapshot) {
  const failures = [];
  if (!["start", "lobby", "loading", "run"].includes(snapshot.screen)) failures.push("invalid-screen");
  if (!snapshot.phase) failures.push("missing-phase");
  if ((snapshot.screen === "lobby" || snapshot.screen === "loading") && !snapshot.frontierConditionBriefing?.conditionId) {
    failures.push("missing-frontier-condition-briefing");
  }
  if (!Number.isFinite(snapshot.timings?.approachMs)) failures.push("missing-approach-timing");
  if (!Number.isFinite(snapshot.timings?.doorMs)) failures.push("missing-door-timing");
  if (!Number.isFinite(snapshot.timings?.departMs)) failures.push("missing-depart-timing");
  if (snapshot.screen === "loading") {
    if (snapshot.boardingStatus?.contract !== "goldrush-train-boarding-v1") failures.push("missing-boarding-contract");
    if (snapshot.peerHandoffGate?.contract !== "goldrush-peer-handoff-gate-v1") failures.push("missing-peer-handoff-gate");
    if (snapshot.trainDepartureHandoff?.contract !== "goldrush-train-departure-handoff-v1") failures.push("missing-train-departure-handoff");
    if (snapshot.approachProgress < 0 || snapshot.approachProgress > 1) failures.push("invalid-approach-progress");
    if (snapshot.doorProgress < 0 || snapshot.doorProgress > 1) failures.push("invalid-door-progress");
    if (snapshot.departureProgress < 0 || snapshot.departureProgress > 1) failures.push("invalid-departure-progress");
    if (snapshot.phase === "train-departing" && !snapshot.playerLockedToTrain) failures.push("departing-without-player-lock");
    if ((snapshot.phase === "train-departing" || snapshot.phase === "handoff-ready") && !snapshot.boardingStatus?.localBoarded) failures.push("departing-without-local-boarding");
    if ((snapshot.phase === "train-departing" || snapshot.phase === "handoff-ready") && !snapshot.boardingStatus?.allReady) failures.push("departing-before-party-ready");
    if ((snapshot.phase === "train-departing" || snapshot.phase === "handoff-ready") && !snapshot.peerHandoffGate?.ready) failures.push("departing-before-peer-readiness");
    if (snapshot.phase === "boarding-syncing" && !snapshot.playerLockedToTrain) failures.push("syncing-without-player-lock");
    if (snapshot.phase === "handoff-ready" && snapshot.departureProgress < 1) failures.push("handoff-before-departure-complete");
    const readout = createTrainReadout(snapshot);
    if (readout.contract !== "goldrush-train-sequence-readout-v1") failures.push("missing-train-sequence-readout");
    if (!readout.sequenceId) failures.push("missing-train-readout-sequence-id");
    if (!readout.currentBeat) failures.push("missing-train-readout-beat");
    if (!readout.playerCue) failures.push("missing-train-player-cue");
    if (snapshot.phase === "boarding-open" && readout.nextPlayerAction !== "board-train") failures.push("boarding-open-needs-board-action");
    if (snapshot.phase === "boarding-syncing" && readout.nextPlayerAction !== "wait-for-party") failures.push("boarding-syncing-needs-party-wait-action");
    if (snapshot.phase === "train-departing" && readout.cameraDirective !== "follow-train") failures.push("departing-needs-train-follow-camera");
  }
  return {
    passed: failures.length === 0,
    failures,
  };
}

function createTrainReadout(snapshot) {
  const phase = snapshot.phase ?? "title";
  const approachComplete = Number(snapshot.approachProgress ?? 0) >= 1;
  const doorOpen = Number(snapshot.doorProgress ?? 0) >= 1;
  const departing = phase === "train-departing" || phase === "handoff-ready";
  const partyStatus = snapshot.boardingStatus ?? null;
  const peerGate = snapshot.peerHandoffGate ?? null;
  const handoff = snapshot.trainDepartureHandoff ?? null;
  const currentBeat = phase === "train-approaching"
    ? "train-arrival"
    : phase === "door-opening"
      ? "door-opening"
      : phase === "boarding-open"
        ? "player-boarding"
        : phase === "boarding-syncing"
          ? "party-readiness-sync"
          : departing
            ? "train-departure"
            : phase;
  const nextPlayerAction = phase === "train-approaching"
    ? "watch-train-arrive"
    : phase === "door-opening"
      ? "wait-for-door"
      : phase === "boarding-open"
        ? "board-train"
        : phase === "boarding-syncing"
          ? "wait-for-party"
          : handoff?.nextPlayerAction ?? (departing ? "ride-train" : "continue");
  const playerCue = phase === "train-approaching"
    ? "Train incoming. Watch the platform."
    : phase === "door-opening"
      ? "Door opening. Move to the lit boarding mark."
      : phase === "boarding-open"
        ? "Board the open train door."
        : phase === "boarding-syncing"
          ? `Boarded. Waiting for party ${partyStatus?.boardedCount ?? 0}/${partyStatus?.expectedCount ?? 1}.`
          : departing
            ? "Hold on. Train departing for the gold field."
            : "Prepare for the run.";
  return {
    contract: "goldrush-train-sequence-readout-v1",
    sequenceId: snapshot.sequenceId ?? null,
    currentBeat,
    nextPlayerAction,
    playerCue,
    approachComplete,
    doorOpen,
    localBoarded: Boolean(partyStatus?.localBoarded),
    partyReady: Boolean(partyStatus?.allReady),
    peerReady: Boolean(peerGate?.ready),
    boardingStatus: partyStatus,
    peerHandoffGate: peerGate,
    departureStartedAt: snapshot.departureStartedAt ?? null,
    departureProgress: Number(snapshot.departureProgress ?? 0),
    cameraDirective: handoff?.cameraDirective ?? (departing || snapshot.playerLockedToTrain ? "follow-train" : "over-shoulder-walk"),
    boardingCueVisible: doorOpen && !snapshot.playerLockedToTrain,
  };
}

function createInitialState({ timings }) {
  return {
    version: "0.1.0",
    domainPath: "n:goldrush:first-sequence",
    screen: "start",
    phase: "title",
    timings: structuredClone(timings),
    selectedGroupType: "outfit",
    selectedModeId: "modernExtraction",
    frontierConditionBriefing: null,
    activePlayers: 0,
    sequenceId: null,
    loadingStartedAt: 0,
    departureStartedAt: null,
    approachProgress: 0,
    doorProgress: 0,
    departureProgress: 0,
    playerLockedToTrain: false,
    lockedThisFrame: false,
    handoffConsumed: false,
    handoffReadyReceiptWritten: false,
    pendingMatchPayload: null,
    boardingManifest: null,
    boardingStatus: null,
    peerHandoffGate: null,
  };
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function createBoardingManifest({ payload = {}, timingDefaults = defaultFirstSequenceTimings } = {}) {
  const sourceMembers = Array.isArray(payload.partyMembers)
    ? payload.partyMembers
    : Array.isArray(payload.party?.members)
      ? payload.party.members
      : [];
  const localPlayerId = String(payload.localPlayerId ?? sourceMembers[0]?.id ?? "player-1");
  const leaderId = String(payload.partyLeaderId ?? sourceMembers.find((member) => member.leader || member.role === "Leader")?.id ?? localPlayerId);
  const memberRecords = sourceMembers.length > 0
    ? sourceMembers
    : [{ id: localPlayerId, label: "Prospector", role: "Leader" }];
  const uniqueMembers = new Map();
  memberRecords.forEach((member, index) => {
    const id = String(member.id ?? member.playerId ?? `party-member-${index + 1}`);
    if (!id || uniqueMembers.has(id)) return;
    uniqueMembers.set(id, {
      playerId: id,
      displayName: String(member.label ?? member.displayName ?? `Prospector ${index + 1}`),
      role: String(member.role ?? (id === leaderId ? "Leader" : "Member")),
      leader: id === leaderId || Boolean(member.leader),
    });
  });
  if (!uniqueMembers.has(localPlayerId)) {
    uniqueMembers.set(localPlayerId, {
      playerId: localPlayerId,
      displayName: "Local Prospector",
      role: localPlayerId === leaderId ? "Leader" : "Member",
      leader: localPlayerId === leaderId,
    });
  }
  const seats = Array.from(uniqueMembers.values()).slice(0, 4).map((member, index) => ({
    ...member,
    seatIndex: index,
    status: "waiting",
    boardedAt: null,
    autoReason: null,
  }));
  return {
    contract: "goldrush-train-boarding-v1",
    localPlayerId,
    leaderId,
    openedAt: null,
    readyAt: null,
    timeoutMs: Number.isFinite(payload.boardingTimeoutMs)
      ? payload.boardingTimeoutMs
      : timingDefaults.boardingTimeoutMs ?? defaultFirstSequenceTimings.boardingTimeoutMs,
    autoFollowMs: Number.isFinite(payload.boardingAutoFollowMs)
      ? payload.boardingAutoFollowMs
      : timingDefaults.boardingAutoFollowMs ?? defaultFirstSequenceTimings.boardingAutoFollowMs,
    seats,
  };
}

function markBoarded({ manifest, playerId, now, status }) {
  const seat = manifest.seats.find((entry) => entry.playerId === playerId);
  if (!seat || isSeatReady(seat)) return null;
  seat.status = status;
  seat.boardedAt = now;
  seat.autoReason = null;
  return seat;
}

function summarizeBoardingManifest(manifest) {
  if (!manifest) return null;
  const readySeats = manifest.seats.filter(isSeatReady);
  const localSeat = manifest.seats.find((seat) => seat.playerId === manifest.localPlayerId);
  return {
    contract: manifest.contract,
    localPlayerId: manifest.localPlayerId,
    leaderId: manifest.leaderId,
    expectedCount: manifest.seats.length,
    boardedCount: readySeats.length,
    autoBoardedCount: manifest.seats.filter((seat) => seat.status === "auto-boarded").length,
    missingPlayerIds: manifest.seats.filter((seat) => !isSeatReady(seat)).map((seat) => seat.playerId),
    localBoarded: Boolean(localSeat && isSeatReady(localSeat)),
    allReady: readySeats.length === manifest.seats.length,
    openedAt: manifest.openedAt,
    readyAt: manifest.readyAt,
    timeoutMs: manifest.timeoutMs,
    autoFollowMs: manifest.autoFollowMs,
  };
}

function summarizePeerHandoffGate({ boardingManifest, boardingStatus, peerBoardingSync }) {
  const expectedCount = Number(peerBoardingSync?.expectedCount ?? boardingStatus?.expectedCount ?? boardingManifest?.seats?.length ?? 1);
  const required = expectedCount > 1;
  const readyCount = Number(peerBoardingSync?.readyCount ?? (boardingStatus?.localBoarded ? 1 : 0));
  const missingMemberIds = Array.isArray(peerBoardingSync?.missingMemberIds)
    ? peerBoardingSync.missingMemberIds
    : required && !boardingStatus?.localBoarded
      ? [boardingManifest?.localPlayerId ?? "player-1"]
      : [];
  const ready = required
    ? peerBoardingSync?.contract === "goldrush-peer-party-boarding-sync-v1"
      && peerBoardingSync?.allReady === true
      && readyCount >= expectedCount
    : Boolean(boardingStatus?.localBoarded && boardingStatus?.allReady);
  return {
    contract: "goldrush-peer-handoff-gate-v1",
    required,
    ready,
    sourceContract: peerBoardingSync?.contract ?? null,
    rosterPolicy: peerBoardingSync?.policy?.disconnect ?? "reduce-roster-require-remaining",
    expectedCount,
    readyCount,
    allReady: Boolean(peerBoardingSync?.allReady ?? ready),
    missingMemberIds,
    disconnectedMemberIds: Array.isArray(peerBoardingSync?.disconnects)
      ? peerBoardingSync.disconnects.map((entry) => entry.memberId)
      : [],
  };
}

function isSeatReady(seat) {
  return seat?.status === "boarded" || seat?.status === "auto-boarded";
}
