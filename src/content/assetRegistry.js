import { createPlaceholderAssetRegistry } from "./goldrushAssetSlots.js";
import { applyGoldRushApprovedOverlay, goldRushApprovedAssets } from "./goldrushApprovedAssets.js";
import { createPresentationRegistry } from "./goldrushPresentationSlots.js";

const assetRegistryBase = createPlaceholderAssetRegistry();
const presentationRegistry = createPresentationRegistry();

const placeholderRegistry = {
  ...assetRegistryBase,
  presentation: presentationRegistry,
};

export const assetRegistry = applyGoldRushApprovedOverlay(placeholderRegistry, goldRushApprovedAssets);
