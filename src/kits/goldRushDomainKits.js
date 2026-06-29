import { defineDomainServiceKit } from "nexusrealtime";
import { createGoldRushWorldElements, validateGoldRushWorldElements } from "../content/goldrushWorldElements.js";

const version = "0.1.0";
const stability = "prototype";

export function createGoldRushDomainKits({ orchestrator, assetRegistry }) {
  return [
    createRoomOrchestratorKit({ orchestrator }),
    createAssetRegistryKit({ assetRegistry }),
    createMiningKit(),
    createCargoKit(),
    createCashoutKit(),
    createCombatKit(),
    createPerspectiveKit(),
    createWorldElementKit(),
    createSceneTransitionKit(),
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
    services: ["generate", "snapshot", "handoff"],
    metadata: {
      purpose: "Generate 50-player room shards and shared match ledger data.",
    },
    createApi() {
      let rooms = orchestrator.generate({ players: 2 });

      return {
        generate({ players }) {
          rooms = orchestrator.generate({ players });
          return structuredClone(rooms);
        },
        snapshot() {
          return structuredClone(rooms);
        },
        handoffEvent({ playerId, fromRoomId, toRoomId, reason }) {
          return {
            type: "room.playerTransferRequested",
            playerId,
            fromRoomId,
            toRoomId,
            reason,
            ledgerId: rooms.ledger.id,
          };
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

function createMiningKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-mining-kit",
    domain: "goldrush-mining",
    apiName: "goldrushMining",
    stability,
    version,
    services: ["seed", "mine", "snapshot"],
    metadata: {
      purpose: "Own gold nodes, mining progress, depletion, and yield.",
    },
    createApi() {
      let nodes = [];

      return {
        seed({ players, shardCount }) {
          nodes = Array.from({ length: Math.max(4, shardCount * 6) }, (_, index) => ({
            id: `gold-node-${index + 1}`,
            shardId: `shard-${(index % shardCount) + 1}`,
            remainingGold: 80 + players + index * 13,
            depleted: false,
          }));
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
              ? { camera: "combat-cluster", height: 4.2, distance: 5.4, target: combat.clusterId }
              : { camera: "extraction-arena", height: 7, distance: 10, target: "player-route" },
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
    requires: ["n:goldrush-room-orchestrator"],
    services: ["snapshot", "room-window", "validate"],
    metadata: {
      purpose: "Own world scale, towns, mountains, paths, gold zones, loading gates, and room patch windows.",
    },
    createApi({ engine }) {
      return {
        snapshot({ phase = "lobby" } = {}) {
          return createGoldRushWorldElements({ rooms: engine.n.goldrushRooms.snapshot(), phase });
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

function createScenarioKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-scenario-kit",
    domain: "goldrush-scenario",
    apiName: "goldrushScenario",
    stability,
    version,
    requires: [
      "n:goldrush-room-orchestrator",
      "n:goldrush-mining",
      "n:goldrush-cargo",
      "n:goldrush-cashout",
      "n:goldrush-combat",
      "n:goldrush-perspective",
      "n:goldrush-world-elements",
      "n:goldrush-scene-transition",
      "n:goldrush-asset-registry",
    ],
    services: ["generate-match", "advance-phase", "snapshot"],
    metadata: {
      purpose: "Linearly orchestrate the complete Gold Rush match loop.",
    },
    createApi({ engine }) {
      let state = createScenarioState();

      return {
        generateMatch({ players, phase }) {
          const rooms = engine.n.goldrushRooms.generate({ players });
          engine.n.goldrushMining.seed({ players, shardCount: rooms.shards.length });
          engine.n.goldrushCargo.seed({ players });
          engine.n.goldrushScenes.phase(phase);
          if (phase === "combat") engine.n.goldrushPerspective.set("combat");
          state = {
            ...state,
            players,
            phase,
            rooms,
            loop: createLoop(phase),
          };
          return this.snapshot();
        },
        advancePhase(phase) {
          state = { ...state, phase, loop: createLoop(phase) };
          engine.n.goldrushScenes.phase(phase);
          if (phase === "combat") engine.n.goldrushPerspective.set("combat");
          if (phase !== "combat") engine.n.goldrushPerspective.set("exploration");
          return this.snapshot();
        },
        snapshot() {
          const perspective = engine.n.goldrushPerspective.snapshot();
          const assets = engine.n.goldrushAssets.snapshot();
          const mining = engine.n.goldrushMining.snapshot();
          const cargo = engine.n.goldrushCargo.snapshot();
          const cashout = engine.n.goldrushCashout.snapshot();
          const combat = engine.n.goldrushCombat.snapshot();
          const sceneState = engine.n.goldrushScenes.snapshot();
          const world = engine.n.goldrushWorld.snapshot({ phase: state.phase });
          return {
            ...structuredClone(state),
            cameraMode: perspective.mode,
            cameraDescriptor: perspective.descriptor,
            assets,
            mining,
            cargo,
            cashout,
            combat,
            sceneState,
            world,
            ledger: createLedger({
              players: state.players,
              shardCount: state.rooms.shards.length,
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
  const fullLoop = ["lobby", "drop", "prospect", "combat", "extract", "results"];
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
