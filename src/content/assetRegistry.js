import { createPlaceholderAssetRegistry } from "./goldrushAssetSlots.js";
import { createPresentationRegistry } from "./goldrushPresentationSlots.js";

const assetRegistryBase = createPlaceholderAssetRegistry();
const presentationRegistry = createPresentationRegistry();

export const assetRegistry = {
  ...assetRegistryBase,
  presentation: presentationRegistry,
};
