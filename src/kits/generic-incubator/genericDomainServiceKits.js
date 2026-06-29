import { defineDomainServiceKit } from "nexusrealtime";
import {
  domainPathToServiceDomain,
  genericIncubatorKitContracts,
  validateDomainKitContractCatalog,
} from "./domainServiceKitCatalog.js";

const version = "0.1.0";
const stability = "incubator";

export function createGenericIncubatorDomainKits() {
  return genericIncubatorKitContracts.map((contract) => {
    const domain = domainPathToServiceDomain(contract.domainPath);
    return defineDomainServiceKit({
      id: `n-${domain}-kit`,
      domain,
      apiName: contract.apiName,
      stability,
      version,
      services: ["contract", "snapshot", "emit", "reset", "validate"],
      metadata: {
        purpose: contract.purpose,
        layer: "generic-incubator",
        domainPath: contract.domainPath,
        graduationStatus: contract.graduationStatus,
        kitContract: contract,
      },
      createApi({ engine }) {
        let eventLog = [];

        return {
          contract() {
            return structuredClone(contract);
          },
          snapshot() {
            return structuredClone({
              domainPath: contract.domainPath,
              layer: contract.layer,
              graduationStatus: contract.graduationStatus,
              publicApi: contract.publicApi,
              internalApi: contract.internalApi,
              events: contract.events,
              snapshotFields: contract.snapshot,
              dataExposed: contract.dataExposed,
              recentEvents: eventLog.slice(-20),
              installedKitCount: engine.kits?.length ?? 0,
            });
          },
          emit({ type = contract.events[0], payload = {}, source = "runtime" } = {}) {
            const event = {
              id: `${contract.domainPath}.event.${eventLog.length + 1}`,
              type,
              source,
              tick: engine.clock?.frame ?? 0,
              payload,
            };
            eventLog.push(event);
            eventLog = eventLog.slice(-100);
            return structuredClone(event);
          },
          reset() {
            eventLog = [];
            return this.snapshot();
          },
          validate() {
            return validateDomainKitContractCatalog({ generic: [contract], goldRush: [], pairings: [] });
          },
        };
      },
    });
  });
}
