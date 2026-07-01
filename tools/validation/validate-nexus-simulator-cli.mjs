import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const cliPath = path.join(repoRoot, "tools/simulator/goldrush-nexus-sim.mjs");
const appPath = path.join(repoRoot, "src/app/goldRushApp.js");
const packagePath = path.join(repoRoot, "package.json");
const gitignorePath = path.join(repoRoot, ".gitignore");

assert(existsSync(cliPath), "goldrush nexus simulator CLI is missing");

const discoveryRaw = execFileSync(process.execPath, [cliPath, "discover"], {
  cwd: repoRoot,
  encoding: "utf8",
});
const discovery = JSON.parse(discoveryRaw);

assert(discovery.status === "found", "NexusSimulator discovery should pass");
assert(discovery.packageName === "nexus-simulator", "discovered package should be nexus-simulator");
assert(discovery.cliPath.endsWith("src/cli.js"), "sanitized simulator CLI label should point at src/cli.js");
assert(!discoveryRaw.includes("/Users/"), "discover output should not expose absolute user paths");
assert(!discoveryRaw.includes(repoRoot), "discover output should not expose the absolute repo root");
assert(discovery.root.startsWith("<github>/") || !path.isAbsolute(discovery.root), "discover root should be a label, not an absolute path");

const cliSource = readFileSync(cliPath, "utf8");
assert(cliSource.includes("scenario check"), "CLI should check simulator scenario compatibility before running");
assert(cliSource.includes("scenario run"), "CLI should run the simulator scenario");
assert(cliSource.includes("nexusrealtime"), "CLI should target the NexusRealtime simtime");
assert(cliSource.includes("waitForGameHost"), "scenario should wait for the GameHost bridge");
assert(cliSource.includes("advanceNexusRealtime"), "scenario should advance simulated runtime time");
assert(cliSource.includes(".nexus-simulator"), "CLI should write simulator state under .nexus-simulator");
assert(cliSource.includes("sanitizeRepoPath"), "CLI should sanitize repo artifact paths in JSON output");
assert(cliSource.includes("sanitizeExternalPath"), "CLI should sanitize external tool paths in run output");
assert(cliSource.includes("sanitizePublicArtifact"), "CLI should sanitize all JSON command output by default");
assert(cliSource.includes("sanitizeTextForOutput"), "CLI should sanitize error and help text by default");
assert(cliSource.includes("artifacts: (output.artifacts ?? []).map(sanitizeRepoPath)"), "CLI should sanitize simulator artifact output paths");
assert(!cliSource.includes("/Users/"), "CLI source should not retain absolute local fallback paths");

const appSource = readFileSync(appPath, "utf8");
assert(appSource.includes("window.GameHost = createNexusSimulatorGameHost()"), "app should expose the NexusSimulator GameHost bridge");
assert(appSource.includes("getValidationState"), "GameHost bridge should expose validation state");
assert(appSource.includes("placeAtTrainDoor"), "GameHost bridge should support reliable train boarding setup");
assert(appSource.includes("syncSimulatorKeys"), "GameHost bridge should map simulator keys into the movement controller");

const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
assert(packageJson.scripts["sim:discover"] === "node tools/simulator/goldrush-nexus-sim.mjs discover", "package should expose sim:discover");
assert(packageJson.scripts["sim:test"] === "node tools/simulator/goldrush-nexus-sim.mjs run", "package should expose sim:test");
assert(packageJson.scripts.validate.includes("validate-nexus-simulator-cli.mjs"), "npm validate should include simulator CLI validation");

const gitignore = readFileSync(gitignorePath, "utf8");
assert(gitignore.includes(".nexus-simulator/"), ".nexus-simulator state should be ignored");

console.log(JSON.stringify({
  status: "nexus-simulator-cli-ready",
  simulatorRoot: discovery.root,
  outputPolicy: "sanitized-run-output",
  scripts: ["sim:discover", "sim:test"],
  scenarioState: ".nexus-simulator/",
  simtime: "nexusrealtime",
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
