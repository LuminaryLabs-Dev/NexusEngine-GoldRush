import * as THREE from "three";
import { createGoldRushWorldElements } from "../../content/goldrushWorldElements.js";

const materials = {
  ground: () => new THREE.MeshStandardMaterial({ color: 0xc89a61, roughness: 0.96, metalness: 0.02 }),
  mountain: () => new THREE.MeshStandardMaterial({ color: 0x87563e, roughness: 1 }),
  town: () => new THREE.MeshStandardMaterial({ color: 0x8d6a4e, roughness: 0.9 }),
  roof: () => new THREE.MeshStandardMaterial({ color: 0x5e493b, roughness: 0.95 }),
  landmark: () => new THREE.MeshStandardMaterial({ color: 0x6f6255, roughness: 0.85 }),
  gold: () => new THREE.MeshStandardMaterial({ color: 0xd6ad49, roughness: 0.48, metalness: 0.35, transparent: true, opacity: 0.72 }),
  route: () => new THREE.LineBasicMaterial({ color: 0xf0d2a1 }),
};

export function createGoldRushWorldPreviewScene({ phase = "prospect" } = {}) {
  const world = createGoldRushWorldElements({ phase });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd8b98a);
  scene.fog = new THREE.FogExp2(0xd8b98a, 0.00012);

  const hemisphere = new THREE.HemisphereLight(0xf6deb3, 0x5e4936, 2.1);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xffe1ad, 3.2);
  sun.position.set(-1800, 2600, 900);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(world.scale.widthMeters, world.scale.depthMeters, 1, 1),
    materials.ground(),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -6;
  scene.add(ground);

  addMountains(scene, world);
  addRoutes(scene, world);
  addGoldZones(scene, world);
  addTowns(scene, world);
  addLandmarks(scene, world);

  return {
    scene,
    world,
    snapshot() {
      return {
        contract: "goldrush-dev-world-preview-v1",
        phase,
        source: world.source,
        scale: world.scale,
        counts: {
          mountains: world.mountainRanges.length,
          towns: world.towns.length,
          landmarks: world.landmarks.length,
          goldZones: world.goldZones.length,
          paths: world.paths.length,
        },
      };
    },
  };
}

function addMountains(scene, world) {
  const material = materials.mountain();
  for (const range of world.mountainRanges) {
    const geometry = new THREE.BoxGeometry(range.footprint.width, range.height, range.footprint.depth, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(range.position.x, range.height / 2 - 4, range.position.z);
    mesh.rotation.y = range.role === "horizon-blocker" ? -0.08 : range.position.x < 0 ? 0.12 : -0.14;
    mesh.name = range.id;
    scene.add(mesh);
  }
}

function addRoutes(scene, world) {
  const material = materials.route();
  for (const path of world.paths) {
    const points = path.points.map((point) => new THREE.Vector3(point.x, 5, point.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.name = path.id;
    scene.add(line);
  }
}

function addGoldZones(scene, world) {
  const material = materials.gold();
  for (const zone of world.goldZones) {
    const geometry = new THREE.RingGeometry(zone.radius * 0.7, zone.radius, 48);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(zone.position.x, 7, zone.position.z);
    mesh.name = zone.id;
    scene.add(mesh);
  }
}

function addTowns(scene, world) {
  const wallMaterial = materials.town();
  const roofMaterial = materials.roof();
  for (const town of world.towns) {
    const columns = 3;
    const rows = Math.ceil(town.buildings.length / columns);
    const spacingX = town.footprint.width / columns;
    const spacingZ = town.footprint.depth / Math.max(1, rows);
    town.buildings.forEach((building, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const width = spacingX * 0.52;
      const depth = spacingZ * 0.54;
      const height = 42 + (index % 3) * 14;
      const x = town.position.x + (column - 1) * spacingX * 0.78;
      const z = town.position.z + (row - (rows - 1) / 2) * spacingZ * 0.75;
      const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMaterial);
      wall.position.set(x, height / 2, z);
      wall.name = `${town.id}.${building}`;
      scene.add(wall);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.55, 20, 4), roofMaterial);
      roof.position.set(x, height + 8, z);
      roof.rotation.y = Math.PI / 4;
      scene.add(roof);
    });
  }
}

function addLandmarks(scene, world) {
  const material = materials.landmark();
  for (const landmark of world.landmarks) {
    const geometry = landmark.id.includes("bridge")
      ? new THREE.BoxGeometry(300, landmark.height, 48)
      : new THREE.CylinderGeometry(18, 28, landmark.height, 8);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(landmark.position.x, landmark.height / 2, landmark.position.z);
    mesh.name = landmark.id;
    scene.add(mesh);
  }
}
