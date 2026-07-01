import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { findPublicArtifactLeaks } from "../safety/publicArtifactSanitizer.mjs";

const root = new URL("../..", import.meta.url).pathname;
const scannedRoots = [".agent", "docs", "manifests", "output", "reports"];
const publicArtifactRoots = new Set(scannedRoots);
const tokenPatterns = [
  /github_pat_[A-Za-z0-9_]+/g,
  /gh[pousr]_[A-Za-z0-9_]+/g,
  /xox[baprs]-[A-Za-z0-9-]+/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\b(password|secret|token|api[_-]?key)\b\s*[:=]\s*["'][^"']+["']/gi,
];

const failures = [];
for (const dir of scannedRoots) {
  const absolute = join(root, dir);
  if (existsSync(absolute)) scan(absolute, { enforcePublicSanitization: publicArtifactRoots.has(dir) });
}

if (failures.length > 0) {
  console.error("report secret validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.kind}`);
  }
  process.exit(1);
}

console.log("report secrets passed");

function scan(filePath, options) {
  const info = statSync(filePath);
  if (info.isDirectory()) {
    for (const entry of readdirSync(filePath)) {
      scan(join(filePath, entry), options);
    }
    return;
  }

  if (!isTextArtifact(filePath)) return;

  const text = readFileSync(filePath, "utf8");
  for (const pattern of tokenPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      failures.push({ file: relative(root, filePath), kind: pattern.source });
    }
  }

  if (options.enforcePublicSanitization) {
    for (const leak of findPublicArtifactLeaks(text)) {
      failures.push({ file: relative(root, filePath), kind: leak.kind });
    }
  }
}

function isTextArtifact(filePath) {
  return /\.(json|md|txt|yml|yaml|csv|log)$/i.test(filePath);
}
