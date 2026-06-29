import { readFileSync } from "node:fs";
import {
  KIT_CONTRACT_FIELDS,
  genericIncubatorKitContracts,
  goldRushKitContracts,
  goldRushKitPairings,
  validateDomainKitContractCatalog,
} from "../../src/kits/generic-incubator/domainServiceKitCatalog.js";

const docs = [
  "../../docs/architecture/domain-service-kit-system.md",
  "../../docs/architecture/public-private-api-flow.md",
  "../../docs/architecture/graduation-rules.md",
  "../../docs/kits/generic/README.md",
  "../../docs/kits/goldrush/README.md",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");

const validation = validateDomainKitContractCatalog({ docs });

assert(validation.passed, `domain kit contract catalog failed: ${validation.failures.join(", ")}`);
assert(KIT_CONTRACT_FIELDS.length === 10, "kit documentation template must stay at exactly 10 fields");
assert(genericIncubatorKitContracts.length >= 31, "generic incubator catalog must cover the planned domain layout");
assert(goldRushKitContracts.length >= 31, "GoldRush catalog must cover every custom pairing");
assert(goldRushKitPairings.length === genericIncubatorKitContracts.length, "every generic kit needs a GoldRush pairing");
assert(genericIncubatorKitContracts.every((contract) => contract.graduationStatus === "local-incubation"), "generic kits must stay incubated locally");
assert(goldRushKitContracts.every((contract) => contract.graduationStatus === "game-specific"), "GoldRush custom kits must stay marked game-specific");
assert(
  genericIncubatorKitContracts.every((contract) => !JSON.stringify(contract).toLowerCase().includes("goldrush")),
  "generic incubator contracts must not contain GoldRush naming"
);

console.log(JSON.stringify({
  status: "domain-kit-contracts-ready",
  fields: KIT_CONTRACT_FIELDS,
  counts: validation.counts,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
