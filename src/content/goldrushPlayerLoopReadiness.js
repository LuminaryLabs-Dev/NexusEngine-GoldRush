export const playerLoopReadinessContract = "goldrush-player-loop-readiness-v1";
export const playerLoopReadinessDomainPath = "n:goldrush:player-loop-readiness";

const stageOrder = Object.freeze([
  "resource-direction-cue",
  "mine-hold-readiness",
  "cargo-visual-carry",
  "cashout-direction-cue",
  "cashout-hold-readiness",
  "receipt-backed-results",
]);

export function createPlayerLoopReadinessSnapshot({
  playerDrivenExtractionRoute = null,
  playerRouteGuidance = null,
  playerGuidanceCue = null,
  playerActionSurface = null,
  extractionLoop = null,
  renderer = null,
  match = null,
  results = null,
  proofTelemetry = null,
} = {}) {
  const route = playerDrivenExtractionRoute ?? {};
  const guidance = playerRouteGuidance ?? {};
  const cue = playerGuidanceCue ?? {};
  const surface = playerActionSurface ?? {};
  const loop = extractionLoop ?? {};
  const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);
  const mined = hasStage(route, "mine-hold", "resolved") || cargoAmount > 0 || Boolean(loop.mining?.receipts?.length);
  const extracted = Boolean(loop.receipt?.extracted) || hasStage(route, "cashout-hold", "resolved");
  const resultReady = Boolean(results?.winner?.id || results?.status === "finalized" || match?.phase === "results");
  const renderedCue = renderer?.procedural?.gameplay?.playerGuidanceCue ?? null;
  const renderedCargo = renderer?.procedural?.playerRig?.cargoVisual ?? null;
  const activeAction = surface.primaryAction ?? null;

  const stages = [
    createStage({
      id: "resource-direction-cue",
      label: "Route from spawn to readable gold object",
      domainPath: "n:goldrush:player-guidance-cue",
      publicApi: "goldrushPlayerGuidanceCue.update",
      status: mined || cueTargets(cue, "resource") || guidanceTargets(guidance, "resource") ? "resolved" : "missing",
      evidence: [
        cueTargets(cue, "resource") ? `cue:${cue.cue?.role}` : null,
        renderedCue?.target?.kind === "resource" ? "rendered:resource-cue" : null,
        guidance.currentLegId ? `leg:${guidance.currentLegId}` : null,
      ],
      gaps: mined || cueTargets(cue, "resource") || guidanceTargets(guidance, "resource")
        ? []
        : ["no active resource direction cue"],
      validator: "tools/validation/validate-player-guidance-cue.mjs",
    }),
    createStage({
      id: "mine-hold-readiness",
      label: "Hold input mines the selected protokit object",
      domainPath: "n:goldrush:mine-hold-action",
      publicApi: "tickExtractionLoop(input.interact)",
      status: mined
        ? "resolved"
        : activeAction?.action === "mine-gold" && activeAction?.inRange ? "ready" : "blocked",
      evidence: [
        hasStage(route, "mine-hold", "resolved") ? "route-stage:mine-hold" : null,
        activeAction?.action === "mine-gold" ? `prompt:${activeAction.prompt}` : null,
        loop.mining?.progress > 0 ? `progress:${round(loop.mining.progress)}` : null,
      ],
      gaps: mined || activeAction?.action === "mine-gold"
        ? []
        : ["mine hold action is not available from the current player surface"],
      validator: "tools/validation/validate-player-driven-extraction-route.mjs",
    }),
    createStage({
      id: "cargo-visual-carry",
      label: "Carried gold is visible and changes player state",
      domainPath: "n:goldrush:gold-carrying",
      publicApi: "goldrushExtractionLoop.snapshot",
      status: extracted || (cargoAmount > 0 && renderedCargo?.visible !== false) ? "resolved" : cargoAmount > 0 ? "blocked" : "missing",
      evidence: [
        cargoAmount > 0 ? `cargo:${round(cargoAmount)}` : null,
        renderedCargo?.contract ? `visual:${renderedCargo.contract}` : null,
        renderedCargo?.visibleNuggetCount ? `nuggets:${renderedCargo.visibleNuggetCount}` : null,
        loop.player?.cargo?.mobility?.contract ? `mobility:${loop.player.cargo.mobility.contract}` : null,
      ],
      gaps: extracted || (cargoAmount > 0 && renderedCargo?.visible !== false)
        ? []
        : cargoAmount > 0 ? ["cargo exists but renderer did not prove visible carried gold"] : ["no carried gold yet"],
      validator: "tools/proof/cargo-visual-proof.mjs",
    }),
    createStage({
      id: "cashout-direction-cue",
      label: "Route from carried gold to visible cashout set-piece",
      domainPath: "n:goldrush:player-route-guidance",
      publicApi: "goldrushPlayerRouteGuidance.update",
      status: extracted || cueTargets(cue, "cashout") || guidanceTargets(guidance, "cashout") ? "resolved" : cargoAmount > 0 ? "missing" : "blocked",
      evidence: [
        cueTargets(cue, "cashout") ? `cue:${cue.cue?.shape}` : null,
        guidanceTargets(guidance, "cashout") ? `target:${guidance.target?.id}` : null,
        renderedCue?.target?.kind === "cashout" ? "rendered:cashout-cue" : null,
      ],
      gaps: extracted || cueTargets(cue, "cashout") || guidanceTargets(guidance, "cashout")
        ? []
        : cargoAmount > 0 ? ["cashout direction cue is missing while carrying gold"] : ["cashout route starts after cargo"],
      validator: "tools/validation/validate-player-route-guidance.mjs",
    }),
    createStage({
      id: "cashout-hold-readiness",
      label: "Hold input extracts at the cashout set-piece",
      domainPath: "n:goldrush:cashout-sites",
      publicApi: "tickExtractionLoop(input.interact)",
      status: extracted
        ? "resolved"
        : cueTargets(cue, "cashout") && cue.cue?.role === "hold-readiness" ? "ready" : loop.extraction?.progress > 0 ? "active" : "blocked",
      evidence: [
        extracted ? "receipt:extracted" : null,
        loop.extraction?.progress > 0 ? `progress:${round(loop.extraction.progress)}` : null,
        cueTargets(cue, "cashout") ? `cue-role:${cue.cue?.role}` : null,
      ],
      gaps: extracted || loop.extraction?.progress > 0 || (cueTargets(cue, "cashout") && cue.cue?.role === "hold-readiness")
        ? []
        : ["cashout hold readiness is not active"],
      validator: "tools/validation/validate-goldrush-extraction-loop.mjs",
    }),
    createStage({
      id: "receipt-backed-results",
      label: "Results come from extraction receipts",
      domainPath: "n:match:results",
      publicApi: "goldrushResults.finalize",
      status: resultReady ? "resolved" : extracted ? "ready" : "missing",
      evidence: [
        loop.receipt?.receiptId ? `receipt:${loop.receipt.receiptId}` : null,
        match?.phase ? `phase:${match.phase}` : null,
        results?.winner?.id ? `winner:${results.winner.id}` : null,
      ],
      gaps: resultReady || extracted ? [] : ["no receipt-backed results yet"],
      validator: "tools/validation/validate-match-results.mjs",
    }),
  ];

  const helperDebt = resolveHelperDebt({
    route,
    proofTelemetry,
  });
  const resolvedStages = stages.filter((stage) => stage.status === "resolved").map((stage) => stage.id);
  const readyStages = stages.filter((stage) => stage.status === "ready" || stage.status === "active").map((stage) => stage.id);
  const blockedStages = stages.filter((stage) => stage.status === "blocked" || stage.status === "missing").map((stage) => stage.id);

  return {
    contract: playerLoopReadinessContract,
    domainPath: playerLoopReadinessDomainPath,
    consumes: [
      "n:goldrush:player-driven-extraction-route",
      "n:goldrush:player-route-guidance",
      "n:goldrush:player-guidance-cue",
      "n:goldrush:player-action-surface",
      "n:goldrush:gold-carrying",
      "n:goldrush:cashout-sites",
      "n:match:receipts",
      "n:match:results",
    ],
    purpose: "Expose a player-facing loop readiness matrix so mine-carry-cashout-results proof remains human-driven and domain-owned.",
    matrix: {
      stageOrder,
      stages,
      resolvedStages,
      readyStages,
      blockedStages,
      resolvedCount: resolvedStages.length,
      routeStatus: resolvedStages.length === stageOrder.length
        ? "resolved"
        : readyStages.length > 0
          ? "active"
          : resolvedStages.length > 0
            ? "partial"
            : "not-proven",
    },
    proofPolicy: {
      noDirectCompletionHelper: !helperDebt.some((entry) => entry.id === "direct-completion-helper"),
      noPlacementHelperRequired: !helperDebt.some((entry) => entry.id.endsWith("placement-helper")),
      currentObjectiveVisible: Boolean(cue.visible || guidance.target || resultReady),
      routeUsesCameraRelativeInput: guidance.localPlayer?.cameraRelativeWasd === true || guidance.cameraRelativeInput?.mode === "camera-relative-walk",
      visualAndAudioIndependent: true,
    },
    helperDebt,
    nextMostImportantGap: blockedStages[0] ?? helperDebt[0]?.id ?? null,
    reset: "recomputed-from-player-facing-route-cue-action-cargo-extraction-and-result-snapshots",
  };
}

export function validatePlayerLoopReadiness(snapshot) {
  const failures = [];
  if (snapshot?.contract !== playerLoopReadinessContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== playerLoopReadinessDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:goldrush:player-guidance-cue")) failures.push("missing-guidance-cue-consumer");
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
  if (typeof snapshot?.proofPolicy?.noDirectCompletionHelper !== "boolean") failures.push("invalid-direct-helper-policy");
  if (typeof snapshot?.proofPolicy?.currentObjectiveVisible !== "boolean") failures.push("invalid-objective-policy");
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

function hasStage(route, id, status = "resolved") {
  return route?.matrix?.stages?.some((stage) => stage.id === id && stage.status === status) ?? false;
}

function cueTargets(cue, kind) {
  return Boolean(cue?.visible && cue?.target?.kind === kind);
}

function guidanceTargets(guidance, kind) {
  return Boolean(guidance?.target?.kind === kind);
}

function resolveHelperDebt({ route, proofTelemetry }) {
  const telemetryHelpers = new Set(proofTelemetry?.usedHelpers ?? []);
  const helperDebt = [
    ...(Array.isArray(route?.helperDebt) ? route.helperDebt : []),
  ].map((entry) => ({
    id: entry.id,
    status: entry.status ?? "prototype-debt",
    domainPath: entry.domainPath ?? "n:goldrush:runtime",
    reason: entry.reason ?? "Unscoped helper debt from upstream route proof.",
  }));
  if (telemetryHelpers.has("publicSmokeCompleteRunToResults") || proofTelemetry?.directCompletionHelper === true) {
    helperDebt.push({
      id: "direct-completion-helper",
      status: "must-remove",
      domainPath: "n:match:results",
      reason: "Results must be reached from extracted receipts, not a public smoke completion shortcut.",
    });
  }
  if (telemetryHelpers.has("publicSmokePlaceAtNearestObjectAffordance")) {
    helperDebt.push({
      id: "resource-placement-helper",
      status: "prototype-debt",
      domainPath: "n:goldrush:prop-placement",
      reason: "Resource should be reached by walking or route guidance in human-view proof.",
    });
  }
  if (telemetryHelpers.has("publicSmokePlaceAtExtractionSetpiece")) {
    helperDebt.push({
      id: "cashout-placement-helper",
      status: "prototype-debt",
      domainPath: "n:goldrush:cashout-sites",
      reason: "Cashout should be reached by walking or route guidance in human-view proof.",
    });
  }
  return dedupeById(helperDebt);
}

function dedupeById(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry?.id || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

function round(value) {
  return Number((Number(value) || 0).toFixed(3));
}
