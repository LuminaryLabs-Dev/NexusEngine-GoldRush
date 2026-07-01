import { getGoldRushSceneSite } from "./goldRushSceneSites.js";

const kitManifest = {
  "title-audio": {
    kind: "runtime-state",
    purpose: "Start-screen audio cue ownership.",
  },
  "peer-party-room": {
    kind: "runtime-state",
    purpose: "PeerJS party code room state already mounted by the app shell.",
  },
  "room-selection": {
    kind: "runtime-state",
    purpose: "Crew, Posse, and Outfit room setup controls.",
  },
  "frontier-condition-briefing": {
    kind: "runtime-state",
    purpose: "Player-facing run condition read before train boarding and match handoff.",
  },
  "three-lobby-character": {
    kind: "three-renderer",
    purpose: "Draggable Three.js skeleton prospector lobby preview.",
    module: () => import("../renderer/lobbyCharacterRenderer.js"),
  },
  "loading-yard-terrain": {
    kind: "three-renderer",
    purpose: "Walkable pre-match loading yard.",
    module: () => import("../renderer/loadingTrainSceneRenderer.js"),
  },
  "party-presence": {
    kind: "runtime-state",
    purpose: "Party member ghost placement in the loading yard.",
  },
  "walkable-player": {
    kind: "runtime-state",
    purpose: "Local loading-yard player movement.",
  },
  "train-departure": {
    kind: "three-renderer",
    purpose: "Train boarding trigger and departure transition.",
    module: () => import("../renderer/loadingTrainSceneRenderer.js"),
  },
  "goldrush-runtime": {
    kind: "nexus-runtime",
    purpose: "Gold Rush NexusRealtime domain-kit runtime.",
  },
  "procedural-terrain": {
    kind: "three-renderer",
    purpose: "Main gold-field Three.js renderer and procedural terrain kits.",
    module: () => import("../renderer/goldRushRenderer.js"),
  },
  "object-micro-kits": {
    kind: "three-renderer",
    purpose: "Instanced terrain/object micro-kit presentation.",
    module: () => import("../renderer/goldRushRenderer.js"),
  },
  "network-orchestration": {
    kind: "nexus-runtime",
    purpose: "Incremental 50-player room partition orchestration.",
  },
  "results-summary": {
    kind: "runtime-state",
    purpose: "Player-facing winner, placement, score, condition, and extraction contest result summary.",
  },
  "replay-summary": {
    kind: "runtime-state",
    purpose: "Compact deterministic replay key moments from receipt ledgers.",
  },
};

export function createGoldRushSceneKitLoader() {
  const loadedModules = new Map();
  const modulePromises = new Map();
  const activationReceipts = [];
  let activeSite = getGoldRushSceneSite("start");
  let activeKitGroups = [];
  let sequence = 1;

  async function activate(screen) {
    const nextSite = getGoldRushSceneSite(screen);
    const nextGroups = nextSite.kitGroups;
    const previousGroups = activeKitGroups;
    const deactivated = previousGroups.filter((group) => !nextGroups.includes(group));
    const activated = [];

    for (const group of nextGroups) {
      const manifest = kitManifest[group];
      if (!manifest) throw new Error(`unknown scene kit group: ${group}`);
      const module = manifest.module ? await loadModule(group, manifest) : null;
      activated.push({
        group,
        kind: manifest.kind,
        purpose: manifest.purpose,
        moduleLoaded: Boolean(module),
      });
    }

    activeSite = nextSite;
    activeKitGroups = [...nextGroups];
    const receipt = {
      id: `scene-kit-activation-${String(sequence).padStart(4, "0")}`,
      sequence,
      siteId: nextSite.id,
      screen: nextSite.screen,
      loadMode: nextSite.loadMode,
      activated,
      deactivated,
    };
    sequence += 1;
    activationReceipts.push(receipt);
    return receipt;
  }

  async function loadModule(group, manifest = kitManifest[group]) {
    if (!manifest?.module) return null;
    if (loadedModules.has(group)) return loadedModules.get(group);
    if (!modulePromises.has(group)) {
      modulePromises.set(group, manifest.module());
    }
    const module = await modulePromises.get(group);
    loadedModules.set(group, module);
    return module;
  }

  function getModule(group) {
    return loadedModules.get(group) ?? null;
  }

  function snapshot() {
    return {
      activeSite,
      activeKitGroups: [...activeKitGroups],
      loadedModules: [...loadedModules.keys()],
      activationReceipts: activationReceipts.slice(-12),
      knownKitGroups: Object.keys(kitManifest),
    };
  }

  return {
    activate,
    getModule,
    snapshot,
  };
}

export function validateGoldRushSceneKitLoaderSnapshot(snapshot) {
  const failures = [];
  if (!snapshot.activeSite?.id) failures.push("missing-active-site");
  if (!snapshot.activeKitGroups?.length) failures.push("missing-active-kit-groups");
  if (!snapshot.activationReceipts?.length) failures.push("missing-activation-receipts");
  if (snapshot.activeKitGroups.some((group) => !snapshot.knownKitGroups.includes(group))) failures.push("unknown-active-kit-group");
  return {
    passed: failures.length === 0,
    failures,
  };
}
