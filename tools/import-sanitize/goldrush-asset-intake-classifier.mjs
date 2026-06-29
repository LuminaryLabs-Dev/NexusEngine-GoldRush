import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

export const intakeClassifierVersion = "0.1.0";
export const intakeClassifierSchema = "nexusengine.goldrush.asset-intake-classification.v1";

const deniedFragments = [
  "/Packages/manifest.json",
  "/Packages/packages-lock.json",
  "/ProjectSettings/",
  "/UserSettings/",
  "/Library/",
  "/Temp/",
  "/Obj/",
  "/Logs/",
  "/Build/",
  "/Builds/",
  "/Assets/Photon/",
  "/Assets/Photon",
  "/Assets/Plugins/",
  "/PhotonAppSettings.asset",
];

const deniedSuffixes = [".csproj", ".sln", ".env", ".npmrc", ".upmconfig.toml"];
const allowedExtensions = new Set([
  ".anim",
  ".asset",
  ".controller",
  ".fbx",
  ".glb",
  ".gltf",
  ".jpeg",
  ".jpg",
  ".mat",
  ".mp3",
  ".ogg",
  ".png",
  ".prefab",
  ".unity",
  ".wav",
  ".webp",
]);

const secretPatterns = [
  { id: "github-token", pattern: /github_pat_|gh[pousr]_/i },
  { id: "aws-access-key", pattern: /AKIA[0-9A-Z]{16}/ },
  { id: "private-key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { id: "secret-key-name", pattern: /\b(password|secret|token|api[_-]?key|app[_-]?id)\b\s*[:=]/i },
  { id: "credential-url", pattern: /https?:\/\/[^/\s:@]+:[^@\s]+@/i },
];

const slotRules = [
  { slotId: "goldrush.scene.mainMenu", mediaKind: "scene-reference", handling: "extract-layout-json", patterns: [/mainmenu/i] },
  { slotId: "goldrush.scene.lobby", mediaKind: "scene-reference", handling: "extract-layout-json", patterns: [/\/lobby\.unity$/i] },
  { slotId: "goldrush.scene.arena", mediaKind: "scene-reference", handling: "extract-layout-json", patterns: [/\/arena\.unity$/i] },
  { slotId: "goldrush.scene.legacyGame", mediaKind: "scene-reference", handling: "extract-layout-json", patterns: [/\/game\.unity$/i] },
  { slotId: "goldrush.scene.legacySinglePlayer", mediaKind: "scene-reference", handling: "extract-layout-json", patterns: [/game_singleplayer/i] },
  { slotId: "goldrush.player.prospector", mediaKind: "character", handling: "convert-or-retarget-to-glb", patterns: [/player/i, /prospector/i, /skeleton/i] },
  { slotId: "goldrush.weapon.revolver", mediaKind: "weapon", handling: "convert-to-glb", patterns: [/revolver/i, /pistol/i, /gun/i] },
  { slotId: "goldrush.vehicle.train", mediaKind: "vehicle", handling: "convert-to-glb", patterns: [/trainentity/i, /\/train(?!car)/i] },
  { slotId: "goldrush.vehicle.trainCar", mediaKind: "vehicle", handling: "convert-to-glb", patterns: [/traincar/i, /train car/i] },
  { slotId: "goldrush.prop.goldPile", mediaKind: "resource-node", handling: "convert-to-glb", patterns: [/goldpile/i, /pile o'? gold/i, /gold[_ -]?pile/i] },
  { slotId: "goldrush.currency.coin01", mediaKind: "currency", handling: "convert-to-glb", patterns: [/coin[_ -]?0?1/i, /coin/i] },
  { slotId: "goldrush.prop.cactus01", mediaKind: "flora", handling: "convert-to-glb", patterns: [/cactus[_ -]?0?1/i] },
  { slotId: "goldrush.prop.cactus02", mediaKind: "flora", handling: "convert-to-glb", patterns: [/cactus[_ -]?0?2/i] },
  { slotId: "goldrush.prop.fence01", mediaKind: "prop", handling: "convert-to-glb", patterns: [/fence[_ -]?0?1/i, /fence/i] },
  { slotId: "goldrush.anim.player.aimIdle", mediaKind: "animation", handling: "retarget-animation-clip", patterns: [/aim.*idle/i, /aimidle/i] },
  { slotId: "goldrush.anim.player.shooting", mediaKind: "animation", handling: "retarget-animation-clip", patterns: [/shoot/i, /fire/i] },
  { slotId: "goldrush.audio.music.wandering", mediaKind: "music", handling: "convert-to-browser-audio", patterns: [/wandering/i, /explor/i, /ambient/i] },
  { slotId: "goldrush.audio.music.combat", mediaKind: "music", handling: "convert-to-browser-audio", patterns: [/combat/i, /fight/i] },
  { slotId: "goldrush.audio.music.boss", mediaKind: "music", handling: "convert-to-browser-audio", patterns: [/boss/i] },
  { slotId: "goldrush.audio.sfx.revolverShot", mediaKind: "sfx", handling: "convert-to-browser-audio", patterns: [/revolver.*shot/i, /gun.*shot/i, /shoot/i, /goldshotsound/i] },
  { slotId: "goldrush.audio.sfx.goldPickup", mediaKind: "sfx", handling: "convert-to-browser-audio", patterns: [/gold.*pickup/i, /pickup/i] },
  { slotId: "goldrush.audio.sfx.cashout", mediaKind: "sfx", handling: "convert-to-browser-audio", patterns: [/cashout/i, /cash.*out/i] },
];

export function createGoldRushAssetIntakeReport({
  importJobId = "goldrush-dual-source-001",
  rootPath = `raw/imported/${importJobId}`,
  files = null,
  readFileText = null,
  generatedAt = "STATIC_VALIDATION_TIMESTAMP",
} = {}) {
  const discoveredFiles = files ?? discoverFiles(rootPath);
  const report = {
    schema: intakeClassifierSchema,
    version: intakeClassifierVersion,
    importJobId,
    status: "waiting-for-raw-import",
    rootPath,
    generatedAt,
    rules: {
      localCodexMayCloneSourceRepos: false,
      printsSecretValues: false,
      promotesWithoutHumanReview: false,
      allowedExtensions: [...allowedExtensions].sort(),
    },
    totals: {
      files: discoveredFiles.length,
      candidates: 0,
      blocked: 0,
      needsConversion: 0,
      secretFindings: 0,
      unmapped: 0,
    },
    candidates: [],
    blocked: [],
    unmapped: [],
  };

  for (const file of discoveredFiles) {
    const record = classifyGoldRushImportedFile(file, { readFileText });
    if (record.status === "blocked") {
      report.blocked.push(record);
      report.totals.blocked += 1;
      if (record.reason === "secret-finding") {
        report.totals.secretFindings += record.findingTypes?.length ?? 0;
      }
      continue;
    }
    if (record.status === "candidate") {
      report.candidates.push(record);
      report.totals.candidates += 1;
      if (record.needsConversion) report.totals.needsConversion += 1;
      continue;
    }
    report.unmapped.push(record);
    report.totals.unmapped += 1;
  }

  if (report.totals.blocked > 0) report.status = "blocked";
  else if (report.totals.candidates > 0) report.status = "candidates-ready-for-conversion-report";

  return report;
}

export function classifyGoldRushImportedFile(file, { readFileText = null } = {}) {
  const path = normalizePath(typeof file === "string" ? file : file.path);
  const sizeBytes = typeof file === "object" && Number.isFinite(file.sizeBytes) ? file.sizeBytes : null;
  const sourceHash = typeof file === "object" && file.sourceHash ? file.sourceHash : null;
  const extension = extname(path).toLowerCase();
  const pathBlock = findPathBlock(path);
  if (pathBlock) return blocked(path, "denied-path", [pathBlock], { sizeBytes, sourceHash });

  const text = typeof file === "object" && typeof file.text === "string"
    ? file.text
    : readFileText?.(path);
  const findingTypes = typeof text === "string" ? detectSecretFindingTypes(text) : [];
  if (findingTypes.length > 0) return blocked(path, "secret-finding", findingTypes, { sizeBytes, sourceHash });

  if (!allowedExtensions.has(extension)) {
    return {
      status: "unmapped",
      path,
      reason: "extension-not-in-import-allowlist",
      extension,
      sizeBytes,
      sourceHash,
    };
  }

  const slot = resolveSlot(path);
  if (!slot) {
    return {
      status: "unmapped",
      path,
      reason: "no-slot-rule-match",
      extension,
      sizeBytes,
      sourceHash,
    };
  }

  return {
    status: "candidate",
    path,
    slotId: slot.slotId,
    mediaKind: slot.mediaKind,
    handling: slot.handling,
    extension,
    needsConversion: needsConversion(extension, slot.mediaKind),
    promoteOnlyAfter: ["deny-path-scan", "secret-scan", "conversion-report", "license-provenance", "human-review"],
    sizeBytes,
    sourceHash,
  };
}

export function validateGoldRushAssetIntakeReport(report) {
  const failures = [];
  if (report?.schema !== intakeClassifierSchema) failures.push("invalid-schema");
  if (!report?.importJobId) failures.push("missing-import-job-id");
  if (report?.rules?.localCodexMayCloneSourceRepos !== false) failures.push("local-clone-rule-missing");
  if (report?.rules?.printsSecretValues !== false) failures.push("secret-print-rule-missing");
  if (report?.rules?.promotesWithoutHumanReview !== false) failures.push("human-review-rule-missing");

  const allRecords = [
    ...(report?.candidates ?? []),
    ...(report?.blocked ?? []),
    ...(report?.unmapped ?? []),
  ];
  allRecords.forEach((record) => {
    if (!record.path) failures.push("record-missing-path");
    if (record.path?.startsWith("/") || record.path?.includes("..")) failures.push(`unsafe-record-path:${record.path}`);
    if (record.path?.includes("\\")) failures.push(`windows-separator-path:${record.path}`);
  });
  (report?.candidates ?? []).forEach((candidate) => {
    if (!candidate.slotId) failures.push(`candidate-missing-slot:${candidate.path}`);
    if (!Array.isArray(candidate.promoteOnlyAfter) || !candidate.promoteOnlyAfter.includes("human-review")) {
      failures.push(`candidate-missing-human-review:${candidate.path}`);
    }
  });
  (report?.blocked ?? []).forEach((record) => {
    if (!record.reason) failures.push(`blocked-missing-reason:${record.path}`);
    if (JSON.stringify(record).match(/github_pat_|gh[pousr]_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY/i)) {
      failures.push(`blocked-record-prints-secret-value:${record.path}`);
    }
  });
  const totals = report?.totals ?? {};
  if (totals.files !== allRecords.length) failures.push("total-files-mismatch");
  if (totals.candidates !== (report?.candidates ?? []).length) failures.push("total-candidates-mismatch");
  if (totals.blocked !== (report?.blocked ?? []).length) failures.push("total-blocked-mismatch");
  if (totals.unmapped !== (report?.unmapped ?? []).length) failures.push("total-unmapped-mismatch");
  return { passed: failures.length === 0, failures };
}

export function discoverFiles(rootPath) {
  if (!existsSync(rootPath)) return [];
  const files = [];
  walk(rootPath);
  return files;

  function walk(path) {
    const info = statSync(path);
    if (info.isDirectory()) {
      for (const entry of readdirSync(path)) walk(join(path, entry));
      return;
    }
    const rel = normalizePath(relative(rootPath, path));
    if (rel === ".gitkeep") return;
    const bytes = readFileSync(path);
    files.push({
      path: rel,
      sizeBytes: info.size,
      sourceHash: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
      text: readTextIfSmall(path, bytes),
    });
  }
}

function readTextIfSmall(path, bytes) {
  if (bytes.length > 1024 * 1024) return null;
  const extension = extname(path).toLowerCase();
  const textLike = [".anim", ".asset", ".controller", ".cs", ".json", ".mat", ".meta", ".prefab", ".txt", ".unity", ".xml", ".yaml", ".yml"];
  if (!textLike.includes(extension)) return null;
  return bytes.toString("utf8");
}

function findPathBlock(path) {
  if (deniedFragments.some((fragment) => path.includes(fragment))) return "blocked-unity-or-plugin-path";
  if (deniedSuffixes.some((suffix) => path.endsWith(suffix))) return "blocked-config-or-project-file";
  return null;
}

function detectSecretFindingTypes(text) {
  return secretPatterns.filter((entry) => entry.pattern.test(text)).map((entry) => entry.id);
}

function resolveSlot(path) {
  const extension = extname(path).toLowerCase();
  const audioExtensions = new Set([".mp3", ".ogg", ".wav"]);
  const orderedRules = audioExtensions.has(extension)
    ? [
        ...slotRules.filter((rule) => ["music", "sfx"].includes(rule.mediaKind)),
        ...slotRules.filter((rule) => !["music", "sfx"].includes(rule.mediaKind)),
      ]
    : slotRules;
  return orderedRules.find((rule) => rule.patterns.some((pattern) => pattern.test(path))) ?? null;
}

function needsConversion(extension, mediaKind) {
  if (mediaKind === "scene-reference") return true;
  if (["music", "sfx"].includes(mediaKind)) return ![".mp3", ".ogg", ".wav"].includes(extension);
  if (mediaKind === "animation") return true;
  return ![".glb", ".gltf", ".png", ".jpg", ".jpeg", ".webp"].includes(extension);
}

function blocked(path, reason, findingTypes, { sizeBytes = null, sourceHash = null } = {}) {
  return {
    status: "blocked",
    path,
    reason,
    findingTypes,
    sizeBytes,
    sourceHash,
  };
}

function normalizePath(path) {
  return path.split(sep).join("/");
}
