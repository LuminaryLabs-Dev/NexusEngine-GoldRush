import { defineDomainServiceKit } from "nexusrealtime";
import {
  createAnimationStateDescriptor,
  createAudioStateDescriptor,
  createGoldRushWorldElements,
  createGoldZoneDescriptors,
  createPathNetworkDescriptors,
  createTownLayoutDescriptors,
  validateGoldRushWorldElements,
} from "../content/goldrushWorldElements.js";
import {
  createLegacySourceReadiness,
  goldRushLegacySourceManifest,
  validateLegacySourceManifest,
} from "../content/goldrushLegacySourceManifest.js";
import {
  createGoldRushRealityStatus,
  validateGoldRushRealityStatus,
} from "../content/goldrushRealityStatus.js";
import {
  goldRushLegacyModes,
  resolveLegacyMode,
  validateLegacyModes,
} from "../content/goldrushLegacyModes.js";
import {
  createGoldRushCameraPerspectives,
  selectGoldRushCameraPerspective,
  validateGoldRushCameraPerspectives,
} from "../content/goldrushCameraPerspectives.js";
import {
  createExtractionReceiptKit,
  createFinalRushKit,
  createMatchLifecycleKit,
  createMatchResultsKit,
  createReplaySummaryKit,
  createRoomHandoffReceiptKit,
  createScoringKit,
} from "./goldRushMatchLifecycleKits.js";
import { createGoldRushExtractionLoopKit } from "./goldRushExtractionLoopKit.js";
import { createGenericIncubatorDomainKits } from "./generic-incubator/genericDomainServiceKits.js";
import { createGoldRushKitContractRegistryKit } from "./goldrush/goldRushKitContractRegistry.js";

const version = "0.1.0";
const stability = "prototype";

export function createGoldRushDomainKits({ orchestrator, assetRegistry }) {
  return [
    ...createGenericIncubatorDomainKits(),
    createGoldRushKitContractRegistryKit(),
    createNetworkKit({ orchestrator }),
    createRoomOrchestratorKit({ orchestrator }),
    createAssetRegistryKit({ assetRegistry }),
    createLegacySourceKit({ assetRegistry }),
    createRealityStatusKit(),
    createWorldElementKit(),
    createTerrainPatchWindowKit(),
    createTownLayoutKit(),
    createPathNetworkKit(),
    createGoldZoneKit(),
    createLoadingGateKit(),
    createMiningKit(),
    createCargoKit(),
    createCashoutKit(),
    createCombatKit(),
    createGoldRushExtractionLoopKit(),
    createCameraDescriptorKit(),
    createPerspectiveKit(),
    createSceneTransitionKit(),
    createAudioStateKit(),
    createAnimationStateKit(),
    createLegacyModeKit(),
    createMatchLifecycleKit(),
    createFinalRushKit(),
    createExtractionReceiptKit(),
    createRoomHandoffReceiptKit(),
    createScoringKit(),
    createMatchResultsKit(),
    createReplaySummaryKit(),
    createScenarioKit(),
  ];
}

function createRoomOrchestratorKit({ orchestrator }) {
  return defineDomainServiceKit({
    id: "n-goldrush-room-orchestrator-kit",
    domain: "goldrush-room-orchestrator",
    apiName: "goldrushRooms",
    stability,
    version,
    requires: ["n:goldrush-network"],
    services: ["generate", "snapshot", "handoff"],
    metadata: {
      purpose: "Compatibility facade over the resolved Gold Rush network kit.",
    },
    createApi({ engine }) {
      return {
        generate({ players, phase } = {}) {
          return structuredClone(engine.n.goldrushNetwork.generate({ players, phase }).rooms);
        },
        snapshot() {
          return structuredClone(engine.n.goldrushNetwork.snapshot().rooms);
        },
        handoffEvent({ playerId, fromRoomId, toRoomId, reason }) {
          const network = engine.n.goldrushNetwork.snapshot();
          return {
            type: "room.playerTransferRequested",
            playerId,
            fromRoomId,
            toRoomId,
            reason,
            ledgerId: network.ledger.id,
          };
        },
      };
    },
  });
}

function createNetworkKit({ orchestrator }) {
  return defineDomainServiceKit({
    id: "n-goldrush-network-kit",
    domain: "goldrush-network",
    apiName: "goldrushNetwork",
    stability,
    version,
    services: ["generate", "snapshot", "join-player", "leave-player", "handoff", "validate"],
    metadata: {
      purpose: "Own multiplayer network topology while keeping 50-player partitions internal and resolved.",
    },
    createApi() {
      let session = orchestrator.createSession({ players: 2, phase: "lobby" });
      let network = session.snapshot();

      return {
        generate({ players, phase = "lobby" } = {}) {
          session = orchestrator.createSession({ players, phase });
          network = session.snapshot();
          return structuredClone(network);
        },
        joinPlayer({ playerId = null, source = "browser-instance" } = {}) {
          const receipt = session.joinPlayer({ playerId, source });
          network = receipt.snapshot;
          return structuredClone(receipt);
        },
        leavePlayer({ playerId, reason = "left-session" } = {}) {
          const receipt = session.leavePlayer({ playerId, reason });
          network = receipt.snapshot;
          return structuredClone(receipt);
        },
        snapshot() {
          return structuredClone(network);
        },
        handoff({ playerId = "player-1", fromPartitionId = "partition-1", toPartitionId = "partition-2", reason = "loading-gate" } = {}) {
          const receipt = session.handoff({ playerId, toPartitionId, reason });
          network = receipt.snapshot;
          return structuredClone({
            ...receipt,
            fromPartitionId: receipt.fromPartitionId ?? fromPartitionId,
            ledgerId: network.ledger.id,
          });
        },
        validate() {
          const failures = [];
          if (network.players < network.policy.minPlayers || network.players > network.policy.maxPlayers) {
            failures.push("network-player-count-out-of-range");
          }
          if (network.policy.partitionCapacity !== 50) failures.push("partition-capacity-changed");
          if (network.partitions.length < 1 || network.partitions.length > 2) failures.push("invalid-partition-count");
          if (network.partitions.some((partition) => partition.playerCount > partition.capacity)) {
            failures.push("partition-player-count-invalid");
          }
          if (network.ledger.highWaterPartitionCount !== network.partitions.length) failures.push("network-ledger-high-water-mismatch");
          if (!network.ledger.writes.includes("player-join") || !network.ledger.writes.includes("player-leave")) failures.push("network-ledger-missing-incremental-writes");
          if (network.topology.publicLabel !== "network-ready") failures.push("network-not-publicly-ready");
          if (network.policy.playerJoinUiFocus !== "deferred") failures.push("player-join-ui-not-deferred");
          if (!network.debug || network.debug.visibleInPrimaryHud !== false) failures.push("internal-partitions-not-hidden");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createAssetRegistryKit({ assetRegistry }) {
  return defineDomainServiceKit({
    id: "n-goldrush-asset-registry-kit",
    domain: "goldrush-asset-registry",
    apiName: "goldrushAssets",
    stability,
    version,
    services: ["snapshot", "resolve"],
    metadata: {
      purpose: "Expose only approved browser runtime assets to the game host.",
    },
    createApi() {
      return {
        snapshot() {
          return structuredClone(assetRegistry);
        },
        resolve(assetId) {
          return assetRegistry.assets.find((asset) => asset.id === assetId) ?? null;
        },
      };
    },
  });
}

function createLegacySourceKit({ assetRegistry }) {
  return defineDomainServiceKit({
    id: "n-goldrush-legacy-source-kit",
    domain: "goldrush-legacy-source",
    apiName: "goldrushLegacySources",
    stability,
    version,
    requires: ["n:goldrush-asset-registry"],
    services: ["snapshot", "readiness", "import-request", "validate"],
    metadata: {
      purpose: "Own the cloud-side legacy source intake contract without importing raw files locally.",
    },
    createApi() {
      return {
        snapshot() {
          return structuredClone(goldRushLegacySourceManifest);
        },
        readiness() {
          return createLegacySourceReadiness({ assetRegistry });
        },
        importRequest({ importJobId = "goldrush-dual-source-next" } = {}) {
          return {
            importJobId,
            status: "ready-for-private-cloud-worker",
            sourceProjectCount: goldRushLegacySourceManifest.sourceProjects.length,
            requiredStages: goldRushLegacySourceManifest.requiredImportStages,
            targetFolders: goldRushLegacySourceManifest.targetFolders,
            playableFamilies: goldRushLegacySourceManifest.browserPlayableFamilies.map((family) => ({
              familyId: family.familyId,
              requiredSlots: family.requiredSlots,
            })),
            localCodexRule: "edit-destination-repo-only",
          };
        },
        validate() {
          return validateLegacySourceManifest(goldRushLegacySourceManifest);
        },
      };
    },
  });
}

function createRealityStatusKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-reality-status-kit",
    domain: "goldrush-reality-status",
    apiName: "goldrushReality",
    stability,
    version,
    requires: ["n:goldrush-asset-registry", "n:goldrush-legacy-source", "n:goldrush-network"],
    services: ["snapshot", "validate"],
    metadata: {
      purpose: "Expose real, prototype, and cloud-blocked domains so placeholders are never mistaken for completed Gold Rush parity.",
    },
    createApi({ engine }) {
      return {
        snapshot({ sceneKitLoader = null } = {}) {
          return createGoldRushRealityStatus({
            assetRegistry: engine.n.goldrushAssets.snapshot(),
            legacyReadiness: engine.n.goldrushLegacySources.readiness(),
            network: engine.n.goldrushNetwork.snapshot(),
            installOrder: engine.game?.installOrder ?? [],
            sceneKitLoader,
          });
        },
        validate({ sceneKitLoader = null } = {}) {
          return validateGoldRushRealityStatus(this.snapshot({ sceneKitLoader }));
        },
      };
    },
  });
}

function createLegacyModeKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-legacy-mode-kit",
    domain: "goldrush-legacy-mode",
    apiName: "goldrushLegacyModes",
    stability,
    version,
    requires: ["n:goldrush-scene-transition", "n:goldrush-perspective", "n:goldrush-legacy-source"],
    services: ["set", "cycle", "snapshot", "validate"],
    metadata: {
      purpose: "Own which old Gold Rush version intent is currently playable inside the unified browser runtime.",
    },
    createApi({ engine }) {
      let activeModeId = "modernExtraction";
      const history = [];

      function applyMode(modeId, reason = "manual") {
        const mode = resolveLegacyMode(modeId);
        activeModeId = mode.modeId;
        engine.n.goldrushScenes.transition({
          toSceneId: mode.sceneId,
          transitionId: mode.modeId === "classicCombat"
            ? "goldrush.transition.explorationToCombat"
            : mode.modeId === "modernExtraction"
              ? "goldrush.transition.lobbyToArena"
              : "goldrush.transition.direct",
          reason: `legacy-mode:${reason}`,
        });
        engine.n.goldrushPerspective.set(mode.cameraMode);
        const receipt = {
          modeId: mode.modeId,
          sceneId: mode.sceneId,
          cameraMode: mode.cameraMode,
          reason,
          tick: engine.clock?.frame ?? 0,
        };
        history.push(receipt);
        return receipt;
      }

      return {
        set({ modeId = "modernExtraction", reason = "manual" } = {}) {
          return { accepted: true, receipt: applyMode(modeId, reason), snapshot: this.snapshot() };
        },
        cycle() {
          const currentIndex = goldRushLegacyModes.findIndex((mode) => mode.modeId === activeModeId);
          const nextMode = goldRushLegacyModes[(currentIndex + 1) % goldRushLegacyModes.length];
          return this.set({ modeId: nextMode.modeId, reason: "cycle" });
        },
        snapshot() {
          const activeMode = resolveLegacyMode(activeModeId);
          const readiness = engine.n.goldrushLegacySources.readiness();
          const familyReadiness = Object.fromEntries(
            activeMode.requiredSlotFamilies.map((familyId) => {
              const family = readiness.families.find((entry) => entry.familyId === familyId);
              return [familyId, family?.status ?? "unknown"];
            })
          );
          return structuredClone({
            version,
            activeMode,
            modes: goldRushLegacyModes,
            familyReadiness,
            unifiedRuntime: {
              oneGame: true,
              perspectiveSwitchesInCombat: activeMode.cameraMode === "combat",
              sourceVersionRole: activeMode.sourceVersionRole,
            },
            history: history.slice(-12),
          });
        },
        validate() {
          const modeValidation = validateLegacyModes(goldRushLegacyModes);
          const snapshot = this.snapshot();
          const failures = [...modeValidation.failures];
          if (!snapshot.unifiedRuntime.oneGame) failures.push("not-unified-runtime");
          if (!snapshot.modes.some((mode) => mode.modeId === "classicCombat" && mode.cameraMode === "combat")) {
            failures.push("missing-combat-perspective-shift");
          }
          if (!snapshot.modes.some((mode) => mode.sourceKey === "goldrush-modern-unity")) failures.push("missing-modern-source-mode");
          if (!snapshot.modes.some((mode) => mode.sourceKey === "goldrush-classic-unity")) failures.push("missing-classic-source-mode");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createMiningKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-mining-kit",
    domain: "goldrush-mining",
    apiName: "goldrushMining",
    stability,
    version,
    requires: ["n:goldrush-gold-zones"],
    services: ["seed", "mine", "snapshot"],
    metadata: {
      purpose: "Own gold nodes, mining progress, depletion, and yield.",
    },
    createApi({ engine }) {
      let nodes = [];

      return {
        seed({ players, shardCount }) {
          const zones = engine.n.goldrushGoldZones.snapshot();
          nodes = Array.from({ length: Math.max(4, shardCount * 6, zones.length * 3) }, (_, index) => {
            const zone = zones[index % zones.length];
            return {
              id: `gold-node-${index + 1}`,
              shardId: `shard-${(index % shardCount) + 1}`,
              zoneId: zone?.goldZoneId ?? null,
              roomWindowIds: zone?.patchWindowIds ?? [],
              pickupValue: zone?.goldAmountPerPickup ?? 10,
              remainingGold: 80 + players + index * 13,
              depleted: false,
            };
          });
          return structuredClone(nodes);
        },
        mine({ nodeId, amount = 20 }) {
          const node = nodes.find((entry) => entry.id === nodeId);
          if (!node || node.depleted) return { yieldedGold: 0, depleted: true };
          const yieldedGold = Math.min(amount, node.remainingGold);
          node.remainingGold -= yieldedGold;
          node.depleted = node.remainingGold <= 0;
          return { yieldedGold, depleted: node.depleted };
        },
        snapshot() {
          return structuredClone(nodes);
        },
      };
    },
  });
}

function createCargoKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-cargo-kit",
    domain: "goldrush-cargo",
    apiName: "goldrushCargo",
    stability,
    version,
    services: ["seed", "add", "drop", "snapshot"],
    metadata: {
      purpose: "Own carried gold, capacity, weight pressure, drops, and transfers.",
    },
    createApi() {
      const carriedByPlayer = new Map();

      return {
        seed({ players }) {
          carriedByPlayer.clear();
          for (let index = 1; index <= players; index += 1) {
            carriedByPlayer.set(`player-${index}`, 0);
          }
        },
        add({ playerId, amount }) {
          const current = carriedByPlayer.get(playerId) ?? 0;
          const next = Math.min(250, current + Math.max(0, amount));
          carriedByPlayer.set(playerId, next);
          return { playerId, carriedGold: next, weightPenalty: Number((next / 250).toFixed(2)) };
        },
        drop({ playerId, reason }) {
          const droppedGold = carriedByPlayer.get(playerId) ?? 0;
          carriedByPlayer.set(playerId, 0);
          return { playerId, droppedGold, reason };
        },
        snapshot() {
          return Object.fromEntries(carriedByPlayer);
        },
      };
    },
  });
}

function createCashoutKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-cashout-kit",
    domain: "goldrush-cashout",
    apiName: "goldrushCashout",
    stability,
    version,
    requires: ["n:goldrush-cargo"],
    services: ["deposit", "snapshot"],
    metadata: {
      purpose: "Own extraction deposits, score ledger, and duplicate deposit protection.",
    },
    createApi({ engine }) {
      const bankedByPlayer = new Map();
      const depositIds = new Set();

      return {
        deposit({ playerId, depositId }) {
          if (depositIds.has(depositId)) {
            return { accepted: false, reason: "duplicate-deposit", bankedGold: bankedByPlayer.get(playerId) ?? 0 };
          }
          depositIds.add(depositId);
          const drop = engine.n.goldrushCargo.drop({ playerId, reason: "cashout" });
          const next = (bankedByPlayer.get(playerId) ?? 0) + drop.droppedGold;
          bankedByPlayer.set(playerId, next);
          return { accepted: true, playerId, bankedGold: next, depositedGold: drop.droppedGold };
        },
        snapshot() {
          return Object.fromEntries(bankedByPlayer);
        },
      };
    },
  });
}

function createCombatKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-combat-kit",
    domain: "goldrush-combat",
    apiName: "goldrushCombat",
    stability,
    version,
    requires: ["n:goldrush-cargo"],
    services: ["enter", "exit", "shoot", "damage", "snapshot"],
    metadata: {
      purpose: "Own combat state where gold functions as ammo, health, loot, and score risk.",
    },
    createApi({ engine }) {
      let active = false;
      let clusterId = null;
      const receipts = [];

      return {
        enter({ cluster = "combat-cluster-1" } = {}) {
          active = true;
          clusterId = cluster;
          return { active, clusterId };
        },
        exit() {
          active = false;
          clusterId = null;
          return { active, clusterId };
        },
        shoot({ playerId, cost = 1 }) {
          const cargo = engine.n.goldrushCargo.add({ playerId, amount: 0 });
          if (cargo.carriedGold < cost) {
            return { accepted: false, reason: "not-enough-gold-ammo" };
          }
          const dropped = engine.n.goldrushCargo.drop({ playerId, reason: "shot-cost-reset" });
          engine.n.goldrushCargo.add({ playerId, amount: Math.max(0, dropped.droppedGold - cost) });
          const receipt = { type: "combat.shot", playerId, cost, clusterId };
          receipts.push(receipt);
          return { accepted: true, receipt };
        },
        damage({ playerId, percent = 0.25 }) {
          const current = engine.n.goldrushCargo.snapshot()[playerId] ?? 0;
          const loss = Math.ceil(current * percent);
          const dropped = engine.n.goldrushCargo.drop({ playerId, reason: "damage" });
          const remaining = Math.max(0, dropped.droppedGold - loss);
          engine.n.goldrushCargo.add({ playerId, amount: remaining });
          const receipt = { type: "combat.damage", playerId, loss, remaining, eliminated: remaining <= 0 };
          receipts.push(receipt);
          return receipt;
        },
        snapshot() {
          return { active, clusterId, receipts: receipts.slice(-20) };
        },
      };
    },
  });
}

function createPerspectiveKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-perspective-kit",
    domain: "goldrush-perspective",
    apiName: "goldrushPerspective",
    stability,
    version,
    requires: ["n:goldrush-combat"],
    services: ["set", "snapshot"],
    metadata: {
      purpose: "Own exploration/combat camera descriptors from combat state.",
    },
    createApi({ engine }) {
      let requestedMode = "exploration";
      const perspectiveCatalog = createGoldRushCameraPerspectives({ count: 1000 });

      return {
        set(mode) {
          requestedMode = mode === "combat" ? "combat" : "exploration";
          if (requestedMode === "combat") engine.n.goldrushCombat.enter();
          if (requestedMode === "exploration") engine.n.goldrushCombat.exit();
          return this.snapshot();
        },
        snapshot() {
          const combat = engine.n.goldrushCombat.snapshot();
          const mode = combat.active ? "combat" : requestedMode;
          return {
            mode,
            descriptor: mode === "combat"
              ? { camera: "over-shoulder-combat", height: 2.1, distance: 4.2, target: combat.clusterId }
              : { camera: "over-shoulder-travel", height: 2.8, distance: 6.4, target: "player-route" },
          };
        },
      };
    },
  });
}

function createSceneTransitionKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-scene-transition-kit",
    domain: "goldrush-scene-transition",
    apiName: "goldrushScenes",
    stability,
    version,
    requires: ["n:goldrush-asset-registry"],
    services: ["transition", "phase", "snapshot"],
    metadata: {
      purpose: "Own browser scene state, transition receipts, audio cues, and animation cues.",
    },
    createApi({ engine }) {
      let currentSceneId = "goldrush.scene.mainMenu";
      let lastTransition = {
        id: "goldrush.transition.bootToMainMenu",
        from: null,
        to: currentSceneId,
        audioCueId: "goldrush.audio.music.wandering",
        animationCueId: "goldrush.anim.player.idle",
        reason: "initial",
      };
      const history = [lastTransition];

      return {
        transition({ toSceneId, transitionId, reason = "manual" }) {
          const assets = engine.n.goldrushAssets.snapshot();
          const transition = assets.presentation.transitions.find((entry) => {
            if (transitionId) return entry.id === transitionId;
            return entry.from === currentSceneId && entry.to === toSceneId;
          }) ?? {
            id: transitionId ?? "goldrush.transition.direct",
            audioCueId: "goldrush.audio.music.wandering",
            animationCueId: "goldrush.anim.player.idle",
          };
          lastTransition = {
            id: transition.id,
            from: currentSceneId,
            to: toSceneId,
            audioCueId: transition.audioCueId,
            animationCueId: transition.animationCueId,
            reason,
          };
          currentSceneId = toSceneId;
          history.push(lastTransition);
          return this.snapshot();
        },
        phase(phase) {
          const transition = transitionForPhase(phase);
          return this.transition({ ...transition, reason: `phase:${phase}` });
        },
        snapshot() {
          const assets = engine.n.goldrushAssets.snapshot();
          const scene = assets.presentation.scenes.find((entry) => entry.id === currentSceneId) ?? null;
          return {
            currentSceneId,
            scene,
            lastTransition: structuredClone(lastTransition),
            activeAudioCueId: lastTransition.audioCueId,
            activeAnimationCueId: lastTransition.animationCueId,
            history: history.slice(-10),
          };
        },
      };
    },
  });
}

function createWorldElementKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-world-element-kit",
    domain: "goldrush-world-elements",
    apiName: "goldrushWorld",
    stability,
    version,
    requires: ["n:goldrush-network"],
    services: ["snapshot", "room-window", "validate"],
    metadata: {
      purpose: "Own world scale, towns, mountains, paths, gold zones, loading gates, and room patch windows.",
    },
    createApi({ engine }) {
      return {
        snapshot({ phase = "lobby" } = {}) {
          return createGoldRushWorldElements({ network: engine.n.goldrushNetwork.snapshot(), phase });
        },
        roomWindow(shardId) {
          const world = this.snapshot();
          return world.roomPatchWindows.find((window) => window.shardId === shardId) ?? null;
        },
        validate() {
          return validateGoldRushWorldElements(this.snapshot());
        },
      };
    },
  });
}

function createTownLayoutKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-town-layout-kit",
    domain: "goldrush-town-layout",
    apiName: "goldrushTowns",
    stability,
    version,
    requires: ["n:goldrush-world-elements"],
    services: ["snapshot", "for-room-window", "validate"],
    metadata: {
      purpose: "Own town anchors, street graphs, building descriptors, and settlement transition hooks.",
    },
    createApi({ engine }) {
      return {
        snapshot() {
          return createTownLayoutDescriptors(engine.n.goldrushWorld.snapshot());
        },
        forRoomWindow(roomWindowId) {
          return this.snapshot().filter((town) => town.patchWindowIds.includes(roomWindowId));
        },
        validate() {
          const towns = this.snapshot();
          const failures = [];
          if (towns.length < 3) failures.push("missing-town-layouts");
          if (towns.some((town) => town.buildings.length < 6)) failures.push("town-building-count-too-low");
          if (towns.some((town) => town.streetGraph.nodes.length < 7)) failures.push("town-street-graph-too-small");
          if (towns.some((town) => town.streetGraph.edges.length < town.streetGraph.nodes.length - 1)) {
            failures.push("town-street-graph-disconnected");
          }
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createTerrainPatchWindowKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-terrain-patch-window-kit",
    domain: "goldrush-terrain-patch-window",
    apiName: "goldrushTerrain",
    stability,
    version,
    requires: ["n:goldrush-world-elements"],
    services: ["snapshot", "window-for-shard", "patch-for-point", "validate"],
    metadata: {
      purpose: "Own terrain scale, patch grid, active room windows, and point-to-patch mapping.",
    },
    createApi({ engine }) {
      function snapshot({ phase = "lobby" } = {}) {
        const world = engine.n.goldrushWorld.snapshot({ phase });
        const columns = Math.ceil(world.scale.widthMeters / world.scale.patchMeters);
        const rows = Math.ceil(world.scale.depthMeters / world.scale.patchMeters);
        const activePatchIds = world.activeRoomWindows.flatMap((window) => {
          const ids = [];
          for (let x = window.originPatch.x - window.patchRadius; x <= window.originPatch.x + window.patchRadius; x += 1) {
            for (let z = window.originPatch.z - window.patchRadius; z <= window.originPatch.z + window.patchRadius; z += 1) {
              ids.push(`patch.${x}.${z}`);
            }
          }
          return ids;
        });
        return {
          version,
          phase,
          scale: world.scale,
          patchGrid: {
            columns,
            rows,
            patchMeters: world.scale.patchMeters,
            activePatchIds,
          },
          roomPatchWindows: world.roomPatchWindows.map((window) => ({
            ...window,
            active: world.activeRoomWindows.some((activeWindow) => activeWindow.id === window.id),
          })),
        };
      }

      return {
        snapshot,
        windowForShard(shardId) {
          return snapshot().roomPatchWindows.find((window) => window.shardId === shardId) ?? null;
        },
        patchForPoint({ x, z }) {
          const terrain = snapshot();
          return {
            id: `patch.${Math.floor(x / terrain.scale.patchMeters)}.${Math.floor(z / terrain.scale.patchMeters)}`,
            x: Math.floor(x / terrain.scale.patchMeters),
            z: Math.floor(z / terrain.scale.patchMeters),
          };
        },
        validate() {
          const terrain = snapshot();
          const failures = [];
          if (terrain.patchGrid.columns < 40 || terrain.patchGrid.rows < 25) failures.push("patch-grid-too-small");
          if (terrain.roomPatchWindows.length < 2) failures.push("missing-room-windows");
          if (terrain.roomPatchWindows.some((window) => window.patchRadius < 5)) failures.push("room-window-too-small");
          if (terrain.patchGrid.activePatchIds.length < 100) failures.push("active-patch-count-too-low");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createPathNetworkKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-path-network-kit",
    domain: "goldrush-path-network",
    apiName: "goldrushPaths",
    stability,
    version,
    requires: ["n:goldrush-world-elements", "n:goldrush-town-layout"],
    services: ["snapshot", "for-town", "validate"],
    metadata: {
      purpose: "Own roads, rail, cashout routes, choke-point paths, and town/gold-zone connections.",
    },
    createApi({ engine }) {
      return {
        snapshot() {
          return createPathNetworkDescriptors(engine.n.goldrushWorld.snapshot());
        },
        forTown(townId) {
          return this.snapshot().filter((path) => path.connectedTownIds.includes(townId));
        },
        validate() {
          const paths = this.snapshot();
          const towns = engine.n.goldrushTowns.snapshot();
          const failures = [];
          if (paths.length < 4) failures.push("missing-path-network");
          if (paths.some((path) => path.points.length < 4)) failures.push("path-too-short");
          if (towns.some((town) => this.forTown(town.townId).length === 0)) failures.push("town-without-path");
          if (!paths.some((path) => path.tags.includes("extraction"))) failures.push("missing-extraction-path");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createGoldZoneKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-gold-zone-kit",
    domain: "goldrush-gold-zones",
    apiName: "goldrushGoldZones",
    stability,
    version,
    requires: ["n:goldrush-world-elements", "n:goldrush-path-network"],
    services: ["snapshot", "for-room-window", "validate"],
    metadata: {
      purpose: "Own multiplayer gold zones, spawn cadence, pickup values, and route links.",
    },
    createApi({ engine }) {
      return {
        snapshot() {
          const zones = createGoldZoneDescriptors(engine.n.goldrushWorld.snapshot());
          const paths = engine.n.goldrushPaths.snapshot();
          return zones.map((zone) => ({
            ...zone,
            connectedPathIds: paths
              .filter((path) => path.connectedGoldZoneIds.includes(zone.goldZoneId))
              .map((path) => path.pathId),
          }));
        },
        forRoomWindow(roomWindowId) {
          return this.snapshot().filter((zone) => zone.patchWindowIds.includes(roomWindowId));
        },
        validate() {
          const zones = this.snapshot();
          const failures = [];
          if (zones.length < 4) failures.push("missing-gold-zones");
          if (zones.some((zone) => zone.goldAmountPerPickup !== 10)) failures.push("legacy-gold-pickup-value-mismatch");
          if (zones.some((zone) => zone.connectedPathIds.length === 0)) failures.push("gold-zone-without-path");
          if (zones.some((zone) => zone.radius < 140)) failures.push("gold-zone-too-small");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createLoadingGateKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-loading-gate-kit",
    domain: "goldrush-loading-gates",
    apiName: "goldrushLoadingGates",
    stability,
    version,
    requires: ["n:goldrush-world-elements", "n:goldrush-terrain-patch-window", "n:goldrush-path-network"],
    services: ["snapshot", "request-handoff", "validate"],
    metadata: {
      purpose: "Own loading and room-handoff gate descriptors that connect room windows, paths, and scene transitions.",
    },
    createApi({ engine }) {
      let lastHandoff = null;
      let handoffCounter = 0;

      return {
        snapshot() {
          const world = engine.n.goldrushWorld.snapshot();
          const terrain = engine.n.goldrushTerrain.snapshot();
          const pathIds = new Set(engine.n.goldrushPaths.snapshot().map((path) => path.pathId));
          return {
            version,
            gates: world.loadingGates.map((gate) => ({
              ...gate,
              status: terrain.roomPatchWindows.some((window) => window.id === gate.fromRoomWindowId)
                && terrain.roomPatchWindows.some((window) => window.id === gate.toRoomWindowId)
                && pathIds.has(gate.triggerPathId)
                ? "ready"
                : "invalid",
            })),
            lastHandoff,
          };
        },
        requestHandoff({ gateId, playerId = "player-1", reason = "manual" }) {
          const gate = this.snapshot().gates.find((entry) => entry.id === gateId);
          handoffCounter += 1;
          lastHandoff = gate && gate.status === "ready"
            ? {
                handoffId: `handoff-${handoffCounter}`,
                gateId,
                playerId,
                from: gate.fromRoomWindowId,
                to: gate.toRoomWindowId,
                accepted: true,
                reason,
                rejectionReason: null,
              }
            : {
                handoffId: `handoff-rejected-${handoffCounter}`,
                gateId,
                playerId,
                from: null,
                to: null,
                accepted: false,
                reason,
                rejectionReason: gate ? "gate-not-ready" : "unknown-gate",
              };
          return structuredClone(lastHandoff);
        },
        validate() {
          const loading = this.snapshot();
          const failures = [];
          if (loading.gates.length < 2) failures.push("missing-loading-gates");
          if (loading.gates.some((gate) => gate.status !== "ready")) failures.push("invalid-loading-gate");
          if (loading.gates.some((gate) => !gate.transitionId.startsWith("goldrush.transition."))) {
            failures.push("invalid-transition-reference");
          }
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createAudioStateKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-audio-state-kit",
    domain: "goldrush-audio-state",
    apiName: "goldrushAudio",
    stability,
    version,
    requires: ["n:goldrush-combat", "n:goldrush-scene-transition"],
    services: ["snapshot", "validate"],
    metadata: {
      purpose: "Own music state and one-shot cue descriptors from phase, combat, and scene transitions.",
    },
    createApi({ engine }) {
      return {
        snapshot({ phase = "lobby" } = {}) {
          return createAudioStateDescriptor({
            phase,
            combatActive: engine.n.goldrushCombat.snapshot().active,
            sceneState: engine.n.goldrushScenes.snapshot(),
          });
        },
        validate() {
          const audio = this.snapshot({ phase: "combat" });
          const failures = [];
          if (!audio.musicCueId.startsWith("goldrush.audio.music.")) failures.push("missing-music-cue");
          if (!Number.isFinite(audio.crossfadeSeconds)) failures.push("invalid-crossfade");
          if (audio.oneShots.some((shot) => !shot.dedupeId)) failures.push("missing-oneshot-dedupe");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createCameraDescriptorKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-camera-descriptor-kit",
    domain: "goldrush-camera-descriptor",
    apiName: "goldrushCamera",
    stability,
    version,
    requires: ["n:goldrush-combat", "n:goldrush-terrain-patch-window"],
    services: ["snapshot", "set-mode", "validate"],
    metadata: {
      purpose: "Own richer camera descriptors while preserving legacy perspective behavior.",
    },
    createApi({ engine }) {
      let requestedMode = "exploration";
      const perspectiveCatalog = createGoldRushCameraPerspectives({ count: 1000 });

      return {
        set(mode) {
          requestedMode = mode === "combat" ? "combat" : mode === "loading" ? "loading" : "exploration";
          return this.snapshot();
        },
        snapshot({ phase = "lobby" } = {}) {
          const combat = engine.n.goldrushCombat.snapshot();
          const terrain = engine.n.goldrushTerrain.snapshot({ phase });
          const activeWindow = terrain.roomPatchWindows.find((window) => window.active) ?? terrain.roomPatchWindows[0];
          const mode = combat.active ? "combat" : phase === "extract" ? "cashout" : requestedMode;
          const selectedPerspective = selectGoldRushCameraPerspective(perspectiveCatalog, {
            mode,
            phase,
            tick: engine.clock?.frame ?? 0,
          });
          return {
            version,
            mode,
            perspectiveCatalog,
            selectedPerspective,
            perspectiveCount: perspectiveCatalog.count,
            perspectiveFamilies: perspectiveCatalog.families,
            legacyCameraModel: {
              type: "over-the-shoulder-third-person",
              outOfCombatSize: 20,
              inCombatSizeMultiplier: 2.5,
              minSize: 10,
              maxSize: 30,
              followSmoothTime: 0.3,
              sizeChangeSpeed: 5,
            },
            threeDescriptor: selectedPerspective.threeDescriptor,
            focus: {
              kind: mode === "combat" ? "over-shoulder-combat" : "over-shoulder-travel",
              targetId: mode === "combat" ? combat.clusterId : activeWindow?.id ?? null,
              center: activeWindow?.originPatch ?? { x: 0, z: 0 },
              playerIds: [],
            },
          };
        },
        validate() {
          const camera = this.snapshot({ phase: "prospect" });
          const failures = [];
          if (!["exploration", "combat", "cashout", "loading"].includes(camera.mode)) failures.push("invalid-camera-mode");
          if (!camera.threeDescriptor?.position || !camera.threeDescriptor?.lookAt) failures.push("missing-three-descriptor");
          if (camera.legacyCameraModel.type !== "over-the-shoulder-third-person") failures.push("not-third-person-camera");
          if (camera.threeDescriptor.position[1] > 5.5) failures.push("camera-too-tactical");
          if (camera.legacyCameraModel.outOfCombatSize !== 20) failures.push("legacy-camera-size-mismatch");
          if (!validateGoldRushCameraPerspectives(camera.perspectiveCatalog)) failures.push("invalid-camera-perspective-catalog");
          if (camera.perspectiveCount < 1000) failures.push("missing-camera-perspective-volume");
          if (!camera.selectedPerspective?.playabilityChecks?.includes("player-silhouette-readable")) failures.push("missing-camera-playability-checks");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createAnimationStateKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-animation-state-kit",
    domain: "goldrush-animation-state",
    apiName: "goldrushAnimation",
    stability,
    version,
    requires: ["n:goldrush-combat", "n:goldrush-cargo"],
    services: ["snapshot", "validate"],
    metadata: {
      purpose: "Own player animation descriptor state mapped from legacy Unity animator parameters.",
    },
    createApi({ engine }) {
      return {
        snapshot({ playerId = "player-1", phase = "lobby" } = {}) {
          const cargo = engine.n.goldrushCargo.snapshot();
          const combat = engine.n.goldrushCombat.snapshot();
          const lastReceipt = combat.receipts.at(-1);
          return createAnimationStateDescriptor({
            playerId,
            phase,
            combatActive: combat.active,
            carriedGold: cargo[playerId] ?? 0,
            eliminated: lastReceipt?.playerId === playerId && lastReceipt?.eliminated === true,
          });
        },
        validate() {
          const animation = this.snapshot({ phase: "combat" });
          const failures = [];
          if (!animation.clipSlotIds.base?.startsWith("goldrush.anim.player.")) failures.push("missing-base-clip-slot");
          if (!Object.hasOwn(animation.params, "isAiming")) failures.push("missing-isAiming-param");
          if (!Object.hasOwn(animation.params, "isShooting")) failures.push("missing-isShooting-param");
          if (!Object.hasOwn(animation.params, "combatState")) failures.push("missing-combatState-param");
          return { passed: failures.length === 0, failures };
        },
      };
    },
  });
}

function createScenarioKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-scenario-kit",
    domain: "goldrush-scenario",
    apiName: "goldrushScenario",
    stability,
    version,
    requires: [
      "n:goldrush-network",
      "n:goldrush-legacy-source",
      "n:goldrush-terrain-patch-window",
      "n:goldrush-town-layout",
      "n:goldrush-path-network",
      "n:goldrush-gold-zones",
      "n:goldrush-loading-gates",
      "n:goldrush-mining",
      "n:goldrush-cargo",
      "n:goldrush-cashout",
      "n:goldrush-combat",
      "n:goldrush-extraction-loop",
      "n:goldrush-camera-descriptor",
      "n:goldrush-perspective",
      "n:goldrush-world-elements",
      "n:goldrush-scene-transition",
      "n:goldrush-audio-state",
      "n:goldrush-animation-state",
      "n:goldrush-legacy-mode",
      "n:goldrush-asset-registry",
      "n:goldrush-match-lifecycle",
      "n:goldrush-final-rush",
      "n:goldrush-extraction-receipts",
      "n:goldrush-room-handoff-receipts",
      "n:goldrush-scoring",
      "n:goldrush-match-results",
      "n:goldrush-replay-summary",
      "n:goldrush-kit-contracts",
    ],
    services: ["generate-match", "advance-phase", "start-match", "trigger-final-rush", "simulate-extraction", "request-handoff", "end-match", "snapshot"],
    metadata: {
      purpose: "Linearly orchestrate the complete Gold Rush match loop.",
    },
    createApi({ engine }) {
      let state = createScenarioState();

      return {
        generateMatch({ players, phase }) {
          const network = engine.n.goldrushNetwork.generate({ players, phase });
          const rooms = network.rooms;
          engine.n.goldrushMatch.start({ players, phase });
          engine.n.goldrushMining.seed({ players, shardCount: network.partitions.length });
          engine.n.goldrushCargo.seed({ players });
          engine.n.goldrushScenes.phase(phase);
          engine.n.goldrushReplaySummary.appendEvent({
            type: "matchGenerated",
            tick: engine.clock?.frame ?? 0,
            payload: {
              players,
              phase,
              networkStatus: network.status,
              partitionCount: network.partitions.length,
            },
          });
          if (phase === "combat") engine.n.goldrushPerspective.set("combat");
          state = {
            ...state,
            players,
            phase,
            network,
            rooms,
            loop: createLoop(phase),
          };
          return this.snapshot();
        },
        advancePhase(phase) {
          engine.n.goldrushMatch.advancePhase({ phase });
          state = { ...state, phase, loop: createLoop(phase) };
          engine.n.goldrushScenes.phase(phase);
          if (phase === "combat") engine.n.goldrushPerspective.set("combat");
          if (phase !== "combat") engine.n.goldrushPerspective.set("exploration");
          return this.snapshot();
        },
        startMatch({ players = 2, seed = "goldrush-dev-seed", phase = "drop" } = {}) {
          const snapshot = this.generateMatch({ players, phase });
          engine.n.goldrushReplaySummary.appendEvent({
            type: "matchStarted",
            tick: engine.clock?.frame ?? 0,
            payload: { seed, players, phase },
          });
          return snapshot;
        },
        triggerFinalRush() {
          const armed = engine.n.goldrushFinalRush.arm({ startTick: engine.clock?.frame ?? 0 });
          engine.n.goldrushMatch.advancePhase({ phase: "finalRush", reason: "scenario.finalRush" });
          state = { ...state, phase: "finalRush", loop: createLoop("finalRush") };
          engine.n.goldrushScenes.phase("combat");
          engine.n.goldrushReplaySummary.appendEvent({
            type: "finalRushStarted",
            tick: engine.clock?.frame ?? 0,
            payload: { accepted: armed.accepted },
          });
          return this.snapshot();
        },
        simulateExtraction({ playerId = "player-1", goldAmount = 0, cargoValue = 0, receiptId = null } = {}) {
          const zone = engine.n.goldrushGoldZones.snapshot()[0];
          const roomWindowId = zone?.patchWindowIds?.[0] ?? null;
          const receipt = engine.n.goldrushExtractionReceipts.recordExtraction({
            receiptId: receiptId ?? `extract.${playerId}.${engine.clock?.frame ?? 0}`,
            playerId,
            teamId: "team-01",
            goldAmount,
            cargoValue,
            cashoutId: "cashout.central-yard",
            goldZoneId: zone?.goldZoneId ?? null,
            roomWindowId,
            tick: engine.clock?.frame ?? 0,
          });
          if (receipt.status === "accepted") engine.n.goldrushScoring.applyExtractionReceipt(receipt.receiptId);
          engine.n.goldrushReplaySummary.appendEvent({
            type: receipt.status === "accepted" ? "extractionAccepted" : "extractionRejected",
            tick: receipt.tick ?? engine.clock?.frame ?? 0,
            payload: { receiptId: receipt.receiptId, status: receipt.status },
          });
          return receipt;
        },
        requestHandoff({ gateId = null, playerIds = ["player-1"] } = {}) {
          const gate = gateId
            ? engine.n.goldrushLoadingGates.snapshot().gates.find((entry) => entry.id === gateId)
            : engine.n.goldrushLoadingGates.snapshot().gates[0];
          const receipt = engine.n.goldrushRoomHandoffReceipts.recordHandoff({
            handoffId: `handoff.${gate?.id ?? "unknown"}.${engine.clock?.frame ?? 0}`,
            gateId: gate?.id ?? gateId,
            playerIds,
            fromRoomWindowId: gate?.fromRoomWindowId,
            toRoomWindowId: gate?.toRoomWindowId,
            triggerPathId: gate?.triggerPathId,
            transitionId: gate?.transitionId,
            tick: engine.clock?.frame ?? 0,
          });
          engine.n.goldrushReplaySummary.appendEvent({
            type: receipt.status === "accepted" ? "handoffAccepted" : "handoffRejected",
            tick: receipt.tick ?? engine.clock?.frame ?? 0,
            payload: { handoffId: receipt.handoffId, status: receipt.status },
          });
          return receipt;
        },
        endMatch({ reason = "manual" } = {}) {
          engine.n.goldrushMatch.requestEnd({ reason });
          engine.n.goldrushScoring.applySurvivalBonus({ playerId: "player-1", reason: "match-end-survival" });
          const result = engine.n.goldrushResults.finalize({ reason });
          engine.n.goldrushMatch.advancePhase({ phase: "results", reason: "scenario.results" });
          state = { ...state, phase: "results", loop: createLoop("results") };
          engine.n.goldrushScenes.phase("results");
          engine.n.goldrushReplaySummary.appendEvent({
            type: "matchEnded",
            tick: engine.clock?.frame ?? 0,
            payload: { reason, accepted: result.accepted },
          });
          engine.n.goldrushReplaySummary.capture();
          return this.snapshot();
        },
        snapshot() {
          const perspective = engine.n.goldrushPerspective.snapshot();
          const assets = engine.n.goldrushAssets.snapshot();
          const legacySources = engine.n.goldrushLegacySources.snapshot();
          const legacyReadiness = engine.n.goldrushLegacySources.readiness();
          const legacyMode = engine.n.goldrushLegacyModes.snapshot();
          const mining = engine.n.goldrushMining.snapshot();
          const cargo = engine.n.goldrushCargo.snapshot();
          const cashout = engine.n.goldrushCashout.snapshot();
          const combat = engine.n.goldrushCombat.snapshot();
          const extractionLoop = engine.n.goldrushExtractionLoop.snapshot();
          const sceneState = engine.n.goldrushScenes.snapshot();
          const world = engine.n.goldrushWorld.snapshot({ phase: state.phase });
          const terrainState = engine.n.goldrushTerrain.snapshot({ phase: state.phase });
          const towns = engine.n.goldrushTowns.snapshot();
          const paths = engine.n.goldrushPaths.snapshot();
          const goldZones = engine.n.goldrushGoldZones.snapshot();
          const loadingGates = engine.n.goldrushLoadingGates.snapshot();
          const audioState = engine.n.goldrushAudio.snapshot({ phase: state.phase });
          const animationState = engine.n.goldrushAnimation.snapshot({ phase: state.phase });
          const cameraState = engine.n.goldrushCamera.snapshot({ phase: state.phase });
          const match = engine.n.goldrushMatch.snapshot();
          const finalRush = engine.n.goldrushFinalRush.snapshot();
          const extractionReceipts = engine.n.goldrushExtractionReceipts.snapshot();
          const handoffReceipts = engine.n.goldrushRoomHandoffReceipts.snapshot();
          const scoring = engine.n.goldrushScoring.snapshot();
          const results = engine.n.goldrushResults.snapshot();
          const replaySummary = engine.n.goldrushReplaySummary.snapshot();
          const network = engine.n.goldrushNetwork.snapshot();
          const realityStatus = engine.n.goldrushReality.snapshot();
          const kitContracts = engine.n.goldrushKitContracts.snapshot();
          return {
            ...structuredClone(state),
            network,
            rooms: network.rooms,
            match,
            finalRush,
            extractionReceipts,
            handoffReceipts,
            scoring,
            results,
            replaySummary,
            kitContracts,
            cameraMode: perspective.mode,
            cameraDescriptor: perspective.descriptor,
            assets,
            legacySources,
            legacyReadiness,
            legacyMode,
            realityStatus,
            mining,
            cargo,
            cashout,
            combat,
            extractionLoop,
            sceneState,
            world,
            terrainState,
            towns,
            paths,
            goldZones,
            loadingGates,
            audioState,
            animationState,
            cameraState,
            ledger: createLedger({
              players: state.players,
              shardCount: network.partitions.length,
              mining,
              cashout,
              combat,
            }),
            installOrder: engine.game?.installOrder ?? [],
          };
        },
      };
    },
  });
}

function createScenarioState() {
  return {
    players: 2,
    phase: "lobby",
    network: null,
    rooms: { lobby: null, shards: [], ledger: null },
    loop: createLoop("lobby"),
  };
}

function transitionForPhase(phase) {
  if (phase === "lobby") {
    return {
      toSceneId: "goldrush.scene.lobby",
      transitionId: "goldrush.transition.mainMenuToLobby",
    };
  }
  if (phase === "combat") {
    return {
      toSceneId: "goldrush.scene.legacyGame",
      transitionId: "goldrush.transition.explorationToCombat",
    };
  }
  if (phase === "extract" || phase === "results") {
    return {
      toSceneId: "goldrush.scene.arena",
      transitionId: "goldrush.transition.cashoutComplete",
    };
  }
  if (phase === "drop" || phase === "prospect") {
    return {
      toSceneId: "goldrush.scene.arena",
      transitionId: "goldrush.transition.lobbyToArena",
    };
  }
  return {
    toSceneId: "goldrush.scene.loading",
    transitionId: "goldrush.transition.roomHandoffStart",
  };
}

function createLoop(phase) {
  const fullLoop = ["lobby", "drop", "prospect", "combat", "finalRush", "collapse", "extract", "results"];
  const activeIndex = Math.max(0, fullLoop.indexOf(phase));
  return fullLoop.map((step, index) => {
    if (index < activeIndex) return `${step}: complete`;
    if (index === activeIndex) return `${step}: active`;
    return `${step}: queued`;
  });
}

function createLedger({ players, shardCount, mining, cashout, combat }) {
  const remainingGold = mining.reduce((sum, node) => sum + node.remainingGold, 0);
  const bankedGold = Object.values(cashout).reduce((sum, value) => sum + value, 0);
  return {
    goldInWorld: remainingGold + players * 12 + shardCount * 50,
    bankedGold,
    extractionReceipts: [],
    combatReceipts: combat.receipts,
  };
}
