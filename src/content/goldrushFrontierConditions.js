const CONDITION_VERSION = "0.1.0";
const defaultSeed = "goldrush-dev-seed";

export const goldRushFrontierConditions = Object.freeze([
  createCondition({
    id: "goldrush.condition.clear-noon-rush",
    label: "Clear Noon Rush",
    family: "baseline",
    playerRead: "Long sightlines, dry wind, and predictable routes.",
    weight: 3,
    modifiers: {
      visibility: 1,
      audioMasking: 0.1,
      goldYield: 1,
      extractionRisk: 1,
      ambushPressure: 1,
      routeReadability: 1,
    },
    world: {
      timeOfDay: "noon",
      sky: "clear-high-desert",
      horizon: "open",
      dust: 0.15,
      routeCue: "trail-markers-readable",
      landmarkBias: "town-and-mine-silhouette",
    },
    audio: {
      musicBias: "wandering",
      ambience: "dry-wind-light",
      masking: "low",
      stinger: null,
    },
    lighting: {
      key: "warm-noon",
      exposure: 1,
      fogDensity: 0.08,
      contrast: 1,
    },
    gameplay: {
      primaryPressure: "route-choice",
      recommendedPlan: "Mine fast, keep long sightlines, and choose extraction by cargo value.",
      routeRisk: "standard",
      extractionSignal: "visible",
    },
  }),
  createCondition({
    id: "goldrush.condition.dust-storm",
    label: "Dust Storm",
    family: "weather",
    playerRead: "Sightlines shrink, sound cover rises, and close ambushes become likely.",
    weight: 2,
    modifiers: {
      visibility: 0.55,
      audioMasking: 0.75,
      goldYield: 1.05,
      extractionRisk: 1.25,
      ambushPressure: 1.35,
      routeReadability: 0.7,
    },
    world: {
      timeOfDay: "late-afternoon",
      sky: "dust-haze",
      horizon: "softened",
      dust: 0.85,
      routeCue: "lantern-and-fence-posts",
      landmarkBias: "nearby-ridge-and-tower",
    },
    audio: {
      musicBias: "tense",
      ambience: "sand-wind-heavy",
      masking: "high",
      stinger: "goldrush.audio.sfx.ambush",
    },
    lighting: {
      key: "ochre-haze",
      exposure: 0.82,
      fogDensity: 0.32,
      contrast: 0.78,
    },
    gameplay: {
      primaryPressure: "short-range-contact",
      recommendedPlan: "Use cover, avoid open flats, and do not overcarry before extraction.",
      routeRisk: "high",
      extractionSignal: "muffled",
    },
  }),
  createCondition({
    id: "goldrush.condition.night-train",
    label: "Night Train",
    family: "time-of-day",
    playerRead: "Extraction routes glow, but movement and threats are harder to read.",
    weight: 1,
    modifiers: {
      visibility: 0.68,
      audioMasking: 0.35,
      goldYield: 1.12,
      extractionRisk: 1.18,
      ambushPressure: 1.2,
      routeReadability: 0.78,
    },
    world: {
      timeOfDay: "night",
      sky: "moonlit-frontier",
      horizon: "low-contrast",
      dust: 0.1,
      routeCue: "rail-lanterns",
      landmarkBias: "train-light-and-town-lamps",
    },
    audio: {
      musicBias: "low-tension",
      ambience: "night-insects-rail-metal",
      masking: "medium",
      stinger: "goldrush.audio.music.loadingTrain",
    },
    lighting: {
      key: "cool-moon",
      exposure: 0.7,
      fogDensity: 0.18,
      contrast: 1.18,
    },
    gameplay: {
      primaryPressure: "route-silhouette",
      recommendedPlan: "Follow lantern routes, bank mid-value cargo, and avoid blind ridge cuts.",
      routeRisk: "high",
      extractionSignal: "lantern-lit",
    },
  }),
  createCondition({
    id: "goldrush.condition.mine-collapse",
    label: "Mine Collapse",
    family: "hazard",
    playerRead: "Some mine approaches are blocked and remaining seams become contested.",
    weight: 2,
    modifiers: {
      visibility: 0.9,
      audioMasking: 0.25,
      goldYield: 1.18,
      extractionRisk: 1.3,
      ambushPressure: 1.28,
      routeReadability: 0.82,
    },
    world: {
      timeOfDay: "morning",
      sky: "smoke-plume",
      horizon: "partly-obscured",
      dust: 0.45,
      routeCue: "blocked-mine-timbers",
      landmarkBias: "smoke-and-rubble",
    },
    audio: {
      musicBias: "danger",
      ambience: "wood-creak-rockfall",
      masking: "medium",
      stinger: "goldrush.audio.sfx.damage",
    },
    lighting: {
      key: "smoky-warm",
      exposure: 0.92,
      fogDensity: 0.22,
      contrast: 0.9,
    },
    gameplay: {
      primaryPressure: "choke-points",
      recommendedPlan: "Check alternate mine paths before committing to a full cargo run.",
      routeRisk: "high",
      extractionSignal: "standard",
    },
  }),
  createCondition({
    id: "goldrush.condition.boomtown-rush",
    label: "Boomtown Rush",
    family: "economy",
    playerRead: "Gold is easier to find, but everyone is pulled toward the same rich routes.",
    weight: 2,
    modifiers: {
      visibility: 1,
      audioMasking: 0.15,
      goldYield: 1.35,
      extractionRisk: 1.32,
      ambushPressure: 1.22,
      routeReadability: 1.05,
    },
    world: {
      timeOfDay: "golden-hour",
      sky: "warm-clear",
      horizon: "open",
      dust: 0.22,
      routeCue: "busy-wagon-tracks",
      landmarkBias: "town-market-and-rich-seams",
    },
    audio: {
      musicBias: "fast-prospect",
      ambience: "town-distant-tools",
      masking: "low",
      stinger: "goldrush.audio.sfx.cashout",
    },
    lighting: {
      key: "golden-hour",
      exposure: 1.05,
      fogDensity: 0.1,
      contrast: 1.05,
    },
    gameplay: {
      primaryPressure: "greed-vs-escape",
      recommendedPlan: "Grab rich seams quickly, then rotate before extraction sites crowd.",
      routeRisk: "medium",
      extractionSignal: "visible",
    },
  }),
  createCondition({
    id: "goldrush.condition.bandit-patrol",
    label: "Bandit Patrol",
    family: "threat",
    playerRead: "Threat paths cross the good routes and punish loud extraction.",
    weight: 2,
    modifiers: {
      visibility: 0.95,
      audioMasking: 0.2,
      goldYield: 1.08,
      extractionRisk: 1.45,
      ambushPressure: 1.55,
      routeReadability: 0.95,
    },
    world: {
      timeOfDay: "midday",
      sky: "clear-watchful",
      horizon: "open",
      dust: 0.28,
      routeCue: "patrol-worn-cuts",
      landmarkBias: "watchtower-and-bridge",
    },
    audio: {
      musicBias: "combat-ready",
      ambience: "distant-hooves-and-spurs",
      masking: "low",
      stinger: "goldrush.audio.sfx.ambush",
    },
    lighting: {
      key: "hard-frontier-sun",
      exposure: 0.98,
      fogDensity: 0.1,
      contrast: 1.12,
    },
    gameplay: {
      primaryPressure: "moving-threat-lanes",
      recommendedPlan: "Cross patrol routes at angles and extract after threat noise passes.",
      routeRisk: "high",
      extractionSignal: "danger-loud",
    },
  }),
  createCondition({
    id: "goldrush.condition.dry-creek",
    label: "Dry Creek",
    family: "terrain",
    playerRead: "Creek beds become fast low routes with poor escape angles.",
    weight: 2,
    modifiers: {
      visibility: 1.05,
      audioMasking: 0.05,
      goldYield: 1.02,
      extractionRisk: 1.12,
      ambushPressure: 1.12,
      routeReadability: 1.2,
    },
    world: {
      timeOfDay: "morning",
      sky: "clear-dry",
      horizon: "open",
      dust: 0.2,
      routeCue: "dry-creek-bed",
      landmarkBias: "wash-floor-and-bridge",
    },
    audio: {
      musicBias: "wandering",
      ambience: "dry-gravel-footsteps",
      masking: "low",
      stinger: null,
    },
    lighting: {
      key: "clean-morning",
      exposure: 1,
      fogDensity: 0.06,
      contrast: 1,
    },
    gameplay: {
      primaryPressure: "fast-but-exposed",
      recommendedPlan: "Use creek beds for rotation, then climb before carrying heavy cargo.",
      routeRisk: "medium",
      extractionSignal: "visible",
    },
  }),
  createCondition({
    id: "goldrush.condition.high-fever-seam",
    label: "High Fever Seam",
    family: "gold-fever",
    playerRead: "One seam is unusually valuable and turns the field into a moving contest.",
    weight: 1,
    modifiers: {
      visibility: 0.95,
      audioMasking: 0.18,
      goldYield: 1.5,
      extractionRisk: 1.55,
      ambushPressure: 1.6,
      routeReadability: 0.9,
    },
    world: {
      timeOfDay: "sunset",
      sky: "red-gold",
      horizon: "dramatic",
      dust: 0.35,
      routeCue: "glinting-seam-markers",
      landmarkBias: "hot-seam-and-extraction-smoke",
    },
    audio: {
      musicBias: "high-risk",
      ambience: "heartbeat-tools-wind",
      masking: "medium",
      stinger: "goldrush.audio.sfx.cashout",
    },
    lighting: {
      key: "red-sunset",
      exposure: 0.9,
      fogDensity: 0.18,
      contrast: 1.22,
    },
    gameplay: {
      primaryPressure: "single-objective-contest",
      recommendedPlan: "Commit as a team or avoid the hot seam and win through clean extraction.",
      routeRisk: "extreme",
      extractionSignal: "visible-but-contested",
    },
  }),
]);

export function createGoldRushFrontierConditionState({
  seed = defaultSeed,
  phase = "lobby",
  tick = 0,
  forcedConditionId = null,
  reason = "generated",
} = {}) {
  const rotation = createConditionRotation({ seed, phase, tick });
  const active = forcedConditionId
    ? goldRushFrontierConditions.find((condition) => condition.id === forcedConditionId) ?? rotation[0]
    : rotation[0];
  const activeIndex = rotation.findIndex((condition) => condition.id === active.id);
  const normalizedIndex = activeIndex >= 0 ? activeIndex : 0;
  const upcoming = [1, 2, 3].map((offset) => rotation[(normalizedIndex + offset) % rotation.length]);

  const state = {
    version: CONDITION_VERSION,
    domainPath: "n:goldrush:frontier-conditions",
    seed,
    phase,
    tick,
    reason,
    active,
    upcoming,
    rotation: rotation.map((condition, index) => ({
      index,
      id: condition.id,
      label: condition.label,
      family: condition.family,
      weight: condition.weight,
    })),
    publicApi: ["generate", "setCondition", "advance", "snapshot", "reset", "validate"],
    dataExposed: [
      "active condition",
      "upcoming conditions",
      "planning modifiers",
      "world descriptor",
      "audio descriptor",
      "lighting descriptor",
      "resolved effects",
    ],
  };
  return structuredClone({
    ...state,
    effects: createGoldRushFrontierConditionEffects(state),
  });
}

export function validateGoldRushFrontierConditionState(state) {
  const failures = [];
  if (!state || typeof state !== "object") failures.push("state-missing");
  if (state?.domainPath !== "n:goldrush:frontier-conditions") failures.push("wrong-domain-path");
  if (!state?.active?.id?.startsWith("goldrush.condition.")) failures.push("active-condition-id-invalid");
  if (!Number.isFinite(state?.active?.modifiers?.visibility)) failures.push("active-visibility-missing");
  if (!Number.isFinite(state?.active?.modifiers?.goldYield)) failures.push("active-gold-yield-missing");
  if (!state?.active?.world?.routeCue) failures.push("world-route-cue-missing");
  if (!state?.active?.audio?.ambience) failures.push("audio-ambience-missing");
  if (!state?.active?.lighting?.key) failures.push("lighting-key-missing");
  if (!Array.isArray(state?.upcoming) || state.upcoming.length < 2) failures.push("upcoming-conditions-missing");
  if (!Array.isArray(state?.rotation) || state.rotation.length !== goldRushFrontierConditions.length) {
    failures.push("rotation-count-mismatch");
  }
  if (!isSerializable(state)) failures.push("state-not-serializable");
  return { passed: failures.length === 0, failures };
}

export function createGoldRushFrontierConditionEffects(state = createGoldRushFrontierConditionState()) {
  const condition = state.active ?? goldRushFrontierConditions[0];
  const modifiers = condition.modifiers ?? {};
  return structuredClone({
    conditionId: condition.id,
    label: condition.label,
    family: condition.family,
    playerRead: condition.playerRead,
    gameplay: condition.gameplay,
    extraction: {
      riskScalar: round(modifiers.extractionRisk ?? 1),
      holdTimeScalar: round(1 + Math.max(0, (modifiers.extractionRisk ?? 1) - 1) * 0.45),
      cashoutValueScalar: round(1 + Math.max(0, (modifiers.goldYield ?? 1) - 1) * 0.35),
      signal: condition.gameplay?.extractionSignal ?? "visible",
    },
    mining: {
      payoutScalar: round(modifiers.goldYield ?? 1),
      routeReadability: round(modifiers.routeReadability ?? 1),
    },
    combat: {
      pressureScalar: round(modifiers.ambushPressure ?? 1),
      detectionRadiusScalar: round(1 + Math.max(0, (modifiers.visibility ?? 1) - 1) * 0.25),
      surpriseScalar: round(1 + Math.max(0, 1 - (modifiers.visibility ?? 1)) * 0.4 + (modifiers.audioMasking ?? 0) * 0.25),
      audioMasking: round(modifiers.audioMasking ?? 0),
    },
    audio: {
      musicBias: condition.audio?.musicBias ?? "wandering",
      ambience: condition.audio?.ambience ?? "dry-wind-light",
      masking: condition.audio?.masking ?? "low",
      stinger: condition.audio?.stinger ?? null,
    },
    render: {
      sky: condition.world?.sky ?? "clear-high-desert",
      timeOfDay: condition.world?.timeOfDay ?? "noon",
      dust: round(condition.world?.dust ?? 0),
      horizon: condition.world?.horizon ?? "open",
      routeCue: condition.world?.routeCue ?? "trail-markers-readable",
      lightingKey: condition.lighting?.key ?? "warm-noon",
      exposure: round(condition.lighting?.exposure ?? 1),
      fogDensity: round(condition.lighting?.fogDensity ?? 0.08),
      contrast: round(condition.lighting?.contrast ?? 1),
    },
  });
}

function createCondition(input) {
  return Object.freeze({
    ...input,
    modifiers: Object.freeze(input.modifiers),
    world: Object.freeze(input.world),
    audio: Object.freeze(input.audio),
    lighting: Object.freeze(input.lighting),
    gameplay: Object.freeze(input.gameplay),
  });
}

function createConditionRotation({ seed, phase, tick }) {
  const phaseSalt = phase === "lobby" ? "drop" : phase;
  const base = hashString(`${seed}:${phaseSalt}:${Math.floor(tick / 900)}`);
  return [...goldRushFrontierConditions].sort((left, right) => {
    const leftScore = weightedHash(base, left);
    const rightScore = weightedHash(base, right);
    return rightScore - leftScore || left.id.localeCompare(right.id);
  });
}

function weightedHash(base, condition) {
  const hash = hashString(`${base}:${condition.id}`);
  return (hash % 100000) * condition.weight;
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function round(value, places = 3) {
  return Number(Number(value).toFixed(places));
}

function isSerializable(value) {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
