import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const scannedRoots = ["docs", "manifests", "reports"];
const tokenPatterns = [
  /github_pat_[A-Za-z0-9_]+/g,
  /gh[pousr]_[A-Za-z0-9_]+/g,
  /xox[baprs]-[A-Za-z0-9-]+/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
];

const failures = [];
for (const dir of scannedRoots) {
  const absolute = join(root, dir);
  if (existsSync(absolute)) scan(absolute);
}

if (failures.length > 0) {
  console.error("report secret validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.kind}`);
  }
  process.exit(1);
}

console.log("report secrets passed");

function scan(path) {
  const info = statSync(path);
  if (info.isDirectory()) {
    for (const entry of readdirSync(path)) {
      scan(join(path, entry));
    }
    return;
  }

  const text = readFileSync(path, "utf8");
  for (const pattern of tokenPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      failures.push({ file: relative(root, path), kind: pattern.source });
    }
  }
}
