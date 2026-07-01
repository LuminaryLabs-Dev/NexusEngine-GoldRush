import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  collectReadableThreatCueShots,
  readableThreatAudioContract,
} from "../../src/audio/goldRushAudioManager.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });

assert(runtime.engine.n.goldrushExtractionLoop, "missing NexusRealtime engine.n.goldrushExtractionLoop");
assert(runtime.engine.n.goldrushExtractionLoop.validate().passed, "initial extraction loop should validate");

runtime.generateMatch({ players: 20, phase: "prospect" });
runtime.engine.n.goldrushFrontierConditions.setCondition({
  conditionId: "goldrush.condition.high-fever-seam",
  reason: "extraction-loop-validator",
});
let loop = runtime.engine.n.goldrushExtractionLoop.getState();
assert(loop.runId, "startRun should create runId");
assert(loop.phase === "exploring", "new loop should start exploring");
assert(Object.keys(loop.mining.sites).length >= 1, "loop should expose mining sites");
assert(Object.keys(loop.extraction.sites).length >= 1, "loop should expose extraction sites");
assert(Object.keys(loop.combat.threats).length >= 1, "loop should expose threat spawns");
assert(loop.combat.readability?.contract === "readable-threat-lanes-v1", "loop should expose readable combat lane contract");
assert(loop.combat.readability?.coverContract === "readable-threat-cover-v1", "loop should expose readable combat cover contract");
assert(Object.keys(loop.combat.readability.threats).length >= 1, "loop should expose readable threat packets");
assert(loop.combat.readability.threats["claim-jumper-01"].telegraph.readableBeforeDamage === false, "latent threat should not be committed before activation");
assert(loop.combat.readability.threats["claim-jumper-01"].telegraph.multisensory.visual, "threat telegraph should expose visual cue");
assert(loop.combat.readability.threats["claim-jumper-01"].telegraph.multisensory.audio, "threat telegraph should expose audio cue");
assert(loop.combat.readability.threats["claim-jumper-01"].lane.id === "lane.claim-jumper-01", "threat should expose deterministic danger lane id");
assert(loop.combat.readability.threats["claim-jumper-01"].cover.length >= 2, "threat should expose deterministic cover descriptors");
assert(loop.combat.readability.threats["claim-jumper-01"].cover.some((cover) => cover.blocksLane === true), "threat cover should identify lane-blocking cover");
assert(loop.combat.readability.threats["claim-jumper-01"].recommendedCoverId?.startsWith("cover.claim-jumper-01."), "threat should expose a recommended cover id");
assert(loop.combat.readability.coverIds.includes(loop.combat.readability.threats["claim-jumper-01"].recommendedCoverId), "top-level cover ids should include recommended cover");
assert(loop.worldSpaceMarkers.length >= 3, "loop should expose world-space markers");
assert(loop.worldSpaceMarkers.some((marker) => marker.type === "threat" && marker.telegraph?.id), "threat marker should carry telegraph metadata");
assert(loop.worldSpaceMarkers.some((marker) => marker.type === "threat" && marker.cover?.length >= 2 && marker.recommendedCoverId), "threat marker should carry cover metadata");
assert(loop.extraction.sites["rail-depot-extract-01"].contestState, "extraction sites should expose contest state");
assert(loop.frontierConditionEffects.conditionId === "goldrush.condition.high-fever-seam", "loop should consume active frontier condition effects");
assert(loop.frontierConditionEffects.mining.payoutScalar > 1, "high fever seam should increase mining payout scalar");
assert(loop.frontierConditionEffects.extraction.holdTimeScalar > 1, "high fever seam should increase extraction hold time scalar");
assert(loop.mining.readability?.contract === "goldrush-mining-claim-pressure-v1", "loop should expose mining claim pressure contract");
assert(loop.mining.readability.domainPath === "n:goldrush:mine-hold-action", "mining readability should stay owned by mine-hold kit domain");
assert(loop.mining.readability.sites["mine-seam-01"].rewardPreview.expectedPayout > loop.mining.readability.sites["mine-seam-01"].rewardPreview.basePayout, "mining reward preview should include frontier-condition payout scalar");
assert(loop.mining.readability.sites["mine-seam-01"].cue.visual, "mining readability should expose visual cue");
assert(loop.worldSpaceMarkers.some((marker) => marker.type === "mining-site" && marker.mining?.siteId === "mine-seam-01" && marker.mining?.rewardPreview?.expectedPayout > 0), "mining markers should carry site-level mining readability data");

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
assert(mineReceipt.conditionId === "goldrush.condition.high-fever-seam", "mine receipt should include frontier condition id");
assert(mineReceipt.payout > mineReceipt.basePayout, "high fever seam should increase mined payout");
assert(mineReceipt.miningReceipt?.receiptId?.startsWith("mining.goldrush-run-"), "holdMine should return a deterministic mining receipt");
assert(mineReceipt.miningReceipt.claimHeat > 0, "mining receipt should preserve claim heat");
assert(mineReceipt.miningReceipt.noiseRadius > mine.radius, "mining receipt should preserve readable noise radius");
assert(mineReceipt.miningReceipt.goldZoneId === "gold.zone.west-drywash", "mining receipt should preserve gold zone id");
loop = runtime.engine.n.goldrushExtractionLoop.getState();
assert(loop.player.cargo.goldDust > 0, "mined gold should enter carried cargo");
assert(loop.player.cargo.mobility?.contract === "goldrush-cargo-mobility-v1", "carried cargo should expose a mobility contract");
assert(loop.player.cargo.mobility.domainPath === "n:goldrush:gold-carrying", "cargo mobility should stay owned by the gold-carrying kit domain");
assert(loop.player.cargo.mobility.speedMultiplier < 1, "carried cargo should reduce base movement speed");
assert(loop.player.cargo.mobility.sprintMultiplier < loop.player.cargo.mobility.speedMultiplier, "carried cargo should penalize sprint more than walk");
assert(loop.player.cargo.mobility.noiseRadiusBonus > 0, "carried cargo should expose extraction-noise pressure");
assert(loop.player.cargo.mobility.nextAction === "extract-cashout", "cargo mobility should guide the next player action toward extraction");
assert(loop.player.cargo.noisePressure?.contract === "goldrush-cargo-noise-pressure-v1", "carried cargo should expose a noise-pressure contract");
assert(loop.player.cargo.noisePressure.domainPath === "n:goldrush:gold-carrying", "cargo noise pressure should stay owned by the gold-carrying kit domain");
assert(loop.player.cargo.noisePressure.detectionRadiusBonus > 0, "carried cargo noise should widen threat detection");
assert(loop.player.cargo.noisePressure.pressureBonus > 0, "carried cargo noise should increase ambush pressure");
assert(loop.player.cargo.visual?.contract === "goldrush-cargo-visual-v1", "carried cargo should expose a visual contract");
assert(loop.player.cargo.visual.domainPath === "n:goldrush:gold-carrying", "cargo visual should stay owned by the gold-carrying kit domain");
assert(loop.player.cargo.visual.visible === true, "mined cargo should become visible on the player");
assert(loop.player.cargo.visual.nuggetCount > 0, "cargo visual should expose visible gold pieces");
assert(loop.player.cargo.visual.mobility?.contract === "goldrush-cargo-mobility-v1", "cargo visual should carry the paired mobility contract");
assert(loop.player.cargo.visual.nextAction === "extract-cashout", "cargo visual should guide the next player action toward extraction");
assert(loop.mining.sitesTouched.includes(mine.id), "mined site should be tracked");
assert(loop.mining.sites[mine.id].goldZoneId === "gold.zone.west-drywash", "mined site should link to a real gold zone");
assert(loop.mining.receipts.length === 1, "mining receipts should persist in loop state");
assert(loop.mining.readability.lastReceipt.receiptId === mineReceipt.miningReceipt.receiptId, "mining readability should expose last receipt");
assert(loop.mining.readability.totals.minedGold === mineReceipt.payout, "mining readability totals should track mined gold");
assert(["noise-carrying", "claim-jumper-likely"].includes(loop.mining.readability.nextRisk), "mining readability should preview claim risk after payout");
assert(loop.combat.readability.cargoNoisePressure?.contract === "goldrush-cargo-noise-pressure-v1", "combat readability should expose carried-cargo noise pressure");
assert(loop.combat.readability.threats["claim-jumper-01"].cargoNoisePressure.affectsThreat === true, "claim jumper readability should show cargo noise affects threat state");
assert(loop.combat.readability.threats["claim-jumper-01"].cargoNoisePressure.noiseAwareRadius > loop.combat.threats["claim-jumper-01"].radius, "cargo noise should expand readable threat radius");
assert(loop.worldSpaceMarkers.some((marker) => marker.type === "threat" && marker.cargoNoisePressure?.contract === "goldrush-cargo-noise-pressure-v1"), "threat markers should carry cargo noise pressure metadata");

runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: -9.5, y: 0, z: -13.4 },
  heading: 0,
});
loop = runtime.engine.n.goldrushExtractionLoop.setAim({ active: true });
assert(loop.player.aimMode === true, "setAim should enter aim mode");
loop = runtime.engine.n.goldrushExtractionLoop.engageCover({ threatId: "claim-jumper-01" });
const engagedCoverId = loop.combat.cover.coverId;
assert(loop.combat.cover.contract === "goldrush-cover-engagement-v1", "cover engagement should expose a deterministic contract");
assert(loop.combat.cover.engaged === true, "engageCover should enter cover state");
assert(loop.combat.cover.threatId === "claim-jumper-01", "cover engagement should bind to the active threat");
assert(loop.combat.cover.damageReduction > 0, "cover engagement should expose damage reduction");
assert(loop.combat.readability.coverEngagement.coverId === engagedCoverId, "combat readability should mirror engaged cover");
assert(loop.combat.readability.threats["claim-jumper-01"].coverEngagement.coverId === engagedCoverId, "threat readability should mirror engaged cover");
assert(loop.worldSpaceMarkers.some((marker) => marker.type === "threat" && marker.engagedCoverId === engagedCoverId), "threat marker should carry engaged cover id");
loop = runtime.engine.n.goldrushExtractionLoop.peekCover({ side: "left" });
assert(loop.combat.cover.status === "peeking", "peekCover should enter peeking state");
assert(loop.combat.cover.peekSide === "left", "peekCover should update peek side");
const threatCueShots = collectReadableThreatCueShots(loop);
assert(threatCueShots.length >= 1, "active readable threat should create an audio cue shot");
assert(threatCueShots[0].contract === readableThreatAudioContract, "threat audio cue should expose the readable threat audio contract");
assert(threatCueShots[0].cueId === "goldrush.audio.sfx.ambush", "threat audio cue should map to the ambush SFX slot");
assert(threatCueShots[0].dedupeId.includes("telegraph.claim-jumper-01"), "threat audio cue should dedupe by telegraph id");
const shot = runtime.engine.n.goldrushExtractionLoop.fire({});
assert(shot.accepted === true, "fire should create a deterministic shot event");
assert(shot.receipt?.type === "player-shot", "fire should create a combat shot receipt");
assert(shot.receipt?.telegraphId === "telegraph.claim-jumper-01.committed", "shot receipt should reference active threat telegraph");
assert(shot.receipt?.laneId === "lane.claim-jumper-01", "shot receipt should reference active threat lane");
loop = runtime.engine.n.goldrushExtractionLoop.takeDamage({ amount: 9, reason: "validator-readable-threat" });
assert(loop.receipt?.type === "player-damaged", "damage should return a combat damage receipt");
assert(loop.receipt?.telegraphId, "damage receipt should reference the readable telegraph");
assert(loop.receipt?.laneId === "lane.claim-jumper-01", "damage receipt should reference active threat lane");
assert(loop.receipt?.coverId === engagedCoverId, "damage receipt should reference engaged cover");
assert(loop.receipt?.baseDamage === 9, "damage receipt should preserve base damage");
assert(loop.receipt?.damageApplied < loop.receipt?.baseDamage, "engaged cover should mitigate incoming damage");
assert(loop.receipt?.damageMitigated > 0, "damage receipt should expose mitigated damage");
assert(loop.receipt?.counterplay === "cover-mitigated", "damage receipt should classify cover counterplay");
loop = runtime.engine.n.goldrushExtractionLoop.getState();
assert(loop.combat.receipts.length >= 2, "combat receipts should persist in loop state");
assert(loop.combat.readability.receipts.length >= 2, "combat readability should mirror recent combat receipts");
assert(loop.combat.readability.activeLaneIds.includes("lane.claim-jumper-01"), "active threat lane should be exposed for renderer/proof");
assert(loop.combat.readability.recommendedCoverIds.includes(loop.combat.readability.threats["claim-jumper-01"].recommendedCoverId), "active readability should retain recommended cover ids");
assert(loop.combat.readability.threats["claim-jumper-01"].nextPlayerCounterplay.includes("cover"), "active threat should recommend cover counterplay");
for (let index = 0; index < 14; index += 1) {
  runtime.engine.n.goldrushExtractionLoop.tick({ input: {}, dt: 0.1 });
}

const outsideExtraction = runtime.engine.n.goldrushExtractionLoop.completeExtraction({ siteId: "rail-depot-extract-01" });
assert(outsideExtraction.accepted === false, "extraction cannot complete outside extraction volume");
runtime.startFinalRush();
loop = runtime.engine.n.goldrushExtractionLoop.getState();
assert(loop.finalRushPressure.contract === "goldrush-final-rush-extraction-pressure-v1", "loop should expose final rush pressure bridge");
assert(loop.finalRushPressure.active === true, "loop should know final rush is active");
assert(loop.finalRushPressure.goldZoneId === "gold.zone.west-drywash", "final rush pressure should resolve the touched mining gold zone");
assert(loop.finalRushPressure.zonePressure > 0, "final rush pressure should expose zone pressure after final rush starts");

const extraction = loop.extraction.sites["rail-depot-extract-01"];
runtime.engine.n.goldrushExtractionLoop.setAim({ active: false });
runtime.engine.n.goldrushExtractionLoop.setPlayerPose({
  position: { x: extraction.worldPosition.x, y: 0, z: extraction.worldPosition.z },
  heading: 0,
});

let extractionReceipt = null;
for (let index = 0; index < 12; index += 1) {
  extractionReceipt = runtime.engine.n.goldrushExtractionLoop.holdExtraction({ siteId: extraction.id, dt: 0.3 });
  if (!extractionReceipt.complete) {
    assert(extractionReceipt.extractionSiteContest?.status === "contested" || extractionReceipt.extractionSiteContest?.status === "lockdown", "high-risk extraction should become contested before completion");
  }
}

assert(extractionReceipt.accepted === true, "holdExtraction should be accepted inside volume");
assert(extractionReceipt.complete === true, "holdExtraction should complete after required progress");
assert(extractionReceipt.receipt?.extracted === true, "completed extraction should produce extracted receipt");
assert(extractionReceipt.receipt.cargoValue > 0, "extraction receipt should include cargo value");
assert(extractionReceipt.receipt.frontierCondition.conditionId === "goldrush.condition.high-fever-seam", "extraction receipt should include frontier condition summary");
assert(extractionReceipt.receipt.extractionSiteContest?.conditionId === "goldrush.condition.high-fever-seam", "extraction receipt should include contested site condition context");
assert(extractionReceipt.receipt.extractionSiteContest.calledThreatIds.includes("claim-jumper-01"), "contested extraction should call linked local threat");
assert(extractionReceipt.receipt.extractionSiteContest.finalRushPressure?.active === true, "extraction contest should preserve final rush pressure context");
assert(runtime.engine.n.goldrushExtractionLoop.getState().combat.threats["claim-jumper-01"].conditionRadius >= extractionReceipt.receipt.extractionSiteContest.threatRadius, "contested extraction should preserve expanded threat radius");
assert(extractionReceipt.receipt.cargoValue > extractionReceipt.receipt.baseCargoValue, "frontier condition should affect cashout value");
assert(extractionReceipt.receipt.finalRushPressure?.goldZoneId === "gold.zone.west-drywash", "extraction receipt should expose final rush pressure zone");
assert(extractionReceipt.receipt.nextSceneId === extraction.nextSceneId, "receipt should include next scene id");

const duplicate = runtime.engine.n.goldrushExtractionLoop.completeExtraction({ siteId: extraction.id });
assert(duplicate.idempotent === true, "repeated completeExtraction should be idempotent");

const state = runtime.snapshot();
assert(state.extractionLoop.receipt.extracted === true, "scenario snapshot should include extraction loop receipt");
assert(state.extractionLoop.receipt.extractionSiteContest.status === "lockdown", "completed high-risk extraction should finish in lockdown contest state");
assert(state.extractionLoop.worldSpaceMarkers.length >= 3, "scenario snapshot should include world markers");
assert(state.extractionReceipts.totals.acceptedCount >= 1, "loop should record an extraction receipt");
assert(state.extractionReceipts.receipts[0].goldZoneId === "gold.zone.west-drywash", "receipt ledger should preserve actual gold zone id");
assert(state.extractionReceipts.receipts[0].pressureScalar > 0, "receipt ledger should apply final rush zone pressure");
assert(state.extractionReceipts.receipts[0].multiplier > 1, "receipt ledger should apply final rush extraction multiplier");
assert(state.extractionReceipts.receipts[0].extractionSiteContest?.calledThreatIds.includes("claim-jumper-01"), "receipt ledger should preserve extraction contest threat call");
assert(state.scoring.teams["team-01"].totalScore > 0, "loop extraction should update score");
assert(runtime.engine.n.goldrushExtractionLoop.validate().passed, "completed extraction loop should validate");

runtime.endMatch({ reason: "contested-extraction-validator" });
const finalState = runtime.snapshot();
assert(finalState.results.extractionContestSummary.lockdownCount === 1, "results should count lockdown extraction contest from loop receipt");
assert(finalState.results.extractionContestSummary.calledThreatIds.includes("claim-jumper-01"), "results should list called extraction threats");
assert(finalState.results.finalRushPressureSummary.pressureLinkedReceiptCount === 1, "results should count extraction-loop final rush pressure receipt");
assert(finalState.results.finalRushPressureSummary.maxMultiplier > 1, "results should expose extraction-loop final rush multiplier");
assert(finalState.results.awards.some((award) => award.id === "award.collapse-cashout"), "results should award collapse cashout");
assert(finalState.results.combatOutcomeSummary.contract === "goldrush-combat-outcome-summary-v1", "results should expose combat outcome summary contract");
assert(finalState.results.combatOutcomeSummary.receiptCount >= 2, "results should preserve extraction-loop combat receipt count");
assert(finalState.results.combatOutcomeSummary.laneIds.includes("lane.claim-jumper-01"), "results should preserve readable combat lane ids");
assert(finalState.results.combatOutcomeSummary.damageTaken > 0, "results should summarize damage taken");
assert(finalState.results.combatOutcomeSummary.baseDamageTaken >= 9, "results should summarize pre-cover damage pressure");
assert(finalState.results.combatOutcomeSummary.damageMitigated > 0, "results should summarize cover mitigation");
assert(finalState.results.combatOutcomeSummary.coverIds.includes(engagedCoverId), "results should preserve engaged cover ids");
assert(finalState.results.awards.some((award) => award.id === "award.lockdown-extractor"), "results should award lockdown extraction");
assert(finalState.results.awards.some((award) => award.id === "award.under-fire-extractor"), "results should award under-fire extraction");
assert(finalState.replaySummary.extractionContestSummary.lockdownCount === 1, "replay should count lockdown extraction contest");
assert(finalState.replaySummary.finalRushPressureSummary.pressureLinkedReceiptCount === 1, "replay should count final rush pressure receipt");
assert(finalState.replaySummary.keyMoments.some((moment) => moment.contestStatus === "lockdown" && moment.finalRushPressure > 0), "replay key moments should carry contest and final rush status");
assert(finalState.replaySummary.combatOutcomeSummary.receiptCount >= 2, "replay should preserve combat outcome summary");
assert(finalState.replaySummary.combatOutcomeSummary.damageMitigated > 0, "replay should preserve cover mitigation summary");
assert(finalState.replaySummary.keyMoments.some((moment) => moment.type === "combatDamageTaken" && moment.laneId === "lane.claim-jumper-01" && moment.coverId === engagedCoverId), "replay key moments should include combat damage with lane and cover id");

console.log("goldrush extraction loop passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
