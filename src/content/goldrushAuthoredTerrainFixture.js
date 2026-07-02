export const AUTHORED_TERRAIN_FIXTURE_ID = "goldrush.desert.artboard.fixture.001";

export const AUTHORED_TERRAIN_SCHEMA_VERSION = "authored-terrain-source-v0.1.0";

export const REVISION_REASON_TAXONOMY = Object.freeze([
  "source-identity",
  "source-geometry",
  "source-mask",
  "source-annotation",
  "source-lod",
  "source-proof",
]);

export const AUTHORED_TERRAIN_CONSUMERS = Object.freeze([
  Object.freeze({ consumerId: "render-terrain", domainPath: "n:render:terrain-bands", role: "render" }),
  Object.freeze({ consumerId: "terrain-collider", domainPath: "n:physics:collider", role: "collider" }),
  Object.freeze({ consumerId: "player-movement", domainPath: "n:control:character-movement", role: "movement" }),
  Object.freeze({ consumerId: "raycast-placement", domainPath: "n:world:placement-raycast", role: "placement" }),
  Object.freeze({ consumerId: "gameplay-zones", domainPath: "n:gameplay:extraction", role: "gameplay" }),
  Object.freeze({ consumerId: "local-proof", domainPath: "n:runtime:validation", role: "local-proof" }),
  Object.freeze({ consumerId: "public-proof", domainPath: "n:runtime:validation", role: "public-proof" }),
]);

const DEFAULT_AUTHORING = Object.freeze({
  sourceFamily: "desert-artboard-fixture",
  intendedSlice: "source-identity-and-revision",
  note: "Tiny authored terrain source identity fixture before render, collider, placement, and gameplay consumers expand.",
  ownerDomain: "world-source",
});

const DEFAULT_SOURCE_LAYERS = Object.freeze({
  identity: "fixture-preflight-001",
  revision: "micro-001",
  scaleIntent: "small-source-fixture",
  consumerEchoPolicy: "all-consumers-echo-fixture-revision-source-hash",
});

const DEFAULT_COORDINATE_SYSTEM = Object.freeze({
  handedness: "right-handed",
  axes: Object.freeze({ x: "east-west", y: "up", z: "north-south" }),
  up: Object.freeze({ axis: "y", vector: Object.freeze({ x: 0, y: 1, z: 0 }) }),
  forwardAxis: "z",
});

const DEFAULT_UNIT_SCALE = Object.freeze({
  unit: "meter",
  metersPerUnit: 1,
});

const DEFAULT_WORLD_BOUNDS = Object.freeze({
  minX: -320,
  maxX: 320,
  minZ: -240,
  maxZ: 240,
  width: 640,
  depth: 480,
});

const DEFAULT_ORIGIN = Object.freeze({
  originId: "fixture-origin-center",
  policy: "centered-world-origin",
  x: 0,
  y: 0,
  z: 0,
});

const DEFAULT_CELL_SIZE = Object.freeze({
  unit: "meter",
  height: 8,
  mask: 8,
  placement: 8,
  physics: 8,
  lod: 32,
});

const DEFAULT_HEIGHT_RANGE = Object.freeze({
  min: -24,
  max: 96,
  normalizedMin: 0,
  normalizedMax: 1,
});

const DEFAULT_HEIGHT_SAMPLES = Object.freeze({
  gridId: "height-grid-001",
  width: 5,
  height: 4,
  coordinateSpace: "world-xz",
  sampleOrder: "row-major-z-then-x",
  bounds: DEFAULT_WORLD_BOUNDS,
  sampleSpacing: Object.freeze({ x: 160, z: 160, unit: "meter" }),
  sourceCellPrefix: "height-cell",
  values: Object.freeze([
    Object.freeze([-8, -4, 2, -3, -10]),
    Object.freeze([-4, 0, 16, 2, -6]),
    Object.freeze([-6, 4, 34, 10, -2]),
    Object.freeze([-10, -2, 8, 0, -8]),
  ]),
});

const DEFAULT_HEIGHT_VALUE_DOMAIN = Object.freeze({
  min: -24,
  max: 96,
  finiteOnly: true,
  rejectOutOfRange: true,
});

const DEFAULT_HEIGHT_NORMALIZATION = Object.freeze({
  storage: "world-space",
  normalizedRangeField: "heightRange",
  outputField: "normalizedHeight",
});

const DEFAULT_HEIGHT_ORIGIN_OFFSET = Object.freeze({
  originId: "fixture-origin-center",
  offsetY: 0,
  worldHeightMode: "source-height-plus-offset",
});

const DEFAULT_HEIGHT_INTERPOLATION_MODE = "bilinear";

const DEFAULT_HEIGHT_EDGE_POLICY = Object.freeze({
  inside: "accept",
  edge: "accept",
  outside: "reject",
});

const DEFAULT_SAMPLE_HEIGHT_API = Object.freeze({
  name: "sampleHeight",
  public: true,
  returnFields: Object.freeze([
    "fixtureId",
    "revisionId",
    "sourceHash",
    "gridId",
    "accepted",
    "worldHeight",
    "sourceHeight",
    "offsetY",
    "normalizedHeight",
    "cell",
    "fractional",
  ]),
});

const DEFAULT_HEIGHT_PROOF_POINT_DEFS = Object.freeze([
  Object.freeze({ id: "spawn", role: "spawn", x: -120, z: 20 }),
  Object.freeze({ id: "mine", role: "mine", x: -40, z: -30 }),
  Object.freeze({ id: "cashout", role: "cashout", x: 120, z: 40 }),
  Object.freeze({ id: "rail", role: "rail", x: -140, z: 130 }),
  Object.freeze({ id: "central-blocker", role: "blocker", x: 0, z: 0 }),
]);

const DEFAULT_GROUND_PROOF_POINT_DEFS = Object.freeze([
  Object.freeze({ id: "spawn", role: "spawn", x: -120, z: 20 }),
  Object.freeze({ id: "mine", role: "mine", x: -40, z: -30 }),
  Object.freeze({ id: "cashout", role: "cashout", x: 120, z: 40 }),
  Object.freeze({ id: "rail", role: "rail", x: -140, z: 130 }),
  Object.freeze({ id: "central-blocker", role: "blocker", x: 0, z: 0 }),
  Object.freeze({ id: "edge", role: "edge", x: -320, z: -240 }),
]);

const DEFAULT_MATERIAL_BIOME_PROOF_POINT_DEFS = Object.freeze([
  Object.freeze({ id: "spawn", role: "spawn", x: -120, z: 20 }),
  Object.freeze({ id: "mine", role: "mine", x: -40, z: -30 }),
  Object.freeze({ id: "cashout", role: "cashout", x: 120, z: 40 }),
  Object.freeze({ id: "rail", role: "rail", x: -140, z: 130 }),
  Object.freeze({ id: "town", role: "town", x: 0, z: 110 }),
  Object.freeze({ id: "edge", role: "edge", x: -320, z: -240 }),
]);

const DEFAULT_HEIGHT_REVISION_POLICY = Object.freeze({
  policy: "height-source-change-invalidates-derived-proof",
  staleWhenFieldsChange: Object.freeze([
    "heightSamples",
    "heightValueDomain",
    "heightNormalization",
    "heightOriginOffset",
    "heightInterpolationMode",
    "heightEdgePolicy",
  ]),
  staleDomains: Object.freeze(["render", "collider", "movement", "placement", "gameplay", "screenshot-proof", "public-proof"]),
});

const DEFAULT_NORMAL_SPACE = Object.freeze({
  coordinateSpace: "world-space",
  handedness: "right-handed",
  upAxis: "y",
  vectorFormat: "xyz",
  unitLength: true,
});

const DEFAULT_SLOPE_VALUE_DOMAIN = Object.freeze({
  unit: "degrees",
  min: 0,
  max: 90,
  finiteOnly: true,
  rejectOutOfRange: true,
});

const DEFAULT_SLOPE_CLASS_TAXONOMY = Object.freeze([
  Object.freeze({ id: "flat", minDegrees: 0, maxDegrees: 8, walkable: true, movementState: "walk" }),
  Object.freeze({ id: "walkable", minDegrees: 8, maxDegrees: 22, walkable: true, movementState: "slow" }),
  Object.freeze({ id: "steep", minDegrees: 22, maxDegrees: 37, walkable: false, movementState: "slide" }),
  Object.freeze({ id: "blocker", minDegrees: 37, maxDegrees: 90, walkable: false, movementState: "blocked" }),
  Object.freeze({ id: "edge", minDegrees: null, maxDegrees: null, walkable: false, movementState: "blocked" }),
]);

const DEFAULT_WALKABLE_SLOPE_THRESHOLDS = Object.freeze({
  walkDegrees: 8,
  slowDegrees: 22,
  slideDegrees: 37,
  blockedDegrees: 37,
});

const DEFAULT_NORMAL_DERIVATION = Object.freeze({
  source: "height-gradient",
  method: "central-difference",
  neighborhood: "clamped-1-cell-cross",
  outputSpace: "world-space",
  sampleHeightApi: "sampleHeight",
});

const DEFAULT_GRADIENT_KERNEL = Object.freeze({
  xStepCells: 1,
  zStepCells: 1,
  edgeBehavior: "clamp-to-edge",
  sampleShape: "cross",
  usesHeightSamples: true,
});

const DEFAULT_SAMPLE_GROUND_API = Object.freeze({
  name: "sampleGround",
  public: true,
  returnFields: Object.freeze([
    "fixtureId",
    "revisionId",
    "sourceHash",
    "gridId",
    "accepted",
    "worldHeight",
    "normal",
    "normalSpace",
    "slopeDegrees",
    "slopeClass",
    "walkable",
    "movementState",
    "placementAllowed",
    "walkableSlopeThresholds",
    "normalDerivation",
    "gradientKernel",
    "material",
    "biome",
    "dominantMaterial",
    "dominantBiome",
    "materialMaskCell",
    "biomeMaskCell",
    "materialWeights",
    "biomeWeights",
    "layerBlendPolicy",
    "materialBiomeRevisionPolicy",
    "renderMaterialEcho",
    "audioVfxSurfaceEcho",
    "placementBiomeEcho",
    "gameplaySurfaceEcho",
    "movementGroundEcho",
    "placementNormalEcho",
    "sourceCellId",
    "cell",
    "fractional",
  ]),
});

const DEFAULT_NORMAL_SLOPE_REVISION_POLICY = Object.freeze({
  policy: "normal-slope-source-change-invalidates-derived-proof",
  staleWhenFieldsChange: Object.freeze([
    "heightSamples",
    "heightValueDomain",
    "heightNormalization",
    "heightOriginOffset",
    "heightInterpolationMode",
    "heightEdgePolicy",
    "normalSpace",
    "slopeValueDomain",
    "slopeClassTaxonomy",
    "walkableSlopeThresholds",
    "normalDerivation",
    "gradientKernel",
    "sampleGroundApi",
  ]),
  staleDomains: Object.freeze(["render", "collider", "movement", "placement", "gameplay", "screenshot-proof", "public-proof"]),
});

const DEFAULT_MATERIAL_TAG_TAXONOMY = Object.freeze([
  "sand",
  "rock",
  "gravel",
  "clay",
  "wood",
  "rail",
  "water",
  "mine-tailings",
]);

const DEFAULT_BIOME_TAG_TAXONOMY = Object.freeze([
  "basin",
  "mesa",
  "wash",
  "mine-shelf",
  "town-shelf",
  "rail-bed",
  "gold-seam",
  "extraction-site",
]);

const DEFAULT_MASK_WEIGHT_DOMAIN = Object.freeze({
  min: 0,
  max: 1,
  sumMin: 0.999,
  sumMax: 1.001,
  finiteOnly: true,
  rejectNegative: true,
  rejectOutOfRange: true,
});

const DEFAULT_LAYER_BLEND_POLICY = Object.freeze({
  baseMaterial: "sand",
  baseBiome: "basin",
  blendMode: "weighted-override",
  tieBreak: "later-override-wins",
  explicitBaseMaterialAllowed: true,
  explicitBaseBiomeAllowed: true,
});

const DEFAULT_MATERIAL_BIOME_REVISION_POLICY = Object.freeze({
  policy: "material-biome-source-change-invalidates-derived-proof",
  staleWhenFieldsChange: Object.freeze([
    "materialMask",
    "biomeMask",
    "materialTags",
    "biomeTags",
    "maskWeights",
    "layerBlendPolicy",
    "sampleGroundApi",
  ]),
  staleDomains: Object.freeze(["render", "audio", "vfx", "placement", "gameplay", "screenshot-proof", "public-proof"]),
});

const DEFAULT_BOUNDS_POLICY = Object.freeze({
  outsidePlayable: "reject",
  clampAsPlayable: false,
});

const DEFAULT_QUERY_BOUNDS_MODE = Object.freeze({
  height: "reject",
  mask: "reject",
  placement: "reject",
  collider: "reject",
  gameplay: "reject",
  lod: "nearest-edge",
  partition: "reject",
});

const DEFAULT_SCALE_PROOF_ANCHORS = Object.freeze({
  originId: "fixture-origin-center",
  anchors: Object.freeze([
    Object.freeze({ id: "spawn", kind: "spawn", x: -120, y: 0, z: 20, originId: "fixture-origin-center" }),
    Object.freeze({ id: "mine", kind: "mine", x: -40, y: 0, z: -30, originId: "fixture-origin-center" }),
    Object.freeze({ id: "cashout", kind: "extraction", x: 120, y: 0, z: 40, originId: "fixture-origin-center" }),
    Object.freeze({ id: "town", kind: "town", x: 0, y: 0, z: 110, originId: "fixture-origin-center" }),
    Object.freeze({ id: "rail", kind: "rail", x: -140, y: 0, z: 130, originId: "fixture-origin-center" }),
  ]),
  routeBudgets: Object.freeze([
    Object.freeze({ id: "spawn-to-mine", from: "spawn", to: "mine", minMeters: 60, maxMeters: 140 }),
    Object.freeze({ id: "mine-to-cashout", from: "mine", to: "cashout", minMeters: 130, maxMeters: 220 }),
    Object.freeze({ id: "town-to-rail", from: "town", to: "rail", minMeters: 90, maxMeters: 180 }),
  ]),
});

const DEFAULT_SCALE_CONSUMERS = Object.freeze({
  lod: Object.freeze({
    cellSize: 64,
    unitScale: DEFAULT_UNIT_SCALE,
    worldBounds: DEFAULT_WORLD_BOUNDS,
  }),
  partition: Object.freeze({
    partitionSize: 160,
    unitScale: DEFAULT_UNIT_SCALE,
    worldBounds: DEFAULT_WORLD_BOUNDS,
    targetPlayersPerPartition: 20,
  }),
});

const DEFAULT_CONSUMER_SCALE_ECHO = Object.freeze({
  renderTerrain: Object.freeze({
    consumerId: "render-terrain",
    worldBounds: DEFAULT_WORLD_BOUNDS,
    unitScale: DEFAULT_UNIT_SCALE,
    originId: "fixture-origin-center",
  }),
  terrainCollider: Object.freeze({
    consumerId: "terrain-collider",
    worldBounds: DEFAULT_WORLD_BOUNDS,
    unitScale: DEFAULT_UNIT_SCALE,
    originId: "fixture-origin-center",
  }),
  raycastPlacement: Object.freeze({
    consumerId: "raycast-placement",
    worldBounds: DEFAULT_WORLD_BOUNDS,
    unitScale: DEFAULT_UNIT_SCALE,
    originId: "fixture-origin-center",
  }),
});

const DEFAULT_SCALE_REVISION_POLICY = Object.freeze({
  policy: "scale-source-change-invalidates-derived-proof",
  staleWhenFieldsChange: Object.freeze(["worldBounds", "origin", "unitScale", "cellSize"]),
  staleDomains: Object.freeze(["render", "collider", "placement", "gameplay", "local-proof", "public-proof"]),
});

export function createGoldRushAuthoredTerrainFixture(overrides = {}) {
  const base = {
    schemaVersion: AUTHORED_TERRAIN_SCHEMA_VERSION,
    fixtureId: AUTHORED_TERRAIN_FIXTURE_ID,
    revisionReason: "source-identity",
    revisionNote: "Initial source identity and consumer echo contract for the first authored terrain fixture.",
    authoring: { ...DEFAULT_AUTHORING },
    sourceLayers: { ...DEFAULT_SOURCE_LAYERS },
    coordinateSystem: cloneJson(DEFAULT_COORDINATE_SYSTEM),
    unitScale: cloneJson(DEFAULT_UNIT_SCALE),
    worldBounds: cloneJson(DEFAULT_WORLD_BOUNDS),
    origin: cloneJson(DEFAULT_ORIGIN),
    cellSize: cloneJson(DEFAULT_CELL_SIZE),
    heightRange: cloneJson(DEFAULT_HEIGHT_RANGE),
    heightSamples: cloneJson(DEFAULT_HEIGHT_SAMPLES),
    heightValueDomain: cloneJson(DEFAULT_HEIGHT_VALUE_DOMAIN),
    heightNormalization: cloneJson(DEFAULT_HEIGHT_NORMALIZATION),
    heightOriginOffset: cloneJson(DEFAULT_HEIGHT_ORIGIN_OFFSET),
    heightInterpolationMode: DEFAULT_HEIGHT_INTERPOLATION_MODE,
    heightEdgePolicy: cloneJson(DEFAULT_HEIGHT_EDGE_POLICY),
    sampleHeightApi: cloneJson(DEFAULT_SAMPLE_HEIGHT_API),
    heightRevisionPolicy: cloneJson(DEFAULT_HEIGHT_REVISION_POLICY),
    normalSpace: cloneJson(DEFAULT_NORMAL_SPACE),
    slopeValueDomain: cloneJson(DEFAULT_SLOPE_VALUE_DOMAIN),
    slopeClassTaxonomy: cloneJson(DEFAULT_SLOPE_CLASS_TAXONOMY),
    walkableSlopeThresholds: cloneJson(DEFAULT_WALKABLE_SLOPE_THRESHOLDS),
    normalDerivation: cloneJson(DEFAULT_NORMAL_DERIVATION),
    gradientKernel: cloneJson(DEFAULT_GRADIENT_KERNEL),
    sampleGroundApi: cloneJson(DEFAULT_SAMPLE_GROUND_API),
    normalSlopeRevisionPolicy: cloneJson(DEFAULT_NORMAL_SLOPE_REVISION_POLICY),
    materialTags: cloneJson(DEFAULT_MATERIAL_TAG_TAXONOMY),
    biomeTags: cloneJson(DEFAULT_BIOME_TAG_TAXONOMY),
    maskWeights: cloneJson(DEFAULT_MASK_WEIGHT_DOMAIN),
    layerBlendPolicy: cloneJson(DEFAULT_LAYER_BLEND_POLICY),
    materialBiomeRevisionPolicy: cloneJson(DEFAULT_MATERIAL_BIOME_REVISION_POLICY),
    boundsPolicy: cloneJson(DEFAULT_BOUNDS_POLICY),
    queryBoundsMode: cloneJson(DEFAULT_QUERY_BOUNDS_MODE),
    scaleProofAnchors: cloneJson(DEFAULT_SCALE_PROOF_ANCHORS),
    scaleConsumers: cloneJson(DEFAULT_SCALE_CONSUMERS),
    consumerScaleEcho: cloneJson(DEFAULT_CONSUMER_SCALE_ECHO),
    scaleRevisionPolicy: cloneJson(DEFAULT_SCALE_REVISION_POLICY),
  };

  const source = deepMerge(base, withoutKeys(overrides, ["revisionId", "sourceHash", "consumerEchoes", "restartPacket"]));
  if (!hasOwn(overrides, "heightProofPoints")) {
    source.heightProofPoints = createDefaultHeightProofPoints(source);
  }
  if (!hasOwn(overrides, "heightConsumerParity")) {
    source.heightConsumerParity = createAuthoredTerrainHeightConsumerParity(source);
  }
  if (!hasOwn(overrides, "materialMask")) {
    source.materialMask = createDefaultMaterialMask(source);
  }
  if (!hasOwn(overrides, "biomeMask")) {
    source.biomeMask = createDefaultBiomeMask(source);
  }
  if (!hasOwn(overrides, "groundProofPoints")) {
    source.groundProofPoints = createDefaultGroundProofPoints(source);
  }
  if (!hasOwn(overrides, "groundConsumerParity")) {
    source.groundConsumerParity = createAuthoredTerrainGroundConsumerParity(source);
  }
  if (!hasOwn(overrides, "materialBiomeProofPoints")) {
    source.materialBiomeProofPoints = createDefaultMaterialBiomeProofPoints(source);
  }
  if (!hasOwn(overrides, "materialBiomeConsumerParity")) {
    source.materialBiomeConsumerParity = createAuthoredTerrainMaterialBiomeConsumerParity(source);
  }
  const sourceHash = deriveAuthoredTerrainSourceHash(source);
  const revisionId = hasOwn(overrides, "revisionId") ? overrides.revisionId : deriveAuthoredTerrainRevisionId(source);
  const consumerEchoes = hasOwn(overrides, "consumerEchoes")
    ? cloneJson(overrides.consumerEchoes)
    : createAuthoredTerrainConsumerEchoes({ ...source, revisionId, sourceHash });
  const restartPacket = hasOwn(overrides, "restartPacket")
    ? cloneJson(overrides.restartPacket)
    : createAuthoredTerrainRestartPacket({ ...source, revisionId, sourceHash });

  return freezeDeep({
    ...source,
    revisionId,
    sourceHash,
    consumerEchoes,
    restartPacket,
  });
}

export function deriveAuthoredTerrainRevisionId(source) {
  return `rev-${deriveAuthoredTerrainSourceHash(source).slice(0, 8)}`;
}

export function deriveAuthoredTerrainSourceHash(source) {
  return stableHash(createAuthoredTerrainSourceHashInputs(source));
}

export function createAuthoredTerrainSourceHashInputs(source) {
  const fixture = source ?? {};
  return canonicalize({
    schemaVersion: fixture.schemaVersion,
    fixtureId: fixture.fixtureId,
    revisionReason: fixture.revisionReason,
    revisionNote: fixture.revisionNote,
    authoring: fixture.authoring,
    sourceLayers: fixture.sourceLayers,
    coordinateSystem: fixture.coordinateSystem,
    unitScale: fixture.unitScale,
    worldBounds: fixture.worldBounds,
    origin: fixture.origin,
    cellSize: fixture.cellSize,
    heightRange: fixture.heightRange,
    heightSamples: fixture.heightSamples,
    heightValueDomain: fixture.heightValueDomain,
    heightNormalization: fixture.heightNormalization,
    heightOriginOffset: fixture.heightOriginOffset,
    heightInterpolationMode: fixture.heightInterpolationMode,
    heightEdgePolicy: fixture.heightEdgePolicy,
    sampleHeightApi: fixture.sampleHeightApi,
    heightProofPoints: fixture.heightProofPoints,
    heightConsumerParity: fixture.heightConsumerParity,
    groundProofPoints: fixture.groundProofPoints,
    groundConsumerParity: fixture.groundConsumerParity,
    materialBiomeProofPoints: fixture.materialBiomeProofPoints,
    materialBiomeConsumerParity: fixture.materialBiomeConsumerParity,
    materialMask: fixture.materialMask,
    biomeMask: fixture.biomeMask,
    normalSpace: fixture.normalSpace,
    slopeValueDomain: fixture.slopeValueDomain,
    slopeClassTaxonomy: fixture.slopeClassTaxonomy,
    walkableSlopeThresholds: fixture.walkableSlopeThresholds,
    normalDerivation: fixture.normalDerivation,
    gradientKernel: fixture.gradientKernel,
    sampleGroundApi: fixture.sampleGroundApi,
    normalSlopeRevisionPolicy: fixture.normalSlopeRevisionPolicy,
    materialTags: fixture.materialTags,
    biomeTags: fixture.biomeTags,
    maskWeights: fixture.maskWeights,
    layerBlendPolicy: fixture.layerBlendPolicy,
    materialBiomeRevisionPolicy: fixture.materialBiomeRevisionPolicy,
    heightRevisionPolicy: fixture.heightRevisionPolicy,
    boundsPolicy: fixture.boundsPolicy,
    queryBoundsMode: fixture.queryBoundsMode,
    scaleProofAnchors: fixture.scaleProofAnchors,
    scaleConsumers: fixture.scaleConsumers,
    consumerScaleEcho: fixture.consumerScaleEcho,
    scaleRevisionPolicy: fixture.scaleRevisionPolicy,
  });
}

export function createAuthoredTerrainConsumerEchoes(fixture) {
  return AUTHORED_TERRAIN_CONSUMERS.map((consumer) => ({
    ...consumer,
    fixtureId: fixture.fixtureId,
    revisionId: fixture.revisionId,
    sourceHash: fixture.sourceHash,
    scaleEcho: createConsumerScaleEcho(fixture),
    heightEcho: createConsumerHeightEcho(fixture),
    groundEcho: createConsumerGroundEcho(fixture),
    materialBiomeEcho: createConsumerMaterialBiomeEcho(fixture),
    ready: true,
  }));
}

export function createAuthoredTerrainRestartPacket(fixture) {
  return {
    fixtureId: fixture.fixtureId,
    revisionId: fixture.revisionId,
    sourceHash: fixture.sourceHash,
    version: "v0.0.1",
    reason: fixture.revisionReason,
    lessonTrigger: "source-revision-change",
    requiredFields: [
      "fixtureId",
      "revisionId",
      "sourceHash",
      "revisionReason",
      "coordinateSystem",
      "unitScale",
      "worldBounds",
      "origin",
      "cellSize",
      "heightRange",
      "heightSamples",
      "heightProofPoints",
      "heightConsumerParity",
      "groundProofPoints",
      "groundConsumerParity",
      "materialBiomeProofPoints",
      "materialBiomeConsumerParity",
      "materialMask",
      "biomeMask",
      "normalSpace",
      "slopeValueDomain",
      "slopeClassTaxonomy",
      "walkableSlopeThresholds",
      "normalDerivation",
      "gradientKernel",
      "sampleGroundApi",
      "normalSlopeRevisionPolicy",
      "materialTags",
      "biomeTags",
      "maskWeights",
      "layerBlendPolicy",
      "materialBiomeRevisionPolicy",
      "consumerEchoes",
      "staleProofFlags",
    ],
  };
}

export function createRevisionStaleProofFlags({ previousRevisionId = null, nextRevisionId = null } = {}) {
  const revisionChanged = Boolean(previousRevisionId && nextRevisionId && previousRevisionId !== nextRevisionId);
  const staleDomains = ["render", "collider", "placement", "gameplay", "local-proof", "public-proof"];
  return {
    previousRevisionId,
    nextRevisionId,
    revisionChanged,
    stale: Object.fromEntries(staleDomains.map((domain) => [domain, revisionChanged])),
    staleDomains: revisionChanged ? staleDomains : [],
  };
}

export function createScaleRevisionStaleProofFlags({ previousFixture = null, nextFixture = null } = {}) {
  const policyFields = nextFixture?.scaleRevisionPolicy?.staleWhenFieldsChange
    ?? DEFAULT_SCALE_REVISION_POLICY.staleWhenFieldsChange;
  const staleDomains = nextFixture?.scaleRevisionPolicy?.staleDomains
    ?? DEFAULT_SCALE_REVISION_POLICY.staleDomains;
  const changedFields = policyFields.filter((field) => stableStringify(previousFixture?.[field]) !== stableStringify(nextFixture?.[field]));
  const revisionChanged = Boolean(previousFixture?.revisionId && nextFixture?.revisionId && previousFixture.revisionId !== nextFixture.revisionId);
  const stale = changedFields.length > 0 || revisionChanged;

  return {
    previousRevisionId: previousFixture?.revisionId ?? null,
    nextRevisionId: nextFixture?.revisionId ?? null,
    revisionChanged,
    changedFields,
    stale: Object.fromEntries(staleDomains.map((domain) => [domain, stale])),
    staleDomains: stale ? [...staleDomains] : [],
  };
}

export function createHeightRevisionStaleProofFlags({ previousFixture = null, nextFixture = null } = {}) {
  const policyFields = nextFixture?.heightRevisionPolicy?.staleWhenFieldsChange
    ?? DEFAULT_HEIGHT_REVISION_POLICY.staleWhenFieldsChange;
  const staleDomains = nextFixture?.heightRevisionPolicy?.staleDomains
    ?? DEFAULT_HEIGHT_REVISION_POLICY.staleDomains;
  const changedFields = policyFields.filter((field) => stableStringify(previousFixture?.[field]) !== stableStringify(nextFixture?.[field]));
  const revisionChanged = Boolean(previousFixture?.revisionId && nextFixture?.revisionId && previousFixture.revisionId !== nextFixture.revisionId);
  const stale = changedFields.length > 0 || revisionChanged;

  return {
    previousRevisionId: previousFixture?.revisionId ?? null,
    nextRevisionId: nextFixture?.revisionId ?? null,
    revisionChanged,
    changedFields,
    stale: Object.fromEntries(staleDomains.map((domain) => [domain, stale])),
    staleDomains: stale ? [...staleDomains] : [],
  };
}

export function createNormalSlopeRevisionStaleProofFlags({ previousFixture = null, nextFixture = null } = {}) {
  const policyFields = nextFixture?.normalSlopeRevisionPolicy?.staleWhenFieldsChange
    ?? DEFAULT_NORMAL_SLOPE_REVISION_POLICY.staleWhenFieldsChange;
  const staleDomains = nextFixture?.normalSlopeRevisionPolicy?.staleDomains
    ?? DEFAULT_NORMAL_SLOPE_REVISION_POLICY.staleDomains;
  const changedFields = policyFields.filter((field) => stableStringify(previousFixture?.[field]) !== stableStringify(nextFixture?.[field]));
  const revisionChanged = Boolean(previousFixture?.revisionId && nextFixture?.revisionId && previousFixture.revisionId !== nextFixture.revisionId);
  const stale = changedFields.length > 0 || revisionChanged;

  return {
    previousRevisionId: previousFixture?.revisionId ?? null,
    nextRevisionId: nextFixture?.revisionId ?? null,
    revisionChanged,
    changedFields,
    stale: Object.fromEntries(staleDomains.map((domain) => [domain, stale])),
    staleDomains: stale ? [...staleDomains] : [],
  };
}

export function createAuthoredTerrainIdentityEvents(fixture, { previousRevisionId = null } = {}) {
  const validation = validateAuthoredTerrainSourceFixture(fixture);
  const base = {
    fixtureId: fixture?.fixtureId ?? null,
    revisionId: fixture?.revisionId ?? null,
    sourceHash: fixture?.sourceHash ?? null,
  };

  if (!validation.passed) {
    const driftEvents = validation.snapshot.drift.map((drift) => ({
      type: "terrainSource.consumerDrift",
      ...base,
      consumerId: drift.consumerId,
      expectedRevisionId: drift.expectedRevisionId,
      actualRevisionId: drift.actualRevisionId,
    }));
    return [
      ...driftEvents,
      {
        type: "terrainSource.rejected",
        ...base,
        failures: validation.failures,
      },
    ];
  }

  const events = [
    {
      type: "terrainSource.loaded",
      ...base,
      reason: fixture.revisionReason,
    },
    ...fixture.consumerEchoes.map((consumer) => ({
      type: "terrainSource.consumerReady",
      ...base,
      consumerId: consumer.consumerId,
      consumerDomainPath: consumer.domainPath,
    })),
  ];

  if (previousRevisionId && previousRevisionId !== fixture.revisionId) {
    events.push({
      type: "terrainSource.revisionChanged",
      ...base,
      previousRevisionId,
      staleProofFlags: createRevisionStaleProofFlags({ previousRevisionId, nextRevisionId: fixture.revisionId }),
    });
  }

  return events;
}

export function createAuthoredTerrainSourceSnapshot(fixture, validation = validateAuthoredTerrainSourceFixture(fixture)) {
  const drift = detectConsumerDrift(fixture);
  return {
    fixtureId: fixture?.fixtureId ?? null,
    revisionId: fixture?.revisionId ?? null,
    reason: fixture?.revisionReason ?? null,
    sourceHash: fixture?.sourceHash ?? null,
    consumers: Array.isArray(fixture?.consumerEchoes)
      ? fixture.consumerEchoes.map((consumer) => ({
        consumerId: consumer.consumerId,
        domainPath: consumer.domainPath,
        role: consumer.role,
        fixtureId: consumer.fixtureId,
        revisionId: consumer.revisionId,
        sourceHash: consumer.sourceHash,
        ready: Boolean(consumer.ready),
      }))
      : [],
    drift,
    boundsScale: createAuthoredTerrainBoundsScaleSnapshot(fixture),
    height: createAuthoredTerrainHeightSnapshot(fixture),
    ground: createAuthoredTerrainGroundSnapshot(fixture),
    materialBiome: createAuthoredTerrainMaterialBiomeSnapshot(fixture),
    validation: {
      passed: Boolean(validation?.passed),
      failures: validation?.failures ?? [],
      consumerValidationSkipped: Boolean(validation?.consumerValidationSkipped),
    },
  };
}

export function createAuthoredTerrainBoundsScaleSnapshot(fixture) {
  if (!fixture || typeof fixture !== "object") {
    return {
      coordinateSystem: null,
      unitScale: null,
      worldBounds: null,
      origin: null,
      cellSize: null,
      heightRange: null,
      routeDistances: [],
    };
  }

  const anchors = Array.isArray(fixture.scaleProofAnchors?.anchors) ? fixture.scaleProofAnchors.anchors : [];
  const routeBudgets = Array.isArray(fixture.scaleProofAnchors?.routeBudgets) ? fixture.scaleProofAnchors.routeBudgets : [];
  const routeDistances = routeBudgets.map((route) => {
    const from = anchors.find((anchor) => anchor.id === route.from);
    const to = anchors.find((anchor) => anchor.id === route.to);
    return {
      id: route.id,
      from: route.from,
      to: route.to,
      meters: from && to ? measureGroundDistanceMeters(fixture, from, to) : null,
      minMeters: route.minMeters,
      maxMeters: route.maxMeters,
    };
  });

  return {
    coordinateSystem: cloneJson(fixture.coordinateSystem),
    unitScale: cloneJson(fixture.unitScale),
    worldBounds: cloneJson(fixture.worldBounds),
    origin: cloneJson(fixture.origin),
    cellSize: cloneJson(fixture.cellSize),
    heightRange: {
      ...cloneJson(fixture.heightRange),
      span: finiteNumber(fixture.heightRange?.max) - finiteNumber(fixture.heightRange?.min),
    },
    boundsPolicy: cloneJson(fixture.boundsPolicy),
    queryBoundsMode: cloneJson(fixture.queryBoundsMode),
    scaleConsumers: cloneJson(fixture.scaleConsumers),
    consumerScaleEcho: cloneJson(fixture.consumerScaleEcho),
    scaleRevisionPolicy: cloneJson(fixture.scaleRevisionPolicy),
    routeDistances,
  };
}

export function queryAuthoredTerrainBounds(fixture, point, { queryType = "height" } = {}) {
  const bounds = fixture?.worldBounds ?? {};
  const mode = fixture?.queryBoundsMode?.[queryType] ?? "reject";
  const queryPoint = {
    x: finiteNumber(point?.x),
    z: finiteNumber(point?.z),
  };
  const inside = pointInsideBounds(bounds, queryPoint);
  const clampedPoint = clampPointToBounds(bounds, queryPoint);

  return {
    queryType,
    mode,
    accepted: inside || mode !== "reject",
    playable: inside,
    reason: inside ? "inside-bounds" : "out-of-bounds",
    point: queryPoint,
    clampedPoint: inside ? null : clampedPoint,
    worldBounds: cloneJson(bounds),
    unitScale: cloneJson(fixture?.unitScale),
  };
}

export function normalizeAuthoredTerrainHeight(fixture, height) {
  const min = finiteNumber(fixture?.heightRange?.min);
  const max = finiteNumber(fixture?.heightRange?.max);
  if (max <= min) return null;
  return (finiteNumber(height) - min) / (max - min);
}

export function sampleAuthoredTerrainHeight(fixture, point, { queryType = "height" } = {}) {
  const boundsHit = queryAuthoredTerrainBounds(fixture, point, { queryType });
  const samples = fixture?.heightSamples;
  const interpolation = fixture?.heightInterpolationMode ?? DEFAULT_HEIGHT_INTERPOLATION_MODE;

  if (!boundsHit.accepted || !samples || !Array.isArray(samples.values)) {
    return {
      fixtureId: fixture?.fixtureId ?? null,
      revisionId: fixture?.revisionId ?? null,
      sourceHash: fixture?.sourceHash ?? null,
      gridId: samples?.gridId ?? null,
      accepted: false,
      reason: boundsHit.reason,
      point: boundsHit.point,
      worldHeight: null,
      sourceHeight: null,
      offsetY: finiteNumber(fixture?.heightOriginOffset?.offsetY),
      normalizedHeight: null,
      interpolation,
      edgePolicy: cloneJson(fixture?.heightEdgePolicy),
      cell: null,
      fractional: null,
    };
  }

  const samplePoint = boundsHit.clampedPoint ?? boundsHit.point;
  const gridAddress = createHeightGridAddress(fixture, samplePoint);
  const sourceHeight = sampleHeightGridValue(fixture, gridAddress, interpolation);
  const offsetY = finiteNumber(fixture?.heightOriginOffset?.offsetY);
  const worldHeight = sourceHeight + offsetY;

  return {
    fixtureId: fixture.fixtureId,
    revisionId: fixture.revisionId,
    sourceHash: fixture.sourceHash,
    gridId: samples.gridId,
    accepted: true,
    reason: boundsHit.reason,
    point: samplePoint,
    worldHeight,
    sourceHeight,
    offsetY,
    normalizedHeight: normalizeAuthoredTerrainHeight(fixture, worldHeight),
    interpolation,
    edgePolicy: cloneJson(fixture.heightEdgePolicy),
    cell: gridAddress.cell,
    fractional: gridAddress.fractional,
  };
}

export function createAuthoredTerrainHeightSnapshot(fixture) {
  if (!fixture || typeof fixture !== "object") {
    return {
      gridId: null,
      width: null,
      height: null,
      interpolation: null,
      proofPoints: [],
      consumerParity: null,
    };
  }

  const proofPoints = Array.isArray(fixture.heightProofPoints) ? fixture.heightProofPoints : [];
  return {
    gridId: fixture.heightSamples?.gridId ?? null,
    width: fixture.heightSamples?.width ?? null,
    height: fixture.heightSamples?.height ?? null,
    coordinateSpace: fixture.heightSamples?.coordinateSpace ?? null,
    sampleOrder: fixture.heightSamples?.sampleOrder ?? null,
    valueDomain: cloneJson(fixture.heightValueDomain),
    normalization: cloneJson(fixture.heightNormalization),
    originOffset: cloneJson(fixture.heightOriginOffset),
    interpolation: fixture.heightInterpolationMode ?? null,
    edgePolicy: cloneJson(fixture.heightEdgePolicy),
    sampleHeightApi: cloneJson(fixture.sampleHeightApi),
    proofPoints: proofPoints.map((point) => sampleAuthoredTerrainHeight(fixture, point)),
    consumerParity: cloneJson(fixture.heightConsumerParity),
    revisionPolicy: cloneJson(fixture.heightRevisionPolicy),
  };
}

export function sampleAuthoredTerrainMaterialBiome(fixture, point, { queryType = "height" } = {}) {
  const boundsHit = queryAuthoredTerrainBounds(fixture, point, { queryType });
  const materialMask = fixture?.materialMask;
  const biomeMask = fixture?.biomeMask;
  const materialCells = Array.isArray(materialMask?.cells) ? materialMask.cells : null;
  const biomeCells = Array.isArray(biomeMask?.cells) ? biomeMask.cells : null;

  if (!boundsHit.accepted || !materialMask || !biomeMask || !materialCells || !biomeCells) {
    return {
      fixtureId: fixture?.fixtureId ?? null,
      revisionId: fixture?.revisionId ?? null,
      sourceHash: fixture?.sourceHash ?? null,
      gridId: materialMask?.gridId ?? biomeMask?.gridId ?? null,
      accepted: false,
      reason: boundsHit.reason,
      point: boundsHit.point,
      materialMaskCell: null,
      biomeMaskCell: null,
      material: null,
      biome: null,
      dominantMaterial: null,
      dominantBiome: null,
      materialWeights: null,
      biomeWeights: null,
      maskWeights: cloneJson(fixture?.maskWeights),
      layerBlendPolicy: cloneJson(fixture?.layerBlendPolicy),
      materialBiomeRevisionPolicy: cloneJson(fixture?.materialBiomeRevisionPolicy),
      materialMaskCellId: null,
      biomeMaskCellId: null,
      renderMaterialEcho: null,
      audioVfxSurfaceEcho: null,
      placementBiomeEcho: null,
      gameplaySurfaceEcho: null,
      cell: null,
      fractional: null,
    };
  }

  const samplePoint = boundsHit.clampedPoint ?? boundsHit.point;
  const gridAddress = createHeightGridAddress(fixture, samplePoint);
  const row = gridAddress.cell.row;
  const column = gridAddress.cell.column;
  const materialMaskCell = getTerrainMaskCell(materialMask, row, column);
  const biomeMaskCell = getTerrainMaskCell(biomeMask, row, column);
  const dominantMaterial = materialMaskCell?.dominantMaterial ?? materialMask?.baseMaterial ?? null;
  const dominantBiome = biomeMaskCell?.dominantBiome ?? biomeMask?.baseBiome ?? null;
  const materialWeights = cloneJson(materialMaskCell?.weights ?? null);
  const biomeWeights = cloneJson(biomeMaskCell?.weights ?? null);
  const materialTag = dominantMaterial;
  const biomeTag = dominantBiome;

  return {
    fixtureId: fixture.fixtureId,
    revisionId: fixture.revisionId,
    sourceHash: fixture.sourceHash,
    gridId: materialMask.gridId,
    accepted: true,
    reason: boundsHit.reason,
    point: samplePoint,
    materialMaskCell: cloneJson(materialMaskCell),
    biomeMaskCell: cloneJson(biomeMaskCell),
    materialMaskCellId: materialMaskCell?.id ?? null,
    biomeMaskCellId: biomeMaskCell?.id ?? null,
    material: materialTag,
    biome: biomeTag,
    dominantMaterial,
    dominantBiome,
    materialWeights,
    biomeWeights,
    maskWeights: cloneJson(fixture.maskWeights),
    layerBlendPolicy: cloneJson(fixture.layerBlendPolicy),
    materialBiomeRevisionPolicy: cloneJson(fixture.materialBiomeRevisionPolicy),
    renderMaterialEcho: {
      consumerId: "render-terrain",
      gridId: materialMask.gridId,
      material: materialTag,
      biome: biomeTag,
      dominantMaterial,
      dominantBiome,
      materialWeights,
      biomeWeights,
      layerBlendPolicy: cloneJson(fixture.layerBlendPolicy),
    },
    audioVfxSurfaceEcho: {
      consumerId: "audio-vfx-surface",
      gridId: biomeMask.gridId,
      material: materialTag,
      biome: biomeTag,
      surfaceRole: biomeMaskCell?.surfaceRole ?? null,
      materialWeights,
      biomeWeights,
      maskWeights: cloneJson(fixture.maskWeights),
    },
    placementBiomeEcho: {
      consumerId: "raycast-placement",
      gridId: biomeMask.gridId,
      material: materialTag,
      biome: biomeTag,
      placementAllowed: biomeMaskCell?.placementAllowed ?? true,
      surfaceRole: biomeMaskCell?.surfaceRole ?? null,
    },
    gameplaySurfaceEcho: {
      consumerId: "gameplay-zones",
      gridId: materialMask.gridId,
      material: materialTag,
      biome: biomeTag,
      gameplayRole: biomeMaskCell?.gameplayRole ?? null,
      materialWeights,
      biomeWeights,
    },
    cell: gridAddress.cell,
    fractional: gridAddress.fractional,
  };
}

export function sampleAuthoredTerrainGround(fixture, point, { queryType = "height" } = {}) {
  const boundsHit = queryAuthoredTerrainBounds(fixture, point, { queryType });
  const samples = fixture?.heightSamples;

  if (!boundsHit.accepted || !samples || !Array.isArray(samples.values)) {
    return {
      fixtureId: fixture?.fixtureId ?? null,
      revisionId: fixture?.revisionId ?? null,
      sourceHash: fixture?.sourceHash ?? null,
      gridId: samples?.gridId ?? null,
      accepted: false,
      reason: boundsHit.reason,
      point: boundsHit.point,
      worldHeight: null,
      sourceHeight: null,
      offsetY: finiteNumber(fixture?.heightOriginOffset?.offsetY),
      normalizedHeight: null,
      normal: null,
      normalSpace: cloneJson(fixture?.normalSpace),
      slopeDegrees: null,
      slopeClass: "edge",
      walkable: false,
      movementState: "blocked",
      placementAllowed: false,
      placementState: "rejected",
      materialMaskCell: null,
      biomeMaskCell: null,
      material: null,
      biome: null,
      dominantMaterial: null,
      dominantBiome: null,
      materialWeights: null,
      biomeWeights: null,
      maskWeights: cloneJson(fixture?.maskWeights),
      layerBlendPolicy: cloneJson(fixture?.layerBlendPolicy),
      materialBiomeRevisionPolicy: cloneJson(fixture?.materialBiomeRevisionPolicy),
      sourceCellId: null,
      cell: null,
      fractional: null,
      slopeValueDomain: cloneJson(fixture?.slopeValueDomain),
      slopeClassTaxonomy: cloneJson(fixture?.slopeClassTaxonomy),
      walkableSlopeThresholds: cloneJson(fixture?.walkableSlopeThresholds),
      normalDerivation: cloneJson(fixture?.normalDerivation),
      gradientKernel: cloneJson(fixture?.gradientKernel),
      normalSlopeRevisionPolicy: cloneJson(fixture?.normalSlopeRevisionPolicy),
      renderMaterialEcho: null,
      audioVfxSurfaceEcho: null,
      placementBiomeEcho: null,
      gameplaySurfaceEcho: null,
      movementGroundEcho: null,
      placementNormalEcho: null,
    };
  }

  const samplePoint = boundsHit.clampedPoint ?? boundsHit.point;
  const groundPoint = clampPointToBounds(fixture.worldBounds, samplePoint);
  const heightHit = sampleAuthoredTerrainHeight(fixture, groundPoint);
  const gradient = createAuthoredTerrainGroundGradient(fixture, groundPoint, heightHit);
  const materialBiomeHit = sampleAuthoredTerrainMaterialBiome(fixture, groundPoint, { queryType });
  const edge = isTerrainEdgeSample(fixture.worldBounds, groundPoint);
  const slopeClass = edge ? "edge" : classifySlopeClass(fixture, gradient.slopeDegrees);
  const movementState = createMovementStateFromSlopeClass(slopeClass);
  const placementAllowed = slopeClass === "flat" || slopeClass === "walkable";
  const placementState = edge ? "edge" : (placementAllowed ? "aligned" : "rejected");
  const walkable = slopeClass !== "blocker" && slopeClass !== "edge";
  const sourceCellId = heightHit.cell?.id ?? null;

  return {
    fixtureId: fixture.fixtureId,
    revisionId: fixture.revisionId,
    sourceHash: fixture.sourceHash,
    gridId: samples.gridId,
    accepted: true,
    reason: boundsHit.reason,
    point: groundPoint,
    worldHeight: heightHit.worldHeight,
    sourceHeight: heightHit.sourceHeight,
    offsetY: heightHit.offsetY,
    normalizedHeight: heightHit.normalizedHeight,
    normal: gradient.normal,
    normalSpace: cloneJson(fixture.normalSpace),
    slopeDegrees: gradient.slopeDegrees,
    slopeClass,
    walkable,
    movementState,
    placementAllowed,
    placementState,
    materialMaskCell: cloneJson(materialBiomeHit.materialMaskCell),
    biomeMaskCell: cloneJson(materialBiomeHit.biomeMaskCell),
    material: materialBiomeHit.material,
    biome: materialBiomeHit.biome,
    dominantMaterial: materialBiomeHit.dominantMaterial,
    dominantBiome: materialBiomeHit.dominantBiome,
    materialWeights: cloneJson(materialBiomeHit.materialWeights),
    biomeWeights: cloneJson(materialBiomeHit.biomeWeights),
    maskWeights: cloneJson(materialBiomeHit.maskWeights),
    layerBlendPolicy: cloneJson(materialBiomeHit.layerBlendPolicy),
    materialBiomeRevisionPolicy: cloneJson(materialBiomeHit.materialBiomeRevisionPolicy),
    sourceCellId,
    cell: heightHit.cell,
    fractional: heightHit.fractional,
    slopeValueDomain: cloneJson(fixture.slopeValueDomain),
    slopeClassTaxonomy: cloneJson(fixture.slopeClassTaxonomy),
    walkableSlopeThresholds: cloneJson(fixture.walkableSlopeThresholds),
    normalDerivation: cloneJson(fixture.normalDerivation),
    gradientKernel: cloneJson(fixture.gradientKernel),
    normalSlopeRevisionPolicy: cloneJson(fixture.normalSlopeRevisionPolicy),
    renderMaterialEcho: materialBiomeHit.renderMaterialEcho,
    audioVfxSurfaceEcho: materialBiomeHit.audioVfxSurfaceEcho,
    placementBiomeEcho: materialBiomeHit.placementBiomeEcho,
    gameplaySurfaceEcho: materialBiomeHit.gameplaySurfaceEcho,
    movementGroundEcho: {
      consumerId: "player-movement",
      sourceCellId,
      normal: gradient.normal,
      normalSpace: cloneJson(fixture.normalSpace),
      slopeDegrees: gradient.slopeDegrees,
      slopeClass,
      movementState,
      walkable,
      walkableSlopeThresholds: cloneJson(fixture.walkableSlopeThresholds),
      normalDerivation: cloneJson(fixture.normalDerivation),
      gradientKernel: cloneJson(fixture.gradientKernel),
      material: materialBiomeHit.material,
      biome: materialBiomeHit.biome,
      materialWeights: cloneJson(materialBiomeHit.materialWeights),
      biomeWeights: cloneJson(materialBiomeHit.biomeWeights),
    },
    placementNormalEcho: {
      consumerId: "raycast-placement",
      sourceCellId,
      normal: gradient.normal,
      normalSpace: cloneJson(fixture.normalSpace),
      slopeDegrees: gradient.slopeDegrees,
      slopeClass,
      placementAllowed,
      placementState,
      walkableSlopeThresholds: cloneJson(fixture.walkableSlopeThresholds),
      normalDerivation: cloneJson(fixture.normalDerivation),
      gradientKernel: cloneJson(fixture.gradientKernel),
      material: materialBiomeHit.material,
      biome: materialBiomeHit.biome,
      materialWeights: cloneJson(materialBiomeHit.materialWeights),
      biomeWeights: cloneJson(materialBiomeHit.biomeWeights),
    },
  };
}

export function createAuthoredTerrainGroundSnapshot(fixture) {
  if (!fixture || typeof fixture !== "object") {
    return {
      gridId: null,
      normalSpace: null,
      slopeValueDomain: null,
      slopeClassTaxonomy: [],
      walkableSlopeThresholds: null,
      normalDerivation: null,
      gradientKernel: null,
      sampleGroundApi: null,
      proofPoints: [],
      consumerParity: null,
      revisionPolicy: null,
    };
  }

  const proofPoints = Array.isArray(fixture.groundProofPoints) ? fixture.groundProofPoints : [];
  return {
    gridId: fixture.heightSamples?.gridId ?? null,
    normalSpace: cloneJson(fixture.normalSpace),
    slopeValueDomain: cloneJson(fixture.slopeValueDomain),
    slopeClassTaxonomy: cloneJson(fixture.slopeClassTaxonomy),
    walkableSlopeThresholds: cloneJson(fixture.walkableSlopeThresholds),
    normalDerivation: cloneJson(fixture.normalDerivation),
    gradientKernel: cloneJson(fixture.gradientKernel),
    sampleGroundApi: cloneJson(fixture.sampleGroundApi),
    proofPoints: proofPoints.map((point) => sampleAuthoredTerrainGround(fixture, point)),
    consumerParity: cloneJson(fixture.groundConsumerParity),
    revisionPolicy: cloneJson(fixture.normalSlopeRevisionPolicy),
    materialMask: cloneJson(fixture.materialMask),
    biomeMask: cloneJson(fixture.biomeMask),
    materialTags: cloneJson(fixture.materialTags),
    biomeTags: cloneJson(fixture.biomeTags),
    maskWeights: cloneJson(fixture.maskWeights),
    layerBlendPolicy: cloneJson(fixture.layerBlendPolicy),
    materialBiomeRevisionPolicy: cloneJson(fixture.materialBiomeRevisionPolicy),
  };
}

export function createAuthoredTerrainMaterialBiomeSnapshot(fixture) {
  if (!fixture || typeof fixture !== "object") {
    return {
      materialMask: null,
      biomeMask: null,
      materialTags: [],
      biomeTags: [],
      maskWeights: null,
      layerBlendPolicy: null,
      proofPoints: [],
      consumerParity: null,
      revisionPolicy: null,
    };
  }

  const proofPoints = Array.isArray(fixture.materialBiomeProofPoints) ? fixture.materialBiomeProofPoints : [];
  return {
    materialMask: cloneJson(fixture.materialMask),
    biomeMask: cloneJson(fixture.biomeMask),
    materialTags: cloneJson(fixture.materialTags),
    biomeTags: cloneJson(fixture.biomeTags),
    maskWeights: cloneJson(fixture.maskWeights),
    layerBlendPolicy: cloneJson(fixture.layerBlendPolicy),
    proofPoints: proofPoints.map((point) => sampleAuthoredTerrainGround(fixture, point)),
    consumerParity: cloneJson(fixture.materialBiomeConsumerParity),
    revisionPolicy: cloneJson(fixture.materialBiomeRevisionPolicy),
  };
}

export function validateAuthoredTerrainSourceFixture(fixture) {
  const failures = [];
  const identityFailures = [];

  if (!fixture || typeof fixture !== "object") {
    return {
      passed: false,
      failures: ["fixture-not-object"],
      consumerValidationSkipped: true,
      snapshot: createAuthoredTerrainSourceSnapshot(null, {
        passed: false,
        failures: ["fixture-not-object"],
        consumerValidationSkipped: true,
      }),
    };
  }

  if (fixture.fixtureId !== AUTHORED_TERRAIN_FIXTURE_ID) identityFailures.push("fixture-id-mismatch");
  if (!/^goldrush\.desert\.artboard\.fixture\.\d{3}$/.test(fixture.fixtureId ?? "")) identityFailures.push("fixture-id-format-invalid");
  if (typeof fixture.revisionId !== "string" || !/^rev-[a-f0-9]{8}$/.test(fixture.revisionId)) identityFailures.push("revision-id-format-invalid");
  if (!REVISION_REASON_TAXONOMY.includes(fixture.revisionReason)) identityFailures.push("revision-reason-invalid");

  failures.push(...identityFailures);
  if (identityFailures.length > 0) {
    return {
      passed: false,
      failures,
      consumerValidationSkipped: true,
      snapshot: createAuthoredTerrainSourceSnapshot(fixture, {
        passed: false,
        failures,
        consumerValidationSkipped: true,
      }),
    };
  }

  const expectedSourceHash = deriveAuthoredTerrainSourceHash(fixture);
  const expectedRevisionId = deriveAuthoredTerrainRevisionId(fixture);
  if (fixture.sourceHash !== expectedSourceHash) failures.push("source-hash-mismatch");
  if (fixture.revisionId !== expectedRevisionId) failures.push("revision-id-not-deterministic");
  if (containsPrivatePathLikeField(fixture.authoring)) failures.push("authoring-metadata-private-path");
  validateRestartPacket(fixture, failures);
  validateBoundsScaleContract(fixture, failures);
  validateHeightSampleContract(fixture, failures);
  validateNormalSlopeContract(fixture, failures);
  validateMaterialBiomeContract(fixture, failures);
  validateConsumerEchoes(fixture, failures);

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    consumerValidationSkipped: false,
    snapshot: createAuthoredTerrainSourceSnapshot(fixture, {
      passed,
      failures,
      consumerValidationSkipped: false,
    }),
  };
}

export function detectConsumerDrift(fixture) {
  if (!fixture || !Array.isArray(fixture.consumerEchoes)) return [];
  return fixture.consumerEchoes
    .filter((consumer) => (
      consumer.fixtureId !== fixture.fixtureId
      || consumer.revisionId !== fixture.revisionId
      || consumer.sourceHash !== fixture.sourceHash
    ))
    .map((consumer) => ({
      consumerId: consumer.consumerId,
      expectedFixtureId: fixture.fixtureId,
      actualFixtureId: consumer.fixtureId,
      expectedRevisionId: fixture.revisionId,
      actualRevisionId: consumer.revisionId,
      expectedSourceHash: fixture.sourceHash,
      actualSourceHash: consumer.sourceHash,
    }));
}

function validateConsumerEchoes(fixture, failures) {
  if (!Array.isArray(fixture.consumerEchoes)) {
    failures.push("consumer-echoes-missing");
    return;
  }

  const expectedIds = new Set(AUTHORED_TERRAIN_CONSUMERS.map((consumer) => consumer.consumerId));
  const seenIds = new Set();
  for (const consumer of fixture.consumerEchoes) {
    if (!expectedIds.has(consumer.consumerId)) failures.push(`consumer-unexpected:${consumer.consumerId ?? "unknown"}`);
    if (seenIds.has(consumer.consumerId)) failures.push(`consumer-duplicate:${consumer.consumerId}`);
    seenIds.add(consumer.consumerId);
    if (consumer.fixtureId !== fixture.fixtureId) failures.push(`consumer-fixture-drift:${consumer.consumerId}`);
    if (consumer.revisionId !== fixture.revisionId) failures.push(`consumer-revision-drift:${consumer.consumerId}`);
    if (consumer.sourceHash !== fixture.sourceHash) failures.push(`consumer-source-hash-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.scaleEcho?.worldBounds, fixture.worldBounds)) failures.push(`consumer-world-bounds-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.scaleEcho?.unitScale, fixture.unitScale)) failures.push(`consumer-unit-scale-drift:${consumer.consumerId}`);
    if (consumer.scaleEcho?.originId !== fixture.origin?.originId) failures.push(`consumer-origin-drift:${consumer.consumerId}`);
    if (consumer.heightEcho?.gridId !== fixture.heightSamples?.gridId) failures.push(`consumer-height-grid-drift:${consumer.consumerId}`);
    if (consumer.heightEcho?.proofPointCount !== fixture.heightProofPoints?.length) failures.push(`consumer-height-proof-count-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.heightEcho?.sampleHeightApi, fixture.sampleHeightApi)) failures.push(`consumer-height-api-drift:${consumer.consumerId}`);
    if (consumer.groundEcho?.gridId !== fixture.heightSamples?.gridId) failures.push(`consumer-ground-grid-drift:${consumer.consumerId}`);
    if (consumer.groundEcho?.proofPointCount !== fixture.groundProofPoints?.length) failures.push(`consumer-ground-proof-count-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.groundEcho?.sampleGroundApi, fixture.sampleGroundApi)) failures.push(`consumer-ground-api-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.groundEcho?.normalSpace, fixture.normalSpace)) failures.push(`consumer-ground-normal-space-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.groundEcho?.slopeValueDomain, fixture.slopeValueDomain)) failures.push(`consumer-ground-slope-domain-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.groundEcho?.walkableSlopeThresholds, fixture.walkableSlopeThresholds)) failures.push(`consumer-ground-threshold-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.groundEcho?.normalDerivation, fixture.normalDerivation)) failures.push(`consumer-ground-derivation-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.groundEcho?.gradientKernel, fixture.gradientKernel)) failures.push(`consumer-ground-gradient-drift:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.material !== "string") failures.push(`consumer-ground-material-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.biome !== "string") failures.push(`consumer-ground-biome-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.dominantMaterial !== "string") failures.push(`consumer-ground-dominant-material-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.dominantBiome !== "string") failures.push(`consumer-ground-dominant-biome-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.materialWeights !== "object" || consumer.groundEcho.materialWeights === null) failures.push(`consumer-ground-material-weights-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.biomeWeights !== "object" || consumer.groundEcho.biomeWeights === null) failures.push(`consumer-ground-biome-weights-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.materialMaskCellId !== "string") failures.push(`consumer-ground-material-cell-missing:${consumer.consumerId}`);
    if (typeof consumer.groundEcho?.biomeMaskCellId !== "string") failures.push(`consumer-ground-biome-cell-missing:${consumer.consumerId}`);
    if (!sameValue(consumer.materialBiomeEcho?.materialTags, fixture.materialTags)) failures.push(`consumer-material-tags-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.materialBiomeEcho?.biomeTags, fixture.biomeTags)) failures.push(`consumer-biome-tags-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.materialBiomeEcho?.maskWeights, fixture.maskWeights)) failures.push(`consumer-mask-weight-domain-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.materialBiomeEcho?.layerBlendPolicy, fixture.layerBlendPolicy)) failures.push(`consumer-layer-blend-policy-drift:${consumer.consumerId}`);
    if (!sameValue(consumer.materialBiomeEcho?.materialBiomeRevisionPolicy, fixture.materialBiomeRevisionPolicy)) failures.push(`consumer-material-biome-revision-policy-drift:${consumer.consumerId}`);
    if (consumer.materialBiomeEcho?.proofPointCount !== fixture.materialBiomeProofPoints?.length) failures.push(`consumer-material-biome-proof-count-drift:${consumer.consumerId}`);
    if (consumer.ready !== true) failures.push(`consumer-not-ready:${consumer.consumerId}`);
  }

  for (const expectedId of expectedIds) {
    if (!seenIds.has(expectedId)) failures.push(`consumer-missing:${expectedId}`);
  }
}

function validateRestartPacket(fixture, failures) {
  const packet = fixture.restartPacket;
  if (!packet || typeof packet !== "object") {
    failures.push("restart-packet-missing");
    return;
  }
  for (const field of ["fixtureId", "revisionId", "sourceHash", "version", "reason", "lessonTrigger", "requiredFields"]) {
    if (!hasOwn(packet, field)) failures.push(`restart-packet-missing-${field}`);
  }
  if (packet.fixtureId !== fixture.fixtureId) failures.push("restart-packet-fixture-drift");
  if (packet.revisionId !== fixture.revisionId) failures.push("restart-packet-revision-drift");
  if (packet.sourceHash !== fixture.sourceHash) failures.push("restart-packet-source-hash-drift");
  if (!Array.isArray(packet.requiredFields) || packet.requiredFields.length < 6) failures.push("restart-packet-required-fields-incomplete");
}

function validateBoundsScaleContract(fixture, failures) {
  const coordinateSystem = fixture.coordinateSystem;
  if (coordinateSystem?.handedness !== "right-handed") failures.push("coordinate-system-handedness-invalid");
  if (coordinateSystem?.axes?.y !== "up") failures.push("coordinate-system-up-axis-invalid");
  if (coordinateSystem?.up?.axis !== "y") failures.push("coordinate-system-up-vector-axis-invalid");
  if (!sameValue(coordinateSystem?.up?.vector, { x: 0, y: 1, z: 0 })) failures.push("coordinate-system-up-vector-invalid");

  if (!Number.isFinite(fixture.unitScale?.metersPerUnit) || fixture.unitScale.metersPerUnit <= 0) failures.push("unit-scale-invalid");
  if (fixture.unitScale?.unit !== "meter") failures.push("unit-scale-unit-invalid");

  const bounds = fixture.worldBounds;
  if (!bounds || typeof bounds !== "object") {
    failures.push("world-bounds-missing");
  } else {
    if (!(bounds.minX < bounds.maxX)) failures.push("world-bounds-x-invalid");
    if (!(bounds.minZ < bounds.maxZ)) failures.push("world-bounds-z-invalid");
    if (!nearlyEqual(bounds.width, bounds.maxX - bounds.minX)) failures.push("world-bounds-width-mismatch");
    if (!nearlyEqual(bounds.depth, bounds.maxZ - bounds.minZ)) failures.push("world-bounds-depth-mismatch");
  }

  if (!fixture.origin?.originId) failures.push("origin-id-missing");
  if (!pointInsideBounds(bounds, fixture.origin)) failures.push("origin-outside-world-bounds");

  const sharedCellSize = fixture.cellSize?.height;
  for (const field of ["height", "mask", "placement", "physics"]) {
    if (!Number.isFinite(fixture.cellSize?.[field]) || fixture.cellSize[field] <= 0) failures.push(`cell-size-${field}-invalid`);
    if (fixture.cellSize?.[field] !== sharedCellSize) failures.push(`cell-size-${field}-not-shared`);
  }
  if (!Number.isFinite(fixture.cellSize?.lod) || fixture.cellSize.lod <= 0) failures.push("cell-size-lod-invalid");
  if (fixture.cellSize?.lod % sharedCellSize !== 0) failures.push("cell-size-lod-not-multiple");

  if (!(fixture.heightRange?.min < fixture.heightRange?.max)) failures.push("height-range-invalid");
  if (normalizeAuthoredTerrainHeight(fixture, fixture.heightRange?.min) !== fixture.heightRange?.normalizedMin) failures.push("height-range-normalized-min-invalid");
  if (normalizeAuthoredTerrainHeight(fixture, fixture.heightRange?.max) !== fixture.heightRange?.normalizedMax) failures.push("height-range-normalized-max-invalid");

  if (fixture.boundsPolicy?.outsidePlayable !== "reject") failures.push("bounds-policy-outside-playable-invalid");
  if (fixture.boundsPolicy?.clampAsPlayable === true) failures.push("bounds-policy-clamps-outside-as-playable");

  const allowedModes = new Set(["reject", "clamp", "nearest-edge"]);
  for (const queryType of ["height", "mask", "placement", "collider", "gameplay", "lod", "partition"]) {
    if (!allowedModes.has(fixture.queryBoundsMode?.[queryType])) failures.push(`query-bounds-mode-invalid:${queryType}`);
  }

  const insideHeight = queryAuthoredTerrainBounds(fixture, { x: fixture.origin?.x, z: fixture.origin?.z }, { queryType: "height" });
  if (insideHeight.accepted !== true || insideHeight.playable !== true) failures.push("bounds-query-inside-height-rejected");

  const outsidePoint = { x: bounds?.maxX + 1, z: bounds?.maxZ + 1 };
  const outsideHeight = queryAuthoredTerrainBounds(fixture, outsidePoint, { queryType: "height" });
  if (outsideHeight.accepted !== false || outsideHeight.playable !== false) failures.push("bounds-query-outside-height-not-rejected");

  const outsideLod = queryAuthoredTerrainBounds(fixture, outsidePoint, { queryType: "lod" });
  if (outsideLod.accepted !== true || outsideLod.playable !== false || outsideLod.mode !== "nearest-edge") failures.push("bounds-query-lod-nearest-edge-invalid");

  validateScaleProofAnchors(fixture, failures);
  validateScaleConsumers(fixture, failures);
  validateConsumerScaleEcho(fixture, failures);
  validateScaleRevisionPolicy(fixture, failures);
}

function validateScaleProofAnchors(fixture, failures) {
  const anchors = Array.isArray(fixture.scaleProofAnchors?.anchors) ? fixture.scaleProofAnchors.anchors : [];
  const routes = Array.isArray(fixture.scaleProofAnchors?.routeBudgets) ? fixture.scaleProofAnchors.routeBudgets : [];
  const expectedOriginId = fixture.origin?.originId;

  if (fixture.scaleProofAnchors?.originId !== expectedOriginId) failures.push("scale-proof-origin-drift");
  for (const anchorId of ["spawn", "mine", "cashout", "town", "rail"]) {
    const anchor = anchors.find((entry) => entry.id === anchorId);
    if (!anchor) {
      failures.push(`scale-proof-anchor-missing:${anchorId}`);
      continue;
    }
    if (anchor.originId !== expectedOriginId) failures.push(`scale-proof-anchor-origin-drift:${anchorId}`);
    if (!pointInsideBounds(fixture.worldBounds, anchor)) failures.push(`scale-proof-anchor-outside-bounds:${anchorId}`);
  }

  for (const route of routes) {
    const from = anchors.find((anchor) => anchor.id === route.from);
    const to = anchors.find((anchor) => anchor.id === route.to);
    if (!from || !to) {
      failures.push(`scale-proof-route-anchor-missing:${route.id}`);
      continue;
    }
    const meters = measureGroundDistanceMeters(fixture, from, to);
    if (meters < route.minMeters || meters > route.maxMeters) failures.push(`scale-proof-route-budget-invalid:${route.id}`);
  }
}

function validateScaleConsumers(fixture, failures) {
  for (const consumerId of ["lod", "partition"]) {
    const consumer = fixture.scaleConsumers?.[consumerId];
    if (!consumer) {
      failures.push(`scale-consumer-missing:${consumerId}`);
      continue;
    }
    if (!sameValue(consumer.worldBounds, fixture.worldBounds)) failures.push(`scale-consumer-bounds-drift:${consumerId}`);
    if (!sameValue(consumer.unitScale, fixture.unitScale)) failures.push(`scale-consumer-unit-scale-drift:${consumerId}`);
  }
}

function validateConsumerScaleEcho(fixture, failures) {
  for (const key of ["renderTerrain", "terrainCollider", "raycastPlacement"]) {
    const echo = fixture.consumerScaleEcho?.[key];
    if (!echo) {
      failures.push(`consumer-scale-echo-missing:${key}`);
      continue;
    }
    if (!sameValue(echo.worldBounds, fixture.worldBounds)) failures.push(`consumer-scale-echo-bounds-drift:${key}`);
    if (!sameValue(echo.unitScale, fixture.unitScale)) failures.push(`consumer-scale-echo-unit-scale-drift:${key}`);
    if (echo.originId !== fixture.origin?.originId) failures.push(`consumer-scale-echo-origin-drift:${key}`);
  }
}

function validateScaleRevisionPolicy(fixture, failures) {
  const policyFields = fixture.scaleRevisionPolicy?.staleWhenFieldsChange ?? [];
  for (const field of ["worldBounds", "origin", "unitScale", "cellSize"]) {
    if (!policyFields.includes(field)) failures.push(`scale-revision-policy-missing-field:${field}`);
  }
  const staleDomains = fixture.scaleRevisionPolicy?.staleDomains ?? [];
  for (const domain of ["render", "collider", "placement", "gameplay", "local-proof", "public-proof"]) {
    if (!staleDomains.includes(domain)) failures.push(`scale-revision-policy-missing-domain:${domain}`);
  }
}

function validateHeightSampleContract(fixture, failures) {
  validateHeightSampleShape(fixture, failures);
  validateHeightNormalizationPolicy(fixture, failures);
  validateHeightQueryPolicy(fixture, failures);
  validateHeightProofPoints(fixture, failures);
  validateHeightConsumerParity(fixture, failures);
  validateHeightRevisionPolicy(fixture, failures);
}

function validateHeightSampleShape(fixture, failures) {
  const samples = fixture.heightSamples;
  if (!samples || typeof samples !== "object") {
    failures.push("height-samples-missing");
    return;
  }
  if (typeof samples.gridId !== "string" || samples.gridId.length === 0) failures.push("height-samples-grid-id-missing");
  if (!Number.isInteger(samples.width) || samples.width < 2) failures.push("height-samples-width-invalid");
  if (!Number.isInteger(samples.height) || samples.height < 2) failures.push("height-samples-height-invalid");
  if (!sameValue(samples.bounds, fixture.worldBounds)) failures.push("height-samples-bounds-drift");

  const expectedSpacingX = (fixture.worldBounds.maxX - fixture.worldBounds.minX) / (samples.width - 1);
  const expectedSpacingZ = (fixture.worldBounds.maxZ - fixture.worldBounds.minZ) / (samples.height - 1);
  if (!nearlyEqual(samples.sampleSpacing?.x, expectedSpacingX)) failures.push("height-samples-spacing-x-invalid");
  if (!nearlyEqual(samples.sampleSpacing?.z, expectedSpacingZ)) failures.push("height-samples-spacing-z-invalid");

  if (!Array.isArray(samples.values) || samples.values.length !== samples.height) {
    failures.push("height-samples-row-count-invalid");
    return;
  }

  for (let rowIndex = 0; rowIndex < samples.height; rowIndex += 1) {
    const row = samples.values[rowIndex];
    if (!Array.isArray(row) || row.length !== samples.width) {
      failures.push(`height-samples-column-count-invalid:${rowIndex}`);
      continue;
    }
    for (let columnIndex = 0; columnIndex < samples.width; columnIndex += 1) {
      const value = row[columnIndex];
      if (!Number.isFinite(value)) failures.push(`height-samples-non-finite:${rowIndex}:${columnIndex}`);
      if (Number.isFinite(value) && (value < fixture.heightValueDomain?.min || value > fixture.heightValueDomain?.max)) {
        failures.push(`height-samples-out-of-range:${rowIndex}:${columnIndex}`);
      }
    }
  }
}

function validateHeightNormalizationPolicy(fixture, failures) {
  if (fixture.heightValueDomain?.finiteOnly !== true) failures.push("height-value-domain-finite-only-required");
  if (fixture.heightValueDomain?.rejectOutOfRange !== true) failures.push("height-value-domain-reject-range-required");
  if (fixture.heightValueDomain?.min !== fixture.heightRange?.min) failures.push("height-value-domain-min-drift");
  if (fixture.heightValueDomain?.max !== fixture.heightRange?.max) failures.push("height-value-domain-max-drift");
  if (fixture.heightNormalization?.storage !== "world-space") failures.push("height-normalization-storage-invalid");
  if (fixture.heightNormalization?.normalizedRangeField !== "heightRange") failures.push("height-normalization-range-field-invalid");
  if (fixture.heightOriginOffset?.originId !== fixture.origin?.originId) failures.push("height-origin-offset-origin-drift");
  if (!Number.isFinite(fixture.heightOriginOffset?.offsetY)) failures.push("height-origin-offset-invalid");
  if (fixture.heightOriginOffset?.worldHeightMode !== "source-height-plus-offset") failures.push("height-origin-offset-mode-invalid");
}

function validateHeightQueryPolicy(fixture, failures) {
  if (!["nearest", "bilinear", "barycentric", "fixed"].includes(fixture.heightInterpolationMode)) failures.push("height-interpolation-mode-invalid");
  if (fixture.heightInterpolationMode !== "bilinear") failures.push("height-interpolation-mode-not-bilinear");
  if (fixture.heightEdgePolicy?.inside !== "accept") failures.push("height-edge-inside-invalid");
  if (fixture.heightEdgePolicy?.edge !== "accept") failures.push("height-edge-edge-invalid");
  if (fixture.heightEdgePolicy?.outside !== "reject") failures.push("height-edge-outside-invalid");
  if (fixture.sampleHeightApi?.name !== "sampleHeight") failures.push("height-api-name-invalid");
  if (fixture.sampleHeightApi?.public !== true) failures.push("height-api-not-public");

  const requiredFields = ["fixtureId", "revisionId", "sourceHash", "gridId", "accepted", "worldHeight", "sourceHeight", "offsetY", "normalizedHeight", "cell", "fractional"];
  for (const field of requiredFields) {
    if (!fixture.sampleHeightApi?.returnFields?.includes(field)) failures.push(`height-api-missing-field:${field}`);
  }

  const originHit = sampleAuthoredTerrainHeight(fixture, fixture.origin);
  if (!originHit.accepted || !Number.isFinite(originHit.worldHeight)) failures.push("height-query-origin-invalid");
  if (!originHit.cell?.id || !Number.isInteger(originHit.cell.index)) failures.push("height-query-cell-address-invalid");
  if (!Number.isFinite(originHit.fractional?.column) || !Number.isFinite(originHit.fractional?.row)) failures.push("height-query-fractional-address-invalid");

  const edgeHit = sampleAuthoredTerrainHeight(fixture, { x: fixture.worldBounds.minX, z: fixture.worldBounds.minZ });
  if (!edgeHit.accepted || edgeHit.worldHeight !== fixture.heightSamples.values[0][0]) failures.push("height-query-edge-invalid");

  const outsideHit = sampleAuthoredTerrainHeight(fixture, { x: fixture.worldBounds.maxX + 10, z: fixture.worldBounds.maxZ + 10 });
  if (outsideHit.accepted !== false || outsideHit.worldHeight !== null) failures.push("height-query-outside-not-rejected");
}

function validateHeightProofPoints(fixture, failures) {
  const proofPoints = Array.isArray(fixture.heightProofPoints) ? fixture.heightProofPoints : [];
  const expectedIds = ["spawn", "mine", "cashout", "rail", "central-blocker"];
  for (const expectedId of expectedIds) {
    const point = proofPoints.find((entry) => entry.id === expectedId);
    if (!point) {
      failures.push(`height-proof-point-missing:${expectedId}`);
      continue;
    }
    const hit = sampleAuthoredTerrainHeight(fixture, point);
    if (!hit.accepted) failures.push(`height-proof-point-rejected:${expectedId}`);
    if (!Number.isFinite(hit.worldHeight)) failures.push(`height-proof-point-non-finite:${expectedId}`);
    if (!nearlyEqual(point.expectedWorldHeight, hit.worldHeight)) failures.push(`height-proof-point-world-height-drift:${expectedId}`);
    if (!nearlyEqual(point.expectedNormalizedHeight, hit.normalizedHeight)) failures.push(`height-proof-point-normalized-height-drift:${expectedId}`);
    if (point.gridId !== fixture.heightSamples?.gridId) failures.push(`height-proof-point-grid-drift:${expectedId}`);
    if (point.revisionEcho !== fixture.revisionId && point.revisionEcho !== "pending-revision") failures.push(`height-proof-point-revision-drift:${expectedId}`);
  }
}

function validateHeightConsumerParity(fixture, failures) {
  const parity = fixture.heightConsumerParity;
  if (!parity || typeof parity !== "object") {
    failures.push("height-consumer-parity-missing");
    return;
  }
  for (const key of ["renderTerrain", "terrainCollider", "raycastPlacement", "playerMovement"]) {
    const consumer = parity[key];
    if (!consumer) {
      failures.push(`height-consumer-parity-missing:${key}`);
      continue;
    }
    if (consumer.gridId !== fixture.heightSamples?.gridId) failures.push(`height-consumer-parity-grid-drift:${key}`);
    if (consumer.interpolation !== fixture.heightInterpolationMode) failures.push(`height-consumer-parity-interpolation-drift:${key}`);
    for (const point of fixture.heightProofPoints ?? []) {
      const echo = consumer.samples?.find((entry) => entry.id === point.id);
      if (!echo) {
        failures.push(`height-consumer-parity-sample-missing:${key}:${point.id}`);
        continue;
      }
      const hit = sampleAuthoredTerrainHeight(fixture, point);
      if (!nearlyEqual(echo.worldHeight, hit.worldHeight)) failures.push(`height-consumer-parity-world-height-drift:${key}:${point.id}`);
      if (echo.cellId !== hit.cell?.id) failures.push(`height-consumer-parity-cell-drift:${key}:${point.id}`);
    }
  }
}

function validateHeightRevisionPolicy(fixture, failures) {
  const policyFields = fixture.heightRevisionPolicy?.staleWhenFieldsChange ?? [];
  for (const field of ["heightSamples", "heightValueDomain", "heightNormalization", "heightOriginOffset", "heightInterpolationMode", "heightEdgePolicy"]) {
    if (!policyFields.includes(field)) failures.push(`height-revision-policy-missing-field:${field}`);
  }
  const staleDomains = fixture.heightRevisionPolicy?.staleDomains ?? [];
  for (const domain of ["render", "collider", "movement", "placement", "gameplay", "screenshot-proof", "public-proof"]) {
    if (!staleDomains.includes(domain)) failures.push(`height-revision-policy-missing-domain:${domain}`);
  }
}

function validateNormalSlopeContract(fixture, failures) {
  validateNormalSpaceContract(fixture, failures);
  validateSlopeValueDomain(fixture, failures);
  validateSlopeClassTaxonomy(fixture, failures);
  validateWalkableSlopeThresholds(fixture, failures);
  validateNormalDerivationSource(fixture, failures);
  validateGradientSampleNeighborhood(fixture, failures);
  validateSampleGroundApiShape(fixture, failures);
  validateGroundProofPoints(fixture, failures);
  validateGroundConsumerParity(fixture, failures);
  validateNormalSlopeRevisionPolicy(fixture, failures);
}

function validateMaterialBiomeContract(fixture, failures) {
  validateMaterialMaskSchema(fixture, failures);
  validateBiomeMaskSchema(fixture, failures);
  validateMaterialTagTaxonomy(fixture, failures);
  validateBiomeTagTaxonomy(fixture, failures);
  validateMaskWeightDomain(fixture, failures);
  validateLayerPriorityAndBlendPolicy(fixture, failures);
  validateMaterialBiomeProofPoints(fixture, failures);
  validateMaterialBiomeConsumerParity(fixture, failures);
  validateMaterialBiomeRevisionPolicy(fixture, failures);
}

function validateMaterialMaskSchema(fixture, failures) {
  const materialMask = fixture.materialMask;
  if (!materialMask || typeof materialMask !== "object") {
    failures.push("material-mask-missing");
    return;
  }
  if (materialMask.gridId !== "material-mask-001") failures.push("material-mask-grid-id-invalid");
  if (materialMask.coordinateSpace !== "world-xz") failures.push("material-mask-coordinate-space-invalid");
  if (materialMask.sampleOrder !== "row-major-z-then-x") failures.push("material-mask-sample-order-invalid");
  if (materialMask.baseMaterial !== DEFAULT_LAYER_BLEND_POLICY.baseMaterial) failures.push("material-mask-base-material-invalid");
  if (!Array.isArray(materialMask.tagTaxonomy) || materialMask.tagTaxonomy.length !== DEFAULT_MATERIAL_TAG_TAXONOMY.length) failures.push("material-mask-tag-taxonomy-invalid");
  if (!Array.isArray(materialMask.cells) || materialMask.cells.length !== fixture.heightSamples?.height) failures.push("material-mask-row-count-invalid");
  for (const [rowIndex, row] of (materialMask.cells ?? []).entries()) {
    if (!Array.isArray(row) || row.length !== fixture.heightSamples?.width) {
      failures.push(`material-mask-column-count-invalid:${rowIndex}`);
      continue;
    }
    for (const [columnIndex, cell] of row.entries()) {
      validateSurfaceMaskCell(cell, {
        failures,
        prefix: `material-mask-cell:${rowIndex}:${columnIndex}`,
        taxonomy: fixture.materialTags,
        baseTag: fixture.materialMask?.baseMaterial,
        dominantField: "dominantMaterial",
        inheritedField: "inheritedBaseMaterial",
        roleField: "surfaceRole",
      });
      validateMaskWeights(cell?.weights, fixture.maskWeights, failures, `material-mask-weights:${rowIndex}:${columnIndex}`);
    }
  }
}

function validateBiomeMaskSchema(fixture, failures) {
  const biomeMask = fixture.biomeMask;
  if (!biomeMask || typeof biomeMask !== "object") {
    failures.push("biome-mask-missing");
    return;
  }
  if (biomeMask.gridId !== "biome-mask-001") failures.push("biome-mask-grid-id-invalid");
  if (biomeMask.coordinateSpace !== "world-xz") failures.push("biome-mask-coordinate-space-invalid");
  if (biomeMask.sampleOrder !== "row-major-z-then-x") failures.push("biome-mask-sample-order-invalid");
  if (biomeMask.baseBiome !== DEFAULT_LAYER_BLEND_POLICY.baseBiome) failures.push("biome-mask-base-biome-invalid");
  if (!Array.isArray(biomeMask.tagTaxonomy) || biomeMask.tagTaxonomy.length !== DEFAULT_BIOME_TAG_TAXONOMY.length) failures.push("biome-mask-tag-taxonomy-invalid");
  if (!Array.isArray(biomeMask.cells) || biomeMask.cells.length !== fixture.heightSamples?.height) failures.push("biome-mask-row-count-invalid");
  for (const [rowIndex, row] of (biomeMask.cells ?? []).entries()) {
    if (!Array.isArray(row) || row.length !== fixture.heightSamples?.width) {
      failures.push(`biome-mask-column-count-invalid:${rowIndex}`);
      continue;
    }
    for (const [columnIndex, cell] of row.entries()) {
      validateSurfaceMaskCell(cell, {
        failures,
        prefix: `biome-mask-cell:${rowIndex}:${columnIndex}`,
        taxonomy: fixture.biomeTags,
        baseTag: fixture.biomeMask?.baseBiome,
        dominantField: "dominantBiome",
        inheritedField: "inheritedBaseBiome",
        roleField: "surfaceRole",
      });
      if (typeof cell?.placementAllowed !== "boolean") failures.push(`biome-mask-placement-allowed-invalid:${rowIndex}:${columnIndex}`);
      if (typeof cell?.gameplayRole !== "string" || cell.gameplayRole.length === 0) failures.push(`biome-mask-gameplay-role-invalid:${rowIndex}:${columnIndex}`);
      validateMaskWeights(cell?.weights, fixture.maskWeights, failures, `biome-mask-weights:${rowIndex}:${columnIndex}`);
    }
  }
}

function validateSurfaceMaskCell(cell, { failures, prefix, taxonomy, baseTag, dominantField, inheritedField, roleField }) {
  if (!cell || typeof cell !== "object") {
    failures.push(`${prefix}-missing`);
    return;
  }
  if (typeof cell.id !== "string" || cell.id.length === 0) failures.push(`${prefix}-id-invalid`);
  if (!taxonomy?.includes(cell[dominantField])) failures.push(`${prefix}-dominant-tag-invalid`);
  if (typeof cell[roleField] !== "string" || cell[roleField].length === 0) failures.push(`${prefix}-role-invalid`);
  if (typeof cell.weights !== "object" || cell.weights === null) failures.push(`${prefix}-weights-missing`);
  for (const tag of Object.keys(cell.weights ?? {})) {
    if (!taxonomy?.includes(tag)) failures.push(`${prefix}-weight-tag-invalid:${tag}`);
  }
  if (cell.baseMaterial && dominantField === "dominantMaterial" && cell.baseMaterial !== baseTag) failures.push(`${prefix}-base-material-drift`);
  if (cell.baseBiome && dominantField === "dominantBiome" && cell.baseBiome !== baseTag) failures.push(`${prefix}-base-biome-drift`);
  if (typeof cell[inheritedField] !== "boolean") failures.push(`${prefix}-inherited-base-invalid`);
  if (typeof cell.blendMode !== "string" || cell.blendMode.length === 0) failures.push(`${prefix}-blend-mode-invalid`);
}

function validateMaskWeights(weights, domain, failures, prefix) {
  if (!weights || typeof weights !== "object") {
    failures.push(`${prefix}-missing`);
    return;
  }
  let total = 0;
  for (const [tag, value] of Object.entries(weights)) {
    if (!Number.isFinite(value)) failures.push(`${prefix}-non-finite:${tag}`);
    if (value < domain.min) failures.push(`${prefix}-negative:${tag}`);
    if (value > domain.max) failures.push(`${prefix}-over-one:${tag}`);
    total += value;
  }
  if (total < domain.sumMin || total > domain.sumMax) failures.push(`${prefix}-sum-invalid`);
}

function validateMaterialTagTaxonomy(fixture, failures) {
  const taxonomy = Array.isArray(fixture.materialTags) ? fixture.materialTags : [];
  if (taxonomy.length !== DEFAULT_MATERIAL_TAG_TAXONOMY.length) failures.push("material-tag-taxonomy-length-invalid");
  for (const tag of DEFAULT_MATERIAL_TAG_TAXONOMY) {
    if (!taxonomy.includes(tag)) failures.push(`material-tag-taxonomy-missing:${tag}`);
  }
}

function validateBiomeTagTaxonomy(fixture, failures) {
  const taxonomy = Array.isArray(fixture.biomeTags) ? fixture.biomeTags : [];
  if (taxonomy.length !== DEFAULT_BIOME_TAG_TAXONOMY.length) failures.push("biome-tag-taxonomy-length-invalid");
  for (const tag of DEFAULT_BIOME_TAG_TAXONOMY) {
    if (!taxonomy.includes(tag)) failures.push(`biome-tag-taxonomy-missing:${tag}`);
  }
}

function validateMaskWeightDomain(fixture, failures) {
  const domain = fixture.maskWeights;
  if (!domain || typeof domain !== "object") {
    failures.push("mask-weight-domain-missing");
    return;
  }
  if (domain.min !== 0) failures.push("mask-weight-domain-min-invalid");
  if (domain.max !== 1) failures.push("mask-weight-domain-max-invalid");
  if (domain.sumMin < 0.99 || domain.sumMax > 1.01) failures.push("mask-weight-domain-sum-window-invalid");
  if (domain.finiteOnly !== true) failures.push("mask-weight-domain-finite-only-invalid");
  if (domain.rejectNegative !== true) failures.push("mask-weight-domain-reject-negative-invalid");
  if (domain.rejectOutOfRange !== true) failures.push("mask-weight-domain-reject-out-of-range-invalid");
}

function validateLayerPriorityAndBlendPolicy(fixture, failures) {
  const policy = fixture.layerBlendPolicy;
  if (!policy || typeof policy !== "object") {
    failures.push("layer-blend-policy-missing");
    return;
  }
  if (policy.baseMaterial !== DEFAULT_LAYER_BLEND_POLICY.baseMaterial) failures.push("layer-blend-policy-base-material-invalid");
  if (policy.baseBiome !== DEFAULT_LAYER_BLEND_POLICY.baseBiome) failures.push("layer-blend-policy-base-biome-invalid");
  if (policy.blendMode !== DEFAULT_LAYER_BLEND_POLICY.blendMode) failures.push("layer-blend-policy-blend-mode-invalid");
  if (policy.tieBreak !== DEFAULT_LAYER_BLEND_POLICY.tieBreak) failures.push("layer-blend-policy-tie-break-invalid");
}

function validateMaterialBiomeProofPoints(fixture, failures) {
  const proofPoints = Array.isArray(fixture.materialBiomeProofPoints) ? fixture.materialBiomeProofPoints : [];
  const expectedIds = ["spawn", "mine", "cashout", "rail", "town", "edge"];
  for (const expectedId of expectedIds) {
    const point = proofPoints.find((entry) => entry.id === expectedId);
    if (!point) {
      failures.push(`material-biome-proof-point-missing:${expectedId}`);
      continue;
    }
    const hit = sampleAuthoredTerrainGround(fixture, point);
    if (expectedId === "edge" && hit.slopeClass !== "edge") failures.push("material-biome-proof-point-edge-class-invalid");
    if (point.expectedMaterial !== hit.material) failures.push(`material-biome-proof-point-material-drift:${expectedId}`);
    if (point.expectedBiome !== hit.biome) failures.push(`material-biome-proof-point-biome-drift:${expectedId}`);
    if (point.expectedDominantMaterial !== hit.dominantMaterial) failures.push(`material-biome-proof-point-dominant-material-drift:${expectedId}`);
    if (point.expectedDominantBiome !== hit.dominantBiome) failures.push(`material-biome-proof-point-dominant-biome-drift:${expectedId}`);
    if (!sameValue(point.expectedMaterialWeights, hit.materialWeights)) failures.push(`material-biome-proof-point-material-weights-drift:${expectedId}`);
    if (!sameValue(point.expectedBiomeWeights, hit.biomeWeights)) failures.push(`material-biome-proof-point-biome-weights-drift:${expectedId}`);
    if (!sameValue(point.expectedRenderMaterial, hit.renderMaterialEcho)) failures.push(`material-biome-proof-point-render-echo-drift:${expectedId}`);
    if (!sameValue(point.expectedAudioVfxSurface, hit.audioVfxSurfaceEcho)) failures.push(`material-biome-proof-point-audio-echo-drift:${expectedId}`);
    if (!sameValue(point.expectedPlacementBiome, hit.placementBiomeEcho)) failures.push(`material-biome-proof-point-placement-echo-drift:${expectedId}`);
    if (!sameValue(point.expectedGameplaySurface, hit.gameplaySurfaceEcho)) failures.push(`material-biome-proof-point-gameplay-echo-drift:${expectedId}`);
    if (point.materialMaskCellId !== hit.materialMaskCell?.id) failures.push(`material-biome-proof-point-material-cell-drift:${expectedId}`);
    if (point.biomeMaskCellId !== hit.biomeMaskCell?.id) failures.push(`material-biome-proof-point-biome-cell-drift:${expectedId}`);
    if (point.revisionEcho !== fixture.revisionId && point.revisionEcho !== "pending-revision") failures.push(`material-biome-proof-point-revision-drift:${expectedId}`);
  }
}

function validateMaterialBiomeConsumerParity(fixture, failures) {
  const parity = fixture.materialBiomeConsumerParity;
  if (!parity || typeof parity !== "object") {
    failures.push("material-biome-consumer-parity-missing");
    return;
  }
  for (const key of ["renderTerrain", "audioVfxSurface", "raycastPlacement", "gameplayZones"]) {
    const consumer = parity[key];
    if (!consumer) {
      failures.push(`material-biome-consumer-parity-missing:${key}`);
      continue;
    }
    if (consumer.gridId !== fixture.heightSamples?.gridId) failures.push(`material-biome-consumer-parity-grid-drift:${key}`);
    if (!sameValue(consumer.materialTags, fixture.materialTags)) failures.push(`material-biome-consumer-parity-material-tags-drift:${key}`);
    if (!sameValue(consumer.biomeTags, fixture.biomeTags)) failures.push(`material-biome-consumer-parity-biome-tags-drift:${key}`);
    if (!sameValue(consumer.maskWeights, fixture.maskWeights)) failures.push(`material-biome-consumer-parity-weight-domain-drift:${key}`);
    if (!sameValue(consumer.layerBlendPolicy, fixture.layerBlendPolicy)) failures.push(`material-biome-consumer-parity-blend-policy-drift:${key}`);
    if (!sameValue(consumer.materialBiomeRevisionPolicy, fixture.materialBiomeRevisionPolicy)) failures.push(`material-biome-consumer-parity-revision-policy-drift:${key}`);
    for (const point of fixture.materialBiomeProofPoints ?? []) {
      const echo = consumer.samples?.find((entry) => entry.id === point.id);
      if (!echo) {
        failures.push(`material-biome-consumer-parity-sample-missing:${key}:${point.id}`);
        continue;
      }
      const hit = sampleAuthoredTerrainGround(fixture, point);
      if (echo.material !== hit.material) failures.push(`material-biome-consumer-parity-material-drift:${key}:${point.id}`);
      if (echo.biome !== hit.biome) failures.push(`material-biome-consumer-parity-biome-drift:${key}:${point.id}`);
      if (echo.dominantMaterial !== hit.dominantMaterial) failures.push(`material-biome-consumer-parity-dominant-material-drift:${key}:${point.id}`);
      if (echo.dominantBiome !== hit.dominantBiome) failures.push(`material-biome-consumer-parity-dominant-biome-drift:${key}:${point.id}`);
      if (!sameValue(echo.materialWeights, hit.materialWeights)) failures.push(`material-biome-consumer-parity-material-weights-drift:${key}:${point.id}`);
      if (!sameValue(echo.biomeWeights, hit.biomeWeights)) failures.push(`material-biome-consumer-parity-biome-weights-drift:${key}:${point.id}`);
      if (echo.materialMaskCellId !== hit.materialMaskCell?.id) failures.push(`material-biome-consumer-parity-material-cell-drift:${key}:${point.id}`);
      if (echo.biomeMaskCellId !== hit.biomeMaskCell?.id) failures.push(`material-biome-consumer-parity-biome-cell-drift:${key}:${point.id}`);
    }
  }
}

function validateMaterialBiomeRevisionPolicy(fixture, failures) {
  const policy = fixture.materialBiomeRevisionPolicy;
  if (!policy || typeof policy !== "object") {
    failures.push("material-biome-revision-policy-missing");
    return;
  }
  const policyFields = policy.staleWhenFieldsChange ?? [];
  for (const field of ["materialMask", "biomeMask", "materialTags", "biomeTags", "maskWeights", "layerBlendPolicy", "sampleGroundApi"]) {
    if (!policyFields.includes(field)) failures.push(`material-biome-revision-policy-missing-field:${field}`);
  }
  const staleDomains = policy.staleDomains ?? [];
  for (const domain of ["render", "audio", "vfx", "placement", "gameplay", "screenshot-proof", "public-proof"]) {
    if (!staleDomains.includes(domain)) failures.push(`material-biome-revision-policy-missing-domain:${domain}`);
  }
}

function validateNormalSpaceContract(fixture, failures) {
  const normalSpace = fixture.normalSpace;
  if (!normalSpace || typeof normalSpace !== "object") {
    failures.push("normal-space-missing");
    return;
  }
  if (normalSpace.coordinateSpace !== "world-space") failures.push("normal-space-coordinate-space-invalid");
  if (normalSpace.handedness !== "right-handed") failures.push("normal-space-handedness-invalid");
  if (normalSpace.upAxis !== "y") failures.push("normal-space-up-axis-invalid");
  if (normalSpace.vectorFormat !== "xyz") failures.push("normal-space-vector-format-invalid");
  if (normalSpace.unitLength !== true) failures.push("normal-space-unit-length-invalid");
}

function validateSlopeValueDomain(fixture, failures) {
  const slopeValueDomain = fixture.slopeValueDomain;
  if (!slopeValueDomain || typeof slopeValueDomain !== "object") {
    failures.push("slope-value-domain-missing");
    return;
  }
  if (slopeValueDomain.unit !== "degrees") failures.push("slope-value-domain-unit-invalid");
  if (slopeValueDomain.min !== 0) failures.push("slope-value-domain-min-invalid");
  if (slopeValueDomain.max !== 90) failures.push("slope-value-domain-max-invalid");
  if (slopeValueDomain.finiteOnly !== true) failures.push("slope-value-domain-finite-only-required");
  if (slopeValueDomain.rejectOutOfRange !== true) failures.push("slope-value-domain-reject-range-required");
}

function validateSlopeClassTaxonomy(fixture, failures) {
  const taxonomy = Array.isArray(fixture.slopeClassTaxonomy) ? fixture.slopeClassTaxonomy : [];
  const expectedIds = ["flat", "walkable", "steep", "blocker", "edge"];
  if (taxonomy.length !== expectedIds.length) failures.push("slope-class-taxonomy-length-invalid");
  for (const expectedId of expectedIds) {
    const entry = taxonomy.find((item) => item.id === expectedId);
    if (!entry) {
      failures.push(`slope-class-taxonomy-missing:${expectedId}`);
      continue;
    }
    if (expectedId !== "edge") {
      if (!Number.isFinite(entry.minDegrees) || !Number.isFinite(entry.maxDegrees)) failures.push(`slope-class-taxonomy-bounds-invalid:${expectedId}`);
      if (!(entry.minDegrees < entry.maxDegrees)) failures.push(`slope-class-taxonomy-order-invalid:${expectedId}`);
    }
    if (typeof entry.walkable !== "boolean") failures.push(`slope-class-taxonomy-walkable-invalid:${expectedId}`);
    if (typeof entry.movementState !== "string" || entry.movementState.length === 0) failures.push(`slope-class-taxonomy-movement-state-invalid:${expectedId}`);
  }
  if (taxonomy[0]?.id !== "flat" || taxonomy[1]?.id !== "walkable" || taxonomy[2]?.id !== "steep" || taxonomy[3]?.id !== "blocker" || taxonomy[4]?.id !== "edge") {
    failures.push("slope-class-taxonomy-order-invalid");
  }
}

function validateWalkableSlopeThresholds(fixture, failures) {
  const thresholds = fixture.walkableSlopeThresholds;
  if (!thresholds || typeof thresholds !== "object") {
    failures.push("walkable-slope-thresholds-missing");
    return;
  }
  for (const field of ["walkDegrees", "slowDegrees", "slideDegrees", "blockedDegrees"]) {
    if (!Number.isFinite(thresholds[field])) failures.push(`walkable-slope-thresholds-${field}-invalid`);
  }
  if (!(thresholds.walkDegrees < thresholds.slowDegrees)) failures.push("walkable-slope-thresholds-walk-order-invalid");
  if (!(thresholds.slowDegrees < thresholds.slideDegrees)) failures.push("walkable-slope-thresholds-slow-order-invalid");
  if (!(thresholds.slideDegrees <= thresholds.blockedDegrees)) failures.push("walkable-slope-thresholds-slide-order-invalid");
  const taxonomy = Array.isArray(fixture.slopeClassTaxonomy) ? fixture.slopeClassTaxonomy : [];
  if (taxonomy[0]?.maxDegrees !== thresholds.walkDegrees) failures.push("walkable-slope-thresholds-flat-boundary-drift");
  if (taxonomy[1]?.maxDegrees !== thresholds.slowDegrees) failures.push("walkable-slope-thresholds-walkable-boundary-drift");
  if (taxonomy[2]?.maxDegrees !== thresholds.slideDegrees) failures.push("walkable-slope-thresholds-steep-boundary-drift");
}

function validateNormalDerivationSource(fixture, failures) {
  const normalDerivation = fixture.normalDerivation;
  if (!normalDerivation || typeof normalDerivation !== "object") {
    failures.push("normal-derivation-missing");
    return;
  }
  if (normalDerivation.source !== "height-gradient") failures.push("normal-derivation-source-invalid");
  if (normalDerivation.method !== "central-difference") failures.push("normal-derivation-method-invalid");
  if (normalDerivation.neighborhood !== "clamped-1-cell-cross") failures.push("normal-derivation-neighborhood-invalid");
  if (normalDerivation.outputSpace !== "world-space") failures.push("normal-derivation-output-space-invalid");
  if (normalDerivation.sampleHeightApi !== "sampleHeight") failures.push("normal-derivation-sample-height-api-invalid");
}

function validateGradientSampleNeighborhood(fixture, failures) {
  const gradientKernel = fixture.gradientKernel;
  if (!gradientKernel || typeof gradientKernel !== "object") {
    failures.push("gradient-kernel-missing");
    return;
  }
  if (gradientKernel.xStepCells !== 1) failures.push("gradient-kernel-x-step-invalid");
  if (gradientKernel.zStepCells !== 1) failures.push("gradient-kernel-z-step-invalid");
  if (gradientKernel.edgeBehavior !== "clamp-to-edge") failures.push("gradient-kernel-edge-behavior-invalid");
  if (gradientKernel.sampleShape !== "cross") failures.push("gradient-kernel-sample-shape-invalid");
  if (gradientKernel.usesHeightSamples !== true) failures.push("gradient-kernel-uses-height-samples-invalid");
}

function validateSampleGroundApiShape(fixture, failures) {
  const api = fixture.sampleGroundApi;
  if (!api || typeof api !== "object") {
    failures.push("sample-ground-api-missing");
    return;
  }
  if (api.name !== "sampleGround") failures.push("sample-ground-api-name-invalid");
  if (api.public !== true) failures.push("sample-ground-api-not-public");
  const requiredFields = [
    "fixtureId",
    "revisionId",
    "sourceHash",
    "gridId",
    "accepted",
    "worldHeight",
    "normal",
    "normalSpace",
    "slopeDegrees",
    "slopeClass",
    "walkable",
    "movementState",
    "placementAllowed",
    "walkableSlopeThresholds",
    "normalDerivation",
    "gradientKernel",
    "material",
    "biome",
    "materialMaskCell",
    "biomeMaskCell",
    "materialWeights",
    "biomeWeights",
    "layerBlendPolicy",
    "materialBiomeRevisionPolicy",
    "renderMaterialEcho",
    "audioVfxSurfaceEcho",
    "placementBiomeEcho",
    "gameplaySurfaceEcho",
    "movementGroundEcho",
    "placementNormalEcho",
    "sourceCellId",
    "cell",
    "fractional",
  ];
  for (const field of requiredFields) {
    if (!api.returnFields?.includes(field)) failures.push(`sample-ground-api-missing-field:${field}`);
  }
}

function validateGroundProofPoints(fixture, failures) {
  const proofPoints = Array.isArray(fixture.groundProofPoints) ? fixture.groundProofPoints : [];
  const expectedIds = ["spawn", "mine", "cashout", "rail", "central-blocker", "edge"];
  for (const expectedId of expectedIds) {
    const point = proofPoints.find((entry) => entry.id === expectedId);
    if (!point) {
      failures.push(`ground-proof-point-missing:${expectedId}`);
      continue;
    }
    const hit = sampleAuthoredTerrainGround(fixture, point);
    if (expectedId === "edge") {
      if (hit.slopeClass !== "edge") failures.push("ground-proof-point-edge-class-invalid");
    } else if (!hit.accepted) {
      failures.push(`ground-proof-point-rejected:${expectedId}`);
    }
    if (!Number.isFinite(hit.worldHeight)) failures.push(`ground-proof-point-world-height-invalid:${expectedId}`);
    if (!isFiniteVector3(hit.normal)) failures.push(`ground-proof-point-normal-invalid:${expectedId}`);
    if (!nearlyUnitVector3(hit.normal)) failures.push(`ground-proof-point-normal-not-unit:${expectedId}`);
    if (!Number.isFinite(hit.slopeDegrees) || hit.slopeDegrees < fixture.slopeValueDomain?.min || hit.slopeDegrees > fixture.slopeValueDomain?.max) failures.push(`ground-proof-point-slope-invalid:${expectedId}`);
    if (point.gridId !== fixture.heightSamples?.gridId) failures.push(`ground-proof-point-grid-drift:${expectedId}`);
    if (point.revisionEcho !== fixture.revisionId && point.revisionEcho !== "pending-revision") failures.push(`ground-proof-point-revision-drift:${expectedId}`);
    if (!sameValue(point.expectedNormal, hit.normal)) failures.push(`ground-proof-point-normal-drift:${expectedId}`);
    if (!nearlyEqual(point.expectedSlopeDegrees, hit.slopeDegrees)) failures.push(`ground-proof-point-slope-degrees-drift:${expectedId}`);
    if (point.expectedSlopeClass !== hit.slopeClass) failures.push(`ground-proof-point-slope-class-drift:${expectedId}`);
    if (point.expectedWalkable !== hit.walkable) failures.push(`ground-proof-point-walkable-drift:${expectedId}`);
    if (point.expectedMovementState !== hit.movementState) failures.push(`ground-proof-point-movement-state-drift:${expectedId}`);
    if (point.expectedPlacementAllowed !== hit.placementAllowed) failures.push(`ground-proof-point-placement-allowed-drift:${expectedId}`);
    if (point.expectedMaterial !== hit.material) failures.push(`ground-proof-point-material-drift:${expectedId}`);
    if (point.expectedBiome !== hit.biome) failures.push(`ground-proof-point-biome-drift:${expectedId}`);
    if (point.expectedDominantMaterial !== hit.dominantMaterial) failures.push(`ground-proof-point-dominant-material-drift:${expectedId}`);
    if (point.expectedDominantBiome !== hit.dominantBiome) failures.push(`ground-proof-point-dominant-biome-drift:${expectedId}`);
    if (!sameValue(point.expectedMaterialWeights, hit.materialWeights)) failures.push(`ground-proof-point-material-weights-drift:${expectedId}`);
    if (!sameValue(point.expectedBiomeWeights, hit.biomeWeights)) failures.push(`ground-proof-point-biome-weights-drift:${expectedId}`);
    if (!sameValue(point.expectedRenderMaterial, hit.renderMaterialEcho)) failures.push(`ground-proof-point-render-echo-drift:${expectedId}`);
    if (!sameValue(point.expectedAudioVfxSurface, hit.audioVfxSurfaceEcho)) failures.push(`ground-proof-point-audio-echo-drift:${expectedId}`);
    if (!sameValue(point.expectedPlacementBiome, hit.placementBiomeEcho)) failures.push(`ground-proof-point-placement-biome-drift:${expectedId}`);
    if (!sameValue(point.expectedGameplaySurface, hit.gameplaySurfaceEcho)) failures.push(`ground-proof-point-gameplay-surface-drift:${expectedId}`);
    if (point.materialMaskCellId !== hit.materialMaskCell?.id) failures.push(`ground-proof-point-material-cell-drift:${expectedId}`);
    if (point.biomeMaskCellId !== hit.biomeMaskCell?.id) failures.push(`ground-proof-point-biome-cell-drift:${expectedId}`);
    if (point.sourceCellId !== hit.sourceCellId) failures.push(`ground-proof-point-source-cell-drift:${expectedId}`);
    if (hit.movementGroundEcho?.consumerId !== "player-movement") failures.push(`ground-proof-point-movement-echo-missing:${expectedId}`);
    if (hit.placementNormalEcho?.consumerId !== "raycast-placement") failures.push(`ground-proof-point-placement-echo-missing:${expectedId}`);
  }
}

function validateGroundConsumerParity(fixture, failures) {
  const parity = fixture.groundConsumerParity;
  if (!parity || typeof parity !== "object") {
    failures.push("ground-consumer-parity-missing");
    return;
  }
  for (const key of ["renderTerrain", "terrainCollider", "raycastPlacement", "playerMovement"]) {
    const consumer = parity[key];
    if (!consumer) {
      failures.push(`ground-consumer-parity-missing:${key}`);
      continue;
    }
    if (consumer.gridId !== fixture.heightSamples?.gridId) failures.push(`ground-consumer-parity-grid-drift:${key}`);
    if (!sameValue(consumer.sampleGroundApi, fixture.sampleGroundApi)) failures.push(`ground-consumer-parity-api-drift:${key}`);
    if (!sameValue(consumer.normalSpace, fixture.normalSpace)) failures.push(`ground-consumer-parity-normal-space-drift:${key}`);
    if (!sameValue(consumer.slopeValueDomain, fixture.slopeValueDomain)) failures.push(`ground-consumer-parity-slope-domain-drift:${key}`);
    if (!sameValue(consumer.walkableSlopeThresholds, fixture.walkableSlopeThresholds)) failures.push(`ground-consumer-parity-threshold-drift:${key}`);
    if (!sameValue(consumer.normalDerivation, fixture.normalDerivation)) failures.push(`ground-consumer-parity-derivation-drift:${key}`);
    if (!sameValue(consumer.gradientKernel, fixture.gradientKernel)) failures.push(`ground-consumer-parity-gradient-drift:${key}`);
    for (const point of fixture.groundProofPoints ?? []) {
      const echo = consumer.samples?.find((entry) => entry.id === point.id);
      if (!echo) {
        failures.push(`ground-consumer-parity-sample-missing:${key}:${point.id}`);
        continue;
      }
      const hit = sampleAuthoredTerrainGround(fixture, point);
      if (!nearlyEqual(echo.worldHeight, hit.worldHeight)) failures.push(`ground-consumer-parity-world-height-drift:${key}:${point.id}`);
      if (!sameValue(echo.normal, hit.normal)) failures.push(`ground-consumer-parity-normal-drift:${key}:${point.id}`);
      if (!nearlyEqual(echo.slopeDegrees, hit.slopeDegrees)) failures.push(`ground-consumer-parity-slope-drift:${key}:${point.id}`);
      if (echo.slopeClass !== hit.slopeClass) failures.push(`ground-consumer-parity-slope-class-drift:${key}:${point.id}`);
      if (echo.walkable !== hit.walkable) failures.push(`ground-consumer-parity-walkable-drift:${key}:${point.id}`);
      if (echo.movementState !== hit.movementState) failures.push(`ground-consumer-parity-movement-state-drift:${key}:${point.id}`);
      if (echo.placementAllowed !== hit.placementAllowed) failures.push(`ground-consumer-parity-placement-drift:${key}:${point.id}`);
      if (echo.material !== hit.material) failures.push(`ground-consumer-parity-material-drift:${key}:${point.id}`);
      if (echo.biome !== hit.biome) failures.push(`ground-consumer-parity-biome-drift:${key}:${point.id}`);
      if (echo.dominantMaterial !== hit.dominantMaterial) failures.push(`ground-consumer-parity-dominant-material-drift:${key}:${point.id}`);
      if (echo.dominantBiome !== hit.dominantBiome) failures.push(`ground-consumer-parity-dominant-biome-drift:${key}:${point.id}`);
      if (!sameValue(echo.materialWeights, hit.materialWeights)) failures.push(`ground-consumer-parity-material-weights-drift:${key}:${point.id}`);
      if (!sameValue(echo.biomeWeights, hit.biomeWeights)) failures.push(`ground-consumer-parity-biome-weights-drift:${key}:${point.id}`);
      if (echo.materialMaskCellId !== hit.materialMaskCell?.id) failures.push(`ground-consumer-parity-material-cell-drift:${key}:${point.id}`);
      if (echo.biomeMaskCellId !== hit.biomeMaskCell?.id) failures.push(`ground-consumer-parity-biome-cell-drift:${key}:${point.id}`);
      if (echo.sourceCellId !== hit.sourceCellId) failures.push(`ground-consumer-parity-cell-drift:${key}:${point.id}`);
    }
  }
}

function validateNormalSlopeRevisionPolicy(fixture, failures) {
  const policy = fixture.normalSlopeRevisionPolicy;
  if (!policy || typeof policy !== "object") {
    failures.push("normal-slope-revision-policy-missing");
    return;
  }
  const policyFields = policy.staleWhenFieldsChange ?? [];
  for (const field of [
    "heightSamples",
    "heightValueDomain",
    "heightNormalization",
    "heightOriginOffset",
    "heightInterpolationMode",
    "heightEdgePolicy",
    "normalSpace",
    "slopeValueDomain",
    "slopeClassTaxonomy",
    "walkableSlopeThresholds",
    "normalDerivation",
    "gradientKernel",
    "sampleGroundApi",
  ]) {
    if (!policyFields.includes(field)) failures.push(`normal-slope-revision-policy-missing-field:${field}`);
  }
  const staleDomains = policy.staleDomains ?? [];
  for (const domain of ["render", "collider", "movement", "placement", "gameplay", "screenshot-proof", "public-proof"]) {
    if (!staleDomains.includes(domain)) failures.push(`normal-slope-revision-policy-missing-domain:${domain}`);
  }
}

function isFiniteVector3(vector) {
  return Number.isFinite(vector?.x) && Number.isFinite(vector?.y) && Number.isFinite(vector?.z);
}

function nearlyUnitVector3(vector) {
  if (!isFiniteVector3(vector)) return false;
  const magnitude = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y) + (vector.z * vector.z));
  return Math.abs(magnitude - 1) < 0.000001;
}

function createConsumerScaleEcho(fixture) {
  return {
    worldBounds: cloneJson(fixture.worldBounds),
    unitScale: cloneJson(fixture.unitScale),
    originId: fixture.origin?.originId,
    cellSize: cloneJson(fixture.cellSize),
  };
}

function createConsumerHeightEcho(fixture) {
  return {
    gridId: fixture.heightSamples?.gridId,
    sampleHeightApi: cloneJson(fixture.sampleHeightApi),
    proofPointCount: fixture.heightProofPoints?.length ?? 0,
    interpolation: fixture.heightInterpolationMode,
  };
}

function createConsumerGroundEcho(fixture) {
  const primaryPoint = (fixture.groundProofPoints ?? createDefaultGroundProofPoints(fixture))[0] ?? fixture.origin;
  const primaryHit = sampleAuthoredTerrainGround(fixture, primaryPoint);
  return {
    gridId: fixture.heightSamples?.gridId,
    sampleGroundApi: cloneJson(fixture.sampleGroundApi),
    proofPointCount: fixture.groundProofPoints?.length ?? 0,
    normalSpace: cloneJson(fixture.normalSpace),
    slopeValueDomain: cloneJson(fixture.slopeValueDomain),
    walkableSlopeThresholds: cloneJson(fixture.walkableSlopeThresholds),
    normalDerivation: cloneJson(fixture.normalDerivation),
    gradientKernel: cloneJson(fixture.gradientKernel),
    material: primaryHit.material,
    biome: primaryHit.biome,
    dominantMaterial: primaryHit.dominantMaterial,
    dominantBiome: primaryHit.dominantBiome,
    materialWeights: cloneJson(primaryHit.materialWeights),
    biomeWeights: cloneJson(primaryHit.biomeWeights),
    materialMaskCellId: primaryHit.materialMaskCell?.id ?? null,
    biomeMaskCellId: primaryHit.biomeMaskCell?.id ?? null,
    renderMaterialEcho: cloneJson(primaryHit.renderMaterialEcho),
    audioVfxSurfaceEcho: cloneJson(primaryHit.audioVfxSurfaceEcho),
    placementBiomeEcho: cloneJson(primaryHit.placementBiomeEcho),
    gameplaySurfaceEcho: cloneJson(primaryHit.gameplaySurfaceEcho),
  };
}

function createDefaultHeightProofPoints(fixture) {
  return DEFAULT_HEIGHT_PROOF_POINT_DEFS.map((point) => {
    const hit = sampleAuthoredTerrainHeight(fixture, point);
    return {
      ...cloneJson(point),
      gridId: fixture.heightSamples?.gridId,
      expectedWorldHeight: hit.worldHeight,
      expectedSourceHeight: hit.sourceHeight,
      expectedNormalizedHeight: hit.normalizedHeight,
      cellId: hit.cell?.id ?? null,
      sampleIndex: hit.cell?.index ?? null,
      revisionEcho: "pending-revision",
    };
  });
}

function createDefaultGroundProofPoints(fixture) {
  return DEFAULT_GROUND_PROOF_POINT_DEFS.map((point) => {
    const hit = sampleAuthoredTerrainGround(fixture, point);
    return {
      ...cloneJson(point),
      gridId: fixture.heightSamples?.gridId,
      expectedWorldHeight: hit.worldHeight,
      expectedSourceHeight: hit.sourceHeight,
      expectedNormalizedHeight: hit.normalizedHeight,
      expectedNormal: cloneJson(hit.normal),
      expectedSlopeDegrees: hit.slopeDegrees,
      expectedSlopeClass: hit.slopeClass,
      expectedWalkable: hit.walkable,
      expectedMovementState: hit.movementState,
      expectedPlacementAllowed: hit.placementAllowed,
      expectedMaterial: hit.material,
      expectedBiome: hit.biome,
      expectedDominantMaterial: hit.dominantMaterial,
      expectedDominantBiome: hit.dominantBiome,
      expectedMaterialWeights: cloneJson(hit.materialWeights),
      expectedBiomeWeights: cloneJson(hit.biomeWeights),
      expectedRenderMaterial: cloneJson(hit.renderMaterialEcho),
      expectedAudioVfxSurface: cloneJson(hit.audioVfxSurfaceEcho),
      expectedPlacementBiome: cloneJson(hit.placementBiomeEcho),
      expectedGameplaySurface: cloneJson(hit.gameplaySurfaceEcho),
      materialMaskCellId: hit.materialMaskCell?.id ?? null,
      biomeMaskCellId: hit.biomeMaskCell?.id ?? null,
      sourceCellId: hit.sourceCellId ?? null,
      cellId: hit.cell?.id ?? null,
      sampleIndex: hit.cell?.index ?? null,
      revisionEcho: "pending-revision",
    };
  });
}

function createDefaultMaterialBiomeProofPoints(fixture) {
  return DEFAULT_MATERIAL_BIOME_PROOF_POINT_DEFS.map((point) => {
    const hit = sampleAuthoredTerrainGround(fixture, point);
    return {
      ...cloneJson(point),
      gridId: fixture.heightSamples?.gridId,
      expectedMaterial: hit.material,
      expectedBiome: hit.biome,
      expectedDominantMaterial: hit.dominantMaterial,
      expectedDominantBiome: hit.dominantBiome,
      expectedMaterialWeights: cloneJson(hit.materialWeights),
      expectedBiomeWeights: cloneJson(hit.biomeWeights),
      expectedRenderMaterial: cloneJson(hit.renderMaterialEcho),
      expectedAudioVfxSurface: cloneJson(hit.audioVfxSurfaceEcho),
      expectedPlacementBiome: cloneJson(hit.placementBiomeEcho),
      expectedGameplaySurface: cloneJson(hit.gameplaySurfaceEcho),
      materialMaskCellId: hit.materialMaskCell?.id ?? null,
      biomeMaskCellId: hit.biomeMaskCell?.id ?? null,
      revisionEcho: "pending-revision",
    };
  });
}

function createAuthoredTerrainHeightConsumerParity(fixture) {
  const samples = (fixture.heightProofPoints ?? createDefaultHeightProofPoints(fixture)).map((point) => {
    const hit = sampleAuthoredTerrainHeight(fixture, point);
    return {
      id: point.id,
      worldHeight: hit.worldHeight,
      sourceHeight: hit.sourceHeight,
      normalizedHeight: hit.normalizedHeight,
      cellId: hit.cell?.id ?? null,
    };
  });
  const base = {
    gridId: fixture.heightSamples?.gridId,
    interpolation: fixture.heightInterpolationMode,
    samples,
  };
  return {
    renderTerrain: { consumerId: "render-terrain", ...cloneJson(base) },
    terrainCollider: { consumerId: "terrain-collider", ...cloneJson(base) },
    raycastPlacement: { consumerId: "raycast-placement", ...cloneJson(base) },
    playerMovement: { consumerId: "player-movement", ...cloneJson(base) },
  };
}

function createAuthoredTerrainGroundConsumerParity(fixture) {
  const samples = (fixture.groundProofPoints ?? createDefaultGroundProofPoints(fixture)).map((point) => {
    const hit = sampleAuthoredTerrainGround(fixture, point);
    return {
      id: point.id,
      accepted: hit.accepted,
      worldHeight: hit.worldHeight,
      sourceHeight: hit.sourceHeight,
      normalizedHeight: hit.normalizedHeight,
      normal: cloneJson(hit.normal),
      slopeDegrees: hit.slopeDegrees,
      slopeClass: hit.slopeClass,
      walkable: hit.walkable,
      movementState: hit.movementState,
      placementAllowed: hit.placementAllowed,
      material: hit.material,
      biome: hit.biome,
      dominantMaterial: hit.dominantMaterial,
      dominantBiome: hit.dominantBiome,
      materialWeights: cloneJson(hit.materialWeights),
      biomeWeights: cloneJson(hit.biomeWeights),
      materialMaskCellId: hit.materialMaskCell?.id ?? null,
      biomeMaskCellId: hit.biomeMaskCell?.id ?? null,
      renderMaterialEcho: cloneJson(hit.renderMaterialEcho),
      audioVfxSurfaceEcho: cloneJson(hit.audioVfxSurfaceEcho),
      placementBiomeEcho: cloneJson(hit.placementBiomeEcho),
      gameplaySurfaceEcho: cloneJson(hit.gameplaySurfaceEcho),
      sourceCellId: hit.sourceCellId ?? null,
      cellId: hit.cell?.id ?? null,
    };
  });
  const base = {
    gridId: fixture.heightSamples?.gridId,
    sampleGroundApi: cloneJson(fixture.sampleGroundApi),
    normalSpace: cloneJson(fixture.normalSpace),
    slopeValueDomain: cloneJson(fixture.slopeValueDomain),
    slopeClassTaxonomy: cloneJson(fixture.slopeClassTaxonomy),
    walkableSlopeThresholds: cloneJson(fixture.walkableSlopeThresholds),
    normalDerivation: cloneJson(fixture.normalDerivation),
    gradientKernel: cloneJson(fixture.gradientKernel),
    samples,
  };
  return {
    renderTerrain: { consumerId: "render-terrain", ...cloneJson(base) },
    terrainCollider: { consumerId: "terrain-collider", ...cloneJson(base) },
    raycastPlacement: { consumerId: "raycast-placement", ...cloneJson(base) },
    playerMovement: { consumerId: "player-movement", ...cloneJson(base) },
  };
}

function createAuthoredTerrainMaterialBiomeConsumerParity(fixture) {
  const samples = (fixture.materialBiomeProofPoints ?? createDefaultMaterialBiomeProofPoints(fixture)).map((point) => {
    const hit = sampleAuthoredTerrainGround(fixture, point);
    return {
      id: point.id,
      material: hit.material,
      biome: hit.biome,
      dominantMaterial: hit.dominantMaterial,
      dominantBiome: hit.dominantBiome,
      materialWeights: cloneJson(hit.materialWeights),
      biomeWeights: cloneJson(hit.biomeWeights),
      materialMaskCellId: hit.materialMaskCell?.id ?? null,
      biomeMaskCellId: hit.biomeMaskCell?.id ?? null,
      renderMaterialEcho: cloneJson(hit.renderMaterialEcho),
      audioVfxSurfaceEcho: cloneJson(hit.audioVfxSurfaceEcho),
      placementBiomeEcho: cloneJson(hit.placementBiomeEcho),
      gameplaySurfaceEcho: cloneJson(hit.gameplaySurfaceEcho),
    };
  });
  const base = {
    gridId: fixture.heightSamples?.gridId,
    materialTags: cloneJson(fixture.materialTags),
    biomeTags: cloneJson(fixture.biomeTags),
    maskWeights: cloneJson(fixture.maskWeights),
    layerBlendPolicy: cloneJson(fixture.layerBlendPolicy),
    materialBiomeRevisionPolicy: cloneJson(fixture.materialBiomeRevisionPolicy),
    samples,
  };
  return {
    renderTerrain: { consumerId: "render-terrain", ...cloneJson(base) },
    audioVfxSurface: { consumerId: "audio-vfx-surface", ...cloneJson(base) },
    raycastPlacement: { consumerId: "raycast-placement", ...cloneJson(base) },
    gameplayZones: { consumerId: "gameplay-zones", ...cloneJson(base) },
  };
}

function createConsumerMaterialBiomeEcho(fixture) {
  const parity = createAuthoredTerrainMaterialBiomeConsumerParity(fixture);
  const samples = (fixture.materialBiomeProofPoints ?? createDefaultMaterialBiomeProofPoints(fixture)).map((point) => {
    const hit = sampleAuthoredTerrainGround(fixture, point);
    return {
      id: point.id,
      material: hit.material,
      biome: hit.biome,
      dominantMaterial: hit.dominantMaterial,
      dominantBiome: hit.dominantBiome,
      materialWeights: cloneJson(hit.materialWeights),
      biomeWeights: cloneJson(hit.biomeWeights),
      materialMaskCellId: hit.materialMaskCell?.id ?? null,
      biomeMaskCellId: hit.biomeMaskCell?.id ?? null,
    };
  });
  return {
    gridId: fixture.heightSamples?.gridId,
    proofPointCount: samples.length,
    materialTags: cloneJson(fixture.materialTags),
    biomeTags: cloneJson(fixture.biomeTags),
    maskWeights: cloneJson(fixture.maskWeights),
    layerBlendPolicy: cloneJson(fixture.layerBlendPolicy),
    materialBiomeRevisionPolicy: cloneJson(fixture.materialBiomeRevisionPolicy),
    samples,
    renderTerrain: cloneJson(parity.renderTerrain),
    audioVfxSurface: cloneJson(parity.audioVfxSurface),
    raycastPlacement: cloneJson(parity.raycastPlacement),
    gameplayZones: cloneJson(parity.gameplayZones),
  };
}

function createDefaultMaterialMask(fixture) {
  const rows = [
    [
      { dominantMaterial: "sand", weights: { sand: 1 }, surfaceRole: "spawn" },
      { dominantMaterial: "sand", weights: { sand: 0.75, gravel: 0.25 }, surfaceRole: "wash" },
      { dominantMaterial: "gravel", weights: { gravel: 1 }, surfaceRole: "wash" },
      { dominantMaterial: "rock", weights: { rock: 1 }, surfaceRole: "mesa" },
      { dominantMaterial: "rail", weights: { rail: 1 }, surfaceRole: "rail-bed" },
    ],
    [
      { dominantMaterial: "sand", weights: { sand: 1 }, surfaceRole: "basin" },
      { dominantMaterial: "gravel", weights: { gravel: 0.8, sand: 0.2 }, surfaceRole: "wash" },
      { dominantMaterial: "rock", weights: { rock: 1 }, surfaceRole: "mine-shelf" },
      { dominantMaterial: "rock", weights: { rock: 0.85, "mine-tailings": 0.15 }, surfaceRole: "mine-shelf" },
      { dominantMaterial: "rail", weights: { rail: 1 }, surfaceRole: "rail-bed" },
    ],
    [
      { dominantMaterial: "clay", weights: { clay: 0.85, sand: 0.15 }, surfaceRole: "town-shelf" },
      { dominantMaterial: "gravel", weights: { gravel: 0.8, sand: 0.2 }, surfaceRole: "wash" },
      { dominantMaterial: "mine-tailings", weights: { "mine-tailings": 0.9, gravel: 0.1 }, surfaceRole: "gold-seam" },
      { dominantMaterial: "rock", weights: { rock: 0.9, sand: 0.1 }, surfaceRole: "mine-shelf" },
      { dominantMaterial: "wood", weights: { wood: 1 }, surfaceRole: "town-shelf" },
    ],
    [
      { dominantMaterial: "sand", weights: { sand: 1 }, surfaceRole: "basin" },
      { dominantMaterial: "sand", weights: { sand: 0.8, gravel: 0.2 }, surfaceRole: "basin" },
      { dominantMaterial: "gravel", weights: { gravel: 1 }, surfaceRole: "wash" },
      { dominantMaterial: "wood", weights: { wood: 1 }, surfaceRole: "extraction-site" },
      { dominantMaterial: "sand", weights: { sand: 1 }, surfaceRole: "basin" },
    ],
  ];

  const width = fixture?.heightSamples?.width ?? 5;
  const height = fixture?.heightSamples?.height ?? 4;
  const cells = [];
  for (let row = 0; row < height; row += 1) {
    const rowCells = [];
    for (let column = 0; column < width; column += 1) {
      const template = rows[row % rows.length][column % rows[0].length];
      rowCells.push({
        id: `material-cell-r${row}-c${column}`,
        row,
        column,
        index: (row * width) + column,
        dominantMaterial: template.dominantMaterial,
        baseMaterial: DEFAULT_LAYER_BLEND_POLICY.baseMaterial,
        inheritedBaseMaterial: template.dominantMaterial === DEFAULT_LAYER_BLEND_POLICY.baseMaterial,
        weights: cloneJson(template.weights),
        surfaceRole: template.surfaceRole,
        blendMode: DEFAULT_LAYER_BLEND_POLICY.blendMode,
      });
    }
    cells.push(rowCells);
  }

  return {
    gridId: "material-mask-001",
    coordinateSpace: "world-xz",
    sampleOrder: "row-major-z-then-x",
    width,
    height,
    baseMaterial: DEFAULT_LAYER_BLEND_POLICY.baseMaterial,
    tagTaxonomy: cloneJson(DEFAULT_MATERIAL_TAG_TAXONOMY),
    weightDomain: cloneJson(DEFAULT_MASK_WEIGHT_DOMAIN),
    layerBlendPolicy: cloneJson(DEFAULT_LAYER_BLEND_POLICY),
    cells,
  };
}

function createDefaultBiomeMask(fixture) {
  const rows = [
    [
      { dominantBiome: "basin", weights: { basin: 1 }, surfaceRole: "spawn", placementAllowed: true, gameplayRole: "roam" },
      { dominantBiome: "basin", weights: { basin: 0.8, wash: 0.2 }, surfaceRole: "wash", placementAllowed: true, gameplayRole: "roam" },
      { dominantBiome: "wash", weights: { wash: 1 }, surfaceRole: "wash", placementAllowed: true, gameplayRole: "route" },
      { dominantBiome: "mesa", weights: { mesa: 1 }, surfaceRole: "mesa", placementAllowed: false, gameplayRole: "cover" },
      { dominantBiome: "rail-bed", weights: { "rail-bed": 1 }, surfaceRole: "rail-bed", placementAllowed: true, gameplayRole: "travel" },
    ],
    [
      { dominantBiome: "basin", weights: { basin: 1 }, surfaceRole: "basin", placementAllowed: true, gameplayRole: "roam" },
      { dominantBiome: "wash", weights: { wash: 1 }, surfaceRole: "wash", placementAllowed: true, gameplayRole: "route" },
      { dominantBiome: "mine-shelf", weights: { "mine-shelf": 1 }, surfaceRole: "mine-shelf", placementAllowed: false, gameplayRole: "mine" },
      { dominantBiome: "mesa", weights: { mesa: 0.9, "mine-shelf": 0.1 }, surfaceRole: "mine-shelf", placementAllowed: false, gameplayRole: "cover" },
      { dominantBiome: "rail-bed", weights: { "rail-bed": 1 }, surfaceRole: "rail-bed", placementAllowed: true, gameplayRole: "travel" },
    ],
    [
      { dominantBiome: "town-shelf", weights: { "town-shelf": 1 }, surfaceRole: "town-shelf", placementAllowed: true, gameplayRole: "town" },
      { dominantBiome: "wash", weights: { wash: 1 }, surfaceRole: "wash", placementAllowed: true, gameplayRole: "route" },
      { dominantBiome: "gold-seam", weights: { "gold-seam": 1 }, surfaceRole: "gold-seam", placementAllowed: false, gameplayRole: "mine" },
      { dominantBiome: "mine-shelf", weights: { "mine-shelf": 0.8, "gold-seam": 0.2 }, surfaceRole: "mine-shelf", placementAllowed: false, gameplayRole: "mine" },
      { dominantBiome: "town-shelf", weights: { "town-shelf": 1 }, surfaceRole: "town-shelf", placementAllowed: true, gameplayRole: "town" },
    ],
    [
      { dominantBiome: "basin", weights: { basin: 1 }, surfaceRole: "basin", placementAllowed: true, gameplayRole: "roam" },
      { dominantBiome: "basin", weights: { basin: 0.7, wash: 0.3 }, surfaceRole: "basin", placementAllowed: true, gameplayRole: "roam" },
      { dominantBiome: "wash", weights: { wash: 1 }, surfaceRole: "wash", placementAllowed: true, gameplayRole: "route" },
      { dominantBiome: "extraction-site", weights: { "extraction-site": 1 }, surfaceRole: "extraction-site", placementAllowed: true, gameplayRole: "cashout" },
      { dominantBiome: "basin", weights: { basin: 1 }, surfaceRole: "basin", placementAllowed: true, gameplayRole: "roam" },
    ],
  ];

  const width = fixture?.heightSamples?.width ?? 5;
  const height = fixture?.heightSamples?.height ?? 4;
  const cells = [];
  for (let row = 0; row < height; row += 1) {
    const rowCells = [];
    for (let column = 0; column < width; column += 1) {
      const template = rows[row % rows.length][column % rows[0].length];
      rowCells.push({
        id: `biome-cell-r${row}-c${column}`,
        row,
        column,
        index: (row * width) + column,
        dominantBiome: template.dominantBiome,
        baseBiome: DEFAULT_LAYER_BLEND_POLICY.baseBiome,
        inheritedBaseBiome: template.dominantBiome === DEFAULT_LAYER_BLEND_POLICY.baseBiome,
        weights: cloneJson(template.weights),
        surfaceRole: template.surfaceRole,
        placementAllowed: template.placementAllowed,
        gameplayRole: template.gameplayRole,
        blendMode: DEFAULT_LAYER_BLEND_POLICY.blendMode,
      });
    }
    cells.push(rowCells);
  }

  return {
    gridId: "biome-mask-001",
    coordinateSpace: "world-xz",
    sampleOrder: "row-major-z-then-x",
    width,
    height,
    baseBiome: DEFAULT_LAYER_BLEND_POLICY.baseBiome,
    tagTaxonomy: cloneJson(DEFAULT_BIOME_TAG_TAXONOMY),
    weightDomain: cloneJson(DEFAULT_MASK_WEIGHT_DOMAIN),
    layerBlendPolicy: cloneJson(DEFAULT_LAYER_BLEND_POLICY),
    cells,
  };
}

function getTerrainMaskCell(mask, row, column) {
  if (!mask || !Array.isArray(mask.cells)) return null;
  const rowCells = mask.cells[row];
  if (!Array.isArray(rowCells)) return null;
  return rowCells[column] ?? null;
}

function createHeightGridAddress(fixture, point) {
  const samples = fixture.heightSamples;
  const bounds = fixture.worldBounds;
  const column = ((finiteNumber(point.x) - finiteNumber(bounds.minX)) / (finiteNumber(bounds.maxX) - finiteNumber(bounds.minX))) * (samples.width - 1);
  const row = ((finiteNumber(point.z) - finiteNumber(bounds.minZ)) / (finiteNumber(bounds.maxZ) - finiteNumber(bounds.minZ))) * (samples.height - 1);
  const column0 = Math.max(0, Math.min(samples.width - 1, Math.floor(column)));
  const row0 = Math.max(0, Math.min(samples.height - 1, Math.floor(row)));
  const column1 = Math.max(0, Math.min(samples.width - 1, Math.ceil(column)));
  const row1 = Math.max(0, Math.min(samples.height - 1, Math.ceil(row)));
  const tx = column1 === column0 ? 0 : column - column0;
  const tz = row1 === row0 ? 0 : row - row0;
  const index = row0 * samples.width + column0;

  return {
    cell: {
      id: `${samples.sourceCellPrefix}-r${row0}-c${column0}`,
      row: row0,
      column: column0,
      index,
      cornerRows: [row0, row1],
      cornerColumns: [column0, column1],
    },
    fractional: {
      row,
      column,
      tx,
      tz,
    },
  };
}

function sampleHeightGridValue(fixture, gridAddress, interpolation) {
  const values = fixture.heightSamples.values;
  const { row, column, cornerRows, cornerColumns } = gridAddress.cell;

  if (interpolation === "nearest") {
    const nearestRow = Math.round(gridAddress.fractional.row);
    const nearestColumn = Math.round(gridAddress.fractional.column);
    return values[nearestRow][nearestColumn];
  }

  if (interpolation === "fixed") return values[row][column];

  const [row0, row1] = cornerRows;
  const [column0, column1] = cornerColumns;
  const tx = gridAddress.fractional.tx;
  const tz = gridAddress.fractional.tz;
  const a = values[row0][column0];
  const b = values[row0][column1];
  const c = values[row1][column0];
  const d = values[row1][column1];
  const top = lerp(a, b, tx);
  const bottom = lerp(c, d, tx);
  return lerp(top, bottom, tz);
}

function createAuthoredTerrainGroundGradient(fixture, point, heightHit = sampleAuthoredTerrainHeight(fixture, point)) {
  const sampleSpacing = fixture?.heightSamples?.sampleSpacing ?? {};
  const xStep = finiteNumber(sampleSpacing.x);
  const zStep = finiteNumber(sampleSpacing.z);
  const leftPoint = clampPointToBounds(fixture.worldBounds, { x: finiteNumber(point?.x) - xStep, z: finiteNumber(point?.z) });
  const rightPoint = clampPointToBounds(fixture.worldBounds, { x: finiteNumber(point?.x) + xStep, z: finiteNumber(point?.z) });
  const downPoint = clampPointToBounds(fixture.worldBounds, { x: finiteNumber(point?.x), z: finiteNumber(point?.z) - zStep });
  const upPoint = clampPointToBounds(fixture.worldBounds, { x: finiteNumber(point?.x), z: finiteNumber(point?.z) + zStep });

  const leftHit = sampleAuthoredTerrainHeight(fixture, leftPoint);
  const rightHit = sampleAuthoredTerrainHeight(fixture, rightPoint);
  const downHit = sampleAuthoredTerrainHeight(fixture, downPoint);
  const upHit = sampleAuthoredTerrainHeight(fixture, upPoint);

  const horizontalSpan = Math.max(0.000001, finiteNumber(rightHit.point?.x) - finiteNumber(leftHit.point?.x));
  const verticalSpan = Math.max(0.000001, finiteNumber(upHit.point?.z) - finiteNumber(downHit.point?.z));
  const dxHeight = (finiteNumber(rightHit.worldHeight) - finiteNumber(leftHit.worldHeight)) / horizontalSpan;
  const dzHeight = (finiteNumber(upHit.worldHeight) - finiteNumber(downHit.worldHeight)) / verticalSpan;
  const normal = normalizeVector3({
    x: -dxHeight,
    y: 1,
    z: -dzHeight,
  });
  const slopeDegrees = Math.atan(Math.sqrt((dxHeight * dxHeight) + (dzHeight * dzHeight))) * (180 / Math.PI);

  return {
    normal,
    slopeDegrees,
    neighborPoints: {
      left: leftHit.point,
      right: rightHit.point,
      down: downHit.point,
      up: upHit.point,
    },
    neighborHeights: {
      left: leftHit.worldHeight,
      right: rightHit.worldHeight,
      down: downHit.worldHeight,
      up: upHit.worldHeight,
    },
    heightHit,
  };
}

function classifySlopeClass(fixture, slopeDegrees) {
  const thresholds = fixture?.walkableSlopeThresholds ?? DEFAULT_WALKABLE_SLOPE_THRESHOLDS;
  if (!Number.isFinite(slopeDegrees)) return "blocker";
  if (slopeDegrees < finiteNumber(thresholds.walkDegrees)) return "flat";
  if (slopeDegrees < finiteNumber(thresholds.slowDegrees)) return "walkable";
  if (slopeDegrees < finiteNumber(thresholds.slideDegrees)) return "steep";
  return "blocker";
}

function createMovementStateFromSlopeClass(slopeClass) {
  switch (slopeClass) {
    case "flat":
      return "walk";
    case "walkable":
      return "slow";
    case "steep":
      return "slide";
    case "blocker":
    case "edge":
    default:
      return "blocked";
  }
}

function isTerrainEdgeSample(bounds, point) {
  return nearlyEqual(point?.x, bounds?.minX)
    || nearlyEqual(point?.x, bounds?.maxX)
    || nearlyEqual(point?.z, bounds?.minZ)
    || nearlyEqual(point?.z, bounds?.maxZ);
}

function normalizeVector3(vector) {
  const magnitude = Math.sqrt((finiteNumber(vector?.x) * finiteNumber(vector?.x)) + (finiteNumber(vector?.y) * finiteNumber(vector?.y)) + (finiteNumber(vector?.z) * finiteNumber(vector?.z)));
  if (!Number.isFinite(magnitude) || magnitude <= 0) {
    return { x: 0, y: 1, z: 0 };
  }
  return {
    x: finiteNumber(vector?.x) / magnitude,
    y: finiteNumber(vector?.y) / magnitude,
    z: finiteNumber(vector?.z) / magnitude,
  };
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function measureGroundDistanceMeters(fixture, from, to) {
  const metersPerUnit = finiteNumber(fixture?.unitScale?.metersPerUnit, 1);
  const dx = finiteNumber(to?.x) - finiteNumber(from?.x);
  const dz = finiteNumber(to?.z) - finiteNumber(from?.z);
  return Math.sqrt((dx * dx) + (dz * dz)) * metersPerUnit;
}

function pointInsideBounds(bounds, point) {
  if (!bounds || !point) return false;
  return finiteNumber(point.x) >= finiteNumber(bounds.minX)
    && finiteNumber(point.x) <= finiteNumber(bounds.maxX)
    && finiteNumber(point.z) >= finiteNumber(bounds.minZ)
    && finiteNumber(point.z) <= finiteNumber(bounds.maxZ);
}

function clampPointToBounds(bounds, point) {
  return {
    x: Math.min(finiteNumber(bounds?.maxX), Math.max(finiteNumber(bounds?.minX), finiteNumber(point?.x))),
    z: Math.min(finiteNumber(bounds?.maxZ), Math.max(finiteNumber(bounds?.minZ), finiteNumber(point?.z))),
  };
}

function finiteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function nearlyEqual(left, right) {
  return Math.abs(finiteNumber(left) - finiteNumber(right)) < 0.000001;
}

function sameValue(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function containsPrivatePathLikeField(value) {
  if (!value || typeof value !== "object") return false;
  for (const [key, entry] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    if (normalizedKey.includes("path") || normalizedKey.includes("absolute") || normalizedKey.includes("file")) return true;
    if (typeof entry === "string" && (/^file:\/\//.test(entry) || /^\/Users\//.test(entry) || /^\/var\//.test(entry))) return true;
    if (entry && typeof entry === "object" && containsPrivatePathLikeField(entry)) return true;
  }
  return false;
}

function stableHash(value) {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function stableStringify(value) {
  return JSON.stringify(canonicalize(value));
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map((item) => canonicalize(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function deepMerge(base, overrides) {
  const result = cloneJson(base);
  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = cloneJson(value);
    }
  }
  return result;
}

function withoutKeys(value, keys) {
  const skip = new Set(keys);
  return Object.fromEntries(Object.entries(value ?? {}).filter(([key]) => !skip.has(key)));
}

function cloneJson(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function freezeDeep(value) {
  if (!value || typeof value !== "object") return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) freezeDeep(nested);
  return value;
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value ?? {}, key);
}
