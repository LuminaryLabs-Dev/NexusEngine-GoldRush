export const playerDrivenExtractionRouteContract = "goldrush-player-driven-extraction-route-v1";
export const playerDrivenExtractionRouteDomainPath = "n:goldrush:player-driven-extraction-route";

const stageOrder = Object.freeze([
  "resource-affordance",
  "mine-hold",
  "carry-gold",
  "cashout-hold",
  "receipt-results",
]);

export function createPlayerDrivenExtractionRouteSnapshot({
  extractionLoop = null,
  playerActionSurface = null,
  objectInteraction = null,
  localPlayer = null,
  match = null,
  results = null,
  proofTelemetry = null,
} = {}) {
  const loop = extractionLoop ?? {};
  const surface = playerActionSurface ?? {};
  const selected = objectInteraction?.nearest?.selected ?? objectInteraction?.last?.selection?.selected ?? null;
  const miningReceipts = Array.isArray(loop.mining?.receipts) ? loop.mining.receipts : [];
  const extractionSites = Object.values(loop.extraction?.sites ?? {});
  const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);
  const extracted = Boolean(loop.receipt?.extracted);
  const hasResult = Boolean(results?.status === "finalized" || results?.winner?.id || match?.phase === "results");
  const primaryAction = surface.primaryAction ?? null;
  const availableActions = Array.isArray(surface.availableActions) ? surface.availableActions : [];
  const cashoutAction = availableActions.find((action) => action.action === "cashout-gold")
    ?? (primaryAction?.action === "cashout-gold" ? primaryAction : null);
  const mineAction = availableActions.find((action) => action.action === "mine-gold")
    ?? (primaryAction?.action === "mine-gold" ? primaryAction : null);
  const nearestExtraction = extractionSites
    .slice()
    .sort((a, b) => Number(a.distance ?? 9999) - Number(b.distance ?? 9999))[0] ?? null;

  const stages = [
    createStage({
      id: "resource-affordance",
      label: "Select readable gold object",
      domainPath: "n:gameplay:interaction-hold",
      kit: "goldrush-procedural-object-protokit",
      publicAction: "selectNearestObjectAffordance",
      status: miningReceipts.length > 0 || cargoAmount > 0 || extracted
        ? "resolved"
        : selected?.action === "mine-gold" ? "ready" : "missing",
      playerDriven: Boolean(selected?.action === "mine-gold" && selected?.source !== "direct-helper"),
      evidence: [
        selected?.kitId ? `selected:${selected.kitId}` : null,
        selected?.target?.siteId ? `site:${selected.target.siteId}` : null,
        mineAction?.prompt ? `prompt:${mineAction.prompt}` : null,
      ],
      gaps: selected?.action === "mine-gold" || miningReceipts.length > 0 || cargoAmount > 0 || extracted
        ? []
        : ["no selected mine-gold object protokit"],
      nextFix: "Keep gold resource selection visible and tied to an object protokit.",
    }),
    createStage({
      id: "mine-hold",
      label: "Hold input to mine gold",
      domainPath: "n:goldrush:mine-hold-action",
      kit: "engine.n.goldrushExtractionLoop",
      publicAction: "tickExtractionLoop(input.interact)",
      status: miningReceipts.length > 0 || cargoAmount > 0 || extracted ? "resolved" : mineAction?.inRange ? "ready" : "blocked",
      playerDriven: Boolean(proofTelemetry?.inputDrivenInteract || mineAction?.input === "E"),
      evidence: [
        miningReceipts.at(-1)?.receiptId ? `receipt:${miningReceipts.at(-1).receiptId}` : null,
        cargoAmount > 0 ? `cargo:${cargoAmount}` : null,
        mineAction?.hold?.ratio > 0 ? `hold:${mineAction.hold.ratio}` : null,
      ],
      gaps: miningReceipts.length > 0 || cargoAmount > 0 || extracted
        ? []
        : ["mining completion not yet proven on this route snapshot"],
      nextFix: "Prefer repeated interact ticks over direct holdMine calls in browser proofs.",
    }),
    createStage({
      id: "carry-gold",
      label: "Carry visible gold with penalties",
      domainPath: "n:goldrush:gold-carrying",
      kit: "engine.n.goldrushCargo",
      publicAction: "snapshot",
      status: cargoAmount > 0 || extracted ? "resolved" : miningReceipts.length > 0 ? "blocked" : "missing",
      playerDriven: miningReceipts.length > 0 || cargoAmount > 0 || extracted,
      evidence: [
        cargoAmount > 0 ? `cargo:${cargoAmount}` : null,
        loop.player?.cargo?.visual?.contract ? `visual:${loop.player.cargo.visual.contract}` : null,
        loop.player?.cargo?.mobility?.contract ? `mobility:${loop.player.cargo.mobility.contract}` : null,
      ],
      gaps: cargoAmount > 0 || extracted ? [] : ["no carried gold state on route"],
      nextFix: "Keep cargo visual, movement penalty, and noise pressure visible after mining.",
    }),
    createStage({
      id: "cashout-hold",
      label: "Reach visible cashout and hold",
      domainPath: "n:goldrush:cashout-sites",
      kit: "engine.n.goldrushExtractionLoop",
      publicAction: "tickExtractionLoop(input.interact)",
      status: extracted ? "resolved" : loop.extraction?.progress > 0 ? "active" : cashoutAction?.inRange ? "ready" : cargoAmount > 0 ? "blocked" : "missing",
      playerDriven: Boolean(proofTelemetry?.inputDrivenInteract || cashoutAction?.input === "E"),
      evidence: [
        nearestExtraction?.id ? `site:${nearestExtraction.id}` : null,
        loop.extraction?.progress > 0 ? `progress:${round(loop.extraction.progress)}` : null,
        cashoutAction?.prompt ? `prompt:${cashoutAction.prompt}` : null,
      ],
      gaps: extracted || loop.extraction?.progress > 0
        ? []
        : cargoAmount > 0 ? ["cashout route not yet proven by player movement"] : ["cashout requires carried gold"],
      nextFix: "Make the human-view proof walk or route to the depot, then hold E without direct extract helpers.",
    }),
    createStage({
      id: "receipt-results",
      label: "Receipt-backed score and results",
      domainPath: "n:match:results",
      kit: "engine.n.goldrushResults",
      publicAction: "finalize",
      status: hasResult ? "resolved" : extracted ? "ready" : "missing",
      playerDriven: extracted,
      evidence: [
        loop.receipt?.receiptId ? `receipt:${loop.receipt.receiptId}` : null,
        results?.winner?.id ? `winner:${results.winner.id}` : null,
        match?.phase ? `phase:${match.phase}` : null,
      ],
      gaps: hasResult || extracted ? [] : ["no extraction receipt available for results"],
      nextFix: "Use extraction receipt as the only path into score/results.",
    }),
  ];

  const helperDebt = resolveHelperDebt(proofTelemetry);
  const blockedStages = stages.filter((stage) => ["blocked", "missing"].includes(stage.status)).map((stage) => stage.id);
  const resolvedStages = stages.filter((stage) => stage.status === "resolved").map((stage) => stage.id);
  const playerDrivenStages = stages.filter((stage) => stage.playerDriven).map((stage) => stage.id);

  return {
    contract: playerDrivenExtractionRouteContract,
    domainPath: playerDrivenExtractionRouteDomainPath,
    consumes: [
      "n:gameplay:interaction-hold",
      "n:goldrush:mine-hold-action",
      "n:goldrush:gold-carrying",
      "n:goldrush:cashout-sites",
      "n:match:receipts",
      "n:match:results",
    ],
    scope: "goldrush-custom-proof-orchestration",
    purpose: "Track whether the mine-carry-cashout loop is player-driven, receipt-backed, and domain-owned.",
    localPlayer: {
      grounded: localPlayer?.ground?.grounded ?? null,
      position: localPlayer?.position ? {
        x: round(localPlayer.position.x),
        y: round(localPlayer.position.y),
        z: round(localPlayer.position.z),
      } : null,
      cameraRelativeWasd: localPlayer?.inputModel?.wasdFollowsCameraYaw ?? localPlayer?.look?.movementRelativeToCamera ?? null,
    },
    matrix: {
      stageOrder,
      stages,
      resolvedStages,
      playerDrivenStages,
      blockedStages,
      resolvedCount: resolvedStages.length,
      playerDrivenCount: playerDrivenStages.length,
      routeStatus: resolvedStages.length === stageOrder.length
        ? "resolved"
        : stages.some((stage) => stage.status === "active")
          ? "active"
          : resolvedStages.length > 0
            ? "partial"
            : "not-proven",
    },
    helperDebt,
    nextMostImportantGap: blockedStages[0] ?? helperDebt[0]?.id ?? null,
    reset: "recomputed-from-extraction-loop-player-action-surface-and-proof-telemetry",
  };
}

export function validatePlayerDrivenExtractionRoute(snapshot) {
  const failures = [];
  if (snapshot?.contract !== playerDrivenExtractionRouteContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== playerDrivenExtractionRouteDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:goldrush:cashout-sites")) failures.push("missing-cashout-consumer");
  if (!Array.isArray(snapshot?.matrix?.stages) || snapshot.matrix.stages.length !== stageOrder.length) failures.push("invalid-stage-matrix");
  const stageIds = snapshot?.matrix?.stages?.map((stage) => stage.id) ?? [];
  for (const stageId of stageOrder) {
    if (!stageIds.includes(stageId)) failures.push(`missing-stage:${stageId}`);
  }
  for (const stage of snapshot?.matrix?.stages ?? []) {
    if (!stage.domainPath?.startsWith("n:")) failures.push(`invalid-stage-domain:${stage.id}`);
    if (!["resolved", "ready", "active", "blocked", "missing"].includes(stage.status)) failures.push(`invalid-stage-status:${stage.id}`);
    if (!Array.isArray(stage.evidence) || !Array.isArray(stage.gaps)) failures.push(`invalid-stage-evidence:${stage.id}`);
  }
  if (!Number.isFinite(snapshot?.matrix?.resolvedCount)) failures.push("invalid-resolved-count");
  if (!Array.isArray(snapshot?.helperDebt)) failures.push("invalid-helper-debt");
  return { passed: failures.length === 0, failures };
}

function createStage({
  id,
  label,
  domainPath,
  kit,
  publicAction,
  status,
  playerDriven,
  evidence,
  gaps,
  nextFix,
}) {
  return {
    id,
    label,
    domainPath,
    kit,
    publicAction,
    status,
    playerDriven: Boolean(playerDriven),
    evidence: evidence.filter(Boolean),
    gaps,
    nextFix,
  };
}

function resolveHelperDebt(proofTelemetry) {
  const debt = [];
  const helpers = new Set(proofTelemetry?.usedHelpers ?? []);
  if (helpers.has("publicSmokePlaceAtNearestObjectAffordance")) {
    debt.push({
      id: "resource-placement-helper",
      status: "prototype-debt",
      domainPath: "n:goldrush:prop-placement",
      reason: "Proof can place at a resource, but final human proof should walk or route there.",
    });
  }
  if (helpers.has("publicSmokePlaceAtExtractionSetpiece")) {
    debt.push({
      id: "cashout-placement-helper",
      status: "prototype-debt",
      domainPath: "n:goldrush:cashout-sites",
      reason: "Proof can place near cashout, but final human proof should navigate to the set-piece.",
    });
  }
  if (helpers.has("actions.extract") || proofTelemetry?.directExtractHelper === true) {
    debt.push({
      id: "direct-extract-helper",
      status: "must-remove",
      domainPath: "n:goldrush:cashout-sites",
      reason: "Cashout should be driven by player interact ticks, not a direct extract action.",
    });
  }
  return debt;
}

function round(value) {
  return Number((Number(value) || 0).toFixed(3));
}
