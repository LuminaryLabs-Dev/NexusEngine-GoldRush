import { readFileSync } from "node:fs";
import { createGoldRushProceduralScene, validateProceduralRendererKits } from "../../src/renderer/proceduralKits.js";
import { selectNearestGoldRushObjectAffordance } from "../../src/content/goldrushObjectMicroKits.js";

const descriptors = createGoldRushProceduralScene();
const validation = validateProceduralRendererKits(descriptors);

for (const entry of validation.entries) {
  assert(entry.passed, `${entry.id} failed procedural kit validation`);
}

assert(descriptors.terrain.patches.length >= 4000, "terrain must use many small tessellated patches across the expanded field");
assert(descriptors.terrain.width > descriptors.terrain.depth, "terrain must read as a broad landscape, not an arena token");
assert(descriptors.terrain.width >= 180 && descriptors.terrain.depth >= 110, "terrain footprint must be roughly four times the prior play space");
assert(descriptors.terrain.tessellationAlgorithm === "single-banded-triangle-terrain-v1", "terrain must use the single banded triangle terrain algorithm");
assert(descriptors.terrain.tessellationBands.length === 3, "terrain must define near, middle, and far tessellation bands");
assert(descriptors.terrain.tessellationBands[0].step < descriptors.terrain.tessellationBands[1].step && descriptors.terrain.tessellationBands[1].step < descriptors.terrain.tessellationBands[2].step, "terrain tessellation bands must reduce density with distance");
assert(descriptors.terrainCollider.bridgeTargets.includes("cannon-es-heightfield"), "terrain collider must be bridgeable to cannon-es heightfields");
assert(descriptors.terrainCollider.bridgeTargets.includes("rapier-heightfield"), "terrain collider must be bridgeable to Rapier heightfields");
assert(descriptors.terrainCollider.raycast.mode === "downward-triangle-raycast", "terrain collider must include downward raycast placement");
assert(descriptors.terrainCollider.samples.length === descriptors.terrainCollider.columns * descriptors.terrainCollider.rows, "terrain collider heightfield samples must be valid");
assert(descriptors.terrain.patches.filter((patch) => patch.lodBand === "near" && patch.vertexGrid >= 24).length >= 250, "near terrain patches need high tessellation metadata");
assert(descriptors.terrain.patches.every((patch) => patch.strataBands?.includes("dark-shadow-seam")), "terrain patches must carry strata band metadata");
assert(descriptors.route.routePoints[0].x < -20, "route must start near the far terrain edge");
assert(descriptors.route.routePoints.at(-1).x > 20, "route must cross toward the far terrain edge");
assert(descriptors.goldNodes.nodes.length >= 24, "gold node scatter is too sparse for massive terrain");
assert(descriptors.sky.radius >= 150, "sky kit must surround the expanded terrain");
assert(descriptors.clouds.count >= 6, "cloud kit must provide multiple scrolling 2D planes");
assert(descriptors.canyonComposition.walls.length >= 10, "canyon composition must frame the field with large walls");
assert(descriptors.canyonComposition.farRidge.length >= 18, "canyon composition needs varied far ridge silhouettes");
assert(descriptors.canyonComposition.centralMountains.length >= 3, "canyon composition must include central mountains that force walk-around routing");
assert(descriptors.canyonComposition.centralMountains.every((mountain) => mountain.height >= 6 && mountain.blockerRadius >= 6), "central mountains need readable collision footprints");
assert(
  descriptors.canyonComposition.centralMountains.every((mountain) => mountain.composition === "midground-walkaround-terraced-shoulders" && mountain.visualHeight <= 5.5 && mountain.skyClearance === true),
  "central mountains must use midground terraced composition instead of dark slab meshes"
);
assert(
  descriptors.canyonComposition.walls.some((wall) => wall.side < 0) && descriptors.canyonComposition.walls.some((wall) => wall.side > 0),
  "canyon walls must frame both sides of the playable field"
);
assert(
  ["skull-head", "rib-cage", "bone-arms", "bone-legs", "upper-legs", "knee-joints", "lower-legs", "spawn-pedestal", "hat-brim", "satchel", "cargo-visual-anchor", "carried-gold", "pickaxe"].every((part) => descriptors.playerRig.visualParts.includes(part)),
  "third-person player rig must expose readable skeleton prospector parts"
);
assert(descriptors.desertItems.placements.length >= 80, "desert item kit needs dense prop coverage");
assert(descriptors.desertItems.baseParts.includes("faceted-rock"), "desert item kit must include rocks");
assert(descriptors.desertItems.baseParts.includes("cactus"), "desert item kit must include plants");
assert(descriptors.objectMicroKits.count >= 2500, "object micro-kit generator must create thousands of individual kits");
assert(descriptors.environmentSpace.id === "goldrush.worldUnderstanding.environmentSpace", "environment-space understanding descriptor must exist");
assert(descriptors.environmentSpace.source.includes("not-reference-image-copy"), "environment-space descriptor must reject picture-copy composition");
assert(descriptors.environmentSpace.spaces.some((space) => space.id === "space.wash-floor-trail" && space.sightlineRole === "must-stay-clear"), "wash-floor trail space must preserve route readability");
assert(descriptors.environmentSpace.spaces.some((space) => space.id === "space.mine-shelf" && space.placementRules.includes("portal-embedded-in-wall")), "mine placement must be driven by shelf/wall spatial understanding");
assert(descriptors.environmentSpace.physicalForms.length >= 7, "environment spaces must have physical forms, not only metadata");
assert(
  ["form.wash-floor.trail-cut", "form.mine.shelf-plateau", "form.town.street-shelf", "form.gold.seam-wall", "form.extraction.vista-floor"].every((id) => descriptors.environmentSpace.physicalForms.some((form) => form.id === id)),
  "environment physicalization must include trail cut, mine shelf, town shelf, gold seam wall, and extraction vista"
);
assert(descriptors.objectMicroKits.families.length >= 12, "object micro-kit generator must cover many object families");
assert(
  new Set(descriptors.objectMicroKits.kits.map((kit) => kit.id)).size === descriptors.objectMicroKits.count,
  "object micro-kit ids must be unique"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => kit.individualObject === true),
  "every generated object micro-kit must identify one individual object"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => kit.kit && kit.archetype && kit.role && kit.placement?.zone && kit.visual?.batchKey && kit.transform?.scale > 0),
  "every generated object micro-kit must include taxonomy, placement, visual, and transform metadata"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => kit.protoKit?.kind === "goldrush-procedural-object-protokit" && kit.protoKit.domainPath?.startsWith("n:goldrush:object:")),
  "every generated object must be represented as its own GoldRush procedural object protokit"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => kit.generationLayers?.map((layer) => layer.id).join(">") === "seed>environment-space>raycast-placement>visual-batch>interaction-affordance"),
  "every generated object protokit must use the same layered procedural generation pipeline"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => kit.placement?.raycast?.mode === "downward-triangle-raycast" && kit.placement.raycast.source === "n:world:placement-raycast"),
  "every generated object protokit must be placed by downward terrain raycast"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => (
    kit.visual?.fidelity?.contract === "goldrush-object-visual-fidelity-v1"
    && kit.visual.fidelity.domainPath === "n:render:micro-object-instancing"
    && kit.visual.fidelity.groundContact === "raycast-locked"
    && Number.isFinite(kit.visual.tintColor)
  )),
  "every generated object protokit must expose a renderer-consumable visual fidelity contract"
);
assert(
  new Set(descriptors.objectMicroKits.kits.map((kit) => kit.visual.tintColor)).size >= 24,
  "object protokit visual fidelity must provide enough material tint variation to break up blockout flatness"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => Math.abs(kit.position.y - kit.placement.raycast.surfaceY) < 0.2),
  "object y placement must stay close to the raycast terrain surface"
);
assert(
  descriptors.objectMicroKits.kits.some((kit) => kit.interaction?.enabled && kit.interaction.action === "mine-gold")
    && descriptors.objectMicroKits.kits.some((kit) => kit.interaction?.enabled && kit.interaction.action === "take-cover"),
  "object protokits must expose interaction affordances for mining and cover"
);
const nearestMiningAffordance = selectNearestGoldRushObjectAffordance({
  descriptor: descriptors.objectMicroKits,
  player: { x: -17.5, z: -16.5 },
  actionFilter: "mine-gold",
});
assert(
  nearestMiningAffordance.contract === "goldrush-nearest-object-affordance-v1"
    && nearestMiningAffordance.domainPath === "n:gameplay:interaction-hold"
    && nearestMiningAffordance.selected?.action === "mine-gold"
    && nearestMiningAffordance.selected?.target?.siteId === "mine-seam-01",
  "nearest object affordance selector must connect visible gold protokits to the mining site"
);
assert(
  descriptors.objectMicroKits.kits.every((kit) => kit.placement?.environmentSpaceId?.startsWith("space.")),
  "every generated object micro-kit must be attached to a world-understanding environment space"
);
assert(
  new Set(descriptors.objectMicroKits.kits.map((kit) => kit.placement.zone)).size >= 8,
  "object micro-kit placement must cover authored zones"
);
assert(
  descriptors.objectMicroKits.kits.some((kit) => kit.role === "cover") && descriptors.objectMicroKits.kits.some((kit) => kit.role === "reward-readability"),
  "object micro-kits must include gameplay-readable cover and reward roles"
);
assert(
  ["canyon.wall-segment", "canyon.slope-skirt", "canyon.strata-ribbon", "canyon.shadow-pocket"].every((family) => descriptors.objectMicroKits.families.some((entry) => entry.family === family)),
  "object micro-kits must include integrated canyon wall, skirt, ribbon, and shadow families"
);
assert(
  ["mine.entrance-frame", "mine.support-timber", "mine.ore-cart", "mine.tailings-pile", "mine.lantern-post", "mine.warning-sign"].every((family) => descriptors.objectMicroKits.families.some((entry) => entry.family === family)),
  "object micro-kits must include readable mine camp families"
);
assert(
  descriptors.objectMicroKits.families.some((entry) => entry.family === "gold.seam-vein")
    && descriptors.objectMicroKits.kits.some((kit) => kit.placement.zone === "goldSeamZone" && kit.visual.paletteGroup === "reward-gold"),
  "gold must be represented as a readable seam zone, not only scattered flecks"
);
assert(
  new Set(descriptors.objectMicroKits.kits.map((kit) => kit.placement.placementRole)).size >= 4,
  "object micro-kits must distinguish landmark, support, dressing, and noise placement roles"
);
assert(
  descriptors.objectMicroKits.kits.filter((kit) => kit.placement.zone === "open-field" && kit.placement.placementRole === "noise").length <= 520,
  "open-field noise must be capped so the scene does not read as confetti"
);
assert(
  ["town.frontage-facade", "town.water-tower", "town.frontage-prop"].every((family) => descriptors.objectMicroKits.families.some((entry) => entry.family === family)),
  "object micro-kits must include readable town frontage landmarks"
);
assert(
  descriptors.objectMicroKits.kits.some((kit) => kit.placement.zone === "trailEdgeZone" && kit.geometryRole === "trail-rut"),
  "object micro-kits must include foreground trail edge/rut support"
);
assert(descriptors.glbAssets.assets.length >= 2, "open-source GLB kit must expose imported assets");
assert(descriptors.glbAssets.assets.every((asset) => asset.license === "CC0-1.0"), "GLB imports must keep verified CC0 metadata");

const rendererSource = readFileSync(new URL("../../src/renderer/goldRushRenderer.js", import.meta.url), "utf8");
const proceduralSource = readFileSync(new URL("../../src/renderer/proceduralKits.js", import.meta.url), "utf8");
const objectKitSource = readFileSync(new URL("../../src/content/goldrushObjectMicroKits.js", import.meta.url), "utf8");
const colliderSource = readFileSync(new URL("../../src/physics/terrainCollider.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
const extractionLoopSource = readFileSync(new URL("../../src/kits/goldRushExtractionLoopKit.js", import.meta.url), "utf8");
const playerActionSurfaceSource = readFileSync(new URL("../../src/content/goldrushPlayerActionSurface.js", import.meta.url), "utf8");
const extractionSetpieceProofSource = readFileSync(new URL("../proof/extraction-setpiece-proof.mjs", import.meta.url), "utf8");
assert(!rendererSource.includes("CircleGeometry"), "renderer must not use circular arena primitive");
assert(!rendererSource.includes("BoxGeometry"), "renderer must not use box markers as the core player field");
assert(rendererSource.includes("toneMapping"), "renderer must use tone mapping for the immersive 3D view");
assert(proceduralSource.includes("physics/terrainCollider.js"), "procedural renderer must import the shared terrain collider");
assert(proceduralSource.includes("createTrailRibbon"), "route kit must render a readable trail ribbon");
assert(proceduralSource.includes("createBandedTriangleTerrainGeometry") && proceduralSource.includes("pushTerrainCell"), "renderer must generate banded triangle terrain from one algorithm");
assert(proceduralSource.includes("createEnvironmentPhysicalForm"), "renderer must turn environment-space descriptors into physical scene forms");
assert(colliderSource.includes("trailBanks") && colliderSource.includes("basinBowl") && colliderSource.includes("goldFaceLift") && colliderSource.includes("centralMountainLift"), "terrain height must be shaped by world-space understanding and central mountains");
assert(colliderSource.includes("sampleMountainWalkaroundClearance") && colliderSource.includes("sampleMountainViewClearanceMask"), "terrain collider must own mountain walkaround and view-clearance masks");
assert(colliderSource.includes("raycastTerrainDown") && colliderSource.includes("barycentric2D"), "terrain collider must support downward raycasting onto visible terrain triangles");
assert(proceduralSource.includes("createWalkaroundMountainGeometry"), "renderer must build terraced walkaround mountain geometry");
assert(proceduralSource.includes("createSpawnPedestalGeometry"), "renderer must include a spawn pedestal under the local skeleton character");
assert(proceduralSource.includes("shoulderTarget") && proceduralSource.includes("state.localPlayer") && proceduralSource.includes("state.localPlayer.look?.yaw"), "camera must attach over the local skeleton character shoulder and follow mouse-look yaw");
assert(proceduralSource.includes("goldrush-linear-camera-controller-v1") && proceduralSource.includes("single-three-camera-render"), "camera must expose a linear decoupled controller contract");
assert(proceduralSource.includes("per-frame-camera-catalog-selection"), "camera contract must explicitly reject per-frame catalog selection");
assert(proceduralSource.includes("createMicroInteractionMarker"), "renderer must expose visible interaction markers from object protokit affordances");
assert(proceduralSource.includes("selectNearestGoldRushObjectAffordance") && proceduralSource.includes("nearestAffordance"), "renderer snapshot must expose nearest object affordance selection from protokits");
assert(proceduralSource.includes("goldrush-affordance-marker-readability-v1") && proceduralSource.includes("updateMicroInteractionMarker") && proceduralSource.includes("show-selected-plus-nearby-hide-rest"), "object affordance markers must use a readability policy that hides non-selected clutter");
assert(proceduralSource.includes("goldrush-selected-affordance-cue-v1") && proceduralSource.includes("createSelectedAffordanceCueSnapshot") && proceduralSource.includes("selected-in-world-claim-cue"), "selected object affordances must expose an in-world cue/progress contract");
assert(proceduralSource.includes("goldrush-object-proximity-readability-v1") && proceduralSource.includes("updateMicroObjectVisualDensity") && proceduralSource.includes("clutterScale"), "renderer must compress nearby nonselected object clutter around the selected affordance");
assert(proceduralSource.includes("goldrush-resource-visual-forms-v1") && proceduralSource.includes("createGoldNuggetClusterGeometry") && proceduralSource.includes("createOreLodeChipGeometry") && proceduralSource.includes("createTailingsFanGeometry"), "resource micro-kits must render as readable nugget, ore-lode, seam, and tailings forms");
assert(
  proceduralSource.includes("goldrush-object-visual-fidelity-v1")
    && proceduralSource.includes("createObjectVisualFidelitySnapshot")
    && proceduralSource.includes("visualFidelity: structuredClone(visualFidelity)"),
  "renderer snapshot must expose object visual fidelity proof from object protokits"
);
assert(proceduralSource.includes("goldrush-extraction-cashout-cue-v1") && proceduralSource.includes("createExtractionCashoutCueSnapshot") && proceduralSource.includes("diegetic-cashout-beacon"), "extraction markers must expose a diegetic cashout cue contract");
assert(
  proceduralSource.includes("goldrush-extraction-setpiece-v1")
    && proceduralSource.includes("createExtractionSetpieceSnapshot")
    && proceduralSource.includes("rail-depot-cashout-landmark")
    && proceduralSource.includes("cashout-crossbeam")
    && proceduralSource.includes("cashout-bell"),
  "extraction markers must expose a renderer-owned rail depot setpiece contract"
);
assert(
  proceduralSource.includes("goldrush-extraction-interaction-cue-v1")
    && proceduralSource.includes("createExtractionInteractionCueSnapshot")
    && proceduralSource.includes("diegetic-cashout-hold-feedback")
    && proceduralSource.includes("cashout-hold-progress")
    && proceduralSource.includes("cashout-hold-prompt"),
  "extraction markers must expose a renderer-owned cashout hold interaction cue"
);
assert(
  appSource.includes("publicSmokePlaceAtExtractionSetpiece")
    && extractionSetpieceProofSource.includes("proof-placement-at-extraction-setpiece")
    && extractionSetpieceProofSource.includes("camera-relative-player-view"),
  "extraction setpiece must have a human-view proof path with camera-relative player framing"
);
assert(
  extractionSetpieceProofSource.includes("cashout-hold-progress-proof")
    && extractionSetpieceProofSource.includes("keep-holding-cashout")
    && extractionSetpieceProofSource.includes("extractionInteractionCue"),
  "extraction setpiece proof must validate in-world cashout hold progress feedback"
);
assert(
  objectKitSource.includes("visualForm: \"gold-nugget-cluster\"")
    && objectKitSource.includes("visualForm: \"ore-lode-chip\"")
    && objectKitSource.includes("visualForm: \"gold-seam-lode\"")
    && objectKitSource.includes("visualForm: \"tailings-fan\"")
    && proceduralSource.includes("kit.visual?.resourceForm"),
  "resource visual form identity must live on object protokits and be consumed by the renderer"
);
assert(proceduralSource.includes("everyItemProtoKit") && proceduralSource.includes("raycastPlacement"), "renderer snapshot must expose object protokit and raycast placement proof");
assert(appSource.includes("goldrush-object-interaction-host-v1"), "app state must expose the object interaction host contract");
assert(
  appSource.includes("goldrushPlayerActionSurface")
    && appSource.includes("playerActionSurfaceValidation")
    && playerActionSurfaceSource.includes("goldrush-player-action-surface-v1")
    && playerActionSurfaceSource.includes("n:goldrush:player-action-surface")
    && playerActionSurfaceSource.includes("choosePrimaryAction"),
  "app state must expose a GoldRush player action surface that composes interaction, extraction, cargo, and combat"
);
assert(
  proceduralSource.includes("mountPlayerActionSurfacePromptKit")
    && proceduralSource.includes("goldrush-player-action-surface-visual-v1")
    && proceduralSource.includes("diegetic-player-action-prompt")
    && proceduralSource.includes("state.playerActionSurface")
    && proceduralSource.includes("playerActionSurfacePrompt: playerActionSurfacePromptKit.snapshot()"),
  "renderer must consume player action surface through one diegetic in-world prompt contract"
);
assert(appSource.includes("publicSmokePlaceAtNearestObjectAffordance"), "public smoke proof must be able to place the player by object affordance");
assert(appSource.includes("dispatchNearestObjectAffordance") && appSource.includes("holdExtractionLoopMine({ siteId"), "app interaction must dispatch selected object affordances into domain runtime actions");
assert(appSource.includes("interactionHoldGraceFrames") && extractionLoopSource.includes("!input.holdActive"), "object-affordance holds must not be cancelled by the next extraction-loop tick");
assert(proceduralSource.includes("ribCage") && proceduralSource.includes("bone-arms"), "player rig must read as a skeleton character");
assert(proceduralSource.includes("createKneeLegRig") && proceduralSource.includes("poseKneeLegRig"), "player legs must be two-part rigs with knee animation");
assert(proceduralSource.includes("goldrush-cargo-visual-v1"), "player rig must render kit-owned cargo visual contract data");
assert(proceduralSource.includes("updateCargoVisualGroup") && proceduralSource.includes("createCargoNuggetGeometry"), "player rig must show physical carried gold when cargo exists");
assert(proceduralSource.includes("goldrush-cargo-mobility-v1"), "player rig must preserve kit-owned cargo mobility contract data");
assert(proceduralSource.includes("postureLean") && proceduralSource.includes("movementModifiers"), "player rig must consume cargo mobility as visible posture read");
assert(proceduralSource.includes("playerRig: thirdPersonKit.snapshot()"), "procedural renderer snapshot must expose third-person player rig proof state");
assert(proceduralSource.includes("visibleNuggetCount"), "player rig snapshot must expose visible carried-gold nugget count for browser proof");
assert(!proceduralSource.includes("Math.abs(Math.sin(walkPhase)) * (combat ? 0.015 : 0.045)"), "walk animation must not pulse the whole player root vertically");
assert(proceduralSource.includes("renderGround") && appSource.includes("cached-movement-ground"), "renderer must consume cached movement grounding for stable player/camera height");
assert(proceduralSource.includes("readable-threat-lanes-v1"), "renderer must expose the readable threat lane visual contract");
assert(proceduralSource.includes("readable-threat-cover-v1"), "renderer must expose the readable threat cover visual contract");
assert(proceduralSource.includes("createThreatLaneGeometry") && proceduralSource.includes("updateThreatLaneMesh"), "renderer must draw threat lanes from extraction-loop marker data");
assert(proceduralSource.includes("createThreatCoverGeometry") && proceduralSource.includes("updateThreatCoverMesh"), "renderer must draw threat cover from extraction-loop marker data");
assert(proceduralSource.includes("marker.telegraph?.readableBeforeDamage"), "threat marker pulse must be driven by kit-owned telegraph state");
assert(proceduralSource.includes("marker.lane?.status === \"danger\""), "threat lane color/opacity must be driven by kit-owned lane status");
assert(proceduralSource.includes("cover.id === marker.recommendedCoverId"), "recommended cover highlight must be driven by kit-owned cover state");
assert(proceduralSource.includes("engagedCoverIds"), "renderer snapshot must expose engaged cover ids from kit-owned marker state");
assert(proceduralSource.includes("cover.id === marker.engagedCoverId"), "engaged cover highlight must be driven by kit-owned cover state");
assert(proceduralSource.includes("mesh.userData.engaged = engaged"), "cover mesh userData must expose engaged status for browser proof");

console.log("procedural renderer kits passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
