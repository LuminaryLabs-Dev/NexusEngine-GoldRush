import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const ignoredRoots = new Set([".git", "node_modules", "dist", ".vite"]);
const deniedPathFragments = [
  `${sep}Packages${sep}manifest.json`,
  `${sep}Packages${sep}packages-lock.json`,
  `${sep}ProjectSettings${sep}`,
  `${sep}UserSettings${sep}`,
  `${sep}Library${sep}`,
  `${sep}Temp${sep}`,
  `${sep}Obj${sep}`,
  `${sep}Logs${sep}`,
  `${sep}Build${sep}`,
  `${sep}Builds${sep}`,
  `${sep}Assets${sep}Photon${sep}`,
  `${sep}Assets${sep}Plugins${sep}`,
  `${sep}PhotonAppSettings.asset`,
];
const deniedSuffixes = [".csproj", ".sln", ".upmconfig.toml", ".npmrc", ".env"];

const failures = [];
scan(root);

if (failures.length > 0) {
  console.error("import boundary validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("import boundaries passed");

function scan(path) {
  const name = path.split(sep).at(-1);
  if (ignoredRoots.has(name)) return;

  const info = statSync(path);
  if (info.isDirectory()) {
    for (const entry of readdirSync(path)) {
      scan(join(path, entry));
    }
    return;
  }

  const normalized = path.split("/").join(sep);
  const relativePath = relative(root, path);
  if (deniedPathFragments.some((fragment) => normalized.includes(fragment))) {
    failures.push(relativePath);
  }

  if (deniedSuffixes.some((suffix) => relativePath.endsWith(suffix))) {
    failures.push(relativePath);
  }
}
