export const playerGuidanceCueContract = "goldrush-player-guidance-cue-v1";
export const playerGuidanceCueDomainPath = "n:goldrush:player-guidance-cue";

export function createPlayerGuidanceCueSnapshot({
  playerRouteGuidance = null,
  playerActionSurface = null,
  localPlayer = null,
} = {}) {
  const route = playerRouteGuidance ?? {};
  const surface = playerActionSurface ?? {};
  const target = route.target ?? null;
  const playerPosition = localPlayer?.position ?? route.localPlayer?.position ?? null;
  const visible = Boolean(target && route.routeStatus !== "resolved");
  const action = resolveCueAction({ target, surface });
  const cueRole = resolveCueRole({ route, target, action });
  const directionYaw = resolveDirectionYaw({ route, target, playerPosition, localPlayer });
  const distance = Number(target?.distance ?? route.cameraRelativeInput?.distance ?? 0);
  const distanceBand = resolveDistanceBand({ target, distance });
  const worldPosition = resolveCueWorldPosition({ target, playerPosition, directionYaw });

  return {
    contract: playerGuidanceCueContract,
    domainPath: playerGuidanceCueDomainPath,
    consumes: [
      "n:goldrush:player-route-guidance",
      "n:goldrush:player-action-surface",
      "n:control:character-movement",
    ],
    purpose: "Convert route guidance and action-surface state into one player-facing diegetic cue without relying on debug overlays.",
    visible,
    noDebugOverlay: true,
    displayRole: "diegetic-route-and-action-cue",
    currentLegId: route.currentLegId ?? null,
    routeStatus: route.routeStatus ?? "unknown",
    nextAction: route.nextAction ?? action?.nextAction ?? null,
    target: target ? {
      kind: target.kind ?? null,
      id: target.id ?? null,
      label: target.label ?? null,
      action: target.action ?? action?.action ?? null,
      domainPath: target.domainPath ?? null,
      position: roundPosition(target.position),
      distance: round(distance),
      distanceBand,
      radius: round(target.radius ?? 0),
      actionRadius: round(target.actionRadius ?? target.radius ?? 0),
      inRange: Boolean(target.inRange),
      actionInRange: Boolean(target.actionInRange),
      positionSource: target.positionSource ?? null,
    } : null,
    cue: {
      role: cueRole,
      shape: resolveShape({ target, cueRole }),
      colorRole: resolveColorRole(target?.kind),
      colorOnly: false,
      markerHeight: cueRole === "hold-readiness" ? 0.42 : 0.24,
      directionYaw: round(directionYaw),
      worldPosition,
      suggestedKeys: Array.isArray(route.cameraRelativeInput?.keys)
        ? [...route.cameraRelativeInput.keys]
        : [],
      yawDelta: round(route.cameraRelativeInput?.yawDelta ?? 0),
      primaryInput: action?.input ?? (target?.actionInRange ? "E" : null),
      pulseRole: target?.actionInRange ? "steady-hold-ready" : "low-frequency-direction",
    },
    action: action ? {
      action: action.action,
      input: action.input,
      prompt: action.prompt,
      nextAction: action.nextAction,
      inRange: Boolean(action.inRange),
      holdRatio: round(action.hold?.ratio ?? 0),
      targetId: action.targetId ?? null,
    } : null,
    readability: {
      eyeLine: "near-player-forward",
      shapeLanguage: ["arrow", "ring", "height-post"],
      noColorOnlyCriticalInfo: true,
      reducedHudDependency: true,
      clutterPolicy: "one-active-world-cue",
    },
    reset: "recomputed-from-route-guidance-action-surface-and-local-player",
  };
}

export function validatePlayerGuidanceCue(snapshot) {
  const failures = [];
  if (snapshot?.contract !== playerGuidanceCueContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== playerGuidanceCueDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:goldrush:player-route-guidance")) failures.push("missing-route-guidance-consumer");
  if (!snapshot?.consumes?.includes("n:goldrush:player-action-surface")) failures.push("missing-action-surface-consumer");
  if (snapshot?.noDebugOverlay !== true) failures.push("debug-overlay-required");
  if (snapshot?.readability?.noColorOnlyCriticalInfo !== true) failures.push("color-only-critical-info");
  if (snapshot?.readability?.clutterPolicy !== "one-active-world-cue") failures.push("invalid-clutter-policy");
  if (snapshot?.visible) {
    if (!snapshot.target?.id || !snapshot.target?.kind) failures.push("visible-cue-missing-target");
    if (!["resource", "cashout"].includes(snapshot.target.kind)) failures.push(`invalid-target-kind:${snapshot.target.kind}`);
    if (!Number.isFinite(snapshot.target.position?.x) || !Number.isFinite(snapshot.target.position?.z)) failures.push("invalid-target-position");
    if (!Number.isFinite(snapshot.cue?.worldPosition?.x) || !Number.isFinite(snapshot.cue?.worldPosition?.z)) failures.push("invalid-cue-position");
    if (!Number.isFinite(snapshot.cue?.directionYaw)) failures.push("invalid-cue-yaw");
    if (snapshot.cue?.colorOnly !== false) failures.push("cue-color-only");
    if (!Array.isArray(snapshot.cue?.suggestedKeys)) failures.push("invalid-suggested-keys");
  }
  return { passed: failures.length === 0, failures };
}

function resolveCueRole({ route, target, action }) {
  if (!target) return "hidden";
  if (target.actionInRange || route?.cameraRelativeInput?.mode === "arrived") return "hold-readiness";
  if (action?.action === "take-cover" || action?.action === "hold-cover") return "threat-response";
  return "world-route-direction";
}

function resolveCueAction({ target, surface }) {
  const actions = [
    surface?.primaryAction,
    ...(Array.isArray(surface?.availableActions) ? surface.availableActions : []),
  ].filter(Boolean);
  if (target?.action) {
    const routeTargetAction = actions.find((action) => action.action === target.action);
    if (routeTargetAction) return routeTargetAction;
  }
  if (target?.id) {
    const targetIdAction = actions.find((action) => action.targetId === target.id);
    if (targetIdAction) return targetIdAction;
  }
  if (target?.domainPath) {
    const domainAction = actions.find((action) => action.domainPath === target.domainPath);
    if (domainAction) return domainAction;
  }
  return surface?.primaryAction ?? null;
}

function resolveDirectionYaw({ route, target, playerPosition, localPlayer }) {
  if (Number.isFinite(route?.cameraRelativeInput?.desiredYaw)) return Number(route.cameraRelativeInput.desiredYaw);
  if (target?.position && playerPosition) {
    return Math.atan2(
      Number(target.position.x ?? 0) - Number(playerPosition.x ?? 0),
      Number(target.position.z ?? 0) - Number(playerPosition.z ?? 0)
    );
  }
  return Number(localPlayer?.look?.yaw ?? localPlayer?.heading ?? 0);
}

function resolveDistanceBand({ target, distance }) {
  if (!target) return "none";
  if (target.actionInRange) return "action-ready";
  if (target.inRange) return "arrived";
  if (distance <= 8) return "near";
  if (distance <= 28) return "mid";
  return "far";
}

function resolveCueWorldPosition({ target, playerPosition, directionYaw }) {
  if (!target) return null;
  if (!playerPosition) return roundPosition(target.position);
  const distance = Math.min(3.2, Math.max(1.15, Number(target.distance ?? 1.8) * 0.28));
  return roundPosition({
    x: Number(playerPosition.x ?? 0) + Math.sin(directionYaw) * distance,
    y: Math.max(Number(playerPosition.y ?? 0), Number(target.position?.y ?? 0)) + 0.18,
    z: Number(playerPosition.z ?? 0) + Math.cos(directionYaw) * distance,
  });
}

function resolveShape({ target, cueRole }) {
  if (!target) return "hidden";
  if (cueRole === "hold-readiness") return target.kind === "cashout" ? "depot-hold-ring" : "claim-hold-ring";
  if (target.kind === "cashout") return "depot-route-arrow";
  return "claim-route-arrow";
}

function resolveColorRole(kind) {
  if (kind === "cashout") return "teal-cashout";
  if (kind === "resource") return "gold-resource";
  return "neutral-white";
}

function roundPosition(position) {
  if (!position) return null;
  return {
    x: round(position.x),
    y: round(position.y),
    z: round(position.z),
  };
}

function round(value) {
  return Number((Number(value) || 0).toFixed(3));
}
