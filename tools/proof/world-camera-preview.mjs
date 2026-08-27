import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { DEFAULT_WORLD_PREVIEW_PRESETS, WORLD_PREVIEW_CAMERA_PRESETS } from "../../src/dev/world-preview/cameraPresets.js";

const root = process.cwd();
const outputDir = path.resolve(root, "artifacts/world-camera-preview");
const phase = readArg("--phase") ?? "prospect";
const singlePreset = readArg("--preset");
if (singlePreset && !WORLD_PREVIEW_CAMERA_PRESETS[singlePreset]) {
  throw new Error(`Unknown world preview camera preset: ${singlePreset}`);
}
const presets = singlePreset ? [singlePreset] : DEFAULT_WORLD_PREVIEW_PRESETS;
const port = Number(readArg("--port") ?? 4178);
const baseUrl = readArg("--base-url") ?? `http://127.0.0.1:${port}`;
const ownsServer = !readArg("--base-url");
let server = null;
let browser = null;

try {
  await fs.mkdir(outputDir, { recursive: true });
  if (ownsServer) {
    server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "--host", "127.0.0.1", "--port", String(port)], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });
    await waitForServer(`${baseUrl}/dev/world-preview.html`);
  }

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  const captures = [];
  for (const preset of presets) {
    const url = `${baseUrl}/dev/world-preview.html?camera=${encodeURIComponent(preset)}&phase=${encodeURIComponent(phase)}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.GoldRushWorldPreview?.ready === true);
    const metadata = await page.evaluate(() => ({
      camera: window.GoldRushWorldPreview.camera,
      world: window.GoldRushWorldPreview.world,
    }));
    const file = path.join(outputDir, `${phase}-${preset}.png`);
    await page.screenshot({ path: file });
    captures.push({ preset, phase, file: path.relative(root, file), metadata });
  }
  await fs.writeFile(path.join(outputDir, `${phase}-manifest.json`), `${JSON.stringify({ phase, captures }, null, 2)}\n`);
  console.log(`Captured ${captures.length} Gold Rush world camera preview(s) in ${path.relative(root, outputDir)}.`);
} finally {
  if (browser) await browser.close();
  if (server) server.kill("SIGTERM");
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

async function waitForServer(url) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`World preview server did not become ready: ${url}`);
}
