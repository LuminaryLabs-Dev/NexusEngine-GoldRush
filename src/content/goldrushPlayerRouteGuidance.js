export const playerRouteGuidanceContract = "goldrush-player-route-guidance-v1";
export const playerRouteGuidanceDomainPath = "n:goldrush:player-route-guidance";

const legOrder = Object.freeze([
  "spawn-to-resource",
  "mine-interaction",
  "resource-to-cashout",
  "cashout-interaction",
]);

export function createPlayerRouteGuidanceSnapshot({
  extractionLoop = null,
  playerActionSurface = null,
  objectInteraction = null,
  localPlayer = null,
  match = null,
  results = null,
} = {}) {
  const loop = extractionLoop ?? {};
  const position = localPlayer?.position ?? null;
  const yaw = Number(localPlayer?.look?.yaw ?? localPlayer?.heading ?? 0);
  const surface = playerActionSurface ?? {};
  const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);
  const miningReceipts = Array.isArray(loop.mining?.receipts) ? loop.mining.receipts : [];
  const extracted = Boolean(loop.receipt?.extracted);
  const resultReady = Boolean(results?.winner?.id || match?.phase === "results");
  const mineTarget = resolveMineTarget({ objectInteraction, surface, position });
  const cashoutTarget = resolveCashoutTarget({ loop, position });
  const activeTarget = chooseTarget({
    cargoAmount,
    extracted,
    resultReady,
    mineTarget,
    cashoutTarget,
    loop,
  });
  const inputHint = createInputHint({ position, yaw, target: activeTarget });
  const legs = createLegs({
    mineTarget,
    cashoutTarget,
    miningReceipts,
    cargoAmount,
    extracted,
    resultReady,
    loop,
  });
  const resolvedLegs = legs.filter((leg) => leg.status === "resolved").map((leg) => leg.id);
  const activeLeg = legs.find((leg) => leg.status === "active")
    ?? legs.find((leg) => leg.status === "ready")
    ?? null;
  const blockedLegs = legs.filter((leg) => ["blocked", "missing"].includes(leg.status)).map((leg) => leg.id);

  return {
    contract: playerRouteGuidanceContract,
    domainPath: playerRouteGuidanceDomainPath,
    consumes: [
      "n:control:character-movement",
      "n:gameplay:interaction-hold",
      "n:goldrush:player-action-surface",
      "n:goldrush:mine-hold-action",
      "n:goldrush:cashout-sites",
      "n:goldrush:player-driven-extraction-route",
    ],
    purpose: "Expose route targets and camera-relative movement hints for walking the mine-carry-cashout loop without proof placement helpers.",
    currentLegId: activeLeg?.id ?? (resolvedLegs.length === legOrder.length ? "complete" : null),
    routeStatus: resolvedLegs.length === legOrder.length
      ? "resolved"
      : blockedLegs.length > 0 && !activeLeg
        ? "blocked"
        : resolvedLegs.length > 0 || activeLeg
          ? "active"
          : "not-started",
    target: activeTarget,
    cameraRelativeInput: inputHint,
    matrix: {
      legOrder,
      legs,
      resolvedLegs,
      blockedLegs,
      resolvedCount: resolvedLegs.length,
    },
    localPlayer: position ? {
      position: roundPosition(position),
      cameraYaw: round(yaw),
      cameraRelativeWasd: localPlayer?.inputModel?.wasdFollowsCameraYaw ?? localPlayer?.look?.movementRelativeToCamera ?? null,
      grounded: localPlayer?.ground?.grounded ?? null,
      terrainBlocked: localPlayer?.terrainCollider?.blocked ?? null,
    } : null,
    nextAction: resolveNextAction({ cargoAmount, extracted, resultReady, mineTarget, cashoutTarget, loop }),
    reset: "recomputed-from-player-position-object-affordance-action-surface-and-extraction-loop",
  };
}

export function validatePlayerRouteGuidance(snapshot) {
  const failures = [];
  if (snapshot?.contract !== playerRouteGuidanceContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== playerRouteGuidanceDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:control:character-movement")) failures.push("missing-character-movement-consumer");
  if (!Array.isArray(snapshot?.matrix?.legs) || snapshot.matrix.legs.length !== legOrder.length) failures.push("invalid-leg-matrix");
  for (const legId of legOrder) {
    if (!snapshot?.matrix?.legs?.some((leg) => leg.id === legId)) failures.push(`missing-leg:${legId}`);
  }
  for (const leg of snapshot?.matrix?.legs ?? []) {
    if (!leg.domainPath?.startsWith("n:")) failures.push(`invalid-leg-domain:${leg.id}`);
    if (!["resolved", "ready", "active", "blocked", "missing"].includes(leg.status)) failures.push(`invalid-leg-status:${leg.id}`);
    if (!Array.isArray(leg.evidence) || !Array.isArray(leg.gaps)) failures.push(`invalid-leg-evidence:${leg.id}`);
  }
  if (!Number.isFinite(snapshot?.matrix?.resolvedCount)) failures.push("invalid-resolved-count");
  if (snapshot?.target && (!Number.isFinite(snapshot.target.position?.x) || !Number.isFinite(snapshot.target.position?.z))) failures.push("invalid-target-position");
  if (snapshot?.cameraRelativeInput && !Array.isArray(snapshot.cameraRelativeInput.keys)) failures.push("invalid-input-keys");
  if (snapshot?.localPlayer && snapshot.localPlayer.cameraRelativeWasd !== true) failures.push("camera-relative-wasd-not-proven");
  return { passed: failures.length === 0, failures };
}

function resolveMineTarget({ objectInteraction, surface, position }) {
  const nearest = objectInteraction?.nearest ?? {};
  const selected = nearest.selected?.action === "mine-gold" ? nearest.selected : null;
  const candidate = selected
    ?? nearest.candidates?.find((entry) => entry.action === "mine-gold")
    ?? null;
  const action = surface?.availableActions?.find((entry) => entry.action === "mine-gold")
    ?? (surface?.primaryAction?.action === "mine-gold" ? surface.primaryAction : null);
  if (!candidate) return null;
  return createTarget({
    kind: "resource",
    id: candidate.kitId ?? action?.targetId ?? "mine-object",
    label: candidate.prompt ?? action?.targetLabel ?? "Gold seam",
    position: candidate.position,
    radius: Number(candidate.radius ?? 1.35),
    actionRadius: Number(candidate.allowedDistance ?? candidate.radius ?? 3.2),
    actionInRange: Boolean(candidate.inRange || action?.inRange),
    action: "mine-gold",
    domainPath: candidate.domainPath ?? "n:gameplay:interaction-hold",
    positionSource: candidate.placement?.source ?? "n:world:placement-raycast",
    currentPosition: position,
  });
}

function resolveCashoutTarget({ loop, position }) {
  const sites = Object.values(loop.extraction?.sites ?? {});
  if (!sites.length) return null;
  const target = sites
    .map((site) => {
      const distance = distance2D(position, site.worldPosition);
      return {
        ...site,
        distance,
      };
    })
    .sort((a, b) => Number(a.distance ?? 9999) - Number(b.distance ?? 9999))[0];
  return createTarget({
    kind: "cashout",
    id: target.id,
    label: target.label ?? "Cashout depot",
    position: target.worldPosition,
    radius: Number(target.radius ?? 6),
    actionRadius: Number(target.radius ?? 6),
    actionInRange: Boolean(target.inRange || target.distance <= Number(target.radius ?? 6) || loop.extraction?.inVolume),
    action: "cashout-gold",
    domainPath: "n:goldrush:cashout-sites",
    positionSource: "n:gameplay:extraction",
    currentPosition: position,
  });
}

function createTarget({
  kind,
  id,
  label,
  position,
  radius,
  actionRadius = radius,
  actionInRange = false,
  action,
  domainPath,
  positionSource,
  currentPosition,
}) {
  const safePosition = {
    x: Number(position?.x ?? 0),
    y: Number(position?.y ?? 0),
    z: Number(position?.z ?? 0),
  };
  const distance = distance2D(currentPosition, safePosition);
  const arrived = distance <= Number(radius ?? 0);
  const actionAvailable = actionInRange || distance <= Number(actionRadius ?? radius ?? 0);
  return {
    kind,
    id,
    label,
    action,
    domainPath,
    position: roundPosition(safePosition),
    radius: round(radius),
    actionRadius: round(actionRadius),
    distance: round(distance),
    inRange: arrived,
    actionInRange: Boolean(actionAvailable),
    positionSource,
  };
}

function chooseTarget({ cargoAmount, extracted, resultReady, mineTarget, cashoutTarget, loop }) {
  if (resultReady || extracted) return null;
  if (cargoAmount > 0 || loop.extraction?.progress > 0) return cashoutTarget;
  return mineTarget;
}

function createInputHint({ position, yaw, target }) {
  if (!position || !target) {
    return {
      mode: "idle",
      keys: [],
      lookDelta: { x: 0, y: 0 },
      yawDelta: 0,
      distance: 0,
      arrivalRadius: 0,
      reason: target ? "missing-player-position" : "no-active-target",
    };
  }
  const dx = Number(target.position.x) - Number(position.x ?? 0);
  const dz = Number(target.position.z) - Number(position.z ?? 0);
  const distance = Math.hypot(dx, dz);
  if (distance <= Number(target.radius ?? 0)) {
    return {
      mode: "arrived",
      keys: [],
      lookDelta: { x: 0, y: 0 },
      yawDelta: 0,
      distance: round(distance),
      arrivalRadius: target.radius,
      reason: "target-in-range",
    };
  }
  const desiredYaw = Math.atan2(dx, dz);
  const yawDelta = normalizeAngle(desiredYaw - yaw);
  return {
    mode: "camera-relative-walk",
    keys: distance > 4 ? ["w", "Shift"] : ["w"],
    lookDelta: {
      x: round(-yawDelta / 0.0026),
      y: 0,
    },
    yawDelta: round(yawDelta),
    desiredYaw: round(desiredYaw),
    distance: round(distance),
    arrivalRadius: target.radius,
    reason: "turn-camera-then-walk-forward",
  };
}

function createLegs({
  mineTarget,
  cashoutTarget,
  miningReceipts,
  cargoAmount,
  extracted,
  resultReady,
  loop,
}) {
  const mined = miningReceipts.length > 0 || cargoAmount > 0 || extracted || resultReady;
  const cashoutStarted = Number(loop.extraction?.progress ?? 0) > 0;
  return [
    createLeg({
      id: "spawn-to-resource",
      label: "Walk from gold-field spawn to readable gold object",
      domainPath: "n:control:character-movement",
      status: mined ? "resolved" : mineTarget?.inRange ? "ready" : mineTarget ? "active" : "missing",
      target: mineTarget,
      evidence: [
        mineTarget?.id ? `target:${mineTarget.id}` : null,
        mineTarget?.distance != null ? `distance:${mineTarget.distance}` : null,
        mineTarget?.positionSource ? `position:${mineTarget.positionSource}` : null,
      ],
      gaps: mineTarget ? [] : ["no mineable route target"],
    }),
    createLeg({
      id: "mine-interaction",
      label: "Hold mine interaction after walking into range",
      domainPath: "n:goldrush:mine-hold-action",
      status: mined ? "resolved" : loop.mining?.progress > 0 ? "active" : mineTarget?.inRange ? "ready" : mineTarget ? "blocked" : "missing",
      target: mineTarget,
      evidence: [
        miningReceipts.at(-1)?.receiptId ? `receipt:${miningReceipts.at(-1).receiptId}` : null,
        cargoAmount > 0 ? `cargo:${cargoAmount}` : null,
        loop.mining?.progress > 0 ? `progress:${round(loop.mining.progress)}` : null,
      ],
      gaps: mined || mineTarget?.inRange ? [] : ["player must reach a mineable object before hold can resolve"],
    }),
    createLeg({
      id: "resource-to-cashout",
      label: "Walk carried gold to cashout set-piece",
      domainPath: "n:control:character-movement",
      status: extracted || resultReady || cashoutStarted ? "resolved" : cargoAmount > 0 && cashoutTarget?.inRange ? "ready" : cargoAmount > 0 && cashoutTarget ? "active" : cargoAmount > 0 ? "missing" : "blocked",
      target: cashoutTarget,
      evidence: [
        cargoAmount > 0 ? `cargo:${cargoAmount}` : null,
        cashoutTarget?.id ? `target:${cashoutTarget.id}` : null,
        cashoutTarget?.distance != null ? `distance:${cashoutTarget.distance}` : null,
      ],
      gaps: cargoAmount > 0 ? cashoutTarget ? [] : ["no cashout route target"] : ["requires carried gold"],
    }),
    createLeg({
      id: "cashout-interaction",
      label: "Hold cashout interaction at visible depot",
      domainPath: "n:goldrush:cashout-sites",
      status: extracted || resultReady ? "resolved" : cashoutStarted ? "active" : cargoAmount > 0 && cashoutTarget?.inRange ? "ready" : cargoAmount > 0 ? "blocked" : "missing",
      target: cashoutTarget,
      evidence: [
        loop.receipt?.receiptId ? `receipt:${loop.receipt.receiptId}` : null,
        loop.extraction?.progress > 0 ? `progress:${round(loop.extraction.progress)}` : null,
        cashoutTarget?.inRange ? "cashout-in-range" : null,
      ],
      gaps: extracted || resultReady || cashoutStarted || cashoutTarget?.inRange ? [] : ["player must reach cashout set-piece before hold can resolve"],
    }),
  ];
}

function createLeg({
  id,
  label,
  domainPath,
  status,
  target,
  evidence,
  gaps,
}) {
  return {
    id,
    label,
    domainPath,
    status,
    targetId: target?.id ?? null,
    targetKind: target?.kind ?? null,
    evidence: evidence.filter(Boolean),
    gaps,
  };
}

function resolveNextAction({ cargoAmount, extracted, resultReady, mineTarget, cashoutTarget, loop }) {
  if (resultReady) return "review-results";
  if (extracted) return "wait-for-results";
  if (cargoAmount > 0 && loop.extraction?.progress > 0) return "keep-holding-cashout";
  if (cargoAmount > 0 && cashoutTarget?.inRange) return "hold-cashout";
  if (cargoAmount > 0) return "walk-to-cashout";
  if (loop.mining?.progress > 0) return "keep-holding-mine";
  if (mineTarget?.inRange) return "hold-mine";
  return mineTarget ? "walk-to-gold" : "search-for-gold";
}

function distance2D(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  return Math.hypot(Number(a.x ?? 0) - Number(b.x ?? 0), Number(a.z ?? 0) - Number(b.z ?? 0));
}

function normalizeAngle(value) {
  let next = Number(value) || 0;
  while (next > Math.PI) next -= Math.PI * 2;
  while (next < -Math.PI) next += Math.PI * 2;
  return next;
}

function roundPosition(position) {
  return {
    x: round(position?.x),
    y: round(position?.y),
    z: round(position?.z),
  };
}

function round(value) {
  return Number((Number(value) || 0).toFixed(3));
}
