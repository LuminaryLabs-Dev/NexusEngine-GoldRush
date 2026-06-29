import { dirname, join, resolve } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importJobId = "goldrush-dual-source-001";
const defaultInventoryPath = `reports/provenance/${importJobId}-candidate-inventory.json`;
const defaultClassificationPath = `reports/asset-classification/${importJobId}-classification.json`;
const defaultOutPath = `reports/provenance/${importJobId}-remaining-coverage.json`;
const maxBatchFiles = 125;

export function createRemainingAssetCoverage({
  inventoryPath = defaultInventoryPath,
  classificationPath = defaultClassificationPath,
  generatedAt = new Date().toISOString(),
  write = false,
} = {}) {
  const inventory = readJson(inventoryPath);
  const classification = readJson(classificationPath);
  const copiedPaths = new Set((classification.candidates ?? []).map((candidate) => candidate.path));
  const uniqueInventory = createUniqueInventory(inventory);
  const failures = [];

  expect(inventory.schema === "nexusengine.goldrush.cloud-candidate-inventory.v1", "invalid-inventory-schema", failures);
  expect(classification.schema === "nexusengine.goldrush.asset-intake-classification.v1", "invalid-classification-schema", failures);
  expect(inventory.importJobId === importJobId, "wrong-inventory-job", failures);
  expect(classification.importJobId === importJobId, "wrong-classification-job", failures);
  expect((classification.blocked ?? []).length === 0, "copied-classification-has-blocked-records", failures);
  expect((classification.unmapped ?? []).length === 0, "copied-classification-has-unmapped-records", failures);

  const domains = (inventory.domains ?? []).map((domain) => {
    const copied = [];
    const remaining = [];
    for (const candidate of domain.candidates ?? []) {
      if (copiedPaths.has(candidate.path)) copied.push(createCoverageCandidate(candidate));
      else remaining.push(createCoverageCandidate(candidate));
    }
    return {
      id: domain.id,
      priority: domain.priority,
      inventoryReferences: domain.candidates.length,
      copiedReferences: copied.length,
      remainingReferences: remaining.length,
      copiedReferenceBytes: sumBytes(copied),
      remainingReferenceBytes: sumBytes(remaining),
      copied,
      remaining,
    };
  });

  const uniqueCopied = uniqueInventory.filter((candidate) => copiedPaths.has(candidate.sourcePath));
  const uniqueRemaining = uniqueInventory.filter((candidate) => !copiedPaths.has(candidate.sourcePath));
  const referenceCopiedTotal = domains.reduce((sum, domain) => sum + domain.copiedReferences, 0);
  const referenceRemainingTotal = domains.reduce((sum, domain) => sum + domain.remainingReferences, 0);

  expect(uniqueCopied.length === (classification.candidates ?? []).length, "unique-copied-count-mismatch", failures);
  expect(referenceCopiedTotal + referenceRemainingTotal === inventory.totals?.candidates, "coverage-reference-count-does-not-match-inventory", failures);
  expect(uniqueCopied.length + uniqueRemaining.length === uniqueInventory.length, "unique-coverage-count-mismatch", failures);

  const report = {
    schema: "nexusengine.goldrush.remaining-asset-coverage.v1",
    version: "0.1.0",
    importJobId,
    generatedAt,
    generatedFrom: {
      candidateInventory: inventoryPath,
      copiedClassification: classificationPath,
      method: "metadata-coverage-no-local-clone-no-file-content",
      localCloneCreated: false,
    },
    source: {
      nameWithOwner: inventory.source.nameWithOwner,
      branch: inventory.source.branch,
      commitSha: inventory.source.commitSha,
      treeTruncated: inventory.source.treeTruncated,
    },
    publicPromotion: false,
    runtimePromotion: false,
    rules: {
      writesRawFiles: false,
      writesSanitizedFiles: false,
      writesPublicAssets: false,
      promotesRuntimeAssets: false,
      requiresSixReceiptsForAnyFutureCopy: true,
      requiresHumanReviewBeforePromotion: true,
      noLocalLegacyClone: true,
    },
    totals: {
      inventoryReferences: inventory.totals.candidates,
      inventoryReferenceBytes: inventory.totals.totalSizeBytes,
      uniqueInventoryPaths: uniqueInventory.length,
      copiedUniquePaths: uniqueCopied.length,
      copiedUniqueBytes: sumBytes(uniqueCopied),
      remainingUniquePaths: uniqueRemaining.length,
      remainingUniqueBytes: sumBytes(uniqueRemaining),
      duplicateDomainReferences: inventory.totals.candidates - uniqueInventory.length,
      copiedPercentByUniquePathCount: roundPercent(uniqueCopied.length, uniqueInventory.length),
      copiedPercentByUniqueBytes: roundPercent(sumBytes(uniqueCopied), sumBytes(uniqueInventory)),
    },
    domains,
    nextCopyBatches: createNextCopyBatches(uniqueRemaining),
    noGoConditions: [
      "Do not copy files not present in this source commit inventory.",
      "Do not copy any path that matches denied project, package, plugin, credential, or generated-library folders.",
      "Do not promote raw or sanitized files to public runtime without license provenance and explicit human review.",
      "Do not treat metadata coverage as playable parity.",
      "Do not use a local clone of the legacy Unity repositories on this computer.",
      "Do not write public/assets or approved runtime records from this planning report.",
    ],
  };

  assert(failures.length === 0, `remaining coverage generation invalid: ${failures.join(", ")}`);

  if (write) writeJson(defaultOutPath, report);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const report = createRemainingAssetCoverage(args);
  console.log(JSON.stringify({
    status: "remaining-asset-coverage-ready",
    importJobId,
    write: args.write,
    out: args.write ? defaultOutPath : null,
    copiedCandidates: report.totals.copiedCandidates,
    remainingCandidates: report.totals.remainingUniquePaths,
    nextCopyBatches: report.nextCopyBatches.length,
  }, null, 2));
}

function createNextCopyBatches(uniqueRemaining) {
  const batches = [];
  let sequence = 1;
  const byDomain = new Map();
  for (const candidate of uniqueRemaining) {
    const list = byDomain.get(candidate.primaryDomainId) ?? [];
    list.push(candidate);
    byDomain.set(candidate.primaryDomainId, list);
  }
  const sortedDomains = [...byDomain.entries()].sort(([, aItems], [, bItems]) => aItems[0].primaryPriority - bItems[0].primaryPriority);
  for (const [domainId, domainItems] of sortedDomains) {
    const remaining = [...domainItems].sort(compareCandidatesForCopy);
    for (let index = 0; index < remaining.length; index += maxBatchFiles) {
      const items = remaining.slice(index, index + maxBatchFiles);
      batches.push({
        batchId: `${importJobId}.next.${String(sequence).padStart(3, "0")}.${domainId}`,
        domainId,
        priority: sequence,
        status: "planned-not-copied",
        itemCount: items.length,
        totalBytes: sumBytes(items),
        targetRawRoot: `raw/imported/${importJobId}/`,
        receiptRequirements: [
          "source-discovery",
          "deny-path-scan",
          "secret-scan",
          "copy-ledger",
          "hash-manifest",
          "classification",
        ],
        promotionBlockedBy: [
          "conversion-report",
          "license-provenance",
          "human-review",
          "approved-runtime-record",
        ],
        items: items.map((item) => ({
          sourcePath: item.sourcePath,
          blobSha: item.blobSha,
          sizeBytes: item.sizeBytes,
          extension: item.extension,
          referencedByDomains: item.referencedByDomains,
          targetRawPath: `raw/imported/${importJobId}/${item.sourcePath}`,
        })),
      });
      sequence += 1;
    }
  }
  return batches;
}

function createUniqueInventory(inventory) {
  const byPath = new Map();
  for (const domain of inventory.domains ?? []) {
    for (const candidate of domain.candidates ?? []) {
      const existing = byPath.get(candidate.path);
      if (!existing) {
        byPath.set(candidate.path, {
          ...createCoverageCandidate(candidate),
          primaryDomainId: domain.id,
          primaryPriority: domain.priority,
          referencedByDomains: [domain.id],
        });
        continue;
      }
      existing.referencedByDomains.push(domain.id);
      if (domain.priority < existing.primaryPriority) {
        existing.primaryDomainId = domain.id;
        existing.primaryPriority = domain.priority;
      }
    }
  }
  return [...byPath.values()].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
}

function createCoverageCandidate(candidate) {
  return {
    sourcePath: candidate.path,
    blobSha: candidate.blobSha,
    sizeBytes: candidate.sizeBytes,
    extension: candidate.extension,
    sourceRoot: candidate.sourceRoot,
    matchReasons: candidate.matchReasons,
  };
}

function compareCandidatesForCopy(a, b) {
  const extensionOrder = [".ogg", ".mp3", ".wav", ".png", ".jpg", ".jpeg", ".webp", ".prefab", ".anim", ".fbx", ".unity", ".mat", ".asset", ".controller"];
  const aIndex = extensionOrder.indexOf(a.extension);
  const bIndex = extensionOrder.indexOf(b.extension);
  const extensionDelta = (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  if (extensionDelta !== 0) return extensionDelta;
  return a.sourcePath.localeCompare(b.sourcePath);
}

function parseArgs(args) {
  return {
    write: args.includes("--write"),
  };
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const absolutePath = join(repoRoot, relativePath);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sumBytes(items) {
  return items.reduce((sum, item) => sum + item.sizeBytes, 0);
}

function roundPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 10000) / 100;
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
