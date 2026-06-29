import { createNetworkOrchestrator } from "../network/networkOrchestrator.js";

export function createRoomOrchestrator() {
  const networkOrchestrator = createNetworkOrchestrator();

  function generate({ players }) {
    return networkOrchestrator.generate({ players }).rooms;
  }

  function createSession({ players, phase } = {}) {
    return networkOrchestrator.createSession({ players, phase });
  }

  return { generate, createSession };
}
