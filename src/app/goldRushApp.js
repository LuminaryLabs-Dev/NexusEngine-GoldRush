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
            <div class="stat"><span class="statLabel">Camera</span><span class="statValue" data-stat="camera"></span></div>
            <div class="stat"><span class="statLabel">Kits</span><span class="statValue" data-stat="kits"></span></div>
          </div>
        </section>
      </section>

      <section class="stage" aria-label="Gold Rush arena preview">
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

  const playerInput = root.querySelector("#player-count");
  const phaseInput = root.querySelector("#phase");
  const generateButton = root.querySelector('[data-action="generate"]');
  const modeButtons = [...root.querySelectorAll("[data-mode]")];

  function render() {
    const state = runtime.snapshot();
    root.querySelector('[data-stat="players"]').textContent = state.players;
    root.querySelector('[data-stat="shards"]').textContent = state.rooms.shards.length;
    root.querySelector('[data-stat="camera"]').textContent = state.cameraMode;
    root.querySelector('[data-stat="kits"]').textContent = state.installOrder.length;
    root.querySelector('[data-hud="rooms"]').innerHTML = state.rooms.shards
      .map((room) => `<span class="pill">${room.id}: ${room.playerCount}/50</span>`)
      .join("");
    root.querySelector('[data-hud="loop"]').innerHTML = state.loop
      .map((step) => `<span class="pill">${step}</span>`)
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

  playerInput.addEventListener("input", () => {
    runtime.generateMatch({ players: Number(playerInput.value), phase: phaseInput.value });
    render();
  });

  phaseInput.addEventListener("change", () => {
    runtime.generateMatch({ players: Number(playerInput.value), phase: phaseInput.value });
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
