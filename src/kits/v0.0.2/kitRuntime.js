import { getV002KitByDomainPath } from "./registry.js";

export function createV002KitRuntime(domainPath, options = {}) {
  const contract = getV002KitByDomainPath(domainPath);
  if (!contract) throw new Error(`Unknown v0.0.2 kit domainPath: ${domainPath}`);

  let installed = false;
  let resetCount = 0;
  const events = [];

  function emit(type, payload = {}) {
    const event = {
      id: `${contract.id}-event-${String(events.length + 1).padStart(4, "0")}`,
      type,
      domainPath: contract.domainPath,
      payload,
    };
    events.push(event);
    return structuredClone(event);
  }

  return {
    contract: () => structuredClone(contract),
    install(runtime = {}) {
      if (!installed) {
        installed = true;
        emit(contract.events[0], { runtimeVersion: runtime.version ?? "local-v002-proof" });
      }
      return { installed, domainPath: contract.domainPath, runtime };
    },
    reset(reason = "manual-reset") {
      resetCount += 1;
      emit(contract.events[1], { reason, resetCount });
      return this.snapshot();
    },
    snapshot(extra = {}) {
      emit(contract.events[2], { proofGroup: contract.proofGroup });
      return {
        version: contract.version,
        domain: contract.domain,
        subdomain: contract.subdomain,
        domainPath: contract.domainPath,
        installed,
        health: installed ? "installed" : "registered",
        dependencies: structuredClone(contract.dependencies),
        proofGroup: contract.proofGroup,
        promotionStatus: contract.promotionStatus,
        resetCount,
        events: structuredClone(events.slice(-6)),
        ...extra,
      };
    },
    validate() {
      const failures = [];
      if (!contract.domainPath.startsWith("n:")) failures.push("domain-path-must-use-n-prefix");
      if (!Array.isArray(contract.dependencies)) failures.push("dependencies-must-be-array");
      if (!contract.publicApi.includes("install")) failures.push("missing-install-api");
      if (!contract.publicApi.includes("reset")) failures.push("missing-reset-api");
      if (!contract.publicApi.includes("snapshot")) failures.push("missing-snapshot-api");
      if (!contract.publicApi.includes("validate")) failures.push("missing-validate-api");
      const result = { passed: failures.length === 0, failures, domainPath: contract.domainPath };
      emit(contract.events[3], { passed: result.passed });
      return result;
    },
  };
}
