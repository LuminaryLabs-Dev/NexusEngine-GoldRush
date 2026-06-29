export const goldRushLegacySourceManifest = {
  version: "0.1.0",
  status: "waiting-for-cloud-import",
  sourceProjects: [
    {
      sourceKey: "goldrush-modern-unity",
      role: "modern-room-and-arena-source",
      unityLine: "6000",
      expectedScenes: [
        { sceneId: "goldrush.scene.lobby", role: "lobby-room-staging" },
        { sceneId: "goldrush.scene.arena", role: "massive-terrain-arena" },
        { sceneId: "goldrush.scene.playerTest", role: "player-controller-animation-proof" },
      ],
      expectedAssetFamilies: ["player", "arena-layout", "terrain", "gold-node", "town-props", "audio"],
    },
    {
      sourceKey: "goldrush-classic-unity",
      role: "classic-menu-game-and-solo-source",
      unityLine: "2022-lts",
      expectedScenes: [
        { sceneId: "goldrush.scene.mainMenu", role: "classic-menu-flow" },
        { sceneId: "goldrush.scene.legacyGame", role: "classic-combat-loop" },
        { sceneId: "goldrush.scene.legacySinglePlayer", role: "classic-solo-loop" },
      ],
      expectedAssetFamilies: ["classic-layout", "combat-camera", "weapons", "coins", "buildings", "animation"],
    },
  ],
  requiredImportStages: [
    "private-source-checkout",
    "deny-path-scan",
    "secret-scan",
    "raw-candidate-copy",
    "hash-manifest",
    "conversion",
    "human-review",
    "public-promotion",
  ],
  targetFolders: {
    rawCandidates: "raw-candidate-drop",
    scanReports: "quarantine-report-drop",
    convertedCandidates: "sanitized-conversion-drop",
    registry: "sanitized-registry",
    publicAssets: "public-runtime-assets",
  },
  deniedRuntimeFamilies: [
    "unity-generated-cache",
    "unity-project-settings",
    "third-party-plugin-folders",
    "network-provider-config",
    "local-secret-config",
    "compiled-editor-output",
  ],
  browserPlayableFamilies: [
    {
      familyId: "legacy.scene-set",
      purpose: "Both old Gold Rush versions become selectable scene intents inside one browser game.",
      requiredSlots: [
        "goldrush.scene.mainMenu",
        "goldrush.scene.lobby",
        "goldrush.scene.arena",
        "goldrush.scene.legacyGame",
        "goldrush.scene.legacySinglePlayer",
      ],
    },
    {
      familyId: "legacy.player-combat-set",
      purpose: "Combat perspective can shift from extraction view to classic close combat view.",
      requiredSlots: [
        "goldrush.player.prospector",
        "goldrush.weapon.revolver",
        "goldrush.anim.player.aimIdle",
        "goldrush.anim.player.shooting",
        "goldrush.audio.sfx.revolverShot",
      ],
    },
    {
      familyId: "legacy.gold-economy-set",
      purpose: "Gold remains score, cargo, ammo, health risk, pickup, and extraction reward.",
      requiredSlots: [
        "goldrush.prop.goldPile",
        "goldrush.currency.coin01",
        "goldrush.audio.sfx.goldPickup",
        "goldrush.audio.sfx.cashout",
      ],
    },
    {
      familyId: "legacy.world-town-set",
      purpose: "Towns, buildings, roads, towers, and desert props replace procedural placeholders after approval.",
      requiredSlots: [
        "goldrush.vehicle.train",
        "goldrush.vehicle.trainCar",
        "goldrush.prop.cactus01",
        "goldrush.prop.cactus02",
        "goldrush.prop.fence01",
      ],
    },
  ],
};

export function createLegacySourceReadiness({ assetRegistry }) {
  const runtimeAssets = assetRegistry.assets ?? [];
  const presentation = assetRegistry.presentation ?? {};
  const slots = [
    ...runtimeAssets,
    ...(presentation.scenes ?? []),
    ...(presentation.audio ?? []),
    ...(presentation.animations ?? []),
  ];
  const approvedSlotIds = new Set(slots.filter((slot) => slot.status === "approved").map((slot) => slot.id));
  const families = goldRushLegacySourceManifest.browserPlayableFamilies.map((family) => {
    const approvedCount = family.requiredSlots.filter((slotId) => approvedSlotIds.has(slotId)).length;
    return {
      ...family,
      requiredCount: family.requiredSlots.length,
      approvedCount,
      missingSlotIds: family.requiredSlots.filter((slotId) => !approvedSlotIds.has(slotId)),
      status: approvedCount === family.requiredSlots.length ? "ready" : "waiting-for-approved-assets",
    };
  });
  const totalRequiredSlots = families.reduce((sum, family) => sum + family.requiredCount, 0);
  const approvedRequiredSlots = families.reduce((sum, family) => sum + family.approvedCount, 0);
  return {
    version: goldRushLegacySourceManifest.version,
    status: approvedRequiredSlots === totalRequiredSlots ? "playable-with-promoted-assets" : "waiting-for-cloud-import",
    sourceProjectCount: goldRushLegacySourceManifest.sourceProjects.length,
    requiredImportStages: goldRushLegacySourceManifest.requiredImportStages,
    targetFolders: goldRushLegacySourceManifest.targetFolders,
    families,
    totals: {
      totalRequiredSlots,
      approvedRequiredSlots,
      missingRequiredSlots: totalRequiredSlots - approvedRequiredSlots,
      placeholderSlots: slots.filter((slot) => slot.status === "placeholder").length,
    },
  };
}

export function validateLegacySourceManifest(manifest = goldRushLegacySourceManifest) {
  const failures = [];
  if (manifest.sourceProjects.length !== 2) failures.push("expected-two-legacy-source-projects");
  if (manifest.sourceProjects.some((source) => source.expectedScenes.length < 3)) failures.push("missing-expected-scene-coverage");
  if (manifest.browserPlayableFamilies.length < 4) failures.push("missing-playable-family-coverage");
  if (!manifest.requiredImportStages.includes("secret-scan")) failures.push("missing-secret-scan-stage");
  if (!manifest.requiredImportStages.includes("human-review")) failures.push("missing-human-review-stage");
  if (manifest.browserPlayableFamilies.some((family) => family.requiredSlots.length === 0)) failures.push("empty-playable-family");
  return { passed: failures.length === 0, failures };
}
