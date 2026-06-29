import * as NexusRealtime from "nexusrealtime";
import { createRealtimeGame, defineDomainServiceKit } from "nexusrealtime";
import { createGenericPressureLoopKit } from "@luminarylabs/nexusrealtime-protokits/generic-pressure-loop-kit";
import { createGenericResourceLoopKit } from "@luminarylabs/nexusrealtime-protokits/generic-resource-loop-kit";
import { createGenericRouteCargoExtractionKit } from "@luminarylabs/nexusrealtime-protokits/generic-route-cargo-extraction-kit";
import { createGenericRouteProgressKit } from "@luminarylabs/nexusrealtime-protokits/generic-route-progress-kit";

const version = "0.1.0";
const stability = "prototype";

export const goldRushProtoKitBridgeConfig = Object.freeze({
  id: "goldrush-route-cargo-extraction-protokit-bridge",
  routeId: "goldrush.mine-carry-cashout",
  label: "GoldRush Mine Carry Cashout ProtoKit Bridge",
  cargoId: "gold",
  cargoLabel: "Gold",
  cargoCapacity: 120,
  pressureId: "ambush-pressure",
  pressureLabel: "Ambush Pressure",
  warningAt: 65,
  failAt: 100,
  checkpoints: [
    {
      id: "mine-seam",
      label: "Mine Seam",
      objective: "Mine gold from a seam.",
      order: 1,
      tags: ["mine", "gold"],
      descriptor: { goldRushPhase: "prospect" },
    },
    {
      id: "carry-gold",
      label: "Carry Gold",
      objective: "Carry gold while pressure rises.",
      order: 2,
      tags: ["cargo", "risk"],
      descriptor: { goldRushPhase: "carry" },
    },
    {
      id: "cashout-site",
      label: "Cashout Site",
      objective: "Deliver gold to extraction.",
      order: 3,
      tags: ["cashout", "extraction"],
      descriptor: { goldRushPhase: "extract" },
    },
  ],
});

export function createGoldRushProtoKitBridgeKit() {
  return defineDomainServiceKit({
    id: "n-goldrush-protokit-route-cargo-extraction-bridge-kit",
    domain: "goldrush-protokit-route-cargo-extraction-bridge",
    apiName: "goldrushProtoKitBridge",
    stability,
    version,
    services: ["snapshot", "reset", "pickup-gold", "complete-checkpoint", "adjust-pressure", "deliver-gold", "validate"],
    metadata: {
      purpose: "Load the reusable ProtoKit route/cargo/extraction stack as a safe adapter source for Gold Rush extraction.",
      bridgePolicy: "The ProtoKit stack is hosted in an isolated NexusRealtime runtime because direct main-engine ticking currently overflows inside the imported ProtoKit stack.",
      ownsGoldRushRules: false,
      customGoldRushOwner: "engine.n.goldrushExtractionLoop",
    },
    createApi() {
      const bridge = createBridgeRuntime();

      return {
        snapshot() {
          return bridge.snapshot();
        },
        reset({ reason = "manual" } = {}) {
          return bridge.reset({ reason });
        },
        pickupGold({ amount = 12, commandId = "goldrush-protokit.pickup" } = {}) {
          return bridge.pickupGold({ amount, commandId });
        },
        completeCheckpoint({ checkpointId = "mine-seam", commandId = `goldrush-protokit.checkpoint.${checkpointId}` } = {}) {
          return bridge.completeCheckpoint({ checkpointId, commandId });
        },
        adjustPressure({ amount = 18, commandId = "goldrush-protokit.pressure" } = {}) {
          return bridge.adjustPressure({ amount, commandId });
        },
        deliverGold({ amount = 6, commandId = "goldrush-protokit.deliver" } = {}) {
          return bridge.deliverGold({ amount, commandId });
        },
        validate() {
          return bridge.validate();
        },
      };
    },
  });
}

export function createBridgeRuntime(config = goldRushProtoKitBridgeConfig) {
  const kits = createProtoKitStack(config);
  const engine = createRealtimeGame({ kits });

  function proto() {
    return engine.n.genericRouteCargoExtraction;
  }

  function snapshot() {
    const protoSnapshot = proto().getSnapshot();
    return structuredClone({
      version,
      bridgeId: config.id,
      status: "loaded",
      policy: "isolated-protokit-runtime",
      sourcePackage: "@luminarylabs/nexusrealtime-protokits/generic-route-cargo-extraction-kit",
      installedProtoKits: kits.map((kit) => ({
        id: kit.id,
        provides: kit.provides ?? [],
        requires: kit.requires ?? [],
        systems: kit.systems?.length ?? 0,
      })),
      protoSnapshot,
      descriptorCount: protoSnapshot.descriptors.length,
      customOwner: "engine.n.goldrushExtractionLoop",
    });
  }

  function reset({ reason = "manual" } = {}) {
    const protoSnapshot = proto().reset({ reason });
    return structuredClone({
      accepted: true,
      reason,
      snapshot: protoSnapshot,
    });
  }

  function pickupGold({ amount = 12, commandId = "goldrush-protokit.pickup" } = {}) {
    return structuredClone(proto().pickupCargo(config.cargoId, amount, { commandId, reason: "goldrush-mine-seam" }));
  }

  function completeCheckpoint({ checkpointId = "mine-seam", commandId = `goldrush-protokit.checkpoint.${checkpointId}` } = {}) {
    return structuredClone(proto().completeCheckpoint(checkpointId, { commandId, reason: "goldrush-route-proof" }));
  }

  function adjustPressure({ amount = 18, commandId = "goldrush-protokit.pressure" } = {}) {
    return structuredClone(proto().adjustPressure(config.pressureId, amount, { commandId, reason: "goldrush-ambush-proof" }));
  }

  function deliverGold({ amount = 6, commandId = "goldrush-protokit.deliver" } = {}) {
    return structuredClone(proto().deliverCargo(config.cargoId, amount, { commandId, reason: "goldrush-cashout-proof" }));
  }

  function validate() {
    const failures = [];
    const before = reset({ reason: "validate-reset" }).snapshot;
    const pickup = pickupGold({ amount: 24, commandId: "validate.pickup" });
    const mine = completeCheckpoint({ checkpointId: "mine-seam", commandId: "validate.mine" });
    const pressure = adjustPressure({ amount: 31, commandId: "validate.pressure" });
    const deliver = deliverGold({ amount: 9, commandId: "validate.deliver" });
    const after = snapshot();

    if (!before?.descriptors?.some((descriptor) => descriptor.id === "mine-seam")) failures.push("missing-mine-seam-descriptor");
    if (!pickup.accepted) failures.push("pickup-gold-rejected");
    if (pickup.snapshot?.cargo?.resourcesById?.gold?.value !== 24) failures.push("pickup-gold-value-mismatch");
    if (!mine.accepted || !mine.snapshot?.route?.completedIds?.includes("mine-seam")) failures.push("mine-checkpoint-not-completed");
    if (!pressure.accepted || pressure.snapshot?.pressure?.channelsById?.["ambush-pressure"]?.value !== 31) failures.push("pressure-not-adjusted");
    if (!deliver.accepted || deliver.snapshot?.cargo?.resourcesById?.gold?.value !== 15) failures.push("deliver-gold-value-mismatch");
    if (after.protoSnapshot?.status !== "active") failures.push("bridge-snapshot-not-active");
    if (JSON.parse(JSON.stringify(after)).descriptorCount < 5) failures.push("bridge-snapshot-not-serializable");
    if (kits.some((kit) => kit.id === "generic-route-cargo-extraction-kit" && (kit.requires ?? []).length < 3)) failures.push("composite-protokit-dependencies-missing");

    reset({ reason: "validate-cleanup" });
    return {
      passed: failures.length === 0,
      failures,
      proof: {
        beforeDescriptorCount: before.descriptors.length,
        pickupCargo: pickup.snapshot?.cargo?.resourcesById?.gold?.value ?? null,
        completedIds: mine.snapshot?.route?.completedIds ?? [],
        pressure: pressure.snapshot?.pressure?.channelsById?.["ambush-pressure"]?.value ?? null,
        remainingCargo: deliver.snapshot?.cargo?.resourcesById?.gold?.value ?? null,
        installedProtoKits: kits.map((kit) => kit.id),
      },
    };
  }

  return {
    engine,
    kits,
    snapshot,
    reset,
    pickupGold,
    completeCheckpoint,
    adjustPressure,
    deliverGold,
    validate,
  };
}

function createProtoKitStack(config) {
  return [
    createGenericRouteProgressKit(NexusRealtime, {
      routeId: config.routeId,
      label: config.label,
      checkpoints: config.checkpoints,
    }),
    createGenericResourceLoopKit(NexusRealtime, {
      resources: [
        {
          id: config.cargoId,
          label: config.cargoLabel,
          min: 0,
          max: config.cargoCapacity,
          initial: 0,
          thresholds: [
            { id: "empty", value: 0, direction: "below" },
            { id: "loaded", value: 1, direction: "above" },
          ],
          tags: ["gold", "cargo", "extraction"],
        },
      ],
    }),
    createGenericPressureLoopKit(NexusRealtime, {
      channels: [
        {
          id: config.pressureId,
          label: config.pressureLabel,
          min: 0,
          max: 100,
          value: 0,
          warningAt: config.warningAt,
          failAt: config.failAt,
          tags: ["ambush", "pressure", "combat"],
        },
      ],
    }),
    createGenericRouteCargoExtractionKit(NexusRealtime, {
      id: "generic-route-cargo-extraction-kit",
      stateId: config.id,
      routeId: config.routeId,
      label: config.label,
      cargoId: config.cargoId,
      cargoLabel: config.cargoLabel,
      cargoCapacity: config.cargoCapacity,
      initialCargo: 0,
      pressureId: config.pressureId,
      pressureLabel: config.pressureLabel,
      warningAt: config.warningAt,
      failAt: config.failAt,
      checkpoints: config.checkpoints,
    }),
  ];
}
