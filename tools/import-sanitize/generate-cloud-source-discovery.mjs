import { dirname, join, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultSourceAccessPath = "reports/provenance/goldrush-source-access-2026-06-29.json";
const defaultHandoffPath = "manifests/import-jobs/goldrush-cloud-transfer-handoff.json";

export function createCloudSourceDiscoveryReport({
  sourceAccessPath = defaultSourceAccessPath,
  handoffPath = defaultHandoffPath,
  generatedAt = new Date().toISOString(),
} = {}) {
  const sourceAccess = readJson(sourceAccessPath);
  const handoff = readJson(handoffPath);
  const failures = [];

  expect(sourceAccess.schema === "nexusengine.goldrush.source-access-proof.v1", "invalid-source-access-schema", failures);
  expect(sourceAccess.localCloneCreated === false, "source-access-must-not-use-local-clone", failures);
  expect(sourceAccess.source?.nameWithOwner === handoff.repositories?.source?.nameWithOwner, "source-repo-mismatch", failures);
  expect(sourceAccess.source?.branch === handoff.repositories?.source?.branch, "source-branch-mismatch", failures);
  expect(isCommitSha(sourceAccess.source?.headSha), "source-head-sha-invalid", failures);

  const expectedRoots = handoff.repositories?.source?.roots ?? [];
  expect((sourceAccess.roots ?? []).length === expectedRoots.length, "root-count-mismatch", failures);

  const roots = expectedRoots.map((expectedRoot) => {
    const actualRoot = (sourceAccess.roots ?? []).find((root) => root.sourceKey === expectedRoot.sourceKey);
    expect(Boolean(actualRoot), `missing-root:${expectedRoot.sourceKey}`, failures);
    if (!actualRoot) return null;
    expect(actualRoot.root === expectedRoot.root, `root-path-mismatch:${expectedRoot.sourceKey}`, failures);
    expect(actualRoot.exists === true, `root-not-proven:${expectedRoot.sourceKey}`, failures);
    expect(actualRoot.productName === expectedRoot.expectedProductName, `product-name-mismatch:${expectedRoot.sourceKey}`, failures);
    expect(actualRoot.unityVersion === expectedRoot.expectedUnityVersion, `unity-version-mismatch:${expectedRoot.sourceKey}`, failures);

    const requiredSceneEvidence = (expectedRoot.requiredSceneEvidence ?? []).map((scenePath) => {
      const scene = (actualRoot.requiredSceneEvidence ?? []).find((entry) => entry.path === scenePath);
      expect(Boolean(scene), `missing-scene:${scenePath}`, failures);
      expect(scene?.exists === true, `scene-not-proven:${scenePath}`, failures);
      return {
        path: scenePath,
        exists: scene?.exists === true,
        blobSha: scene?.blobSha ?? null,
        sizeBytes: scene?.sizeBytes ?? null,
      };
    });

    return {
      sourceKey: actualRoot.sourceKey,
      root: actualRoot.root,
      exists: true,
      productName: actualRoot.productName,
      unityVersion: actualRoot.unityVersion,
      productEvidence: actualRoot.productEvidence,
      unityVersionEvidence: actualRoot.unityVersionEvidence,
      requiredSceneEvidence,
    };
  }).filter(Boolean);

  assert(failures.length === 0, `cannot generate source discovery: ${failures.join(", ")}`);

  return {
    schema: "nexusengine.goldrush.cloud-source-discovery.v1",
    importJobId: handoff.importJobId,
    generatedAt,
    generatedFrom: {
      sourceAccessProof: sourceAccessPath,
      cloudTransferHandoff: handoffPath,
      method: sourceAccess.method,
      localCloneCreated: sourceAccess.localCloneCreated,
    },
    source: {
      nameWithOwner: sourceAccess.source.nameWithOwner,
      branch: sourceAccess.source.branch,
      commitSha: sourceAccess.source.headSha,
      roots,
    },
    notes: [
      "This receipt is generated from source-access proof only.",
      "It proves source identity for the raw-copy branch, not copied files.",
      "The remaining deny scan, secret scan, copy ledger, hash manifest, and classification receipts must land with raw candidates.",
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createCloudSourceDiscoveryReport({
    sourceAccessPath: args.sourceAccessPath ?? defaultSourceAccessPath,
    handoffPath: args.handoffPath ?? defaultHandoffPath,
    generatedAt: args.generatedAt ?? new Date().toISOString(),
  });
  const serialized = `${JSON.stringify(report, null, 2)}\n`;

  if (args.out) {
    const outPath = normalizeRepoPath(args.out);
    const receiptPath = reportPathFromHandoff(args.handoffPath ?? defaultHandoffPath);
    if (outPath === receiptPath && !args.allowReceiptWrite) {
      throw new Error(`refusing to write required receipt path ${receiptPath} without --allow-receipt-write`);
    }
    mkdirSync(dirname(join(repoRoot, outPath)), { recursive: true });
    writeFileSync(join(repoRoot, outPath), serialized);
    console.log(JSON.stringify({ status: "cloud-source-discovery-written", path: outPath }, null, 2));
  } else {
    process.stdout.write(serialized);
  }
}

function readJson(relPath) {
  const safePath = normalizeRepoPath(relPath);
  const fullPath = join(repoRoot, safePath);
  assert(existsSync(fullPath), `missing json file: ${safePath}`);
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

function reportPathFromHandoff(handoffPath) {
  const handoff = readJson(handoffPath);
  return normalizeRepoPath(handoff.destinationFolders?.sourceDiscoveryReport);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--source-access") args.sourceAccessPath = argv[++index];
    else if (arg === "--handoff") args.handoffPath = argv[++index];
    else if (arg === "--generated-at") args.generatedAt = argv[++index];
    else if (arg === "--out") args.out = argv[++index];
    else if (arg === "--allow-receipt-write") args.allowReceiptWrite = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

function normalizeRepoPath(value) {
  assert(typeof value === "string" && value.length > 0, "path is required");
  assert(!value.startsWith("/"), `absolute path is not allowed: ${value}`);
  assert(!value.includes("\\"), `backslash path is not allowed: ${value}`);
  assert(!value.includes("\0"), "null byte path is not allowed");
  assert(!value.split("/").includes(".."), `path traversal is not allowed: ${value}`);
  assert(!/^(https?:|data:|blob:|file:|\/\/)/i.test(value), `url path is not allowed: ${value}`);
  return value;
}

function isCommitSha(value) {
  return typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
