import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const manifestPath = path.join(repoRoot, "manifests/asset-candidates/free-toon-candidates.json");
const allowedLocalPrefix = "external/free-toon-candidates/goldrush-free-toon-001/";
const failures = [];

expect(existsSync(manifestPath), "missing-free-toon-candidate-manifest");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
expect(manifest.manifestId === "goldrush.free-toon-candidates", "invalid-manifest-id");
expect(manifest.schema === "nexusengine.goldrush.free-toon-candidates.v1", "invalid-manifest-schema");
expect(manifest.status === "source-candidates-only", "manifest-must-remain-source-candidates-only");
expect(manifest.policy?.runtimePromotion === false, "manifest-runtime-promotion-must-be-false");
expect(manifest.policy?.publicPromotion === false, "manifest-public-promotion-must-be-false");
expect((manifest.styleDirection ?? "").includes("toon"), "style-direction-must-mention-toon");

const packs = new Map();
for (const pack of manifest.packs ?? []) {
  expect(typeof pack.packId === "string" && pack.packId.length > 0, "pack-missing-id");
  expect(!packs.has(pack.packId), `duplicate-pack:${pack.packId}`);
  packs.set(pack.packId, pack);
  expect(pack.license === "CC0-1.0", `${pack.packId}:license-must-be-cc0`);
  expect(pack.sourcePage?.startsWith("https://"), `${pack.packId}:source-page-must-be-https`);
  expect(pack.downloadUrl?.startsWith("https://"), `${pack.packId}:download-url-must-be-https`);
  expect(isSha256(pack.sourceZipSha256), `${pack.packId}:invalid-source-zip-hash`);
  validateEvidencePath(pack.licenseEvidencePath, `${pack.packId}:license-evidence`);
}

expect(packs.size === 2, "expected-two-imported-packs");
validateCandidates(manifest.modelCandidates ?? [], "model");
validateCandidates(manifest.audioCandidates ?? [], "audio");

expect((manifest.modelCandidates ?? []).length === 16, "expected-sixteen-model-candidates");
expect((manifest.audioCandidates ?? []).length === 6, "expected-six-audio-candidates");
expect((manifest.deferredCandidates ?? []).length >= 3, "expected-deferred-design-candidates");

if (failures.length > 0) {
  console.error("free toon candidate validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  status: "free-toon-candidates-ready-for-review",
  packs: packs.size,
  modelCandidates: manifest.modelCandidates.length,
  audioCandidates: manifest.audioCandidates.length,
  runtimePromotion: false,
}, null, 2));

function validateCandidates(candidates, kind) {
  const seen = new Set();
  for (const candidate of candidates) {
    const label = candidate.id ?? `${kind}:missing-id`;
    expect(!seen.has(label), `duplicate-candidate:${label}`);
    seen.add(label);

    expect(packs.has(candidate.packId), `${label}:unknown-pack`);
    expect(candidate.license === "CC0-1.0", `${label}:license-must-be-cc0`);
    expect(isSha256(candidate.sha256), `${label}:invalid-hash`);
    expect(Number.isInteger(candidate.bytes) && candidate.bytes > 100, `${label}:invalid-bytes`);
    validateEvidencePath(candidate.localPath, `${label}:local-path`);
    expect(candidate.localPath.endsWith(kind === "model" ? ".glb" : ".ogg"), `${label}:unexpected-extension`);

    const absolute = path.join(repoRoot, candidate.localPath);
    const info = statSync(absolute);
    expect(info.size === candidate.bytes, `${label}:byte-size-mismatch`);
    expect(hashFile(absolute) === candidate.sha256, `${label}:hash-mismatch`);

    const protokit = candidate.protokit ?? {};
    expect(protokit.domainPath === "n:goldrush:free-toon-candidate-protokit", `${label}:invalid-domain-path`);
    expect(typeof protokit.targetDomain === "string" && protokit.targetDomain.startsWith("n:"), `${label}:missing-target-domain`);
    expect(typeof protokit.itemDomain === "string" && protokit.itemDomain.length > 0, `${label}:missing-item-domain`);
    expect(typeof protokit.placementStrategy === "string" && protokit.placementStrategy.length > 0, `${label}:missing-placement-strategy`);
    expect(protokit.promotionState === "candidate-only", `${label}:protokit-must-stay-candidate-only`);

    if (kind === "model") {
      expect(protokit.kitType?.includes("model-candidate"), `${label}:model-kit-type-invalid`);
      expect(protokit.shaderIntent?.startsWith("toon-"), `${label}:model-must-declare-toon-shader-intent`);
    } else {
      expect(protokit.kitType === "audio-cue-candidate", `${label}:audio-kit-type-invalid`);
      expect(protokit.targetDomain === "n:audio:cue-state", `${label}:audio-target-domain-invalid`);
      expect(protokit.placementStrategy === "semantic-cue-state", `${label}:audio-placement-must-be-semantic`);
      expect(typeof protokit.cueSlot === "string" && protokit.cueSlot.startsWith("goldrush.audio."), `${label}:missing-cue-slot`);
    }

    const promotion = candidate.promotion ?? {};
    expect(promotion.runtimePromotion === false, `${label}:runtime-promotion-must-be-false`);
    expect(promotion.publicPromotion === false, `${label}:public-promotion-must-be-false`);
    expect(promotion.approvedRuntimePath === null, `${label}:approved-runtime-path-must-be-null`);
    expect(!("runtimePath" in candidate), `${label}:runtime-path-field-forbidden`);
  }
}

function validateEvidencePath(relativePath, label) {
  expect(typeof relativePath === "string" && relativePath.startsWith(allowedLocalPrefix), `${label}:path-must-stay-under-free-toon-candidates`);
  expect(!relativePath.includes(".."), `${label}:path-must-not-traverse`);
  expect(!relativePath.startsWith("public/"), `${label}:path-must-not-be-public`);
  expect(!relativePath.startsWith("raw/"), `${label}:path-must-not-be-raw`);
  expect(!relativePath.startsWith("sanitized/"), `${label}:path-must-not-be-sanitized`);
  expect(existsSync(path.join(repoRoot, relativePath)), `${label}:file-missing`);
}

function hashFile(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}
