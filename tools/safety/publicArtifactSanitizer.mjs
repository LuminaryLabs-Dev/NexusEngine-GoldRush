import { mkdirSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const defaultRepoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const accountEmailPattern = /(?<![/\\\w.+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?!(?:fbx|glb|gltf|obj|dae|blend|webm|mov|mp4|m4v|png|jpg|jpeg|wav|mp3|ogg|json|md|txt)\b)[A-Z]{2,}\b/gi;

const secretPatterns = [
  /github_pat_[A-Za-z0-9_]+/g,
  /gh[pousr]_[A-Za-z0-9_]+/g,
  /xox[baprs]-[A-Za-z0-9-]+/g,
  /AKIA[0-9A-Z]{16}/g,
  /([?&](?:access_token|refresh_token|id_token|client_secret|api[_-]?key|token|key|secret|password)=)[^&#\s"'`)]+/gi,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\b(password|secret|token|api[_-]?key)\b\s*[:=]\s*["'][^"']+["']/gi,
];

export const publicLeakPatterns = [
  { kind: "home-path", pattern: /\/Users\/[^"\s,;)`]+/g },
  { kind: "private-var-path", pattern: /\/private\/var\/folders\/[^"\s,;)`]+/g },
  { kind: "var-folders-path", pattern: /\/var\/folders\/[^"\s,;)`]+/g },
  { kind: "chrome-profile-path", pattern: /(?:Chrome|Google\/Chrome)[^"\n`]*(?:Default|Profile\s*\d|admin@)[^"\n`]*/gi },
  { kind: "account-email", pattern: accountEmailPattern },
  ...secretPatterns.map((pattern) => ({ kind: "secret-like-value", pattern })),
];

export function sanitizePublicArtifact(value, options = {}) {
  if (Array.isArray(value)) return value.map((entry) => sanitizePublicArtifact(entry, options));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeArtifactValue(key, entry, options)]),
    );
  }
  if (typeof value === "string") return sanitizeTextForOutput(value, options);
  return value;
}

export function sanitizeArtifactValue(key, value, options = {}) {
  if (typeof value === "string" && /(path|file|dir|screenshot|snapshot|artifact|report|markdown|trace|video|root|profile)$/i.test(key)) {
    return sanitizePathForOutput(value, options);
  }
  return sanitizePublicArtifact(value, options);
}

export function sanitizePathForOutput(filePath, options = {}) {
  if (!filePath) return filePath;
  const repoRoot = options.repoRoot ?? defaultRepoRoot;
  const value = String(filePath);

  if (value.startsWith("file://")) {
    try {
      return sanitizePathForOutput(fileURLToPath(value), options);
    } catch {
      return sanitizeTextForOutput(value, options);
    }
  }

  if (!path.isAbsolute(value)) return sanitizeTextForOutput(value.split(path.sep).join("/"), options);

  const repoRelative = path.relative(repoRoot, value);
  if (!repoRelative.startsWith("..") && !path.isAbsolute(repoRelative)) {
    return repoRelative.split(path.sep).join("/");
  }

  const githubRoot = path.resolve(repoRoot, "..");
  const githubRelative = path.relative(githubRoot, value);
  if (!githubRelative.startsWith("..") && !path.isAbsolute(githubRelative)) {
    return `<github>/${githubRelative.split(path.sep).join("/")}`;
  }

  const homeDocuments = path.join(process.env.HOME ?? "", "Documents");
  if (homeDocuments && value.startsWith(homeDocuments)) {
    return `<documents>/${path.relative(homeDocuments, value).split(path.sep).join("/")}`;
  }

  if (value.includes("/var/folders/")) return `<tmp>/${path.basename(value)}`;
  return `<path>/${path.basename(value)}`;
}

export function sanitizeTextForOutput(text, options = {}) {
  if (!text) return text;
  return String(text)
    .replace(/\/Users\/[^"\s,;)`]+/g, (match) => sanitizePathForOutput(match, options))
    .replace(/\/private\/var\/folders\/[^"\s,;)`]+/g, (match) => `<tmp>/${path.basename(match)}`)
    .replace(/\/var\/folders\/[^"\s,;)`]+/g, (match) => `<tmp>/${path.basename(match)}`)
    .replace(/(?:Chrome|Google\/Chrome)[^"\n`]*(?:Default|Profile\s*\d|admin@)[^"\n`]*/gi, "<browser-profile>")
    .replace(accountEmailPattern, "<account-email>")
    .replace(/([?&](?:access_token|refresh_token|id_token|client_secret|api[_-]?key|token|key|secret|password)=)[^&#\s"'`)]+/gi, "$1<redacted>")
    .replace(/\b(password|secret|token|api[_-]?key)\b\s*[:=]\s*["'][^"']+["']/gi, "$1=<redacted>")
    .replace(/github_pat_[A-Za-z0-9_]+/g, "<redacted-github-token>")
    .replace(/gh[pousr]_[A-Za-z0-9_]+/g, "<redacted-github-token>")
    .replace(/xox[baprs]-[A-Za-z0-9-]+/g, "<redacted-slack-token>")
    .replace(/AKIA[0-9A-Z]{16}/g, "<redacted-aws-access-key>")
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "<redacted-private-key>");
}

export function findPublicArtifactLeaks(text) {
  const failures = [];
  for (const { kind, pattern } of publicLeakPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      failures.push({ kind, sample: match[0].slice(0, 120) });
      if (match.index === pattern.lastIndex) pattern.lastIndex += 1;
    }
  }
  return failures;
}

export async function writeSanitizedJsonArtifact(filePath, value, options = {}) {
  const publicArtifact = sanitizePublicArtifact(value, options);
  await writeFile(filePath, `${JSON.stringify(publicArtifact, null, 2)}\n`);
  return publicArtifact;
}

export async function writeSanitizedTextArtifact(filePath, value, options = {}) {
  const publicText = sanitizeTextForOutput(value, options);
  await writeFile(filePath, publicText);
  return publicText;
}

export function writeSanitizedJsonArtifactSync(filePath, value, options = {}) {
  const publicArtifact = sanitizePublicArtifact(value, options);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(publicArtifact, null, 2)}\n`);
  return publicArtifact;
}

export function writeSanitizedTextArtifactSync(filePath, value, options = {}) {
  const publicText = sanitizeTextForOutput(value, options);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, publicText);
  return publicText;
}

export function sanitizedConsoleJson(value, options = {}) {
  return JSON.stringify(sanitizePublicArtifact(value, options), null, 2);
}
