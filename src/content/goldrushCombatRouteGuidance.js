export const combatRouteGuidanceContract = "goldrush-combat-route-guidance-v1";
export const combatRouteGuidanceDomainPath = "n:goldrush:combat-route-guidance";

const legOrder = Object.freeze([
  "cargo-to-threat-zone",
  "threat-zone-activation",
  "threat-to-cover-route",
  "cover-action-readiness",
  "cover-engagement",
  "combat-receipt-ready",
]);

export function createCombatRouteGuidanceSnapshot({
  extractionLoop = null,
  playerActionSurface = null,
  combatLoopReadiness = null,
  renderer = null,
  localPlayer = null,
  proofTelemetry = null,
  routeMemory = null,
} = {}) {
  const loop = extractionLoop ?? {};
  const position = localPlayer?.position ?? loop.player?.position ?? null;
  const yaw = Number(localPlayer?.look?.yaw ?? loop.player?.look?.yaw ?? localPlayer?.heading ?? loop.player?.heading ?? 0);
  const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);
  const readability = loop.combat?.readability ?? {};
  const threat = selectThreat({ loop, readability, position, cargoAmount });
  const cover = selectCover({ threat, readability, position, routeMemory });
  const coverEngagement = readability.coverEngagement ?? loop.combat?.cover ?? {};
  const receipts = Array.isArray(readability.receipts) ? readability.receipts : Array.isArray(loop.combat?.receipts) ? loop.combat.receipts : [];
  const activeThreatCount = Number(loop.combat?.activeThreatCount ?? 0);
  const target = chooseTarget({
    cargoAmount,
    threat,
    cover,
    coverEngagement,
    position,
  });
  const inputHint = createInputHint({ position, yaw, target });
  const combatInputHint = createCombatInputHint({
    threat,
    cover,
    coverEngagement,
    target,
    activeThreatCount,
    receipts,
  });
  const legs = createLegs({
    cargoAmount,
    threat,
    cover,
    coverEngagement,
    target,
    activeThreatCount,
    receipts,
    playerActionSurface,
    renderer,
  });
  const resolvedLegs = legs.filter((leg) => leg.status === "resolved").map((leg) => leg.id);
  const blockedLegs = legs.filter((leg) => ["blocked", "missing"].includes(leg.status)).map((leg) => leg.id);
  const activeLeg = legs.find((leg) => leg.status === "active")
    ?? legs.find((leg) => leg.status === "ready")
    ?? null;
  const helperDebt = createHelperDebt({ proofTelemetry });

  return {
    contract: combatRouteGuidanceContract,
    domainPath: combatRouteGuidanceDomainPath,
    consumes: [
      "n:control:character-movement",
      "n:goldrush:gold-carrying",
      "n:goldrush:ambush-pressure",
      "n:goldrush:player-action-surface",
      "n:goldrush:combat-loop-readiness",
      "n:render:micro-object-instancing",
    ],
    purpose: "Expose camera-relative route targets from carried gold into readable threat cover so combat setup can be proven by walking instead of direct pose helpers.",
    currentLegId: activeLeg?.id ?? (resolvedLegs.length === legOrder.length ? "complete" : null),
    routeStatus: resolvedLegs.length === legOrder.length
      ? "resolved"
      : blockedLegs.length > 0 && !activeLeg
        ? "blocked"
        : resolvedLegs.length > 0 || activeLeg
          ? "active"
          : "not-started",
    target,
    threatTarget: threat ? createThreatTarget({ threat, position }) : null,
    coverTarget: cover ? createCoverTarget({ cover, position }) : null,
    cameraRelativeInput: inputHint,
    combatInputHint,
    matrix: {
      legOrder,
      legs,
      resolvedLegs,
      blockedLegs,
      resolvedCount: resolvedLegs.length,
      combatRouteStatus: resolvedLegs.length === legOrder.length ? "resolved" : activeLeg ? "active" : "blocked",
    },
    proofPolicy: {
      naturalRouteReady: Boolean(threat && cargoAmount > 0),
      cameraRelativeCombatRoute: Boolean(position && localPlayer?.inputModel?.wasdFollowsCameraYaw === true),
      coverCounterplayRouted: Boolean(cover),
      coverInputReady: Boolean(combatInputHint.cover || coverEngagement?.engaged === true),
      noDirectPoseHelperRequired: helperDebt.every((entry) => entry.severity !== "direct-position-helper"),
    },
    helperDebt,
    routeMemory: routeMemory ? {
      coverTarget: routeMemory.coverTarget ? structuredClone(routeMemory.coverTarget) : null,
      threatId: routeMemory.threatId ?? null,
      latched: Boolean(routeMemory.coverTarget),
    } : null,
    localPlayer: position ? {
      position: roundPosition(position),
      cameraYaw: round(yaw),
      cameraRelativeWasd: localPlayer?.inputModel?.wasdFollowsCameraYaw ?? localPlayer?.look?.movementRelativeToCamera ?? null,
      grounded: localPlayer?.ground?.grounded ?? null,
      terrainBlocked: localPlayer?.terrainCollider?.blocked ?? null,
    } : null,
    nextAction: resolveNextAction({
      cargoAmount,
      threat,
      cover,
      coverEngagement,
      target,
      activeThreatCount,
      receipts,
      combatLoopReadiness,
    }),
    reset: "recomputed-from-extraction-loop-combat-readability-player-action-surface-renderer-and-local-player-state",
  };
}

export function validateCombatRouteGuidance(snapshot) {
  const failures = [];
  if (snapshot?.contract !== combatRouteGuidanceContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== combatRouteGuidanceDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:goldrush:ambush-pressure")) failures.push("missing-ambush-pressure-consumer");
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
  if (snapshot?.combatInputHint && typeof snapshot.combatInputHint.aim !== "boolean") failures.push("invalid-combat-input-aim");
  if (snapshot?.combatInputHint && typeof snapshot.combatInputHint.cover !== "boolean") failures.push("invalid-combat-input-cover");
  if (snapshot?.localPlayer?.cameraRelativeWasd != null && snapshot.localPlayer.cameraRelativeWasd !== true) failures.push("camera-relative-wasd-not-proven");
  if (!Array.isArray(snapshot?.helperDebt)) failures.push("invalid-helper-debt");
  return { passed: failures.length === 0, failures };
}

function selectThreat({ loop, readability, position, cargoAmount }) {
  const readabilityThreats = Object.values(readability?.threats ?? {});
  const combatThreats = loop?.combat?.threats ?? {};
  const markers = Array.isArray(loop?.worldSpaceMarkers) ? loop.worldSpaceMarkers : [];
  const candidates = readabilityThreats.map((entry) => {
    const sourceThreat = combatThreats[entry.threatId] ?? {};
    const marker = markers.find((next) => next.type === "threat" && (next.threatId === entry.threatId || next.id === `marker.${entry.threatId}`)) ?? {};
    const worldPosition = entry.lane?.start ?? sourceThreat.worldPosition ?? marker.worldPosition ?? null;
    return {
      ...structuredClone(entry),
      id: entry.threatId,
      threatId: entry.threatId,
      active: sourceThreat.active === true || entry.status === "active",
      defeated: sourceThreat.defeated === true || entry.status === "defeated",
      worldPosition,
      radius: Number(sourceThreat.radius ?? marker.radius ?? 12),
      conditionRadius: Number(sourceThreat.conditionRadius ?? sourceThreat.radius ?? marker.radius ?? 12),
      distance: distance2D(position, worldPosition),
      markerStatus: marker.status ?? null,
    };
  }).filter((entry) => entry.worldPosition && !entry.defeated);
  if (!candidates.length) return null;
  const statusRank = {
    active: 0,
    aiming: 0,
    committed: 0,
    stalking: cargoAmount > 0 ? 1 : 4,
    latent: cargoAmount > 0 ? 2 : 5,
    defeated: 9,
  };
  return candidates.sort((a, b) => {
    const rankA = statusRank[a.status] ?? 6;
    const rankB = statusRank[b.status] ?? 6;
    if (rankA !== rankB) return rankA - rankB;
    return Number(a.distance ?? 9999) - Number(b.distance ?? 9999);
  })[0];
}

function selectCover({ threat, readability, position, routeMemory }) {
  if (!threat) return null;
  const latchedTarget = routeMemory?.coverTarget;
  if (latchedTarget?.meta?.threatId === threat.threatId) {
    return {
      id: latchedTarget.id,
      threatId: latchedTarget.meta.threatId,
      laneId: latchedTarget.meta.laneId,
      kind: latchedTarget.label ?? "latched-cover",
      worldPosition: latchedTarget.position,
      peekSide: latchedTarget.meta.peekSide ?? "right",
      cameraShoulder: latchedTarget.meta.cameraShoulder ?? null,
      coverScore: latchedTarget.meta.coverScore ?? 0,
      blocksLane: Boolean(latchedTarget.meta.blocksLane),
      status: "latched",
      distance: distance2D(position, latchedTarget.position),
      cue: "latched-hard-cover-route",
    };
  }
  const coverEntries = Array.isArray(threat.cover) ? threat.cover : [];
  if (!coverEntries.length) return null;
  const engagedId = readability?.coverEngagement?.coverId ?? null;
  const recommendedId = threat.recommendedCoverId ?? readability?.recommendedCoverIds?.[0] ?? null;
  const candidates = coverEntries.map((cover) => ({
    ...structuredClone(cover),
    distance: distance2D(position, cover.worldPosition),
  }));
  const engaged = engagedId ? candidates.find((cover) => cover.id === engagedId) : null;
  if (engaged) return engaged;
  const recommended = recommendedId ? candidates.find((cover) => cover.id === recommendedId) : null;
  if (recommended) return recommended;
  return candidates.sort((a, b) => Number(b.coverScore ?? 0) - Number(a.coverScore ?? 0) || Number(a.distance ?? 9999) - Number(b.distance ?? 9999))[0] ?? null;
}

function chooseTarget({ cargoAmount, threat, cover, coverEngagement, position }) {
  if (cargoAmount <= 0 || !threat) return null;
  if (coverEngagement?.engaged === true) return null;
  if (cover) return createCoverTarget({ cover, position });
  return createThreatTarget({ threat, position });
}

function createThreatTarget({ threat, position }) {
  const radius = Math.max(2.6, Math.min(4.5, Number(threat.radius ?? 12) * 0.3));
  return createTarget({
    kind: "threat-zone",
    id: threat.threatId ?? threat.id,
    label: threat.label ?? "Claim threat",
    action: "enter-threat-zone",
    domainPath: "n:goldrush:ambush-pressure",
    position: threat.worldPosition,
    radius,
    actionRadius: Math.max(radius, Number(threat.conditionRadius ?? threat.radius ?? 12)),
    actionInRange: threat.active === true || threat.status === "active",
    positionSource: "n:goldrush:ambush-pressure",
    currentPosition: position,
  });
}

function createCoverTarget({ cover, position }) {
  return createTarget({
    kind: "cover",
    id: cover.id,
    label: cover.kind ?? "Cover",
    action: "take-cover",
    domainPath: "n:goldrush:ambush-pressure",
    position: cover.worldPosition,
    radius: 1.35,
    actionRadius: 2.35,
    actionInRange: Number(cover.distance ?? distance2D(position, cover.worldPosition)) <= 2.35,
    positionSource: "n:goldrush:ambush-pressure",
    currentPosition: position,
    meta: {
      threatId: cover.threatId,
      laneId: cover.laneId,
      peekSide: cover.peekSide ?? "right",
      cameraShoulder: cover.cameraShoulder ?? null,
      coverScore: round(cover.coverScore),
      blocksLane: Boolean(cover.blocksLane),
    },
  });
}

function createTarget({
  kind,
  id,
  label,
  action,
  domainPath,
  position,
  radius,
  actionRadius = radius,
  actionInRange = false,
  positionSource,
  currentPosition,
  meta = null,
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
    meta,
  };
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
      reason: target ? "missing-player-position" : "no-active-combat-route-target",
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

function createCombatInputHint({ threat, cover, coverEngagement, target, activeThreatCount, receipts }) {
  const coverEngaged = coverEngagement?.engaged === true;
  const receiptReady = receipts.some((receipt) => ["shot-fired", "player-damaged", "cover-engaged", "cover-peek"].includes(receipt.type));
  const shouldCover = Boolean(target?.kind === "cover" && target.actionInRange && !coverEngaged);
  const shouldAim = Boolean(activeThreatCount > 0 || coverEngaged || shouldCover);
  return {
    aim: shouldAim,
    cover: shouldCover || coverEngaged,
    fire: Boolean(coverEngaged && activeThreatCount > 0 && !receiptReady),
    peek: coverEngagement?.peekSide ?? cover?.peekSide ?? "right",
    threatId: threat?.threatId ?? threat?.id ?? null,
    coverId: coverEngagement?.coverId ?? cover?.id ?? null,
    reason: coverEngaged
      ? receiptReady ? "cover-engaged-with-combat-receipt" : "peek-and-fire-from-cover"
      : shouldCover ? "take-recommended-cover"
        : shouldAim ? "aim-while-threat-active"
          : target ? "walk-to-combat-route-target" : "no-combat-input",
  };
}

function createLegs({
  cargoAmount,
  threat,
  cover,
  coverEngagement,
  target,
  activeThreatCount,
  receipts,
  playerActionSurface,
  renderer,
}) {
  const activeAction = playerActionSurface?.primaryAction ?? {};
  const rendererMarkers = renderer?.procedural?.gameplay?.extractionLoopMarkers ?? {};
  const coverEngaged = coverEngagement?.engaged === true;
  const receiptReady = receipts.some((receipt) => ["shot-fired", "player-damaged", "cover-engaged", "cover-peek"].includes(receipt.type));
  return [
    createLeg({
      id: "cargo-to-threat-zone",
      label: "Carried gold exposes a readable threat route",
      domainPath: "n:goldrush:gold-carrying",
      status: cargoAmount > 0 && threat ? "resolved" : cargoAmount > 0 ? "missing" : "blocked",
      target,
      evidence: [
        cargoAmount > 0 ? `cargo:${round(cargoAmount)}` : null,
        threat?.threatId ? `threat:${threat.threatId}` : null,
        threat?.status ? `status:${threat.status}` : null,
      ],
      gaps: cargoAmount > 0 ? threat ? [] : ["carried cargo has no threat route target"] : ["requires carried gold"],
    }),
    createLeg({
      id: "threat-zone-activation",
      label: "Walking with cargo activates ambush pressure",
      domainPath: "n:goldrush:ambush-pressure",
      status: activeThreatCount > 0 || threat?.active === true ? "resolved" : threat ? "active" : "missing",
      target: threat ? createThreatTarget({ threat, position: null }) : null,
      evidence: [
        activeThreatCount > 0 ? `activeThreats:${activeThreatCount}` : null,
        threat?.distance != null ? `distance:${round(threat.distance)}` : null,
        threat?.conditionRadius ? `radius:${round(threat.conditionRadius)}` : null,
        threat?.lane?.id ? `lane:${threat.lane.id}` : null,
      ],
      gaps: activeThreatCount > 0 || threat?.active === true ? [] : threat ? ["walk into the cargo-noise threat radius"] : ["no threat packet available"],
    }),
    createLeg({
      id: "threat-to-cover-route",
      label: "Readable cover target is routed from the threat lane",
      domainPath: "n:control:character-movement",
      status: coverEngaged ? "resolved" : cover && target?.kind === "cover" && target.inRange ? "ready" : cover && target?.kind === "cover" ? "active" : threat ? "missing" : "blocked",
      target: cover ? createCoverTarget({ cover, position: null }) : target,
      evidence: [
        cover?.id ? `cover:${cover.id}` : null,
        cover?.distance != null ? `distance:${round(cover.distance)}` : null,
        cover?.blocksLane ? "blocks-lane" : null,
        Array.isArray(rendererMarkers.coverIds) && cover?.id && rendererMarkers.coverIds.includes(cover.id) ? "rendered-cover" : null,
      ],
      gaps: cover ? [] : threat ? ["threat has no cover descriptor"] : ["requires threat route"],
    }),
    createLeg({
      id: "cover-action-readiness",
      label: "Cover action is player-facing and input-ready",
      domainPath: "n:goldrush:player-action-surface",
      status: coverEngaged ? "resolved" : activeAction?.action === "take-cover" || activeAction?.action === "hold-cover" || (target?.kind === "cover" && target.actionInRange) ? "ready" : cover ? "active" : "blocked",
      target,
      evidence: [
        activeAction?.action ? `action:${activeAction.action}` : null,
        target?.actionInRange ? "action-in-range" : null,
        cover?.peekSide ? `peek:${cover.peekSide}` : null,
      ],
      gaps: coverEngaged || activeAction?.action === "take-cover" || target?.actionInRange ? [] : ["walk close enough for take-cover input"],
    }),
    createLeg({
      id: "cover-engagement",
      label: "Player can engage cover without direct combat setup",
      domainPath: "n:goldrush:ambush-pressure",
      status: coverEngaged ? "resolved" : target?.kind === "cover" && target.actionInRange ? "ready" : cover ? "blocked" : "missing",
      target,
      evidence: [
        coverEngagement?.coverId ? `engaged:${coverEngagement.coverId}` : null,
        coverEngagement?.damageReduction ? `reduction:${round(coverEngagement.damageReduction)}` : null,
        Array.isArray(rendererMarkers.engagedCoverIds) && rendererMarkers.engagedCoverIds.includes(coverEngagement?.coverId) ? "rendered:engaged-cover" : null,
      ],
      gaps: coverEngaged ? [] : target?.actionInRange ? [] : ["cover exists but is not engaged yet"],
    }),
    createLeg({
      id: "combat-receipt-ready",
      label: "Combat route produces receipt-backed next actions",
      domainPath: "n:goldrush:combat-loop-readiness",
      status: receiptReady ? "resolved" : coverEngaged ? "ready" : activeThreatCount > 0 ? "active" : "blocked",
      target: null,
      evidence: [
        receipts.at(-1)?.receiptId ? `receipt:${receipts.at(-1).receiptId}` : null,
        receipts.at(-1)?.type ? `type:${receipts.at(-1).type}` : null,
        activeThreatCount > 0 ? `activeThreats:${activeThreatCount}` : null,
      ],
      gaps: receiptReady ? [] : coverEngaged ? ["peek or fire from cover to create a combat receipt"] : ["requires active threat and cover route"],
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

function resolveNextAction({ cargoAmount, threat, cover, coverEngagement, target, activeThreatCount, receipts, combatLoopReadiness }) {
  if (cargoAmount <= 0) return "mine-gold-first";
  if (!threat) return "carry-gold-until-threat-route-appears";
  if (coverEngagement?.engaged === true) {
    const hasCombatReceipt = receipts.some((receipt) => ["shot-fired", "player-damaged", "cover-peek"].includes(receipt.type));
    if (!hasCombatReceipt) return activeThreatCount > 0 ? "peek-and-fire-from-cover" : "hold-cover-and-watch-threat";
    return combatLoopReadiness?.matrix?.combatStatus === "resolved" ? "continue-extraction" : "continue-combat-or-extract";
  }
  if (target?.kind === "cover" && target.actionInRange) return "take-cover";
  if (cover) return "walk-to-cover";
  if (activeThreatCount > 0) return "break-line-of-sight";
  return "walk-into-threat-zone";
}

function createHelperDebt({ proofTelemetry }) {
  const helpers = Array.isArray(proofTelemetry?.usedHelpers) ? proofTelemetry.usedHelpers : [];
  return helpers.map((helper) => ({
    id: helper === "directCombatRoutePose" ? "direct-combat-route-pose-helper" : String(helper),
    helper,
    severity: helper === "directCombatRoutePose" ? "direct-position-helper" : "proof-helper",
    replacement: helper === "directCombatRoutePose" ? "drive GameHost.tick with combatRouteGuidance.cameraRelativeInput" : "replace with route-owned browser input",
  }));
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
  const next = Number(value);
  if (!Number.isFinite(next)) return 0;
  return Number(next.toFixed(3));
}
