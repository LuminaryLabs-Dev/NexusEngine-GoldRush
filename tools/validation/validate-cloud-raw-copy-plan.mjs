import { readFileSync } from "node:fs";
import path from "node:path";
import { assetRegistry } from "../../src/content/assetRegistry.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const planPath = path.join(repoRoot, "reports/provenance/goldrush-dual-source-001-raw-copy-plan.json");
const inventoryPath = path.join(repoRoot, "reports/provenance/goldrush-dual-source-001-candidate-inventory.json");
const plan = JSON.parse(readFileSync(planPath, "utf8"));
const inventory = JSON.parse(readFileSync(inventoryPath, "utf8"));
const failures = [];

const runtimeSlotIds = new Set([
  ...assetRegistry.assets.map((asset) => asset.id),
  ...assetRegistry.presentation.scenes.map((scene) => scene.id),
  ...assetRegistry.presentation.audio.map((audio) => audio.id),
  ...assetRegistry.presentation.animations.map((animation) => animation.id),
]);
const inventoryByPath = new Map(
  (inventory.domains ?? []).flatMap((domain) => domain.candidates.map((candidate) => [candidate.path, candidate]))
);

expect(plan.schema === "nexusengine.goldrush.cloud-raw-copy-plan.v1", "invalid-schema");
expect(plan.importJobId === "goldrush-dual-source-001", "wrong-import-job");
expect(plan.generatedFrom?.method === "metadata-plan-no-local-clone-no-file-content", "wrong-generation-method");
expect(plan.generatedFrom?.localCloneCreated === false, "must-not-use-local-clone");
expect(plan.source?.commitSha === inventory.source?.commitSha, "source-commit-mismatch");
expect(plan.destination?.rawRoot === `raw/imported/${plan.importJobId}/`, "raw-root-mismatch");
expect((plan.domains ?? []).length === 4, "expected-four-domains");

let selectedFiles = 0;
let deferredSlots = 0;
let selectedBytes = 0;
const selectedRawPaths = new Set();
for (const domain of plan.domains ?? []) {
  expect(domain.selectedCount === (domain.selected ?? []).length, `selected-count-mismatch:${domain.id}`);
  expect(domain.deferredCount === (domain.deferred ?? []).length, `deferred-count-mismatch:${domain.id}`);
  expect(domain.selectedCount > 0, `domain-has-no-selected-files:${domain.id}`);
  for (const entry of domain.selected ?? []) {
    expect(runtimeSlotIds.has(entry.slotId), `selected-slot-not-runtime:${domain.id}:${entry.slotId}`);
    expect(isSafeSourcePath(entry.sourcePath), `unsafe-source-path:${domain.id}:${entry.sourcePath}`);
    expect(entry.targetRawPath === `raw/imported/${plan.importJobId}/${entry.sourcePath}`, `target-raw-path-mismatch:${domain.id}:${entry.sourcePath}`);
    expect(!selectedRawPaths.has(entry.targetRawPath), `duplicate-target-raw-path:${entry.targetRawPath}`);
    selectedRawPaths.add(entry.targetRawPath);
    const inventoryCandidate = inventoryByPath.get(entry.sourcePath);
    expect(Boolean(inventoryCandidate), `selected-source-not-in-inventory:${entry.sourcePath}`);
    if (inventoryCandidate) {
      expect(entry.blobSha === inventoryCandidate.blobSha, `blob-sha-mismatch:${entry.sourcePath}`);
      expect(entry.sizeBytes === inventoryCandidate.sizeBytes, `size-mismatch:${entry.sourcePath}`);
      expect(entry.extension === inventoryCandidate.extension, `extension-mismatch:${entry.sourcePath}`);
    }
    expect(Array.isArray(entry.promoteOnlyAfter) && entry.promoteOnlyAfter.includes("human-review"), `missing-human-review:${entry.sourcePath}`);
    expect(entry.promoteOnlyAfter.includes("copy-ledger") && entry.promoteOnlyAfter.includes("hash-manifest"), `missing-receipt-gates:${entry.sourcePath}`);
    selectedFiles += 1;
    selectedBytes += entry.sizeBytes;
  }
  for (const deferred of domain.deferred ?? []) {
    expect(runtimeSlotIds.has(deferred.slotId), `deferred-slot-not-runtime:${domain.id}:${deferred.slotId}`);
    expect(typeof deferred.reason === "string" && deferred.reason.length > 10, `deferred-missing-reason:${domain.id}:${deferred.slotId}`);
    deferredSlots += 1;
  }
}
expect(plan.totals?.selectedFiles === selectedFiles, "selected-files-total-mismatch");
expect(plan.totals?.deferredSlots === deferredSlots, "deferred-slots-total-mismatch");
expect(plan.totals?.selectedBytes === selectedBytes, "selected-bytes-total-mismatch");
expect(selectedFiles >= 25, "first-plan-too-small");
expect(deferredSlots > 0, "deferred-slots-should-be-explicit");

const serialized = JSON.stringify(plan);
expect(!serialized.match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i), "plan-contains-secret-like-value");
expect(!serialized.includes("content\":\""), "plan-must-not-contain-file-content");

assert(failures.length === 0, `cloud raw copy plan invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "cloud-raw-copy-plan-ready",
  importJobId: plan.importJobId,
  sourceCommitSha: plan.source.commitSha,
  domains: plan.domains.length,
  selectedFiles,
  deferredSlots,
  selectedBytes,
}, null, 2));

function isSafeSourcePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("\0")
    && !value.split("/").includes("..")
    && !/^(https?:|data:|blob:|file:|\/\/)/i.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
