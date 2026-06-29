import { createRawCopyWorkerSummary } from "../import-sanitize/copy-raw-plan-from-github.mjs";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const fetchProofPath = path.join(repoRoot, "reports/provenance/goldrush-dual-source-001-raw-copy-worker-fetch-proof.json");

const summary = createRawCopyWorkerSummary();
const failures = [];

expect(summary.importJobId === "goldrush-dual-source-001", "wrong-import-job");
expect(summary.source?.nameWithOwner === "thecrimsondeveloper/Gold_Rush", "wrong-source-repo");
expect(summary.source?.commitSha === "144230e32b537336c83407b4ddae83cdc95c1c9e", "wrong-source-commit");
expect(summary.destinationRepo === "LuminaryLabs-Dev/NexusEngine-GoldRush", "wrong-destination-repo");
expect(summary.rawImportBranch === "import/goldrush-dual-source-001-raw", "wrong-raw-import-branch");
expect(summary.rawRoot === "raw/imported/goldrush-dual-source-001/", "wrong-raw-root");
expect(summary.totals?.selectedFiles === 31, "selected-file-count-mismatch");
expect(summary.totals?.selectedBytes === 42215234, "selected-byte-count-mismatch");
expect(summary.totals?.deferredSlots === 8, "deferred-slot-count-mismatch");
expect((summary.domains ?? []).length === 4, "domain-count-mismatch");
for (const domain of summary.domains ?? []) {
  expect(domain.selectedCount > 0, `domain-has-no-selected-files:${domain.id}`);
}

if (existsSync(fetchProofPath)) {
  const proof = JSON.parse(readFileSync(fetchProofPath, "utf8"));
  expect(proof.status === "raw-copy-worker-fetched-plan", "fetch-proof-wrong-status");
  expect(proof.write === false, "fetch-proof-must-not-write");
  expect(proof.fetch === true, "fetch-proof-must-fetch");
  expect(proof.importJobId === summary.importJobId, "fetch-proof-job-mismatch");
  expect(proof.totals?.selectedFiles === summary.totals.selectedFiles, "fetch-proof-selected-files-mismatch");
  expect(proof.totals?.selectedBytes === summary.totals.selectedBytes, "fetch-proof-selected-bytes-mismatch");
  expect(proof.totals?.deferredSlots === summary.totals.deferredSlots, "fetch-proof-deferred-slots-mismatch");
  expect(proof.receiptCounts?.copiedFiles === 31, "fetch-proof-copied-count-mismatch");
  expect(proof.receiptCounts?.hashFiles === 31, "fetch-proof-hash-count-mismatch");
  expect(proof.receiptCounts?.classificationRecords === 31, "fetch-proof-classification-count-mismatch");
  expect(proof.receiptCounts?.secretFindings === 0, "fetch-proof-secret-findings");
}

if (failures.length > 0) {
  throw new Error(`raw copy worker invalid: ${failures.join(", ")}`);
}

console.log(JSON.stringify({
  status: "raw-copy-worker-ready",
  importJobId: summary.importJobId,
  rawImportBranch: summary.rawImportBranch,
  domains: summary.domains.length,
  selectedFiles: summary.totals.selectedFiles,
  selectedBytes: summary.totals.selectedBytes,
  deferredSlots: summary.totals.deferredSlots,
  fetchProof: existsSync(fetchProofPath),
}, null, 2));

function expect(condition, message) {
  if (!condition) failures.push(message);
}
