#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import {
  sanitizePathForOutput,
  sanitizePublicArtifact,
  sanitizeTextForOutput,
} from "../safety/publicArtifactSanitizer.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const documentsGitHubRoot = resolve(process.env.HOME ?? "", "Documents", "GitHub");
const simulatorStateRoot = resolve(repoRoot, ".nexus-simulator");
const defaultEnvName = "goldrush-local";
const defaultScenarioName = "goldrush-smoke";

const args = parseArgs(process.argv.slice(2));
const command = args._[0] ?? "run";

try {
  if (command === "discover") {
    printJson(discoverSimulator());
  } else if (command === "write-scenario") {
    printJson(writeGoldRushScenario({
      envName: args.env ?? defaultEnvName,
      scenarioName: args.scenario ?? defaultScenarioName,
      url: args.url ?? defaultGoldRushUrl(args.port),
    }));
  } else if (command === "run") {
    const result = await runGoldRushSimulator(args);
    printJson(result);
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(sanitizeTextForOutput(error.message, { repoRoot }));
  process.exitCode = 1;
}

async function runGoldRushSimulator(options = {}) {
  const simulator = discoverSimulator(options.simulatorRoot);
  const envName = options.env ?? defaultEnvName;
  const scenarioName = options.scenario ?? defaultScenarioName;
  const port = Number(options.port ?? 5179);
  const externalUrl = options.url ?? null;
  const url = externalUrl ?? defaultGoldRushUrl(port);
  const scenario = writeGoldRushScenario({ envName, scenarioName, url });
  let server = null;

  try {
    if (!externalUrl && options.server !== "false") {
      server = await startDevServer(port);
      await waitForHttp(url, Number(options.timeoutMs ?? 30000));
    }

    const check = await runNode(simulator.cliPath, ["scenario", "check", envName, scenarioName, "--simtime", "nexusrealtime"], {
      cwd: repoRoot,
    });
    if (check.status !== 0) {
      throw new Error(`NexusSimulator scenario check failed with status ${check.status}.\n${tailText(check.stdout + check.stderr)}`);
    }

    const run = await runNode(simulator.cliPath, ["scenario", "run", envName, scenarioName, "--simtime", "nexusrealtime"], {
      cwd: repoRoot,
    });
    if (run.status !== 0) {
      throw new Error(`NexusSimulator scenario run failed with status ${run.status}.\n${tailText(run.stdout + run.stderr)}`);
    }
    const output = extractFirstJsonObject(run.stdout);
    const failedChecks = (output.checks ?? []).filter((checkEntry) => checkEntry.passed !== true);
    if (output.status !== "passed" || failedChecks.length) {
      throw new Error(`NexusSimulator scenario reported failed checks: ${failedChecks.map((entry) => `${entry.name}:${entry.detail}`).join("; ") || output.status}`);
    }

    return {
      status: "passed",
      simulatorRoot: sanitizeExternalPath(simulator.root),
      envName,
      scenarioName,
      scenarioPath: sanitizeRepoPath(scenario.scenarioPath),
      url,
      artifactDir: scenario.artifactDir,
      checks: output.checks?.length ?? 0,
      artifacts: (output.artifacts ?? []).map(sanitizeRepoPath),
    };
  } finally {
    if (server && options.keepServer !== "true") {
      await stopProcess(server);
    }
  }
}

function writeGoldRushScenario({ envName, scenarioName, url }) {
  const envPath = resolve(simulatorStateRoot, "envs", `${encodeURIComponent(envName)}.json`);
  const scenarioDir = resolve(simulatorStateRoot, "scenarios", encodeURIComponent(envName));
  const scenarioPath = resolve(scenarioDir, `${encodeURIComponent(scenarioName)}.jsonl`);
  const artifactDir = `.nexus-simulator/artifacts/${envName}`;
  const env = {
    app: {
      appKind: "vite-three-game",
      attachedAppPath: repoRoot,
      artifactDir,
      detectedMode: "threejs",
      launchMode: "external-dev-server",
      selectedSimtime: "nexusrealtime",
    },
    createdAt: new Date().toISOString(),
    name: envName,
    simtime: "nexusrealtime",
  };
  const events = goldRushSmokeEvents(url);

  mkdirSync(dirname(envPath), { recursive: true });
  mkdirSync(scenarioDir, { recursive: true });
  writeFileSync(envPath, `${JSON.stringify(env, null, 2)}\n`);
  writeFileSync(scenarioPath, `${events.map((event) => JSON.stringify(event)).join("\n")}\n`);

  return {
    status: "scenario-written",
    envName,
    envPath: sanitizeRepoPath(envPath),
    scenarioName,
    scenarioPath: sanitizeRepoPath(scenarioPath),
    artifactDir,
    eventCount: events.length,
    url,
  };
}

function goldRushSmokeEvents(url) {
  return [
    { command: "openPage", args: { url, waitUntil: "domcontentloaded", timeoutMs: 30000 } },
    { command: "waitForSelector", args: { selector: '[data-action="play-title"]', timeoutMs: 15000 } },
    { command: "waitForGameHost", args: { timeoutMs: 15000 } },
    { command: "observeNexusRealtime", args: {} },
    { command: "assertNexusRealtimeState", args: { path: "screen", value: "start" } },
    { command: "actNexusRealtime", args: { input: { command: "playTitle" }, delta: 0.016 } },
    { command: "wait", args: { ms: 750 } },
    { command: "assertNexusRealtimeState", args: { path: "screen", value: "lobby" } },
    { command: "actNexusRealtime", args: { input: { command: "startMatch", players: 20, legacyModeId: "modernExtraction" }, delta: 0.016 } },
    { command: "wait", args: { ms: 1000 } },
    { command: "assertNexusRealtimeState", args: { path: "screen", value: "loading" } },
    { command: "actNexusRealtime", args: { input: { command: "placeAtTrainDoor" }, delta: 0.016 } },
    { command: "advanceNexusRealtime", args: { seconds: 7.5, fixedDt: 0.033333, input: {}, autopilot: false, renderEvery: 4 } },
    { command: "wait", args: { ms: 1000 } },
    { command: "observeNexusRealtime", args: {} },
    { command: "assertNexusRealtimeState", args: { path: "screen", value: "run" } },
    { command: "assertNexusRealtimeState", args: { path: "activeSite.id", value: "site.gold-field" } },
    { command: "assertNexusRealtimeState", args: { path: "scenario.players", value: 20 } },
    { command: "assertNexusRealtimeState", args: { path: "localPlayer.inputModel.id", value: "camera-relative-wasd" } },
    { command: "assertNexusRealtimeState", args: { path: "terrainPhysics.engine", value: "cannon-es" } },
    { command: "assertCanvasExists", args: {} },
    { command: "assertNoConsoleErrors", args: {} },
    { command: "captureScreenshot", args: { name: "goldrush-smoke.png", fullPage: false } },
    { command: "summarizeSession", args: {} },
    { command: "stopServer", args: {} },
  ];
}

function discoverSimulator(explicitRoot = null) {
  const candidates = [
    explicitRoot,
    process.env.NEXUS_SIMULATOR_ROOT,
    resolve(documentsGitHubRoot, "NexusSimulator", "NexusSimulator-V1"),
    resolve(repoRoot, "../NexusSimulator/NexusSimulator-V1"),
  ].filter(Boolean).map((candidate) => resolve(candidate));

  for (const root of candidates) {
    const packagePath = resolve(root, "package.json");
    const cliPath = resolve(root, "src/cli.js");
    if (!existsSync(packagePath) || !existsSync(cliPath)) continue;
    const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
    if (pkg.name !== "nexus-simulator") continue;
    return {
      status: "found",
      root,
      cliPath,
      packagePath,
      packageName: pkg.name,
      version: pkg.version,
      bin: pkg.bin,
    };
  }
  throw new Error(`NexusSimulator not found. Set NEXUS_SIMULATOR_ROOT or pass --simulator-root. Tried: ${candidates.join(", ")}`);
}

function defaultGoldRushUrl(port = 5179) {
  return `http://127.0.0.1:${Number(port)}/NexusEngine-GoldRush/?publicSmoke=1&nexusSim=1`;
}

function startDevServer(port) {
  const child = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: repoRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => {
    if (args.verbose === "true") process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    if (args.verbose === "true") process.stderr.write(chunk);
  });
  return child;
}

function runNode(scriptPath, scriptArgs, { cwd } = {}) {
  return new Promise((resolveRun) => {
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolveRun({ status, stdout, stderr }));
  });
}

function extractFirstJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) throw new Error(`NexusSimulator output did not include JSON.\n${tailText(text)}`);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) {
      return JSON.parse(text.slice(start, index + 1));
    }
  }
  throw new Error(`NexusSimulator output JSON was incomplete.\n${tailText(text)}`);
}

function tailText(text, max = 2000) {
  const value = String(text ?? "");
  return value.length <= max ? value : value.slice(-max);
}

async function waitForHttp(url, timeoutMs) {
  const startedAt = Date.now();
  let lastError = null;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 300));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError?.message ?? "no response"}`);
}

function stopProcess(child) {
  return new Promise((resolveStop) => {
    if (!child || child.exitCode !== null) {
      resolveStop();
      return;
    }
    child.once("close", () => resolveStop());
    child.kill("SIGTERM");
    setTimeout(resolveStop, 1500);
  });
}

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      parsed._.push(arg);
      continue;
    }
    const key = arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function printJson(value) {
  console.log(JSON.stringify(sanitizePublicArtifact(value, { repoRoot }), null, 2));
}

function sanitizeRepoPath(filePath) {
  return sanitizePathForOutput(filePath, { repoRoot });
}

function sanitizeExternalPath(filePath) {
  return sanitizePathForOutput(filePath, { repoRoot });
}

function usage() {
  console.log([
    "GoldRush NexusSimulator CLI",
    "",
    "Usage:",
    "  node tools/simulator/goldrush-nexus-sim.mjs discover",
    "  node tools/simulator/goldrush-nexus-sim.mjs write-scenario [--url <url>]",
    "  node tools/simulator/goldrush-nexus-sim.mjs run [--port 5179] [--url <existing-url>] [--keep-server true]",
    "",
    "Environment:",
    "  NEXUS_SIMULATOR_ROOT=<path-to-NexusSimulator-V1>",
  ].join("\n"));
}
