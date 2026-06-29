import { createCloudSourceDiscoveryReport } from "../import-sanitize/generate-cloud-source-discovery.mjs";

const report = createCloudSourceDiscoveryReport({
  generatedAt: "2026-06-29T21:35:00Z",
});
const failures = [];

expect(report.schema === "nexusengine.goldrush.cloud-source-discovery.v1", "invalid-schema");
expect(report.importJobId === "goldrush-dual-source-001", "wrong-import-job");
expect(report.source?.nameWithOwner === "thecrimsondeveloper/Gold_Rush", "wrong-source-repo");
expect(report.source?.branch === "development", "wrong-source-branch");
expect(report.source?.commitSha === "144230e32b537336c83407b4ddae83cdc95c1c9e", "wrong-source-commit");
expect(report.generatedFrom?.localCloneCreated === false, "must-prove-no-local-clone");
expect((report.source?.roots ?? []).length === 2, "expected-two-roots");

const requiredScenes = new Set([
  "GoldRush/Assets/Scenes/Lobby.unity",
  "GoldRush/Assets/Scenes/Arena.unity",
  "GoldRush/Assets/Entities/Player/PlayerTest.unity",
  "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/MainMenu.unity",
  "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game.unity",
  "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game_SinglePlayer.unity",
]);
const generatedScenes = new Set(
  (report.source?.roots ?? []).flatMap((root) => root.requiredSceneEvidence ?? []).map((scene) => scene.path)
);
for (const scenePath of requiredScenes) {
  expect(generatedScenes.has(scenePath), `missing-required-scene:${scenePath}`);
}
for (const root of report.source?.roots ?? []) {
  expect(root.exists === true, `root-not-proven:${root.sourceKey}`);
  expect(root.productEvidence?.blobSha, `missing-product-blob:${root.sourceKey}`);
  expect(root.unityVersionEvidence?.blobSha, `missing-version-blob:${root.sourceKey}`);
  for (const scene of root.requiredSceneEvidence ?? []) {
    expect(scene.exists === true, `scene-not-proven:${scene.path}`);
    expect(isBlobSha(scene.blobSha), `invalid-scene-blob:${scene.path}`);
    expect(Number.isFinite(scene.sizeBytes) && scene.sizeBytes >= 0, `invalid-scene-size:${scene.path}`);
  }
}

const serialized = JSON.stringify(report);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "generated-report-contains-secret-like-value");

assert(failures.length === 0, `source discovery generator invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "source-discovery-generator-ready",
  importJobId: report.importJobId,
  sourceCommitSha: report.source.commitSha,
  roots: report.source.roots.length,
  requiredScenes: generatedScenes.size,
}, null, 2));

function isBlobSha(value) {
  return typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
