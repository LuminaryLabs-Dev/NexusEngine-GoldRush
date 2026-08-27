import fs from "node:fs/promises";
import { DEFAULT_WORLD_PREVIEW_PRESETS, WORLD_PREVIEW_CAMERA_PRESETS } from "../../src/dev/world-preview/cameraPresets.js";

const failures = [];
const presets = Object.values(WORLD_PREVIEW_CAMERA_PRESETS);
if (!presets.length) failures.push("missing-camera-presets");
if (WORLD_PREVIEW_CAMERA_PRESETS.isometric?.projection !== "orthographic") failures.push("isometric-must-be-orthographic");
if (new Set(presets.map((entry) => entry.id)).size !== presets.length) failures.push("duplicate-camera-preset-id");
if (DEFAULT_WORLD_PREVIEW_PRESETS.some((id) => !WORLD_PREVIEW_CAMERA_PRESETS[id])) failures.push("default-preset-missing");
for (const camera of presets) {
  if (!Array.isArray(camera.position) || camera.position.length !== 3 || camera.position.some((value) => !Number.isFinite(value))) failures.push(`invalid-position:${camera.id}`);
  if (!Array.isArray(camera.target) || camera.target.length !== 3 || camera.target.some((value) => !Number.isFinite(value))) failures.push(`invalid-target:${camera.id}`);
  if (!camera.purpose) failures.push(`missing-purpose:${camera.id}`);
}
const productionEntry = await fs.readFile(new URL("../../src/main.js", import.meta.url), "utf8");
if (productionEntry.includes("world-preview")) failures.push("world-preview-imported-by-production-main");
const html = await fs.readFile(new URL("../../dev/world-preview.html", import.meta.url), "utf8");
if (!html.includes("/src/dev/world-preview/main.js")) failures.push("preview-html-missing-entry");

if (failures.length) {
  console.error(JSON.stringify({ passed: false, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, presetCount: presets.length, isometric: WORLD_PREVIEW_CAMERA_PRESETS.isometric }, null, 2));
