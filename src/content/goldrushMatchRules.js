export const goldRushPhaseOrder = ["lobby", "drop", "prospect", "combat", "finalRush", "collapse", "extract", "results"];

export const goldRushDefaultRules = {
  ruleSetId: "goldrush.rules.default",
  seed: "goldrush-dev-seed",
  maxPlayers: 100,
  roomSize: 50,
  warningSeconds: 30,
  collapseSeconds: 90,
  extractionPressureMultiplier: 0.5,
  survivalBonus: 5,
};

export function phaseIndex(phase) {
  const index = goldRushPhaseOrder.indexOf(phase);
  return index === -1 ? 0 : index;
}

export function clampPressure(value) {
  return Math.max(0, Math.min(1, Number(value.toFixed(3))));
}

export function stableHash(input) {
  const text = JSON.stringify(input);
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return `goldrush.summary.${hash.toString(16).padStart(8, "0")}`;
}
