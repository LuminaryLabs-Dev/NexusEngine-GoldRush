import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const checkedRoots = ["tools/proof", "tools/simulator"];
const checkedValidationFiles = [
  "tools/validation/validate-live-playtest.mjs",
];
const checkedImportSanitizeFiles = collectFiles(path.join(repoRoot, "tools/import-sanitize"))
  .map((absoluteFile) => path.relative(repoRoot, absoluteFile).split(path.sep).join("/"))
  .sort();
const failures = [];

for (const relativeRoot of checkedRoots) {
  const absoluteRoot = path.join(repoRoot, relativeRoot);
  if (!existsSync(absoluteRoot)) continue;
  scan(absoluteRoot);
}
for (const relativeFile of checkedImportSanitizeFiles) {
  const absoluteFile = path.join(repoRoot, relativeFile);
  if (!existsSync(absoluteFile)) continue;
  validateImportSanitizeTool(relativeFile, readFileSync(absoluteFile, "utf8"));
}
for (const relativeFile of checkedValidationFiles) {
  const absoluteFile = path.join(repoRoot, relativeFile);
  if (!existsSync(absoluteFile)) continue;
  validateSanitizedValidationTool(relativeFile, readFileSync(absoluteFile, "utf8"));
}

if (failures.length > 0) {
  console.error("sanitized artifact boundary validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.reason}`);
  }
  process.exit(1);
}

console.log(JSON.stringify({
  status: "sanitized-artifact-boundaries-ready",
  checkedRoots,
  checkedValidationFiles,
  checkedImportSanitizeFiles,
  policy: "proof-simulator-and-active-import-public-output-use-shared-sanitizer",
}, null, 2));

function scan(filePath) {
  const info = statSync(filePath);
  if (info.isDirectory()) {
    for (const entry of readdirSync(filePath)) {
      scan(path.join(filePath, entry));
    }
    return;
  }

  if (!/\.(mjs|js)$/i.test(filePath)) return;

  const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
  const source = readFileSync(filePath, "utf8");
  if (relativePath.startsWith("tools/proof/")) validateProofTool(relativePath, source);
  if (relativePath.startsWith("tools/simulator/")) validateSimulatorTool(relativePath, source);
}

function collectFiles(filePath) {
  if (!existsSync(filePath)) return [];
  const info = statSync(filePath);
  if (info.isDirectory()) {
    return readdirSync(filePath).flatMap((entry) => collectFiles(path.join(filePath, entry)));
  }
  if (!/\.(mjs|js)$/i.test(filePath)) return [];
  return [filePath];
}

function validateProofTool(file, source) {
  expect(file, source.includes("../safety/publicArtifactSanitizer.mjs"), "must import the shared public artifact sanitizer");
  expect(file, source.includes("writeSanitizedJsonArtifact"), "must write retained JSON reports through writeSanitizedJsonArtifact");
  expect(file, source.includes("sanitizedConsoleJson"), "must print public summaries through sanitizedConsoleJson");
  expect(file, !source.includes("writeFileSync("), "must not use raw writeFileSync for public proof artifacts");
  expect(file, !source.includes("console.log(JSON.stringify("), "must not print raw JSON summaries");

  if (source.includes("writeSanitizedTextArtifact")) {
    expect(file, source.includes("renderMarkdown(publicReport)") || source.includes("sanitizeTextForOutput"), "text artifacts must be rendered from sanitized report data or sanitized text");
  }

  if (source.includes("page.screenshot")) {
    expect(file, source.includes("sanitizePathForOutput"), "screenshot paths must be sanitized before entering reports or console output");
  }
}

function validateSimulatorTool(file, source) {
  expect(file, source.includes("../safety/publicArtifactSanitizer.mjs"), "must import the shared public artifact sanitizer");
  expect(file, source.includes("sanitizePublicArtifact(value, { repoRoot })"), "must sanitize all JSON command output by default");
  expect(file, source.includes("sanitizeTextForOutput(error.message"), "must sanitize CLI error output by default");
  expect(file, source.includes("sanitizePathForOutput"), "must sanitize repo and external artifact paths");

  const rawWrites = source.match(/writeFileSync\(([^,\n]+)/g) ?? [];
  const allowedInternalWrites = new Set(["writeFileSync(envPath", "writeFileSync(scenarioPath"]);
  for (const call of rawWrites) {
    expect(file, allowedInternalWrites.has(call), `raw write is allowed only for ignored .nexus-simulator state, found ${call}`);
  }

  expect(file, !source.includes("console.log(JSON.stringify(") || source.includes("sanitizePublicArtifact(value, { repoRoot })"), "raw JSON console output must be routed through sanitizer");
}

function validateSanitizedValidationTool(file, source) {
  expect(file, source.includes("../safety/publicArtifactSanitizer.mjs"), "must import the shared public artifact sanitizer");
  expect(file, source.includes("sanitizedConsoleJson"), "must print public summaries through sanitizedConsoleJson");
  expect(file, !source.includes("console.log(JSON.stringify("), "must not print raw JSON summaries");
  expect(file, !source.includes("console.error(JSON.stringify("), "must not print raw JSON errors");
}

function validateImportSanitizeTool(file, source) {
  const writesFiles = source.includes("writeFileSync(");
  const printsJson = source.includes("console.log(JSON.stringify(")
    || source.includes("console.error(JSON.stringify(")
    || source.includes("process.stdout.write(serialized");
  const writesJsonDirectly = /writeFileSync\([^;\n]+JSON\.stringify/s.test(source)
    || source.includes("writeFileSync(absolute, `${JSON.stringify")
    || source.includes("writeFileSync(absolutePath, `${JSON.stringify")
    || source.includes("writeFileSync(join(repoRoot, outPath), serialized");
  const createsJsonBuffers = source.includes("Buffer.from(`${JSON.stringify");
  const hasPublicOutput = writesFiles || source.includes("console.log(") || source.includes("console.error(") || source.includes("process.stdout.write(");
  if (!hasPublicOutput) return;

  expect(file, source.includes("../safety/publicArtifactSanitizer.mjs"), "must import the shared public artifact sanitizer");
  if (printsJson) {
    expect(file, source.includes("sanitizedConsoleJson"), "must print JSON summaries through sanitizedConsoleJson");
    expect(file, false, "must not print raw JSON summaries");
  }
  if (writesJsonDirectly) {
    expect(file, source.includes("writeSanitizedJsonArtifactSync"), "must write retained JSON reports through writeSanitizedJsonArtifactSync");
    expect(file, false, "must not write retained JSON with raw writeFileSync");
  }
  if (createsJsonBuffers) {
    expect(file, source.includes("writeSanitizedJsonArtifactSync"), "JSON buffer outputs must be sanitized at their write boundary");
  }
  if (source.includes("function writeJson")) {
    expect(file, source.includes("writeSanitizedJsonArtifactSync"), "writeJson helpers must use writeSanitizedJsonArtifactSync");
  }
  if (source.includes("function writeBytes") && createsJsonBuffers) {
    expect(file, source.includes('relPath.endsWith(".json")') || source.includes("writeSanitizedJsonArtifactSync(join(repoRoot"), "byte writers that receive JSON buffers must route .json outputs through the sanitizer");
  }
  if (source.includes("console.log(")) {
    expect(file, !source.includes("console.log(JSON.stringify("), "must not print raw JSON summaries");
  }
}

function expect(file, condition, reason) {
  if (!condition) failures.push({ file, reason });
}
