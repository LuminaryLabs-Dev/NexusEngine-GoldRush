import {
  AUTHORED_TERRAIN_CONSUMERS,
  AUTHORED_TERRAIN_FIXTURE_ID,
  REVISION_REASON_TAXONOMY,
  createAuthoredTerrainBoundsScaleSnapshot,
  createAuthoredTerrainConsumerEchoes,
  createAuthoredTerrainGroundSnapshot,
  createAuthoredTerrainMaterialBiomeSnapshot,
  createAuthoredTerrainHeightSnapshot,
  createAuthoredTerrainIdentityEvents,
  createAuthoredTerrainSourceSnapshot,
  createGoldRushAuthoredTerrainFixture,
  createHeightRevisionStaleProofFlags,
  createNormalSlopeRevisionStaleProofFlags,
  createRevisionStaleProofFlags,
  createScaleRevisionStaleProofFlags,
  deriveAuthoredTerrainRevisionId,
  deriveAuthoredTerrainSourceHash,
  normalizeAuthoredTerrainHeight,
  queryAuthoredTerrainBounds,
  sampleAuthoredTerrainGround,
  sampleAuthoredTerrainHeight,
  sampleAuthoredTerrainMaterialBiome,
  validateAuthoredTerrainSourceFixture,
} from "../../src/content/goldrushAuthoredTerrainFixture.js";

const fixture = createGoldRushAuthoredTerrainFixture();
const validation = validateAuthoredTerrainSourceFixture(fixture);

assert(validation.passed, `authored terrain fixture should pass: ${validation.failures.join(", ")}`);
assert(fixture.fixtureId === AUTHORED_TERRAIN_FIXTURE_ID, "fixture id mismatch");
assert(/^goldrush\.desert\.artboard\.fixture\.\d{3}$/.test(fixture.fixtureId), "fixture id format invalid");
assert(/^rev-[a-f0-9]{8}$/.test(fixture.revisionId), "revision id must be deterministic short hash id");
assert(fixture.revisionId === deriveAuthoredTerrainRevisionId(fixture), "revision id must be derived from source inputs");
assert(REVISION_REASON_TAXONOMY.includes(fixture.revisionReason), "revision reason must use taxonomy");
assert(!JSON.stringify(fixture.authoring).includes("/Users/"), "authoring metadata must not contain private paths");

const repeated = createGoldRushAuthoredTerrainFixture();
assert(repeated.revisionId === fixture.revisionId, "revision id must be repeatable");
assert(repeated.sourceHash === fixture.sourceHash, "source hash must be repeatable");

assert(fixture.coordinateSystem.handedness === "right-handed", "coordinate system handedness missing");
assert(fixture.coordinateSystem.axes.y === "up", "coordinate system must declare y-up");
assert(fixture.unitScale.metersPerUnit === 1, "unit scale should be one meter per unit");
assert(fixture.worldBounds.width === fixture.worldBounds.maxX - fixture.worldBounds.minX, "world bounds width mismatch");
assert(fixture.worldBounds.depth === fixture.worldBounds.maxZ - fixture.worldBounds.minZ, "world bounds depth mismatch");
assert(fixture.origin.originId === fixture.scaleProofAnchors.originId, "origin anchor policy drift");
assert(fixture.cellSize.height === fixture.cellSize.mask, "height and mask cell sizes must match");
assert(fixture.cellSize.height === fixture.cellSize.placement, "height and placement cell sizes must match");
assert(fixture.cellSize.lod % fixture.cellSize.height === 0, "lod cell size must be a multiple of base sample size");
assert(normalizeAuthoredTerrainHeight(fixture, fixture.heightRange.min) === 0, "height range normalized min missing");
assert(normalizeAuthoredTerrainHeight(fixture, fixture.heightRange.max) === 1, "height range normalized max missing");
assert(fixture.heightSamples.gridId === "height-grid-001", "height grid id missing");
assert(fixture.heightSamples.width === 5, "height grid width mismatch");
assert(fixture.heightSamples.height === 4, "height grid height mismatch");
assert(fixture.heightSamples.values.length === fixture.heightSamples.height, "height sample row count mismatch");
assert(fixture.heightSamples.values.every((row) => row.length === fixture.heightSamples.width), "height sample column count mismatch");
assert(fixture.heightNormalization.storage === "world-space", "height normalization storage missing");
assert(fixture.heightInterpolationMode === "bilinear", "height interpolation mode mismatch");
assert(fixture.heightEdgePolicy.outside === "reject", "height edge policy must reject outside samples");
assert(fixture.sampleHeightApi.name === "sampleHeight", "sampleHeight api name missing");
assert(fixture.heightProofPoints.length === 5, "height proof points missing");
assert(fixture.heightConsumerParity.renderTerrain.samples.length === fixture.heightProofPoints.length, "render height parity samples missing");
assert(fixture.normalSpace.coordinateSpace === "world-space", "normal space coordinate system missing");
assert(fixture.slopeValueDomain.unit === "degrees", "slope value domain missing");
assert(fixture.slopeClassTaxonomy.length === 5, "slope taxonomy missing");
assert(fixture.walkableSlopeThresholds.walkDegrees < fixture.walkableSlopeThresholds.slowDegrees, "walkable slope thresholds must increase");
assert(fixture.sampleGroundApi.name === "sampleGround", "sampleGround api name missing");
assert(Array.isArray(fixture.materialTags) && fixture.materialTags.length === 8, "material taxonomy missing");
assert(Array.isArray(fixture.biomeTags) && fixture.biomeTags.length === 8, "biome taxonomy missing");
assert(fixture.maskWeights.min === 0 && fixture.maskWeights.max === 1, "mask weight domain missing");
assert(fixture.layerBlendPolicy.baseMaterial === "sand", "layer blend policy base material missing");
assert(fixture.layerBlendPolicy.baseBiome === "basin", "layer blend policy base biome missing");
assert(fixture.materialMask.gridId === "material-mask-001", "material mask grid id missing");
assert(fixture.biomeMask.gridId === "biome-mask-001", "biome mask grid id missing");
assert(fixture.materialMask.cells.length === fixture.heightSamples.height, "material mask row count mismatch");
assert(fixture.biomeMask.cells.length === fixture.heightSamples.height, "biome mask row count mismatch");
assert(fixture.materialMask.cells.every((row) => row.length === fixture.heightSamples.width), "material mask column count mismatch");
assert(fixture.biomeMask.cells.every((row) => row.length === fixture.heightSamples.width), "biome mask column count mismatch");
assert(fixture.groundProofPoints.length === 6, "ground proof points missing");
assert(fixture.groundConsumerParity.renderTerrain.samples.length === fixture.groundProofPoints.length, "render ground parity samples missing");
assert(fixture.materialBiomeProofPoints.length === 6, "material biome proof points missing");
assert(fixture.materialBiomeConsumerParity.renderTerrain.samples.length === fixture.materialBiomeProofPoints.length, "render material-biome parity samples missing");
assert(fixture.sampleGroundApi.returnFields.includes("material"), "sampleGround should expose material");
assert(fixture.sampleGroundApi.returnFields.includes("biome"), "sampleGround should expose biome");
assert(fixture.sampleGroundApi.returnFields.includes("renderMaterialEcho"), "sampleGround should expose render material echo");
assert(fixture.sampleGroundApi.returnFields.includes("gameplaySurfaceEcho"), "sampleGround should expose gameplay surface echo");
const materialBiomeSnapshot = createAuthoredTerrainMaterialBiomeSnapshot(fixture);
assert(materialBiomeSnapshot.proofPoints.length === fixture.materialBiomeProofPoints.length, "material biome snapshot proof points missing");
const materialBiomeHit = sampleAuthoredTerrainMaterialBiome(fixture, fixture.materialBiomeProofPoints[0]);
assert(materialBiomeHit.accepted === true, "material biome sample should be accepted");
assert(typeof materialBiomeHit.material === "string", "material biome sample should expose material");
assert(typeof materialBiomeHit.biome === "string", "material biome sample should expose biome");
assert(materialBiomeHit.renderMaterialEcho.consumerId === "render-terrain", "material biome render echo missing");
assert(materialBiomeHit.audioVfxSurfaceEcho.consumerId === "audio-vfx-surface", "material biome audio/vfx echo missing");
assert(materialBiomeHit.placementBiomeEcho.consumerId === "raycast-placement", "material biome placement echo missing");
assert(materialBiomeHit.gameplaySurfaceEcho.consumerId === "gameplay-zones", "material biome gameplay echo missing");

const changedSource = createGoldRushAuthoredTerrainFixture({
  revisionNote: "Changed source note should produce a new revision.",
});
assert(changedSource.sourceHash !== fixture.sourceHash, "source hash must change when source fields change");
assert(changedSource.revisionId !== fixture.revisionId, "revision id must change when source fields change");

const derivedOnlyChange = {
  ...fixture,
  derivedRenderOutput: { triangleCount: 999999 },
  derivedPhysicsOutput: { bodyCount: 77 },
};
assert(deriveAuthoredTerrainSourceHash(derivedOnlyChange) === fixture.sourceHash, "source hash must ignore derived render or physics output");

const changedScale = createGoldRushAuthoredTerrainFixture({
  worldBounds: {
    maxX: 360,
    width: 680,
  },
  heightSamples: {
    bounds: {
      minX: -320,
      maxX: 360,
      minZ: -240,
      maxZ: 240,
      width: 680,
      depth: 480,
    },
    sampleSpacing: {
      x: 170,
      z: 160,
      unit: "meter",
    },
  },
  scaleConsumers: {
    lod: {
      worldBounds: {
        minX: -320,
        maxX: 360,
        minZ: -240,
        maxZ: 240,
        width: 680,
        depth: 480,
      },
    },
    partition: {
      worldBounds: {
        minX: -320,
        maxX: 360,
        minZ: -240,
        maxZ: 240,
        width: 680,
        depth: 480,
      },
    },
  },
  consumerScaleEcho: {
    renderTerrain: {
      worldBounds: {
        minX: -320,
        maxX: 360,
        minZ: -240,
        maxZ: 240,
        width: 680,
        depth: 480,
      },
    },
    terrainCollider: {
      worldBounds: {
        minX: -320,
        maxX: 360,
        minZ: -240,
        maxZ: 240,
        width: 680,
        depth: 480,
      },
    },
    raycastPlacement: {
      worldBounds: {
        minX: -320,
        maxX: 360,
        minZ: -240,
        maxZ: 240,
        width: 680,
        depth: 480,
      },
    },
  },
});
const changedScaleValidation = validateAuthoredTerrainSourceFixture(changedScale);
assert(changedScaleValidation.passed, `changed scale fixture should stay valid when echoes update: ${changedScaleValidation.failures.join(", ")}`);
assert(changedScale.sourceHash !== fixture.sourceHash, "source hash must change when bounds change");
assert(changedScale.revisionId !== fixture.revisionId, "revision id must change when bounds change");

const changedHeightValues = fixture.heightSamples.values.map((row) => [...row]);
changedHeightValues[1][2] += 4;
const changedHeight = createGoldRushAuthoredTerrainFixture({
  heightSamples: {
    values: changedHeightValues,
  },
});
const changedHeightValidation = validateAuthoredTerrainSourceFixture(changedHeight);
assert(changedHeightValidation.passed, `changed height fixture should stay valid when proof echoes update: ${changedHeightValidation.failures.join(", ")}`);
assert(changedHeight.sourceHash !== fixture.sourceHash, "source hash must change when height samples change");
assert(changedHeight.revisionId !== fixture.revisionId, "revision id must change when height samples change");

const consumers = createAuthoredTerrainConsumerEchoes(fixture);
assert(consumers.length === AUTHORED_TERRAIN_CONSUMERS.length, "all expected consumers must echo source identity");
assert(consumers.every((consumer) => consumer.fixtureId === fixture.fixtureId), "consumer fixture echo mismatch");
assert(consumers.every((consumer) => consumer.revisionId === fixture.revisionId), "consumer revision echo mismatch");
assert(consumers.every((consumer) => consumer.sourceHash === fixture.sourceHash), "consumer source hash echo mismatch");
assert(consumers.every((consumer) => consumer.scaleEcho.worldBounds.width === fixture.worldBounds.width), "consumer world bounds scale echo mismatch");
assert(consumers.every((consumer) => consumer.scaleEcho.unitScale.metersPerUnit === fixture.unitScale.metersPerUnit), "consumer unit scale echo mismatch");
assert(consumers.every((consumer) => consumer.scaleEcho.originId === fixture.origin.originId), "consumer origin scale echo mismatch");
assert(consumers.every((consumer) => consumer.heightEcho.gridId === fixture.heightSamples.gridId), "consumer height grid echo mismatch");
assert(consumers.every((consumer) => consumer.heightEcho.proofPointCount === fixture.heightProofPoints.length), "consumer height proof point echo mismatch");

const missingFixtureId = createGoldRushAuthoredTerrainFixture({ fixtureId: "" });
const missingFixtureIdValidation = validateAuthoredTerrainSourceFixture(missingFixtureId);
assert(!missingFixtureIdValidation.passed, "missing fixture id must fail");
assert(missingFixtureIdValidation.consumerValidationSkipped === true, "identity failure must stop before consumer validation");

const missingRevisionId = createGoldRushAuthoredTerrainFixture({ revisionId: "" });
const missingRevisionValidation = validateAuthoredTerrainSourceFixture(missingRevisionId);
assert(!missingRevisionValidation.passed, "missing revision id must fail");
assert(missingRevisionValidation.failures.includes("revision-id-format-invalid"), "missing revision failure should be explicit");
assert(missingRevisionValidation.consumerValidationSkipped === true, "revision failure must stop before consumer validation");

const nonDeterministicRevision = createGoldRushAuthoredTerrainFixture({ revisionId: "rev-random1" });
const nonDeterministicValidation = validateAuthoredTerrainSourceFixture(nonDeterministicRevision);
assert(!nonDeterministicValidation.passed, "random revision id must fail");
assert(nonDeterministicValidation.failures.includes("revision-id-format-invalid"), "random revision id should fail format");

const wrongButFormattedRevision = createGoldRushAuthoredTerrainFixture({ revisionId: "rev-00000000" });
const wrongButFormattedValidation = validateAuthoredTerrainSourceFixture(wrongButFormattedRevision);
assert(!wrongButFormattedValidation.passed, "wrong deterministic-looking revision must fail");
assert(wrongButFormattedValidation.failures.includes("revision-id-not-deterministic"), "formatted wrong revision must fail deterministic check");

const driftFixture = createGoldRushAuthoredTerrainFixture({
  consumerEchoes: fixture.consumerEchoes.map((consumer, index) => (
    index === 0 ? { ...consumer, revisionId: "rev-00000000" } : consumer
  )),
});
const driftValidation = validateAuthoredTerrainSourceFixture(driftFixture);
assert(!driftValidation.passed, "consumer revision drift must fail");
assert(driftValidation.failures.some((failure) => failure.startsWith("consumer-revision-drift:")), "consumer drift failure missing");
assert(driftValidation.snapshot.drift.length === 1, "snapshot should expose one drift record");

const zeroScale = createGoldRushAuthoredTerrainFixture({ unitScale: { metersPerUnit: 0 } });
const zeroScaleValidation = validateAuthoredTerrainSourceFixture(zeroScale);
assert(!zeroScaleValidation.passed, "zero unit scale must fail");
assert(zeroScaleValidation.failures.includes("unit-scale-invalid"), "zero unit scale failure should be explicit");

const clampAsPlayable = createGoldRushAuthoredTerrainFixture({ boundsPolicy: { clampAsPlayable: true } });
const clampAsPlayableValidation = validateAuthoredTerrainSourceFixture(clampAsPlayable);
assert(!clampAsPlayableValidation.passed, "outside clamp as playable must fail");
assert(clampAsPlayableValidation.failures.includes("bounds-policy-clamps-outside-as-playable"), "outside clamp as playable failure should be explicit");

const scaleEchoDrift = createGoldRushAuthoredTerrainFixture({
  consumerScaleEcho: {
    terrainCollider: {
      worldBounds: {
        minX: -10,
        maxX: 10,
        minZ: -10,
        maxZ: 10,
        width: 20,
        depth: 20,
      },
    },
  },
});
const scaleEchoDriftValidation = validateAuthoredTerrainSourceFixture(scaleEchoDrift);
assert(!scaleEchoDriftValidation.passed, "collider/render scale drift must fail");
assert(scaleEchoDriftValidation.failures.includes("consumer-scale-echo-bounds-drift:terrainCollider"), "scale echo drift failure should be explicit");

const missingHeightGrid = createGoldRushAuthoredTerrainFixture({ heightSamples: null });
const missingHeightGridValidation = validateAuthoredTerrainSourceFixture(missingHeightGrid);
assert(!missingHeightGridValidation.passed, "missing height grid must fail");
assert(missingHeightGridValidation.failures.includes("height-samples-missing"), "missing height grid failure should be explicit");

const badHeightDimensions = createGoldRushAuthoredTerrainFixture({ heightSamples: { width: 3 } });
const badHeightDimensionsValidation = validateAuthoredTerrainSourceFixture(badHeightDimensions);
assert(!badHeightDimensionsValidation.passed, "height dimension mismatch must fail");
assert(badHeightDimensionsValidation.failures.includes("height-samples-spacing-x-invalid"), "bad height spacing failure should be explicit");

const nonFiniteHeightValues = fixture.heightSamples.values.map((row) => [...row]);
nonFiniteHeightValues[0][0] = Number.NaN;
const nonFiniteHeight = createGoldRushAuthoredTerrainFixture({ heightSamples: { values: nonFiniteHeightValues } });
const nonFiniteHeightValidation = validateAuthoredTerrainSourceFixture(nonFiniteHeight);
assert(!nonFiniteHeightValidation.passed, "non-finite height sample must fail");
assert(nonFiniteHeightValidation.failures.includes("height-samples-non-finite:0:0"), "non-finite height failure should be explicit");

const outOfRangeHeightValues = fixture.heightSamples.values.map((row) => [...row]);
outOfRangeHeightValues[0][0] = fixture.heightRange.max + 1;
const outOfRangeHeight = createGoldRushAuthoredTerrainFixture({ heightSamples: { values: outOfRangeHeightValues } });
const outOfRangeHeightValidation = validateAuthoredTerrainSourceFixture(outOfRangeHeight);
assert(!outOfRangeHeightValidation.passed, "out-of-range height sample must fail");
assert(outOfRangeHeightValidation.failures.includes("height-samples-out-of-range:0:0"), "out-of-range height failure should be explicit");

const missingMaterialMask = createGoldRushAuthoredTerrainFixture({ materialMask: null });
const missingMaterialMaskValidation = validateAuthoredTerrainSourceFixture(missingMaterialMask);
assert(!missingMaterialMaskValidation.passed, "missing material mask must fail");
assert(missingMaterialMaskValidation.failures.includes("material-mask-missing"), "missing material mask failure should be explicit");

const missingBiomeMask = createGoldRushAuthoredTerrainFixture({ biomeMask: null });
const missingBiomeMaskValidation = validateAuthoredTerrainSourceFixture(missingBiomeMask);
assert(!missingBiomeMaskValidation.passed, "missing biome mask must fail");
assert(missingBiomeMaskValidation.failures.includes("biome-mask-missing"), "missing biome mask failure should be explicit");

const invalidMaterialTagGrid = createGoldRushAuthoredTerrainFixture({
  materialMask: {
    ...fixture.materialMask,
    cells: fixture.materialMask.cells.map((row, rowIndex) => (
      row.map((cell, columnIndex) => (
        rowIndex === 0 && columnIndex === 0
          ? { ...cell, dominantMaterial: "bogus", weights: { bogus: 1 } }
          : cell
      ))
    )),
  },
});
const invalidMaterialTagGridValidation = validateAuthoredTerrainSourceFixture(invalidMaterialTagGrid);
assert(!invalidMaterialTagGridValidation.passed, "invalid material tag must fail");
assert(invalidMaterialTagGridValidation.failures.some((failure) => failure.includes("material-mask-cell:0:0-dominant-tag-invalid")), "invalid material tag failure should be explicit");

const invalidBiomeWeightsGrid = createGoldRushAuthoredTerrainFixture({
  biomeMask: {
    ...fixture.biomeMask,
    cells: fixture.biomeMask.cells.map((row, rowIndex) => (
      row.map((cell, columnIndex) => (
        rowIndex === 0 && columnIndex === 1
          ? { ...cell, weights: { basin: 1.3 } }
          : cell
      ))
    )),
  },
});
const invalidBiomeWeightsGridValidation = validateAuthoredTerrainSourceFixture(invalidBiomeWeightsGrid);
assert(!invalidBiomeWeightsGridValidation.passed, "invalid biome weights must fail");
assert(invalidBiomeWeightsGridValidation.failures.some((failure) => failure.includes("biome-mask-weights:0:1-over-one:basin")), "invalid biome weight failure should be explicit");

const materialBiomeConsumerDrift = createGoldRushAuthoredTerrainFixture({
  materialBiomeConsumerParity: {
    ...fixture.materialBiomeConsumerParity,
    renderTerrain: {
      ...fixture.materialBiomeConsumerParity.renderTerrain,
      samples: fixture.materialBiomeConsumerParity.renderTerrain.samples.map((sample, index) => (
        index === 0 ? { ...sample, material: "bogus" } : sample
      )),
    },
  },
});
const materialBiomeConsumerDriftValidation = validateAuthoredTerrainSourceFixture(materialBiomeConsumerDrift);
assert(!materialBiomeConsumerDriftValidation.passed, "material biome consumer drift must fail");
assert(materialBiomeConsumerDriftValidation.failures.some((failure) => failure.startsWith("material-biome-consumer-parity-material-drift:renderTerrain:")), "material biome consumer drift failure should be explicit");

const heightParityDrift = createGoldRushAuthoredTerrainFixture({
  heightConsumerParity: {
    renderTerrain: {
      ...fixture.heightConsumerParity.renderTerrain,
      samples: fixture.heightConsumerParity.renderTerrain.samples.map((sample, index) => (
        index === 0 ? { ...sample, worldHeight: sample.worldHeight + 1 } : sample
      )),
    },
  },
});
const heightParityDriftValidation = validateAuthoredTerrainSourceFixture(heightParityDrift);
assert(!heightParityDriftValidation.passed, "height consumer parity drift must fail");
assert(heightParityDriftValidation.failures.includes("height-consumer-parity-world-height-drift:renderTerrain:spawn"), "height parity drift failure should be explicit");

const spawnGround = sampleAuthoredTerrainGround(fixture, { x: -120, z: 20 });
assert(spawnGround.accepted === true, "spawn sampleGround query must be accepted");
assert(Array.isArray(spawnGround.normal) || typeof spawnGround.normal === "object", "spawn sampleGround normal missing");
assert(Math.abs(Math.sqrt((spawnGround.normal.x ** 2) + (spawnGround.normal.y ** 2) + (spawnGround.normal.z ** 2)) - 1) < 0.000001, "spawn sampleGround normal must be unit length");
assert(Number.isFinite(spawnGround.slopeDegrees), "spawn sampleGround slope must be finite");
assert(["flat", "walkable", "steep", "blocker", "edge"].includes(spawnGround.slopeClass), "spawn sampleGround slope class missing");
assert(spawnGround.normalSpace.coordinateSpace === "world-space", "spawn sampleGround normal space missing");
assert(spawnGround.walkableSlopeThresholds.walkDegrees === fixture.walkableSlopeThresholds.walkDegrees, "spawn sampleGround threshold echo missing");
assert(typeof spawnGround.material === "string", "spawn sampleGround material missing");
assert(typeof spawnGround.biome === "string", "spawn sampleGround biome missing");
assert(typeof spawnGround.dominantMaterial === "string", "spawn sampleGround dominant material missing");
assert(typeof spawnGround.dominantBiome === "string", "spawn sampleGround dominant biome missing");
assert(spawnGround.renderMaterialEcho.consumerId === "render-terrain", "spawn sampleGround render material echo missing");
assert(spawnGround.audioVfxSurfaceEcho.consumerId === "audio-vfx-surface", "spawn sampleGround audio vfx echo missing");
assert(spawnGround.placementBiomeEcho.consumerId === "raycast-placement", "spawn sampleGround placement biome echo missing");
assert(spawnGround.gameplaySurfaceEcho.consumerId === "gameplay-zones", "spawn sampleGround gameplay surface echo missing");
assert(spawnGround.movementGroundEcho.consumerId === "player-movement", "spawn sampleGround movement echo missing");
assert(spawnGround.placementNormalEcho.consumerId === "raycast-placement", "spawn sampleGround placement echo missing");

const spawnMaterialBiome = sampleAuthoredTerrainMaterialBiome(fixture, { x: -120, z: 20 });
assert(spawnMaterialBiome.accepted === true, "spawn sample material-biome query must be accepted");
assert(spawnMaterialBiome.renderMaterialEcho.consumerId === "render-terrain", "spawn material-biome render echo missing");
assert(spawnMaterialBiome.audioVfxSurfaceEcho.consumerId === "audio-vfx-surface", "spawn material-biome audio echo missing");
assert(spawnMaterialBiome.placementBiomeEcho.consumerId === "raycast-placement", "spawn material-biome placement echo missing");
assert(spawnMaterialBiome.gameplaySurfaceEcho.consumerId === "gameplay-zones", "spawn material-biome gameplay echo missing");

const edgeGround = sampleAuthoredTerrainGround(fixture, { x: fixture.worldBounds.minX, z: fixture.worldBounds.minZ });
assert(edgeGround.accepted === true, "edge sampleGround query must be accepted");
assert(edgeGround.slopeClass === "edge", "edge sampleGround class must be edge");

const outsideGround = sampleAuthoredTerrainGround(fixture, { x: fixture.worldBounds.maxX + 1, z: fixture.worldBounds.maxZ + 1 });
assert(outsideGround.accepted === false, "outside sampleGround query must reject");
assert(outsideGround.slopeClass === "edge", "outside sampleGround class should stay edge");

const groundSnapshot = createAuthoredTerrainGroundSnapshot(fixture);
assert(groundSnapshot.proofPoints.length === fixture.groundProofPoints.length, "ground snapshot proof points missing");
assert(groundSnapshot.materialMask.gridId === fixture.materialMask.gridId, "ground snapshot material mask missing");
assert(groundSnapshot.biomeMask.gridId === fixture.biomeMask.gridId, "ground snapshot biome mask missing");

const materialBiomeSnapshotCheck = createAuthoredTerrainMaterialBiomeSnapshot(fixture);
assert(materialBiomeSnapshotCheck.materialMask.gridId === fixture.materialMask.gridId, "material biome snapshot material mask missing");
assert(materialBiomeSnapshotCheck.biomeMask.gridId === fixture.biomeMask.gridId, "material biome snapshot biome mask missing");
assert(materialBiomeSnapshotCheck.consumerParity.renderTerrain.samples.length === fixture.materialBiomeProofPoints.length, "material biome snapshot consumer parity missing");

const snapshot = createAuthoredTerrainSourceSnapshot(fixture);
assert(snapshot.fixtureId === fixture.fixtureId, "snapshot fixture id missing");
assert(snapshot.revisionId === fixture.revisionId, "snapshot revision id missing");
assert(snapshot.reason === fixture.revisionReason, "snapshot revision reason missing");
assert(snapshot.sourceHash === fixture.sourceHash, "snapshot source hash missing");
assert(snapshot.consumers.length === AUTHORED_TERRAIN_CONSUMERS.length, "snapshot consumer summary missing");
assert(Array.isArray(snapshot.drift) && snapshot.drift.length === 0, "snapshot drift should be empty for clean fixture");
assert(snapshot.validation.passed === true, "snapshot validation state should pass");
assert(snapshot.boundsScale.worldBounds.width === fixture.worldBounds.width, "snapshot bounds scale width missing");
assert(snapshot.boundsScale.unitScale.metersPerUnit === fixture.unitScale.metersPerUnit, "snapshot unit scale missing");
assert(snapshot.boundsScale.routeDistances.length === fixture.scaleProofAnchors.routeBudgets.length, "snapshot route distances missing");
assert(snapshot.height.gridId === fixture.heightSamples.gridId, "snapshot height grid id missing");
assert(snapshot.height.proofPoints.length === fixture.heightProofPoints.length, "snapshot height proof points missing");
assert(snapshot.ground.gridId === fixture.heightSamples.gridId, "snapshot ground grid id missing");
assert(snapshot.ground.proofPoints.length === fixture.groundProofPoints.length, "snapshot ground proof points missing");
assert(snapshot.materialBiome.materialMask.gridId === fixture.materialMask.gridId, "snapshot material biome mask missing");
assert(snapshot.materialBiome.proofPoints.length === fixture.materialBiomeProofPoints.length, "snapshot material biome proof points missing");

const boundsScaleSnapshot = createAuthoredTerrainBoundsScaleSnapshot(fixture);
assert(boundsScaleSnapshot.coordinateSystem.axes.y === "up", "bounds scale snapshot coordinate system missing");
assert(boundsScaleSnapshot.routeDistances.every((route) => route.meters >= route.minMeters && route.meters <= route.maxMeters), "route distances must fit budgets");

const heightSnapshot = createAuthoredTerrainHeightSnapshot(fixture);
assert(heightSnapshot.width === fixture.heightSamples.width, "height snapshot width missing");
assert(heightSnapshot.proofPoints.every((point) => Number.isFinite(point.worldHeight)), "height proof snapshots must be finite");
assert(groundSnapshot.proofPoints.every((point) => Number.isFinite(point.worldHeight)), "ground proof snapshots must be finite");

const insideBounds = queryAuthoredTerrainBounds(fixture, { x: 0, z: 0 }, { queryType: "height" });
assert(insideBounds.accepted === true && insideBounds.playable === true, "inside height query must be accepted as playable");

const outsideBounds = queryAuthoredTerrainBounds(fixture, { x: fixture.worldBounds.maxX + 10, z: 0 }, { queryType: "height" });
assert(outsideBounds.accepted === false && outsideBounds.playable === false, "outside height query must reject playable ground");

const outsideLod = queryAuthoredTerrainBounds(fixture, { x: fixture.worldBounds.maxX + 10, z: 0 }, { queryType: "lod" });
assert(outsideLod.accepted === true && outsideLod.playable === false, "outside lod query should be nearest-edge but not playable");
assert(outsideLod.clampedPoint.x === fixture.worldBounds.maxX, "outside lod query should clamp to nearest edge");

const spawnHeight = sampleAuthoredTerrainHeight(fixture, { x: -120, z: 20 });
assert(spawnHeight.accepted === true, "spawn sampleHeight query must be accepted");
assert(spawnHeight.fixtureId === fixture.fixtureId, "sampleHeight fixture echo missing");
assert(spawnHeight.revisionId === fixture.revisionId, "sampleHeight revision echo missing");
assert(spawnHeight.sourceHash === fixture.sourceHash, "sampleHeight source hash echo missing");
assert(Number.isFinite(spawnHeight.worldHeight), "sampleHeight world height must be finite");
assert(Number.isFinite(spawnHeight.normalizedHeight), "sampleHeight normalized height must be finite");
assert(spawnHeight.interpolation === "bilinear", "sampleHeight interpolation mismatch");
assert(spawnHeight.cell.id.startsWith("height-cell-"), "sampleHeight cell id missing");

const cornerHeight = sampleAuthoredTerrainHeight(fixture, { x: fixture.worldBounds.minX, z: fixture.worldBounds.minZ });
assert(cornerHeight.accepted === true, "corner height sample must be accepted");
assert(cornerHeight.worldHeight === fixture.heightSamples.values[0][0], "corner height should match first source sample");

const outsideHeight = sampleAuthoredTerrainHeight(fixture, { x: fixture.worldBounds.maxX + 1, z: fixture.worldBounds.maxZ + 1 });
assert(outsideHeight.accepted === false, "outside sampleHeight query must reject");
assert(outsideHeight.worldHeight === null, "outside sampleHeight query must not return fallback height");

const identityEvents = createAuthoredTerrainIdentityEvents(fixture);
assert(identityEvents.some((event) => event.type === "terrainSource.loaded"), "loaded identity event missing");
assert(identityEvents.filter((event) => event.type === "terrainSource.consumerReady").length === AUTHORED_TERRAIN_CONSUMERS.length, "consumer ready events missing");
assert(identityEvents.every((event) => event.fixtureId === fixture.fixtureId), "identity events must carry fixture id");
assert(identityEvents.every((event) => event.revisionId === fixture.revisionId), "identity events must carry revision id");

const driftEvents = createAuthoredTerrainIdentityEvents(driftFixture);
assert(driftEvents.some((event) => event.type === "terrainSource.consumerDrift"), "consumer drift event missing");
assert(driftEvents.some((event) => event.type === "terrainSource.rejected"), "drift fixture should emit rejected event");

const staleFlags = createRevisionStaleProofFlags({
  previousRevisionId: fixture.revisionId,
  nextRevisionId: changedSource.revisionId,
});
assert(staleFlags.revisionChanged === true, "revision change should be detected");
for (const domain of ["render", "collider", "placement", "gameplay", "local-proof", "public-proof"]) {
  assert(staleFlags.stale[domain] === true, `${domain} should be stale after revision change`);
}

const scaleStaleFlags = createScaleRevisionStaleProofFlags({
  previousFixture: fixture,
  nextFixture: changedScale,
});
assert(scaleStaleFlags.revisionChanged === true, "scale revision change should be detected");
assert(scaleStaleFlags.changedFields.includes("worldBounds"), "scale stale flags should name changed bounds");
for (const domain of ["render", "collider", "placement", "gameplay", "local-proof", "public-proof"]) {
  assert(scaleStaleFlags.stale[domain] === true, `${domain} should be stale after scale source change`);
}

const heightStaleFlags = createHeightRevisionStaleProofFlags({
  previousFixture: fixture,
  nextFixture: changedHeight,
});
assert(heightStaleFlags.revisionChanged === true, "height revision change should be detected");
assert(heightStaleFlags.changedFields.includes("heightSamples"), "height stale flags should name changed height samples");
for (const domain of ["render", "collider", "movement", "placement", "gameplay", "screenshot-proof", "public-proof"]) {
  assert(heightStaleFlags.stale[domain] === true, `${domain} should be stale after height source change`);
}

const changedGround = createGoldRushAuthoredTerrainFixture({
  walkableSlopeThresholds: {
    walkDegrees: 9,
    slowDegrees: 24,
    slideDegrees: 40,
    blockedDegrees: 40,
  },
  slopeClassTaxonomy: [
    { id: "flat", minDegrees: 0, maxDegrees: 9, walkable: true, movementState: "walk" },
    { id: "walkable", minDegrees: 9, maxDegrees: 24, walkable: true, movementState: "slow" },
    { id: "steep", minDegrees: 24, maxDegrees: 40, walkable: false, movementState: "slide" },
    { id: "blocker", minDegrees: 40, maxDegrees: 90, walkable: false, movementState: "blocked" },
    { id: "edge", minDegrees: null, maxDegrees: null, walkable: false, movementState: "blocked" },
  ],
});
const changedGroundValidation = validateAuthoredTerrainSourceFixture(changedGround);
assert(changedGroundValidation.passed, `changed ground fixture should stay valid when slope thresholds update: ${changedGroundValidation.failures.join(", ")}`);
assert(changedGround.sourceHash !== fixture.sourceHash, "source hash must change when slope thresholds change");
assert(changedGround.revisionId !== fixture.revisionId, "revision id must change when slope thresholds change");

const groundStaleFlags = createNormalSlopeRevisionStaleProofFlags({
  previousFixture: fixture,
  nextFixture: changedGround,
});
assert(groundStaleFlags.revisionChanged === true, "normal slope revision change should be detected");
assert(groundStaleFlags.changedFields.includes("walkableSlopeThresholds"), "ground stale flags should name changed thresholds");
for (const domain of ["render", "collider", "movement", "placement", "gameplay", "screenshot-proof", "public-proof"]) {
  assert(groundStaleFlags.stale[domain] === true, `${domain} should be stale after normal/slope source change`);
}

assert(fixture.restartPacket.fixtureId === fixture.fixtureId, "restart packet fixture id missing");
assert(fixture.restartPacket.revisionId === fixture.revisionId, "restart packet revision id missing");
assert(fixture.restartPacket.requiredFields.includes("staleProofFlags"), "restart packet must require stale proof flags");
assert(fixture.restartPacket.requiredFields.includes("worldBounds"), "restart packet must require world bounds");
assert(fixture.restartPacket.requiredFields.includes("unitScale"), "restart packet must require unit scale");
assert(fixture.restartPacket.requiredFields.includes("heightSamples"), "restart packet must require height samples");

console.log(JSON.stringify({
  status: "authored-terrain-fixture-ready",
  fixtureId: fixture.fixtureId,
  revisionId: fixture.revisionId,
  sourceHash: fixture.sourceHash,
  consumerCount: fixture.consumerEchoes.length,
  worldBounds: fixture.worldBounds,
  metersPerUnit: fixture.unitScale.metersPerUnit,
  heightGrid: {
    gridId: fixture.heightSamples.gridId,
    width: fixture.heightSamples.width,
    height: fixture.heightSamples.height,
    proofPoints: fixture.heightProofPoints.length,
  },
  staleFlagCount: staleFlags.staleDomains.length,
  scaleStaleFieldCount: scaleStaleFlags.changedFields.length,
  heightStaleFieldCount: heightStaleFlags.changedFields.length,
}, null, 2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
