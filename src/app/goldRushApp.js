import { createNetworkOrchestrator } from "../network/networkOrchestrator.js";
import { createPeerPartyRoom } from "../network/peerPartyRoom.js";
import { createGoldRushRuntime } from "../kits/goldRushRuntime.js";
import { createV002GoldRushState } from "../kits/v0.0.2/state.js";
import { createGoldRushAudioManager } from "../audio/goldRushAudioManager.js";
import { goldRushLegacyModes, resolveLegacyMode } from "../content/goldrushLegacyModes.js";
import { createGoldRushEnvironmentSpace } from "../content/goldrushEnvironmentSpace.js";
import {
  createGoldRushObjectMicroKits,
  selectNearestGoldRushObjectAffordance,
} from "../content/goldrushObjectMicroKits.js";
import { validatePlayerActionSurface } from "../content/goldrushPlayerActionSurface.js";
import { validatePlayerGuidanceCue } from "../content/goldrushPlayerGuidanceCue.js";
import { validatePlayerLoopReadiness } from "../content/goldrushPlayerLoopReadiness.js";
import { validateCombatLoopReadiness } from "../content/goldrushCombatLoopReadiness.js";
import { validateCombatRouteGuidance } from "../content/goldrushCombatRouteGuidance.js";
import { createCannonTerrainPhysicsDescriptor } from "../physics/cannonTerrainPhysics.js";
import { createPhysicsBackendDecision } from "../physics/physicsBackendKit.js";
import {
  TERRAIN_DEPTH,
  TERRAIN_PATCH_SIZE,
  TERRAIN_WIDTH,
  createTerrainColliderDescriptor,
  raycastTerrainDown,
  sampleTerrainCollider,
} from "../physics/terrainCollider.js";
import { createGoldRushSceneKitLoader, validateGoldRushSceneKitLoaderSnapshot } from "../scenes/goldRushSceneKitLoader.js";
import { getGoldRushSceneSite, validateGoldRushSceneSites } from "../scenes/goldRushSceneSites.js";
import {
  createGoldRushFirstSequenceController,
  defaultFirstSequenceTimings,
} from "../scenes/goldRushFirstSequence.js";

const walkBounds = {
  minX: -TERRAIN_WIDTH / 2 + TERRAIN_PATCH_SIZE,
  maxX: TERRAIN_WIDTH / 2 - TERRAIN_PATCH_SIZE,
  minZ: -TERRAIN_DEPTH / 2 + TERRAIN_PATCH_SIZE,
  maxZ: TERRAIN_DEPTH / 2 - TERRAIN_PATCH_SIZE,
};

const roomTypes = [
  {
    id: "crew",
    label: "Crew",
    role: "small claim team",
  },
  {
    id: "posse",
    label: "Posse",
    role: "armed gold party",
  },
  {
    id: "outfit",
    label: "Outfit",
    role: "full expedition",
  },
];

const partyCapacity = 4;
const massMatchPlayers = 20;
const loadingYardBounds = { minX: -15, maxX: 15, minZ: -12, maxZ: 13 };
const loadingTrainTiming = defaultFirstSequenceTimings;

export function createGoldRushApp(root) {
  const orchestrator = createNetworkOrchestrator();
  const runtime = createGoldRushRuntime({ orchestrator });
  let renderer = null;
  let lobbyCharacterRenderer = null;
  let loadingRenderer = null;
  const audio = createGoldRushAudioManager({
    getAssetRegistry: () => runtime.engine.n.goldrushAssets.snapshot(),
  });
  let screen = "start";
  let selectedRoom = roomTypes[2];
  let selectedLegacyMode = resolveLegacyMode("modernExtraction");
  const sceneKitLoader = createGoldRushSceneKitLoader();
  const firstSequence = createGoldRushFirstSequenceController({ timings: loadingTrainTiming });
  const terrainColliderDescriptor = createTerrainColliderDescriptor();
  const terrainPhysicsDescriptor = createCannonTerrainPhysicsDescriptor(terrainColliderDescriptor);
  const physicsBackendDescriptor = createPhysicsBackendDecision({
    terrainColliderDescriptor,
    terrainPhysicsDescriptor,
  });
  const objectAffordanceTerrain = createObjectAffordanceTerrainDescriptor();
  const objectAffordanceEnvironment = createGoldRushEnvironmentSpace({ terrain: objectAffordanceTerrain });
  const objectAffordanceDescriptor = createGoldRushObjectMicroKits({
    terrain: objectAffordanceTerrain,
    environmentSpace: objectAffordanceEnvironment,
  });
  let lastObjectInteraction = {
    accepted: false,
    reason: "not-used-yet",
    selection: null,
  };
  const movement = createMovementController({
    terrainSampler: sampleTerrainCollider,
    terrainRaycaster: raycastTerrainDown,
    maxStepUp: 0.95,
    maxSlopeGrade: 1.85,
  });
  const loadingMovement = createMovementController({
    bounds: loadingYardBounds,
    initialPosition: { x: 0, z: 10.2 },
    initialLookYaw: Math.PI,
    initialLookPitch: -0.08,
  });
  let runLoopId = null;
  let loadingLoopId = null;
  const loopInput = {
    interact: false,
    aim: false,
    fire: false,
    cover: false,
    peek: null,
  };
  let resultsTransitionInFlight = false;
  let simulatorNow = performance.now();
  let pendingSimulatorCommand = null;
  let interactionHoldGraceFrames = 0;

  root.innerHTML = `
    <main class="appShell" data-screen="start">
      <section class="screen startScreen" data-screen-panel="start" aria-label="Gold Rush start">
        <div class="titleBlock">
          <p class="kicker">NexusEngine</p>
          <h1>Gold Rush</h1>
          <p>Stake a claim, ride into the field, and fight your way out with the gold.</p>
          <button class="button primary titleButton" data-action="play-title">Play</button>
        </div>
      </section>

      <section class="screen lobbyScreen" data-screen-panel="lobby" aria-label="Gold Rush lobby" hidden>
        <div class="lobbyBlock squadLobby">
          <header class="lobbyTopbar">
            <button class="iconButton" data-action="back-title" aria-label="Back to title">‹</button>
            <div>
              <p class="kicker">Lobby</p>
              <h2>Gold Rush</h2>
            </div>
            <div class="statusBadge" data-party-status>Peer Party / 4</div>
          </header>

          <section class="squadStage" aria-label="Squad lobby">
            <aside class="squadPanel" aria-label="Party slots" data-squad-panel>
              ${Array.from({ length: partyCapacity }, (_, index) => `
                <div class="squadSlot${index === 0 ? " active" : ""}">
                  <span class="slotNumber">${String(index + 1).padStart(2, "0")}</span>
                  <strong>${index === 0 ? "Prospector" : "Open Slot"}</strong>
                  <small>${index === 0 ? "Ready" : "Waiting"}</small>
                </div>
              `).join("")}
            </aside>

            <div class="characterStage" aria-label="Selected character">
              <div class="characterNameplate">
                <span>Skeleton Prospector</span>
                <strong>${selectedRoom.label}</strong>
              </div>
              <div class="characterPedestal">
                <div class="lobbyCharacterCanvas" data-lobby-character-canvas aria-label="Draggable 3D skeleton prospector"></div>
              </div>
            </div>

            <aside class="matchPanel" aria-label="Match setup">
              <label class="selectField" for="group-type">
                <span>Group Type</span>
                <select id="group-type" data-room-select>
                  ${roomTypes.map((room) => `
                    <option value="${room.id}"${room.id === selectedRoom.id ? " selected" : ""}>${room.label}</option>
                  `).join("")}
                </select>
              </label>
              <div class="modeReadout">
                <span data-room-label>${selectedRoom.label}</span>
                <small data-room-role>${selectedRoom.role}</small>
              </div>
              <div class="modeReadout">
                <span>${massMatchPlayers} player match</span>
                <small>leader launches mass room</small>
              </div>
              <div class="frontierBriefing" data-frontier-condition-briefing>
                <p class="briefingEyebrow">Frontier Condition</p>
                <strong data-frontier-condition-label>Loading condition</strong>
                <span data-frontier-condition-read>Reading the gold field.</span>
                <dl>
                  <div>
                    <dt>Gold</dt>
                    <dd data-frontier-condition-gold>1.00x</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd data-frontier-condition-risk>1.00x</dd>
                  </div>
                  <div>
                    <dt>Route</dt>
                    <dd data-frontier-condition-route>standard</dd>
                  </div>
                </dl>
              </div>
              <details class="advancedPanel">
                <summary>Version Source</summary>
                <label class="selectField compactSelect" for="legacy-mode">
                  <span>Play Mode</span>
                  <select id="legacy-mode" data-legacy-mode-select>
                    ${goldRushLegacyModes.map((mode) => `
                      <option value="${mode.modeId}"${mode.modeId === selectedLegacyMode.modeId ? " selected" : ""}>${mode.label}</option>
                    `).join("")}
                  </select>
                </label>
                <div class="modeReadout">
                  <span data-legacy-mode-label>${selectedLegacyMode.label}</span>
                  <small data-legacy-mode-role>${selectedLegacyMode.sourceVersionRole}</small>
                </div>
              </details>
              <div class="partyRoomPanel">
                <div class="roomCodeLine">
                  <span>Party Code</span>
                  <strong data-party-code>Local</strong>
                </div>
                <button class="button secondary" data-action="create-party">Create Code</button>
                <label class="codeField" for="party-code">
                  <span>Join Code</span>
                  <input id="party-code" data-party-code-input inputmode="text" maxlength="8" autocomplete="off" placeholder="ABCDE" />
                </label>
                <button class="button secondary" data-action="join-party">Join Party</button>
                <small data-party-message>Local leader can launch or create a party code.</small>
              </div>
            </aside>
          </section>

          <div class="lobbyActions">
            <button class="button primary" data-action="enter-run">Start</button>
          </div>
        </div>
      </section>

      <section class="gameStage" data-screen-panel="run" aria-label="Gold Rush 3D game" hidden>
        <div id="goldrush-canvas"></div>
        <div class="srOnly" aria-live="polite" data-status></div>
      </section>

      <section class="gameStage loadingStage" data-screen-panel="loading" aria-label="Gold Rush train loading yard" hidden>
        <div id="goldrush-loading-canvas"></div>
        <div class="srOnly" aria-live="polite" data-loading-status></div>
      </section>

      <section class="screen resultsScreen" data-screen-panel="results" aria-label="Gold Rush results" hidden>
        <div class="resultsBlock">
          <header class="resultsHeader">
            <p class="kicker">Extraction Complete</p>
            <h2 data-results-title>Claim Settled</h2>
            <p data-results-subtitle>Finalizing receipts.</p>
          </header>
          <section class="resultsGrid" data-results-stats aria-label="Match result stats"></section>
          <section class="resultsPanels" aria-label="Replay and awards">
            <article class="resultsPanel">
              <h3>Field Read</h3>
              <dl data-results-field-read></dl>
            </article>
            <article class="resultsPanel">
              <h3>Awards</h3>
              <ul data-results-awards></ul>
            </article>
            <article class="resultsPanel">
              <h3>Replay Moments</h3>
              <ul data-results-replay></ul>
            </article>
          </section>
          <div class="resultsActions">
            <button class="button secondary" data-action="results-lobby">Lobby</button>
            <button class="button primary" data-action="results-next-run">Run Another Claim</button>
          </div>
        </div>
      </section>
    </main>
  `;

  const shell = root.querySelector(".appShell");
  const canvasRoot = root.querySelector("#goldrush-canvas");
  const lobbyCharacterRoot = root.querySelector("[data-lobby-character-canvas]");
  const loadingCanvasRoot = root.querySelector("#goldrush-loading-canvas");
  const runStage = root.querySelector('[data-screen-panel="run"]');
  const loadingStage = root.querySelector('[data-screen-panel="loading"]');
  const status = root.querySelector("[data-status]");
  const loadingStatus = root.querySelector("[data-loading-status]");
  const resultsTitle = root.querySelector("[data-results-title]");
  const resultsSubtitle = root.querySelector("[data-results-subtitle]");
  const resultsStats = root.querySelector("[data-results-stats]");
  const resultsFieldRead = root.querySelector("[data-results-field-read]");
  const resultsAwards = root.querySelector("[data-results-awards]");
  const resultsReplay = root.querySelector("[data-results-replay]");
  const roomSelect = root.querySelector("[data-room-select]");
  const legacyModeSelect = root.querySelector("[data-legacy-mode-select]");
  const roomLabel = root.querySelector("[data-room-label]");
  const roomRole = root.querySelector("[data-room-role]");
  const legacyModeLabel = root.querySelector("[data-legacy-mode-label]");
  const legacyModeRole = root.querySelector("[data-legacy-mode-role]");
  const frontierConditionLabel = root.querySelector("[data-frontier-condition-label]");
  const frontierConditionRead = root.querySelector("[data-frontier-condition-read]");
  const frontierConditionGold = root.querySelector("[data-frontier-condition-gold]");
  const frontierConditionRisk = root.querySelector("[data-frontier-condition-risk]");
  const frontierConditionRoute = root.querySelector("[data-frontier-condition-route]");
  const squadPanel = root.querySelector("[data-squad-panel]");
  const partyStatus = root.querySelector("[data-party-status]");
  const partyCode = root.querySelector("[data-party-code]");
  const partyCodeInput = root.querySelector("[data-party-code-input]");
  const partyMessage = root.querySelector("[data-party-message]");
  const launchButton = root.querySelector('[data-action="enter-run"]');
  const party = createPeerPartyRoom({
    capacity: partyCapacity,
    onChange: renderPartyState,
    onStartMatch: startLoadingYard,
  });

  window.GoldRushHost = {
    engine: runtime.engine,
    runtime,
    actions: {
      mine: () => {
        const receipt = runtime.mineGold();
        renderRun();
        return receipt;
      },
      cashOut: () => {
        const receipt = runtime.cashOut();
        renderRun();
        return receipt;
      },
      ambush: () => {
        const receipt = runtime.takeDamage();
        renderRun();
        return receipt;
      },
      interact: () => {
        const receipt = dispatchNearestObjectAffordance({ localPlayer: movement.snapshot(), dt: 0.3 });
        renderRun();
        return receipt;
      },
      extract: () => {
        const receipt = runtime.holdExtractionLoopCashout();
        renderRun();
        return receipt;
      },
      fire: () => {
        const receipt = runtime.fireExtractionLoop();
        renderRun();
        return receipt;
      },
      engageCover: (options = {}) => {
        loopInput.cover = true;
        loopInput.peek = options.peekSide ?? loopInput.peek;
        const state = runtime.engine.n.goldrushExtractionLoop.engageCover(options);
        renderRun();
        return state;
      },
      releaseCover: (options = {}) => {
        loopInput.cover = false;
        loopInput.peek = null;
        const receipt = runtime.engine.n.goldrushExtractionLoop.releaseCover(options);
        renderRun();
        return receipt;
      },
      peekCover: (options = {}) => {
        loopInput.cover = true;
        loopInput.peek = options.side ?? options.peekSide ?? loopInput.peek ?? "right";
        const state = runtime.engine.n.goldrushExtractionLoop.peekCover({ side: loopInput.peek });
        renderRun();
        return state;
      },
      lobby: () => {
        void showScreen("lobby");
      },
      leaveParty: () => party.leaveRoom({ reason: "local-player-left-party" }),
      publicSmokePlaceAtTrainDoor: () => {
        if (!isPublicSmokeProof()) return { accepted: false, reason: "public-smoke-disabled" };
        if (screen !== "loading") return { accepted: false, reason: "not-loading" };
        loadingMovement.reset({ x: 0, z: -7.4 });
        loadingMovement.clearKeys();
        return {
          accepted: true,
          reason: "placed-at-train-door",
          loadingPlayer: loadingMovement.snapshot(),
        };
      },
      publicSmokePlaceAtNearestObjectAffordance: ({ action = "mine-gold" } = {}) => {
        if (!isPublicSmokeProof()) return { accepted: false, reason: "public-smoke-disabled" };
        if (screen !== "run") return { accepted: false, reason: "not-run" };
        const target = objectAffordanceDescriptor.kits
          .filter((kit) => kit.interaction?.enabled && kit.interaction.action === action)
          .sort((a, b) => a.id.localeCompare(b.id))[0] ?? null;
        if (!target) return { accepted: false, reason: "no-object-affordance", action };
        movement.reset({ x: target.position.x, z: target.position.z });
        movement.clearKeys();
        const localPlayer = movement.snapshot();
        const selection = resolveNearestObjectAffordance({ localPlayer, actionFilter: action });
        return {
          accepted: Boolean(selection.selected),
          reason: selection.reason,
          action,
          placedAt: target.id,
          selection,
          localPlayer,
        };
      },
      publicSmokePlaceAtExtractionSetpiece: () => {
        if (!isPublicSmokeProof()) return { accepted: false, reason: "public-smoke-disabled" };
        if (screen !== "run") return { accepted: false, reason: "not-run" };
        const loop = runtime.engine.n.goldrushExtractionLoop.getState();
        const extraction = loop.extraction.sites["rail-depot-extract-01"] ?? Object.values(loop.extraction.sites)[0];
        if (!extraction) return { accepted: false, reason: "no-extraction-site" };
        const target = extraction.worldPosition;
        const playerPosition = {
          x: target.x - 1.8,
          z: target.z - 4.2,
        };
        const lookYaw = Math.atan2(target.x - playerPosition.x, target.z - playerPosition.z);
        movement.reset({ ...playerPosition, lookYaw, lookPitch: -0.16, heading: lookYaw });
        movement.clearKeys();
        const localPlayer = movement.snapshot();
        runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
          position: localPlayer.position,
          heading: localPlayer.heading,
          look: localPlayer.look,
        });
        renderRun();
        return {
          accepted: true,
          reason: "placed-at-extraction-setpiece",
          siteId: extraction.id,
          setpieceRole: "rail-depot-cashout-landmark",
          localPlayer: movement.snapshot(),
        };
      },
      publicSmokeCompleteRunToResults: async () => {
        if (!isPublicSmokeProof()) return { accepted: false, reason: "public-smoke-disabled" };
        if (screen !== "run") return { accepted: false, reason: "not-run" };
        const receipt = completeExtractionLoopForProof();
        await completeRunToResults("public-smoke-extraction-complete");
        return { accepted: true, receipt, state: window.GoldRushHost.getState() };
      },
    },
    getState: () => {
      const actionSurface = syncPlayerActionSurface({ localPlayer: movement.snapshot() });
      const playerDrivenExtractionRoute = syncPlayerDrivenExtractionRoute({ localPlayer: movement.snapshot() });
      const playerRouteGuidance = syncPlayerRouteGuidance({ localPlayer: movement.snapshot() });
      const playerGuidanceCue = syncPlayerGuidanceCue({ localPlayer: movement.snapshot() });
      const playerLoopReadiness = syncPlayerLoopReadiness({
        renderer: renderer?.snapshot?.() ?? null,
      });
      const combatLoopReadiness = syncCombatLoopReadiness({
        renderer: renderer?.snapshot?.() ?? null,
      });
      const combatRouteGuidance = syncCombatRouteGuidance({
        localPlayer: movement.snapshot(),
        renderer: renderer?.snapshot?.() ?? null,
      });
      const scenario = runtime.snapshot();
      const sceneKitSnapshot = sceneKitLoader.snapshot();
      const realityStatus = runtime.engine.n.goldrushReality.snapshot({ sceneKitLoader: sceneKitSnapshot });
      return {
        screen,
        activeSite: getGoldRushSceneSite(screen),
        sceneKitLoader: sceneKitSnapshot,
        sceneKitLoaderValidation: validateGoldRushSceneKitLoaderSnapshot(sceneKitSnapshot),
        loadedKitGroups: sceneKitSnapshot.activeKitGroups,
        sceneSites: validateGoldRushSceneSites(),
        selectedRoom,
        selectedLegacyMode,
        scenario,
        realityStatus,
        realityValidation: runtime.engine.n.goldrushReality.validate({ sceneKitLoader: sceneKitSnapshot }),
        renderer: renderer?.snapshot?.() ?? null,
        world: scenario.world,
        terrain: scenario.terrainState,
        towns: scenario.towns,
        paths: scenario.paths,
        goldZones: scenario.goldZones,
        loadingGates: scenario.loadingGates,
        frontierConditions: scenario.frontierConditions,
        frontierConditionEffects: scenario.frontierConditionEffects,
        audio: scenario.audioState,
        animation: scenario.animationState,
        camera: scenario.cameraState,
        match: scenario.match,
        protoKitBridge: scenario.protoKitBridge,
        extractionLoop: scenario.extractionLoop,
        playerActionSurface: scenario.playerActionSurface,
        playerActionSurfaceValidation: validatePlayerActionSurface(actionSurface),
        playerDrivenExtractionRoute: scenario.playerDrivenExtractionRoute ?? playerDrivenExtractionRoute,
        playerDrivenExtractionRouteValidation: runtime.engine.n.goldrushPlayerDrivenExtractionRoute.validate(),
        playerRouteGuidance: scenario.playerRouteGuidance ?? playerRouteGuidance,
        playerRouteGuidanceValidation: runtime.engine.n.goldrushPlayerRouteGuidance.validate(),
        playerGuidanceCue: scenario.playerGuidanceCue ?? playerGuidanceCue,
        playerGuidanceCueValidation: validatePlayerGuidanceCue(scenario.playerGuidanceCue ?? playerGuidanceCue),
        playerLoopReadiness: scenario.playerLoopReadiness ?? playerLoopReadiness,
        playerLoopReadinessValidation: validatePlayerLoopReadiness(scenario.playerLoopReadiness ?? playerLoopReadiness),
        combatLoopReadiness: scenario.combatLoopReadiness ?? combatLoopReadiness,
        combatLoopReadinessValidation: validateCombatLoopReadiness(scenario.combatLoopReadiness ?? combatLoopReadiness),
        combatRouteGuidance: scenario.combatRouteGuidance ?? combatRouteGuidance,
        combatRouteGuidanceValidation: validateCombatRouteGuidance(scenario.combatRouteGuidance ?? combatRouteGuidance),
        finalRush: scenario.finalRush,
        extractionReceipts: scenario.extractionReceipts,
        handoffReceipts: scenario.handoffReceipts,
        scoring: scenario.scoring,
        results: scenario.results,
        replaySummary: scenario.replaySummary,
        legacySources: scenario.legacySources,
        legacyReadiness: scenario.legacyReadiness,
        legacyMode: scenario.legacyMode,
        network: scenario.network,
        party: party.snapshot(),
        terrainCollider: terrainColliderDescriptor,
        terrainPhysics: terrainPhysicsDescriptor,
        physicsBackend: physicsBackendDescriptor,
        runRenderer: renderer?.snapshot() ?? null,
        lobbyCharacter: lobbyCharacterRenderer?.snapshot() ?? null,
        loadingScene: loadingRenderer?.snapshot() ?? null,
        loadingPlayer: loadingMovement.snapshot(),
        localPlayer: movement.snapshot(),
        objectInteraction: {
          contract: "goldrush-object-interaction-host-v1",
          nearest: resolveNearestObjectAffordance({ localPlayer: movement.snapshot() }),
          last: structuredClone(lastObjectInteraction),
          actionSurface,
        },
        audioManager: audio.snapshot(),
        firstSequence: firstSequence.snapshot(),
        v002: createV002GoldRushState({
          screen,
          scenario,
          sceneKitLoader: sceneKitSnapshot,
        }),
      };
    },
  };
  window.GameHost = createNexusSimulatorGameHost();

  root.querySelector('[data-action="play-title"]').addEventListener("click", () => {
    audio.start();
    firstSequence.startTitle();
    audio.sync({ screen: "start", scenario: runtime.snapshot() });
    void showScreen("lobby");
  });

  root.querySelector('[data-action="back-title"]').addEventListener("click", () => {
    void showScreen("start");
  });

  root.querySelector('[data-action="create-party"]').addEventListener("click", () => {
    party.createRoom();
  });

  root.querySelector('[data-action="join-party"]').addEventListener("click", () => {
    party.joinRoom(partyCodeInput.value);
  });

  launchButton.addEventListener("click", () => {
    party.startMatch({
      players: resolveLaunchPlayers(),
      groupType: selectedRoom.id,
      legacyModeId: selectedLegacyMode.modeId,
    });
  });

  root.querySelector('[data-action="results-lobby"]').addEventListener("click", () => {
    void showScreen("lobby");
  });

  root.querySelector('[data-action="results-next-run"]').addEventListener("click", () => {
    startLoadingYard({
      players: resolveLaunchPlayers(),
      groupType: selectedRoom.id,
      legacyModeId: selectedLegacyMode.modeId,
    });
  });

  roomSelect.addEventListener("change", () => {
    selectedRoom = roomTypes.find((room) => room.id === roomSelect.value) ?? roomTypes[2];
    roomLabel.textContent = selectedRoom.label;
    roomRole.textContent = selectedRoom.role;
  });

  legacyModeSelect.addEventListener("change", () => {
    selectedLegacyMode = resolveLegacyMode(legacyModeSelect.value);
    runtime.setLegacyMode({ modeId: selectedLegacyMode.modeId });
    legacyModeLabel.textContent = selectedLegacyMode.label;
    legacyModeRole.textContent = selectedLegacyMode.sourceVersionRole;
    renderPartyState();
  });

  window.addEventListener("keydown", (event) => {
    if (screen === "loading" && loadingMovement.setKey(event, true)) return;
    if (screen === "run" && movement.setKey(event, true)) return;
    if (screen !== "run") return;
    if (event.key === "e" || event.key === "E") {
      event.preventDefault();
      loopInput.interact = true;
      return;
    }
    if (event.key === "q" || event.key === "Q") {
      event.preventDefault();
      loopInput.cover = true;
      return;
    }
    if (event.key === "m" || event.key === "M") window.GoldRushHost.actions.mine();
    if (event.key === "c" || event.key === "C") window.GoldRushHost.actions.cashOut();
    if (event.key === "f" || event.key === "F") window.GoldRushHost.actions.ambush();
    if (event.key === "Escape") window.GoldRushHost.actions.lobby();
  });

  window.addEventListener("keyup", (event) => {
    if (screen === "loading" && loadingMovement.setKey(event, false)) return;
    if (movement.setKey(event, false)) return;
    if (event.key === "e" || event.key === "E") {
      event.preventDefault();
      loopInput.interact = false;
    }
    if (event.key === "q" || event.key === "Q") {
      event.preventDefault();
      loopInput.cover = false;
      loopInput.peek = null;
    }
  });

  window.addEventListener("pointerdown", (event) => {
    if (screen === "loading") {
      if (event.button === 0) loadingMovement.enableMouseLook();
      return;
    }
    if (screen !== "run") return;
    if (event.button === 2) {
      event.preventDefault();
      loopInput.aim = true;
      return;
    }
    if (event.button === 0) {
      loopInput.fire = true;
    }
  });

  window.addEventListener("pointerup", (event) => {
    if (event.button === 2) {
      event.preventDefault();
      loopInput.aim = false;
    }
  });

  window.addEventListener("contextmenu", (event) => {
    if (screen === "run" || screen === "loading") event.preventDefault();
  });

  runStage.addEventListener("click", () => {
    movement.enableMouseLook();
    try {
      const lockRequest = runStage.requestPointerLock?.();
      lockRequest?.catch?.(() => {});
    } catch {
      // Drag-look still works when pointer lock is unavailable in embedded browsers.
    }
  });

  loadingStage.addEventListener("click", () => {
    loadingMovement.enableMouseLook();
    try {
      const lockRequest = loadingStage.requestPointerLock?.();
      lockRequest?.catch?.(() => {});
    } catch {
      // Drag-look still works when pointer lock is unavailable in embedded browsers.
    }
  });

  window.addEventListener("pointermove", (event) => {
    const activeLookStage = screen === "run" ? runStage : screen === "loading" ? loadingStage : null;
    const activeMovement = screen === "run" ? movement : screen === "loading" ? loadingMovement : null;
    if (!activeLookStage || !activeMovement) return;
    const pointerLocked = document.pointerLockElement === activeLookStage;
    if (!pointerLocked && event.buttons !== 1) return;
    activeMovement.addLookDelta(event.movementX, event.movementY);
  });

  async function showScreen(nextScreen) {
    if (nextScreen !== "run") stopRunLoop();
    if (nextScreen !== "loading") stopLoadingLoop();
    screen = nextScreen;
    shell.dataset.screen = nextScreen;
    [...root.querySelectorAll("[data-screen-panel]")].forEach((panel) => {
      panel.hidden = panel.dataset.screenPanel !== nextScreen;
    });
    const receipt = await sceneKitLoader.activate(nextScreen);
    if (screen !== nextScreen) return receipt;
    if (nextScreen === "lobby") await startLobbyCharacter();
    if (nextScreen === "lobby") {
      resultsTransitionInFlight = false;
      renderFrontierConditionBriefing();
      firstSequence.enterLobby({
        groupType: selectedRoom.id,
        modeId: selectedLegacyMode.modeId,
        frontierConditionBriefing: createFrontierConditionBriefing(runtime.snapshot()),
      });
    }
    runtime.setSceneForScreen({ screen: nextScreen });
    audio.sync({ screen: nextScreen, scenario: runtime.snapshot() });
    if (nextScreen === "results") renderResults();
    return receipt;
  }

  function startRunLoop() {
    movement.resetClock();
    if (runLoopId) return;
    const tick = (now) => {
      if (screen !== "run") {
        runLoopId = null;
        return;
      }
      movement.update(now);
      renderRun();
      runLoopId = window.requestAnimationFrame(tick);
    };
    runLoopId = window.requestAnimationFrame(tick);
  }

  function stopRunLoop() {
    movement.clearKeys();
    if (!runLoopId) return;
    window.cancelAnimationFrame(runLoopId);
    runLoopId = null;
  }

  function renderRun() {
    const runModule = sceneKitLoader.getModule("procedural-terrain");
    if (!runModule) return;
    if (!renderer) renderer = runModule.createGoldRushRenderer(canvasRoot);
    movement.setMovementModifiers({ cargo: resolveCargoMovementModifiers(runtime) });
    const localPlayer = movement.snapshot();
    const tickInput = { ...loopInput };
    if (loopInput.interact) {
      if (shouldRouteInteractToExtraction(localPlayer)) {
        tickInput.interact = true;
      } else {
        const affordanceReceipt = dispatchNearestObjectAffordance({ localPlayer, dt: 0.05 });
        tickInput.interact = affordanceReceipt?.accepted !== true;
      }
    }
    if (interactionHoldGraceFrames > 0) tickInput.holdActive = true;
    const extractionLoop = runtime.tickExtractionLoop({ localPlayer, input: tickInput, dt: 0.05 });
    if (interactionHoldGraceFrames > 0) interactionHoldGraceFrames -= 1;
    movement.setMovementModifiers({ cargo: extractionLoop.player?.cargo?.mobility ?? extractionLoop.player?.cargo?.visual?.mobility ?? null });
    const fired = loopInput.fire;
    loopInput.fire = false;
    const movementPlayer = movement.snapshot();
    syncPlayerActionSurface({ localPlayer: movementPlayer });
    syncPlayerDrivenExtractionRoute({ localPlayer: movementPlayer });
    syncPlayerRouteGuidance({ localPlayer: movementPlayer });
    syncPlayerGuidanceCue({ localPlayer: movementPlayer });
    syncPlayerLoopReadiness({ renderer: renderer?.snapshot?.() ?? null });
    syncCombatLoopReadiness({ renderer: renderer?.snapshot?.() ?? null });
    syncCombatRouteGuidance({
      localPlayer: movementPlayer,
      renderer: renderer?.snapshot?.() ?? null,
    });
    const state = runtime.snapshot();
    audio.sync({ screen: "run", scenario: state, fired });
    const carried = state.cargo["player-1"] ?? 0;
    const banked = state.cashout["player-1"] ?? 0;
    const loadRead = movementPlayer.movementModifiers?.cargoWeightClass && movementPlayer.movementModifiers.cargoWeightClass !== "empty"
      ? `; load ${movementPlayer.movementModifiers.cargoWeightClass} ${movementPlayer.movementModifiers.speedMultiplier}x`
      : "";
    const affordance = resolveNearestObjectAffordance({ localPlayer: movementPlayer }).selected;
    const affordanceRead = affordance ? `; ${affordance.prompt} ${affordance.distance.toFixed(1)}m` : "";
    status.textContent = `${state.match.phase}/${extractionLoop.phase}; carried ${carried}; banked ${banked}; network ${state.network.status}; ground ${movementPlayer.ground.height.toFixed(1)}; ${movementPlayer.isMoving ? "walking" : "idle"}${loadRead}${affordanceRead}`;
    renderer.render({ ...state, localPlayer: movementPlayer });
    syncPlayerLoopReadiness({ renderer: renderer.snapshot?.() ?? null });
    syncCombatLoopReadiness({ renderer: renderer.snapshot?.() ?? null });
    if (extractionLoop.receipt?.extracted && state.match.phase !== "results") {
      void completeRunToResults("player-extracted");
    }
  }

  function resolveCargoMovementModifiers(activeRuntime) {
    const cargo = activeRuntime.engine.n.goldrushExtractionLoop?.getState?.().player?.cargo;
    return cargo?.mobility ?? cargo?.visual?.mobility ?? null;
  }

  function resolveNearestObjectAffordance({ localPlayer = movement.snapshot(), actionFilter = null } = {}) {
    return selectNearestGoldRushObjectAffordance({
      descriptor: objectAffordanceDescriptor,
      player: localPlayer?.position ?? localPlayer,
      actionFilter,
    });
  }

  function syncPlayerActionSurface({ localPlayer = movement.snapshot() } = {}) {
    const objectInteraction = {
      contract: "goldrush-object-interaction-host-v1",
      nearest: resolveNearestObjectAffordance({ localPlayer }),
      last: structuredClone(lastObjectInteraction),
    };
    return runtime.engine.n.goldrushPlayerActionSurface.update({
      objectInteraction,
      localPlayer,
    });
  }

  function syncPlayerDrivenExtractionRoute({
    localPlayer = movement.snapshot(),
    proofTelemetry = null,
  } = {}) {
    const objectInteraction = {
      contract: "goldrush-object-interaction-host-v1",
      nearest: resolveNearestObjectAffordance({ localPlayer }),
      last: structuredClone(lastObjectInteraction),
    };
    return runtime.engine.n.goldrushPlayerDrivenExtractionRoute.update({
      objectInteraction,
      localPlayer,
      proofTelemetry,
    });
  }

  function syncPlayerRouteGuidance({
    localPlayer = movement.snapshot(),
  } = {}) {
    const objectInteraction = {
      contract: "goldrush-object-interaction-host-v1",
      nearest: resolveNearestObjectAffordance({ localPlayer }),
      last: structuredClone(lastObjectInteraction),
    };
    return runtime.engine.n.goldrushPlayerRouteGuidance.update({
      objectInteraction,
      localPlayer,
    });
  }

  function syncPlayerGuidanceCue({
    localPlayer = movement.snapshot(),
  } = {}) {
    return runtime.engine.n.goldrushPlayerGuidanceCue.update({
      localPlayer,
    });
  }

  function syncPlayerLoopReadiness({
    renderer: rendererSnapshot = renderer?.snapshot?.() ?? null,
    proofTelemetry = null,
  } = {}) {
    return runtime.engine.n.goldrushPlayerLoopReadiness.update({
      renderer: rendererSnapshot,
      proofTelemetry,
    });
  }

  function syncCombatLoopReadiness({
    renderer: rendererSnapshot = renderer?.snapshot?.() ?? null,
    proofTelemetry = null,
  } = {}) {
    return runtime.engine.n.goldrushCombatLoopReadiness.update({
      renderer: rendererSnapshot,
      proofTelemetry,
    });
  }

  function syncCombatRouteGuidance({
    localPlayer = movement.snapshot(),
    renderer: rendererSnapshot = renderer?.snapshot?.() ?? null,
    proofTelemetry = null,
  } = {}) {
    return runtime.engine.n.goldrushCombatRouteGuidance.update({
      localPlayer,
      renderer: rendererSnapshot,
      proofTelemetry,
    });
  }

  function dispatchNearestObjectAffordance({ localPlayer = movement.snapshot(), dt = 0.2, actionFilter = null } = {}) {
    const selection = resolveNearestObjectAffordance({ localPlayer, actionFilter });
    const selected = selection.selected;
    if (!selected) {
      lastObjectInteraction = {
        accepted: false,
        reason: selection.reason,
        selection,
      };
      return structuredClone(lastObjectInteraction);
    }
    runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
      position: localPlayer.position,
      heading: localPlayer.heading,
      look: localPlayer.look,
    });
    let receipt;
    if (selected.action === "mine-gold") {
      receipt = runtime.holdExtractionLoopMine({ siteId: selected.target?.siteId ?? null, dt });
    } else if (selected.action === "take-cover") {
      loopInput.cover = true;
      receipt = runtime.engine.n.goldrushExtractionLoop.engageCover({});
    } else {
      receipt = {
        accepted: true,
        complete: true,
        action: selected.action,
        prompt: selected.prompt,
        reason: "inspect-affordance",
      };
    }
    lastObjectInteraction = {
      accepted: receipt?.accepted !== false,
      action: selected.action,
      prompt: selected.prompt,
      receipt,
      selection,
    };
    interactionHoldGraceFrames = Math.max(interactionHoldGraceFrames, 1);
    return structuredClone(lastObjectInteraction);
  }

  function shouldRouteInteractToExtraction(localPlayer = movement.snapshot()) {
    const loop = runtime.engine.n.goldrushExtractionLoop.getState();
    const cargoAmount = Number(loop.player?.cargo?.goldDust ?? loop.player?.cargo?.totalValue ?? 0);
    const zeroCargoAllowed = Boolean(loop.scenario?.cashoutRules?.zeroCargoAllowed);
    if (cargoAmount <= 0 && !zeroCargoAllowed) return false;
    const playerPosition = localPlayer?.position ?? localPlayer;
    if (!playerPosition) return false;
    return Object.values(loop.extraction?.sites ?? {}).some((site) => {
      const dx = Number(playerPosition.x ?? 0) - Number(site.worldPosition?.x ?? 0);
      const dz = Number(playerPosition.z ?? 0) - Number(site.worldPosition?.z ?? 0);
      return Math.hypot(dx, dz) <= Number(site.radius ?? 0);
    });
  }

  function startLoadingYard(payload = {}) {
    const partyState = party.snapshot();
    const payloadWithBriefing = {
      ...payload,
      partyMembers: payload.partyMembers ?? partyState.members,
      partyLeaderId: payload.partyLeaderId ?? partyState.members.find((member) => member.role === "Leader")?.id ?? partyState.localId,
      localPlayerId: partyState.localId,
      frontierConditionBriefing: payload.frontierConditionBriefing ?? createFrontierConditionBriefing(runtime.snapshot()),
    };
    party.resetBoardingSync({ launchId: payload.launchId ?? null });
    firstSequence.startLoading({ payload: payloadWithBriefing, now: performance.now() });
    loadingMovement.reset({ x: 0, z: 10.2 });
    void showScreen("loading").then(() => {
      if (screen === "loading") startLoadingLoop();
    });
  }

  function startLoadingLoop() {
    loadingMovement.resetClock();
    if (loadingLoopId) return;
    const tick = (now) => {
      if (screen !== "loading") {
        loadingLoopId = null;
        return;
      }
      loadingMovement.update(now);
      renderLoading(now);
      loadingLoopId = window.requestAnimationFrame(tick);
    };
    loadingLoopId = window.requestAnimationFrame(tick);
  }

  function stopLoadingLoop() {
    loadingMovement.clearKeys();
    if (!loadingLoopId) return;
    window.cancelAnimationFrame(loadingLoopId);
    loadingLoopId = null;
  }

  function renderLoading(now = performance.now()) {
    const loadingModule = sceneKitLoader.getModule("loading-yard-terrain") ?? sceneKitLoader.getModule("train-departure");
    if (!loadingModule) return;
    if (!loadingRenderer) loadingRenderer = loadingModule.createLoadingTrainSceneRenderer(loadingCanvasRoot);
    const localPlayer = loadingMovement.snapshot();
    const canBoardTrain = loadingModule.isNearTrainBoardingZone(localPlayer.position);
    const currentParty = party.snapshot();
    const sequence = firstSequence.updateLoading({
      now,
      canBoardTrain,
      playerId: currentParty.localId,
      peerBoardingSync: currentParty.boarding,
    });
    const partySnapshot = party.reportBoardingStatus({
      phase: sequence.phase,
      boardingStatus: sequence.boardingStatus,
    });
    if (sequence.lockedThisFrame) {
      loadingMovement.clearKeys();
    }
    const loadingPhase = sequence.phase;
    const boardingSync = partySnapshot.boarding;
    const peerGate = sequence.peerHandoffGate;
    const trainReadout = sequence.trainReadout;
    loadingStatus.textContent = `${loadingPhase}; ${trainReadout?.playerCue ?? (sequence.playerLockedToTrain ? "riding train" : "walk to open door")}; party ${boardingSync.readyCount}/${boardingSync.expectedCount}; peer ${peerGate.ready ? "ready" : "waiting"}`;
    loadingRenderer.render({
      localPlayer,
      party: partySnapshot,
      trainDeparting: sequence.playerLockedToTrain,
      loadingPhase,
      approachProgress: sequence.approachProgress,
      doorProgress: sequence.doorProgress,
      departureProgress: sequence.departureProgress,
      playerLockedToTrain: sequence.playerLockedToTrain,
      boardingStatus: sequence.boardingStatus,
      peerHandoffGate: sequence.peerHandoffGate,
      departureStartedAt: sequence.departureStartedAt,
      trainReadout,
    });
    audio.sync({ screen: "loading", scenario: runtime.snapshot(), loadingPhase, trainReadout });
    const handoffPayload = firstSequence.consumeHandoffPayload();
    if (handoffPayload) startMassMatch(handoffPayload);
  }

  function startMassMatch(payload = {}) {
    resultsTransitionInFlight = false;
    const mode = resolveLegacyMode(payload.legacyModeId ?? selectedLegacyMode.modeId);
    runtime.generateMatch({ players: payload.players ?? resolveLaunchPlayers(mode), phase: mode.phaseHint });
    runtime.setLegacyMode({ modeId: mode.modeId });
    firstSequence.enterRun({ players: payload.players ?? resolveLaunchPlayers(mode), modeId: mode.modeId });
    void showScreen("run").then(() => {
      if (screen === "run") startRunLoop();
    });
  }

  function resolveLaunchPlayers(mode = selectedLegacyMode) {
    return mode.modeId === "classicSolo" ? 1 : massMatchPlayers;
  }

  async function startLobbyCharacter() {
    const lobbyModule = await sceneKitLoader.getModule("three-lobby-character");
    if (!lobbyCharacterRenderer) lobbyCharacterRenderer = lobbyModule.createLobbyCharacterRenderer(lobbyCharacterRoot);
    lobbyCharacterRenderer.start();
  }

  function renderPartyState(nextParty = party.snapshot()) {
    renderFrontierConditionBriefing();
    partyStatus.textContent = `${nextParty.status} / ${nextParty.members.length}/${nextParty.capacity}`;
    partyCode.textContent = nextParty.roomCode ?? "Local";
    partyMessage.textContent = nextParty.message;
    launchButton.disabled = !nextParty.isLeader;
    launchButton.textContent = nextParty.isLeader ? `Start ${selectedLegacyMode.label}` : "Waiting For Leader";
    squadPanel.innerHTML = Array.from({ length: partyCapacity }, (_, index) => {
      const member = nextParty.members[index];
      const isLocal = member?.id === nextParty.localId;
      return `
        <div class="squadSlot${isLocal ? " active" : ""}">
          <span class="slotNumber">${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeMarkup(member?.label ?? "Open Slot")}</strong>
          <small>${escapeMarkup(member ? `${member.role} / ${member.status}` : "Waiting")}</small>
        </div>
      `;
    }).join("");
  }

  function renderFrontierConditionBriefing() {
    const briefing = createFrontierConditionBriefing(runtime.snapshot());
    frontierConditionLabel.textContent = briefing.label;
    frontierConditionRead.textContent = briefing.playerRead;
    frontierConditionGold.textContent = `${briefing.goldYield.toFixed(2)}x`;
    frontierConditionRisk.textContent = `${briefing.extractionRisk.toFixed(2)}x`;
    frontierConditionRoute.textContent = briefing.routeCue;
    return briefing;
  }

  async function completeRunToResults(reason = "manual") {
    if (resultsTransitionInFlight) return;
    resultsTransitionInFlight = true;
    stopRunLoop();
    runtime.endMatch({ reason });
    await showScreen("results");
  }

  function completeExtractionLoopForProof() {
    runtime.engine.n.goldrushFrontierConditions.setCondition({
      conditionId: "goldrush.condition.high-fever-seam",
      reason: "results-screen-proof",
    });
    let loop = runtime.engine.n.goldrushExtractionLoop.getState();
    const mine = loop.mining.sites["mine-seam-01"];
    runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
      position: { x: mine.worldPosition.x, y: 0, z: mine.worldPosition.z },
      heading: 0,
    });
    for (let index = 0; index < 8; index += 1) {
      runtime.engine.n.goldrushExtractionLoop.holdMine({ siteId: mine.id, dt: 0.3 });
    }
    loop = runtime.engine.n.goldrushExtractionLoop.getState();
    const extraction = loop.extraction.sites["rail-depot-extract-01"];
    runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
      position: { x: extraction.worldPosition.x, y: 0, z: extraction.worldPosition.z },
      heading: 0,
    });
    let receipt = null;
    for (let index = 0; index < 14; index += 1) {
      receipt = runtime.engine.n.goldrushExtractionLoop.holdExtraction({ siteId: extraction.id, dt: 0.3 });
      if (receipt?.complete) break;
    }
    return receipt;
  }

  function renderResults() {
    const state = runtime.snapshot();
    const result = state.results ?? {};
    const replay = state.replaySummary ?? {};
    const contest = result.extractionContestSummary ?? replay.extractionContestSummary ?? {};
    const combat = result.combatOutcomeSummary ?? replay.combatOutcomeSummary ?? {};
    const condition = result.frontierConditionSummary ?? replay.frontierConditionSummary ?? {};
    const finalRush = result.finalRushPressureSummary ?? replay.finalRushPressureSummary ?? {};
    const winner = result.winner ?? {};
    const placement = result.placements?.[0] ?? {};
    const extractedGold = Number(placement.extractedGold ?? state.extractionReceipts?.totals?.extractedGold ?? 0);
    const score = Number(winner.score ?? placement.score ?? 0);

    resultsTitle.textContent = winner.id ? `${formatEntityLabel(winner.id)} Won The Claim` : "Claim Settled";
    resultsSubtitle.textContent = `${escapeDisplay(condition.label ?? condition.conditionId ?? "Frontier")} / ${escapeDisplay(contest.mostSevereStatus ?? "clear")} extraction`;
    resultsStats.innerHTML = [
      resultStat("Placement", placement.rank ? `#${placement.rank}` : "#1", "team result"),
      resultStat("Score", formatNumber(score), "final total"),
      resultStat("Gold", formatNumber(extractedGold), "extracted"),
      resultStat("Contest", formatContestLabel(contest), `${formatNumber(contest.highestPressure ?? 0)} pressure`),
      resultStat("Rush", formatFinalRushLabel(finalRush), `${formatNumber(finalRush.maxMultiplier ?? 1)}x multiplier`),
    ].join("");
    resultsFieldRead.innerHTML = [
      resultDefinition("Condition", condition.label ?? condition.conditionId ?? "Unknown"),
      resultDefinition("Value", `${formatNumber(condition.conditionLinkedReceiptCount ?? 0)} linked receipts`),
      resultDefinition("Threats", formatResultIdList(contest.calledThreatIds, "none called")),
      resultDefinition("Collapse", finalRush.readout ?? "No collapse pressure"),
      resultDefinition("Combat", `${formatNumber(combat.receiptCount ?? 0)} receipts / ${formatNumber(combat.damageTaken ?? 0)} damage / ${formatNumber(combat.damageMitigated ?? 0)} blocked`),
      resultDefinition("Cashout", formatResultIdLabel(contest.primarySiteId ?? "standard site")),
    ].join("");
    resultsAwards.innerHTML = (result.awards ?? [])
      .map((award) => `<li><strong>${escapeMarkup(formatAwardId(award.id))}</strong><span>${escapeMarkup(formatAwardValue(award))}</span></li>`)
      .join("") || "<li><strong>No awards</strong><span>finish a run to earn claim awards</span></li>";
    resultsReplay.innerHTML = selectResultReplayMoments(replay.keyMoments ?? [])
      .map((moment) => `<li><strong>${escapeMarkup(formatMomentType(moment.type))}</strong><span>${escapeMarkup(formatReplayMomentContext(moment))}</span></li>`)
      .join("") || "<li><strong>No replay</strong><span>receipts will appear here after a run</span></li>";
  }

  renderPartyState();
  void showScreen("start");

  function createNexusSimulatorGameHost() {
    return {
      getState: () => window.GoldRushHost.getState(),
      getValidationState: () => window.GoldRushHost.getState().realityValidation,
      heuristicInput: () => ({ keys: screen === "loading" ? ["w"] : [] }),
      stop: () => {
        stopRunLoop();
        stopLoadingLoop();
      },
      setInput: (input = {}) => {
        pendingSimulatorCommand = input.command ?? null;
        applySimulatorInput(input, { runCommand: false });
        return window.GoldRushHost.getState();
      },
      tick: (delta = 1 / 60, input = {}) => {
        simulatorNow += Math.max(1, Math.min(250, Number(delta || 0) * 1000));
        applySimulatorInput({ ...input, command: pendingSimulatorCommand ?? input.command }, { runCommand: true });
        pendingSimulatorCommand = null;
        if (screen === "loading") {
          loadingMovement.update(simulatorNow);
          renderLoading(simulatorNow);
        }
        if (screen === "run") {
          movement.update(simulatorNow);
          renderRun();
        }
        return window.GoldRushHost.getState();
      },
      render: () => {
        if (screen === "loading") renderLoading(simulatorNow);
        if (screen === "run") renderRun();
        return window.GoldRushHost.getState();
      },
    };
  }

  function applySimulatorInput(input = {}, { runCommand = false } = {}) {
    if (Array.isArray(input.keys)) {
      syncSimulatorKeys(screen === "loading" ? loadingMovement : movement, input.keys);
    }
    if (input.lookDelta) {
      const activeMovement = screen === "loading" ? loadingMovement : movement;
      activeMovement.addLookDelta(Number(input.lookDelta.x ?? 0), Number(input.lookDelta.y ?? 0));
    }
    loopInput.interact = Boolean(input.interact);
    loopInput.aim = Boolean(input.aim);
    loopInput.fire = Boolean(input.fire);
    loopInput.cover = Boolean(input.cover);
    loopInput.peek = input.peek ?? null;
    if (!runCommand) return;
    if (input.command === "playTitle") {
      audio.start();
      firstSequence.startTitle();
      void showScreen("lobby");
    }
    if (input.command === "startMatch") {
      simulatorNow = performance.now();
      party.startMatch({
        players: Number(input.players ?? resolveLaunchPlayers()),
        groupType: selectedRoom.id,
        legacyModeId: input.legacyModeId ?? selectedLegacyMode.modeId,
      });
    }
    if (input.command === "placeAtTrainDoor" && screen === "loading") {
      loadingMovement.reset({ x: 0, z: -7.4 });
      loadingMovement.clearKeys();
    }
    if (input.command === "mine") window.GoldRushHost.actions.mine();
    if (input.command === "interact") {
      window.GoldRushHost.actions.interact();
      loopInput.interact = false;
    }
    if (input.interact && input.command !== "interact" && runCommand && screen === "run") {
      loopInput.interact = true;
    }
    if (input.command === "cover") window.GoldRushHost.actions.engageCover({ threatId: input.threatId ?? null, coverId: input.coverId ?? null, peekSide: input.peek ?? null });
    if (input.command === "peekCover") window.GoldRushHost.actions.peekCover({ side: input.peek ?? "right" });
    if (input.command === "releaseCover") window.GoldRushHost.actions.releaseCover({ reason: "simulator-command" });
    if (input.command === "extract") window.GoldRushHost.actions.extract();
    if (input.command === "cashOut") window.GoldRushHost.actions.cashOut();
  }

  function syncSimulatorKeys(movementController, keys) {
    const desired = new Set(keys);
    ["w", "a", "s", "d", "Shift"].forEach((key) => {
      movementController.setKey({ key, preventDefault() {} }, desired.has(key));
    });
  }
}

function createObjectAffordanceTerrainDescriptor() {
  return {
    bounds: {
      minX: -TERRAIN_WIDTH / 2,
      maxX: TERRAIN_WIDTH / 2,
      minZ: -TERRAIN_DEPTH / 2,
      maxZ: TERRAIN_DEPTH / 2,
    },
    width: TERRAIN_WIDTH,
    depth: TERRAIN_DEPTH,
    patchSize: TERRAIN_PATCH_SIZE,
  };
}

function isPublicSmokeProof() {
  return new URLSearchParams(window.location.search).has("publicSmoke");
}

function createFrontierConditionBriefing(scenario) {
  const active = scenario.frontierConditions?.active ?? {};
  const effects = scenario.frontierConditionEffects ?? {};
  return {
    conditionId: effects.conditionId ?? active.id ?? null,
    label: effects.label ?? active.label ?? "Unknown Frontier",
    family: effects.family ?? active.family ?? "unknown",
    playerRead: effects.playerRead ?? active.playerRead ?? "Scout the field before boarding.",
    recommendedPlan: active.gameplay?.recommendedPlan ?? effects.gameplay?.recommendedPlan ?? "Confirm routes, cargo value, and extraction risk.",
    routeCue: effects.render?.routeCue ?? active.world?.routeCue ?? "standard",
    ambience: effects.audio?.ambience ?? active.audio?.ambience ?? "dry-wind-light",
    lightingKey: effects.render?.lightingKey ?? active.lighting?.key ?? "warm-noon",
    goldYield: Number(active.modifiers?.goldYield ?? effects.mining?.payoutScalar ?? 1),
    extractionRisk: Number(active.modifiers?.extractionRisk ?? effects.extraction?.riskScalar ?? 1),
    combatPressure: Number(active.modifiers?.ambushPressure ?? effects.combat?.pressureScalar ?? 1),
  };
}

function resultStat(label, value, detail) {
  return `
    <article class="resultStat">
      <span>${escapeMarkup(label)}</span>
      <strong>${escapeMarkup(value)}</strong>
      <small>${escapeMarkup(detail)}</small>
    </article>
  `;
}

function resultDefinition(label, value) {
  return `
    <div>
      <dt>${escapeMarkup(label)}</dt>
      <dd>${escapeMarkup(String(value ?? "none"))}</dd>
    </div>
  `;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(value ?? 0));
}

function formatContestLabel(contest = {}) {
  if (contest.lockdownCount > 0) return "Lockdown";
  if (contest.contestedCount > 0) return "Contested";
  if (contest.watchedCount > 0) return "Watched";
  return "Clear";
}

function formatFinalRushLabel(finalRush = {}) {
  if ((finalRush.pressureLinkedReceiptCount ?? 0) > 0) return "Pressure";
  return "Clear";
}

function selectResultReplayMoments(moments = []) {
  const priorityTypes = new Set([
    "combatDamageTaken",
    "combatPressureResolved",
    "extractionAccepted",
    "extractionRejected",
    "handoffAccepted",
    "matchEnded",
  ]);
  const prioritized = moments.filter((moment) => priorityTypes.has(moment.type));
  const filler = moments.filter((moment) => !priorityTypes.has(moment.type)).slice(-Math.max(0, 5 - prioritized.length));
  const selected = prioritized.length >= 5 ? prioritized.slice(-5) : [...prioritized, ...filler];
  return selected.sort((a, b) => Number(a.tick ?? 0) - Number(b.tick ?? 0) || String(a.type).localeCompare(String(b.type)));
}

function formatAwardId(id = "") {
  return String(id)
    .replace(/^award\./, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAwardValue(award = {}) {
  const value = award.value ?? award.targetId ?? "";
  if (award.id === "award.collapse-cashout") return `${formatNumber(value)}x`;
  if (typeof value === "number") return formatNumber(value);
  const text = String(value ?? "");
  if (text.startsWith("goldrush.condition.")) return formatEntityLabel(text.replace("goldrush.condition.", ""));
  return formatResultIdLabel(text);
}

function formatReplayMomentContext(moment = {}) {
  const parts = [`tick ${formatNumber(moment.tick ?? 0)}`];
  if (moment.contestStatus) parts.push(formatResultIdLabel(moment.contestStatus));
  if (Number(moment.finalRushPressure ?? 0) > 0) parts.push(`rush ${formatNumber(moment.finalRushPressure)}`);
  if (moment.laneId) parts.push(formatResultIdLabel(moment.laneId));
  return parts.join(" / ");
}

function formatResultIdList(values = [], fallback = "none") {
  const list = values.map((value) => formatResultIdLabel(value)).filter(Boolean);
  return list.length ? list.join(", ") : fallback;
}

function formatResultIdLabel(value = "") {
  const text = String(value ?? "");
  if (!text || text === "standard site") return "Standard Site";
  return formatEntityLabel(text
    .replace(/^goldrush\.condition\./, "")
    .replace(/^gold\.zone\./, "")
    .replace(/^lane\./, "")
    .replace(/^telegraph\./, "")
    .replace(/\.committed$/, "")
    .replace(/-extract-\d+$/, "")
    .replace(/-\d+$/, ""));
}

function formatEntityLabel(value = "") {
  return String(value ?? "")
    .split(/[-_.]/)
    .filter(Boolean)
    .map((part) => {
      if (/^\\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function formatMomentType(type = "") {
  return String(type)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function escapeDisplay(value) {
  return String(value ?? "");
}

function createDefaultMovementModifiers() {
  return {
    contract: "goldrush-movement-modifiers-v1",
    source: "base",
    speedMultiplier: 1,
    sprintMultiplier: 1,
    staminaDrainScalar: 1,
    noiseRadiusBonus: 0,
    postureLean: 0,
    turnDrag: 0,
    cargoWeightClass: "empty",
    cargo: null,
  };
}

function normalizeMovementModifiers({ cargo = null } = {}) {
  const normalized = createDefaultMovementModifiers();
  if (!cargo || cargo.contract !== "goldrush-cargo-mobility-v1") return normalized;
  return {
    ...normalized,
    source: "n:goldrush:gold-carrying",
    speedMultiplier: roundMovementModifier(clamp(Number(cargo.speedMultiplier ?? 1), 0.35, 1.25)),
    sprintMultiplier: roundMovementModifier(clamp(Number(cargo.sprintMultiplier ?? cargo.speedMultiplier ?? 1), 0.25, 1.25)),
    staminaDrainScalar: roundMovementModifier(clamp(Number(cargo.staminaDrainScalar ?? 1), 1, 3)),
    noiseRadiusBonus: roundMovementModifier(clamp(Number(cargo.noiseRadiusBonus ?? 0), 0, 32)),
    postureLean: roundMovementModifier(clamp(Number(cargo.postureLean ?? 0), 0, 0.45)),
    turnDrag: roundMovementModifier(clamp(Number(cargo.turnDrag ?? 0), 0, 0.5)),
    cargoWeightClass: String(cargo.weightClass ?? "empty"),
    cargo: structuredClone(cargo),
  };
}

function roundMovementModifier(value) {
  return Number(value.toFixed(3));
}

function createMovementController({
  bounds = walkBounds,
  initialPosition = { x: -12, z: -20 },
  initialLookYaw = 0,
  initialLookPitch = -0.14,
  forwardSign = 1,
  terrainSampler = null,
  terrainRaycaster = null,
  maxStepUp = 0.95,
  maxSlopeGrade = 1.85,
} = {}) {
  const keys = new Set();
  const position = { x: initialPosition.x, y: 0, z: initialPosition.z };
  let groundSampleSequence = 0;
  let ground = sampleGround(position.x, position.z);
  position.y = ground.height;
  let heading = 0;
  let lookYaw = initialLookYaw;
  let lookPitch = initialLookPitch;
  let mouseLookEnabled = false;
  let lastTime = 0;
  let moving = false;
  let currentSpeed = 0;
  let terrainBlocked = false;
  let movementModifiers = createDefaultMovementModifiers();

  const bindings = {
    w: "forward",
    ArrowUp: "forward",
    s: "back",
    ArrowDown: "back",
    a: "left",
    ArrowLeft: "left",
    d: "right",
    ArrowRight: "right",
    Shift: "sprint",
  };

  function setKey(event, isDown) {
    const action = bindings[event.key];
    if (!action) return false;
    event.preventDefault();
    if (isDown) keys.add(action);
    else keys.delete(action);
    return true;
  }

  function update(now = performance.now()) {
    const dt = lastTime ? Math.min(0.05, Math.max(0, (now - lastTime) / 1000)) : 0;
    lastTime = now;
    const strafeAxis = (keys.has("right") ? 1 : 0) - (keys.has("left") ? 1 : 0);
    const forwardAxis = ((keys.has("forward") ? 1 : 0) - (keys.has("back") ? 1 : 0)) * forwardSign;
    const xAxis = Math.sin(lookYaw) * forwardAxis - Math.cos(lookYaw) * strafeAxis;
    const zAxis = Math.cos(lookYaw) * forwardAxis + Math.sin(lookYaw) * strafeAxis;
    const length = Math.hypot(xAxis, zAxis);
    moving = length > 0;
    const baseSpeed = keys.has("sprint") ? 7.2 : 4.4;
    const speedMultiplier = keys.has("sprint") ? movementModifiers.sprintMultiplier : movementModifiers.speedMultiplier;
    currentSpeed = moving ? roundMovementModifier(baseSpeed * speedMultiplier) : 0;
    if (moving && dt > 0) {
      const previous = { x: position.x, y: position.y, z: position.z };
      const previousGround = ground;
      const nx = xAxis / length;
      const nz = zAxis / length;
      position.x = clamp(position.x + nx * currentSpeed * dt, bounds.minX, bounds.maxX);
      position.z = clamp(position.z + nz * currentSpeed * dt, bounds.minZ, bounds.maxZ);
      clampToWalkBounds(position, bounds);
      const nextGround = sampleGround(position.x, position.z);
      const stepDelta = nextGround.height - previousGround.height;
      terrainBlocked = !nextGround.walkable || stepDelta > maxStepUp;
      if (terrainBlocked) {
        position.x = previous.x;
        position.y = previous.y;
        position.z = previous.z;
        ground = previousGround;
        currentSpeed = 0;
        moving = false;
      } else {
        ground = nextGround;
        position.y = ground.height;
        heading = Math.atan2(nx, nz);
      }
    } else {
      terrainBlocked = false;
      ground = sampleGround(position.x, position.z);
      position.y = ground.height;
    }
    return snapshot();
  }

  function addLookDelta(deltaX = 0, deltaY = 0) {
    mouseLookEnabled = true;
    lookYaw = normalizeAngle(lookYaw - deltaX * 0.0026);
    lookPitch = clamp(lookPitch - deltaY * 0.0018, -0.76, 0.58);
    return snapshot();
  }

  function snapshot() {
    return {
      id: "player-1",
      position: { x: position.x, y: position.y, z: position.z },
      heading,
      look: {
        yaw: lookYaw,
        pitch: lookPitch,
        mouseLookEnabled,
        movementRelativeToCamera: true,
      },
      isMoving: moving,
      speed: currentSpeed,
      ground: {
        height: ground.height,
        slopeGrade: ground.slopeGrade,
        normal: ground.normal,
        walkable: ground.walkable,
        blockingFeatureId: ground.blockingFeatureId,
        algorithm: ground.algorithm,
        placement: ground.placement,
        hit: ground.hit,
      },
      renderGround: {
        height: position.y,
        source: "cached-movement-ground",
        sampleSequence: ground.sampleSequence,
        stableForFrame: true,
      },
      terrainCollider: {
        grounded: Boolean(terrainSampler),
        blocked: terrainBlocked,
        maxStepUp,
        maxSlopeGrade,
      },
      controls: {
        forward: keys.has("forward"),
        back: keys.has("back"),
        left: keys.has("left"),
        right: keys.has("right"),
        sprint: keys.has("sprint"),
      },
      inputModel: {
        id: "camera-relative-wasd",
        mouseLookDrivesCamera: true,
        wasdFollowsCameraYaw: true,
        forwardSign,
        forwardOnGround: {
          x: Number((Math.sin(lookYaw) * forwardSign).toFixed(4)),
          z: Number((Math.cos(lookYaw) * forwardSign).toFixed(4)),
        },
        rightOnGround: {
          x: Number((-Math.cos(lookYaw)).toFixed(4)),
          z: Number(Math.sin(lookYaw).toFixed(4)),
        },
      },
      movementModifiers: structuredClone(movementModifiers),
    };
  }

  function setMovementModifiers(modifiers = {}) {
    movementModifiers = normalizeMovementModifiers(modifiers);
    return snapshot();
  }

  return {
    setKey,
    update,
    setMovementModifiers,
    addLookDelta,
    enableMouseLook() {
      mouseLookEnabled = true;
    },
    snapshot,
    resetClock() {
      lastTime = 0;
    },
    reset(nextPosition = initialPosition) {
      position.x = nextPosition.x;
      position.z = nextPosition.z;
      ground = sampleGround(position.x, position.z);
      position.y = ground.height;
      heading = Number.isFinite(nextPosition.heading) ? nextPosition.heading : 0;
      lookYaw = Number.isFinite(nextPosition.lookYaw) ? normalizeAngle(nextPosition.lookYaw) : initialLookYaw;
      lookPitch = Number.isFinite(nextPosition.lookPitch) ? clamp(nextPosition.lookPitch, -0.76, 0.58) : initialLookPitch;
      lastTime = 0;
      moving = false;
      currentSpeed = 0;
      terrainBlocked = false;
      movementModifiers = createDefaultMovementModifiers();
      keys.clear();
    },
    clearKeys() {
      keys.clear();
      moving = false;
      currentSpeed = 0;
      terrainBlocked = false;
    },
  };

  function sampleGround(x, z) {
    if (!terrainSampler) {
      return {
        height: 0,
        slopeGrade: 0,
        normal: { x: 0, y: 1, z: 0 },
        walkable: true,
        blockingFeatureId: null,
        algorithm: "flat-plane",
        placement: "flat-plane",
        hit: null,
      };
    }
    const hit = terrainRaycaster?.({ x, z }) ?? null;
    const sample = terrainSampler({ x, z, maxWalkableSlope: maxSlopeGrade, hit });
    groundSampleSequence += 1;
    return {
      ...sample,
      sampleSequence: groundSampleSequence,
    };
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(value) {
  const fullTurn = Math.PI * 2;
  return ((value + Math.PI) % fullTurn + fullTurn) % fullTurn - Math.PI;
}

function clampToWalkBounds(position, bounds = walkBounds) {
  position.x = clamp(position.x, bounds.minX, bounds.maxX);
  position.z = clamp(position.z, bounds.minZ, bounds.maxZ);
}

function escapeMarkup(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
