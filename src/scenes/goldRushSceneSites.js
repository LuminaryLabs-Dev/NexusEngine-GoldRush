export const goldRushSceneSites = [
  {
    id: "site.start",
    screen: "start",
    purpose: "Title entry without gameplay kits mounted.",
    kitGroups: ["title-audio"],
    loadMode: "lightweight-dom",
  },
  {
    id: "site.lobby-character",
    screen: "lobby",
    purpose: "Party setup, frontier condition briefing, and draggable Three.js character preview.",
    kitGroups: ["peer-party-room", "three-lobby-character", "room-selection", "frontier-condition-briefing"],
    loadMode: "interactive-preview",
  },
  {
    id: "site.loading-yard",
    screen: "loading",
    purpose: "Small pre-match train yard where party members can walk to the train after the frontier condition is committed.",
    kitGroups: ["loading-yard-terrain", "party-presence", "walkable-player", "train-departure", "frontier-condition-briefing"],
    loadMode: "pre-match-scene",
  },
  {
    id: "site.gold-field",
    screen: "run",
    purpose: "Main NexusRealtime gold field runtime with terrain, rooms, mining, combat, scoring, and replay kits.",
    kitGroups: ["goldrush-runtime", "procedural-terrain", "object-micro-kits", "network-orchestration"],
    loadMode: "full-runtime",
  },
  {
    id: "site.results",
    screen: "results",
    purpose: "Post-extraction results and replay summary driven by match/result kit snapshots.",
    kitGroups: ["goldrush-runtime", "results-summary", "replay-summary"],
    loadMode: "summary-dom",
  },
];

export function getGoldRushSceneSite(screen) {
  return goldRushSceneSites.find((site) => site.screen === screen) ?? goldRushSceneSites[0];
}

export function getGoldRushSceneKitGroups(screen) {
  return getGoldRushSceneSite(screen).kitGroups;
}

export function validateGoldRushSceneSites(sites = goldRushSceneSites) {
  const ids = new Set(sites.map((site) => site.id));
  const screens = new Set(sites.map((site) => site.screen));
  const requiredScreens = ["start", "lobby", "loading", "run", "results"];
  const failures = [];

  if (ids.size !== sites.length) failures.push("duplicate-site-id");
  requiredScreens.forEach((screen) => {
    if (!screens.has(screen)) failures.push(`missing-screen:${screen}`);
  });
  sites.forEach((site) => {
    if (!site.kitGroups?.length) failures.push(`missing-kit-groups:${site.id}`);
    if (new Set(site.kitGroups).size !== site.kitGroups.length) failures.push(`duplicate-kit-group:${site.id}`);
    if (!site.loadMode) failures.push(`missing-load-mode:${site.id}`);
  });

  return {
    passed: failures.length === 0,
    failures,
    sites,
  };
}
