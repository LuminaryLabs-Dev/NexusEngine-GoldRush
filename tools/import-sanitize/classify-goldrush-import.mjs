import {
  createGoldRushAssetIntakeReport,
  validateGoldRushAssetIntakeReport,
} from "./goldrush-asset-intake-classifier.mjs";
import {
  sanitizedConsoleJson,
  sanitizeTextForOutput,
} from "../safety/publicArtifactSanitizer.mjs";

const args = parseArgs(process.argv.slice(2));
const importJobId = args.job ?? "goldrush-dual-source-001";
const rootPath = args.root ?? `raw/imported/${importJobId}`;

const report = createGoldRushAssetIntakeReport({
  importJobId,
  rootPath,
  generatedAt: new Date().toISOString(),
});
const validation = validateGoldRushAssetIntakeReport(report);

if (!validation.passed) {
  console.error(sanitizeTextForOutput(`asset intake classifier failed: ${validation.failures.join(", ")}`));
  process.exit(1);
}

console.log(sanitizedConsoleJson(report));

if (report.status === "blocked") process.exit(2);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--job") parsed.job = argv[index + 1];
    if (arg === "--root") parsed.root = argv[index + 1];
    if (arg === "--job" || arg === "--root") index += 1;
  }
  return parsed;
}
