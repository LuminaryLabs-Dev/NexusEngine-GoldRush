export const goldRushLegacyModes = [
  {
    modeId: "modernExtraction",
    label: "Modern Extraction",
    sourceKey: "goldrush-modern-unity",
    sourceVersionRole: "modern-room-and-arena-source",
    phaseHint: "prospect",
    sceneId: "goldrush.scene.arena",
    cameraMode: "exploration",
    perspective: "wide-room-extraction",
    playablePromise: "Modern GoldRush lobby, room, arena, mining, and extraction loop.",
    requiredRuntimeApis: ["goldrushNetwork", "goldrushTerrain", "goldrushGoldZones", "goldrushMining", "goldrushCashout"],
    requiredSlotFamilies: ["legacy.scene-set", "legacy.gold-economy-set", "legacy.world-town-set"],
  },
  {
    modeId: "classicCombat",
    label: "Classic Combat",
    sourceKey: "goldrush-classic-unity",
    sourceVersionRole: "classic-menu-game-and-solo-source",
    phaseHint: "combat",
    sceneId: "goldrush.scene.legacyGame",
    cameraMode: "combat",
    perspective: "close-classic-combat",
    playablePromise: "Classic Gold Rush Game scene intent with close combat framing and gold-at-risk pressure.",
    requiredRuntimeApis: ["goldrushCombat", "goldrushCamera", "goldrushAudio", "goldrushAnimation", "goldrushScoring"],
    requiredSlotFamilies: ["legacy.scene-set", "legacy.player-combat-set", "legacy.gold-economy-set"],
  },
  {
    modeId: "classicSolo",
    label: "Classic Solo",
    sourceKey: "goldrush-classic-unity",
    sourceVersionRole: "classic-menu-game-and-solo-source",
    phaseHint: "prospect",
    sceneId: "goldrush.scene.legacySinglePlayer",
    cameraMode: "exploration",
    perspective: "solo-classic-route",
    playablePromise: "Classic single-player scene intent folded into the same match runtime as a networked solo view.",
    requiredRuntimeApis: ["goldrushNetwork", "goldrushMining", "goldrushCargo", "goldrushCamera", "goldrushReplaySummary"],
    requiredSlotFamilies: ["legacy.scene-set", "legacy.player-combat-set"],
  },
];

export function validateLegacyModes(modes = goldRushLegacyModes) {
  const failures = [];
  const modeIds = new Set(modes.map((mode) => mode.modeId));
  if (modeIds.size !== modes.length) failures.push("duplicate-legacy-mode-id");
  if (!modeIds.has("modernExtraction")) failures.push("missing-modern-extraction-mode");
  if (!modeIds.has("classicCombat")) failures.push("missing-classic-combat-mode");
  if (!modeIds.has("classicSolo")) failures.push("missing-classic-solo-mode");
  if (modes.some((mode) => !mode.sceneId.startsWith("goldrush.scene."))) failures.push("invalid-scene-id");
  if (modes.some((mode) => !["exploration", "combat"].includes(mode.cameraMode))) failures.push("invalid-camera-mode");
  if (modes.some((mode) => mode.requiredRuntimeApis.length < 5)) failures.push("thin-runtime-api-coverage");
  if (modes.some((mode) => mode.requiredSlotFamilies.length === 0)) failures.push("missing-slot-family-coverage");
  return { passed: failures.length === 0, failures };
}

export function resolveLegacyMode(modeId = "modernExtraction") {
  return goldRushLegacyModes.find((mode) => mode.modeId === modeId) ?? goldRushLegacyModes[0];
}
