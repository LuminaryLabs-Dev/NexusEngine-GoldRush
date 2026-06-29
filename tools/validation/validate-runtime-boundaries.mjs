import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const runtimeRoots = ["src", "public/assets/manifests", "index.html", "vite.config.js"];
const deniedRuntimeReferences = [
  "raw/",
  "quarantine/",
  "sanitized/converted",
  "thecrimsondeveloper/Gold_Rush",
  "Packages/manifest.json",
  "PhotonAppSettings",
  "Assets/Photon",
  "Fusion",
  "DOTween",
  "Odin",
];

const failures = [];

for (const runtimeRoot of runtimeRoots) {
  const absolute = join(root, runtimeRoot);
  scanPath(absolute);
}

if (failures.length > 0) {
  console.error("runtime boundary validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.pattern}`);
  }
  process.exit(1);
}

console.log("runtime boundaries passed");

function scanPath(path) {
  const info = statSync(path);
  if (info.isDirectory()) {
    for (const entry of readdirSync(path)) {
      scanPath(join(path, entry));
    }
    return;
  }

  const text = readFileSync(path, "utf8");
  for (const pattern of deniedRuntimeReferences) {
    if (text.includes(pattern)) {
      failures.push({ file: relative(root, path), pattern });
    }
  }
}
