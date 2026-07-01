export const combatLoopReadinessContract = "goldrush-combat-loop-readiness-v1";
export const combatLoopReadinessDomainPath = "n:goldrush:combat-loop-readiness";

const stageOrder = Object.freeze([
  "cargo-threat-activation",
  "threat-telegraph-readability",
  "cover-counterplay-readiness",
  "cover-engagement",
  "shot-damage-receipts",
  "combat-results-summary",
]);

export function createCombatLoopReadinessSnapshot({
  extractionLoop = null,
  playerActionSurface = null,
  renderer = null,
  results = null,
  replaySummary = null,
  proofTelemetry = null,
} = {}) {
  const loop = extractionLoop ?? {};
  const combat = loop.combat ?? {};
  const readability = combat.readability ?? {};
  const rendererMarkers = renderer?.procedural?.gameplay?.extractionLoopMarkers ?? {};
  const receipts = Array.isArray(readability.receipts)
    ? readability.receipts
    : Array.isArray(combat.receipts)
      ? combat.receipts
      : [];
  const resultSummary = resolveCombatOutcomeSummary({ results, replaySummary });
  const threatPackets = Object.values(readability.threats ?? {});
  const activeThreats = threatPackets.filter((threat) => isActiveThreat(threat, readability));
  const readableThreat = activeThreats.find(hasReadableTelegraph) ?? activeThreats[0] ?? null;
  const recommendedCoverIds = [
    ...(Array.isArray(readability.recommendedCoverIds) ? readability.recommendedCoverIds : []),
    ...activeThreats.map((threat) => threat.recommendedCoverId).filter(Boolean),
  ].filter(unique);
  const coverEngagement = readability.coverEngagement ?? combat.cover ?? {};
  const coverReceipt = receipts.find((receipt) => receipt.type === "cover-engaged" || receipt.type === "cover-peek" || receipt.coverId);
  const shotReceipts = receipts.filter((receipt) => receipt.type === "player-shot");
  const damageReceipts = receipts.filter((receipt) => receipt.type === "player-damaged");
  const activeAction = playerActionSurface?.primaryAction ?? null;
  const cargoNoise = readability.cargoNoisePressure ?? loop.player?.cargo?.noisePressure ?? null;
  const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);

  const stages = [
    createStage({
      id: "cargo-threat-activation",
      label: "Carried gold creates ambush pressure",
      domainPath: "n:goldrush:ambush-pressure",
      publicApi: "goldrushExtractionLoop.tick",
      status: activeThreats.length > 0 || receipts.length > 0 || Number(combat.activeThreatCount ?? 0) > 0
        ? "resolved"
        : cargoAmount > 0 && cargoNoise?.affectsThreat !== false
          ? "ready"
          : "missing",
      evidence: [
        cargoAmount > 0 ? `cargo:${round(cargoAmount)}` : null,
        cargoNoise?.contract ? `noise:${cargoNoise.contract}` : null,
        Number(combat.activeThreatCount ?? 0) > 0 ? `active-threats:${combat.activeThreatCount}` : null,
        activeThreats[0]?.threatId ? `threat:${activeThreats[0].threatId}` : null,
      ],
      gaps: activeThreats.length > 0 || receipts.length > 0 || Number(combat.activeThreatCount ?? 0) > 0
        ? []
        : cargoAmount > 0 ? ["carried cargo has not activated a readable threat yet"] : ["no carried cargo pressure yet"],
      validator: "tools/validation/validate-goldrush-extraction-loop.mjs",
    }),
    createStage({
      id: "threat-telegraph-readability",
      label: "Threat is readable before damage",
      domainPath: "n:goldrush:ambush-pressure",
      publicApi: "goldrushExtractionLoop.snapshot",
      status: hasReadableTelegraph(readableThreat) || receiptsHaveTelegraph(receipts) || resultSummary?.receiptCount > 0
        ? "resolved"
        : activeThreats.length > 0 ? "blocked" : "missing",
      evidence: [
        readableThreat?.telegraph?.id ? `telegraph:${readableThreat.telegraph.id}` : null,
        readableThreat?.lane?.id ? `lane:${readableThreat.lane.id}` : null,
        readableThreat?.cue?.visual ? "cue:visual" : null,
        readableThreat?.cue?.audio ? "cue:audio" : null,
        readableThreat?.cue?.shape ? `cue-shape:${readableThreat.cue.shape}` : null,
        Array.isArray(rendererMarkers.laneIds) && rendererMarkers.laneIds.includes(readableThreat?.lane?.id) ? "rendered:lane" : null,
      ],
      gaps: hasReadableTelegraph(readableThreat) || receiptsHaveTelegraph(receipts) || resultSummary?.receiptCount > 0
        ? []
        : activeThreats.length > 0 ? ["active threat lacks a pre-damage visual/audio/shape telegraph"] : ["no active threat to telegraph"],
      validator: "tools/proof/threat-lane-render-proof.mjs",
    }),
    createStage({
      id: "cover-counterplay-readiness",
      label: "Combat exposes visible cover counterplay",
      domainPath: "n:goldrush:player-action-surface",
      publicApi: "goldrushPlayerActionSurface.update",
      status: hasCoverCounterplay({ activeAction, recommendedCoverIds, activeThreats, rendererMarkers, resultSummary })
        ? "resolved"
        : activeThreats.length > 0 ? "blocked" : "missing",
      evidence: [
        activeAction?.action === "take-cover" || activeAction?.action === "hold-cover" ? `action:${activeAction.action}` : null,
        recommendedCoverIds[0] ? `cover:${recommendedCoverIds[0]}` : null,
        Array.isArray(rendererMarkers.coverIds) && rendererMarkers.coverIds.length ? `rendered-covers:${rendererMarkers.coverIds.length}` : null,
      ],
      gaps: hasCoverCounterplay({ activeAction, recommendedCoverIds, activeThreats, rendererMarkers, resultSummary })
        ? []
        : activeThreats.length > 0 ? ["active combat has no player-facing cover action or rendered cover"] : ["cover counterplay waits for active threat"],
      validator: "tools/validation/validate-player-action-surface.mjs",
    }),
    createStage({
      id: "cover-engagement",
      label: "Player can engage cover and mitigation is tracked",
      domainPath: "n:goldrush:ambush-pressure",
      publicApi: "goldrushExtractionLoop.engageCover",
      status: coverEngagement?.engaged === true || coverReceipt || resultSummary?.coverIds?.length
        ? "resolved"
        : recommendedCoverIds.length > 0 ? "ready" : "missing",
      evidence: [
        coverEngagement?.coverId ? `engaged:${coverEngagement.coverId}` : null,
        coverEngagement?.damageReduction ? `reduction:${round(coverEngagement.damageReduction)}` : null,
        coverReceipt?.receiptId ? `receipt:${coverReceipt.receiptId}` : null,
        resultSummary?.damageMitigated ? `mitigated:${round(resultSummary.damageMitigated)}` : null,
        Array.isArray(rendererMarkers.engagedCoverIds) && rendererMarkers.engagedCoverIds.includes(coverEngagement?.coverId) ? "rendered:engaged-cover" : null,
      ],
      gaps: coverEngagement?.engaged === true || coverReceipt || resultSummary?.coverIds?.length
        ? []
        : recommendedCoverIds.length > 0 ? ["cover is available but not engaged yet"] : ["no cover engagement target available"],
      validator: "tools/proof/threat-lane-render-proof.mjs",
    }),
    createStage({
      id: "shot-damage-receipts",
      label: "Shots and damage produce combat receipts",
      domainPath: "n:match:receipts",
      publicApi: "goldrushExtractionLoop.fire/takeDamage",
      status: hasShotAndDamageReceipts({ shotReceipts, damageReceipts, resultSummary })
        ? "resolved"
        : receipts.length > 0 ? "active" : activeThreats.length > 0 ? "ready" : "missing",
      evidence: [
        shotReceipts.length ? `shots:${shotReceipts.length}` : null,
        damageReceipts.length ? `damage:${damageReceipts.length}` : null,
        damageReceipts[0]?.laneId ? `lane:${damageReceipts[0].laneId}` : null,
        damageReceipts[0]?.coverId ? `cover:${damageReceipts[0].coverId}` : null,
        resultSummary?.receiptCount ? `result-receipts:${resultSummary.receiptCount}` : null,
      ],
      gaps: hasShotAndDamageReceipts({ shotReceipts, damageReceipts, resultSummary })
        ? []
        : receipts.length > 0 ? ["combat receipts exist but do not yet include both shot and damage facts"] : ["no combat receipts yet"],
      validator: "tools/validation/validate-goldrush-extraction-loop.mjs",
    }),
    createStage({
      id: "combat-results-summary",
      label: "Results summarize combat pressure and awards",
      domainPath: "n:match:results",
      publicApi: "goldrushResults.finalize",
      status: resultSummary?.contract === "goldrush-combat-outcome-summary-v1" && Number(resultSummary.receiptCount ?? 0) >= 2
        ? "resolved"
        : receipts.length >= 2 ? "ready" : "missing",
      evidence: [
        resultSummary?.contract ? `summary:${resultSummary.contract}` : null,
        resultSummary?.receiptCount ? `receipts:${resultSummary.receiptCount}` : null,
        resultSummary?.damageTaken ? `damage:${round(resultSummary.damageTaken)}` : null,
        resultSummary?.damageMitigated ? `mitigated:${round(resultSummary.damageMitigated)}` : null,
      ],
      gaps: resultSummary?.contract === "goldrush-combat-outcome-summary-v1" && Number(resultSummary.receiptCount ?? 0) >= 2
        ? []
        : receipts.length >= 2 ? ["combat receipts are ready but results have not summarized them"] : ["results need combat receipts first"],
      validator: "tools/proof/combat-results-proof.mjs",
    }),
  ];

  const helperDebt = resolveHelperDebt({ proofTelemetry });
  const resolvedStages = stages.filter((stage) => stage.status === "resolved").map((stage) => stage.id);
  const readyStages = stages.filter((stage) => stage.status === "ready" || stage.status === "active").map((stage) => stage.id);
  const blockedStages = stages.filter((stage) => stage.status === "blocked" || stage.status === "missing").map((stage) => stage.id);

  return {
    contract: combatLoopReadinessContract,
    domainPath: combatLoopReadinessDomainPath,
    consumes: [
      "n:goldrush:ambush-pressure",
      "n:goldrush:player-action-surface",
      "n:render:micro-object-instancing",
      "n:goldrush:gold-carrying",
      "n:match:receipts",
      "n:match:results",
    ],
    purpose: "Expose a combat-loop readiness matrix proving ambush telegraph, cover counterplay, receipts, and results integration.",
    matrix: {
      stageOrder,
      stages,
      resolvedStages,
      readyStages,
      blockedStages,
      resolvedCount: resolvedStages.length,
      combatStatus: resolvedStages.length === stageOrder.length
        ? "resolved"
        : readyStages.length > 0
          ? "active"
          : resolvedStages.length > 0
            ? "partial"
            : "not-proven",
    },
    proofPolicy: {
      multisensoryCriticalCues: Boolean(readableThreat && readableThreat.cue?.visual && readableThreat.cue?.audio && readableThreat.cue?.shape),
      noColorOnlyCriticalInfo: readableThreat ? Boolean(readableThreat.cue?.shape && readableThreat.lane?.id && readableThreat.recommendedCoverId) : true,
      coverCounterplayVisible: hasCoverCounterplay({ activeAction, recommendedCoverIds, activeThreats, rendererMarkers, resultSummary }),
      receiptBackedCombat: hasShotAndDamageReceipts({ shotReceipts, damageReceipts, resultSummary }),
      resultBackedCombat: resultSummary?.contract === "goldrush-combat-outcome-summary-v1" && Number(resultSummary.receiptCount ?? 0) >= 2,
    },
    helperDebt,
    nextMostImportantGap: blockedStages[0] ?? readyStages[0] ?? helperDebt[0]?.id ?? null,
    reset: "recomputed-from-ambush-action-surface-renderer-receipt-and-result-snapshots",
  };
}

export function validateCombatLoopReadiness(snapshot) {
  const failures = [];
  if (snapshot?.contract !== combatLoopReadinessContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== combatLoopReadinessDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:goldrush:ambush-pressure")) failures.push("missing-ambush-consumer");
  if (!snapshot?.consumes?.includes("n:match:results")) failures.push("missing-results-consumer");
  if (!Array.isArray(snapshot?.matrix?.stages) || snapshot.matrix.stages.length !== stageOrder.length) failures.push("invalid-stage-matrix");
  for (const stageId of stageOrder) {
    if (!snapshot?.matrix?.stages?.some((stage) => stage.id === stageId)) failures.push(`missing-stage:${stageId}`);
  }
  for (const stage of snapshot?.matrix?.stages ?? []) {
    if (!stage.domainPath?.startsWith("n:")) failures.push(`invalid-stage-domain:${stage.id}`);
    if (!["resolved", "ready", "active", "blocked", "missing"].includes(stage.status)) failures.push(`invalid-stage-status:${stage.id}`);
    if (!Array.isArray(stage.evidence) || !Array.isArray(stage.gaps)) failures.push(`invalid-stage-evidence:${stage.id}`);
    if (!stage.validator) failures.push(`missing-stage-validator:${stage.id}`);
  }
  if (!Number.isFinite(snapshot?.matrix?.resolvedCount)) failures.push("invalid-resolved-count");
  if (!Array.isArray(snapshot?.helperDebt)) failures.push("invalid-helper-debt");
  if (typeof snapshot?.proofPolicy?.multisensoryCriticalCues !== "boolean") failures.push("invalid-multisensory-policy");
  if (typeof snapshot?.proofPolicy?.coverCounterplayVisible !== "boolean") failures.push("invalid-cover-policy");
  if (typeof snapshot?.proofPolicy?.receiptBackedCombat !== "boolean") failures.push("invalid-receipt-policy");
  return { passed: failures.length === 0, failures };
}

function createStage({
  id,
  label,
  domainPath,
  publicApi,
  status,
  evidence,
  gaps,
  validator,
}) {
  return {
    id,
    label,
    domainPath,
    publicApi,
    status,
    evidence: evidence.filter(Boolean),
    gaps,
    validator,
  };
}

function resolveCombatOutcomeSummary({ results, replaySummary }) {
  return results?.combatOutcomeSummary?.contract
    ? results.combatOutcomeSummary
    : replaySummary?.combatOutcomeSummary?.contract
      ? replaySummary.combatOutcomeSummary
      : null;
}

function isActiveThreat(threat, readability) {
  const laneId = threat?.lane?.id;
  return threat?.status === "active"
    || threat?.status === "engaged"
    || threat?.telegraph?.readableBeforeDamage === true
    || (laneId && Array.isArray(readability?.activeLaneIds) && readability.activeLaneIds.includes(laneId));
}

function hasReadableTelegraph(threat) {
  return Boolean(
    threat?.telegraph?.readableBeforeDamage === true
    && threat?.lane?.id
    && threat?.cue?.visual
    && threat?.cue?.audio
    && threat?.cue?.shape
  );
}

function receiptsHaveTelegraph(receipts) {
  return receipts.some((receipt) => receipt.telegraphId && receipt.laneId);
}

function hasCoverCounterplay({ activeAction, recommendedCoverIds, activeThreats, rendererMarkers, resultSummary }) {
  return Boolean(
    activeAction?.action === "take-cover"
    || activeAction?.action === "hold-cover"
    || recommendedCoverIds.length > 0
    || activeThreats.some((threat) => Array.isArray(threat.cover) && threat.cover.length > 0)
    || (Array.isArray(rendererMarkers.coverIds) && rendererMarkers.coverIds.length > 0)
    || (Array.isArray(resultSummary?.coverIds) && resultSummary.coverIds.length > 0)
  );
}

function hasShotAndDamageReceipts({ shotReceipts, damageReceipts, resultSummary }) {
  return Boolean(
    (shotReceipts.length > 0 && damageReceipts.length > 0)
    || Number(resultSummary?.receiptCount ?? 0) >= 2
  );
}

function resolveHelperDebt({ proofTelemetry }) {
  const telemetryHelpers = new Set(proofTelemetry?.usedHelpers ?? []);
  const helperDebt = [];
  if (telemetryHelpers.has("publicSmokeCompleteRunToResults") || proofTelemetry?.directCompletionHelper === true) {
    helperDebt.push({
      id: "direct-combat-result-completion-helper",
      status: "must-remove",
      domainPath: "n:match:results",
      reason: "Browser proof completed results with a direct smoke helper instead of a player-held extraction under combat pressure.",
    });
  }
  if (telemetryHelpers.has("publicSmokePlaceAtTrainDoor") || proofTelemetry?.trainPlacementHelper === true) {
    helperDebt.push({
      id: "train-placement-helper",
      status: "must-remove",
      domainPath: "n:goldrush:train-loading",
      reason: "Browser proof skipped the natural loading-yard train boarding path.",
    });
  }
  if (telemetryHelpers.has("directCombatSetup") || proofTelemetry?.directCombatSetup === true) {
    helperDebt.push({
      id: "direct-combat-setup-helper",
      status: "prototype-debt",
      domainPath: "n:goldrush:ambush-pressure",
      reason: "Proof directly activated combat instead of routing the player into a threat encounter.",
    });
  }
  return helperDebt;
}

function unique(value, index, values) {
  return Boolean(value) && values.indexOf(value) === index;
}

function round(value) {
  return Number((Number(value) || 0).toFixed(3));
}
