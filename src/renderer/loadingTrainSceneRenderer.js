import * as THREE from "three";

export function createLoadingTrainSceneRenderer(root) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 180);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const train = createTrain();
  const player = createSmallProspector(0x253b36);
  const partyGhosts = new THREE.Group();
  const state = {
    kitGroup: "loading-yard-train",
    trainDeparting: false,
    trainPosition: { x: 0, z: -10 },
    boardingRadius: 3.2,
  };

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  root.appendChild(renderer.domElement);

  scene.background = new THREE.Color(0x8eb4bd);
  scene.fog = new THREE.Fog(0x8eb4bd, 38, 115);
  scene.add(new THREE.HemisphereLight(0xfff2d2, 0x5c3b24, 2.2));

  const sun = new THREE.DirectionalLight(0xffdc9a, 3.8);
  sun.position.set(-8, 16, 9);
  sun.castShadow = true;
  scene.add(sun);

  scene.add(createYard());
  scene.add(train);
  scene.add(player);
  scene.add(partyGhosts);

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(360, rect.height || window.innerHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function render({ localPlayer, party, trainDeparting, departureProgress = 0 }) {
    resize();
    state.trainDeparting = trainDeparting;
    const position = localPlayer.position;
    player.position.set(position.x, 0.68, position.z);
    player.rotation.y = localPlayer.heading;
    player.userData.leftLeg.rotation.x = localPlayer.isMoving ? Math.sin(performance.now() / 120) * 0.25 : 0;
    player.userData.rightLeg.rotation.x = localPlayer.isMoving ? -Math.sin(performance.now() / 120) * 0.25 : 0;

    train.position.x = departureProgress * 30;
    train.position.z = -10 - departureProgress * 7;
    state.trainPosition = { x: train.position.x, z: train.position.z };
    syncPartyGhosts(party, position);

    camera.position.set(position.x + 4.4, 4.1, position.z + 8.2);
    camera.lookAt(position.x, 1.2, position.z - 3.8);
    renderer.render(scene, camera);
  }

  function syncPartyGhosts(party, playerPosition) {
    const targetCount = Math.max(0, (party?.members?.length ?? 1) - 1);
    while (partyGhosts.children.length < targetCount) partyGhosts.add(createSmallProspector(0x3f5f58));
    while (partyGhosts.children.length > targetCount) partyGhosts.remove(partyGhosts.children.at(-1));
    partyGhosts.children.forEach((ghost, index) => {
      const offset = index + 1;
      ghost.position.set(playerPosition.x - 1.6 * offset, 0.68, playerPosition.z + 1.2 + index * 0.6);
      ghost.rotation.y = -0.2;
    });
  }

  return {
    render,
    snapshot() {
      return { ...state, mounted: true };
    },
  };
}

export function isNearTrainBoardingZone(position) {
  const nearPlatform = Math.hypot(position.x - 0, position.z - -7.4) <= 3.2;
  const crossedBoardingCorridor = Math.abs(position.x) <= 3.2 && position.z <= -4.2 && position.z >= -12;
  return nearPlatform || crossedBoardingCorridor;
}

function createYard() {
  const group = new THREE.Group();
  const sand = new THREE.MeshStandardMaterial({ color: 0x9f6f2b, roughness: 1 });
  const rail = new THREE.MeshStandardMaterial({ color: 0x2a211a, roughness: 0.72 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x8b8071, roughness: 0.55 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 48, 10, 10), sand);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  [-0.48, 0.48].forEach((x) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 38), metal);
    line.position.set(x, 0.06, -11);
    line.castShadow = true;
    group.add(line);
  });
  Array.from({ length: 18 }, (_, index) => {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.26), rail);
    tie.position.set(0, 0.03, 7 - index * 2.1);
    tie.castShadow = true;
    group.add(tie);
  });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(8, 0.35, 3.4), rail);
  platform.position.set(4.8, 0.17, -5.4);
  platform.castShadow = true;
  platform.receiveShadow = true;
  group.add(platform);

  Array.from({ length: 8 }, (_, index) => {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.75), rail);
    crate.position.set(-8 + index * 2.3, 0.28, 6.5 + (index % 2) * 1.2);
    crate.rotation.y = index * 0.37;
    crate.castShadow = true;
    group.add(crate);
  });

  return group;
}

function createTrain() {
  const group = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x171311, roughness: 0.72 });
  const red = new THREE.MeshStandardMaterial({ color: 0x6b2117, roughness: 0.78 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc48a2d, roughness: 0.48 });

  const engine = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 3.2), red);
  engine.position.set(0, 0.95, -7.5);
  engine.castShadow = true;
  group.add(engine);

  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 2.7, 24), dark);
  boiler.rotation.x = Math.PI / 2;
  boiler.position.set(0, 1.35, -9.5);
  boiler.castShadow = true;
  group.add(boiler);

  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.72, 18), dark);
  stack.position.set(0, 2.05, -10.2);
  stack.castShadow = true;
  group.add(stack);

  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.42, 0.2), brass);
  lamp.position.set(0, 1.45, -11.05);
  lamp.castShadow = true;
  group.add(lamp);

  [-0.72, 0.72].forEach((x) => {
    [-6.4, -8.6, -11].forEach((z) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 24), dark);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.42, z);
      wheel.castShadow = true;
      group.add(wheel);
    });
  });

  const car = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.15, 3.6), new THREE.MeshStandardMaterial({ color: 0x7b5122, roughness: 0.86 }));
  car.position.set(0, 0.92, -3.7);
  car.castShadow = true;
  group.add(car);
  return group;
}

function createSmallProspector(color) {
  const group = new THREE.Group();
  const bone = new THREE.MeshStandardMaterial({ color: 0xe5d7af, roughness: 0.82 });
  const coat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  const hat = new THREE.MeshStandardMaterial({ color: 0xb8873d, roughness: 0.72 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.78, 0.34), coat);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), bone);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 20), hat);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.22, 16), hat);
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.54, 0.14), bone);
  const rightLeg = leftLeg.clone();
  body.position.y = 0.9;
  head.position.y = 1.42;
  brim.position.y = 1.64;
  crown.position.y = 1.78;
  leftLeg.position.set(-0.16, 0.25, 0);
  rightLeg.position.set(0.16, 0.25, 0);
  [body, head, brim, crown, leftLeg, rightLeg].forEach((mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });
  group.userData.leftLeg = leftLeg;
  group.userData.rightLeg = rightLeg;
  return group;
}
