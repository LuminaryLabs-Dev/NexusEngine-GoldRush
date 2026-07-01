export const extractionLoopScenario01 = {
  id: "goldrush.extractionLoop.scenario01",
  seed: "goldrush-extraction-loop-01",
  playerId: "player-1",
  spawn: {
    x: -12,
    y: 0,
    z: -20,
    heading: 0,
  },
  miningSites: [
    {
      id: "mine-seam-01",
      label: "Canyon seam",
      kind: "seam",
      worldPosition: { x: -17.5, y: 0, z: -16.5 },
      radius: 5.4,
      holdSeconds: 1.4,
      payout: 28,
      remaining: 84,
      goldZoneId: "gold.zone.west-drywash",
      roomWindowId: "room-window-west-basin",
      environmentSpaceId: "space.gold-seam",
      prompt: "Mine gold",
    },
    {
      id: "placer-wash-01",
      label: "Wash placer",
      kind: "placer",
      worldPosition: { x: -4.5, y: 0, z: -29.2 },
      radius: 4.8,
      holdSeconds: 1.1,
      payout: 16,
      remaining: 48,
      goldZoneId: "gold.zone.west-drywash",
      roomWindowId: "room-window-west-basin",
      environmentSpaceId: "space.wash-floor-trail",
      prompt: "Pan placer gold",
    },
  ],
  extractionSites: [
    {
      id: "rail-depot-extract-01",
      label: "Rail depot cashout",
      worldPosition: { x: -33.5, y: 0, z: -22.5 },
      radius: 6.2,
      requiredSeconds: 2.8,
      nextSceneId: "goldrush.scene.results",
      roomHandoffId: "handoff.rail-depot-extract-01",
      linkedThreatIds: ["claim-jumper-01"],
      contest: {
        basePressure: 0.22,
        noiseRadius: 18,
        threatRadius: 24,
        threatCallPressure: 0.58,
        lockdownPressure: 0.88,
        cue: "cashout-bell-and-smoke",
      },
      prompt: "Cash out",
    },
  ],
  localThreatSpawns: [
    {
      id: "claim-jumper-01",
      label: "Claim jumper",
      archetype: "rifle-ambusher",
      worldPosition: { x: -9.5, y: 0, z: -13.4 },
      radius: 12,
      health: 2,
      pressure: 0.35,
      activationCargo: 20,
      telegraphSeconds: 0.85,
      reactionWindowSeconds: 1.15,
      shotIntervalTicks: 18,
      damage: 18,
      accuracy: 0.62,
      laneWidth: 2.4,
      cue: {
        visual: "orange-muzzle-line",
        audio: "rifle-cock-and-spur-step",
        shape: "long-danger-lane",
      },
      counterplayTags: ["break-line-of-sight", "fire-back", "move-to-cover"],
    },
  ],
  combatRules: {
    deterministicReceipts: true,
    maxRecentReceipts: 18,
    threatTelegraphsRequired: true,
    multisensoryCuesRequired: true,
    laneReadabilityRequired: true,
  },
  cashoutRules: {
    cargoValueMultiplier: 10,
    zeroCargoAllowed: true,
    progressDecayPerSecond: 0.45,
    damageInterruptSeconds: 1.2,
  },
  receiptRules: {
    receiptPrefix: "extraction-loop-01",
    deterministic: true,
    maxRecentEvents: 24,
  },
};

export function createExtractionLoopScenario() {
  return structuredClone(extractionLoopScenario01);
}

export function validateExtractionLoopScenario(scenario = extractionLoopScenario01) {
  const failures = [];
  if (!scenario?.id) failures.push("missing-scenario-id");
  if (!scenario?.spawn || !Number.isFinite(scenario.spawn.x) || !Number.isFinite(scenario.spawn.z)) {
    failures.push("invalid-spawn");
  }
  if (!Array.isArray(scenario?.miningSites) || scenario.miningSites.length < 1) failures.push("missing-mining-sites");
  if (!Array.isArray(scenario?.extractionSites) || scenario.extractionSites.length < 1) failures.push("missing-extraction-sites");
  if (!Array.isArray(scenario?.localThreatSpawns) || scenario.localThreatSpawns.length < 1) failures.push("missing-threat-spawns");
  scenario?.miningSites?.forEach((site) => {
    if (!site.id || !site.kind) failures.push(`invalid-mining-site:${site.id ?? "unknown"}`);
    if (!site.goldZoneId || !site.roomWindowId) failures.push(`missing-mining-zone-link:${site.id}`);
    if (!Number.isFinite(site.radius) || site.radius <= 0) failures.push(`invalid-mining-radius:${site.id}`);
    if (!Number.isFinite(site.holdSeconds) || site.holdSeconds <= 0) failures.push(`invalid-mining-hold:${site.id}`);
    if (!Number.isFinite(site.remaining) || site.remaining <= 0) failures.push(`invalid-mining-remaining:${site.id}`);
    if (!site.worldPosition || !Number.isFinite(site.worldPosition.x) || !Number.isFinite(site.worldPosition.z)) {
      failures.push(`invalid-mining-position:${site.id}`);
    }
  });
  scenario?.extractionSites?.forEach((site) => {
    if (!site.id || !site.nextSceneId) failures.push(`invalid-extraction-site:${site.id ?? "unknown"}`);
    if (!Number.isFinite(site.radius) || site.radius <= 0) failures.push(`invalid-extraction-radius:${site.id}`);
    if (!Number.isFinite(site.requiredSeconds) || site.requiredSeconds <= 0) failures.push(`invalid-extraction-hold:${site.id}`);
    if (!Array.isArray(site.linkedThreatIds) || site.linkedThreatIds.length < 1) failures.push(`missing-extraction-threat-links:${site.id}`);
    if (!site.contest || !Number.isFinite(site.contest.noiseRadius) || !Number.isFinite(site.contest.threatRadius)) {
      failures.push(`invalid-extraction-contest:${site.id}`);
    }
    if (!site.worldPosition || !Number.isFinite(site.worldPosition.x) || !Number.isFinite(site.worldPosition.z)) {
      failures.push(`invalid-extraction-position:${site.id}`);
    }
  });
  scenario?.localThreatSpawns?.forEach((spawn) => {
    if (!spawn.id) failures.push("invalid-threat-id");
    if (!Number.isFinite(spawn.health) || spawn.health <= 0) failures.push(`invalid-threat-health:${spawn.id}`);
    if (!Number.isFinite(spawn.pressure) || spawn.pressure < 0) failures.push(`invalid-threat-pressure:${spawn.id}`);
    if (!Number.isFinite(spawn.telegraphSeconds) || spawn.telegraphSeconds <= 0) failures.push(`invalid-threat-telegraph:${spawn.id}`);
    if (!Number.isFinite(spawn.reactionWindowSeconds) || spawn.reactionWindowSeconds <= 0) failures.push(`invalid-threat-reaction-window:${spawn.id}`);
    if (!Number.isFinite(spawn.damage) || spawn.damage <= 0) failures.push(`invalid-threat-damage:${spawn.id}`);
    if (!spawn.cue?.visual || !spawn.cue?.audio || !spawn.cue?.shape) failures.push(`invalid-threat-cues:${spawn.id}`);
    if (!Array.isArray(spawn.counterplayTags) || spawn.counterplayTags.length < 2) failures.push(`invalid-threat-counterplay:${spawn.id}`);
  });
  if (!scenario?.combatRules?.threatTelegraphsRequired) failures.push("combat-telegraphs-not-required");
  if (!scenario?.combatRules?.multisensoryCuesRequired) failures.push("combat-multisensory-cues-not-required");
  if (!scenario?.cashoutRules || !Number.isFinite(scenario.cashoutRules.progressDecayPerSecond)) {
    failures.push("invalid-cashout-rules");
  }
  return {
    passed: failures.length === 0,
    failures,
  };
}
