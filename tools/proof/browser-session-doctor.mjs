import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
  sanitizePathForOutput,
  sanitizedConsoleJson,
  writeSanitizedJsonArtifact,
  writeSanitizedTextArtifact,
} from "../safety/publicArtifactSanitizer.mjs";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputRoot = path.resolve(args.out ?? "reports/browser-session-doctor");
const screenshotRoot = path.resolve(args.screenshots ?? "screenshots/browser-session-doctor");
const videoRoot = path.resolve(args.videos ?? "output/browser-session-doctor-videos");
const targetUrl = args.url ? withDoctorParam(String(args.url)) : null;
const timeoutMs = Number(args.timeout ?? 15000);
const hardTimeoutMs = Number(args.hardTimeout ?? timeoutMs * 3);
const headed = args.headed === "true" || args.headed === true;
const recordVideo = args.recordVideo === "true" || args.recordVideo === true;
const reportPath = path.join(outputRoot, `browser-session-doctor-${runId}.json`);
const markdownPath = path.join(outputRoot, `browser-session-doctor-${runId}.md`);

await mkdir(outputRoot, { recursive: true });
await mkdir(screenshotRoot, { recursive: true });
if (recordVideo) await mkdir(videoRoot, { recursive: true });

const report = {
  schema: "nexusengine.goldrush.browser-session-doctor.v1",
  status: "pending",
  startedAt: new Date().toISOString(),
  runId,
  targetUrl,
  proofOptions: {
    timeoutMs,
    hardTimeoutMs,
    recordVideo,
    headed,
  },
  steps: [],
  screenshots: [],
  videos: [],
  consoleErrors: [],
  pageErrors: [],
  diagnostics: {},
};

let browser;
let context;
let page;
let forceExitAfterReport = false;

try {
  await withTimeout(runDoctor(), hardTimeoutMs, "browser-session-doctor hard timeout");
  report.status = report.steps.every((step) => step.status === "passed" || step.status === "skipped")
    ? "passed"
    : "failed";
  if (report.status !== "passed") process.exitCode = 1;
} catch (error) {
  report.status = "failed";
  report.error = { message: error.message, stack: error.stack };
  forceExitAfterReport = error.message.includes("browser-session-doctor hard timeout");
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await closeContextAndBrowser();
  const publicReport = await writeSanitizedJsonArtifact(reportPath, report, { repoRoot });
  await writeSanitizedTextArtifact(markdownPath, renderMarkdown(publicReport), { repoRoot });
  console.log(sanitizedConsoleJson({
    status: publicReport.status,
    report: sanitizePathForOutput(reportPath, { repoRoot }),
    markdown: sanitizePathForOutput(markdownPath, { repoRoot }),
    screenshots: publicReport.screenshots,
    videos: publicReport.videos,
    diagnostics: publicReport.diagnostics,
    error: publicReport.error?.message ?? null,
  }, { repoRoot }));
  if (forceExitAfterReport) process.exit(process.exitCode || 1);
}

async function runDoctor() {
  await step("launch-browser", async () => {
    browser = await chromium.launch({ headless: !headed });
    report.diagnostics.browserConnectedAfterLaunch = browser.isConnected();
  });

  await step("create-context", async () => {
    const contextOptions = {
      viewport: { width: 960, height: 540 },
      deviceScaleFactor: 1,
    };
    if (recordVideo) {
      contextOptions.recordVideo = { dir: path.join(videoRoot, runId), size: { width: 960, height: 540 } };
    }
    context = await browser.newContext(contextOptions);
  });

  await step("create-page", async () => {
    page = await context.newPage();
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        report.consoleErrors.push({ type: message.type(), text: message.text() });
      }
    });
    page.on("pageerror", (error) => {
      report.pageErrors.push(error.message);
    });
  });

  await step("local-data-url-screenshot", async () => {
    await page.goto(dataUrl(), { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await page.locator("[data-doctor-ready]").waitFor({ state: "visible", timeout: timeoutMs });
    const dimensions = await page.evaluate(() => ({
      title: document.title,
      width: window.innerWidth,
      height: window.innerHeight,
      readyText: document.querySelector("[data-doctor-ready]")?.textContent ?? null,
    }));
    report.diagnostics.localDataUrl = dimensions;
    await capture("01-local-data-url");
  });

  await step(targetUrl ? "target-url-screenshot" : "target-url-screenshot", async () => {
    if (!targetUrl) {
      report.steps.push({ name: "target-url-screenshot", status: "skipped", durationMs: 0, reason: "no --url provided" });
      return;
    }
    const response = await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await page.waitForLoadState("networkidle", { timeout: Math.min(timeoutMs, 8000) }).catch(() => {});
    report.diagnostics.target = {
      status: response?.status() ?? null,
      ok: response?.ok() ?? null,
      title: await page.title().catch(() => null),
      url: page.url(),
      hasGoldRushHost: await page.evaluate(() => Boolean(window.GoldRushHost)).catch(() => false),
    };
    await capture("02-target-url");
  });

  await step("close-context", async () => {
    const video = page.video();
    await withTimeout(context.close(), timeoutMs, "context.close");
    if (video) {
      report.videos.push(sanitizePathForOutput(await withTimeout(video.path(), timeoutMs, "video.path"), { repoRoot }));
    } else if (!recordVideo) {
      report.diagnostics.videoSkipped = "recordVideo=false";
    }
    context = null;
    page = null;
  });

  await step("close-browser", async () => {
    await withTimeout(browser.close(), timeoutMs, "browser.close");
    report.diagnostics.browserConnectedAfterClose = browser.isConnected();
    browser = null;
  });
}

async function closeContextAndBrowser() {
  if (context) {
    await withTimeout(context.close(), 5000, "final.context.close")
      .catch((error) => {
        report.diagnostics.finalContextCloseError = error.message;
      });
    context = null;
  }
  if (browser) {
    await withTimeout(browser.close(), 5000, "final.browser.close")
      .catch((error) => {
        report.diagnostics.finalBrowserCloseError = error.message;
      });
    browser = null;
  }
}

async function step(name, callback) {
  const startedAt = Date.now();
  try {
    await withTimeout(callback(), timeoutMs + 5000, `step:${name}`);
    if (!report.steps.some((entry) => entry.name === name && entry.status === "skipped")) {
      report.steps.push({ name, status: "passed", durationMs: Date.now() - startedAt });
    }
  } catch (error) {
    report.steps.push({ name, status: "failed", durationMs: Date.now() - startedAt, error: error.message });
    throw error;
  }
}

async function capture(name) {
  const file = path.join(screenshotRoot, `${name}-${runId}.png`);
  await page.screenshot({ path: file, fullPage: false, timeout: timeoutMs });
  report.screenshots.push(sanitizePathForOutput(file, { repoRoot }));
}

function withTimeout(promise, durationMs, label) {
  if (!promise) return Promise.resolve(null);
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${durationMs}ms`)), durationMs);
    timer.unref?.();
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function dataUrl() {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>GoldRush Browser Doctor</title>
    <style>
      html, body { margin: 0; height: 100%; background: #16232b; color: #f6f0df; font-family: system-ui, sans-serif; }
      main { display: grid; min-height: 100%; place-items: center; }
      section { border: 1px solid #f0b84a; padding: 24px; background: #24343b; }
    </style>
  </head>
  <body>
    <main>
      <section data-doctor-ready="true">GoldRush browser doctor ready</section>
    </main>
  </body>
</html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

function withDoctorParam(url) {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("browserDoctor", runId);
  return nextUrl.toString();
}

function renderMarkdown(nextReport) {
  const steps = nextReport.steps.map((entry) => {
    const suffix = entry.reason ? ` - ${entry.reason}` : entry.error ? ` - ${entry.error}` : "";
    return `- ${entry.status}: ${entry.name} (${entry.durationMs}ms)${suffix}`;
  }).join("\n");
  const screenshots = nextReport.screenshots.map((file) => `- ${file}`).join("\n") || "- none";
  const videos = nextReport.videos.map((file) => `- ${file}`).join("\n") || "- none";
  return `# GoldRush Browser Session Doctor

Status: ${nextReport.status}

Target URL: ${nextReport.targetUrl ?? "not provided"}

## Steps

${steps}

## Diagnostics

\`\`\`json
${JSON.stringify(nextReport.diagnostics, null, 2)}
\`\`\`

## Screenshots

${screenshots}

## Videos

${videos}
`;
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) continue;
    const [key, inlineValue] = arg.slice(2).split("=");
    const value = inlineValue ?? (rawArgs[index + 1]?.startsWith("--") ? true : rawArgs[index + 1]);
    parsed[key] = value ?? true;
    if (inlineValue === undefined && value !== true) index += 1;
  }
  return parsed;
}
