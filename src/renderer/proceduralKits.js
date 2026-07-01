import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createGoldRushWorldElements, validateGoldRushWorldElements } from "../content/goldrushWorldElements.js";
import {
  createGoldRushObjectMicroKits,
  selectNearestGoldRushObjectAffordance,
  validateGoldRushObjectMicroKits,
} from "../content/goldrushObjectMicroKits.js";
import { createGoldRushEnvironmentSpace, validateGoldRushEnvironmentSpace } from "../content/goldrushEnvironmentSpace.js";
import { openSourceGlbAssets } from "../content/openSourceGlbAssets.js";
import {
  CENTRAL_MOUNTAIN_FORMS,
  TERRAIN_DEPTH,
  TERRAIN_PATCH_COLUMNS,
  TERRAIN_PATCH_ROWS,
  TERRAIN_PATCH_SIZE,
  TERRAIN_WIDTH,
  createTerrainColliderDescriptor,
  createTerrainTessellationBands,
  terrainFieldBaseHeight,
  terrainFieldColor,
  terrainFieldHeight,
  validateTerrainColliderDescriptor,
} from "../physics/terrainCollider.js";

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export const proceduralRendererKitSpecs = [
  {
    id: "goldrush.procTerrain.patchTessellation",
    purpose: "Massive rectangular terrain made from many small tessellated patches.",
    validate: validateTerrainDescriptor,
  },
  {
    id: "goldrush.procTerrain.sharedHeightfieldCollider",
    purpose: "Shared terrain collider heightfield using the same algorithm as the visible terrain.",
    validate: (descriptor) => validateTerrainColliderDescriptor(descriptor).passed,
  },
  {
    id: "goldrush.procTerrain.routeRibbon",
    purpose: "Exploration and extraction path cues over the terrain field.",
    validate: validateRouteDescriptor,
  },
  {
    id: "goldrush.procTerrain.goldNodeScatter",
    purpose: "Gold node placeholders distributed across terrain patches.",
    validate: validateGoldNodeDescriptor,
  },
  {
    id: "goldrush.procTerrain.networkPresenceMarkers",
    purpose: "Small debug field-team markers for internal network occupancy.",
    validate: validateNetworkPresenceDescriptor,
  },
  {
    id: "goldrush.procScene.lightingCamera",
    purpose: "Scene lighting and over-the-shoulder camera presets for exploration and combat.",
    validate: validateLightingDescriptor,
  },
  {
    id: "goldrush.procScene.thirdPersonPlayerRig",
    purpose: "Visible third-person player rig with local walk and aim animation.",
    validate: validateThirdPersonRigDescriptor,
  },
  {
    id: "goldrush.procSky.horizonSkybox",
    purpose: "Skybox and far terrain blend so the field reaches into the horizon.",
    validate: validateSkyDescriptor,
  },
  {
    id: "goldrush.procSky.cloudPlanes",
    purpose: "2D transparent cloud planes scrolling above the terrain.",
    validate: validateCloudPlaneDescriptor,
  },
  {
    id: "goldrush.procLandmarks.canyonComposition",
    purpose: "Large authored canyon silhouettes and mesa walls that frame the gold field.",
    validate: validateCanyonCompositionDescriptor,
  },
  {
    id: "goldrush.procProps.desertItemLibrary",
    purpose: "Reference-image item kit for rocks, plants, mine props, camp props, and debris.",
    validate: validateDesertItemDescriptor,
  },
  {
    id: "goldrush.procObjects.microObjectKits",
    purpose: "Thousands of individual object micro-kits for local terrain, plants, rocks, mining debris, camp detail, trails, and cover.",
    validate: validateGoldRushObjectMicroKits,
  },
  {
    id: "goldrush.worldUnderstanding.environmentSpace",
    purpose: "Spatial understanding of canyon basin, wash floor, mine shelf, town shelf, ridge walls, gold seams, and sightlines.",
    validate: validateGoldRushEnvironmentSpace,
  },
  {
    id: "goldrush.procAssets.openSourceGlbLibrary",
    purpose: "License-clear GLB imports loaded as additive scene detail over procedural fallbacks.",
    validate: validateOpenSourceGlbDescriptor,
  },
  {
    id: "goldrush.procWorld.elements",
    purpose: "Procedural towns, mountains, landmarks, paths, gold zones, and loading gates.",
    validate: (descriptor) => validateGoldRushWorldElements(descriptor).passed,
  },
];

export function createGoldRushProceduralScene() {
  const terrain = createTerrainDescriptor();
  const terrainCollider = createTerrainColliderDescriptor({
    minX: terrain.bounds.minX,
    maxX: terrain.bounds.maxX,
    minZ: terrain.bounds.minZ,
    maxZ: terrain.bounds.maxZ,
    step: terrain.patchSize,
  });
  const route = createRouteDescriptor(terrain);
  const goldNodes = createGoldNodeDescriptor(terrain);
  const networkPresence = createNetworkPresenceDescriptor(terrain);
  const lighting = createLightingDescriptor(terrain);
  const playerRig = createThirdPersonRigDescriptor();
  const sky = createSkyDescriptor(terrain);
  const clouds = createCloudPlaneDescriptor(terrain);
  const canyonComposition = createCanyonCompositionDescriptor(terrain);
  const desertItems = createDesertItemDescriptor(terrain);
  const environmentSpace = createGoldRushEnvironmentSpace({ terrain });
  const objectMicroKits = createGoldRushObjectMicroKits({ terrain, environmentSpace });
  const glbAssets = createOpenSourceGlbDescriptor();
  const worldElements = createGoldRushWorldElements();

  return {
    terrain,
    terrainCollider,
    route,
    goldNodes,
    networkPresence,
    lighting,
    playerRig,
    sky,
    clouds,
    canyonComposition,
    desertItems,
    objectMicroKits,
    environmentSpace,
    glbAssets,
    worldElements,
    validate() {
      return validateProceduralRendererKits({
        terrain,
        terrainCollider,
        route,
        goldNodes,
        networkPresence,
        lighting,
        playerRig,
        sky,
        clouds,
        canyonComposition,
        desertItems,
        objectMicroKits,
        environmentSpace,
        glbAssets,
        worldElements,
      });
    },
  };
}

export function mountGoldRushProceduralScene({ scene, root }) {
  const descriptors = createGoldRushProceduralScene();
  const validation = descriptors.validate();
  if (!validation.passed) {
    throw new Error(`procedural renderer kit validation failed: ${validation.failures.join("; ")}`);
  }

  scene.background = new THREE.Color(0x6f9eaa);
  scene.fog = new THREE.Fog(0x7c9386, 62, 230);

  const skyKit = mountSkyHorizonKit(scene, descriptors.sky);
  const terrainGroup = mountTerrainKit(scene, descriptors.terrain);
  const canyonKit = mountCanyonCompositionKit(scene, descriptors.canyonComposition);
  const routeGroup = mountRouteKit(scene, descriptors.route);
  const goldGroup = mountGoldNodeKit(scene, descriptors.goldNodes);
  const cloudKit = mountCloudPlaneKit(scene, descriptors.clouds);
  const microObjectKit = mountMicroObjectKit(scene, descriptors.objectMicroKits);
  mountDesertItemKit(scene, descriptors.desertItems);
  const glbKit = mountOpenSourceGlbKit(scene, descriptors.glbAssets);
  const worldElementKit = mountWorldElementKit(scene, descriptors.worldElements);
  mountEnvironmentSpaceKit(scene, descriptors.environmentSpace);
  const networkPresenceKit = mountNetworkPresenceKit(scene, descriptors.networkPresence);
  const thirdPersonKit = mountThirdPersonPlayerKit(scene, descriptors.playerRig);
  const playerActionSurfacePromptKit = mountPlayerActionSurfacePromptKit(scene);
  const extractionLoopMarkerKit = mountExtractionLoopMarkerKit(scene);
  const lightingKit = mountLightingCameraKit(scene, descriptors.lighting, root);

  return {
    descriptors,
    validation,
    update(state, elapsedSeconds = 0) {
      skyKit.update(state);
      canyonKit.update(state);
      cloudKit.update(elapsedSeconds);
      microObjectKit.update(state, elapsedSeconds);
      glbKit.update(state, elapsedSeconds);
      worldElementKit.update(state);
      networkPresenceKit.update(state);
      thirdPersonKit.update(state, elapsedSeconds);
      playerActionSurfacePromptKit.update(state, elapsedSeconds);
      extractionLoopMarkerKit.update(state, elapsedSeconds);
      goldGroup.rotation.y += state.cameraMode === "combat" ? 0.004 : 0.0015;
      routeGroup.children.forEach((child, index) => {
        const opacity = state.cameraMode === "combat" && index === 1 ? 0.92 : child.userData.baseOpacity;
        child.children.forEach((routeMarker) => {
          routeMarker.material.opacity = opacity;
        });
      });
      lightingKit.update(state);
      terrainGroup.position.y = state.cameraMode === "combat" ? -0.18 : 0;
      const pressure = state.finalRush?.pressureScalar ?? 0;
      const atmosphere = resolveConditionAtmosphere(state.frontierConditionEffects?.render, pressure);
      scene.background = new THREE.Color(atmosphere.background);
      scene.fog.color = new THREE.Color(atmosphere.fog);
      scene.fog.near = atmosphere.fogNear;
      scene.fog.far = atmosphere.fogFar;
    },
    getCamera() {
      return lightingKit.camera;
    },
    snapshot() {
      return {
        camera: lightingKit.snapshot(),
        gameplay: {
          extractionLoopMarkers: extractionLoopMarkerKit.snapshot(),
          playerActionSurfacePrompt: playerActionSurfacePromptKit.snapshot(),
        },
        objectMicroKits: microObjectKit.snapshot(),
        playerRig: thirdPersonKit.snapshot(),
        validation,
      };
    },
  };
}

function resolveConditionAtmosphere(render = null, pressure = 0) {
  if (pressure > 0.6) return { background: 0x8c6d56, fog: 0x9b7958, fogNear: 44, fogFar: 190 };
  if (pressure > 0) return { background: 0x8da39a, fog: 0xa5a071, fogNear: 54, fogFar: 215 };
  const dust = Math.max(0, Math.min(1, render?.dust ?? 0.15));
  const fogDensity = Math.max(0.04, Math.min(0.4, render?.fogDensity ?? 0.08));
  const palette = atmospherePalette(render?.lightingKey, render?.sky);
  return {
    background: palette.background,
    fog: palette.fog,
    fogNear: Math.round(68 - dust * 28 - fogDensity * 20),
    fogFar: Math.round(250 - dust * 70 - fogDensity * 90),
  };
}

function atmospherePalette(lightingKey = "", sky = "") {
  if (lightingKey.includes("moon") || sky.includes("moon")) return { background: 0x435b71, fog: 0x4f6577 };
  if (lightingKey.includes("sunset") || sky.includes("red")) return { background: 0xa76645, fog: 0xb98257 };
  if (lightingKey.includes("haze") || sky.includes("dust")) return { background: 0xa08b6b, fog: 0xb79a72 };
  if (lightingKey.includes("smoky") || sky.includes("smoke")) return { background: 0x8e826f, fog: 0x9a876e };
  if (lightingKey.includes("golden")) return { background: 0xb79d67, fog: 0xc7a86f };
  return { background: 0x6f9eaa, fog: 0x7c9386 };
}

export function validateProceduralRendererKits(descriptors = createGoldRushProceduralScene()) {
  const entries = proceduralRendererKitSpecs.map((spec) => {
    const descriptor = descriptors[descriptorKeyForSpec(spec.id)];
    return {
      id: spec.id,
      passed: spec.validate(descriptor),
      purpose: spec.purpose,
    };
  });
  return {
    passed: entries.every((entry) => entry.passed),
    entries,
    failures: entries.filter((entry) => !entry.passed).map((entry) => entry.id),
  };
}

function createTerrainDescriptor() {
  const patchColumns = TERRAIN_PATCH_COLUMNS;
  const patchRows = TERRAIN_PATCH_ROWS;
  const patchSize = TERRAIN_PATCH_SIZE;
  const width = patchColumns * patchSize;
  const depth = patchRows * patchSize;
  const patches = [];

  for (let row = 0; row < patchRows; row += 1) {
    for (let column = 0; column < patchColumns; column += 1) {
      const x = (column - patchColumns / 2 + 0.5) * patchSize;
      const z = (row - patchRows / 2 + 0.5) * patchSize;
      const ridge = Math.sin(column * 0.9) * 0.18 + Math.cos(row * 0.65) * 0.14;
      const biomeSeed = (column * 17 + row * 31) % 7;
      const edge = Math.abs(column - patchColumns / 2) / (patchColumns / 2);
      const lodBand = edge > 0.76 || row < 4 || row > patchRows - 5 ? "far" : edge > 0.42 ? "mid" : "near";
      const canyonSide = edge > 0.62 ? (column < patchColumns / 2 ? "west-wall" : "east-wall") : "wash-floor";
      patches.push({
        id: `terrain-patch-${row + 1}-${column + 1}`,
        seed: column * 73856093 ^ row * 19349663,
        column,
        row,
        x,
        z,
        size: patchSize,
        lodBand,
        vertexGrid: lodBand === "near" ? 24 : lodBand === "mid" ? 14 : 8,
        canyonSide,
        erosion: Number((0.42 + ((column * 13 + row * 19) % 31) / 100).toFixed(2)),
        heightRange: canyonSide === "wash-floor" ? [Number((ridge - 0.35).toFixed(2)), Number((ridge + 0.72).toFixed(2))] : [0.8, 5.8],
        strataBands: ["sandstone-base", "red-rock-mid", "dark-shadow-seam", "pale-ridge-cap"],
        elevation: Number(ridge.toFixed(3)),
        biome: biomeSeed < 2 ? "dry-wash" : biomeSeed < 5 ? "scrub" : "ridge",
        color: biomeSeed < 2 ? 0x866538 : biomeSeed < 5 ? 0x9b7a45 : 0x6f7246,
      });
    }
  }

  const tessellationBands = createTerrainTessellationBands({ width, depth, patchSize });

  return {
    id: "goldrush.procTerrain.patchTessellation",
    patchColumns,
    patchRows,
    patchSize,
    width,
    depth,
    patches,
    tessellationAlgorithm: "single-banded-triangle-terrain-v1",
    tessellationBands,
    bounds: {
      minX: -width / 2,
      maxX: width / 2,
      minZ: -depth / 2,
      maxZ: depth / 2,
    },
  };
}

function createRouteDescriptor(terrain) {
  const routePoints = Array.from({ length: 44 }, (_, index) => {
    const t = index / 43;
    const x = terrain.bounds.minX + terrain.width * t;
    const centralDetour = Math.exp(-Math.pow((t - 0.52) / 0.16, 2)) * 21;
    const z = Math.sin(t * Math.PI * 2.4) * 8.5 + (t - 0.5) * terrain.depth * 0.38 + centralDetour;
    return { x, z };
  });
  const combatRidge = Array.from({ length: 24 }, (_, index) => {
    const t = index / 23;
    return {
      x: terrain.bounds.maxX - terrain.width * 0.36 - t * terrain.width * 0.28,
      z: terrain.bounds.minZ + terrain.depth * 0.24 + Math.sin(t * Math.PI) * 4.6,
    };
  });

  return {
    id: "goldrush.procTerrain.routeRibbon",
    routePoints,
    combatRidge,
  };
}

function createGoldNodeDescriptor(terrain) {
  const patches = terrain.patches.filter((patch) => (patch.column * 3 + patch.row * 5) % 11 === 0).slice(0, 32);
  return {
    id: "goldrush.procTerrain.goldNodeScatter",
    nodes: patches.map((patch, index) => ({
      id: `visual-gold-node-${index + 1}`,
      x: patch.x + ((index % 3) - 1) * 0.3,
      z: patch.z + (((index + 1) % 3) - 1) * 0.24,
      height: 0.16 + (index % 5) * 0.035,
    })),
  };
}

function createNetworkPresenceDescriptor(terrain) {
  const lanes = [
    { partitionId: "partition-1", x: terrain.bounds.minX + 6.5, z: terrain.bounds.minZ + 4.2, color: 0xf5b544 },
    { partitionId: "partition-2", x: terrain.bounds.maxX - 10.5, z: terrain.bounds.maxZ - 7.6, color: 0x74d0c2 },
  ];
  return {
    id: "goldrush.procTerrain.networkPresenceMarkers",
    maxPlayers: 100,
    maxVisibleMarkers: 12,
    lanes,
    spacing: 0.62,
  };
}

function createThirdPersonRigDescriptor() {
  return {
    id: "goldrush.procScene.thirdPersonPlayerRig",
    dependencyStrategy: {
      activeRuntime: "three-procedural-bone-groups",
      futureAssetRuntime: "three-gltf-animation-mixer",
      futureRiggingSource: "mesh2motion-or-approved-gltf-import",
    },
    anchor: { x: -12, y: 0, z: -20 },
    shoulder: { x: 0.34, y: 1.26, z: -0.24 },
    aimTarget: { x: 0.2, y: 1.12, z: 2.2 },
    locomotion: {
      walkSpeed: 0.8,
      strideAmplitude: 0.36,
      aimSwayAmplitude: 0.08,
    },
    visualParts: [
      "hat-brim",
      "hat-crown",
      "skull-head",
      "rib-cage",
      "bone-arms",
      "bone-legs",
      "upper-legs",
      "knee-joints",
      "lower-legs",
      "belt",
      "boots",
      "satchel",
      "cargo-visual-anchor",
      "carried-gold",
      "pickaxe",
      "spawn-pedestal",
    ],
    scale: 1,
  };
}

function createSkyDescriptor(terrain) {
  return {
    id: "goldrush.procSky.horizonSkybox",
    radius: 600,
    horizonSkirtRadius: Math.max(terrain.width, terrain.depth) * 4.6,
    horizonSkirtSegments: 56,
    colors: {
      zenith: 0x91b7c8,
      horizon: 0xd7aa72,
      groundBlend: 0xa66a38,
    },
  };
}

function createCloudPlaneDescriptor(terrain) {
  return {
    id: "goldrush.procSky.cloudPlanes",
    count: 9,
    altitude: 18,
    scrollSpeed: 0.018,
    bounds: {
      minX: terrain.bounds.minX * 1.8,
      maxX: terrain.bounds.maxX * 1.8,
      minZ: terrain.bounds.minZ * 1.5,
      maxZ: terrain.bounds.maxZ * 1.5,
    },
  };
}

function createCanyonCompositionDescriptor(terrain) {
  const walls = [];
  const wallZ = [-58, -44, -30, -16, -3, 12, 28, 44, 58];
  for (const side of [-1, 1]) {
    wallZ.forEach((z, index) => {
      walls.push({
        id: `canyon.wall.${side < 0 ? "west" : "east"}.${index + 1}`,
        side,
        x: side * (terrain.width * 0.48 + (index % 2) * 4.2),
        z,
        width: 12.8 + (index % 3) * 2.2,
        depth: 11.2 + (index % 2) * 2.1,
        height: 5.2 + index * 0.7,
        baseInset: -1.05,
        color: index % 2 ? 0xae5c35 : 0xc06a3a,
      });
    });
  }
  const centralMountains = createCentralMountainDescriptor();
  const farRidge = Array.from({ length: 28 }, (_, index) => {
    const t = index / 27;
    return {
      id: `canyon.farRidge.${String(index + 1).padStart(2, "0")}`,
      x: terrain.bounds.minX + terrain.width * t,
      z: terrain.bounds.maxZ + 14 + Math.sin(t * Math.PI * 4.2) * 5.4,
      height: Number((3.8 + Math.sin(t * Math.PI * 7.4) * 1.2 + (index % 4) * 0.72).toFixed(2)),
      width: Number((8.2 + (index % 5) * 1.35).toFixed(2)),
    };
  });

  return {
    id: "goldrush.procLandmarks.canyonComposition",
    role: "frame-field-and-break-flat-horizon",
    walls,
    centralMountains,
    farRidge,
    minWallCount: 10,
  };
}

function createCentralMountainDescriptor() {
  return CENTRAL_MOUNTAIN_FORMS.map((form, index) => ({
    ...form,
    composition: "midground-walkaround-terraced-shoulders",
    screenRole: "midground-landmark",
    terraceCount: 4,
    skyClearance: true,
    placement: "base-terrain-not-lifted-collider-summit",
    routeGapRole: index === 1 ? "split-left-right-with-visible-sky-gap" : "supporting-shoulder-not-ceiling",
    visualHeight: Number(Math.min(4.7, form.height * 0.48).toFixed(2)),
    visualWidth: Number((form.width * (index === 2 ? 0.64 : 0.7)).toFixed(2)),
    visualDepth: Number((form.depth * (index === 2 ? 0.62 : 0.68)).toFixed(2)),
  }));
}

function createDesertItemDescriptor(terrain) {
  const baseParts = [
    "faceted-rock",
    "cactus",
    "dry-grass",
    "mine-portal",
    "rail-track",
    "mine-cart",
    "barrel",
    "canvas-tent",
    "crate",
    "campfire",
    "lantern",
    "bone-debris",
  ];
  const placements = [];
  for (let index = 0; index < 72; index += 1) {
    const kind = baseParts[index % 3];
    placements.push({
      id: `desert.scatter.${index + 1}`,
      kind,
      x: terrain.bounds.minX + ((index * 17) % Math.floor(terrain.width)),
      z: terrain.bounds.minZ + ((index * 29) % Math.floor(terrain.depth)),
      scale: 0.65 + (index % 5) * 0.12,
      rotation: (index % 8) * 0.38,
    });
  }
  placements.push(
    { id: "desert.mine.portal", kind: "mine-portal", x: -8.8, z: 7.6, scale: 1.4, rotation: 0.05 },
    { id: "desert.rail.track", kind: "rail-track", x: -6.4, z: 4.8, scale: 1.2, rotation: -0.25 },
    { id: "desert.mine.cart", kind: "mine-cart", x: -4.4, z: 3.8, scale: 0.8, rotation: -0.28 },
    { id: "desert.camp.tent", kind: "canvas-tent", x: 7.2, z: 2.9, scale: 1.25, rotation: -0.2 },
    { id: "desert.camp.fire", kind: "campfire", x: 4.7, z: 1.2, scale: 0.9, rotation: 0 },
    { id: "desert.camp.crate", kind: "crate", x: 8.8, z: 1.1, scale: 0.8, rotation: 0.4 },
    { id: "desert.camp.barrel", kind: "barrel", x: 9.8, z: 1.6, scale: 0.85, rotation: 0 },
    { id: "desert.camp.lantern", kind: "lantern", x: 3.6, z: 0.4, scale: 0.55, rotation: 0 },
    { id: "desert.camp.bones", kind: "bone-debris", x: 2.4, z: 1.6, scale: 0.7, rotation: 0.6 }
  );

  return {
    id: "goldrush.procProps.desertItemLibrary",
    reference: "low-poly-desert-gold-rush-items",
    baseParts,
    placements,
  };
}

function createOpenSourceGlbDescriptor() {
  return {
    id: "goldrush.procAssets.openSourceGlbLibrary",
    assets: openSourceGlbAssets,
    loader: "three-gltf-loader",
    fallback: "procedural-desert-item-library",
  };
}

function createLightingDescriptor(terrain) {
  return {
    id: "goldrush.procScene.lightingCamera",
    model: "over-the-shoulder-third-person",
    camera: {
      exploration: { position: [2.8, 3.4, -8.2], lookAt: [0, 1.1, 1.8], fov: 54 },
      combat: { position: [1.6, 2.2, -5.4], lookAt: [0.2, 1.1, 1.2], fov: 58 },
    },
    lightRig: {
      key: { color: 0xffdf9e, intensity: 2.3, position: [16, 22, 11] },
      fill: { color: 0x8fc4bf, intensity: 0.68 },
    },
    terrainWidth: terrain.width,
  };
}

function mountSkyHorizonKit(scene, descriptor) {
  const skirt = new THREE.Mesh(
    createHorizonSkirtGeometry(descriptor.horizonSkirtRadius, descriptor.horizonSkirtSegments),
    new THREE.MeshBasicMaterial({
      color: descriptor.colors.groundBlend,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  skirt.name = `${descriptor.id}.groundBlend`;
  skirt.position.y = -0.82;
  scene.add(skirt);

  return {
    update(state = {}) {
      const pressure = state.finalRush?.pressureScalar ?? 0;
      skirt.material.opacity = pressure > 0.62 ? 0.34 : 0.22;
    },
  };
}

function mountCloudPlaneKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const texture = createCloudTexture();
  const width = 16;
  const depth = 5.5;
  const spanX = descriptor.bounds.maxX - descriptor.bounds.minX;
  const spanZ = descriptor.bounds.maxZ - descriptor.bounds.minZ;

  for (let index = 0; index < descriptor.count; index += 1) {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.28 + (index % 3) * 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(width + (index % 4) * 4, depth + (index % 2) * 2), material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(
      descriptor.bounds.minX + ((index * 19) % spanX),
      descriptor.altitude + (index % 4) * 1.7,
      descriptor.bounds.minZ + ((index * 13) % spanZ)
    );
    plane.userData.seed = index * 0.73;
    group.add(plane);
  }

  scene.add(group);

  return {
    update(elapsedSeconds = 0) {
      group.children.forEach((plane, index) => {
        const drift = elapsedSeconds * descriptor.scrollSpeed * (12 + index);
        plane.position.x = wrap(descriptor.bounds.minX, descriptor.bounds.maxX, plane.position.x + drift * 0.018);
        plane.position.z = wrap(descriptor.bounds.minZ, descriptor.bounds.maxZ, plane.position.z + Math.sin(elapsedSeconds * 0.05 + index) * 0.002);
      });
    },
  };
}

function mountCanyonCompositionKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  descriptor.walls.forEach((wall, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: wall.color,
      roughness: 0.96,
      flatShading: true,
      emissive: 0x1d0d06,
      emissiveIntensity: 0.08,
    });
    const mesh = new THREE.Mesh(createCanyonWallGeometry(wall), material);
    mesh.position.set(wall.x, terrainFieldHeight(wall.x, wall.z) + wall.height * 0.22 + wall.baseInset, wall.z);
    mesh.rotation.y = wall.side < 0 ? -0.22 - index * 0.02 : 0.22 + index * 0.02;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });
  const ridgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c4a2c,
    roughness: 0.98,
    flatShading: true,
    emissive: 0x160905,
    emissiveIntensity: 0.05,
  });
  descriptor.farRidge.forEach((ridge, index) => {
    const mesh = new THREE.Mesh(createCanyonWallGeometry({
      width: ridge.width,
      depth: 3.4 + (index % 3) * 0.6,
      height: ridge.height,
    }), ridgeMaterial);
    mesh.name = ridge.id;
    mesh.position.set(ridge.x, terrainFieldHeight(ridge.x, ridge.z) + ridge.height * 0.36 - 0.7, ridge.z);
    mesh.rotation.y = Math.sin(index * 1.7) * 0.28;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });
  descriptor.centralMountains.forEach((mountain, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: mountain.color,
      roughness: 0.94,
      flatShading: true,
      emissive: 0x2a1208,
      emissiveIntensity: 0.045,
    });
    const mesh = new THREE.Mesh(createWalkaroundMountainGeometry(mountain), material);
    mesh.name = mountain.id;
    mesh.position.set(mountain.x, terrainFieldBaseHeight(mountain.x, mountain.z) + 0.16, mountain.z);
    mesh.rotation.y = -0.18 + index * 0.2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });
  scene.add(group);

  return {
    update(state = {}) {
      const pressure = state.finalRush?.pressureScalar ?? 0;
      group.children.forEach((wall) => {
        wall.material.emissiveIntensity = pressure > 0.62 ? 0.14 : 0.08;
      });
    },
  };
}

function mountDesertItemKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const materials = {
    rock: new THREE.MeshStandardMaterial({ color: 0xb05b2d, roughness: 0.96, flatShading: true }),
    darkRock: new THREE.MeshStandardMaterial({ color: 0x71351f, roughness: 0.98, flatShading: true }),
    cactus: new THREE.MeshStandardMaterial({ color: 0x5d8b49, roughness: 0.84, flatShading: true }),
    grass: new THREE.MeshStandardMaterial({ color: 0xb2a15a, roughness: 0.9, flatShading: true }),
    wood: new THREE.MeshStandardMaterial({ color: 0x7b4b2f, roughness: 0.86, flatShading: true }),
    metal: new THREE.MeshStandardMaterial({ color: 0x868889, roughness: 0.64, metalness: 0.24, flatShading: true }),
    canvas: new THREE.MeshStandardMaterial({ color: 0xd8c09b, roughness: 0.82, flatShading: true }),
    fire: new THREE.MeshStandardMaterial({ color: 0xf2a13b, emissive: 0x7b2a00, roughness: 0.38, flatShading: true }),
    bone: new THREE.MeshStandardMaterial({ color: 0xded4bf, roughness: 0.72, flatShading: true }),
  };

  descriptor.placements.forEach((placement) => {
    const item = createDesertItem(placement, materials);
    item.name = placement.id;
    item.position.set(placement.x, 0.18, placement.z);
    item.rotation.y = placement.rotation;
    item.scale.setScalar(placement.scale);
    group.add(item);
  });

  scene.add(group);
  return group;
}

function mountOpenSourceGlbKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  scene.add(group);

  const loader = new GLTFLoader();
  const loaded = [];
  const base = import.meta.env.BASE_URL ?? "/";
  descriptor.assets.forEach((asset) => {
    const url = `${base}${asset.runtimePath}`;
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.name = asset.id;
        model.position.set(asset.placement.x, asset.placement.y, asset.placement.z);
        model.rotation.y = asset.placement.rotation;
        model.scale.setScalar(asset.placement.scale);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness ?? 0.75, 0.78);
              child.material.flatShading = true;
            }
          }
        });
        group.add(model);
        loaded.push(model);
      },
      undefined,
      () => {
        group.userData.failedAssets = [...(group.userData.failedAssets ?? []), asset.id];
      }
    );
  });

  return {
    update(_state, elapsedSeconds = 0) {
      loaded.forEach((model, index) => {
        model.rotation.y += Math.sin(elapsedSeconds * 0.45 + index) * 0.0008;
      });
    },
  };
}

function mountTerrainKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const mesh = new THREE.Mesh(
    createBandedTriangleTerrainGeometry(descriptor),
    new THREE.MeshStandardMaterial({
      roughness: 0.98,
      metalness: 0.01,
      flatShading: true,
      vertexColors: true,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: 0.2,
      polygonOffsetUnits: 0.2,
    })
  );
  mesh.name = `${descriptor.id}.continuousField`;
  mesh.userData.meshReliability = {
    winding: "front-side-upward",
    overlapPolicy: "finer-terrain-bands-carve-coarse-band-top-faces",
    physicsSource: "terrainCollider-heightfield",
  };
  group.add(mesh);
  scene.add(group);
  return group;
}

function mountMicroObjectKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const buckets = new Map();
  const interactionGroup = new THREE.Group();
  interactionGroup.name = `${descriptor.id}.interactionAffordances`;
  const markerReadabilityPolicy = {
    contract: "goldrush-affordance-marker-readability-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: "n:gameplay:interaction-hold",
    selectedVisible: 1,
    maxNearbyVisible: 5,
    hiddenDefault: true,
  };
  const selectedAffordanceCuePolicy = {
    contract: "goldrush-selected-affordance-cue-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: ["n:gameplay:interaction-hold", "n:goldrush:mine-hold-action"],
    cueRole: "selected-in-world-claim-cue",
    hiddenDefault: true,
  };
  const proximityReadabilityPolicy = {
    contract: "goldrush-object-proximity-readability-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: ["n:gameplay:interaction-hold", "n:control:character-movement"],
    clearanceRadius: 1.15,
    focusRadius: 2.35,
    selectedScale: 1.08,
    candidateScale: 0.38,
    clutterScale: 0.12,
    focusClutterScale: 0.2,
    floorSink: 0.045,
  };
  const resourceVisualFormPolicy = {
    contract: "goldrush-resource-visual-forms-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: "goldrush-procedural-object-protokit",
    purpose: "make mineable resources read as seams, nuggets, ore lodes, and tailings fans instead of black lump clutter",
    requiredForms: ["gold-nugget-cluster", "ore-lode-chip", "gold-seam-lode", "tailings-fan"],
  };
  const visualFidelityPolicy = {
    contract: "goldrush-object-visual-fidelity-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: "goldrush-procedural-object-protokit",
    purpose: "layer material tint, silhouette language, and density role on each procedural object without replacing approved asset promotion",
    requiredReads: ["materialBreakup", "shapeLanguage", "playerRead", "groundContact"],
  };

  descriptor.kits.forEach((kit) => {
    const key = `${kit.geometryRole}:${kit.materialRole}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(kit);
  });

  const dummy = new THREE.Object3D();
  const animated = [];
  const instancedBuckets = [];
  let lastAffordanceSelection = selectNearestGoldRushObjectAffordance({ descriptor, player: { x: 0, z: 0 } });
  let lastMarkerReadability = createMarkerReadabilitySnapshot(markerReadabilityPolicy, lastAffordanceSelection, interactionGroup);
  let lastSelectedAffordanceCue = createSelectedAffordanceCueSnapshot(selectedAffordanceCuePolicy, lastAffordanceSelection, null);
  let lastProximityReadability = createObjectProximityReadabilitySnapshot(proximityReadabilityPolicy, lastAffordanceSelection, null, []);
  const resourceVisualForms = createResourceVisualFormSnapshot(resourceVisualFormPolicy, descriptor);
  const visualFidelity = createObjectVisualFidelitySnapshot(visualFidelityPolicy, descriptor);
  for (const [key, kits] of buckets.entries()) {
    const [geometryRole, materialRole] = key.split(":");
    const mesh = new THREE.InstancedMesh(
      createMicroKitGeometry(geometryRole),
      createMicroKitMaterial(materialRole),
      kits.length
    );
    mesh.name = `${descriptor.id}.${key}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    kits.forEach((kit, index) => {
      dummy.position.set(kit.position.x, kit.position.y, kit.position.z);
      dummy.rotation.set(0, kit.rotation, kit.geometryRole === "grass-blade" ? 0.08 : 0);
      const scale = scaleForMicroKit(kit);
      dummy.scale.set(scale.x, scale.y, scale.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, new THREE.Color(kit.color));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.userData.kits = kits;
    mesh.userData.geometryRole = geometryRole;
    if (["grass-blade", "scrub", "dust-ridge"].includes(geometryRole)) animated.push(mesh);
    instancedBuckets.push({ mesh, kits, geometryRole });
    group.add(mesh);
  }

  const interactiveKits = descriptor.kits
    .filter((kit) => kit.interaction?.enabled)
    .filter((kit) => ["hero-resource", "combat-readable", "world-readable", "navigation-readable"].includes(kit.interaction.priority));
  interactiveKits.forEach((kit) => {
    const marker = createMicroInteractionMarker(kit);
    interactionGroup.add(marker);
  });
  group.add(interactionGroup);
  scene.add(group);

  return {
    update(state, elapsedSeconds = 0) {
      lastAffordanceSelection = selectNearestGoldRushObjectAffordance({
        descriptor,
        player: state.localPlayer?.position ?? null,
      });
      animated.forEach((mesh, bucketIndex) => {
        mesh.rotation.y = Math.sin(elapsedSeconds * 0.08 + bucketIndex) * 0.008;
      });
      lastProximityReadability = updateMicroObjectVisualDensity(instancedBuckets, lastAffordanceSelection, state, proximityReadabilityPolicy, dummy);
      interactionGroup.children.forEach((marker, index) => {
        updateMicroInteractionMarker(marker, lastAffordanceSelection, markerReadabilityPolicy, selectedAffordanceCuePolicy, state, elapsedSeconds, index);
      });
      lastMarkerReadability = createMarkerReadabilitySnapshot(markerReadabilityPolicy, lastAffordanceSelection, interactionGroup);
      lastSelectedAffordanceCue = createSelectedAffordanceCueSnapshot(selectedAffordanceCuePolicy, lastAffordanceSelection, state);
    },
    snapshot() {
      const interactionActions = {};
      interactiveKits.forEach((kit) => {
        interactionActions[kit.interaction.action] = (interactionActions[kit.interaction.action] ?? 0) + 1;
      });
      return {
        id: descriptor.id,
        contract: "goldrush-layered-procedural-object-protokits-v1",
        count: descriptor.count,
        familyCount: descriptor.families.length,
        raycastPlacement: descriptor.kits.every((kit) => kit.placement?.raycast?.mode === "downward-triangle-raycast"),
        generationLayered: descriptor.kits.every((kit) => kit.generationLayers?.length >= 5),
        everyItemProtoKit: descriptor.kits.every((kit) => kit.protoKit?.kind === "goldrush-procedural-object-protokit"),
        interactionMarkerCount: interactionGroup.children.length,
        interactionActions,
        nearestAffordance: structuredClone(lastAffordanceSelection),
        markerReadability: structuredClone(lastMarkerReadability),
        selectedAffordanceCue: structuredClone(lastSelectedAffordanceCue),
        proximityReadability: structuredClone(lastProximityReadability),
        resourceVisualForms: structuredClone(resourceVisualForms),
        visualFidelity: structuredClone(visualFidelity),
      };
    },
  };
}

function createObjectVisualFidelitySnapshot(policy, descriptor) {
  const fidelityKits = descriptor.kits.filter((kit) => kit.visual?.fidelity?.contract === policy.contract);
  const materialBreakup = {};
  const shapeLanguage = {};
  const densityRoles = {};
  fidelityKits.forEach((kit) => {
    materialBreakup[kit.visual.fidelity.materialBreakup] = (materialBreakup[kit.visual.fidelity.materialBreakup] ?? 0) + 1;
    shapeLanguage[kit.visual.fidelity.shapeLanguage] = (shapeLanguage[kit.visual.fidelity.shapeLanguage] ?? 0) + 1;
    densityRoles[kit.visual.fidelity.densityRole] = (densityRoles[kit.visual.fidelity.densityRole] ?? 0) + 1;
  });
  const tintCount = new Set(fidelityKits.map((kit) => kit.visual.tintColor)).size;
  return {
    ...policy,
    fidelityKitCount: fidelityKits.length,
    materialBreakup,
    shapeLanguage,
    densityRoles,
    tintCount,
    allGroundContactRaycastLocked: fidelityKits.every((kit) => kit.visual.fidelity.groundContact === "raycast-locked"),
    allRequiredReadsPresent: fidelityKits.every((kit) => policy.requiredReads.every((field) => kit.visual.fidelity[field])),
  };
}

function createResourceVisualFormSnapshot(policy, descriptor) {
  const resourceKits = descriptor.kits.filter((kit) => kit.role === "reward-readability");
  const forms = {};
  resourceKits.forEach((kit) => {
    const form = resourceVisualFormForKit(kit);
    forms[form] = (forms[form] ?? 0) + 1;
  });
  return {
    ...policy,
    resourceKitCount: resourceKits.length,
    forms,
    formCount: Object.keys(forms).length,
    goldReadableCount: (forms["gold-nugget-cluster"] ?? 0) + (forms["gold-seam-lode"] ?? 0),
    oreReadableCount: (forms["ore-lode-chip"] ?? 0) + (forms["tailings-fan"] ?? 0),
    allRequiredFormsPresent: policy.requiredForms.every((form) => forms[form] > 0),
  };
}

function resourceVisualFormForKit(kit) {
  if (kit.visual?.resourceForm) return kit.visual.resourceForm;
  if (kit.geometryRole === "gold-fleck") return "gold-nugget-cluster";
  if (kit.geometryRole === "ore-chip") return "ore-lode-chip";
  if (kit.geometryRole === "gold-seam") return "gold-seam-lode";
  if (kit.geometryRole === "tailings-pile") return "tailings-fan";
  return "resource-dressing";
}

function updateMicroObjectVisualDensity(instancedBuckets, selection, state, policy, dummy) {
  const selectedKitId = selection?.selected?.kitId ?? null;
  const candidateIds = new Set((selection?.candidates ?? []).map((candidate) => candidate.kitId));
  const playerPosition = state?.localPlayer?.position ?? null;
  const summary = {
    ...policy,
    selectedKitId,
    playerClearanceActive: Boolean(playerPosition && selectedKitId),
    selectedProtected: 0,
    candidateCompressed: 0,
    clutterCompressed: 0,
    unaffected: 0,
    compressedFamilies: {},
    maxCompressedDistance: 0,
  };

  instancedBuckets.forEach(({ mesh, kits }) => {
    kits.forEach((kit, index) => {
      const result = resolveMicroObjectVisualDensity(kit, selection, playerPosition, policy, candidateIds);
      if (result.role === "selected-protected") summary.selectedProtected += 1;
      else if (result.role === "candidate-compressed") summary.candidateCompressed += 1;
      else if (result.role === "clutter-compressed") summary.clutterCompressed += 1;
      else summary.unaffected += 1;
      if (result.role !== "unaffected" && result.role !== "selected-protected") {
        summary.compressedFamilies[kit.family] = (summary.compressedFamilies[kit.family] ?? 0) + 1;
        summary.maxCompressedDistance = Math.max(summary.maxCompressedDistance, result.distance);
      }
      dummy.position.set(kit.position.x, kit.position.y + result.yOffset, kit.position.z);
      dummy.rotation.set(0, kit.rotation, kit.geometryRole === "grass-blade" ? 0.08 : 0);
      const scale = scaleForMicroKit(kit);
      dummy.scale.set(scale.x * result.scale, scale.y * result.scale, scale.z * result.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  summary.compressedCount = summary.candidateCompressed + summary.clutterCompressed;
  summary.maxCompressedDistance = Number(summary.maxCompressedDistance.toFixed(3));
  summary.compressedFamilies = Object.fromEntries(Object.entries(summary.compressedFamilies).sort(([a], [b]) => a.localeCompare(b)));
  return summary;
}

function resolveMicroObjectVisualDensity(kit, selection, playerPosition, policy, candidateIds) {
  if (!playerPosition || !selection?.selected) return { role: "unaffected", scale: 1, yOffset: 0, distance: Infinity };
  const selectedKitId = selection.selected.kitId;
  const distance = distance2D(playerPosition, kit.position);
  if (kit.id === selectedKitId) {
    return { role: "selected-protected", scale: policy.selectedScale, yOffset: 0.018, distance };
  }
  const sameTarget = kit.interaction?.target?.siteId && kit.interaction.target.siteId === selection.selected.target?.siteId;
  const sameAction = kit.interaction?.action && kit.interaction.action === selection.selected.action;
  const isReadableClutter = kit.role === "reward-readability" || kit.role === "terrain-dressing" || kit.role === "navigation";
  if (candidateIds.has(kit.id) && distance <= policy.focusRadius) {
    return { role: "candidate-compressed", scale: policy.candidateScale, yOffset: -policy.floorSink * 0.5, distance };
  }
  if (distance <= policy.clearanceRadius && (sameTarget || sameAction || isReadableClutter)) {
    return { role: "clutter-compressed", scale: policy.clutterScale, yOffset: -policy.floorSink, distance };
  }
  if (distance <= policy.focusRadius && isReadableClutter && selection.selected.action === "mine-gold") {
    return { role: "clutter-compressed", scale: policy.focusClutterScale, yOffset: -policy.floorSink, distance };
  }
  return { role: "unaffected", scale: 1, yOffset: 0, distance };
}

function createObjectProximityReadabilitySnapshot(policy, selection, state, instancedBuckets) {
  return updateMicroObjectVisualDensity(instancedBuckets, selection, state, policy, new THREE.Object3D());
}

function createMicroInteractionMarker(kit) {
  const color = interactionColor(kit.interaction.action);
  const root = new THREE.Group();
  root.name = `${kit.id}.interaction`;
  root.position.set(kit.position.x, kit.position.y, kit.position.z);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const radius = Math.max(0.48, Math.min(1.55, kit.interaction.radius * 0.34));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 5, 28), ringMaterial);
  ring.name = "affordance-ring";
  ring.position.set(0, 0.075, 0);
  ring.rotation.x = Math.PI / 2;
  const cueRoot = new THREE.Group();
  cueRoot.name = "selected-affordance-cue";
  cueRoot.visible = false;
  const cueMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });
  const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.15, 6), cueMaterial);
  stake.name = "claim-stake";
  stake.position.set(radius * 0.74, 0.62, radius * 0.16);
  const progressMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd87a,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const progressRing = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.42, 0.028, 5, 18), progressMaterial);
  progressRing.name = "hold-progress-ring";
  progressRing.position.set(0, 0.16, 0);
  progressRing.rotation.x = Math.PI / 2;
  cueRoot.add(stake, progressRing);
  root.add(ring, cueRoot);
  root.userData = {
    kitId: kit.id,
    contract: kit.interaction.contract,
    readabilityContract: "goldrush-affordance-marker-readability-v1",
    selectedCueContract: "goldrush-selected-affordance-cue-v1",
    protoKitId: kit.protoKit.id,
    action: kit.interaction.action,
    prompt: kit.interaction.prompt,
    placement: kit.placement.raycast,
    markerRole: "hidden",
  };
  return root;
}

function updateMicroInteractionMarker(marker, selection, policy, cuePolicy, state, elapsedSeconds = 0, index = 0) {
  const selectedKitId = selection?.selected?.kitId ?? null;
  const nearbyCandidateIds = new Set(
    (selection?.candidates ?? [])
      .filter((candidate) => candidate.inRange && candidate.kitId !== selectedKitId)
      .slice(0, policy.maxNearbyVisible)
      .map((candidate) => candidate.kitId)
  );
  const isSelected = marker.userData.kitId === selectedKitId;
  const isNearbyCandidate = nearbyCandidateIds.has(marker.userData.kitId);
  const role = isSelected ? "selected" : isNearbyCandidate ? "nearby-candidate" : "hidden";
  marker.visible = role !== "hidden";
  marker.userData.markerRole = role;
  marker.userData.selectionContract = selection?.contract ?? null;
  marker.userData.selectionReason = selection?.reason ?? null;
  marker.userData.selectedKitId = selectedKitId;
  marker.userData.maxNearbyVisible = policy.maxNearbyVisible;
  marker.userData.hiddenByDefault = policy.hiddenDefault;
  const cue = createSelectedAffordanceCueSnapshot(cuePolicy, selection, state);
  marker.userData.selectedAffordanceCue = isSelected ? cue : null;
  const baseScale = isSelected ? 1.18 : 0.72;
  const pulse = isSelected
    ? baseScale + Math.sin(elapsedSeconds * 2.8 + index * 0.17) * 0.08
    : baseScale + Math.sin(elapsedSeconds * 1.2 + index * 0.13) * 0.025;
  marker.scale.setScalar(pulse);
  const opacity = isSelected ? 0.74 : 0.16;
  const ring = marker.getObjectByName("affordance-ring");
  if (ring?.material) {
    ring.material.opacity = opacity;
    ring.material.depthWrite = false;
    ring.material.color.set(isSelected ? interactionColor(marker.userData.action) : mutedInteractionColor(marker.userData.action));
  }
  const cueRoot = marker.getObjectByName("selected-affordance-cue");
  if (cueRoot) {
    cueRoot.visible = isSelected && cue.visible;
    cueRoot.rotation.y = Math.sin(elapsedSeconds * 1.6) * 0.08;
  }
  const progressRing = marker.getObjectByName("hold-progress-ring");
  if (progressRing) {
    const progressScale = Math.max(0.18, cue.progress);
    progressRing.scale.set(progressScale, progressScale, progressScale);
    progressRing.material.opacity = isSelected ? 0.5 + cue.progress * 0.42 : 0;
  }
  const stake = marker.getObjectByName("claim-stake");
  if (stake?.material) {
    stake.material.color.set(interactionColor(marker.userData.action));
    stake.material.opacity = isSelected ? 0.58 + Math.sin(elapsedSeconds * 3) * 0.08 : 0;
  }
}

function createSelectedAffordanceCueSnapshot(policy, selection, state) {
  const selected = selection?.selected ?? null;
  const miningReadability = state?.extractionLoop?.mining?.readability ?? null;
  const activeMiningSite = miningReadability?.activeSite ?? null;
  const miningSites = miningReadability?.sites ?? {};
  const siteId = selected?.target?.siteId ?? null;
  const selectedMiningSite = siteId ? miningSites[siteId] ?? null : null;
  const isSelected = Boolean(selected);
  const miningProgress = selected?.action === "mine-gold"
    ? activeMiningSite?.siteId === siteId
      ? activeMiningSite.progressRatio ?? 0
      : selectedMiningSite?.progressRatio ?? 0
    : 0;
  const carriedGold = Number(state?.extractionLoop?.player?.cargo?.goldDust ?? state?.extractionLoop?.player?.cargo?.totalValue ?? 0);
  const completedMineCue = selected?.action === "mine-gold" && carriedGold > 0 && miningProgress <= 0;
  const progress = clamp01(completedMineCue ? 1 : miningProgress);
  return {
    ...policy,
    selectedKitId: selected?.kitId ?? null,
    protoKitId: selected?.protoKitId ?? null,
    action: selected?.action ?? null,
    prompt: selected?.prompt ?? null,
    target: selected?.target ? structuredClone(selected.target) : null,
    visible: isSelected,
    progress,
    progressSource: selected?.action === "mine-gold" ? "n:goldrush:mine-hold-action" : "n:gameplay:interaction-hold",
    status: completedMineCue ? "complete" : progress > 0 ? "holding" : isSelected ? "ready" : "hidden",
  };
}

function createMarkerReadabilitySnapshot(policy, selection, interactionGroup) {
  const roles = { selected: 0, nearbyCandidate: 0, hidden: 0 };
  interactionGroup.children.forEach((marker) => {
    if (marker.userData.markerRole === "selected") roles.selected += 1;
    else if (marker.userData.markerRole === "nearby-candidate") roles.nearbyCandidate += 1;
    else roles.hidden += 1;
  });
  return {
    ...policy,
    selectedKitId: selection?.selected?.kitId ?? null,
    candidateCount: selection?.candidateCount ?? 0,
    visibleMarkerCount: roles.selected + roles.nearbyCandidate,
    hiddenMarkerCount: roles.hidden,
    roles,
    clutterPolicy: "show-selected-plus-nearby-hide-rest",
  };
}

function interactionColor(action) {
  if (action === "mine-gold") return 0xf2bd45;
  if (action === "take-cover") return 0xc7643f;
  if (action === "inspect-mine") return 0xd79f58;
  if (action === "inspect-town") return 0x8dcfbd;
  return 0xffffff;
}

function mutedInteractionColor(action) {
  if (action === "mine-gold") return 0xd6b56b;
  if (action === "take-cover") return 0xa66b55;
  if (action === "inspect-mine") return 0xb7895a;
  if (action === "inspect-town") return 0x7da99e;
  return 0x9c9c9c;
}

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function distance2D(a, b) {
  return Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.z ?? 0) - (b?.z ?? 0));
}

function mountEnvironmentSpaceKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const spaceColors = {
    "space.wash-floor-trail": 0xb9874c,
    "space.mine-shelf": 0x6e4c36,
    "space.town-shelf": 0x8f7347,
    "space.gold-seam": 0xc99a36,
    "space.extraction-sightline": 0xbda067,
  };
  descriptor.spaces
    .filter((space) => spaceColors[space.id])
    .forEach((space) => {
      const material = new THREE.MeshBasicMaterial({
        color: spaceColors[space.id],
        transparent: true,
        opacity: space.id === "space.gold-seam" ? 0.14 : 0.08,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(space.bounds.width, space.bounds.depth, 1, 1), material);
      mesh.name = `${descriptor.id}.${space.id}`;
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(space.bounds.x + space.bounds.width / 2, 0.065, space.bounds.z + space.bounds.depth / 2);
      mesh.userData.spaceId = space.id;
      group.add(mesh);
    });
  const formMaterials = createEnvironmentFormMaterials();
  descriptor.physicalForms.forEach((form) => {
    const material = formMaterials[form.materialKey] ?? formMaterials["warm-sand-cut"];
    const formMesh = createEnvironmentPhysicalForm(form, material);
    formMesh.name = `${descriptor.id}.${form.id}`;
    formMesh.userData.spaceId = form.spaceId;
    group.add(formMesh);
  });
  scene.add(group);
  return group;
}

function createEnvironmentFormMaterials() {
  return {
    "warm-sand-cut": new THREE.MeshStandardMaterial({ color: 0xa77b3e, roughness: 0.96, flatShading: true, emissive: 0x241508, emissiveIntensity: 0.05 }),
    "packed-ore-shelf": new THREE.MeshStandardMaterial({ color: 0x71533a, roughness: 0.98, flatShading: true, emissive: 0x1a100a, emissiveIntensity: 0.05 }),
    "dust-street": new THREE.MeshStandardMaterial({ color: 0xb58a50, roughness: 0.94, flatShading: true, emissive: 0x261704, emissiveIntensity: 0.04 }),
    "red-rock-gold-face": new THREE.MeshStandardMaterial({ color: 0xa9512f, roughness: 0.9, flatShading: true, emissive: 0x3b2103, emissiveIntensity: 0.1 }),
    "red-rock-terrace": new THREE.MeshStandardMaterial({ color: 0x8b4026, roughness: 0.98, flatShading: true, emissive: 0x180905, emissiveIntensity: 0.06 }),
    "pale-route-vista": new THREE.MeshStandardMaterial({ color: 0xc3a267, roughness: 0.95, flatShading: true, emissive: 0x201608, emissiveIntensity: 0.04 }),
  };
}

function createEnvironmentPhysicalForm(form, material) {
  const { x, z, width, depth, height, yaw = 0 } = form.transform;
  const root = new THREE.Group();
  root.position.set(x, terrainFieldHeight(x, z) + height * 0.5, z);
  root.rotation.y = yaw;

  if (form.kind === "trail-cut-bank-pair") {
    const left = new THREE.Mesh(createSpaceBankGeometry(width, height, 0.72), material);
    const right = new THREE.Mesh(createSpaceBankGeometry(width, height, 0.72), material);
    left.position.set(0, 0, -depth * 0.5);
    right.position.set(0, 0, depth * 0.5);
    right.rotation.y = Math.PI;
    root.add(left, right);
    return root;
  }

  if (form.kind === "vertical-resource-face") {
    const face = new THREE.Mesh(createSpaceWallFaceGeometry(width, height, depth), material);
    face.position.y = height * 0.32;
    root.add(face);
    const seam = new THREE.Mesh(createGoldSeamGeometry(), createMicroKitMaterial("gold"));
    seam.position.set(0, height * 0.82, -depth * 0.56);
    seam.scale.set(width * 0.75, 1.4, 1.2);
    root.add(seam);
    return root;
  }

  if (form.kind === "stepped-ridge-terrace") {
    [0.18, 0.46, 0.78].forEach((step, index) => {
      const ledge = new THREE.Mesh(
        createSpaceWallFaceGeometry(width * (1 - index * 0.12), height * (0.9 - index * 0.12), depth * (0.36 + index * 0.08)),
        material
      );
      ledge.position.set((index - 1) * 0.42, height * step, (index - 1) * depth * 0.18);
      ledge.rotation.y = (index - 1) * 0.07;
      root.add(ledge);
    });
    return root;
  }

  const slab = new THREE.Mesh(createSpaceSlabGeometry(width, depth, height), material);
  root.add(slab);
  if (form.kind === "raised-work-shelf") {
    const backCut = new THREE.Mesh(createSpaceWallFaceGeometry(width * 0.84, height * 1.45, 0.42), createMicroKitMaterial("red-rock-dark"));
    backCut.position.set(-0.6, height * 0.58, depth * 0.48);
    root.add(backCut);
  }
  if (form.kind === "settlement-street-shelf") {
    const street = new THREE.Mesh(createSpaceSlabGeometry(width * 0.88, depth * 0.22, height * 0.24), createMicroKitMaterial("sand"));
    street.position.set(0, height * 0.22, -depth * 0.14);
    root.add(street);
  }
  return root;
}

function mountRouteKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  group.add(createTrailRibbon(descriptor.routePoints, 0xb9864d, 0.34, 1.45));
  group.add(createRouteLine(descriptor.routePoints, 0xf5b544, 0.78, 0.09));
  group.add(createRouteLine(descriptor.combatRidge, 0x74d0c2, 0.62, 0.075));
  scene.add(group);
  return group;
}

function mountGoldNodeKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const material = new THREE.MeshStandardMaterial({ color: 0xf5c85a, emissive: 0x614000, roughness: 0.55 });
  descriptor.nodes.forEach((node) => {
    const mesh = new THREE.Mesh(createCrystalGeometry(node.height), material);
    mesh.position.set(node.x, node.height * 0.9, node.z);
    mesh.rotation.y = node.x * 0.2;
    mesh.userData.nodeId = node.id;
    group.add(mesh);
  });
  scene.add(group);
  return group;
}

function mountWorldElementKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = "goldrush.procWorld.elements";
  const scale = descriptor.scale.visualScale;

  const mountainMaterial = new THREE.MeshStandardMaterial({ color: 0x9a5b38, roughness: 0.98, flatShading: true, emissive: 0x160905, emissiveIntensity: 0.025 });
  descriptor.mountainRanges.forEach((mountain) => {
    const visual = resolveMountainRangeVisual(mountain, descriptor, scale);
    const mesh = new THREE.Mesh(createRidgeGeometry(visual, scale), mountainMaterial);
    mesh.position.set(visual.position.x, visual.position.y, visual.position.z);
    mesh.userData.elementId = mountain.id;
    mesh.userData.visualRole = visual.visualRole;
    group.add(mesh);
  });

  const townMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xb88a52, roughness: 0.88, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x826b4a, roughness: 0.92, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x6b4d35, roughness: 0.9, flatShading: true }),
  ];
  descriptor.towns.forEach((town, townIndex) => {
    town.buildings.forEach((building, buildingIndex) => {
      const mesh = new THREE.Mesh(
        createBuildingGeometry({
          width: 0.34 + (buildingIndex % 3) * 0.08,
          depth: 0.22 + (buildingIndex % 2) * 0.08,
          height: 0.38 + (buildingIndex % 4) * 0.09,
        }),
        townMaterials[(townIndex + buildingIndex) % townMaterials.length]
      );
      const column = buildingIndex % 3;
      const row = Math.floor(buildingIndex / 3);
      mesh.position.set(
        town.position.x * scale + (column - 1) * 0.54,
        0.34,
        town.position.z * scale + (row - 0.5) * 0.42
      );
      mesh.rotation.y = townIndex * 0.18;
      mesh.userData.elementId = `${town.id}.${building}`;
      group.add(mesh);
    });
  });

  const landmarkMaterial = new THREE.MeshStandardMaterial({ color: 0xc9a46b, roughness: 0.82, flatShading: true });
  descriptor.landmarks.forEach((landmark) => {
    const mesh = new THREE.Mesh(createTowerGeometry(landmark.height * scale), landmarkMaterial);
    mesh.position.set(landmark.position.x * scale, 0.4, landmark.position.z * scale);
    mesh.userData.elementId = landmark.id;
    group.add(mesh);
  });

  const zoneMaterial = new THREE.MeshBasicMaterial({ color: 0xf5c85a, transparent: true, opacity: 0.36 });
  descriptor.goldZones.forEach((zone) => {
    const mesh = new THREE.Mesh(createZoneGeometry(Math.max(0.7, zone.radius * scale), 18), zoneMaterial.clone());
    mesh.position.set(zone.position.x * scale, 0.08, zone.position.z * scale);
    mesh.userData.elementId = zone.id;
    group.add(mesh);
  });

  const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xd6b061, transparent: true, opacity: 0.54 });
  descriptor.paths.forEach((path) => {
    group.add(createWorldPathLine(path.points.map((point) => ({ x: point.x * scale, z: point.z * scale })), pathMaterial));
  });

  scene.add(group);

  return {
    update(state = { world: descriptor }) {
      const world = state.world ?? descriptor;
      const activeIds = new Set(world.activeRoomWindows?.flatMap((window) => [
        ...window.landmarkIds,
        ...window.goldZoneIds,
      ]) ?? []);
      group.children.forEach((child) => {
        const id = child.userData.elementId ?? "";
        if (id.startsWith("gold.zone.")) {
          const pressure = state.finalRush?.zonePressure?.[id];
          if (pressure) {
            child.material.opacity = pressure.status === "locked" ? 0.12 : pressure.status === "danger" ? 0.62 : 0.36;
            child.material.color.set(pressure.status === "locked" ? 0x6c2f2a : pressure.status === "danger" ? 0xe36b38 : 0xf5c85a);
          }
        }
        child.visible = activeIds.size === 0
          || activeIds.has(id)
          || id.startsWith("town.")
          || id.startsWith("mountain.")
          || id.startsWith("path.");
      });
    },
  };
}

function mountNetworkPresenceKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const markerGeometry = createMarkerGeometry();
  const markers = Array.from({ length: descriptor.maxVisibleMarkers }, (_, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: index < descriptor.maxVisibleMarkers / 2 ? descriptor.lanes[0].color : descriptor.lanes[1].color,
      emissive: index < descriptor.maxVisibleMarkers / 2 ? 0x3b2200 : 0x073533,
      roughness: 0.62,
      transparent: true,
      opacity: 0.38,
    });
    const mesh = new THREE.Mesh(markerGeometry, material);
    mesh.visible = false;
    group.add(mesh);
    return mesh;
  });
  scene.add(group);

  return {
    update(state) {
      const activePlayers = Math.min(descriptor.maxVisibleMarkers, state.players);
      markers.forEach((marker, index) => {
        marker.visible = index < activePlayers;
        const lane = index < descriptor.maxVisibleMarkers / 2 ? descriptor.lanes[0] : descriptor.lanes[1];
        const laneIndex = index < descriptor.maxVisibleMarkers / 2 ? index : index - descriptor.maxVisibleMarkers / 2;
        const column = laneIndex % 3;
        const row = Math.floor(laneIndex / 3);
        marker.position.set(lane.x + column * descriptor.spacing, 0.46, lane.z + row * descriptor.spacing);
        marker.rotation.y = state.cameraMode === "combat" ? 0.7 : 0.15;
        marker.scale.setScalar(state.cameraMode === "combat" && index < 8 ? 1.55 : 1);
      });
    },
  };
}

function mountExtractionLoopMarkerKit(scene) {
  const group = new THREE.Group();
  group.name = "goldrush.procGameplay.extractionLoopMarkers";
  const ringGeometry = new THREE.TorusGeometry(1, 0.025, 6, 32);
  const beaconGeometry = createPrismGeometry(0.1, 1.2, 6);
  const promptGeometry = createCuboidGeometry(0.66, 0.06, 0.1);
  const markerMeshes = new Map();
  const laneMeshes = new Map();
  const coverMeshes = new Map();
  group.userData.visualContract = "readable-threat-lanes-v1";
  group.userData.coverContract = "readable-threat-cover-v1";
  group.userData.extractionCueContract = "goldrush-extraction-cashout-cue-v1";
  group.userData.extractionSetpieceContract = "goldrush-extraction-setpiece-v1";
  scene.add(group);

  function createMarker(marker) {
    const root = new THREE.Group();
    root.name = marker.id;
    const material = markerMaterial(marker);
    const ring = new THREE.Mesh(ringGeometry, material);
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(Math.max(0.55, marker.radius * 0.18));
    ring.name = `${marker.id}.range`;
    const beacon = new THREE.Mesh(beaconGeometry, material.clone());
    beacon.position.y = 0.76;
    beacon.name = `${marker.id}.beacon`;
    const prompt = new THREE.Mesh(promptGeometry, material.clone());
    prompt.position.y = 1.48;
    prompt.name = `${marker.id}.prompt`;
    root.add(ring, beacon, prompt);
    if (marker.type === "extraction-site") {
      const platform = new THREE.Mesh(createCuboidGeometry(1.55, 0.08, 0.78), material.clone());
      platform.position.set(0, 0.08, -0.22);
      platform.name = `${marker.id}.cashout-platform`;
      assignExtractionSetpieceStyle(platform, 0x8b5a33, 0x1e1207);
      const archLeft = new THREE.Mesh(createCuboidGeometry(0.08, 1.42, 0.08), material.clone());
      archLeft.position.set(-0.48, 0.75, -0.42);
      archLeft.name = `${marker.id}.cashout-arch-left`;
      assignExtractionSetpieceStyle(archLeft, 0x6d4328, 0x180c04);
      const archRight = new THREE.Mesh(createCuboidGeometry(0.08, 1.42, 0.08), material.clone());
      archRight.position.set(0.48, 0.75, -0.42);
      archRight.name = `${marker.id}.cashout-arch-right`;
      assignExtractionSetpieceStyle(archRight, 0x6d4328, 0x180c04);
      const crossbeam = new THREE.Mesh(createCuboidGeometry(1.12, 0.08, 0.1), material.clone());
      crossbeam.position.set(0, 1.48, -0.42);
      crossbeam.name = `${marker.id}.cashout-crossbeam`;
      assignExtractionSetpieceStyle(crossbeam, 0x6d4328, 0x180c04);
      const railLeft = new THREE.Mesh(createCuboidGeometry(1.7, 0.04, 0.04), material.clone());
      railLeft.position.set(0, 0.14, -0.72);
      railLeft.name = `${marker.id}.cashout-rail-left`;
      assignExtractionSetpieceStyle(railLeft, 0x2c2118, 0x090705);
      const railRight = new THREE.Mesh(createCuboidGeometry(1.7, 0.04, 0.04), material.clone());
      railRight.position.set(0, 0.14, 0.26);
      railRight.name = `${marker.id}.cashout-rail-right`;
      assignExtractionSetpieceStyle(railRight, 0x2c2118, 0x090705);
      const tieA = new THREE.Mesh(createCuboidGeometry(0.08, 0.035, 1.1), material.clone());
      tieA.position.set(-0.46, 0.12, -0.24);
      tieA.name = `${marker.id}.cashout-rail-tie-a`;
      assignExtractionSetpieceStyle(tieA, 0x4a2f1c, 0x0c0703);
      const tieB = new THREE.Mesh(createCuboidGeometry(0.08, 0.035, 1.1), material.clone());
      tieB.position.set(0.46, 0.12, -0.24);
      tieB.name = `${marker.id}.cashout-rail-tie-b`;
      assignExtractionSetpieceStyle(tieB, 0x4a2f1c, 0x0c0703);
      const post = new THREE.Mesh(createCuboidGeometry(0.06, 1.35, 0.06), material.clone());
      post.position.set(-0.34, 0.72, 0);
      post.name = `${marker.id}.cashout-post`;
      assignExtractionSetpieceStyle(post, 0x79502d, 0x180c04);
      const flag = new THREE.Mesh(createCuboidGeometry(0.58, 0.24, 0.04), material.clone());
      flag.position.set(0.02, 1.25, 0);
      flag.name = `${marker.id}.cashout-flag`;
      assignExtractionSetpieceStyle(flag, 0xd3a14a, 0x3b2600);
      const bell = new THREE.Mesh(createExtractionBellGeometry(), material.clone());
      bell.position.set(0, 1.31, -0.42);
      bell.name = `${marker.id}.cashout-bell`;
      assignExtractionSetpieceStyle(bell, 0xf0c45a, 0x5a3700);
      const holdProgress = new THREE.Mesh(createCuboidGeometry(0.08, 1, 0.05), material.clone());
      holdProgress.position.set(0.62, 0.62, -0.42);
      holdProgress.name = `${marker.id}.cashout-hold-progress`;
      holdProgress.userData.cashoutInteractionRole = "hold-progress";
      assignExtractionSetpieceStyle(holdProgress, 0xf5c85a, 0x6b4700);
      const holdPrompt = new THREE.Mesh(createCuboidGeometry(0.62, 0.06, 0.08), material.clone());
      holdPrompt.position.set(0.58, 1.12, -0.42);
      holdPrompt.name = `${marker.id}.cashout-hold-prompt`;
      holdPrompt.userData.cashoutInteractionRole = "hold-prompt";
      assignExtractionSetpieceStyle(holdPrompt, 0x74d0c2, 0x164038);
      const smoke = new THREE.Mesh(createExtractionSmokeGeometry(), material.clone());
      smoke.position.set(0.24, 1.78, 0);
      smoke.name = `${marker.id}.cashout-smoke`;
      assignExtractionSetpieceStyle(smoke, 0xd8cfae, 0x2b260e);
      root.add(platform, archLeft, archRight, crossbeam, railLeft, railRight, tieA, tieB, post, flag, bell, holdProgress, holdPrompt, smoke);
    }
    root.userData.markerType = marker.type;
    group.add(root);
    return root;
  }

  function createThreatLane(marker) {
    const geometry = createThreatLaneGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: markerLaneColor(marker),
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${marker.lane.id}.visual`;
    mesh.visible = false;
    mesh.userData.markerId = marker.id;
    mesh.userData.visualContract = "readable-threat-lanes-v1";
    group.add(mesh);
    return mesh;
  }

  function createThreatCover(cover) {
    const geometry = createThreatCoverGeometry(cover);
    const material = new THREE.MeshStandardMaterial({
      color: coverColor(cover),
      emissive: cover.status === "available" ? 0x221706 : 0x080806,
      roughness: 0.86,
      transparent: true,
      opacity: 0.84,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${cover.id}.visual`;
    mesh.visible = false;
    mesh.userData.coverContract = "readable-threat-cover-v1";
    group.add(mesh);
    return mesh;
  }

  return {
    update(state, elapsedSeconds = 0) {
      const markers = state.extractionLoop?.worldSpaceMarkers ?? [];
      const activeIds = new Set(markers.map((marker) => marker.id));
      const activeLaneIds = new Set();
      const activeCoverIds = new Set();
      const engagedCoverIds = new Set();
      const extractionMarkers = markers.filter((marker) => marker.type === "extraction-site");
      for (const marker of markers) {
        const mesh = markerMeshes.get(marker.id) ?? createMarker(marker);
        markerMeshes.set(marker.id, mesh);
        const y = terrainFieldHeight(marker.worldPosition.x, marker.worldPosition.z);
        mesh.position.set(marker.worldPosition.x, y + 0.08, marker.worldPosition.z);
        mesh.visible = marker.status !== "latent" || marker.inRange || marker.active;
        mesh.rotation.y = elapsedSeconds * (marker.active ? 1.4 : 0.35);
        const pulse = 1 + Math.sin(elapsedSeconds * 4 + marker.worldPosition.x) * 0.04;
        const progress = Math.max(0, Math.min(1, marker.progress ?? 0));
        const telegraphPulse = marker.telegraph?.readableBeforeDamage
          ? 0.12 + Math.max(0, Math.sin(elapsedSeconds * 9)) * 0.14
          : 0;
        mesh.scale.setScalar(pulse + progress * 0.35 + telegraphPulse);
        mesh.children.forEach((child) => {
          child.material.opacity = marker.status === "complete" ? 0.32 : marker.inRange || marker.active ? 0.92 : 0.48;
          child.material.color.set(child.userData.extractionSetpieceColor ?? markerColor(marker));
          if (child.material.emissive) {
            child.material.emissive.set(child.userData.extractionSetpieceEmissive ?? (marker.active || marker.inRange ? markerEmissive(marker) : 0x181008));
          }
        });
        if (marker.type === "extraction-site") updateExtractionInteractionVisuals(mesh, marker, progress);
        if (marker.type === "threat" && marker.lane?.id) {
          const laneMesh = laneMeshes.get(marker.lane.id) ?? createThreatLane(marker);
          laneMeshes.set(marker.lane.id, laneMesh);
          updateThreatLaneMesh(laneMesh, marker, elapsedSeconds);
          activeLaneIds.add(marker.lane.id);
        }
        if (marker.type === "threat" && Array.isArray(marker.cover)) {
          for (const cover of marker.cover) {
            const coverMesh = coverMeshes.get(cover.id) ?? createThreatCover(cover);
            coverMeshes.set(cover.id, coverMesh);
            updateThreatCoverMesh(coverMesh, cover, marker, elapsedSeconds);
            activeCoverIds.add(cover.id);
            if (cover.id === marker.engagedCoverId || cover.status === "engaged" || cover.status === "peeking") engagedCoverIds.add(cover.id);
          }
        }
      }
      for (const [id, mesh] of markerMeshes) {
        if (!activeIds.has(id)) mesh.visible = false;
      }
      for (const [id, laneMesh] of laneMeshes) {
        if (!activeLaneIds.has(id)) laneMesh.visible = false;
      }
      for (const [id, coverMesh] of coverMeshes) {
        if (!activeCoverIds.has(id)) coverMesh.visible = false;
      }
      group.userData.activeLaneIds = Array.from(activeLaneIds);
      group.userData.activeCoverIds = Array.from(activeCoverIds);
      group.userData.engagedCoverIds = Array.from(engagedCoverIds);
      group.userData.readableThreatCount = markers.filter((marker) => marker.type === "threat" && marker.telegraph?.id).length;
      group.userData.extractionCashoutCue = createExtractionCashoutCueSnapshot(extractionMarkers);
      group.userData.extractionSetpiece = createExtractionSetpieceSnapshot(extractionMarkers, group.userData.extractionCashoutCue);
      group.userData.extractionInteractionCue = createExtractionInteractionCueSnapshot(extractionMarkers, group.userData.extractionCashoutCue);
    },
    snapshot() {
      return {
        markerCount: markerMeshes.size,
        markerIds: Array.from(markerMeshes.keys()),
        laneCount: laneMeshes.size,
        laneIds: Array.from(laneMeshes.keys()),
        coverCount: coverMeshes.size,
        coverIds: Array.from(coverMeshes.keys()),
        engagedCoverIds: group.userData.engagedCoverIds ?? [],
        visualContract: group.userData.visualContract,
        coverContract: group.userData.coverContract,
        extractionCue: group.userData.extractionCashoutCue ?? createExtractionCashoutCueSnapshot([]),
        extractionSetpiece: group.userData.extractionSetpiece ?? createExtractionSetpieceSnapshot([], createExtractionCashoutCueSnapshot([])),
        extractionInteractionCue: group.userData.extractionInteractionCue ?? createExtractionInteractionCueSnapshot([], createExtractionCashoutCueSnapshot([])),
      };
    },
  };
}

function createExtractionCashoutCueSnapshot(markers) {
  const extractionMarkers = markers.filter((marker) => marker.type === "extraction-site");
  const visibleMarkers = extractionMarkers.filter((marker) => marker.status !== "latent");
  const primary = visibleMarkers
    .slice()
    .sort((a, b) => {
      const activeScore = Number(b.active) - Number(a.active);
      const rangeScore = Number(b.inRange) - Number(a.inRange);
      const statusScore = extractionStatusRank(b.status) - extractionStatusRank(a.status);
      return activeScore || rangeScore || statusScore || String(a.id).localeCompare(String(b.id));
    })[0] ?? null;
  return {
    contract: "goldrush-extraction-cashout-cue-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: "n:gameplay:extraction",
    cueRole: "diegetic-cashout-beacon",
    visibleCueCount: visibleMarkers.length,
    readyCount: extractionMarkers.filter((marker) => marker.status === "ready").length,
    contestedCount: extractionMarkers.filter((marker) => marker.status === "contested").length,
    lockdownCount: extractionMarkers.filter((marker) => marker.status === "lockdown").length,
    activeMarkerId: extractionMarkers.find((marker) => marker.active)?.id ?? null,
    primary: primary ? {
      markerId: primary.id,
      label: primary.label,
      status: primary.status,
      inRange: Boolean(primary.inRange),
      active: Boolean(primary.active),
      progress: roundVisualProgress(primary.progress ?? 0),
      contestStatus: primary.contest?.status ?? "quiet",
      interruptRisk: roundVisualProgress(primary.contest?.interruptRisk ?? 0),
      nextAction: primary.active
        ? "hold-cashout"
        : primary.status === "needs-gold"
          ? "mine-gold"
          : "route-to-cashout",
    } : null,
  };
}

function createExtractionSetpieceSnapshot(markers, cashoutCue) {
  const extractionMarkers = markers.filter((marker) => marker.type === "extraction-site" && marker.status !== "latent");
  const primaryMarkerId = cashoutCue?.primary?.markerId ?? extractionMarkers[0]?.id ?? null;
  const primary = extractionMarkers.find((marker) => marker.id === primaryMarkerId) ?? extractionMarkers[0] ?? null;
  return {
    contract: "goldrush-extraction-setpiece-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: ["n:gameplay:extraction", "goldrush-extraction-cashout-cue-v1"],
    setpieceRole: "rail-depot-cashout-landmark",
    visualLanguage: ["vertical-arch-silhouette", "smoke-cue", "rail-alignment", "cashout-bell"],
    visibleSetpieceCount: extractionMarkers.length,
    landmarkCount: extractionMarkers.length,
    railAlignment: "depot-track-facing",
    placementMode: "terrain-raycast-grounded",
    primary: primary ? {
      markerId: primary.id,
      label: primary.label,
      status: primary.status,
      hasVerticalSilhouette: true,
      hasSmokeCue: true,
      hasRailLanguage: true,
      hasCashoutBell: true,
      nextAction: cashoutCue?.primary?.nextAction ?? (primary.active ? "hold-cashout" : "route-to-cashout"),
    } : null,
  };
}

function createExtractionInteractionCueSnapshot(markers, cashoutCue) {
  const extractionMarkers = markers.filter((marker) => marker.type === "extraction-site" && marker.status !== "latent");
  const primaryMarkerId = cashoutCue?.primary?.markerId ?? extractionMarkers[0]?.id ?? null;
  const primary = extractionMarkers.find((marker) => marker.id === primaryMarkerId) ?? extractionMarkers[0] ?? null;
  const progress = roundVisualProgress(primary?.progress ?? cashoutCue?.primary?.progress ?? 0);
  const inRange = Boolean(primary?.inRange ?? cashoutCue?.primary?.inRange);
  const active = Boolean(primary?.active ?? cashoutCue?.primary?.active);
  const status = primary?.status ?? cashoutCue?.primary?.status ?? "hidden";
  return {
    contract: "goldrush-extraction-interaction-cue-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: ["n:gameplay:extraction", "goldrush-extraction-cashout-cue-v1", "goldrush-extraction-setpiece-v1"],
    cueRole: "diegetic-cashout-hold-feedback",
    visibleCueCount: extractionMarkers.length,
    activeMarkerId: primary?.id ?? null,
    primary: primary ? {
      markerId: primary.id,
      label: primary.label,
      status,
      inRange,
      active,
      progress,
      promptVisible: inRange && status !== "complete",
      holdProgressVisible: inRange || active || progress > 0,
      holdState: active ? "holding" : inRange ? "ready-to-hold" : status === "needs-gold" ? "needs-gold" : "route-to-zone",
      nextAction: active ? "keep-holding-cashout" : inRange ? "hold-cashout" : cashoutCue?.primary?.nextAction ?? "route-to-cashout",
      interruptRisk: roundVisualProgress(primary.contest?.interruptRisk ?? cashoutCue?.primary?.interruptRisk ?? 0),
    } : null,
  };
}

function updateExtractionInteractionVisuals(mesh, marker, progress = 0) {
  const normalizedProgress = roundVisualProgress(progress);
  const holdProgress = mesh.children.find((child) => child.userData.cashoutInteractionRole === "hold-progress");
  if (holdProgress) {
    const visibleProgress = marker.active ? Math.max(0.08, normalizedProgress) : marker.inRange ? 0.12 : 0.04;
    holdProgress.scale.set(1, visibleProgress, 1);
    holdProgress.position.y = 0.18 + visibleProgress * 0.48;
    holdProgress.material.opacity = marker.active ? 1 : marker.inRange ? 0.72 : 0.28;
    holdProgress.userData.progress = normalizedProgress;
    holdProgress.userData.visualContract = "goldrush-extraction-interaction-cue-v1";
  }
  const holdPrompt = mesh.children.find((child) => child.userData.cashoutInteractionRole === "hold-prompt");
  if (holdPrompt) {
    holdPrompt.visible = marker.status !== "complete";
    holdPrompt.material.opacity = marker.active ? 1 : marker.inRange ? 0.82 : 0.24;
    holdPrompt.scale.set(marker.active ? 1.18 : marker.inRange ? 1 : 0.72, 1, 1);
    holdPrompt.userData.holdState = marker.active ? "holding" : marker.inRange ? "ready-to-hold" : "route-to-zone";
    holdPrompt.userData.visualContract = "goldrush-extraction-interaction-cue-v1";
  }
}

function assignExtractionSetpieceStyle(mesh, color, emissive = 0x181008) {
  mesh.userData.extractionSetpieceColor = color;
  mesh.userData.extractionSetpieceEmissive = emissive;
  mesh.userData.visualContract = "goldrush-extraction-setpiece-v1";
  mesh.material.color.set(color);
  if (mesh.material.emissive) mesh.material.emissive.set(emissive);
  return mesh;
}

function extractionStatusRank(status) {
  if (status === "lockdown") return 5;
  if (status === "contested") return 4;
  if (status === "ready") return 3;
  if (status === "watched") return 2;
  if (status === "needs-gold") return 1;
  return 0;
}

function roundVisualProgress(value) {
  return Number(Math.max(0, Math.min(1, Number(value) || 0)).toFixed(3));
}

function createThreatLaneGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -0.5, 0, 0,
    0.5, 0, 0,
    -0.5, 0, 1,
    0.5, 0, 0,
    0.5, 0, 1,
    -0.5, 0, 1,
  ]), 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createExtractionSmokeGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -0.16, 0.00, 0,
    0.12, 0.06, 0,
    -0.10, 0.28, 0,
    0.12, 0.06, 0,
    0.24, 0.32, 0,
    -0.10, 0.28, 0,
    -0.08, 0.30, 0,
    0.20, 0.36, 0,
    0.02, 0.58, 0,
  ]), 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createExtractionBellGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -0.12, 0.00, -0.05,
    0.12, 0.00, -0.05,
    0.00, 0.24, 0.00,
    0.12, 0.00, -0.05,
    0.12, 0.00, 0.05,
    0.00, 0.24, 0.00,
    0.12, 0.00, 0.05,
    -0.12, 0.00, 0.05,
    0.00, 0.24, 0.00,
    -0.12, 0.00, 0.05,
    -0.12, 0.00, -0.05,
    0.00, 0.24, 0.00,
    -0.15, -0.04, -0.06,
    0.15, -0.04, -0.06,
    0.15, -0.04, 0.06,
    -0.15, -0.04, -0.06,
    0.15, -0.04, 0.06,
    -0.15, -0.04, 0.06,
  ]), 3));
  geometry.computeVertexNormals();
  return geometry;
}

function updateThreatLaneMesh(mesh, marker, elapsedSeconds = 0) {
  const start = marker.lane?.start ?? marker.worldPosition;
  const end = marker.lane?.end ?? marker.worldPosition;
  const dx = (end.x ?? 0) - (start.x ?? 0);
  const dz = (end.z ?? 0) - (start.z ?? 0);
  const distance = Math.max(0.001, Math.hypot(dx, dz));
  const laneWidth = Math.max(0.7, Number(marker.lane?.width ?? 2.2));
  const angle = Math.atan2(dx, dz);
  const startY = terrainFieldHeight(start.x ?? 0, start.z ?? 0);
  const endY = terrainFieldHeight(end.x ?? 0, end.z ?? 0);
  mesh.position.set(start.x ?? 0, Math.max(startY, endY) + 0.11, start.z ?? 0);
  mesh.rotation.set(0, angle, 0);
  mesh.scale.set(laneWidth, 1, distance);
  mesh.visible = marker.status !== "defeated" && ["warning", "danger"].includes(marker.lane?.status);
  mesh.material.color.set(markerLaneColor(marker));
  mesh.material.opacity = marker.lane?.status === "danger"
    ? 0.26 + Math.max(0, Math.sin(elapsedSeconds * 8)) * 0.18
    : 0.16;
  mesh.userData.threatId = marker.lane?.threatId ?? marker.id;
  mesh.userData.telegraphId = marker.telegraph?.id ?? null;
  mesh.userData.laneStatus = marker.lane?.status ?? "unknown";
}

function createThreatCoverGeometry(cover) {
  if (cover.kind === "ore-cart") return createTroughGeometry(0.7, 0.42, 0.42);
  if (cover.kind === "ridge-shoulder") return createCanyonWallGeometry({ width: 0.95, depth: 0.46, height: 0.82 });
  return createFacetedBoulderGeometry(0.42);
}

function updateThreatCoverMesh(mesh, cover, marker, elapsedSeconds = 0) {
  const position = cover.worldPosition ?? marker.worldPosition;
  const y = terrainFieldHeight(position.x ?? 0, position.z ?? 0);
  const pulse = cover.id === marker.recommendedCoverId
    ? 1 + Math.max(0, Math.sin(elapsedSeconds * 5.5)) * 0.09
    : 1;
  const engaged = cover.id === marker.engagedCoverId || cover.status === "engaged" || cover.status === "peeking";
  mesh.position.set(position.x ?? 0, y + 0.2, position.z ?? 0);
  mesh.rotation.y = cover.peekSide === "left" ? -0.32 : cover.peekSide === "right" ? 0.32 : 0;
  mesh.scale.setScalar(pulse * (engaged ? 1.16 : 1));
  mesh.visible = marker.status !== "defeated" && cover.status !== "cleared" && marker.status !== "latent";
  mesh.material.color.set(coverColor(cover));
  mesh.material.opacity = engaged ? 0.98 : cover.status === "available" ? 0.86 : 0.46;
  if (mesh.material.emissive) mesh.material.emissive.set(engaged ? 0x3c2b0a : cover.status === "available" ? 0x221706 : 0x080806);
  mesh.userData.threatId = cover.threatId;
  mesh.userData.laneId = cover.laneId;
  mesh.userData.peekSide = cover.peekSide;
  mesh.userData.cameraShoulder = cover.cameraShoulder;
  mesh.userData.coverScore = cover.coverScore;
  mesh.userData.blocksLane = cover.blocksLane;
  mesh.userData.recommended = cover.id === marker.recommendedCoverId;
  mesh.userData.engaged = engaged;
}

function coverColor(cover) {
  if (cover.status === "cleared") return 0x63735a;
  if (cover.status === "engaged") return 0xf1c15b;
  if (cover.status === "peeking") return 0xffd27a;
  if (cover.blocksLane) return 0xc88a43;
  return 0x8a6f4a;
}

function markerLaneColor(marker) {
  if (marker.status === "defeated" || marker.lane?.status === "clear") return 0x63735a;
  if (marker.lane?.status === "danger") return 0xf05a32;
  if (marker.lane?.status === "warning") return 0xffb24d;
  return 0x8d5a3a;
}

function markerMaterial(marker) {
  return new THREE.MeshStandardMaterial({
    color: markerColor(marker),
    emissive: markerEmissive(marker),
    roughness: 0.62,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    flatShading: true,
  });
}

function markerColor(marker) {
  if (marker.type === "extraction-site") {
    if (marker.status === "complete") return 0x74d0c2;
    if (marker.status === "lockdown") return 0xf05a32;
    if (marker.status === "contested") return 0xff9a3c;
    return 0xf2d27b;
  }
  if (marker.type === "threat") return marker.status === "defeated" ? 0x63735a : marker.active ? 0xe36b38 : 0x8d5a3a;
  return marker.status === "depleted" ? 0x6d6043 : 0xf5c85a;
}

function markerEmissive(marker) {
  if (marker.type === "extraction-site") {
    if (marker.status === "lockdown") return 0x451000;
    if (marker.status === "contested") return 0x452000;
    return 0x3b2f05;
  }
  if (marker.type === "threat") return marker.active ? 0x3b0805 : 0x1c0e05;
  return 0x4f3300;
}

function mountPlayerActionSurfacePromptKit(scene) {
  const group = new THREE.Group();
  group.name = "goldrush.procGameplay.playerActionSurfacePrompt";
  group.visible = false;
  group.userData.visualContract = "goldrush-player-action-surface-visual-v1";
  group.userData.domainPath = "n:render:micro-object-instancing";
  group.userData.consumes = ["n:goldrush:player-action-surface"];

  const materials = {
    panel: new THREE.MeshBasicMaterial({ color: 0x141916, transparent: true, opacity: 0.72, depthWrite: false }),
    action: new THREE.MeshBasicMaterial({ color: 0xf2bd45, transparent: true, opacity: 0.94, depthWrite: false }),
    progress: new THREE.MeshBasicMaterial({ color: 0x74d0c2, transparent: true, opacity: 0.9, depthWrite: false }),
    risk: new THREE.MeshBasicMaterial({ color: 0xe36b38, transparent: true, opacity: 0.0, depthWrite: false }),
  };

  const panel = new THREE.Mesh(createCuboidGeometry(0.9, 0.08, 0.08), materials.panel);
  panel.name = "action-surface-panel";
  const inputPip = new THREE.Mesh(createPrismGeometry(0.1, 0.055, 8), materials.action);
  inputPip.name = "action-surface-input-pip";
  inputPip.position.set(-0.42, 0.085, 0);
  inputPip.rotation.x = Math.PI / 2;
  const holdTrack = new THREE.Mesh(createCuboidGeometry(0.58, 0.025, 0.04), materials.panel.clone());
  holdTrack.name = "action-surface-hold-track";
  holdTrack.position.set(0.08, 0.09, 0);
  holdTrack.material.opacity = 0.46;
  const holdFill = new THREE.Mesh(createCuboidGeometry(0.58, 0.032, 0.046), materials.progress);
  holdFill.name = "action-surface-hold-fill";
  holdFill.position.set(0.08, 0.122, 0);
  const targetNeedle = new THREE.Mesh(createCuboidGeometry(0.035, 0.32, 0.035), materials.action.clone());
  targetNeedle.name = "action-surface-target-needle";
  targetNeedle.position.set(0.46, 0.24, 0);
  const riskPulse = new THREE.Mesh(createPrismGeometry(0.22, 0.035, 12), materials.risk);
  riskPulse.name = "action-surface-risk-pulse";
  riskPulse.rotation.x = Math.PI / 2;
  riskPulse.position.set(0, 0.04, 0);
  group.add(riskPulse, panel, inputPip, holdTrack, holdFill, targetNeedle);
  scene.add(group);

  let lastSnapshot = createPlayerActionSurfaceVisualSnapshot(null, group);

  return {
    update(state, elapsedSeconds = 0) {
      const surface = state.playerActionSurface ?? null;
      const action = surface?.primaryAction ?? null;
      const localPlayer = state.localPlayer ?? {};
      const playerPosition = localPlayer.position ?? { x: 0, z: 0 };
      const groundY = terrainGroundHeight(localPlayer, playerPosition.x ?? 0, playerPosition.z ?? 0);
      const yaw = localPlayer.look?.yaw ?? localPlayer.heading ?? 0;
      const visible = Boolean(action?.action && action.action !== "prospect");
      group.visible = visible;
      group.position.set(playerPosition.x ?? 0, groundY + 2.05, playerPosition.z ?? 0);
      group.rotation.y = yaw;
      const color = playerActionColor(action?.action);
      materials.action.color.set(color);
      materials.progress.color.set(action?.hold?.active ? 0x74d0c2 : color);
      const holdRatio = clamp01(action?.hold?.ratio ?? 0);
      holdFill.visible = visible;
      holdFill.scale.set(Math.max(0.05, holdRatio), 1, 1);
      holdFill.position.x = -0.21 + holdRatio * 0.29;
      inputPip.scale.setScalar(action?.inRange ? 1.12 : 0.82);
      targetNeedle.visible = Boolean(action?.targetId);
      targetNeedle.material.color.set(color);
      targetNeedle.material.opacity = action?.inRange ? 0.9 : 0.34;
      const risk = Number(surface?.risk?.pressure ?? 0) + Number(surface?.risk?.activeThreatCount ?? 0) * 0.22;
      riskPulse.visible = risk > 0.05;
      riskPulse.scale.setScalar(1 + Math.max(0, Math.sin(elapsedSeconds * 5.8)) * Math.min(0.45, risk));
      riskPulse.material.opacity = riskPulse.visible ? Math.min(0.46, 0.12 + risk * 0.18) : 0;
      panel.scale.x = action?.hold?.active ? 1.16 : 1;
      panel.material.opacity = visible ? action?.inRange ? 0.78 : 0.54 : 0;
      group.userData.action = action?.action ?? null;
      group.userData.prompt = action?.prompt ?? null;
      group.userData.input = action?.input ?? null;
      group.userData.holdRatio = holdRatio;
      group.userData.targetId = action?.targetId ?? null;
      group.userData.riskPressure = surface?.risk?.pressure ?? 0;
      lastSnapshot = createPlayerActionSurfaceVisualSnapshot(surface, group);
    },
    snapshot() {
      return structuredClone(lastSnapshot);
    },
  };
}

function createPlayerActionSurfaceVisualSnapshot(surface, group) {
  const primary = surface?.primaryAction ?? null;
  return {
    contract: "goldrush-player-action-surface-visual-v1",
    domainPath: "n:render:micro-object-instancing",
    consumes: ["n:goldrush:player-action-surface"],
    visualRole: "diegetic-player-action-prompt",
    visible: Boolean(group?.visible),
    sourceContract: surface?.contract ?? null,
    primaryAction: primary ? {
      action: primary.action,
      domainPath: primary.domainPath,
      prompt: primary.prompt,
      input: primary.input,
      targetId: primary.targetId,
      inRange: Boolean(primary.inRange),
      holdRatio: roundVisualProgress(primary.hold?.ratio ?? 0),
      nextAction: primary.nextAction,
    } : null,
    availableActionCount: surface?.availableActions?.length ?? 0,
    risk: surface?.risk ? structuredClone(surface.risk) : null,
  };
}

function playerActionColor(action) {
  if (action === "cashout-gold") return 0x74d0c2;
  if (action === "take-cover" || action === "hold-cover") return 0xe36b38;
  if (action === "mine-gold") return 0xf2bd45;
  if (action === "find-gold-before-cashout" || action === "route-to-cashout") return 0xd6b56b;
  return 0xffffff;
}

function mountThirdPersonPlayerKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  group.position.set(descriptor.anchor.x, descriptor.anchor.y, descriptor.anchor.z);
  let lastCargoVisual = {
    contract: "goldrush-cargo-visual-v1",
    visible: false,
    amount: 0,
    nuggetCount: 0,
    visibleNuggetCount: 0,
    weightClass: "empty",
  };

  const coat = new THREE.MeshStandardMaterial({ color: 0x263a36, roughness: 0.78, flatShading: true });
  const hat = new THREE.MeshStandardMaterial({ color: 0xb8873d, roughness: 0.82, flatShading: true });
  const bone = new THREE.MeshStandardMaterial({ color: 0xe1d0a8, emissive: 0x1f1606, roughness: 0.72, flatShading: true });
  const gear = new THREE.MeshStandardMaterial({ color: 0xd0a34a, emissive: 0x3d2900, roughness: 0.62, flatShading: true });
  const carriedGold = new THREE.MeshStandardMaterial({ color: 0xf3c858, emissive: 0x9b6500, emissiveIntensity: 0.32, roughness: 0.52, metalness: 0.18, flatShading: true });
  const leather = new THREE.MeshStandardMaterial({ color: 0x4e342a, roughness: 0.82, flatShading: true });
  const darkLeather = new THREE.MeshStandardMaterial({ color: 0x2f211b, roughness: 0.86, flatShading: true });

  const torso = new THREE.Mesh(createPlayerTorsoGeometry(), coat);
  torso.position.set(0, 0.86, 0);
  group.add(torso);

  const ribCage = new THREE.Group();
  ribCage.position.set(0, 0.9, -0.18);
  [0, 1, 2].forEach((index) => {
    const rib = new THREE.Mesh(createCuboidGeometry(0.48 - index * 0.06, 0.035, 0.05), bone);
    rib.position.y = 0.15 + index * 0.12;
    rib.rotation.z = index === 1 ? 0.04 : -0.04;
    ribCage.add(rib);
  });
  const spine = new THREE.Mesh(createCuboidGeometry(0.055, 0.62, 0.055), bone);
  spine.position.y = 0.3;
  ribCage.add(spine);
  group.add(ribCage);

  const neck = new THREE.Mesh(createCuboidGeometry(0.12, 0.12, 0.1), bone);
  neck.position.set(0, 1.22, 0.02);
  group.add(neck);

  const head = new THREE.Mesh(createPlayerHeadGeometry(), bone);
  head.position.set(0, 1.46, 0.02);
  group.add(head);

  const hatBrim = new THREE.Mesh(createPrismGeometry(0.31, 0.055, 12), hat);
  hatBrim.position.set(0, 1.64, 0.01);
  hatBrim.scale.set(1.38, 0.16, 0.82);
  group.add(hatBrim);

  const hatCrown = new THREE.Mesh(createPrismGeometry(0.17, 0.2, 10), hat);
  hatCrown.position.set(0, 1.75, 0.02);
  hatCrown.scale.set(0.88, 1, 0.74);
  group.add(hatCrown);

  const belt = new THREE.Mesh(createCuboidGeometry(0.48, 0.055, 0.18), darkLeather);
  belt.position.set(0, 0.68, 0.02);
  group.add(belt);

  const strap = new THREE.Mesh(createCuboidGeometry(0.055, 0.82, 0.055), darkLeather);
  strap.position.set(0.16, 0.94, -0.17);
  strap.rotation.z = 0.42;
  group.add(strap);

  const pack = new THREE.Mesh(createGoldSatchelGeometry(), gear);
  pack.position.set(-0.34, 0.84, -0.16);
  pack.name = "goldrush.player.prospectorSatchel";
  group.add(pack);

  const cargoNuggets = new THREE.Group();
  cargoNuggets.name = "goldrush.player.carriedGoldCargo";
  cargoNuggets.userData.contract = "goldrush-cargo-visual-v1";
  cargoNuggets.position.set(-0.38, 1.08, -0.2);
  Array.from({ length: 6 }, (_, index) => {
    const nugget = new THREE.Mesh(createCargoNuggetGeometry(index), carriedGold);
    nugget.name = `goldrush.player.carriedGoldCargo.nugget.${index + 1}`;
    nugget.position.set((index % 3 - 1) * 0.065, Math.floor(index / 3) * 0.06, (index % 2) * 0.045);
    nugget.rotation.set(index * 0.27, index * 0.41, index * 0.19);
    nugget.visible = false;
    cargoNuggets.add(nugget);
  });
  group.add(cargoNuggets);

  const leftArm = new THREE.Mesh(createCuboidGeometry(0.07, 0.5, 0.07), bone);
  leftArm.position.set(-0.36, 0.83, 0.02);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(createCuboidGeometry(0.07, 0.5, 0.07), bone);
  rightArm.position.set(0.36, 0.83, 0.02);
  group.add(rightArm);

  const leftLegRig = createKneeLegRig({ side: "left", x: -0.12, bone, bootMaterial: darkLeather });
  const rightLegRig = createKneeLegRig({ side: "right", x: 0.12, bone, bootMaterial: darkLeather });
  group.add(leftLegRig.group);
  group.add(rightLegRig.group);

  const pick = new THREE.Mesh(createPickaxeGeometry(), gear);
  pick.position.set(0.36, 0.98, 0.08);
  pick.rotation.z = -0.38;
  group.add(pick);

  const pedestal = new THREE.Mesh(
    createSpawnPedestalGeometry(),
    new THREE.MeshStandardMaterial({ color: 0x6e5030, roughness: 0.86, metalness: 0.02, flatShading: true })
  );
  pedestal.name = `${descriptor.id}.spawnPedestal`;
  pedestal.position.set(descriptor.anchor.x, terrainFieldHeight(descriptor.anchor.x, descriptor.anchor.z) + 0.03, descriptor.anchor.z);
  pedestal.receiveShadow = true;
  pedestal.castShadow = true;
  scene.add(pedestal);

  scene.add(group);

  return {
    update(state, elapsedSeconds = 0) {
      const combat = state.cameraMode === "combat";
      const localPlayer = state.localPlayer;
      const playerPosition = localPlayer?.position ?? descriptor.anchor;
      const isPlayerControlled = Boolean(localPlayer?.position);
      const isMoving = Boolean(localPlayer?.isMoving);
      const lookYaw = localPlayer?.look?.yaw ?? localPlayer?.heading ?? 0;
      const walkRate = isMoving ? 5.4 + Math.min(3, localPlayer.speed ?? 0) : 1.6;
      const walkPhase = elapsedSeconds * walkRate;
      const stride = Math.sin(walkPhase) * descriptor.locomotion.strideAmplitude * (isMoving ? 1 : 0.14);
      const aimSway = Math.sin(elapsedSeconds * 1.8) * descriptor.locomotion.aimSwayAmplitude;
      group.rotation.y = isPlayerControlled ? (isMoving ? localPlayer.heading : lookYaw) : (combat ? -0.18 : 0.08);
      group.position.x = isPlayerControlled
        ? playerPosition.x
        : descriptor.anchor.x + Math.sin(elapsedSeconds * 0.32) * (combat ? 0.08 : 0.72);
      group.position.z = isPlayerControlled
        ? playerPosition.z
        : (combat ? descriptor.anchor.z + 0.36 : descriptor.anchor.z + Math.cos(elapsedSeconds * 0.26) * 0.32);
      group.position.y = terrainGroundHeight(localPlayer, group.position.x, group.position.z)
        + descriptor.anchor.y;
      const cargoVisual = resolvePlayerCargoVisual(state);
      const carryLean = Number(cargoVisual.mobility?.postureLean ?? localPlayer?.movementModifiers?.postureLean ?? 0);
      torso.rotation.z = combat ? aimSway * 0.5 + carryLean * 0.35 : carryLean;
      head.rotation.y = combat ? aimSway : Math.sin(elapsedSeconds * 0.8) * (isMoving ? 0.05 : 0.08);
      leftArm.rotation.x = combat ? -0.2 : stride;
      rightArm.rotation.x = combat ? -0.78 + aimSway : -stride;
      poseKneeLegRig(leftLegRig, { stride: -stride, combat, idlePhase: walkPhase });
      poseKneeLegRig(rightLegRig, { stride, combat, idlePhase: walkPhase + Math.PI });
      pick.rotation.x = combat ? -0.9 + aimSway : -0.25 - stride * 0.22;
      pick.rotation.z = combat ? -0.72 : -0.38;
      pack.scale.setScalar(cargoVisual.scale);
      pack.rotation.z = -carryLean * 0.6;
      pack.userData.cargoVisual = cargoVisual;
      pack.userData.mobilityContract = cargoVisual.mobility?.contract ?? null;
      lastCargoVisual = {
        ...cargoVisual,
        domainPath: cargoVisual.domainPath ?? "n:goldrush:gold-carrying",
        renderRole: cargoVisual.renderRole ?? "carried-object",
        postureLean: carryLean,
        visibleNuggetCount: updateCargoVisualGroup(cargoNuggets, carriedGold, cargoVisual, elapsedSeconds),
      };
    },
    snapshot() {
      return {
        id: descriptor.id,
        visualContract: "goldrush-third-person-player-rig-v1",
        cargoVisual: structuredClone(lastCargoVisual),
      };
    },
  };
}

function resolvePlayerCargoVisual(state) {
  const visual = state.extractionLoop?.player?.cargo?.visual;
  const mobility = state.extractionLoop?.player?.cargo?.mobility ?? visual?.mobility ?? state.localPlayer?.movementModifiers?.cargo ?? null;
  if (visual?.contract === "goldrush-cargo-visual-v1") {
    return {
      ...visual,
      mobility,
    };
  }
  const amount = Math.max(0, Number(state.cargo?.["player-1"] ?? 0));
  const loadRatio = Math.min(1, amount / 120);
  const fallbackMobility = mobility ?? {
    domainPath: "n:goldrush:gold-carrying",
    contract: "goldrush-cargo-mobility-v1",
    amount,
    loadRatio,
    speedMultiplier: Number((1 - loadRatio * 0.28).toFixed(3)),
    sprintMultiplier: Number((1 - loadRatio * 0.42).toFixed(3)),
    postureLean: Number((loadRatio * 0.16).toFixed(3)),
    weightClass: amount >= 90 ? "heavy" : amount >= 45 ? "loaded" : amount > 0 ? "light" : "empty",
  };
  return {
    domainPath: "n:goldrush:gold-carrying",
    contract: "goldrush-cargo-visual-v1",
    visible: amount > 0,
    amount,
    loadRatio,
    nuggetCount: amount > 0 ? Math.min(6, Math.ceil(amount / 18)) : 0,
    scale: 1 + loadRatio * 0.34,
    swayAmplitude: 0.015 + loadRatio * 0.055,
    emissiveIntensity: 0.18 + loadRatio * 0.44,
    weightClass: amount >= 90 ? "heavy" : amount >= 45 ? "loaded" : amount > 0 ? "light" : "empty",
    mobility: fallbackMobility,
  };
}

function updateCargoVisualGroup(group, material, cargoVisual, elapsedSeconds = 0) {
  const visible = Boolean(cargoVisual.visible && cargoVisual.amount > 0);
  let visibleNuggetCount = 0;
  group.visible = visible;
  group.userData.contract = cargoVisual.contract;
  group.userData.amount = cargoVisual.amount;
  group.userData.weightClass = cargoVisual.weightClass;
  group.userData.nuggetCount = cargoVisual.nuggetCount;
  group.position.y = 1.08 + Math.sin(elapsedSeconds * 3.2) * (cargoVisual.swayAmplitude ?? 0.02);
  group.rotation.z = Math.sin(elapsedSeconds * 2.4) * (cargoVisual.swayAmplitude ?? 0.02) * 0.6;
  group.scale.setScalar(cargoVisual.scale ?? 1);
  material.emissiveIntensity = cargoVisual.emissiveIntensity ?? 0.3;
  group.children.forEach((child, index) => {
    child.visible = visible && index < (cargoVisual.nuggetCount ?? 0);
    if (child.visible) visibleNuggetCount += 1;
    child.rotation.y += visible ? 0.004 + index * 0.0008 : 0;
  });
  group.userData.visibleNuggetCount = visibleNuggetCount;
  return visibleNuggetCount;
}

function createKneeLegRig({ side, x, bone, bootMaterial }) {
  const group = new THREE.Group();
  group.name = `goldrush.player.${side}.leg`;
  group.position.set(x, 0.57, 0.02);

  const upperLeg = new THREE.Mesh(createCuboidGeometry(0.085, 0.27, 0.085), bone);
  upperLeg.name = `goldrush.player.${side}.upperLeg`;
  upperLeg.position.y = -0.13;
  group.add(upperLeg);

  const lowerGroup = new THREE.Group();
  lowerGroup.name = `goldrush.player.${side}.lowerLegPivot`;
  lowerGroup.position.y = -0.29;
  group.add(lowerGroup);

  const knee = new THREE.Mesh(createPrismGeometry(0.062, 0.07, 8), bone);
  knee.name = `goldrush.player.${side}.kneeJoint`;
  knee.rotation.z = Math.PI / 2;
  lowerGroup.add(knee);

  const lowerLeg = new THREE.Mesh(createCuboidGeometry(0.078, 0.27, 0.078), bone);
  lowerLeg.name = `goldrush.player.${side}.lowerLeg`;
  lowerLeg.position.y = -0.14;
  lowerGroup.add(lowerLeg);

  const boot = new THREE.Mesh(createCuboidGeometry(0.18, 0.12, 0.25), bootMaterial);
  boot.name = `goldrush.player.${side}.boot`;
  boot.position.set(0, -0.31, -0.055);
  lowerGroup.add(boot);

  return { group, upperLeg, lowerGroup, knee, lowerLeg, boot };
}

function poseKneeLegRig(rig, { stride = 0, combat = false, idlePhase = 0 } = {}) {
  const plantedBias = combat ? 0.05 : 0;
  const hipSwing = combat ? plantedBias : stride * 0.66;
  const bend = combat ? 0.12 : 0.08 + Math.max(0, Math.sin(idlePhase)) * 0.34 + Math.abs(stride) * 0.3;
  rig.group.rotation.x = hipSwing;
  rig.lowerGroup.rotation.x = bend;
  rig.boot.rotation.x = -bend * 0.42;
  rig.knee.scale.setScalar(1 + Math.min(0.14, bend * 0.2));
}

function mountLightingCameraKit(scene, descriptor, root) {
  const camera = new THREE.PerspectiveCamera(descriptor.camera.exploration.fov, 1, 0.1, 260);
  let lastSnapshot = {
    mode: "unmounted",
    position: { x: 0, y: 0, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    selectedPerspectiveId: null,
    selectionKey: null,
    motionAuthority: "unknown",
  };
  const key = new THREE.DirectionalLight(descriptor.lightRig.key.color, descriptor.lightRig.key.intensity);
  key.position.fromArray(descriptor.lightRig.key.position);
  key.castShadow = true;
  key.shadow.mapSize.width = 1024;
  key.shadow.mapSize.height = 1024;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 90;
  key.shadow.camera.left = -44;
  key.shadow.camera.right = 44;
  key.shadow.camera.top = 44;
  key.shadow.camera.bottom = -44;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xaed7df, 0x8d6238, 1.1));
  scene.add(new THREE.AmbientLight(descriptor.lightRig.fill.color, descriptor.lightRig.fill.intensity * 0.45));

  return {
    camera,
    update(state) {
      const preset = state.cameraState?.threeDescriptor
        ?? (state.cameraMode === "combat" ? descriptor.camera.combat : descriptor.camera.exploration);
      camera.fov = preset.fov;
      let lookAtTarget = null;
      if (state.localPlayer?.position) {
        const player = state.localPlayer.position;
        const playerY = terrainGroundHeight(state.localPlayer, player.x, player.z);
        const heading = state.localPlayer.look?.yaw ?? state.localPlayer.heading ?? 0;
        const pitch = state.localPlayer.look?.pitch ?? -0.04;
        const presetPosition = new THREE.Vector3(...preset.position);
        const presetLookAt = new THREE.Vector3(...preset.lookAt);
        const catalogOffset = presetPosition.sub(presetLookAt);
        const shoulderOffset = new THREE.Vector3(
          Math.sign(catalogOffset.x || 1) * 0.72,
          1.58,
          -2.95 + Math.min(0, catalogOffset.z) * 0.12
        ).applyAxisAngle(Y_AXIS, heading);
        const shoulderTarget = new THREE.Vector3(player.x, playerY + 1.24, player.z);
        const lookAhead = new THREE.Vector3(
          Math.sin(heading) * 3.4,
          Math.sin(pitch) * 3.0,
          Math.cos(heading) * 3.4
        );
        camera.position.copy(shoulderTarget).add(shoulderOffset);
        lookAtTarget = shoulderTarget.add(lookAhead);
        camera.lookAt(lookAtTarget);
      } else {
        camera.position.fromArray(preset.position);
        lookAtTarget = new THREE.Vector3(...preset.lookAt);
        camera.lookAt(lookAtTarget);
      }
      const rect = root.getBoundingClientRect();
      camera.aspect = Math.max(320, rect.width) / Math.max(360, rect.height || window.innerHeight);
      camera.updateProjectionMatrix();
      lastSnapshot = {
        mode: state.cameraMode ?? state.cameraState?.mode ?? "unknown",
        controllerContract: "goldrush-linear-camera-controller-v1",
        controlPipeline: [
          "transition-latched-camera-descriptor",
          "local-player-mouse-look-yaw-pitch",
          "over-shoulder-player-follow",
          "single-three-camera-render",
        ],
        decoupledFrom: [
          "object-protokit-generation",
          "micro-object-interaction-markers",
          "per-frame-camera-catalog-selection",
        ],
        fov: Number(camera.fov.toFixed(3)),
        position: vectorSnapshot(camera.position),
        lookAt: vectorSnapshot(lookAtTarget ?? new THREE.Vector3()),
        selectedPerspectiveId: state.cameraState?.selectedPerspective?.id ?? null,
        selectionKey: state.cameraState?.selectionKey ?? null,
        motionAuthority: state.cameraState?.motionAuthority ?? "renderer-fallback",
        playerPosition: state.localPlayer?.position ? vectorSnapshot(state.localPlayer.position) : null,
      };
    },
    snapshot() {
      return structuredClone(lastSnapshot);
    },
  };
}

function vectorSnapshot(vector) {
  return {
    x: Number((vector.x ?? 0).toFixed(4)),
    y: Number((vector.y ?? 0).toFixed(4)),
    z: Number((vector.z ?? 0).toFixed(4)),
  };
}

function createPatchGeometry(patch, subdivisions) {
  const vertices = [];
  const indices = [];
  const half = patch.size / 2;
  const step = patch.size / subdivisions;

  for (let row = 0; row <= subdivisions; row += 1) {
    for (let column = 0; column <= subdivisions; column += 1) {
      const x = -half + column * step;
      const z = -half + row * step;
      const y = patchHeight(patch, column, row);
      vertices.push(x, y, z);
    }
  }

  for (let row = 0; row < subdivisions; row += 1) {
    for (let column = 0; column < subdivisions; column += 1) {
      const a = row * (subdivisions + 1) + column;
      const b = a + 1;
      const c = a + subdivisions + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function patchHeight(patch, column, row) {
  return Math.sin((patch.column + column) * 0.7) * 0.07 + Math.cos((patch.row + row) * 0.8) * 0.05;
}

function createRouteLine(points, color, opacity, pointSize) {
  const group = new THREE.Group();
  group.userData.baseOpacity = opacity;
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  points.forEach((point, index) => {
    const mesh = new THREE.Mesh(createMarkerGeometry(pointSize), material);
    mesh.position.set(point.x, 0.22, point.z);
    mesh.rotation.y = index * 0.24;
    group.add(mesh);
  });
  return group;
}

function resolveMountainRangeVisual(mountain, descriptor, scale) {
  const terrainDepth = descriptor.scale.depthMeters * scale;
  const terrainWidth = descriptor.scale.widthMeters * scale;
  if (mountain.role === "horizon-blocker") {
    return {
      ...mountain,
      visualRole: "far-horizon-silhouette",
      position: {
        x: mountain.position.x * scale * 0.42,
        y: 0.16,
        z: terrainDepth * 0.5 + 12,
      },
      footprint: {
        width: Math.min(mountain.footprint.width * 0.72, terrainWidth * 0.54) / scale,
        depth: Math.min(mountain.footprint.depth * 0.52, terrainDepth * 0.16) / scale,
      },
      height: mountain.height * 0.55,
    };
  }
  return {
    ...mountain,
    visualRole: "side-boundary",
    position: {
      x: mountain.position.x * scale,
      y: 0.35,
      z: mountain.position.z * scale,
    },
  };
}

function createCrystalGeometry(height = 0.28) {
  const width = height * 0.55;
  const vertices = [
    0, height, 0,
    -width, 0, -width,
    width, 0, -width,
    width, 0, width,
    -width, 0, width,
    0, -height * 0.25, 0,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,
    5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createMarkerGeometry(size = 0.16) {
  const h = size * 1.8;
  const vertices = [
    0, h, 0,
    -size, 0, -size,
    size, 0, -size,
    size, 0, size,
    -size, 0, size,
  ];
  const indices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, 1, 4, 3, 1, 3, 2];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createSpawnPedestalGeometry() {
  const vertices = [
    -0.52, 0, -0.38, 0.52, 0, -0.38, 0.68, 0, -0.08, 0.44, 0, 0.38, -0.44, 0, 0.38, -0.68, 0, -0.08,
    -0.44, 0.12, -0.28, 0.44, 0.12, -0.28, 0.56, 0.12, -0.04, 0.36, 0.12, 0.28, -0.36, 0.12, 0.28, -0.56, 0.12, -0.04,
  ];
  const indices = [
    0, 1, 7, 0, 7, 6, 1, 2, 8, 1, 8, 7, 2, 3, 9, 2, 9, 8,
    3, 4, 10, 3, 10, 9, 4, 5, 11, 4, 11, 10, 5, 0, 6, 5, 6, 11,
    6, 7, 8, 6, 8, 11, 8, 9, 10, 8, 10, 11,
    0, 2, 1, 0, 5, 2, 2, 5, 4, 2, 4, 3,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createRidgeGeometry(mountain, scale) {
  const width = mountain.footprint.width * scale;
  const depth = mountain.footprint.depth * scale;
  const height = mountain.height * scale;
  const vertices = [
    -width / 2, 0, -depth / 2,
    width / 2, 0, -depth / 2,
    width / 2, 0, depth / 2,
    -width / 2, 0, depth / 2,
    -width / 3, height * 0.82, -depth * 0.12,
    0, height, depth * 0.06,
    width / 3, height * 0.74, -depth * 0.04,
  ];
  const indices = [
    0, 1, 4, 1, 5, 4, 1, 2, 6, 1, 6, 5,
    2, 3, 6, 3, 4, 6, 3, 0, 4, 4, 5, 6,
    0, 3, 2, 0, 2, 1,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createBuildingGeometry({ width, depth, height }) {
  const vertices = [
    -width / 2, 0, -depth / 2,
    width / 2, 0, -depth / 2,
    width / 2, 0, depth / 2,
    -width / 2, 0, depth / 2,
    -width / 2, height, -depth / 2,
    width / 2, height, -depth / 2,
    width / 2, height, depth / 2,
    -width / 2, height, depth / 2,
    0, height + 0.18, -depth / 2,
    0, height + 0.18, depth / 2,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0,
    4, 8, 5, 7, 6, 9, 4, 7, 9, 4, 9, 8, 5, 8, 9, 5, 9, 6,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createTowerGeometry(height = 0.9) {
  const width = 0.18;
  const vertices = [
    -width, 0, -width,
    width, 0, -width,
    width, 0, width,
    -width, 0, width,
    -width * 0.55, height, -width * 0.55,
    width * 0.55, height, -width * 0.55,
    width * 0.55, height, width * 0.55,
    -width * 0.55, height, width * 0.55,
    0, height + 0.26, 0,
  ];
  const indices = [
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    4, 5, 8, 5, 6, 8, 6, 7, 8, 7, 4, 8,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createZoneGeometry(radius, segments) {
  const vertices = [0, 0, 0];
  const indices = [];
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    vertices.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }
  for (let index = 1; index <= segments; index += 1) {
    indices.push(0, index, index === segments ? 1 : index + 1);
  }
  return createIndexedGeometry(vertices, indices);
}

function createWorldPathLine(points, material) {
  const group = new THREE.Group();
  points.forEach((point, index) => {
    const mesh = new THREE.Mesh(createMarkerGeometry(0.08), material);
    mesh.position.set(point.x, 0.16, point.z);
    mesh.rotation.y = index * 0.2;
    mesh.userData.elementId = "path.marker";
    group.add(mesh);
  });
  return group;
}

function createTrailRibbon(points, color, opacity, width) {
  const group = new THREE.Group();
  group.userData.baseOpacity = opacity;
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide });
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index];
    const b = points[index + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const length = Math.hypot(dx, dz);
    const mesh = new THREE.Mesh(createCuboidGeometry(width, 0.012, length), material);
    mesh.position.set((a.x + b.x) / 2, 0.055, (a.z + b.z) / 2);
    mesh.rotation.y = Math.atan2(dx, dz);
    group.add(mesh);
  }
  return group;
}

export function createBandedTriangleTerrainGeometry(descriptor) {
  const vertices = [];
  const colors = [];
  const indices = [];
  const color = new THREE.Color();
  const sortedBands = [...descriptor.tessellationBands].sort((a, b) => b.priority - a.priority);

  sortedBands.forEach((band, bandIndex) => {
    for (let z = band.bounds.minZ; z < band.bounds.maxZ; z += band.step) {
      for (let x = band.bounds.minX; x < band.bounds.maxX; x += band.step) {
        const x1 = Math.min(x + band.step, band.bounds.maxX);
        const z1 = Math.min(z + band.step, band.bounds.maxZ);
        const centerX = (x + x1) / 2;
        const centerZ = (z + z1) / 2;
        if (isCoveredByFinerTerrainBand(band, sortedBands, centerX, centerZ)) continue;
        pushTerrainCell(vertices, colors, indices, color, descriptor, band, x, z, x1, z1, bandIndex);
      }
    }
    pushTerrainBandSkirts(vertices, colors, indices, color, descriptor, band, bandIndex);
  });

  if (descriptor.centralMountainPhysics?.enabled) {
    // Reserved for the physics pass: the visible terrain and colliders share this same height algorithm.
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function pushTerrainCell(vertices, colors, indices, color, descriptor, band, x0, z0, x1, z1, bandIndex) {
  const base = vertices.length / 3;
  const centerX = (x0 + x1) / 2;
  const centerZ = (z0 + z1) / 2;
  const bandYOffset = terrainBandYOffset(bandIndex);
  const cornerPoints = [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ];
  const points = [
    ...cornerPoints,
    [centerX, centerZ],
  ];

  points.forEach(([x, z]) => {
    const y = terrainFieldHeight(x, z) + bandYOffset;
    vertices.push(x, y, z);
    color.copy(sampleTerrainRenderColor(x, z, descriptor, band));
    const bandShade = 1 - bandIndex * 0.018;
    colors.push(color.r * bandShade, color.g * bandShade, color.b * bandShade);
  });
  indices.push(
    base, base + 4, base + 1,
    base + 1, base + 4, base + 2,
    base + 2, base + 4, base + 3,
    base + 3, base + 4, base
  );
}

function pushTerrainBandSkirts(vertices, colors, indices, color, descriptor, band, bandIndex) {
  const { minX, maxX, minZ, maxZ } = band.bounds;
  const step = band.step;
  const skirtDepth = band.skirtDepth ?? step * 2;
  const edges = [
    { id: "south", from: [minX, minZ], to: [maxX, minZ], axis: "x" },
    { id: "north", from: [minX, maxZ], to: [maxX, maxZ], axis: "x" },
    { id: "west", from: [minX, minZ], to: [minX, maxZ], axis: "z" },
    { id: "east", from: [maxX, minZ], to: [maxX, maxZ], axis: "z" },
  ];
  edges.forEach((edge) => {
    const span = edge.axis === "x" ? maxX - minX : maxZ - minZ;
    const segments = Math.max(1, Math.ceil(span / step));
    for (let index = 0; index < segments; index += 1) {
      const t0 = index / segments;
      const t1 = (index + 1) / segments;
      const x0 = edge.axis === "x" ? minX + (maxX - minX) * t0 : edge.from[0];
      const z0 = edge.axis === "z" ? minZ + (maxZ - minZ) * t0 : edge.from[1];
      const x1 = edge.axis === "x" ? minX + (maxX - minX) * t1 : edge.to[0];
      const z1 = edge.axis === "z" ? minZ + (maxZ - minZ) * t1 : edge.to[1];
      pushTerrainSkirtSegment(vertices, colors, indices, color, descriptor, band, x0, z0, x1, z1, skirtDepth, bandIndex, edge.id);
    }
  });
}

function pushTerrainSkirtSegment(vertices, colors, indices, color, descriptor, band, x0, z0, x1, z1, skirtDepth, bandIndex, edgeId) {
  const base = vertices.length / 3;
  const bandYOffset = terrainBandYOffset(bandIndex);
  const top0 = terrainFieldHeight(x0, z0) + bandYOffset;
  const top1 = terrainFieldHeight(x1, z1) + bandYOffset;
  const points = [
    [x0, top0, z0],
    [x1, top1, z1],
    [x1, top1 - skirtDepth, z1],
    [x0, top0 - skirtDepth, z0],
  ];
  points.forEach(([x, y, z]) => {
    vertices.push(x, y, z);
    color.copy(sampleTerrainRenderColor(x, z, descriptor, band)).multiplyScalar(0.7);
    colors.push(color.r, color.g, color.b);
  });
  if (edgeId === "north" || edgeId === "west") {
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  } else {
    indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
  }
}

function terrainBandYOffset(bandIndex) {
  return bandIndex * 0.004;
}

function isCoveredByFinerTerrainBand(currentBand, bands, x, z) {
  return bands.some((band) => (
    band.step < currentBand.step
    && x > band.bounds.minX
    && x < band.bounds.maxX
    && z > band.bounds.minZ
    && z < band.bounds.maxZ
  ));
}

function sampleTerrainRenderColor(x, z, descriptor, band) {
  const color = new THREE.Color(terrainFieldColor(x, z) || 0x92703d);
  if (band.id !== "far-horizon-band") return color;
  const edgeX = Math.abs(x) / Math.max(1, descriptor.width * 0.5);
  const edgeZ = Math.abs(z) / Math.max(1, descriptor.depth * 0.5);
  const edge = Math.max(edgeX, edgeZ);
  const start = band.horizonFadeStart ?? 0.72;
  const end = band.horizonFadeEnd ?? 1;
  const amount = Math.max(0, Math.min(1, (edge - start) / Math.max(0.001, end - start)));
  return color.lerp(new THREE.Color(0xb99962), amount * 0.48);
}

function createSpaceSlabGeometry(width, depth, height) {
  const bevel = Math.min(width, depth) * 0.08;
  return createIndexedGeometry([
    -width / 2, -height / 2, -depth / 2,
    width / 2, -height / 2, -depth / 2,
    width / 2, -height / 2, depth / 2,
    -width / 2, -height / 2, depth / 2,
    -width / 2 + bevel, height / 2, -depth / 2 + bevel,
    width / 2 - bevel, height / 2, -depth / 2 + bevel,
    width / 2 - bevel, height / 2, depth / 2 - bevel,
    -width / 2 + bevel, height / 2, depth / 2 - bevel,
  ], [
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    4, 5, 6, 4, 6, 7,
    0, 3, 2, 0, 2, 1,
  ]);
}

function createSpaceBankGeometry(length, height, width) {
  return createIndexedGeometry([
    -length / 2, -height / 2, -width / 2,
    length / 2, -height / 2, -width / 2,
    length / 2, -height / 2, width / 2,
    -length / 2, -height / 2, width / 2,
    -length / 2, height / 2, -width * 0.2,
    length / 2, height / 2, -width * 0.18,
    length / 2, height * 0.22, width / 2,
    -length / 2, height * 0.26, width / 2,
  ], [
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    4, 5, 6, 4, 6, 7,
    0, 3, 2, 0, 2, 1,
  ]);
}

function createSpaceWallFaceGeometry(width, height, depth) {
  return createIndexedGeometry([
    -width / 2, -height / 2, -depth / 2,
    width / 2, -height / 2, -depth / 2,
    width / 2, -height / 2, depth / 2,
    -width / 2, -height / 2, depth / 2,
    -width * 0.46, height * 0.38, -depth * 0.52,
    -width * 0.12, height * 0.52, -depth * 0.48,
    width * 0.24, height * 0.46, -depth * 0.5,
    width * 0.46, height * 0.24, -depth * 0.44,
    -width * 0.3, height * 0.05, depth * 0.4,
    width * 0.26, height * 0.1, depth * 0.38,
  ], [
    0, 1, 5, 0, 5, 4,
    1, 2, 7, 1, 7, 6, 1, 6, 5,
    2, 3, 8, 2, 8, 9, 2, 9, 7,
    3, 0, 4, 3, 4, 8,
    4, 5, 6, 4, 6, 8,
    6, 7, 9, 6, 9, 8,
    0, 3, 2, 0, 2, 1,
  ]);
}

function createCanyonWallGeometry(wall) {
  const width = wall.width;
  const depth = wall.depth;
  const height = wall.height;
  const vertices = [
    -width / 2, -height * 0.38, -depth / 2,
    width / 2, -height * 0.42, -depth / 2,
    width / 2, -height * 0.34, depth / 2,
    -width / 2, -height * 0.4, depth / 2,
    -width * 0.42, height * 0.25, -depth * 0.38,
    -width * 0.12, height * 0.5, -depth * 0.2,
    width * 0.18, height * 0.62, depth * 0.06,
    width * 0.44, height * 0.18, depth * 0.32,
    -width * 0.34, height * 0.02, depth * 0.38,
    width * 0.02, height * 0.2, depth * 0.46,
  ];
  const indices = [
    0, 1, 5, 0, 5, 4,
    1, 2, 7, 1, 7, 6, 1, 6, 5,
    2, 3, 8, 2, 8, 9, 2, 9, 7,
    3, 0, 4, 3, 4, 8,
    4, 5, 6, 4, 6, 8,
    6, 7, 9, 6, 9, 8,
    0, 3, 2, 0, 2, 1,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createWalkaroundMountainGeometry(mountain) {
  const width = mountain.visualWidth ?? mountain.width * 0.78;
  const depth = mountain.visualDepth ?? mountain.depth * 0.78;
  const height = mountain.visualHeight ?? mountain.height * 0.56;
  const rings = [
    { y: 0, sx: 0.5, sz: 0.5, notch: 0 },
    { y: height * 0.22, sx: 0.42, sz: 0.43, notch: 0.1 },
    { y: height * 0.48, sx: 0.3, sz: 0.29, notch: 0.18 },
    { y: height * 0.72, sx: 0.18, sz: 0.16, notch: 0.28 },
  ];
  const vertices = [];
  rings.forEach((ring, ringIndex) => {
    const y = ring.y;
    const leftShoulder = ringIndex % 2 ? -0.08 : 0.04;
    vertices.push(
      -width * ring.sx, y, -depth * ring.sz + depth * ring.notch,
      width * ring.sx, y + height * 0.03, -depth * ring.sz + depth * ring.notch * 0.7,
      width * (ring.sx * 0.78), y + height * 0.01, depth * ring.sz,
      leftShoulder * width, y - height * 0.02, depth * (ring.sz * 0.78),
      -width * (ring.sx * 0.86), y + height * 0.02, depth * (ring.sz * 0.76)
    );
  });
  const peakBase = vertices.length / 3;
  vertices.push(
    -width * 0.08, height * 0.95, -depth * 0.02,
    width * 0.16, height * 0.86, depth * 0.04,
    width * 0.02, height * 0.7, depth * 0.22
  );

  const indices = [];
  const ringSize = 5;
  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    const lower = ring * ringSize;
    const upper = (ring + 1) * ringSize;
    for (let index = 0; index < ringSize; index += 1) {
      const next = (index + 1) % ringSize;
      indices.push(
        lower + index, lower + next, upper + index,
        lower + next, upper + next, upper + index
      );
    }
  }
  const topRing = (rings.length - 1) * ringSize;
  for (let index = 0; index < ringSize; index += 1) {
    const next = (index + 1) % ringSize;
    indices.push(topRing + index, topRing + next, peakBase + (index % 3));
  }
  indices.push(peakBase, peakBase + 1, peakBase + 2);
  for (let index = 1; index < ringSize - 1; index += 1) {
    indices.push(0, index, index + 1);
  }
  return createIndexedGeometry(vertices, indices);
}

function createSlopeSkirtGeometry() {
  return createIndexedGeometry([
    -0.6, 0, -0.28,
    0.62, 0.02, -0.24,
    0.48, 0.18, 0.24,
    -0.54, 0.14, 0.28,
    -0.42, 0.42, -0.06,
    0.32, 0.36, 0.02,
  ], [
    0, 1, 2, 0, 2, 3,
    3, 2, 5, 3, 5, 4,
    0, 3, 4, 0, 4, 1,
    1, 4, 5, 1, 5, 2,
  ]);
}

function createStrataRibbonGeometry() {
  return createIndexedGeometry([
    -0.6, 0, -0.03,
    0.6, 0.02, -0.03,
    0.56, 0.08, 0.03,
    -0.58, 0.05, 0.03,
  ], [0, 1, 2, 0, 2, 3]);
}

function createShadowPocketGeometry() {
  return createIndexedGeometry([
    -0.32, 0, 0,
    0.32, 0, 0,
    0.2, 0.34, 0.02,
    -0.22, 0.28, 0.02,
  ], [0, 1, 2, 0, 2, 3]);
}

function createGoldSeamGeometry() {
  return createIndexedGeometry([
    -0.46, 0, -0.04,
    -0.12, 0.06, -0.02,
    0.18, 0.02, -0.03,
    0.5, 0.08, 0,
    0.42, 0.16, 0.05,
    0.05, 0.11, 0.04,
    -0.38, 0.15, 0.05,
  ], [
    0, 1, 6,
    1, 5, 6,
    1, 2, 5,
    2, 3, 4,
    2, 4, 5,
  ]);
}

function createGoldNuggetClusterGeometry() {
  const nuggets = [
    createCrystalGeometry(0.14),
    createCrystalGeometry(0.1),
    createCrystalGeometry(0.085),
  ];
  nuggets[0].scale(1, 0.72, 0.88);
  nuggets[1].scale(0.8, 0.58, 0.72);
  nuggets[2].scale(0.7, 0.5, 0.66);
  nuggets[0].translate(0, 0.06, 0);
  nuggets[1].translate(0.13, 0.035, -0.055);
  nuggets[2].translate(-0.12, 0.03, 0.07);
  return mergeBufferGeometries(nuggets);
}

function createOreLodeChipGeometry() {
  const base = createFacetedBoulderGeometry(0.16);
  base.scale(1.15, 0.62, 0.82);
  base.translate(0, 0.04, 0);
  const face = createIndexedGeometry([
    -0.14, 0.03, -0.035,
    0.12, 0.055, -0.05,
    0.09, 0.18, 0.02,
    -0.12, 0.145, 0.035,
  ], [0, 1, 2, 0, 2, 3]);
  return mergeBufferGeometries([base, face]);
}

function createGoldSeamLodeGeometry() {
  const seam = createGoldSeamGeometry();
  const ridge = createIndexedGeometry([
    -0.54, 0.02, -0.055,
    -0.18, 0.105, -0.03,
    0.22, 0.07, -0.025,
    0.56, 0.13, 0.01,
    0.48, 0.21, 0.075,
    0.04, 0.17, 0.075,
    -0.46, 0.2, 0.07,
  ], [
    0, 1, 6,
    1, 5, 6,
    1, 2, 5,
    2, 3, 4,
    2, 4, 5,
  ]);
  ridge.translate(0, 0.02, 0.035);
  return mergeBufferGeometries([seam, ridge]);
}

function createTailingsFanGeometry() {
  const fan = createIndexedGeometry([
    -0.48, 0, -0.28,
    -0.16, 0.035, -0.18,
    0.24, 0.025, -0.24,
    0.52, 0, -0.08,
    0.42, 0.04, 0.24,
    0.04, 0.075, 0.34,
    -0.38, 0.035, 0.18,
  ], [
    0, 1, 6,
    1, 5, 6,
    1, 2, 5,
    2, 4, 5,
    2, 3, 4,
  ]);
  const scatterA = createOreLodeChipGeometry();
  const scatterB = createFacetedBoulderGeometry(0.08);
  scatterA.scale(0.55, 0.45, 0.55);
  scatterB.scale(0.75, 0.35, 0.75);
  scatterA.translate(-0.18, 0.08, 0.04);
  scatterB.translate(0.22, 0.06, 0.12);
  return mergeBufferGeometries([fan, scatterA, scatterB]);
}

function createMineFrameGeometry() {
  const group = new THREE.BufferGeometry();
  const left = createCuboidGeometry(0.1, 0.72, 0.12);
  const right = createCuboidGeometry(0.1, 0.72, 0.12);
  const beam = createCuboidGeometry(0.84, 0.1, 0.12);
  left.translate(-0.36, 0.36, 0);
  right.translate(0.36, 0.36, 0);
  beam.translate(0, 0.72, 0);
  return mergeBufferGeometries([left, right, beam]);
}

function createLanternPostGeometry() {
  const post = createCuboidGeometry(0.04, 0.72, 0.04);
  const lamp = createPrismGeometry(0.09, 0.13, 6);
  post.translate(0, 0.36, 0);
  lamp.translate(0, 0.78, 0);
  return mergeBufferGeometries([post, lamp]);
}

function createWarningSignGeometry() {
  const post = createCuboidGeometry(0.045, 0.52, 0.04);
  const sign = createCuboidGeometry(0.38, 0.18, 0.035);
  post.translate(0, 0.26, 0);
  sign.translate(0, 0.54, 0);
  return mergeBufferGeometries([post, sign]);
}

function createTownFrontageGeometry() {
  const wall = createCuboidGeometry(0.78, 0.62, 0.18);
  const falseFront = createCuboidGeometry(0.9, 0.28, 0.16);
  const porch = createCuboidGeometry(0.98, 0.08, 0.32);
  const awning = createCuboidGeometry(0.82, 0.08, 0.22);
  wall.translate(0, 0.36, 0);
  falseFront.translate(0, 0.82, -0.01);
  porch.translate(0, 0.12, -0.24);
  awning.translate(0, 0.58, -0.24);
  return mergeBufferGeometries([wall, falseFront, porch, awning]);
}

function createWaterTowerGeometry() {
  const tower = [
    createCuboidGeometry(0.05, 0.85, 0.05),
    createCuboidGeometry(0.05, 0.85, 0.05),
    createCuboidGeometry(0.05, 0.85, 0.05),
    createCuboidGeometry(0.05, 0.85, 0.05),
    createPrismGeometry(0.32, 0.28, 10),
    createCuboidGeometry(0.78, 0.05, 0.1),
    createCuboidGeometry(0.1, 0.05, 0.78),
  ];
  tower[0].translate(-0.25, 0.42, -0.25);
  tower[1].translate(0.25, 0.42, -0.25);
  tower[2].translate(0.25, 0.42, 0.25);
  tower[3].translate(-0.25, 0.42, 0.25);
  tower[4].translate(0, 0.98, 0);
  tower[5].translate(0, 0.78, 0);
  tower[6].translate(0, 0.78, 0);
  return mergeBufferGeometries(tower);
}

function createFrontagePropGeometry() {
  const crate = createCuboidGeometry(0.24, 0.2, 0.22);
  const barrel = createPrismGeometry(0.12, 0.24, 8);
  crate.translate(-0.12, 0.1, 0);
  barrel.translate(0.18, 0.12, 0.04);
  return mergeBufferGeometries([crate, barrel]);
}

function createMicroKitGeometry(role) {
  if (role === "dust-ridge") return createDustRidgeGeometry();
  if (role === "trail-rut") return createDustRidgeGeometry();
  if (role === "pebble" || role === "ballast-stone") return createFacetedBoulderGeometry(0.08);
  if (role === "grass-blade") return createBladeGeometry(0.34);
  if (role === "scrub") return createScrubGeometry();
  if (role === "cactus-sprout") return createPrismGeometry(0.045, 0.42, 7);
  if (role === "gold-fleck") return createGoldNuggetClusterGeometry();
  if (role === "ore-chip") return createOreLodeChipGeometry();
  if (role === "wood-splinter") return createCuboidGeometry(0.055, 0.035, 0.42);
  if (role === "canvas-scrap") return createCanvasScrapGeometry();
  if (role === "trail-marker") return createMarkerGeometry(0.085);
  if (role === "strata-wedge") return createStrataWedgeGeometry();
  if (role === "wall-segment") return createCanyonWallGeometry({ width: 1.2, depth: 0.55, height: 1.1 });
  if (role === "mesa-block") return createCanyonWallGeometry({ width: 2.2, depth: 1.2, height: 1.35 });
  if (role === "slope-skirt") return createSlopeSkirtGeometry();
  if (role === "strata-ribbon") return createStrataRibbonGeometry();
  if (role === "shadow-pocket") return createShadowPocketGeometry();
  if (role === "cover-rock") return createFacetedBoulderGeometry(0.32);
  if (role === "metal-sliver") return createCuboidGeometry(0.032, 0.025, 0.28);
  if (role === "dust-card-anchor") return createDustRidgeGeometry();
  if (role === "gold-seam") return createGoldSeamLodeGeometry();
  if (role === "tailings-pile") return createTailingsFanGeometry();
  if (role === "mine-frame") return createMineFrameGeometry();
  if (role === "support-timber") return createCuboidGeometry(0.1, 0.08, 0.8);
  if (role === "ore-cart") return createTroughGeometry(0.5, 0.28, 0.34);
  if (role === "lantern-post") return createLanternPostGeometry();
  if (role === "warning-sign") return createWarningSignGeometry();
  if (role === "town-frontage") return createTownFrontageGeometry();
  if (role === "water-tower") return createWaterTowerGeometry();
  if (role === "frontage-prop") return createFrontagePropGeometry();
  return createFacetedBoulderGeometry(0.08);
}

function createMicroKitMaterial(materialRole) {
  const baseColor = microKitMaterialColor(materialRole);
  const base = {
    color: baseColor,
    roughness: materialRole === "metal" ? 0.58 : 0.92,
    metalness: materialRole === "metal" ? 0.28 : 0.02,
    flatShading: true,
    side: THREE.DoubleSide,
  };
  if (materialRole === "gold") {
    return new THREE.MeshStandardMaterial({ ...base, emissive: 0x8a5a00, emissiveIntensity: 0.42, roughness: 0.34, metalness: 0.16 });
  }
  if (materialRole === "ore") {
    return new THREE.MeshStandardMaterial({ ...base, emissive: 0x5c3216, emissiveIntensity: 0.24, roughness: 0.62, metalness: 0.08 });
  }
  if (materialRole === "dust") {
    return new THREE.MeshBasicMaterial({ color: baseColor, transparent: true, opacity: 0.26, side: THREE.DoubleSide });
  }
  if (materialRole === "wood" || materialRole === "canvas") {
    return new THREE.MeshStandardMaterial({ ...base, emissive: 0x3a2112, emissiveIntensity: 0.22 });
  }
  return new THREE.MeshStandardMaterial({ ...base, emissive: 0x171108, emissiveIntensity: 0.12 });
}

function microKitMaterialColor(materialRole) {
  const colors = {
    sand: 0xa98245,
    stone: 0x6e694d,
    "red-rock": 0xb45b32,
    "red-rock-dark": 0x71351f,
    "dry-grass": 0xb7a46a,
    scrub: 0x6d7f47,
    cactus: 0x4d7f4b,
    gold: 0xf4be45,
    ore: 0x7d5a38,
    wood: 0x7b4d31,
    canvas: 0xd6bd92,
    metal: 0x8d8b83,
    dust: 0xbf985d,
  };
  return colors[materialRole] ?? 0x92703d;
}

function scaleForMicroKit(kit) {
  if (kit.geometryRole === "dust-ridge") return { x: kit.scale * 2.2, y: kit.scale * 0.18, z: kit.scale * 0.52 };
  if (kit.geometryRole === "trail-rut") return { x: kit.scale * 2.6, y: kit.scale * 0.1, z: kit.scale * 0.32 };
  if (kit.geometryRole === "grass-blade") return { x: kit.scale * 0.65, y: kit.scale * 1.2, z: kit.scale * 0.65 };
  if (kit.geometryRole === "strata-wedge") return { x: kit.scale * 1.8, y: kit.scale * 1.2, z: kit.scale * 0.8 };
  if (kit.geometryRole === "wall-segment") return { x: kit.scale * 2.4, y: kit.scale * 2.2, z: kit.scale * 1.25 };
  if (kit.geometryRole === "mesa-block") return { x: kit.scale * 2.8, y: kit.scale * 2.1, z: kit.scale * 1.6 };
  if (kit.geometryRole === "slope-skirt") return { x: kit.scale * 2.4, y: kit.scale * 0.7, z: kit.scale * 1.6 };
  if (kit.geometryRole === "strata-ribbon") return { x: kit.scale * 1.25, y: kit.scale * 0.12, z: kit.scale * 0.14 };
  if (kit.geometryRole === "shadow-pocket") return { x: kit.scale * 0.82, y: kit.scale * 0.52, z: kit.scale * 0.12 };
  if (kit.geometryRole === "cover-rock") return { x: kit.scale * 1.3, y: kit.scale * 0.95, z: kit.scale * 1.1 };
  if (kit.geometryRole === "gold-fleck") return { x: kit.scale * 0.95, y: kit.scale * 0.78, z: kit.scale * 0.95 };
  if (kit.geometryRole === "ore-chip") return { x: kit.scale * 1.15, y: kit.scale * 0.65, z: kit.scale * 0.88 };
  if (kit.geometryRole === "gold-seam") return { x: kit.scale * 1.95, y: kit.scale * 0.42, z: kit.scale * 0.36 };
  if (kit.geometryRole === "tailings-pile") return { x: kit.scale * 1.62, y: kit.scale * 0.34, z: kit.scale * 1.28 };
  if (kit.geometryRole === "mine-frame") return { x: kit.scale * 1.7, y: kit.scale * 1.45, z: kit.scale * 1.15 };
  if (kit.geometryRole === "support-timber") return { x: kit.scale * 0.7, y: kit.scale * 0.8, z: kit.scale * 1.4 };
  if (kit.geometryRole === "ore-cart") return { x: kit.scale * 1.25, y: kit.scale * 1.0, z: kit.scale * 1.1 };
  if (kit.geometryRole === "lantern-post" || kit.geometryRole === "warning-sign") return { x: kit.scale * 0.95, y: kit.scale * 1.25, z: kit.scale * 0.95 };
  if (kit.geometryRole === "town-frontage") return { x: kit.scale * 0.88, y: kit.scale * 0.9, z: kit.scale * 0.72 };
  if (kit.geometryRole === "water-tower") return { x: kit.scale * 0.92, y: kit.scale * 1.18, z: kit.scale * 0.92 };
  if (kit.geometryRole === "frontage-prop") return { x: kit.scale * 0.58, y: kit.scale * 0.58, z: kit.scale * 0.58 };
  if (kit.geometryRole === "dust-card-anchor") return { x: kit.scale * 2.8, y: kit.scale * 0.12, z: kit.scale * 0.42 };
  return { x: kit.scale, y: kit.scale, z: kit.scale };
}

function terrainGroundHeight(localPlayer, x, z) {
  return Number.isFinite(localPlayer?.renderGround?.height)
    ? localPlayer.renderGround.height
    : Number.isFinite(localPlayer?.ground?.height)
      ? localPlayer.ground.height
    : terrainFieldHeight(x, z);
}

function createDustRidgeGeometry() {
  return createIndexedGeometry([
    -0.5, 0, -0.05,
    0.5, 0, -0.05,
    0.42, 0.035, 0.05,
    -0.42, 0.03, 0.05,
  ], [0, 1, 2, 0, 2, 3]);
}

function createScrubGeometry() {
  const vertices = [
    -0.08, 0, 0, 0.08, 0, 0, 0, 0.34, 0.02,
    0, 0, -0.08, 0, 0, 0.08, 0.02, 0.28, 0,
    -0.06, 0, -0.06, 0.06, 0, 0.06, -0.02, 0.24, 0.02,
  ];
  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return createIndexedGeometry(vertices, indices);
}

function createCanvasScrapGeometry() {
  return createIndexedGeometry([
    -0.18, 0, -0.11,
    0.2, 0, -0.08,
    0.14, 0.02, 0.13,
    -0.16, 0.01, 0.1,
  ], [0, 1, 2, 0, 2, 3]);
}

function createStrataWedgeGeometry() {
  return createIndexedGeometry([
    -0.3, 0, -0.12,
    0.32, 0, -0.14,
    0.22, 0, 0.16,
    -0.34, 0, 0.12,
    -0.2, 0.34, -0.08,
    0.26, 0.24, -0.05,
    0.14, 0.18, 0.1,
  ], [
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 4, 2, 4, 6,
    3, 0, 4,
    4, 5, 6,
    0, 3, 2, 0, 2, 1,
  ]);
}

function createHorizonSkirtGeometry(radius, segments) {
  const vertices = [];
  const indices = [];
  const inner = radius * 0.62;
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    vertices.push(Math.cos(angle) * inner, 0.08, Math.sin(angle) * inner);
    vertices.push(Math.cos(angle) * radius, -0.7, Math.sin(angle) * radius);
  }
  for (let index = 0; index < segments; index += 1) {
    const next = (index + 1) % segments;
    const a = index * 2;
    const b = a + 1;
    const c = next * 2;
    const d = c + 1;
    indices.push(a, b, c, c, b, d);
  }
  return createIndexedGeometry(vertices, indices);
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = context.createRadialGradient(128, 64, 8, 128, 64, 118);
  gradient.addColorStop(0, "rgba(255,255,255,0.72)");
  gradient.addColorStop(0.58, "rgba(244,238,222,0.38)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  [54, 94, 134, 174].forEach((x, index) => {
    context.beginPath();
    context.ellipse(x, 62 + (index % 2) * 8, 42, 22 + index * 2, 0, 0, Math.PI * 2);
    context.fill();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createDesertItem(placement, materials) {
  if (placement.kind === "faceted-rock") return createRockCluster(materials);
  if (placement.kind === "cactus") return createCactusCluster(materials);
  if (placement.kind === "dry-grass") return createDryGrassCluster(materials);
  if (placement.kind === "mine-portal") return createMinePortal(materials);
  if (placement.kind === "rail-track") return createRailTrack(materials);
  if (placement.kind === "mine-cart") return createMineCart(materials);
  if (placement.kind === "barrel") return createBarrel(materials);
  if (placement.kind === "canvas-tent") return createCanvasTent(materials);
  if (placement.kind === "crate") return createCrate(materials);
  if (placement.kind === "campfire") return createCampfire(materials);
  if (placement.kind === "lantern") return createLantern(materials);
  if (placement.kind === "bone-debris") return createBoneDebris(materials);
  return createRockCluster(materials);
}

function createRockCluster(materials) {
  const group = new THREE.Group();
  for (let index = 0; index < 3; index += 1) {
    const mesh = new THREE.Mesh(createFacetedBoulderGeometry(0.28 + index * 0.08), index % 2 ? materials.darkRock : materials.rock);
    mesh.position.set((index - 1) * 0.18, 0.1 + index * 0.02, (index % 2) * 0.16);
    mesh.rotation.set(index * 0.4, index * 0.7, index * 0.2);
    group.add(mesh);
  }
  return group;
}

function createCactusCluster(materials) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(createPrismGeometry(0.14, 0.9, 7), materials.cactus);
  trunk.position.y = 0.45;
  group.add(trunk);
  const left = new THREE.Mesh(createPrismGeometry(0.08, 0.42, 7), materials.cactus);
  left.position.set(-0.19, 0.56, 0);
  left.rotation.z = -0.55;
  group.add(left);
  const right = new THREE.Mesh(createPrismGeometry(0.07, 0.34, 7), materials.cactus);
  right.position.set(0.18, 0.68, 0);
  right.rotation.z = 0.52;
  group.add(right);
  return group;
}

function createDryGrassCluster(materials) {
  const group = new THREE.Group();
  for (let index = 0; index < 5; index += 1) {
    const blade = new THREE.Mesh(createBladeGeometry(0.32 + index * 0.02), materials.grass);
    blade.rotation.y = (index / 5) * Math.PI * 2;
    blade.rotation.z = (index - 2) * 0.16;
    group.add(blade);
  }
  return group;
}

function createMinePortal(materials) {
  const group = new THREE.Group();
  const back = new THREE.Mesh(createFacetedBoulderGeometry(1.1), materials.darkRock);
  back.position.set(0, 0.64, 0.2);
  back.scale.set(1.9, 1.25, 0.62);
  group.add(back);
  const lintel = new THREE.Mesh(createCuboidGeometry(1.2, 0.18, 0.2), materials.wood);
  lintel.position.set(0, 0.95, -0.24);
  group.add(lintel);
  [-0.48, 0.48].forEach((x) => {
    const post = new THREE.Mesh(createCuboidGeometry(0.16, 0.82, 0.18), materials.wood);
    post.position.set(x, 0.42, -0.24);
    group.add(post);
  });
  return group;
}

function createRailTrack(materials) {
  const group = new THREE.Group();
  [-0.18, 0.18].forEach((x) => {
    const rail = new THREE.Mesh(createCuboidGeometry(0.04, 0.04, 1.9), materials.metal);
    rail.position.set(x, 0.06, 0);
    group.add(rail);
  });
  for (let index = 0; index < 7; index += 1) {
    const sleeper = new THREE.Mesh(createCuboidGeometry(0.68, 0.04, 0.08), materials.wood);
    sleeper.position.set(0, 0.035, -0.86 + index * 0.28);
    group.add(sleeper);
  }
  return group;
}

function createMineCart(materials) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(createTroughGeometry(0.64, 0.38, 0.42), materials.metal);
  body.position.y = 0.35;
  group.add(body);
  [-0.22, 0.22].forEach((x) => {
    [-0.18, 0.18].forEach((z) => {
      const wheel = new THREE.Mesh(createPrismGeometry(0.08, 0.05, 8), materials.darkRock);
      wheel.position.set(x, 0.13, z);
      wheel.rotation.x = Math.PI / 2;
      group.add(wheel);
    });
  });
  return group;
}

function createBarrel(materials) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(createPrismGeometry(0.22, 0.46, 10), materials.wood);
  body.position.y = 0.23;
  group.add(body);
  [-0.18, 0.18].forEach((y) => {
    const hoop = new THREE.Mesh(createPrismGeometry(0.225, 0.035, 10), materials.metal);
    hoop.position.y = 0.23 + y;
    group.add(hoop);
  });
  return group;
}

function createCanvasTent(materials) {
  const tent = new THREE.Mesh(createTentGeometry(1.1, 1.3, 1), materials.canvas);
  tent.position.y = 0.5;
  return tent;
}

function createCrate(materials) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(createCuboidGeometry(0.58, 0.44, 0.46), materials.wood));
  const strap = new THREE.Mesh(createCuboidGeometry(0.64, 0.04, 0.06), materials.metal);
  strap.position.y = 0.1;
  group.add(strap);
  group.position.y = 0.24;
  return group;
}

function createCampfire(materials) {
  const group = new THREE.Group();
  for (let index = 0; index < 7; index += 1) {
    const rock = new THREE.Mesh(createFacetedBoulderGeometry(0.09), materials.darkRock);
    const angle = (index / 7) * Math.PI * 2;
    rock.position.set(Math.cos(angle) * 0.26, 0.08, Math.sin(angle) * 0.26);
    group.add(rock);
  }
  const flame = new THREE.Mesh(createCrystalGeometry(0.36), materials.fire);
  flame.position.y = 0.28;
  group.add(flame);
  return group;
}

function createLantern(materials) {
  const group = new THREE.Group();
  const post = new THREE.Mesh(createCuboidGeometry(0.04, 0.52, 0.04), materials.metal);
  post.position.y = 0.26;
  group.add(post);
  const light = new THREE.Mesh(createPrismGeometry(0.12, 0.16, 6), materials.fire);
  light.position.y = 0.57;
  group.add(light);
  return group;
}

function createBoneDebris(materials) {
  const group = new THREE.Group();
  for (let index = 0; index < 3; index += 1) {
    const bone = new THREE.Mesh(createCuboidGeometry(0.38, 0.04, 0.05), materials.bone);
    bone.position.set((index - 1) * 0.12, 0.08, (index % 2) * 0.11);
    bone.rotation.y = index * 0.9;
    group.add(bone);
  }
  return group;
}

function createFacetedBoulderGeometry(size) {
  const vertices = [
    0, size, 0,
    -size * 0.72, size * 0.22, -size * 0.55,
    size * 0.62, size * 0.18, -size * 0.68,
    size * 0.82, size * 0.12, size * 0.36,
    -size * 0.52, size * 0.16, size * 0.72,
    -size * 0.88, -size * 0.28, -size * 0.24,
    size * 0.18, -size * 0.36, -size * 0.82,
    size * 0.9, -size * 0.28, size * 0.06,
    -size * 0.2, -size * 0.3, size * 0.82,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,
    1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3,
    3, 7, 8, 3, 8, 4, 4, 8, 5, 4, 5, 1,
    5, 8, 7, 5, 7, 6,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createPrismGeometry(radius, height, sides) {
  const vertices = [];
  const indices = [];
  for (let yIndex = 0; yIndex < 2; yIndex += 1) {
    const y = yIndex === 0 ? -height / 2 : height / 2;
    for (let side = 0; side < sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2;
      vertices.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    }
  }
  for (let side = 0; side < sides; side += 1) {
    const next = (side + 1) % sides;
    indices.push(side, next, sides + side, next, sides + next, sides + side);
    indices.push(sides + side, sides + next, sides);
    indices.push(side, 0, next);
  }
  return createIndexedGeometry(vertices, indices);
}

function createBladeGeometry(height) {
  return createIndexedGeometry([
    -0.025, 0, 0,
    0.025, 0, 0,
    0.008, height, 0.02,
  ], [0, 1, 2]);
}

function createCuboidGeometry(width, height, depth) {
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const vertices = [
    -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z,
    -x, y, -z, x, y, -z, x, y, z, -x, y, z,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createTroughGeometry(width, height, depth) {
  const x = width / 2;
  const z = depth / 2;
  const vertices = [
    -x, 0, -z, x, 0, -z, x, 0, z, -x, 0, z,
    -x * 0.74, height, -z * 0.78, x * 0.74, height, -z * 0.78,
    x * 0.74, height, z * 0.78, -x * 0.74, height, z * 0.78,
  ];
  const indices = [
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    0, 3, 2, 0, 2, 1,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createTentGeometry(width, depth, height) {
  const x = width / 2;
  const z = depth / 2;
  const vertices = [
    -x, -height / 2, -z,
    x, -height / 2, -z,
    0, height / 2, -z,
    -x, -height / 2, z,
    x, -height / 2, z,
    0, height / 2, z,
  ];
  const indices = [0, 1, 2, 3, 5, 4, 0, 2, 5, 0, 5, 3, 1, 4, 5, 1, 5, 2, 0, 3, 4, 0, 4, 1];
  return createIndexedGeometry(vertices, indices);
}

function mergeBufferGeometries(geometries) {
  const vertices = [];
  const indices = [];
  let vertexOffset = 0;
  geometries.forEach((geometry) => {
    const position = geometry.getAttribute("position");
    for (let index = 0; index < position.count; index += 1) {
      vertices.push(position.getX(index), position.getY(index), position.getZ(index));
    }
    const sourceIndex = geometry.index;
    if (sourceIndex) {
      for (let index = 0; index < sourceIndex.count; index += 1) {
        indices.push(sourceIndex.getX(index) + vertexOffset);
      }
    } else {
      for (let index = 0; index < position.count; index += 1) {
        indices.push(index + vertexOffset);
      }
    }
    vertexOffset += position.count;
  });
  return createIndexedGeometry(vertices, indices);
}

function wrap(min, max, value) {
  const span = max - min;
  if (value > max) return min + ((value - max) % span);
  if (value < min) return max - ((min - value) % span);
  return value;
}

function createPlayerTorsoGeometry() {
  const vertices = [
    -0.28, 0, -0.16,
    0.28, 0, -0.16,
    0.34, 0, 0.18,
    -0.34, 0, 0.18,
    -0.22, 0.72, -0.12,
    0.22, 0.72, -0.12,
    0.26, 0.72, 0.14,
    -0.26, 0.72, 0.14,
    -0.42, 0.48, -0.06,
    0.42, 0.48, -0.06,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0,
    8, 4, 0, 9, 1, 5,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createPlayerHeadGeometry() {
  const width = 0.22;
  const vertices = [
    0, 0.3, 0,
    -width, 0.08, -width,
    width, 0.08, -width,
    width, 0.08, width,
    -width, 0.08, width,
    0, -0.16, 0,
    -width * 1.4, 0.18, -width * 0.9,
    width * 1.4, 0.18, -width * 0.9,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,
    5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4,
    6, 1, 2, 6, 2, 7,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createGoldSatchelGeometry() {
  const vertices = [
    -0.2, 0, -0.12,
    0.2, 0, -0.12,
    0.24, 0, 0.12,
    -0.24, 0, 0.12,
    -0.16, 0.36, -0.1,
    0.16, 0.36, -0.1,
    0.18, 0.36, 0.1,
    -0.18, 0.36, 0.1,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createCargoNuggetGeometry(seed = 0) {
  const radius = 0.045 + (seed % 3) * 0.008;
  const height = 0.05 + (seed % 2) * 0.012;
  const geometry = createPrismGeometry(radius, height, 7);
  geometry.scale(1.25, 0.82 + (seed % 3) * 0.08, 0.92);
  return geometry;
}

function createPickaxeGeometry() {
  const vertices = [
    -0.035, -0.52, 0,
    0.035, -0.52, 0,
    0.035, 0.54, 0,
    -0.035, 0.54, 0,
    -0.34, 0.38, 0,
    0.34, 0.38, 0,
    0, 0.5, 0,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 3,
    6, 5, 2,
  ];
  return createIndexedGeometry(vertices, indices);
}

function createIndexedGeometry(vertices, indices) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function validateTerrainDescriptor(descriptor) {
  return descriptor?.patches?.length >= 4000
    && descriptor.width >= 180
    && descriptor.depth >= 110
    && descriptor.patchColumns > descriptor.patchRows
    && descriptor.tessellationAlgorithm === "single-banded-triangle-terrain-v1"
    && descriptor.tessellationBands?.length === 3
    && descriptor.tessellationBands[0].step < descriptor.tessellationBands[1].step
    && descriptor.tessellationBands[1].step < descriptor.tessellationBands[2].step
    && descriptor.patches.every((patch) => patch.size < 3)
    && descriptor.patches.filter((patch) => patch.lodBand === "near" && patch.vertexGrid >= 24).length >= 250
    && descriptor.patches.every((patch) => patch.strataBands?.includes("dark-shadow-seam"));
}

function validateRouteDescriptor(descriptor) {
  return descriptor?.routePoints?.length >= 24
    && descriptor.combatRidge?.length >= 16
    && Math.abs(descriptor.routePoints[0].x - descriptor.routePoints.at(-1).x) > 35;
}

function validateGoldNodeDescriptor(descriptor) {
  return descriptor?.nodes?.length >= 24
    && new Set(descriptor.nodes.map((node) => `${Math.round(node.x)}:${Math.round(node.z)}`)).size >= 18;
}

function validateNetworkPresenceDescriptor(descriptor) {
  return descriptor?.maxPlayers === 100
    && descriptor.maxVisibleMarkers <= 12
    && descriptor.lanes?.length === 2
    && descriptor.lanes.every((lane) => lane.partitionId && Number.isFinite(lane.x) && Number.isFinite(lane.z));
}

function validateLightingDescriptor(descriptor) {
  return descriptor?.model === "over-the-shoulder-third-person"
    && descriptor.camera.exploration.position[1] <= 4
    && descriptor.camera.combat.position[1] <= 3
    && descriptor.camera.exploration.position[2] < descriptor.camera.exploration.lookAt[2]
    && descriptor.camera.combat.position[2] < descriptor.camera.combat.lookAt[2]
    && descriptor.terrainWidth >= 180;
}

function validateThirdPersonRigDescriptor(descriptor) {
  return descriptor?.id === "goldrush.procScene.thirdPersonPlayerRig"
    && descriptor.anchor?.z < 0
    && descriptor.shoulder?.y > 1
    && descriptor.aimTarget?.z > descriptor.anchor.z
    && descriptor.locomotion?.strideAmplitude > 0
    && descriptor.dependencyStrategy?.futureAssetRuntime === "three-gltf-animation-mixer"
    && ["skull-head", "rib-cage", "bone-arms", "bone-legs", "upper-legs", "knee-joints", "lower-legs", "spawn-pedestal", "hat-brim", "satchel", "cargo-visual-anchor", "carried-gold", "pickaxe"].every((part) => descriptor.visualParts?.includes(part));
}

function validateSkyDescriptor(descriptor) {
  return descriptor?.id === "goldrush.procSky.horizonSkybox"
    && descriptor.radius >= 150
    && descriptor.horizonSkirtRadius >= 120
    && descriptor.horizonSkirtSegments >= 32
    && Number.isFinite(descriptor.colors?.zenith)
    && Number.isFinite(descriptor.colors?.groundBlend);
}

function validateCloudPlaneDescriptor(descriptor) {
  return descriptor?.id === "goldrush.procSky.cloudPlanes"
    && descriptor.count >= 6
    && descriptor.altitude >= 12
    && descriptor.scrollSpeed > 0
    && descriptor.bounds.maxX > descriptor.bounds.minX
    && descriptor.bounds.maxZ > descriptor.bounds.minZ;
}

function validateCanyonCompositionDescriptor(descriptor) {
  return descriptor?.id === "goldrush.procLandmarks.canyonComposition"
    && descriptor.walls?.length >= descriptor.minWallCount
    && descriptor.walls.some((wall) => wall.side < 0)
    && descriptor.walls.some((wall) => wall.side > 0)
    && descriptor.walls.every((wall) => wall.height >= 2.5 && Math.abs(wall.x) > 45 && wall.baseInset <= 0)
    && descriptor.centralMountains?.length >= 3
    && descriptor.centralMountains.every((mountain) => (
      mountain.height >= 6
      && mountain.blockerRadius >= 6
      && mountain.visualHeight <= 4.8
      && mountain.visualHeight < mountain.height
      && mountain.composition === "midground-walkaround-terraced-shoulders"
      && mountain.skyClearance === true
      && mountain.placement === "base-terrain-not-lifted-collider-summit"
      && ["walkaround", "split", "detour"].some((term) => mountain.routeRole?.includes(term))
    ))
    && descriptor.farRidge?.length >= 18
    && descriptor.farRidge.every((ridge) => ridge.height > 0.8 && ridge.width > 3);
}

function validateDesertItemDescriptor(descriptor) {
  const required = ["faceted-rock", "cactus", "dry-grass", "mine-portal", "rail-track", "mine-cart", "canvas-tent", "campfire"];
  const placedKinds = new Set(descriptor?.placements?.map((placement) => placement.kind) ?? []);
  return descriptor?.id === "goldrush.procProps.desertItemLibrary"
    && required.every((kind) => descriptor.baseParts?.includes(kind) && placedKinds.has(kind))
    && descriptor.placements.length >= 80
    && descriptor.reference === "low-poly-desert-gold-rush-items";
}

function validateOpenSourceGlbDescriptor(descriptor) {
  return descriptor?.id === "goldrush.procAssets.openSourceGlbLibrary"
    && descriptor.loader === "three-gltf-loader"
    && descriptor.fallback === "procedural-desert-item-library"
    && descriptor.assets?.length >= 2
    && descriptor.assets.every((asset) => asset.license === "CC0-1.0" && asset.runtimePath.endsWith(".glb"));
}

function descriptorKeyForSpec(id) {
  if (id.includes("patchTessellation")) return "terrain";
  if (id.includes("sharedHeightfieldCollider")) return "terrainCollider";
  if (id.includes("routeRibbon")) return "route";
  if (id.includes("goldNodeScatter")) return "goldNodes";
  if (id.includes("networkPresenceMarkers")) return "networkPresence";
  if (id.includes("thirdPersonPlayerRig")) return "playerRig";
  if (id.includes("horizonSkybox")) return "sky";
  if (id.includes("cloudPlanes")) return "clouds";
  if (id.includes("canyonComposition")) return "canyonComposition";
  if (id.includes("desertItemLibrary")) return "desertItems";
  if (id.includes("microObjectKits")) return "objectMicroKits";
  if (id.includes("environmentSpace")) return "environmentSpace";
  if (id.includes("openSourceGlbLibrary")) return "glbAssets";
  if (id.includes("procWorld")) return "worldElements";
  return "lighting";
}
