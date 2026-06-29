import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createGoldRushWorldElements, validateGoldRushWorldElements } from "../content/goldrushWorldElements.js";
import { createGoldRushObjectMicroKits, validateGoldRushObjectMicroKits } from "../content/goldrushObjectMicroKits.js";
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
      scene.background = new THREE.Color(pressure > 0.6 ? 0x8c6d56 : pressure > 0 ? 0x8da39a : 0x6f9eaa);
      scene.fog.color = new THREE.Color(pressure > 0.6 ? 0x9b7958 : pressure > 0 ? 0xa5a071 : 0x7c9386);
    },
    getCamera() {
      return lightingKit.camera;
    },
  };
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
    visualParts: ["hat-brim", "hat-crown", "skull-head", "rib-cage", "bone-arms", "bone-legs", "belt", "boots", "satchel", "pickaxe", "spawn-pedestal"],
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
  return CENTRAL_MOUNTAIN_FORMS.map((form) => ({ ...form }));
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
      roughness: 0.98,
      flatShading: true,
      emissive: 0x1d0b05,
      emissiveIntensity: 0.1,
    });
    const mesh = new THREE.Mesh(createCanyonWallGeometry(mountain), material);
    mesh.name = mountain.id;
    mesh.position.set(mountain.x, terrainFieldHeight(mountain.x, mountain.z) + mountain.height * 0.28 - 0.9, mountain.z);
    mesh.rotation.y = -0.34 + index * 0.27;
    mesh.scale.set(1.18, 1, 1.18);
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
    })
  );
  mesh.name = `${descriptor.id}.continuousField`;
  group.add(mesh);
  scene.add(group);
  return group;
}

function mountMicroObjectKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const buckets = new Map();

  descriptor.kits.forEach((kit) => {
    const key = `${kit.geometryRole}:${kit.materialRole}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(kit);
  });

  const dummy = new THREE.Object3D();
  const animated = [];
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
    group.add(mesh);
  }

  scene.add(group);

  return {
    update(_state, elapsedSeconds = 0) {
      animated.forEach((mesh, bucketIndex) => {
        mesh.rotation.y = Math.sin(elapsedSeconds * 0.08 + bucketIndex) * 0.008;
      });
    },
  };
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

  const mountainMaterial = new THREE.MeshStandardMaterial({ color: 0x5d5640, roughness: 0.98, flatShading: true });
  descriptor.mountainRanges.forEach((mountain) => {
    const mesh = new THREE.Mesh(createRidgeGeometry(mountain, scale), mountainMaterial);
    mesh.position.set(mountain.position.x * scale, 0.5, mountain.position.z * scale);
    mesh.userData.elementId = mountain.id;
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

function mountThirdPersonPlayerKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  group.position.set(descriptor.anchor.x, descriptor.anchor.y, descriptor.anchor.z);

  const coat = new THREE.MeshStandardMaterial({ color: 0x263a36, roughness: 0.78, flatShading: true });
  const hat = new THREE.MeshStandardMaterial({ color: 0xb8873d, roughness: 0.82, flatShading: true });
  const bone = new THREE.MeshStandardMaterial({ color: 0xe1d0a8, emissive: 0x1f1606, roughness: 0.72, flatShading: true });
  const gear = new THREE.MeshStandardMaterial({ color: 0xd0a34a, emissive: 0x3d2900, roughness: 0.62, flatShading: true });
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
  group.add(pack);

  const leftArm = new THREE.Mesh(createCuboidGeometry(0.07, 0.5, 0.07), bone);
  leftArm.position.set(-0.36, 0.83, 0.02);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(createCuboidGeometry(0.07, 0.5, 0.07), bone);
  rightArm.position.set(0.36, 0.83, 0.02);
  group.add(rightArm);

  const leftLeg = new THREE.Mesh(createCuboidGeometry(0.08, 0.52, 0.08), bone);
  leftLeg.position.set(-0.12, 0.28, 0.02);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(createCuboidGeometry(0.08, 0.52, 0.08), bone);
  rightLeg.position.set(0.12, 0.28, 0.02);
  group.add(rightLeg);

  const leftBoot = new THREE.Mesh(createCuboidGeometry(0.18, 0.12, 0.25), darkLeather);
  leftBoot.position.set(-0.12, 0.04, -0.04);
  group.add(leftBoot);

  const rightBoot = new THREE.Mesh(createCuboidGeometry(0.18, 0.12, 0.25), darkLeather);
  rightBoot.position.set(0.12, 0.04, -0.04);
  group.add(rightBoot);

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
        + descriptor.anchor.y
        + Math.abs(Math.sin(walkPhase)) * (combat ? 0.015 : 0.045) * (isMoving ? 1 : 0.45);
      torso.rotation.z = combat ? aimSway * 0.5 : 0;
      head.rotation.y = combat ? aimSway : Math.sin(elapsedSeconds * 0.8) * (isMoving ? 0.05 : 0.08);
      leftArm.rotation.x = combat ? -0.2 : stride;
      rightArm.rotation.x = combat ? -0.78 + aimSway : -stride;
      leftLeg.rotation.x = combat ? 0.05 : -stride * 0.72;
      rightLeg.rotation.x = combat ? -0.05 : stride * 0.72;
      leftBoot.rotation.x = leftLeg.rotation.x * 0.45;
      rightBoot.rotation.x = rightLeg.rotation.x * 0.45;
      pick.rotation.x = combat ? -0.9 + aimSway : -0.25 - stride * 0.22;
      pick.rotation.z = combat ? -0.72 : -0.38;
      pack.scale.setScalar(1 + Math.min(0.22, ((state.cargo?.["player-1"] ?? 0) / 250) * 0.22));
    },
  };
}

function mountLightingCameraKit(scene, descriptor, root) {
  const camera = new THREE.PerspectiveCamera(descriptor.camera.exploration.fov, 1, 0.1, 260);
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
        camera.lookAt(shoulderTarget.add(lookAhead));
      } else {
        camera.position.fromArray(preset.position);
        camera.lookAt(...preset.lookAt);
      }
      const rect = root.getBoundingClientRect();
      camera.aspect = Math.max(320, rect.width) / Math.max(360, rect.height || window.innerHeight);
      camera.updateProjectionMatrix();
    },
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

function createBandedTriangleTerrainGeometry(descriptor) {
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
        pushTerrainCell(vertices, colors, indices, color, x, z, x1, z1, bandIndex);
      }
    }
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

function pushTerrainCell(vertices, colors, indices, color, x0, z0, x1, z1, bandIndex) {
  const base = vertices.length / 3;
  const centerX = (x0 + x1) / 2;
  const centerZ = (z0 + z1) / 2;
  const bandYOffset = bandIndex * 0.012;
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
    color.set(terrainFieldColor(x, z));
    const bandShade = 1 - bandIndex * 0.035;
    colors.push(color.r * bandShade, color.g * bandShade, color.b * bandShade);
  });
  indices.push(
    base, base + 1, base + 4,
    base + 1, base + 2, base + 4,
    base + 2, base + 3, base + 4,
    base + 3, base, base + 4
  );
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
  if (role === "gold-fleck") return createCrystalGeometry(0.12);
  if (role === "ore-chip") return createFacetedBoulderGeometry(0.12);
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
  if (role === "gold-seam") return createGoldSeamGeometry();
  if (role === "tailings-pile") return createFacetedBoulderGeometry(0.18);
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
    return new THREE.MeshStandardMaterial({ ...base, emissive: 0x5a3a00, roughness: 0.45 });
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
    ore: 0x51493d,
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
  if (kit.geometryRole === "gold-seam") return { x: kit.scale * 1.8, y: kit.scale * 0.32, z: kit.scale * 0.28 };
  if (kit.geometryRole === "tailings-pile") return { x: kit.scale * 1.45, y: kit.scale * 0.55, z: kit.scale * 1.1 };
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
  return Number.isFinite(localPlayer?.ground?.height)
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
    && ["skull-head", "rib-cage", "bone-arms", "bone-legs", "spawn-pedestal", "hat-brim", "satchel", "pickaxe"].every((part) => descriptor.visualParts?.includes(part));
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
      mountain.height >= 10
      && mountain.blockerRadius >= 8
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
