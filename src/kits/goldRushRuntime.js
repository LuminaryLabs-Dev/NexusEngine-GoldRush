export function createGoldRushRuntime({ orchestrator }) {
  let state = createInitialState();

  function generateMatch({ players, phase }) {
    const rooms = orchestrator.generate({ players });
    state = {
      ...state,
      players,
      phase,
      rooms,
      cameraMode: phase === "combat" ? "combat" : state.cameraMode,
      ledger: createLedger({ players, shardCount: rooms.shards.length }),
      loop: createLoop(phase),
    };
  }

  function setCameraMode(cameraMode) {
    state = { ...state, cameraMode };
  }

  function snapshot() {
    return structuredClone(state);
  }

  return {
    generateMatch,
    setCameraMode,
    snapshot,
  };
}

function createInitialState() {
  return {
    players: 2,
    phase: "lobby",
    cameraMode: "exploration",
    rooms: { lobby: null, shards: [], ledger: null },
    ledger: { goldInWorld: 0, bankedGold: 0 },
    loop: [],
  };
}

function createLedger({ players, shardCount }) {
  return {
    goldInWorld: players * 37 + shardCount * 250,
    bankedGold: 0,
    extractionReceipts: [],
    combatReceipts: [],
  };
}

function createLoop(phase) {
  const fullLoop = ["lobby", "drop", "prospect", "combat", "extract", "results"];
  const activeIndex = fullLoop.indexOf(phase);
  return fullLoop.map((step, index) => {
    if (index < activeIndex) return `${step}: complete`;
    if (index === activeIndex) return `${step}: active`;
    return `${step}: queued`;
  });
}
