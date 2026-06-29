import * as THREE from "three";

export function createLobbyCharacterRenderer(root) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const character = createSkeletonProspector();
  const floor = createPedestal();
  const state = {
    rotationY: -0.22,
    isDragging: false,
    kitGroup: "three-lobby-character",
  };
  let lastX = 0;
  let started = false;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "lobbyCharacterCanvasElement";
  root.appendChild(renderer.domElement);

  scene.add(character);
  scene.add(floor);
  scene.add(new THREE.HemisphereLight(0xd7efff, 0x5b3a1f, 2.3));

  const key = new THREE.DirectionalLight(0xffdf9a, 3.4);
  key.position.set(-4, 6, 5);
  key.castShadow = true;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x74d0c2, 1.6);
  rim.position.set(4, 3, -5);
  scene.add(rim);

  camera.position.set(0, 2.25, 7.2);
  camera.lookAt(0, 1.35, 0);

  renderer.domElement.addEventListener("pointerdown", (event) => {
    state.isDragging = true;
    lastX = event.clientX;
    renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    if (!state.isDragging) return;
    const dx = event.clientX - lastX;
    lastX = event.clientX;
    state.rotationY += dx * 0.012;
  });
  renderer.domElement.addEventListener("pointerup", (event) => {
    state.isDragging = false;
    if (renderer.domElement.hasPointerCapture(event.pointerId)) {
      renderer.domElement.releasePointerCapture(event.pointerId);
    }
  });
  renderer.domElement.addEventListener("pointercancel", () => {
    state.isDragging = false;
  });

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(260, rect.width);
    const height = Math.max(340, rect.height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function draw(time = 0) {
    resize();
    character.rotation.y = state.rotationY;
    character.position.y = Math.sin(time / 680) * 0.025;
    character.userData.leftArm.rotation.z = 0.18 + Math.sin(time / 900) * 0.035;
    character.userData.rightArm.rotation.z = -0.18 - Math.sin(time / 900) * 0.035;
    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  }

  function start() {
    if (started) return;
    started = true;
    window.requestAnimationFrame(draw);
  }

  return {
    start,
    snapshot() {
      return { ...state, mounted: true };
    },
  };
}

function createSkeletonProspector() {
  const group = new THREE.Group();
  const bone = new THREE.MeshStandardMaterial({ color: 0xe5d7af, roughness: 0.82 });
  const coat = new THREE.MeshStandardMaterial({ color: 0x253b36, roughness: 0.9 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc28b2c, roughness: 0.72 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d120a, roughness: 0.9 });

  const head = mesh(new THREE.SphereGeometry(0.38, 24, 18), bone, [0, 2.8, 0], [1, 1.12, 0.92]);
  const torso = mesh(new THREE.BoxGeometry(0.92, 1.2, 0.42), coat, [0, 1.85, 0], [1, 1, 1]);
  const pelvis = mesh(new THREE.BoxGeometry(0.72, 0.32, 0.38), dark, [0, 1.16, 0], [1, 1, 1]);
  const brim = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 32), gold, [0, 3.19, 0], [1.18, 1, 0.78]);
  const crown = mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.36, 24), gold, [0, 3.4, 0], [1, 1, 1]);
  const ribs = [-0.28, 0, 0.28].map((offset) => mesh(new THREE.BoxGeometry(0.68, 0.055, 0.08), bone, [0, 1.9 + offset, 0.25], [1, 1, 1]));
  const spine = mesh(new THREE.BoxGeometry(0.08, 0.84, 0.08), bone, [0, 1.88, 0.29], [1, 1, 1]);
  const leftArm = limb({ material: bone, x: -0.68, y: 2.06, z: 0, side: -1 });
  const rightArm = limb({ material: bone, x: 0.68, y: 2.06, z: 0, side: 1 });
  const leftLeg = limb({ material: bone, x: -0.26, y: 0.72, z: 0, side: -0.25, length: 1.05 });
  const rightLeg = limb({ material: bone, x: 0.26, y: 0.72, z: 0, side: 0.25, length: 1.05 });
  const leftBoot = mesh(new THREE.BoxGeometry(0.28, 0.18, 0.42), dark, [-0.28, 0.08, 0.08], [1, 1, 1]);
  const rightBoot = mesh(new THREE.BoxGeometry(0.28, 0.18, 0.42), dark, [0.28, 0.08, 0.08], [1, 1, 1]);
  const pickHandle = mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.15, 10), dark, [0.82, 1.1, 0.16], [1, 1, 1]);
  pickHandle.rotation.z = -0.42;
  const pickHead = mesh(new THREE.BoxGeometry(0.62, 0.06, 0.06), gold, [1.02, 1.62, 0.18], [1, 1, 1]);
  pickHead.rotation.z = -0.42;

  group.add(head, torso, pelvis, brim, crown, spine, leftArm, rightArm, leftLeg, rightLeg, leftBoot, rightBoot, pickHandle, pickHead, ...ribs);
  group.userData.leftArm = leftArm;
  group.userData.rightArm = rightArm;
  group.position.y = -0.15;
  return group;
}

function limb({ material, x, y, z, side, length = 0.92 }) {
  const part = mesh(new THREE.CapsuleGeometry(0.08, length, 6, 12), material, [x, y, z], [1, 1, 1]);
  part.rotation.z = side * 0.18;
  return part;
}

function createPedestal() {
  const group = new THREE.Group();
  const base = mesh(
    new THREE.CylinderGeometry(1.45, 1.8, 0.28, 48),
    new THREE.MeshStandardMaterial({ color: 0x765025, roughness: 0.95 }),
    [0, -0.16, 0],
    [1, 1, 1],
  );
  base.receiveShadow = true;
  group.add(base);
  return group;
}

function mesh(geometry, material, position, scale) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.scale.set(...scale);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}
