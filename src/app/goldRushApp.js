import { createRoomOrchestrator } from "../rooms/roomOrchestrator.js";
import { createGoldRushRuntime } from "../kits/goldRushRuntime.js";
import { createGoldRushRenderer } from "../renderer/goldRushRenderer.js";

const phases = ["lobby", "drop", "prospect", "combat", "extract", "results"];

export function createGoldRushApp(root) {
  const orchestrator = createRoomOrchestrator();
  const runtime = createGoldRushRuntime({ orchestrator });

  root.innerHTML = `
    <main class="shell">
      <section class="panel" aria-label="Gold Rush controls">
        <div class="brand">
          <h1>Gold Rush</h1>
          <p>NexusRealtime room-shard scaffold for 2-100 player extraction combat.</p>
        </div>

        <div class="heroControls">
          <button class="button primary" data-action="generate">Generate Match Rooms</button>
          <div class="segmented">
            <button class="button" data-action="mine">Mine Gold</button>
            <button class="button" data-action="cashout">Cash Out</button>
          </div>
          <button class="button" data-action="ambush">Ambush</button>
          <div class="controlRow">
            <label for="player-count">Players</label>
            <input id="player-count" type="range" min="2" max="100" value="72" />
          </div>
          <div class="segmented">
            <button class="button active" data-mode="exploration">Exploration</button>
            <button class="button" data-mode="combat">Combat</button>
          </div>
        </div>

        <details class="advancedControls">
          <summary>Advanced controls</summary>
          <div class="controlRow">
            <label for="phase">Phase</label>
            <select id="phase">
              ${phases.map((phase) => `<option value="${phase}">${phase}</option>`).join("")}
            </select>
          </div>
        </details>

        <section class="readout" aria-label="Match state">
          <div class="stats">
            <div class="stat"><span class="statLabel">Players</span><span class="statValue" data-stat="players"></span></div>
            <div class="stat"><span class="statLabel">Shards</span><span class="statValue" data-stat="shards"></span></div>
            <div class="stat"><span class="statLabel">Carried</span><span class="statValue" data-stat="carried"></span></div>
            <div class="stat"><span class="statLabel">Banked</span><span class="statValue" data-stat="banked"></span></div>
          </div>
        </section>
      </section>

      <section class="stage" aria-label="Gold Rush terrain preview">
        <div id="goldrush-canvas"></div>
        <div class="hud">
          <div class="hudLine" data-hud="rooms"></div>
          <div class="hudLine" data-hud="loop"></div>
        </div>
      </section>
    </main>
  `;

  const canvasRoot = root.querySelector("#goldrush-canvas");
  const renderer = createGoldRushRenderer(canvasRoot);

  window.GoldRushHost = {
    engine: runtime.engine,
    runtime,
    getState: () => {
      const scenario = runtime.snapshot();
      return {
        scenario,
        world: scenario.world,
        terrain: scenario.terrainState,
        towns: scenario.towns,
        paths: scenario.paths,
        goldZones: scenario.goldZones,
        loadingGates: scenario.loadingGates,
        audio: scenario.audioState,
        animation: scenario.animationState,
        camera: scenario.cameraState,
      };
    },
  };

  const playerInput = root.querySelector("#player-count");
  const phaseInput = root.querySelector("#phase");
  const generateButton = root.querySelector('[data-action="generate"]');
  const mineButton = root.querySelector('[data-action="mine"]');
  const cashoutButton = root.querySelector('[data-action="cashout"]');
  const ambushButton = root.querySelector('[data-action="ambush"]');
  const modeButtons = [...root.querySelectorAll("[data-mode]")];

  function render() {
    const state = runtime.snapshot();
    const carriedGold = state.cargo["player-1"] ?? 0;
    const bankedGold = state.cashout["player-1"] ?? 0;
    root.querySelector('[data-stat="players"]').textContent = state.players;
    root.querySelector('[data-stat="shards"]').textContent = state.rooms.shards.length;
    root.querySelector('[data-stat="carried"]').textContent = carriedGold;
    root.querySelector('[data-stat="banked"]').textContent = bankedGold;
    root.querySelector('[data-hud="rooms"]').innerHTML = state.rooms.shards
      .map((room) => `<span class="pill">${room.id}: ${room.playerCount}/50</span>`)
      .join("");
    root.querySelector('[data-hud="loop"]').innerHTML = state.loop
      .map((step) => `<span class="pill">${step}</span>`)
      .concat([
        `<span class="pill">scene: ${state.sceneState.currentSceneId.replace("goldrush.scene.", "")}</span>`,
        `<span class="pill">camera: ${state.cameraMode}</span>`,
        `<span class="pill">audio: ${state.sceneState.activeAudioCueId.replace("goldrush.audio.", "")}</span>`,
        `<span class="pill">anim: ${state.sceneState.activeAnimationCueId.replace("goldrush.anim.", "")}</span>`,
        `<span class="pill">world: ${(state.world.scale.widthMeters / 1000).toFixed(1)}km x ${(state.world.scale.depthMeters / 1000).toFixed(1)}km</span>`,
        `<span class="pill">towns: ${state.world.towns.length}</span>`,
        `<span class="pill">town layouts: ${state.towns.length}</span>`,
        `<span class="pill">paths: ${state.paths.length}</span>`,
        `<span class="pill">gold zones: ${state.goldZones.length}</span>`,
        `<span class="pill">patch windows: ${state.world.activeRoomWindows.length}</span>`,
        `<span class="pill">patches: ${state.terrainState.patchGrid.activePatchIds.length}</span>`,
        `<span class="pill">loading gates: ${state.loadingGates.gates.length}</span>`,
        `<span class="pill">music: ${state.audioState.musicCueId.replace("goldrush.audio.music.", "")}</span>`,
        `<span class="pill">pose: ${state.animationState.baseState}/${state.animationState.aimState}</span>`,
        `<span class="pill">camera kit: ${state.cameraState.mode}</span>`,
        `<span class="pill">kits: ${state.installOrder.length}</span>`,
        `<span class="pill">gold nodes: ${state.mining.filter((node) => !node.depleted).length}</span>`,
      ])
      .join("");

    modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.cameraMode);
    });
    renderer.render(state);
  }

  generateButton.addEventListener("click", () => {
    runtime.generateMatch({ players: Number(playerInput.value), phase: phaseInput.value });
    render();
  });

  mineButton.addEventListener("click", () => {
    runtime.mineGold();
    render();
  });

  cashoutButton.addEventListener("click", () => {
    runtime.cashOut();
    render();
  });

  ambushButton.addEventListener("click", () => {
    runtime.takeDamage();
    render();
  });

  playerInput.addEventListener("input", () => {
    runtime.generateMatch({ players: Number(playerInput.value), phase: phaseInput.value });
    render();
  });

  phaseInput.addEventListener("change", () => {
    runtime.transitionScene({ phase: phaseInput.value });
    render();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      runtime.setCameraMode(button.dataset.mode);
      render();
    });
  });

  runtime.generateMatch({ players: Number(playerInput.value), phase: phaseInput.value });
  render();
}
