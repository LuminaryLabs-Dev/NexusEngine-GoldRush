import { readFileSync } from "node:fs";
import { createGoldRushProceduralScene, validateProceduralRendererKits } from "../../src/renderer/proceduralKits.js";

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
  ["skull-head", "rib-cage", "bone-arms", "bone-legs", "upper-legs", "knee-joints", "lower-legs", "spawn-pedestal", "hat-brim", "satchel", "pickaxe"].every((part) => descriptors.playerRig.visualParts.includes(part)),
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
const colliderSource = readFileSync(new URL("../../src/physics/terrainCollider.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../../src/app/goldRushApp.js", import.meta.url), "utf8");
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
assert(proceduralSource.includes("ribCage") && proceduralSource.includes("bone-arms"), "player rig must read as a skeleton character");
assert(proceduralSource.includes("createKneeLegRig") && proceduralSource.includes("poseKneeLegRig"), "player legs must be two-part rigs with knee animation");
assert(!proceduralSource.includes("Math.abs(Math.sin(walkPhase)) * (combat ? 0.015 : 0.045)"), "walk animation must not pulse the whole player root vertically");
assert(proceduralSource.includes("renderGround") && appSource.includes("cached-movement-ground"), "renderer must consume cached movement grounding for stable player/camera height");

console.log("procedural renderer kits passed");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
