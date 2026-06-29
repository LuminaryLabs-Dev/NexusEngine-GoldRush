export const approvedAssetRecordRequiredFields = [
  "id",
  "status",
  "sourceJobId",
  "sourcePath",
  "sourceHash",
  "outputHash",
  "provenance",
  "approvalId",
  "runtimePath",
];

export const approvedAssetRecordGroups = [
  { category: "asset", key: "assets" },
  { category: "scene", key: "scenes", parent: "presentation" },
  { category: "audio", key: "audio", parent: "presentation" },
  { category: "animation", key: "animations", parent: "presentation" },
];

export const goldRushApprovedAssets = {
  schema: "nexusengine.goldrush.approved-assets.v1",
  version: "0.1.0",
  source: "cloud-reviewed-public-runtime-assets",
  pendingCloudImport: true,
  assets: [],
  presentation: {
    scenes: [],
    audio: [],
    animations: [],
  },
};

export function applyGoldRushApprovedOverlay(baseRegistry, approvedCatalog = goldRushApprovedAssets) {
  const approvedRecords = collectGoldRushApprovedAssetRecords(approvedCatalog);
  const approvedCount = approvedRecords.length;
  const presentation = baseRegistry.presentation ?? {};

  return {
    ...baseRegistry,
    pendingCloudImport: approvedCatalog.pendingCloudImport ?? approvedCount === 0,
    approvedAssetOverlay: {
      schema: approvedCatalog.schema,
      version: approvedCatalog.version,
      source: approvedCatalog.source,
      approvedCount,
      status: approvedCount > 0 ? "partial-approved-runtime-assets" : "pending-cloud-import",
    },
    assets: overlayApprovedRecords(baseRegistry.assets ?? [], approvedCatalog.assets ?? []),
    presentation: {
      ...presentation,
      scenes: overlayApprovedRecords(presentation.scenes ?? [], approvedCatalog.presentation?.scenes ?? []),
      audio: overlayApprovedRecords(presentation.audio ?? [], approvedCatalog.presentation?.audio ?? []),
      animations: overlayApprovedRecords(presentation.animations ?? [], approvedCatalog.presentation?.animations ?? []),
    },
  };
}

export function collectGoldRushApprovedAssetRecords(approvedCatalog = goldRushApprovedAssets) {
  return approvedAssetRecordGroups.flatMap((group) => {
    const container = group.parent ? approvedCatalog[group.parent] : approvedCatalog;
    const records = Array.isArray(container?.[group.key]) ? container[group.key] : [];
    return records.map((record) => ({
      category: group.category,
      record,
    }));
  });
}

function overlayApprovedRecords(baseRecords, approvedRecords) {
  const approvedById = new Map(approvedRecords.map((record) => [record.id, record]));
  return baseRecords.map((baseRecord) => {
    const approvedRecord = approvedById.get(baseRecord.id);
    if (!approvedRecord) return { ...baseRecord };
    return {
      ...baseRecord,
      ...approvedRecord,
      status: "approved",
      placeholder: baseRecord.placeholder,
    };
  });
}
