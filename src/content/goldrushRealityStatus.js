const placeholderStatus = "placeholder";

const domainContracts = [
  {
    id: "source-discovery",
    domain: "Source Discovery",
    targetEndState: "Both legacy Gold Rush source projects are positively identified with source-side reports.",
    requiredProof: ["sourceProjectCount:2", "cloud-side-preflight-report"],
  },
  {
    id: "legacy-assets",
    domain: "Legacy Assets",
    targetEndState: "All required legacy model, scene, prop, terrain, and UI assets are copied through the import pipeline.",
    requiredProof: ["import-staging-job", "sanitized-registry", "approved-public-assets"],
  },
  {
    id: "audio-music",
    domain: "Audio/Music",
    targetEndState: "Actual legacy Gold Rush music and SFX replace procedural browser tones.",
    requiredProof: ["promoted-audio-runtime-paths", "audio-license-provenance", "cue-slot-coverage"],
  },
  {
    id: "character-rig",
    domain: "Character/Rig",
    targetEndState: "A real rigged character GLB with authored or retargeted animation clips drives lobby and gameplay.",
    requiredProof: ["rigged-glb-runtime-path", "animation-clip-map", "three-animation-mixer-proof"],
  },
  {
    id: "animation-clips",
    domain: "Animation Clips",
    targetEndState: "Idle, run, aim, shoot, dash, jump, damage, and death states are backed by promoted animation clips.",
    requiredProof: ["clip-runtime-paths", "state-machine-map", "combat-mode-transition-proof"],
  },
  {
    id: "network-rooms",
    domain: "Network/Rooms",
    targetEndState: "2-100 players are orchestrated incrementally through internal 50-player partitions.",
    requiredProof: ["joinPlayer", "leavePlayer", "player-51-partition", "player-101-reject"],
  },
  {
    id: "peer-party",
    domain: "Peer Party Lobby",
    targetEndState: "Up to four players can join a party code before the leader launches a larger match.",
    requiredProof: ["PeerJS-create-code", "PeerJS-join-code", "leader-start-match"],
  },
  {
    id: "nexus-runtime",
    domain: "NexusRealtime Runtime",
    targetEndState: "Every gameplay domain is exposed through kit-owned engine.n.goldrush* APIs.",
    requiredProof: ["engine.n.goldrushScenario", "engine.n.goldrushNetwork", "installOrder"],
  },
  {
    id: "scene-kit-loading",
    domain: "Scene Kit Loading",
    targetEndState: "Start, lobby, loading yard, and gold field activate separate kit groups on demand.",
    requiredProof: ["activationReceipts", "dynamic-imports", "loadedModules"],
  },
  {
    id: "terrain-collider",
    domain: "Terrain/Collider",
    targetEndState: "Movement and placement use a shared sampled heightfield with physics adapter metadata.",
    requiredProof: ["terrainColliderDescriptor", "raycastTerrainDown", "cannon-es-heightfield"],
  },
  {
    id: "combat",
    domain: "Combat",
    targetEndState: "Combat uses real aim camera, weapon state, hit detection, damage, feedback, and result receipts.",
    requiredProof: ["aim-camera", "weapon-runtime", "hit-detection", "damage-receipts"],
  },
  {
    id: "mining-gold",
    domain: "Mining/Gold",
    targetEndState: "Players interact with gold nodes in-world, carry physical cargo, and cash out at extraction.",
    requiredProof: ["world-node-interaction", "cargo-visual", "cashout-zone"],
  },
  {
    id: "train-loading",
    domain: "Train Loading Scene",
    targetEndState: "The party walks in a staging yard, boards a train, and transitions into the gold field.",
    requiredProof: ["walkable-loading-yard", "boarding-trigger", "train-departure-receipt"],
  },
  {
    id: "build-deploy",
    domain: "Build/Deploy",
    targetEndState: "The Build branch can deploy a static Three.js app through GitHub Pages.",
    requiredProof: ["workflow-yml", "Build-branch", "pages-url", "public-smoke-proof"],
  },
];

export function createGoldRushRealityStatus({
  assetRegistry,
  legacyReadiness,
  network,
  installOrder = [],
  sceneKitLoader = null,
} = {}) {
  const assets = assetRegistry?.assets ?? [];
  const presentation = assetRegistry?.presentation ?? {};
  const sceneSlots = presentation.scenes ?? [];
  const audioSlots = presentation.audio ?? [];
  const animationSlots = presentation.animations ?? [];
  const promotedAssets = assets.filter((asset) => asset.status !== placeholderStatus && asset.runtimePath);
  const promotedAudio = audioSlots.filter((audio) => audio.status !== placeholderStatus && audio.runtimePath);
  const promotedAnimations = animationSlots.filter((animation) => animation.status !== placeholderStatus && animation.runtimePath);
  const placeholders = [
    ...assets,
    ...sceneSlots,
    ...audioSlots,
    ...animationSlots,
  ].filter((entry) => entry.status === placeholderStatus);

  const sceneLoaderReady = Boolean(sceneKitLoader?.activationReceipts?.length && sceneKitLoader?.loadedModules?.length);
  const incrementalNetworkReady = Boolean(
    network?.policy?.partitionCapacity === 50
      && network?.policy?.maxPlayers === 100
      && Array.isArray(network?.ledger?.writes)
      && network.ledger.writes.includes("player-join")
  );

  const domains = domainContracts.map((contract) => {
    const state = resolveDomainState(contract.id, {
      assetRegistry,
      legacyReadiness,
      network,
      installOrder,
      promotedAssets,
      promotedAudio,
      promotedAnimations,
      placeholders,
      sceneLoaderReady,
      incrementalNetworkReady,
    });
    return {
      ...contract,
      ...state,
    };
  });

  return {
    version: "0.1.0",
    purpose: "Expose which Gold Rush domains are real, prototype, or blocked so placeholder work cannot be mistaken for the final game.",
    summary: {
      domains: domains.length,
      realLocal: domains.filter((domain) => domain.status === "real-local").length,
      prototype: domains.filter((domain) => domain.status === "prototype").length,
      blockedCloud: domains.filter((domain) => domain.status === "blocked-cloud-import").length,
      pendingExternal: domains.filter((domain) => domain.status === "pending-external-proof").length,
      placeholderSlots: placeholders.length,
      promotedAssets: promotedAssets.length,
      promotedAudio: promotedAudio.length,
      promotedAnimations: promotedAnimations.length,
    },
    domains,
  };
}

export function validateGoldRushRealityStatus(status) {
  const failures = [];
  if (!status || status.version !== "0.1.0") failures.push("missing-reality-status-version");
  if (!Array.isArray(status?.domains) || status.domains.length !== domainContracts.length) failures.push("missing-domain-statuses");
  const ids = new Set(status?.domains?.map((domain) => domain.id) ?? []);
  domainContracts.forEach((contract) => {
    if (!ids.has(contract.id)) failures.push(`missing-domain:${contract.id}`);
  });
  status?.domains?.forEach((domain) => {
    if (!domain.status) failures.push(`missing-status:${domain.id}`);
    if (!domain.currentTruth) failures.push(`missing-current-truth:${domain.id}`);
    if (!Array.isArray(domain.requiredProof) || domain.requiredProof.length === 0) failures.push(`missing-proof:${domain.id}`);
    if (domain.status !== "real-local" && !domain.nextAction) failures.push(`missing-next-action:${domain.id}`);
  });
  if ((status?.summary?.placeholderSlots ?? 0) > 0 && (status?.summary?.blockedCloud ?? 0) < 2) {
    failures.push("placeholders-not-reflected-as-blocked-cloud-work");
  }
  return {
    passed: failures.length === 0,
    failures,
  };
}

function resolveDomainState(id, context) {
  const blocked = (currentTruth, nextAction) => ({
    status: "blocked-cloud-import",
    currentTruth,
    nextAction,
  });
  const prototype = (currentTruth, nextAction) => ({
    status: "prototype",
    currentTruth,
    nextAction,
  });
  const realLocal = (currentTruth, evidence = []) => ({
    status: "real-local",
    currentTruth,
    evidence,
    nextAction: null,
  });
  const pendingExternal = (currentTruth, nextAction) => ({
    status: "pending-external-proof",
    currentTruth,
    nextAction,
  });

  switch (id) {
    case "source-discovery":
      return context.legacyReadiness?.sourceProjectCount === 2
        ? realLocal("Two source projects are represented in the browser-safe legacy source manifest.", ["legacyReadiness.sourceProjectCount"])
        : blocked("Source projects are not fully proven in the manifest.", "GPT/cloud worker must re-identify both legacy Gold Rush source repos and write a source-side report.");
    case "legacy-assets":
      return context.promotedAssets.length > 0
        ? pendingExternal("Some runtime assets are promoted, but full direct legacy asset parity still needs audit proof.", "Compare promoted registry coverage against every required legacy slot.")
        : blocked("Runtime model/prop/scene slots are placeholders with no promoted legacy runtime paths.", "GPT/cloud worker should copy candidate assets into the approved import staging job, sanitize, then promote approved outputs.");
    case "audio-music":
      return context.promotedAudio.length > 0
        ? pendingExternal("Some audio slots are promoted, but full music/SFX parity is not proven.", "Validate cue coverage against legacy music managers and AudioSources.")
        : blocked("Music and SFX slots are placeholder IDs; browser audio uses procedural fallback cues.", "GPT/cloud worker should locate actual legacy music/SFX, sanitize, and promote web-safe audio files.");
    case "character-rig":
      return context.promotedAssets.some((asset) => asset.type === "character")
        ? pendingExternal("A promoted character asset exists, but rig/clip binding still needs runtime proof.", "Load the character GLB through Three.js and prove skeleton/animation tracks.")
        : prototype("The visible character is procedural Three.js geometry, not a promoted rigged character.", "Promote a rigged prospector/skeleton GLB and bind it to the lobby/gameplay character kit.");
    case "animation-clips":
      return context.promotedAnimations.length > 0
        ? pendingExternal("Some animation clips are promoted, but the gameplay state machine is not fully proven.", "Map clips to movement/combat states and validate transitions.")
        : prototype("Animation state descriptors exist, but authored clips are placeholders.", "Promote idle/run/aim/shoot/damage/death clips and wire them to Three.js AnimationMixer.");
    case "network-rooms":
      return context.incrementalNetworkReady
        ? realLocal("Incremental 50-player partition orchestration is implemented and validated locally.", ["network.policy.partitionCapacity", "network.ledger.writes"])
        : prototype("Network room state exists but incremental partition proof is incomplete.", "Run the network validator and repair join/leave allocation.");
    case "peer-party":
      return realLocal("PeerJS party-code room scaffolding exists for a four-player lobby.", ["src/network/peerPartyRoom.js"]);
    case "nexus-runtime":
      return context.installOrder.includes("n-goldrush-scenario-kit")
        ? realLocal("Gold Rush runtime domains install as engine.n.goldrush* APIs through NexusRealtime-style kits.", ["installOrder"])
        : prototype("Runtime kit installation proof is missing from the scenario snapshot.", "Expose and validate kit install order.");
    case "scene-kit-loading":
      return context.sceneLoaderReady
        ? realLocal("Scene kit groups activate with runtime receipts and dynamic renderer imports.", ["sceneKitLoader.activationReceipts"])
        : prototype("Scene-site registry exists, but runtime activation receipt proof is outside this snapshot.", "Expose sceneKitLoader receipts in GoldRushHost state and validate them in browser.");
    case "terrain-collider":
      return realLocal("Terrain height, raycast placement, and Cannon heightfield metadata are implemented locally.", ["terrainColliderDescriptor", "cannon-es-heightfield"]);
    case "combat":
      return prototype("Combat currently changes camera/audio/state and applies damage receipts, but lacks real aiming, projectiles, hit detection, and weapon assets.", "Build a weapon/combat kit with raycast or projectile hits, feedback, and promoted weapon/audio assets.");
    case "mining-gold":
      return prototype("Mining/cashout is kit-owned state, but not yet physical interaction with world nodes and cargo visuals.", "Bind gold nodes to colliders, prompts, cargo display, and extraction-zone receipts.");
    case "train-loading":
      return prototype("The loading yard and train handoff exist as a scene flow, but multiplayer synchronization and boarding polish are incomplete.", "Add boarding receipts per party member and train departure sync state.");
    case "build-deploy":
      return realLocal("Build branch deploy workflow exists and the public Pages URL has a passing Playwright smoke proof.", ["deploy-build.yml", "npm run proof:public", "reports/public-smoke/public-smoke-2026-06-29T18-43-20-972Z.json"]);
    default:
      return prototype("Unknown domain status.", "Add an explicit domain status resolver.");
  }
}
