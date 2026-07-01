export const playerActionSurfaceContract = "goldrush-player-action-surface-v1";
export const playerActionSurfaceDomainPath = "n:goldrush:player-action-surface";

export function createPlayerActionSurfaceSnapshot({
  extractionLoop = null,
  objectInteraction = null,
  localPlayer = null,
} = {}) {
  const loop = extractionLoop ?? {};
  const selection = objectInteraction?.nearest?.selected ?? objectInteraction?.last?.selection?.selected ?? null;
  const mining = resolveMiningAction(loop, selection);
  const extraction = resolveExtractionAction(loop);
  const combat = resolveCombatAction(loop);
  const cargo = loop.player?.cargo ?? {};
  const availableActions = [
    mining,
    extraction,
    combat,
    resolveSelectedInspectAction(selection),
  ].filter(Boolean);
  const primaryAction = choosePrimaryAction({ availableActions, cargo });
  return {
    contract: playerActionSurfaceContract,
    domainPath: playerActionSurfaceDomainPath,
    consumes: [
      "n:gameplay:interaction-hold",
      "n:goldrush:mine-hold-action",
      "n:gameplay:extraction",
      "n:goldrush:gold-carrying",
      "n:goldrush:ambush-pressure",
    ],
    scope: "goldrush-custom-gameplay-orchestration",
    purpose: "Expose one player-facing action surface for prompts, hold progress, risk, and next action.",
    localPlayer: {
      grounded: localPlayer?.ground?.grounded ?? null,
      heading: round(localPlayer?.heading ?? 0),
      cameraYaw: round(localPlayer?.look?.yaw ?? 0),
    },
    primaryAction,
    availableActions,
    cargo: {
      amount: Number(cargo.goldDust ?? cargo.totalValue ?? 0),
      weightClass: cargo.mobility?.weightClass ?? "empty",
      nextAction: cargo.mobility?.nextAction ?? cargo.visual?.nextAction ?? "prospect",
    },
    risk: {
      phase: loop.phase ?? "unknown",
      activeThreatCount: Number(loop.combat?.activeThreatCount ?? 0),
      pressure: round(loop.combat?.pressure ?? 0),
      extractionContest: extraction?.contestStatus ?? "none",
    },
    reset: "recomputed-from-source-snapshots",
  };
}

export function validatePlayerActionSurface(snapshot) {
  const failures = [];
  if (snapshot?.contract !== playerActionSurfaceContract) failures.push("invalid-contract");
  if (snapshot?.domainPath !== playerActionSurfaceDomainPath) failures.push("invalid-domain-path");
  if (!Array.isArray(snapshot?.consumes) || !snapshot.consumes.includes("n:gameplay:interaction-hold")) failures.push("missing-interaction-consumer");
  if (!snapshot?.primaryAction?.action) failures.push("missing-primary-action");
  if (!Array.isArray(snapshot?.availableActions)) failures.push("missing-available-actions");
  if (snapshot?.primaryAction?.hold?.active && !(snapshot.primaryAction.hold.progress >= 0)) failures.push("invalid-hold-progress");
  if (!snapshot?.risk || !Number.isFinite(snapshot.risk.activeThreatCount)) failures.push("invalid-risk");
  return { passed: failures.length === 0, failures };
}

function resolveMiningAction(loop, selection) {
  const selectedMine = selection?.action === "mine-gold" ? selection : null;
  const activeSiteId = loop.mining?.activeSiteId ?? selectedMine?.target?.siteId ?? null;
  const site = activeSiteId ? loop.mining?.sites?.[activeSiteId] : null;
  if (!selectedMine && !site) return null;
  const required = Number(site?.holdSeconds ?? 0);
  const progress = Number(loop.mining?.activeSiteId === site?.id ? loop.mining?.progress ?? 0 : 0);
  return {
    action: "mine-gold",
    domainPath: "n:goldrush:mine-hold-action",
    priority: selectedMine?.inRange || site?.inRange ? 80 : 35,
    targetId: site?.id ?? selectedMine?.target?.siteId ?? selectedMine?.kitId ?? null,
    targetLabel: site?.label ?? selectedMine?.prompt ?? "Mine",
    prompt: selectedMine?.inRange || site?.inRange ? "Hold to mine gold" : "Move to gold seam",
    input: "E",
    inRange: Boolean(selectedMine?.inRange || site?.inRange),
    hold: createHoldState({ progress, required, active: progress > 0, complete: false }),
    nextAction: selectedMine?.inRange || site?.inRange ? "hold-mine" : "approach-resource",
  };
}

function resolveExtractionAction(loop) {
  const sites = Object.values(loop.extraction?.sites ?? {});
  if (!sites.length) return null;
  const activeSite = loop.extraction?.activeSiteId ? loop.extraction.sites[loop.extraction.activeSiteId] : null;
  const nearest = activeSite ?? sites.slice().sort((a, b) => Number(a.distance ?? 999) - Number(b.distance ?? 999))[0];
  const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);
  const progress = Number(loop.extraction?.progress ?? 0);
  const required = Number(loop.extraction?.requiredSeconds ?? nearest?.requiredSeconds ?? 0);
  const inRange = Boolean(nearest?.inRange || loop.extraction?.inVolume);
  const active = Boolean(loop.extraction?.activeSiteId || progress > 0);
  return {
    action: cargoAmount > 0 || active ? "cashout-gold" : "find-gold-before-cashout",
    domainPath: "n:goldrush:cashout-sites",
    priority: active ? 100 : inRange && cargoAmount > 0 ? 90 : cargoAmount > 0 ? 55 : 10,
    targetId: nearest?.id ?? null,
    targetLabel: nearest?.label ?? "Cash out",
    prompt: active ? "Keep holding cashout" : inRange && cargoAmount > 0 ? "Hold to cash out" : cargoAmount > 0 ? "Reach cashout depot" : "Mine gold first",
    input: "E",
    inRange,
    hold: createHoldState({ progress, required, active, complete: loop.phase === "extracted" }),
    contestStatus: nearest?.contestState?.status ?? "watched",
    interruptRisk: round(nearest?.contestState?.interruptRisk ?? nearest?.contestState?.pressure ?? 0),
    nextAction: active ? "keep-holding-cashout" : inRange && cargoAmount > 0 ? "hold-cashout" : cargoAmount > 0 ? "route-to-cashout" : "mine-gold",
  };
}

function resolveCombatAction(loop) {
  const readability = loop.combat?.readability ?? {};
  const activeThreats = Object.values(readability.threats ?? {}).filter((threat) => threat.status === "active");
  if (!activeThreats.length && !loop.combat?.cover?.engaged) return null;
  const threat = activeThreats[0] ?? null;
  return {
    action: loop.combat?.cover?.engaged ? "hold-cover" : "take-cover",
    domainPath: "n:goldrush:ambush-pressure",
    priority: 95,
    targetId: loop.combat?.cover?.coverId ?? threat?.recommendedCoverId ?? threat?.threatId ?? null,
    targetLabel: threat?.label ?? "Threat",
    prompt: loop.combat?.cover?.engaged ? "Hold cover and peek" : "Take cover",
    input: "Q",
    inRange: true,
    hold: createHoldState({ progress: loop.combat?.cover?.engaged ? 1 : 0, required: 1, active: Boolean(loop.combat?.cover?.engaged), complete: Boolean(loop.combat?.cover?.engaged) }),
    nextAction: loop.combat?.cover?.engaged ? "peek-or-fire" : "take-cover",
  };
}

function resolveSelectedInspectAction(selection) {
  if (!selection || selection.action === "mine-gold" || selection.action === "take-cover") return null;
  return {
    action: selection.action,
    domainPath: selection.domainPath ?? "n:gameplay:interaction-hold",
    priority: selection.inRange ? 45 : 15,
    targetId: selection.kitId ?? null,
    targetLabel: selection.prompt ?? "Inspect",
    prompt: selection.inRange ? selection.prompt ?? "Inspect" : "Move closer",
    input: "E",
    inRange: Boolean(selection.inRange),
    hold: createHoldState({ progress: 0, required: 0, active: false, complete: false }),
    nextAction: selection.inRange ? "inspect" : "approach",
  };
}

function choosePrimaryAction({ availableActions, cargo }) {
  if (!availableActions.length) {
    return {
      action: Number(cargo?.goldDust ?? cargo?.totalValue ?? 0) > 0 ? "route-to-cashout" : "prospect",
      domainPath: playerActionSurfaceDomainPath,
      priority: 0,
      targetId: null,
      targetLabel: "Gold field",
      prompt: Number(cargo?.goldDust ?? cargo?.totalValue ?? 0) > 0 ? "Find a cashout depot" : "Find gold",
      input: null,
      inRange: false,
      hold: createHoldState(),
      nextAction: Number(cargo?.goldDust ?? cargo?.totalValue ?? 0) > 0 ? "route-to-cashout" : "prospect",
    };
  }
  return structuredClone(availableActions.slice().sort((a, b) => b.priority - a.priority)[0]);
}

function createHoldState({ progress = 0, required = 0, active = false, complete = false } = {}) {
  const safeRequired = Math.max(0, Number(required) || 0);
  const safeProgress = Math.max(0, Number(progress) || 0);
  return {
    active: Boolean(active),
    complete: Boolean(complete),
    progress: round(safeProgress),
    requiredSeconds: round(safeRequired),
    ratio: safeRequired > 0 ? round(Math.min(1, safeProgress / safeRequired)) : complete ? 1 : 0,
  };
}

function round(value) {
  return Number((Number(value) || 0).toFixed(3));
}
