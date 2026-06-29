import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportPath = path.join(repoRoot, "reports/provenance/goldrush-source-access-2026-06-29.json");
const handoffPath = path.join(repoRoot, "manifests/import-jobs/goldrush-cloud-transfer-handoff.json");
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const handoff = JSON.parse(readFileSync(handoffPath, "utf8"));
const failures = [];

expect(report.schema === "nexusengine.goldrush.source-access-proof.v1", "invalid-schema");
expect(report.method === "github-connector-and-github-api-no-local-clone", "invalid-method");
expect(report.localCloneCreated === false, "local-clone-must-be-false");
expect(report.source?.nameWithOwner === handoff.repositories?.source?.nameWithOwner, "source-repo-mismatch");
expect(report.source?.branch === handoff.repositories?.source?.branch, "source-branch-mismatch");
expect(report.source?.branchExists === true, "source-branch-not-proven");
expect(isCommitSha(report.source?.headSha), "source-head-sha-invalid");

const expectedRoots = handoff.repositories?.source?.roots ?? [];
expect(Array.isArray(report.roots), "roots-must-be-array");
expect(report.roots?.length === expectedRoots.length, "root-count-mismatch");

for (const expectedRoot of expectedRoots) {
  const actual = report.roots.find((root) => root.sourceKey === expectedRoot.sourceKey);
  expect(Boolean(actual), `missing-root:${expectedRoot.sourceKey}`);
  if (!actual) continue;

  expect(actual.root === expectedRoot.root, `root-path-mismatch:${expectedRoot.sourceKey}`);
  expect(actual.exists === true, `root-not-proven:${expectedRoot.sourceKey}`);
  expect(actual.productName === expectedRoot.expectedProductName, `product-name-mismatch:${expectedRoot.sourceKey}`);
  expect(actual.unityVersion === expectedRoot.expectedUnityVersion, `unity-version-mismatch:${expectedRoot.sourceKey}`);
  expect(isSafeSourcePath(actual.productEvidence?.path), `unsafe-product-evidence-path:${expectedRoot.sourceKey}`);
  expect(isBlobSha(actual.productEvidence?.blobSha), `invalid-product-evidence-blob:${expectedRoot.sourceKey}`);
  expect(isSafeSourcePath(actual.unityVersionEvidence?.path), `unsafe-version-evidence-path:${expectedRoot.sourceKey}`);
  expect(isBlobSha(actual.unityVersionEvidence?.blobSha), `invalid-version-evidence-blob:${expectedRoot.sourceKey}`);

  for (const scenePath of expectedRoot.requiredSceneEvidence ?? []) {
    const scene = (actual.requiredSceneEvidence ?? []).find((entry) => entry.path === scenePath);
    expect(Boolean(scene), `missing-scene:${scenePath}`);
    if (!scene) continue;
    expect(scene.exists === true, `scene-not-proven:${scenePath}`);
    expect(isBlobSha(scene.blobSha), `invalid-scene-blob:${scenePath}`);
    expect(Number.isFinite(scene.sizeBytes) && scene.sizeBytes >= 0, `invalid-scene-size:${scenePath}`);
  }
}

const serialized = JSON.stringify(report);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "report-contains-secret-like-value");

assert(failures.length === 0, `source access proof invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "source-access-proof-ready",
  source: report.source.nameWithOwner,
  branch: report.source.branch,
  headSha: report.source.headSha,
  roots: report.roots.length,
  requiredScenes: report.roots.flatMap((root) => root.requiredSceneEvidence ?? []).length,
}, null, 2));

function isSafeSourcePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function isCommitSha(value) {
  return typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
}

function isBlobSha(value) {
  return typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
