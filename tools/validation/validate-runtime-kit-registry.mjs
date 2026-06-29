import { createGoldRushRuntime } from "../../src/kits/goldRushRuntime.js";
import { createNetworkOrchestrator } from "../../src/network/networkOrchestrator.js";
import {
  genericIncubatorKitContracts,
  goldRushKitContracts,
  goldRushKitPairings,
} from "../../src/kits/generic-incubator/domainServiceKitCatalog.js";

const runtime = createGoldRushRuntime({ orchestrator: createNetworkOrchestrator() });
runtime.generateMatch({ players: 20, phase: "prospect" });

const engine = runtime.engine;
const registry = engine.n.goldrushKitContracts.snapshot();
const installedDomainPaths = new Set(registry.installed.map((entry) => entry.domainPath));

for (const contract of genericIncubatorKitContracts) {
  const api = engine.n[contract.apiName];
  assert(api, `missing generic incubator API engine.n.${contract.apiName}`);
  assert(api.contract().domainPath === contract.domainPath, `wrong generic contract domain path for ${contract.domainPath}`);
  assert(api.validate().passed, `generic incubator contract did not validate: ${contract.domainPath}`);
  assert(installedDomainPaths.has(contract.domainPath), `generic incubator kit not installed: ${contract.domainPath}`);
  const event = api.emit({ type: contract.events[0], payload: { validator: true } });
  assert(event.type === contract.events[0], `generic event emit failed for ${contract.domainPath}`);
  assert(api.reset().recentEvents.length === 0, `generic reset did not clear events for ${contract.domainPath}`);
}

assert(engine.n.goldrushKitContracts.validate().passed, "GoldRush kit contract registry should validate the catalog");
assert(registry.generic.count === genericIncubatorKitContracts.length, "registry generic count mismatch");
assert(registry.goldRush.count === goldRushKitContracts.length, "registry GoldRush count mismatch");
assert(registry.pairings.length === goldRushKitPairings.length, "registry pairing count mismatch");
assert(registry.installed.some((entry) => entry.id === "n-goldrush-kit-contract-registry-kit"), "GoldRush contract registry kit should be installed");
assert(runtime.snapshot().kitContracts.generic.count === genericIncubatorKitContracts.length, "scenario snapshot should expose kit contract registry");

console.log(JSON.stringify({
  status: "runtime-kit-registry-ready",
  genericApis: genericIncubatorKitContracts.length,
  goldRushContracts: goldRushKitContracts.length,
  installedDomainServiceKits: registry.installed.length,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
