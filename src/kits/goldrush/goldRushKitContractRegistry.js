import { defineDomainServiceKit } from "nexusrealtime";
import {
  createDomainKitContractSnapshot,
  goldRushKitPairings,
  validateDomainKitContractCatalog,
} from "../generic-incubator/domainServiceKitCatalog.js";

const version = "0.1.0";
const stability = "prototype";

export function createGoldRushKitContractRegistryKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-kit-contract-registry-kit",
    domain: "goldrush-kit-contracts",
    apiName: "goldrushKitContracts",
    stability,
    version,
    requires: ["n:runtime-domain-registry"],
    services: ["snapshot", "pairing", "validate"],
    metadata: {
      purpose: "Expose the local generic-incubator to GoldRush custom kit pairing contract.",
      layer: "goldrush-custom",
      domainPath: "n:goldrush:kit-contracts",
    },
    createApi({ engine }) {
      return {
        snapshot() {
          return createDomainKitContractSnapshot({ engine });
        },
        pairing(domainPath) {
          return structuredClone(goldRushKitPairings.find((pairing) => (
            pairing.genericDomainPath === domainPath || pairing.goldRushDomainPath === domainPath
          )) ?? null);
        },
        validate() {
          return validateDomainKitContractCatalog();
        },
      };
    },
  });
}
