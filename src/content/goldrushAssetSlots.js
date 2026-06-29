export const goldRushAssetSlots = [
  {
    id: "goldrush.player.prospector",
    type: "character",
    legacyRole: "player-or-prospector",
    placeholder: { shape: "capsule", color: "#74d0c2" },
  },
  {
    id: "goldrush.weapon.revolver",
    type: "weapon",
    legacyRole: "revolver",
    placeholder: { shape: "box", color: "#d7d0c2" },
  },
  {
    id: "goldrush.vehicle.train",
    type: "vehicle",
    legacyRole: "train",
    placeholder: { shape: "long-box", color: "#35383a" },
  },
  {
    id: "goldrush.vehicle.trainCar",
    type: "vehicle",
    legacyRole: "train-car",
    placeholder: { shape: "long-box", color: "#7a4d2a" },
  },
  {
    id: "goldrush.prop.goldPile",
    type: "resource-node",
    legacyRole: "gold-pile",
    placeholder: { shape: "cone-cluster", color: "#f5b544" },
  },
  {
    id: "goldrush.prop.cactus01",
    type: "flora",
    legacyRole: "cactus",
    placeholder: { shape: "upright-prism", color: "#4f8a5b" },
  },
  {
    id: "goldrush.prop.cactus02",
    type: "flora",
    legacyRole: "cactus-variant",
    placeholder: { shape: "upright-prism", color: "#5b9d68" },
  },
  {
    id: "goldrush.prop.fence01",
    type: "prop",
    legacyRole: "fence",
    placeholder: { shape: "rail", color: "#8a6545" },
  },
  {
    id: "goldrush.currency.coin01",
    type: "currency",
    legacyRole: "coin",
    placeholder: { shape: "disc", color: "#f5b544" },
  },
  {
    id: "goldrush.scene.arenaLayout",
    type: "scene-layout",
    legacyRole: "arena-layout-reference",
    placeholder: { shape: "layout", color: "#9f7a45" },
  },
];

export function createPlaceholderAssetRegistry() {
  return {
    version: "0.1.0",
    source: "placeholder-slots",
    pendingCloudImport: true,
    assets: goldRushAssetSlots.map((slot) => ({
      ...slot,
      status: "placeholder",
      runtimePath: null,
      sourceJobId: null,
      provenance: "pending-cloud-import",
    })),
  };
}
