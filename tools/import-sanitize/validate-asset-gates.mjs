import { existsSync, readFileSync } from "node:fs";
import { sanitizeTextForOutput } from "../safety/publicArtifactSanitizer.mjs";

const registryPath = new URL("../../sanitized/registry/assets.json", import.meta.url);

if (!existsSync(registryPath)) {
  console.log(publicText("asset gate: no sanitized registry yet; cloud import still pending"));
  process.exit(0);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const assets = Array.isArray(registry.assets) ? registry.assets : [];

if (registry.schema === "nexusengine.goldrush.sanitized-registry.v1" && registry.publicPromotion === false) {
  const invalidSanitized = assets.filter((asset) => {
    return !asset.slotId
      || !asset.sourcePath
      || !asset.sourceHash
      || !asset.outputPath
      || !asset.outputHash
      || asset.promotionReady !== false
      || typeof asset.conversionStatus !== "string";
  });

  if (invalidSanitized.length > 0) {
    console.error(publicText(`asset gate failed: ${invalidSanitized.length} sanitized candidates lack required non-promotion fields`));
    process.exit(1);
  }

  console.log(publicText(`asset gate passed: 0 promoted assets; ${assets.length} sanitized candidates pending review`));
  process.exit(0);
}

const invalid = assets.filter((asset) => {
  return !asset.id || !asset.sourceHash || !asset.outputHash || !asset.provenance || !asset.approvalId;
});

if (invalid.length > 0) {
  console.error(publicText(`asset gate failed: ${invalid.length} promoted assets lack required provenance fields`));
  process.exit(1);
}

console.log(publicText(`asset gate passed: ${assets.length} promoted assets`));

function publicText(value) {
  return sanitizeTextForOutput(value);
}
