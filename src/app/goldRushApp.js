import { createNetworkOrchestrator } from "../network/networkOrchestrator.js";
import { createPeerPartyRoom } from "../network/peerPartyRoom.js";
import { createGoldRushRuntime } from "../kits/goldRushRuntime.js";
import { createCannonTerrainPhysicsDescriptor } from "../physics/cannonTerrainPhysics.js";
import { createPhysicsBackendDecision } from "../physics/physicsBackendKit.js";
import { createTerrainColliderDescriptor, raycastTerrainDown, sampleTerrainCollider } from "../physics/terrainCollider.js";
import { createGoldRushSceneKitLoader, validateGoldRushSceneKitLoaderSnapshot } from "../scenes/goldRushSceneKitLoader.js";
import { getGoldRushSceneSite, validateGoldRushSceneSites } from "../scenes/goldRushSceneSites.js";

const walkBounds = { minX: -88, maxX: 88, minZ: -54, maxZ: 56 };
const centralMountainBlockers = [
  { x: -5.5, z: 16, radius: 9.8 },
  { x: 8.4, z: 8.6, radius: 10.8 },
  { x: -1.8, z: -7.8, radius: 9.4 },
];

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
const loadingTrainTiming = {
  approachMs: 2800,
  doorMs: 900,
  departMs: 3300,
};

export function createGoldRushApp(root) {
  const orchestrator = createNetworkOrchestrator();
  const runtime = createGoldRushRuntime({ orchestrator });
  let renderer = null;
  let lobbyCharacterRenderer = null;
  let loadingRenderer = null;
  let audio = null;
  let screen = "start";
  let selectedRoom = roomTypes[2];
  const sceneKitLoader = createGoldRushSceneKitLoader();
  const terrainColliderDescriptor = createTerrainColliderDescriptor();
  const terrainPhysicsDescriptor = createCannonTerrainPhysicsDescriptor(terrainColliderDescriptor);
  const physicsBackendDescriptor = createPhysicsBackendDecision({
    terrainColliderDescriptor,
    terrainPhysicsDescriptor,
  });
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
    blockers: [],
  });
  let runLoopId = null;
  let loadingLoopId = null;
  let pendingMatchPayload = null;
  let trainSequenceStartedAt = 0;
  let trainDeparting = false;
  let trainDepartureStartedAt = 0;
  let playerLockedToTrain = false;
  const loopInput = {
    interact: false,
    aim: false,
    fire: false,
  };

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
  const roomSelect = root.querySelector("[data-room-select]");
  const roomLabel = root.querySelector("[data-room-label]");
  const roomRole = root.querySelector("[data-room-role]");
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
        const receipt = runtime.holdExtractionLoopMine();
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
      lobby: () => {
        void showScreen("lobby");
      },
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
    },
    getState: () => {
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
        scenario,
        realityStatus,
        realityValidation: runtime.engine.n.goldrushReality.validate({ sceneKitLoader: sceneKitSnapshot }),
        world: scenario.world,
        terrain: scenario.terrainState,
        towns: scenario.towns,
        paths: scenario.paths,
        goldZones: scenario.goldZones,
        loadingGates: scenario.loadingGates,
        audio: scenario.audioState,
        animation: scenario.animationState,
        camera: scenario.cameraState,
        match: scenario.match,
        protoKitBridge: scenario.protoKitBridge,
        extractionLoop: scenario.extractionLoop,
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
        lobbyCharacter: lobbyCharacterRenderer?.snapshot() ?? null,
        loadingScene: loadingRenderer?.snapshot() ?? null,
        loadingPlayer: loadingMovement.snapshot(),
        localPlayer: movement.snapshot(),
      };
    },
  };

  root.querySelector('[data-action="play-title"]').addEventListener("click", () => {
    audio = audio ?? createGoldRushAudio();
    audio.start();
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
    party.startMatch({ players: massMatchPlayers, groupType: selectedRoom.id });
  });

  roomSelect.addEventListener("change", () => {
    selectedRoom = roomTypes.find((room) => room.id === roomSelect.value) ?? roomTypes[2];
    roomLabel.textContent = selectedRoom.label;
    roomRole.textContent = selectedRoom.role;
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
    const localPlayer = movement.snapshot();
    const extractionLoop = runtime.tickExtractionLoop({ localPlayer, input: loopInput, dt: 0.05 });
    loopInput.fire = false;
    const state = runtime.snapshot();
    const carried = state.cargo["player-1"] ?? 0;
    const banked = state.cashout["player-1"] ?? 0;
    status.textContent = `${state.match.phase}/${extractionLoop.phase}; carried ${carried}; banked ${banked}; network ${state.network.status}; ground ${localPlayer.ground.height.toFixed(1)}; ${localPlayer.isMoving ? "walking" : "idle"}`;
    renderer.render({ ...state, localPlayer });
  }

  function startLoadingYard(payload = {}) {
    pendingMatchPayload = payload;
    trainSequenceStartedAt = 0;
    trainDeparting = false;
    trainDepartureStartedAt = 0;
    playerLockedToTrain = false;
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
    if (!trainSequenceStartedAt) trainSequenceStartedAt = now;
    const localPlayer = loadingMovement.snapshot();
    const sequenceElapsed = Math.max(0, now - trainSequenceStartedAt);
    const approachProgress = Math.min(1, sequenceElapsed / loadingTrainTiming.approachMs);
    const doorProgress = approachProgress >= 1
      ? Math.min(1, (sequenceElapsed - loadingTrainTiming.approachMs) / loadingTrainTiming.doorMs)
      : 0;
    const canBoardTrain = doorProgress >= 1 && loadingModule.isNearTrainBoardingZone(localPlayer.position);
    if (!trainDeparting && canBoardTrain) {
      trainDeparting = true;
      trainDepartureStartedAt = now;
      playerLockedToTrain = true;
      loadingMovement.clearKeys();
    }
    const departureProgress = trainDeparting
      ? Math.min(1, (now - trainDepartureStartedAt) / loadingTrainTiming.departMs)
      : 0;
    const loadingPhase = trainDeparting
      ? departureProgress >= 1 ? "handoff" : "departing"
      : approachProgress < 1 ? "approaching"
        : doorProgress < 1 ? "door-opening"
          : "boarding";
    loadingStatus.textContent = `${loadingPhase}; ${playerLockedToTrain ? "riding train" : "walk to open door"}`;
    loadingRenderer.render({
      localPlayer,
      party: party.snapshot(),
      trainDeparting,
      loadingPhase,
      approachProgress,
      doorProgress,
      departureProgress,
      playerLockedToTrain,
    });
    if (departureProgress >= 1) startMassMatch(pendingMatchPayload ?? {});
  }

  function startMassMatch(payload = {}) {
    runtime.generateMatch({ players: payload.players ?? massMatchPlayers, phase: "prospect" });
    runtime.setCameraMode("exploration");
    void showScreen("run").then(() => {
      if (screen === "run") startRunLoop();
    });
  }

  async function startLobbyCharacter() {
    const lobbyModule = await sceneKitLoader.getModule("three-lobby-character");
    if (!lobbyCharacterRenderer) lobbyCharacterRenderer = lobbyModule.createLobbyCharacterRenderer(lobbyCharacterRoot);
    lobbyCharacterRenderer.start();
  }

  function renderPartyState(nextParty = party.snapshot()) {
    partyStatus.textContent = `${nextParty.status} / ${nextParty.members.length}/${nextParty.capacity}`;
    partyCode.textContent = nextParty.roomCode ?? "Local";
    partyMessage.textContent = nextParty.message;
    launchButton.disabled = !nextParty.isLeader;
    launchButton.textContent = nextParty.isLeader ? "Start" : "Waiting For Leader";
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

  renderPartyState();
  void showScreen("start");
}

function isPublicSmokeProof() {
  return new URLSearchParams(window.location.search).has("publicSmoke");
}

function createMovementController({
  bounds = walkBounds,
  initialPosition = { x: -12, z: -20 },
  initialLookYaw = 0,
  initialLookPitch = -0.04,
  blockers = centralMountainBlockers,
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
    const xAxis = Math.sin(lookYaw) * forwardAxis + Math.cos(lookYaw) * strafeAxis;
    const zAxis = Math.cos(lookYaw) * forwardAxis - Math.sin(lookYaw) * strafeAxis;
    const length = Math.hypot(xAxis, zAxis);
    moving = length > 0;
    currentSpeed = moving ? (keys.has("sprint") ? 7.2 : 4.4) : 0;
    if (moving && dt > 0) {
      const previous = { x: position.x, y: position.y, z: position.z };
      const previousGround = ground;
      const nx = xAxis / length;
      const nz = zAxis / length;
      position.x = clamp(position.x + nx * currentSpeed * dt, bounds.minX, bounds.maxX);
      position.z = clamp(position.z + nz * currentSpeed * dt, bounds.minZ, bounds.maxZ);
      pushOutOfMountainBlockers(position, blockers, bounds);
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
      },
    };
  }

  return {
    setKey,
    update,
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
      heading = 0;
      lookYaw = initialLookYaw;
      lookPitch = initialLookPitch;
      lastTime = 0;
      moving = false;
      currentSpeed = 0;
      terrainBlocked = false;
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

function pushOutOfMountainBlockers(position, blockers = centralMountainBlockers, bounds = walkBounds) {
  blockers.forEach((blocker) => {
    const dx = position.x - blocker.x;
    const dz = position.z - blocker.z;
    const distance = Math.hypot(dx, dz);
    if (distance >= blocker.radius) return;
    const safeDistance = distance || 0.001;
    position.x = blocker.x + (dx / safeDistance) * blocker.radius;
    position.z = blocker.z + (dz / safeDistance) * blocker.radius;
  });
  position.x = clamp(position.x, bounds.minX, bounds.maxX);
  position.z = clamp(position.z, bounds.minZ, bounds.maxZ);
}

function createGoldRushAudio() {
  let context = null;
  let master = null;
  let timer = null;
  let step = 0;
  const pattern = [
    { frequency: 196, gain: 0.11 },
    { frequency: 246.94, gain: 0.08 },
    { frequency: 293.66, gain: 0.1 },
    { rest: true },
    { frequency: 329.63, gain: 0.08 },
    { frequency: 246.94, gain: 0.07 },
    { rest: true },
    { frequency: 220, gain: 0.09 },
  ];

  function start() {
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0.16;
      master.connect(context.destination);
    }
    if (context.state === "suspended") context.resume();
    if (!timer) {
      playStep();
      timer = window.setInterval(playStep, 520);
    }
  }

  function playStep() {
    const note = pattern[step % pattern.length];
    if (!note.rest) playPluck({ context, master, ...note });
    if (step % 4 === 0) playBootTap({ context, master });
    step += 1;
  }

  return { start };
}

function playPluck({ context, master, frequency, gain }) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const toneGain = context.createGain();
  const filter = context.createBiquadFilter();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1050, now);
  toneGain.gain.setValueAtTime(0.0001, now);
  toneGain.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  oscillator.connect(filter);
  filter.connect(toneGain);
  toneGain.connect(master);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

function playBootTap({ context, master }) {
  const now = context.currentTime;
  const buffer = context.createBuffer(1, context.sampleRate * 0.045, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
  }
  const source = context.createBufferSource();
  const noiseGain = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(420, now);
  noiseGain.gain.setValueAtTime(0.05, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);
  source.start(now);
}

function escapeMarkup(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
