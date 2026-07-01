import * as THREE from "three";

export function createLoadingTrainSceneRenderer(root) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 180);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const train = createTrain();
  const trainPathKit = createTrainPathKit();
  const player = createSmallProspector(0x253b36);
  const partyGhosts = new THREE.Group();
  const boardingCue = createBoardingCue();
  const trainBoardingTarget = new THREE.Vector3();
  const boardingCueTarget = new THREE.Vector3();
  const state = {
    kitGroup: "loading-yard-train",
    domainPath: "n:goldrush:train-loading",
    cueContract: "goldrush-train-boarding-cue-v1",
    loadingPhase: "approaching",
    trainDeparting: false,
    trainPosition: { x: 0, z: -50 },
    trainPath: trainPathKit.snapshot(),
    doorOpen: false,
    playerLockedToTrain: false,
    boardingRadius: 3.2,
    boardingCue: {
      contract: "goldrush-train-boarding-cue-v1",
      visible: false,
      status: "waiting-for-train",
      anchor: { x: 0, z: -7.4 },
    },
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
  train.add(boardingCue);
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

  function render({
    localPlayer,
    party,
    trainDeparting = false,
    loadingPhase = "approaching",
    approachProgress = 0,
    doorProgress = 0,
    departureProgress = 0,
    playerLockedToTrain = false,
    trainReadout = null,
  }) {
    resize();
    const pathSample = trainPathKit.sample(trainDeparting ? "departure" : "approach", trainDeparting ? departureProgress : approachProgress);
    train.position.set(pathSample.position.x, 0, pathSample.position.z);
    train.rotation.y = pathSample.yaw;
    animateTrainDoor(train, doorProgress);
    updateBoardingCue(boardingCue, {
      doorProgress,
      playerLockedToTrain,
      trainReadout,
      elapsedSeconds: performance.now() / 1000,
    });
    train.updateMatrixWorld(true);

    train.userData.boardingAnchor.getWorldPosition(boardingCueTarget);
    state.trainDeparting = trainDeparting;
    state.loadingPhase = loadingPhase;
    state.trainPosition = { x: Number(train.position.x.toFixed(2)), z: Number(train.position.z.toFixed(2)) };
    state.doorOpen = doorProgress >= 0.92;
    state.playerLockedToTrain = playerLockedToTrain;
    state.approachProgress = Number(approachProgress.toFixed(3));
    state.doorProgress = Number(doorProgress.toFixed(3));
    state.departureProgress = Number(departureProgress.toFixed(3));
    state.boardingCue = {
      contract: "goldrush-train-boarding-cue-v1",
      visible: boardingCue.visible,
      status: boardingCue.userData.status,
      anchor: {
        x: Number(boardingCueTarget.x.toFixed(2)),
        z: Number(boardingCueTarget.z.toFixed(2)),
      },
      nextPlayerAction: trainReadout?.nextPlayerAction ?? null,
      cameraDirective: trainReadout?.cameraDirective ?? null,
    };

    const position = playerLockedToTrain
      ? train.userData.boardingAnchor.getWorldPosition(trainBoardingTarget)
      : localPlayer.position;
    player.position.set(position.x, 0.68, position.z);
    player.rotation.y = playerLockedToTrain ? train.rotation.y : localPlayer.heading;
    player.userData.leftLeg.rotation.x = localPlayer.isMoving ? Math.sin(performance.now() / 120) * 0.25 : 0;
    player.userData.rightLeg.rotation.x = localPlayer.isMoving ? -Math.sin(performance.now() / 120) * 0.25 : 0;

    syncPartyGhosts(party, position);

    if (playerLockedToTrain || trainDeparting) {
      const tangent = pathSample.tangent;
      const side = { x: tangent.z, z: -tangent.x };
      camera.position.set(
        position.x - tangent.x * 9 + side.x * 3.4,
        4.2,
        position.z - tangent.z * 9 + side.z * 3.4
      );
      camera.lookAt(position.x + tangent.x * 5, 1.45, position.z + tangent.z * 5);
    } else {
      const yaw = localPlayer.look?.yaw ?? Math.PI;
      const pitch = localPlayer.look?.pitch ?? -0.08;
      const forward = { x: Math.sin(yaw), z: Math.cos(yaw) };
      const side = { x: Math.cos(yaw), z: -Math.sin(yaw) };
      camera.position.set(
        position.x - forward.x * 6.4 + side.x * 2.2,
        3.45,
        position.z - forward.z * 6.4 + side.z * 2.2
      );
      camera.lookAt(position.x + forward.x * 5, 1.35 + pitch * 3.2, position.z + forward.z * 5);
    }
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
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 96), metal);
    line.position.set(x, 0.06, -8);
    line.castShadow = true;
    group.add(line);
  });
  Array.from({ length: 44 }, (_, index) => {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.26), rail);
    tie.position.set(0, 0.03, 34 - index * 2.1);
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

  const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.7), new THREE.MeshStandardMaterial({ color: 0x2f2118, roughness: 0.82 }));
  door.position.set(-1.14, 0.98, -3.72);
  door.castShadow = true;
  group.add(door);

  const boardingAnchor = new THREE.Object3D();
  boardingAnchor.name = "goldrush.train.boardingAnchor";
  boardingAnchor.position.set(-1.68, 0.68, -3.72);
  group.add(boardingAnchor);

  group.userData.door = door;
  group.userData.doorClosed = door.position.clone();
  group.userData.boardingAnchor = boardingAnchor;
  return group;
}

function createBoardingCue() {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1c24f,
    emissive: 0x8a5a10,
    emissiveIntensity: 0.45,
    roughness: 0.48,
    transparent: true,
    opacity: 0.86,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.035, 8, 40), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.45, 10), ringMaterial);
  post.position.y = 0.78;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 4), ringMaterial);
  cap.position.y = 1.62;
  cap.rotation.y = Math.PI / 4;
  group.add(ring, post, cap);
  group.position.set(-1.68, 0, -3.72);
  group.userData.status = "waiting-for-door";
  group.visible = false;
  return group;
}

function updateBoardingCue(cue, {
  doorProgress = 0,
  playerLockedToTrain = false,
  trainReadout = null,
  elapsedSeconds = 0,
} = {}) {
  const visible = Boolean(trainReadout?.boardingCueVisible ?? (doorProgress >= 0.25 && !playerLockedToTrain));
  cue.visible = visible;
  cue.userData.status = playerLockedToTrain
    ? "riding-train"
    : doorProgress >= 0.92
      ? "board-now"
      : doorProgress > 0
        ? "door-opening"
        : "waiting-for-door";
  const pulse = visible ? 1 + Math.sin(elapsedSeconds * 5.8) * 0.08 : 1;
  cue.scale.setScalar(pulse);
  cue.children.forEach((child) => {
    if (child.material) {
      child.material.opacity = cue.userData.status === "board-now" ? 0.94 : 0.62;
      child.material.emissiveIntensity = cue.userData.status === "board-now" ? 0.78 : 0.32;
    }
  });
}

function animateTrainDoor(train, progress = 0) {
  const door = train.userData.door;
  const closed = train.userData.doorClosed;
  if (!door || !closed) return;
  const t = smoothstep(clamp01(progress));
  door.position.set(closed.x, closed.y, closed.z + t * 0.86);
  door.rotation.y = -t * 0.72;
}

function createTrainPathKit() {
  const approach = [
    { x: 0, z: -50 },
    { x: 0, z: -38 },
    { x: 0, z: -22 },
    { x: 0, z: -9.1 },
  ];
  const departure = [
    { x: 0, z: -9.1 },
    { x: 0, z: 3 },
    { x: 0, z: 22 },
    { x: 0, z: 45 },
  ];

  function sample(phase, progress) {
    const points = phase === "departure" ? departure : approach;
    const t = smoothstep(clamp01(progress));
    const position = sampleCubicBezier(points, t);
    const tangent = sampleCubicBezierTangent(points, t);
    return {
      position,
      tangent,
      yaw: Math.atan2(tangent.x, tangent.z) + Math.PI,
    };
  }

  return {
    sample,
    snapshot() {
      return {
        id: "n:scene:bezier-train-path",
        approach,
        departure,
        orientation: "tangent-following",
      };
    },
  };
}

function sampleCubicBezier(points, t) {
  const a = (1 - t) ** 3;
  const b = 3 * (1 - t) ** 2 * t;
  const c = 3 * (1 - t) * t ** 2;
  const d = t ** 3;
  return {
    x: points[0].x * a + points[1].x * b + points[2].x * c + points[3].x * d,
    z: points[0].z * a + points[1].z * b + points[2].z * c + points[3].z * d,
  };
}

function sampleCubicBezierTangent(points, t) {
  const a = 3 * (1 - t) ** 2;
  const b = 6 * (1 - t) * t;
  const c = 3 * t ** 2;
  const x = (points[1].x - points[0].x) * a
    + (points[2].x - points[1].x) * b
    + (points[3].x - points[2].x) * c;
  const z = (points[1].z - points[0].z) * a
    + (points[2].z - points[1].z) * b
    + (points[3].z - points[2].z) * c;
  const length = Math.hypot(x, z) || 1;
  return { x: x / length, z: z / length };
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
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
