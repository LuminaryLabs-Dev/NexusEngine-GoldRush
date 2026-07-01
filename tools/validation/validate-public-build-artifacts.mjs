import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { findPublicArtifactLeaks } from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const distRoot = path.join(repoRoot, "dist");
const failures = [];

const deniedDistPathParts = [
  "/raw/",
  "/quarantine/",
  "/sanitized/",
  "/reports/",
  "/.agent/",
  "/.nexus-simulator/",
];

const deniedTextPatterns = [
  { kind: "raw-import-path", pattern: /\braw\/imported\//g },
  { kind: "raw-root-path", pattern: /(?:^|[^A-Za-z0-9_-])raw\//g },
  { kind: "quarantine-path", pattern: /\bquarantine\//g },
  { kind: "sanitized-conversion-path", pattern: /\bsanitized\/(?:converted|registry)\//g },
  { kind: "public-prefix-runtime-path", pattern: /\bpublic\/assets\//g },
  { kind: "file-url", pattern: /\bfile:\/\//g },
  { kind: "traversal-path", pattern: /(?:^|["'`(])\.\.\/(?:raw|sanitized|quarantine|reports|manifests)\//g },
  { kind: "encoded-source-path", pattern: /(?:raw|sanitized|quarantine|reports)%2[fF]/g },
];

if (!existsSync(distRoot)) {
  fail("dist", "missing-dist-build-output");
} else {
  scan(distRoot);
}

if (failures.length > 0) {
  console.error("public build artifact validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.kind}${failure.sample ? ` (${failure.sample})` : ""}`);
  }
  process.exit(1);
}

console.log(JSON.stringify({
  status: "public-build-artifacts-sanitized",
  scannedRoot: "dist",
  policy: "dist-exposes-approved-public-assets-only",
}, null, 2));

function scan(filePath) {
  const info = statSync(filePath);
  const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
  const normalized = `/${relativePath}/`;

  if (deniedDistPathParts.some((part) => normalized.includes(part))) {
    fail(relativePath, "source-only-folder-copied-to-dist");
    if (info.isDirectory()) return;
  }

  if (info.isDirectory()) {
    for (const entry of readdirSync(filePath)) {
      scan(path.join(filePath, entry));
    }
    return;
  }

  if (!isTextArtifact(filePath)) return;

  const text = readFileSync(filePath, "utf8");
  for (const leak of findPublicArtifactLeaks(text)) {
    if (isGeneratedQueryParameterCode(leak)) continue;
    if (isBundledThirdPartyConstant(leak)) continue;
    fail(relativePath, leak.kind, leak.sample);
  }

  for (const { kind, pattern } of deniedTextPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      fail(relativePath, kind, match[0].slice(0, 120));
      if (match.index === pattern.lastIndex) pattern.lastIndex += 1;
    }
  }
}

function isTextArtifact(filePath) {
  return /\.(html|js|css|json|svg|txt|xml|webmanifest)$/i.test(filePath);
}

function isGeneratedQueryParameterCode(leak) {
  if (leak.kind !== "secret-like-value") return false;
  const sample = leak.sample ?? "";
  return sample.includes("${") || sample.includes('"+') || sample.includes("'+") || sample.includes("+");
}

function isBundledThirdPartyConstant(leak) {
  const sample = leak.sample ?? "";
  if (leak.kind === "chrome-profile-path") {
    return !sample.includes("/") && !sample.includes("\\") && !/(?:Profile\s*\d|admin@|(?:^|[\\/])Default(?:[\\/]|$))/i.test(sample);
  }
  if (leak.kind === "account-email") {
    return sample === "team@peerjs.com";
  }
  return false;
}

function fail(file, kind, sample = "") {
  failures.push({ file, kind, sample });
}
