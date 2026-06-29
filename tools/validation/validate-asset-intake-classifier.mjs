import {
  classifyGoldRushImportedFile,
  createGoldRushAssetIntakeReport,
  validateGoldRushAssetIntakeReport,
} from "../import-sanitize/goldrush-asset-intake-classifier.mjs";

const fixtureFiles = [
  { path: "GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Cactus_01.fbx", sizeBytes: 1200, sourceHash: "sha256:fixture-cactus" },
  { path: "GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Fence_01.fbx", sizeBytes: 1800, sourceHash: "sha256:fixture-fence" },
  { path: "GoldRush/Assets/World/ImportedModels/Wild West Western/Models/Coin_01.fbx", sizeBytes: 900, sourceHash: "sha256:fixture-coin" },
  { path: "GoldRush/Assets/Entities/Items/Revolver.prefab", sizeBytes: 1500, sourceHash: "sha256:fixture-revolver" },
  { path: "GoldRush/Assets/Scenes/Arena.unity", sizeBytes: 5000, sourceHash: "sha256:fixture-arena" },
  { path: "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game_SinglePlayer.unity", sizeBytes: 5100, sourceHash: "sha256:fixture-single" },
  { path: "GoldRush_Old/Assets/_GOLDRUSH/Audio/Wandering Theme.wav", sizeBytes: 44000, sourceHash: "sha256:fixture-wandering" },
  { path: "GoldRush_Old/Assets/_GOLDRUSH/Audio/Revolver Shot.wav", sizeBytes: 3000, sourceHash: "sha256:fixture-shot" },
  { path: "GoldRush/Packages/manifest.json", sizeBytes: 100, sourceHash: "sha256:fixture-blocked" },
  {
    path: "GoldRush/Assets/Resources/Config.asset",
    sizeBytes: 120,
    sourceHash: "sha256:fixture-secret",
    text: "api_key: REDACTED_FIXTURE_VALUE",
  },
  { path: "GoldRush/Assets/Notes/readme.md", sizeBytes: 40, sourceHash: "sha256:fixture-unmapped" },
];

const report = createGoldRushAssetIntakeReport({
  importJobId: "goldrush-fixture-validation",
  rootPath: "fixture-only",
  files: fixtureFiles,
});
const validation = validateGoldRushAssetIntakeReport(report);

assert(validation.passed, `fixture report invalid: ${validation.failures.join(", ")}`);
assert(report.status === "blocked", "fixture report should block unsafe files");
assert(report.totals.files === fixtureFiles.length, "fixture total should match input");
assert(report.totals.candidates === 8, "fixture should classify eight promotion candidates");
assert(report.totals.blocked === 2, "fixture should block manifest and secret-like config");
assert(report.totals.unmapped === 1, "fixture should keep unsupported docs unmapped");
assert(report.totals.secretFindings === 1, "fixture should report one secret finding type without value");
assert(report.candidates.some((candidate) => candidate.slotId === "goldrush.prop.cactus01"), "cactus should map to cactus slot");
assert(report.candidates.some((candidate) => candidate.slotId === "goldrush.weapon.revolver"), "revolver should map to weapon slot");
assert(report.candidates.some((candidate) => candidate.slotId === "goldrush.scene.arena"), "arena scene should map to arena slot");
assert(report.candidates.some((candidate) => candidate.slotId === "goldrush.scene.legacySinglePlayer"), "single player scene should map to legacy single-player slot");
assert(report.candidates.some((candidate) => candidate.slotId === "goldrush.audio.music.wandering"), "wandering audio should map to music slot");
assert(report.candidates.some((candidate) => candidate.slotId === "goldrush.audio.sfx.revolverShot"), "revolver shot should map to sfx slot");
assert(report.candidates.every((candidate) => candidate.promoteOnlyAfter.includes("human-review")), "all candidates should require human review");
assert(!JSON.stringify(report.blocked).includes("REDACTED_FIXTURE_VALUE"), "blocked report must not print secret-like values");

const emptyReport = createGoldRushAssetIntakeReport({
  importJobId: "goldrush-empty-validation",
  rootPath: "missing-fixture-root",
  files: [],
});
const emptyValidation = validateGoldRushAssetIntakeReport(emptyReport);
assert(emptyValidation.passed, `empty report invalid: ${emptyValidation.failures.join(", ")}`);
assert(emptyReport.status === "waiting-for-raw-import", "empty report should wait for cloud import");

const denied = classifyGoldRushImportedFile("GoldRush/Assets/Photon/Fusion/Resources/PhotonAppSettings.asset");
assert(denied.status === "blocked", "Photon settings should always be blocked");

console.log(JSON.stringify({
  status: "asset-intake-classifier-ready",
  fixture: {
    candidates: report.totals.candidates,
    blocked: report.totals.blocked,
    unmapped: report.totals.unmapped,
    secretFindings: report.totals.secretFindings,
  },
  emptyStatus: emptyReport.status,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
