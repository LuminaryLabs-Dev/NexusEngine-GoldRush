import * as THREE from "three";
import { createGoldRushWorldElements, validateGoldRushWorldElements } from "../content/goldrushWorldElements.js";

export const proceduralRendererKitSpecs = [
  {
    id: "goldrush.procTerrain.patchTessellation",
    purpose: "Massive rectangular terrain made from many small tessellated patches.",
    validate: validateTerrainDescriptor,
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
    id: "goldrush.procTerrain.shardPlayerMarkers",
    purpose: "2-100 player shard markers laid out as field teams, not circles.",
    validate: validateShardMarkerDescriptor,
  },
  {
    id: "goldrush.procScene.lightingCamera",
    purpose: "Scene lighting and camera presets for exploration and combat.",
    validate: validateLightingDescriptor,
  },
  {
    id: "goldrush.procWorld.elements",
    purpose: "Procedural towns, mountains, landmarks, paths, gold zones, and loading gates.",
    validate: (descriptor) => validateGoldRushWorldElements(descriptor).passed,
  },
];

export function createGoldRushProceduralScene() {
  const terrain = createTerrainDescriptor();
  const route = createRouteDescriptor(terrain);
  const goldNodes = createGoldNodeDescriptor(terrain);
  const shardMarkers = createShardMarkerDescriptor(terrain);
  const lighting = createLightingDescriptor(terrain);
  const worldElements = createGoldRushWorldElements();

  return {
    terrain,
    route,
    goldNodes,
    shardMarkers,
    lighting,
    worldElements,
    validate() {
      return validateProceduralRendererKits({ terrain, route, goldNodes, shardMarkers, lighting, worldElements });
    },
  };
}

export function mountGoldRushProceduralScene({ scene, root }) {
  const descriptors = createGoldRushProceduralScene();
  const validation = descriptors.validate();
  if (!validation.passed) {
    throw new Error(`procedural renderer kit validation failed: ${validation.failures.join("; ")}`);
  }

  scene.background = new THREE.Color(0x121819);
  scene.fog = new THREE.Fog(0x121819, 34, 92);

  const terrainGroup = mountTerrainKit(scene, descriptors.terrain);
  const routeGroup = mountRouteKit(scene, descriptors.route);
  const goldGroup = mountGoldNodeKit(scene, descriptors.goldNodes);
  const worldElementKit = mountWorldElementKit(scene, descriptors.worldElements);
  const playerMarkerKit = mountShardMarkerKit(scene, descriptors.shardMarkers);
  const lightingKit = mountLightingCameraKit(scene, descriptors.lighting, root);

  return {
    descriptors,
    validation,
    update(state) {
      worldElementKit.update(state);
      playerMarkerKit.update(state);
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
      scene.background = new THREE.Color(pressure > 0.6 ? 0x1d1713 : pressure > 0 ? 0x181816 : 0x121819);
      scene.fog.color = new THREE.Color(pressure > 0.6 ? 0x2b2118 : pressure > 0 ? 0x1e201a : 0x121819);
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
  const patchColumns = 22;
  const patchRows = 14;
  const patchSize = 2.35;
  const width = patchColumns * patchSize;
  const depth = patchRows * patchSize;
  const patches = [];

  for (let row = 0; row < patchRows; row += 1) {
    for (let column = 0; column < patchColumns; column += 1) {
      const x = (column - patchColumns / 2 + 0.5) * patchSize;
      const z = (row - patchRows / 2 + 0.5) * patchSize;
      const ridge = Math.sin(column * 0.9) * 0.18 + Math.cos(row * 0.65) * 0.14;
      const biomeSeed = (column * 17 + row * 31) % 7;
      patches.push({
        id: `terrain-patch-${row + 1}-${column + 1}`,
        column,
        row,
        x,
        z,
        size: patchSize,
        elevation: Number(ridge.toFixed(3)),
        biome: biomeSeed < 2 ? "dry-wash" : biomeSeed < 5 ? "scrub" : "ridge",
        color: biomeSeed < 2 ? 0x866538 : biomeSeed < 5 ? 0x9b7a45 : 0x6f7246,
      });
    }
  }

  return {
    id: "goldrush.procTerrain.patchTessellation",
    patchColumns,
    patchRows,
    patchSize,
    width,
    depth,
    patches,
    bounds: {
      minX: -width / 2,
      maxX: width / 2,
      minZ: -depth / 2,
      maxZ: depth / 2,
    },
  };
}

function createRouteDescriptor(terrain) {
  const routePoints = Array.from({ length: 34 }, (_, index) => {
    const t = index / 33;
    const x = terrain.bounds.minX + terrain.width * t;
    const z = Math.sin(t * Math.PI * 2.4) * 5.2 + (t - 0.5) * terrain.depth * 0.42;
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

function createShardMarkerDescriptor(terrain) {
  const lanes = [
    { shardId: "shard-1", x: terrain.bounds.minX + 6.5, z: terrain.bounds.minZ + 4.2, color: 0xf5b544 },
    { shardId: "shard-2", x: terrain.bounds.maxX - 10.5, z: terrain.bounds.maxZ - 7.6, color: 0x74d0c2 },
  ];
  return {
    id: "goldrush.procTerrain.shardPlayerMarkers",
    maxPlayers: 100,
    lanes,
    spacing: 0.62,
  };
}

function createLightingDescriptor(terrain) {
  return {
    id: "goldrush.procScene.lightingCamera",
    camera: {
      exploration: { position: [0, 24, 35], lookAt: [0, 0, 1], fov: 46 },
      combat: { position: [12, 10, 13], lookAt: [6, 0, 2], fov: 42 },
    },
    lightRig: {
      key: { color: 0xffdf9e, intensity: 2.3, position: [16, 22, 11] },
      fill: { color: 0x8fc4bf, intensity: 0.68 },
    },
    terrainWidth: terrain.width,
  };
}

function mountTerrainKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  descriptor.patches.forEach((patch) => {
    const mesh = new THREE.Mesh(
      createPatchGeometry(patch, 3),
      new THREE.MeshStandardMaterial({
        color: patch.color,
        roughness: 0.96,
        metalness: 0.02,
        flatShading: true,
      })
    );
    mesh.position.set(patch.x, patch.elevation, patch.z);
    mesh.userData.patchId = patch.id;
    group.add(mesh);
  });
  scene.add(group);
  return group;
}

function mountRouteKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
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

function mountShardMarkerKit(scene, descriptor) {
  const group = new THREE.Group();
  group.name = descriptor.id;
  const markerGeometry = createMarkerGeometry();
  const markers = Array.from({ length: descriptor.maxPlayers }, (_, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: index < 50 ? descriptor.lanes[0].color : descriptor.lanes[1].color,
      emissive: index < 50 ? 0x3b2200 : 0x073533,
      roughness: 0.62,
    });
    const mesh = new THREE.Mesh(markerGeometry, material);
    mesh.visible = false;
    group.add(mesh);
    return mesh;
  });
  scene.add(group);

  return {
    update(state) {
      const activePlayers = state.players;
      markers.forEach((marker, index) => {
        marker.visible = index < activePlayers;
        const lane = index < 50 ? descriptor.lanes[0] : descriptor.lanes[1];
        const laneIndex = index < 50 ? index : index - 50;
        const column = laneIndex % 10;
        const row = Math.floor(laneIndex / 10);
        marker.position.set(lane.x + column * descriptor.spacing, 0.46, lane.z + row * descriptor.spacing);
        marker.rotation.y = state.cameraMode === "combat" ? 0.7 : 0.15;
        marker.scale.setScalar(state.cameraMode === "combat" && index < 8 ? 1.55 : 1);
      });
    },
  };
}

function mountLightingCameraKit(scene, descriptor, root) {
  const camera = new THREE.PerspectiveCamera(descriptor.camera.exploration.fov, 1, 0.1, 180);
  const key = new THREE.DirectionalLight(descriptor.lightRig.key.color, descriptor.lightRig.key.intensity);
  key.position.fromArray(descriptor.lightRig.key.position);
  scene.add(key);
  scene.add(new THREE.AmbientLight(descriptor.lightRig.fill.color, descriptor.lightRig.fill.intensity));

  return {
    camera,
    update(state) {
      const preset = state.cameraMode === "combat" ? descriptor.camera.combat : descriptor.camera.exploration;
      camera.fov = preset.fov;
      camera.position.fromArray(preset.position);
      camera.lookAt(...preset.lookAt);
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

function createIndexedGeometry(vertices, indices) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function validateTerrainDescriptor(descriptor) {
  return descriptor?.patches?.length >= 250
    && descriptor.width >= 48
    && descriptor.depth >= 30
    && descriptor.patchColumns > descriptor.patchRows
    && descriptor.patches.every((patch) => patch.size < 3);
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

function validateShardMarkerDescriptor(descriptor) {
  return descriptor?.maxPlayers === 100
    && descriptor.lanes?.length === 2
    && descriptor.lanes.every((lane) => lane.shardId && Number.isFinite(lane.x) && Number.isFinite(lane.z));
}

function validateLightingDescriptor(descriptor) {
  return descriptor?.camera?.exploration?.position?.[1] >= 20
    && descriptor.camera.combat.position[1] >= 8
    && descriptor.terrainWidth >= 48;
}

function descriptorKeyForSpec(id) {
  if (id.includes("patchTessellation")) return "terrain";
  if (id.includes("routeRibbon")) return "route";
  if (id.includes("goldNodeScatter")) return "goldNodes";
  if (id.includes("shardPlayerMarkers")) return "shardMarkers";
  if (id.includes("procWorld")) return "worldElements";
  return "lighting";
}
