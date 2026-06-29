import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });

assert(runtime.engine.n.goldrushExtractionLoop, "missing NexusRealtime engine.n.goldrushExtractionLoop");
assert(runtime.engine.n.goldrushExtractionLoop.validate().passed, "initial extraction loop should validate");

runtime.generateMatch({ players: 20, phase: "prospect" });
let loop = runtime.engine.n.goldrushExtractionLoop.getState();
assert(loop.runId, "startRun should create runId");
assert(loop.phase === "exploring", "new loop should start exploring");
assert(Object.keys(loop.mining.sites).length >= 1, "loop should expose mining sites");
assert(Object.keys(loop.extraction.sites).length >= 1, "loop should expose extraction sites");
assert(Object.keys(loop.combat.threats).length >= 1, "loop should expose threat spawns");
assert(loop.worldSpaceMarkers.length >= 3, "loop should expose world-space markers");

const mine = loop.mining.sites["mine-seam-01"];
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: mine.worldPosition.x, y: 0, z: mine.worldPosition.z },
  heading: 0,
});

let mineReceipt = null;
for (let index = 0; index < 6; index += 1) {
  mineReceipt = runtime.engine.n.goldrushExtractionLoop.holdMine({ siteId: mine.id, dt: 0.3 });
  if (mineReceipt.complete) break;
}
assert(mineReceipt.accepted === true && mineReceipt.complete === true, "holdMine should complete inside range");
loop = runtime.engine.n.goldrushExtractionLoop.getState();
assert(loop.player.cargo.goldDust > 0, "mined gold should enter carried cargo");
assert(loop.mining.sitesTouched.includes(mine.id), "mined site should be tracked");

runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: -9.5, y: 0, z: -13.4 },
  heading: 0,
});
loop = runtime.engine.n.goldrushExtractionLoop.setAim({ active: true });
assert(loop.player.aimMode === true, "setAim should enter aim mode");
const shot = runtime.engine.n.goldrushExtractionLoop.fire({});
assert(shot.accepted === true, "fire should create a deterministic shot event");

const outsideExtraction = runtime.engine.n.goldrushExtractionLoop.completeExtraction({ siteId: "rail-depot-extract-01" });
assert(outsideExtraction.accepted === false, "extraction cannot complete outside extraction volume");

const extraction = loop.extraction.sites["rail-depot-extract-01"];
runtime.engine.n.goldrushExtractionLoop.setAim({ active: false });
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: extraction.worldPosition.x, y: 0, z: extraction.worldPosition.z },
  heading: 0,
});

let extractionReceipt = null;
for (let index = 0; index < 12; index += 1) {
  extractionReceipt = runtime.engine.n.goldrushExtractionLoop.holdExtraction({ siteId: extraction.id, dt: 0.3 });
}

assert(extractionReceipt.accepted === true, "holdExtraction should be accepted inside volume");
assert(extractionReceipt.complete === true, "holdExtraction should complete after required progress");
assert(extractionReceipt.receipt?.extracted === true, "completed extraction should produce extracted receipt");
assert(extractionReceipt.receipt.cargoValue > 0, "extraction receipt should include cargo value");
assert(extractionReceipt.receipt.nextSceneId === extraction.nextSceneId, "receipt should include next scene id");

const duplicate = runtime.engine.n.goldrushExtractionLoop.completeExtraction({ siteId: extraction.id });
assert(duplicate.idempotent === true, "repeated completeExtraction should be idempotent");

const state = runtime.snapshot();
assert(state.extractionLoop.receipt.extracted === true, "scenario snapshot should include extraction loop receipt");
assert(state.extractionLoop.worldSpaceMarkers.length >= 3, "scenario snapshot should include world markers");
assert(state.extractionReceipts.totals.acceptedCount >= 1, "loop should record an extraction receipt");
assert(state.scoring.teams["team-01"].totalScore > 0, "loop extraction should update score");
assert(runtime.engine.n.goldrushExtractionLoop.validate().passed, "completed extraction loop should validate");

console.log("goldrush extraction loop passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
