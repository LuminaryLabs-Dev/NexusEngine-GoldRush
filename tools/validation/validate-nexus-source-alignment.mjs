import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import * as NexusRealtime from "nexusrealtime";
import { createGenericRouteCargoExtractionKit } from "@luminarylabs/nexusrealtime-protokits/generic-route-cargo-extraction-kit";
import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  KIT_CONTRACT_FIELDS,
  genericIncubatorKitContracts,
  goldRushKitContracts,
} from "../../src/kits/generic-incubator/domainServiceKitCatalog.js";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const manifestPath = path.join(repoRoot, "manifests/source-docs/nexus-kit-source-alignment.json");
const packageLockPath = path.join(repoRoot, "package-lock.json");
const packageJsonPath = path.join(repoRoot, "package.json");
const failures = [];

assert(existsSync(manifestPath), "source alignment manifest missing");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const packageLock = JSON.parse(readFileSync(packageLockPath, "utf8"));
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

expect(manifest.schema === "nexusengine.goldrush.source-doc-alignment.v1", "invalid-source-alignment-schema");
expect(manifest.status === "active", "source-alignment-not-active");
expect((manifest.sourceDocs ?? []).length >= 5, "source-doc-alignment-needs-source-docs");
expect((manifest.principles ?? []).length >= 5, "source-doc-alignment-needs-principles");
expect((manifest.goldRushMappings ?? []).length >= manifest.principles.length, "source-doc-alignment-needs-goldrush-mappings");

validateDependencies();
validateSourceDocs();
validateLocalMappings();
validateKitContractGates();
validateRuntimeInstall();
validateProtoKitConstruct();
validateRendererBoundary();
validateGoalSync();
validateDocs();

assert(failures.length === 0, `nexus source alignment invalid: ${failures.join(", ")}`);

console.log(JSON.stringify({
  status: "nexus-source-alignment-ready",
  sourceDocs: manifest.sourceDocs.length,
  principles: manifest.principles.length,
  genericContracts: genericIncubatorKitContracts.length,
  goldRushContracts: goldRushKitContracts.length,
  runtimeInstall: "passed",
  protoKitConstruct: "generic-route-cargo-extraction-kit",
  goalSync: manifest.goalSync.path,
}, null, 2));

function validateDependencies() {
  expect(packageJson.dependencies?.nexusrealtime?.includes("LuminaryLabs-Dev/NexusRealtime"), "package-json-missing-nexusrealtime-git-dependency");
  expect(
    packageJson.dependencies?.["@luminarylabs/nexusrealtime-protokits"]?.includes("LuminaryLabs-Agents/NexusRealtime-ProtoKits"),
    "package-json-missing-protokits-git-dependency"
  );
}

function validateSourceDocs() {
  for (const sourceDoc of manifest.sourceDocs ?? []) {
    const label = sourceDoc.id ?? sourceDoc.path;
    const absolutePath = path.join(repoRoot, sourceDoc.path);
    expect(existsSync(absolutePath), `${label}:source-doc-missing`);
    if (!existsSync(absolutePath)) continue;

    const text = readFileSync(absolutePath, "utf8");
    expect(sha256(text) === sourceDoc.sha256, `${label}:source-doc-hash-changed`);
    for (const anchor of sourceDoc.requiredAnchors ?? []) {
      expect(text.includes(anchor), `${label}:missing-anchor:${anchor}`);
    }

    const packageFolder = path.join(repoRoot, "node_modules", sourceDoc.packageName);
    const packageInfoPath = path.join(packageFolder, "package.json");
    expect(existsSync(packageInfoPath), `${label}:package-json-missing`);
    if (existsSync(packageInfoPath)) {
      const packageInfo = JSON.parse(readFileSync(packageInfoPath, "utf8"));
      expect(packageInfo.version === sourceDoc.packageVersion, `${label}:package-version-mismatch`);
    }

    const lockEntry = packageLock.packages?.[`node_modules/${sourceDoc.packageName}`];
    expect(lockEntry?.version === sourceDoc.packageVersion, `${label}:lock-version-mismatch`);
    expect(lockEntry?.resolved?.includes(sourceDoc.lockCommit), `${label}:lock-commit-mismatch`);
  }
}

function validateLocalMappings() {
  const principleIds = new Set((manifest.principles ?? []).map((principle) => principle.id));
  for (const mapping of manifest.goldRushMappings ?? []) {
    expect(principleIds.has(mapping.principleId), `mapping-unknown-principle:${mapping.principleId}`);
    expect((mapping.files ?? []).length > 0, `mapping-missing-files:${mapping.principleId}`);
    for (const relativePath of mapping.files ?? []) {
      const absolutePath = path.join(repoRoot, relativePath);
      expect(existsSync(absolutePath), `mapping-path-missing:${relativePath}`);
    }
  }

  const validateScript = packageJson.scripts?.validate ?? "";
  expect(validateScript.includes("validate-domain-kit-contracts.mjs"), "validate-script-missing-domain-kit-contracts");
  expect(validateScript.includes("validate-runtime-kit-registry.mjs"), "validate-script-missing-runtime-kit-registry");
  expect(validateScript.includes("validate-nexus-source-alignment.mjs"), "validate-script-missing-source-alignment");
}

function validateKitContractGates() {
  for (const field of KIT_CONTRACT_FIELDS) {
    expect((manifest.kitGates ?? []).includes(field), `manifest-kit-gates-missing-contract-field:${field}`);
  }
  for (const gate of ["runtimeInstall", "protoKitConstruct"]) {
    expect((manifest.kitGates ?? []).includes(gate), `manifest-kit-gates-missing:${gate}`);
  }

  for (const contract of genericIncubatorKitContracts) {
    expect(contract.domainPath.startsWith("n:"), `generic-contract-domain-path-invalid:${contract.domainPath}`);
    expect(contract.graduationStatus === "local-incubation", `generic-contract-graduation-status-invalid:${contract.domainPath}`);
    expect(Array.isArray(contract.publicApi) && contract.publicApi.length > 0, `generic-contract-missing-public-api:${contract.domainPath}`);
    expect(Array.isArray(contract.events) && contract.events.length > 0, `generic-contract-missing-events:${contract.domainPath}`);
    expect(Array.isArray(contract.snapshot) && contract.snapshot.length > 0, `generic-contract-missing-snapshot:${contract.domainPath}`);
    expect(typeof contract.reset === "string" && contract.reset.length > 0, `generic-contract-missing-reset:${contract.domainPath}`);
    expect(!JSON.stringify(contract).toLowerCase().includes("goldrush"), `generic-contract-leaks-goldrush:${contract.domainPath}`);
  }

  for (const contract of goldRushKitContracts) {
    expect(contract.domainPath.startsWith("n:goldrush:"), `goldrush-contract-domain-path-invalid:${contract.domainPath}`);
    expect(contract.graduationStatus === "game-specific", `goldrush-contract-graduation-status-invalid:${contract.domainPath}`);
  }
}

function validateRuntimeInstall() {
  const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
  runtime.generateMatch({ players: 20, phase: "prospect" });
  const engine = runtime.engine;
  const registry = engine.n.goldrushKitContracts.snapshot();
  const installedDomainPaths = new Set(registry.installed.map((entry) => entry.domainPath));

  expect(typeof NexusRealtime.createRealtimeGame === "function", "nexusrealtime-createRealtimeGame-missing");
  expect(typeof NexusRealtime.defineDomainServiceKit === "function", "nexusrealtime-defineDomainServiceKit-missing");
  expect(registry.generic.count === genericIncubatorKitContracts.length, "runtime-generic-kit-count-mismatch");
  expect(registry.goldRush.count === goldRushKitContracts.length, "runtime-goldrush-kit-count-mismatch");

  for (const contract of genericIncubatorKitContracts.slice(0, 6)) {
    const api = engine.n[contract.apiName];
    expect(api, `runtime-missing-generic-api:${contract.apiName}`);
    if (!api) continue;
    expect(installedDomainPaths.has(contract.domainPath), `runtime-missing-installed-domain:${contract.domainPath}`);
    const event = api.emit({ type: contract.events[0], payload: { validator: "nexus-source-alignment" } });
    expect(event.type === contract.events[0], `runtime-generic-event-failed:${contract.domainPath}`);
    expect(JSON.stringify(api.snapshot()).length > 0, `runtime-generic-snapshot-not-serializable:${contract.domainPath}`);
    expect(api.reset().recentEvents.length === 0, `runtime-generic-reset-failed:${contract.domainPath}`);
  }

  const network = engine.n.goldrushNetwork.snapshot();
  expect(network.players === 20, "runtime-goldrush-network-not-generated");
  expect(engine.n.goldrushLegacySources.readiness().status === "waiting-for-cloud-import", "runtime-legacy-readiness-should-remain-cloud-blocked");
}

function validateProtoKitConstruct() {
  expect(typeof NexusRealtime.defineRuntimeKit === "function", "nexusrealtime-defineRuntimeKit-missing-for-protokit");
  const protoKit = createGenericRouteCargoExtractionKit(NexusRealtime);
  expect(protoKit.id === "generic-route-cargo-extraction-kit", "protokit-id-mismatch");
  for (const key of ["resources", "events", "systems", "requires", "provides", "initWorld", "install", "metadata"]) {
    expect(Object.prototype.hasOwnProperty.call(protoKit, key), `protokit-missing-key:${key}`);
  }
}

function validateRendererBoundary() {
  const forbiddenPatterns = manifest.forbiddenNonAdapterPatterns ?? [];
  for (const relativePath of listFiles(path.join(repoRoot, "src/kits"))) {
    const text = readFileSync(relativePath, "utf8");
    for (const pattern of forbiddenPatterns) {
      expect(!text.includes(pattern), `non-adapter-kit-forbidden-pattern:${path.relative(repoRoot, relativePath)}:${pattern}`);
    }
  }
}

function validateGoalSync() {
  const goalPath = manifest.goalSync?.path;
  expect(typeof goalPath === "string" && goalPath.length > 0, "goal-sync-path-missing");
  const fallbackPath = manifest.goalSync?.ciFallbackPath
    ? path.join(repoRoot, manifest.goalSync.ciFallbackPath)
    : null;
  const resolvedGoalPath = existsSync(goalPath)
    ? goalPath
    : process.env.CI && fallbackPath && existsSync(fallbackPath)
      ? fallbackPath
      : null;
  expect(Boolean(resolvedGoalPath), "goal-sync-file-missing");
  if (!resolvedGoalPath) return;
  const text = readFileSync(resolvedGoalPath, "utf8");
  for (const marker of manifest.goalSync.requiredMarkers ?? []) {
    expect(text.includes(marker), `goal-sync-missing-marker:${marker}`);
  }
}

function validateDocs() {
  const docs = [
    "docs/nexus-source-alignment.md",
    "docs/architecture/domain-service-kit-system.md",
    "docs/architecture/graduation-rules.md",
  ];
  for (const relativePath of docs) {
    expect(existsSync(path.join(repoRoot, relativePath)), `alignment-doc-missing:${relativePath}`);
  }
  const alignmentDoc = readFileSync(path.join(repoRoot, "docs/nexus-source-alignment.md"), "utf8");
  for (const token of ["NexusRealtime", "ProtoKits", "renderer", "ME ledger", "validate-nexus-source-alignment.mjs"]) {
    expect(alignmentDoc.includes(token), `alignment-doc-missing-token:${token}`);
  }
}

function listFiles(root) {
  if (!existsSync(root)) return [];
  const stat = statSync(root);
  if (stat.isFile()) return [root];
  return walk(root);
}

function walk(root) {
  const entries = readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    if (entry.isFile() && /\.(js|mjs|ts|tsx)$/.test(entry.name)) return [absolute];
    return [];
  });
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
