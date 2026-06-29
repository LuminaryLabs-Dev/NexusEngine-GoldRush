const CAMERA_FAMILIES = [
  { family: "exploration-over-shoulder", mode: "exploration", phaseTags: ["prospect", "travel"], basePosition: [2.8, 3.4, -8.2], baseLookAt: [0, 1.1, 1.8], fov: 54, intent: "read player, trail, and next terrain feature" },
  { family: "trail-follow", mode: "exploration", phaseTags: ["prospect", "extract"], basePosition: [1.4, 2.8, -6.4], baseLookAt: [0, 0.95, 2.6], fov: 58, intent: "prove the foreground trail stays navigable" },
  { family: "canyon-scout", mode: "exploration", phaseTags: ["travel", "prospect"], basePosition: [4.6, 3.9, -7.6], baseLookAt: [1.1, 1.35, 4.4], fov: 56, intent: "check canyon wall scale, slopes, and horizon blend" },
  { family: "mining-close", mode: "exploration", phaseTags: ["mine", "prospect"], basePosition: [1.2, 2.15, -4.7], baseLookAt: [0.05, 0.95, 1.4], fov: 60, intent: "read gold seams, tools, and mining animation" },
  { family: "town-approach", mode: "exploration", phaseTags: ["travel", "lobby"], basePosition: [3.8, 3.0, -6.8], baseLookAt: [2.2, 1.25, 5.8], fov: 55, intent: "prove town landmarks are identifiable without labels" },
  { family: "combat-shoulder", mode: "combat", phaseTags: ["combat"], basePosition: [1.6, 2.2, -5.4], baseLookAt: [0.2, 1.1, 1.2], fov: 58, intent: "read weapon posture, cover, and threat lane" },
  { family: "cover-peek", mode: "combat", phaseTags: ["combat"], basePosition: [0.9, 1.95, -4.2], baseLookAt: [0.65, 1.0, 1.8], fov: 62, intent: "test cover occlusion and shoulder-side visibility" },
  { family: "extraction-run", mode: "cashout", phaseTags: ["extract", "finalRush"], basePosition: [2.2, 2.7, -7.4], baseLookAt: [-0.2, 1.0, 4.0], fov: 61, intent: "keep the exit route readable under pressure" },
  { family: "spectate-crew", mode: "spectate", phaseTags: ["results", "replay"], basePosition: [5.8, 4.6, -9.2], baseLookAt: [0, 1.0, 0.8], fov: 50, intent: "show player group, route, and room context" },
  { family: "replay-cinematic", mode: "replay", phaseTags: ["results", "replay"], basePosition: [-4.8, 3.2, -6.6], baseLookAt: [0.4, 1.15, 2.8], fov: 48, intent: "produce proof frames for match summaries" },
];

export function createGoldRushCameraPerspectives({ count = 1000 } = {}) {
  const perspectives = Array.from({ length: count }, (_, index) => {
    const family = CAMERA_FAMILIES[index % CAMERA_FAMILIES.length];
    const ring = Math.floor(index / CAMERA_FAMILIES.length);
    const seed = hash(`${family.family}.${index}`);
    const shoulder = ((seed >>> 4) % 100) / 100 - 0.5;
    const height = ((seed >>> 10) % 100) / 100 - 0.5;
    const distance = ((seed >>> 16) % 100) / 100 - 0.5;
    const phase = family.phaseTags[ring % family.phaseTags.length];
    const position = [
      round(family.basePosition[0] + shoulder * 1.8),
      round(family.basePosition[1] + height * 0.78),
      round(family.basePosition[2] + distance * 2.1),
    ];
    const lookAt = [
      round(family.baseLookAt[0] + shoulder * 0.62),
      round(family.baseLookAt[1] + height * 0.22),
      round(family.baseLookAt[2] + distance * 0.9),
    ];
    return {
      id: `goldrush.camera.pose.${String(index + 1).padStart(4, "0")}`,
      family: family.family,
      mode: family.mode,
      phase,
      seed,
      threeDescriptor: {
        fov: Math.max(44, Math.min(66, family.fov + ((seed >>> 22) % 9) - 4)),
        position,
        lookAt,
        near: 0.1,
        far: family.mode === "combat" ? 160 : 220,
      },
      playerState: {
        locomotion: phase === "combat" ? "aiming" : phase === "mine" ? "mining" : phase === "extract" ? "running-loaded" : "walking",
        shoulderSide: shoulder < 0 ? "left" : "right",
      },
      playabilityChecks: [
        "player-silhouette-readable",
        family.family.includes("combat") || family.family.includes("cover") ? "cover-and-threat-readable" : "route-or-landmark-readable",
        family.family.includes("town") ? "town-identifiable" : family.family.includes("mining") ? "gold-or-tool-readable" : "terrain-depth-readable",
      ],
      intent: family.intent,
      blendSeconds: round(0.18 + (ring % 7) * 0.045),
      weight: 1 + (ring % 5),
    };
  });

  return {
    id: "goldrush.camera.perspectiveCatalog",
    generatedBy: "goldrush-camera-perspective-kit",
    count: perspectives.length,
    families: CAMERA_FAMILIES.map((family) => ({
      family: family.family,
      mode: family.mode,
      phaseTags: family.phaseTags,
      intent: family.intent,
    })),
    perspectives,
  };
}

export function selectGoldRushCameraPerspective(catalog, { mode = "exploration", phase = "prospect", tick = 0 } = {}) {
  const matching = catalog.perspectives.filter((pose) => (
    (pose.mode === mode || (mode === "exploration" && pose.mode === "cashout"))
    && (pose.phase === phase || pose.phase === "travel" || pose.phase === "prospect")
  ));
  const pool = matching.length ? matching : catalog.perspectives.filter((pose) => pose.mode === mode);
  const fallback = pool.length ? pool : catalog.perspectives;
  return fallback[Math.abs(tick) % fallback.length];
}

export function validateGoldRushCameraPerspectives(catalog) {
  if (catalog?.id !== "goldrush.camera.perspectiveCatalog") return false;
  if (catalog.count < 1000 || catalog.perspectives?.length !== catalog.count) return false;
  if (catalog.families?.length < 10) return false;
  const ids = new Set(catalog.perspectives.map((pose) => pose.id));
  if (ids.size !== catalog.perspectives.length) return false;
  const modes = new Set(catalog.perspectives.map((pose) => pose.mode));
  if (!["exploration", "combat", "cashout", "spectate", "replay"].every((mode) => modes.has(mode))) return false;
  return catalog.perspectives.every((pose) => (
    pose.threeDescriptor?.position?.length === 3
    && pose.threeDescriptor?.lookAt?.length === 3
    && pose.threeDescriptor.position.every(Number.isFinite)
    && pose.threeDescriptor.lookAt.every(Number.isFinite)
    && pose.threeDescriptor.position[1] <= 5.5
    && pose.playabilityChecks?.length >= 3
    && JSON.stringify(pose).length > 0
  ));
}

function round(value) {
  return Number(value.toFixed(3));
}

function hash(input) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
