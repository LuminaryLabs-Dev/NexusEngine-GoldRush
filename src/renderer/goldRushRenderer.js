import * as THREE from "three";

export function createGoldRushRenderer(root) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121819);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 7, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  root.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffdf9e, 2.2);
  light.position.set(4, 8, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x8fc4bf, 0.7));

  const arena = new THREE.Mesh(
    new THREE.CircleGeometry(4.6, 48),
    new THREE.MeshStandardMaterial({ color: 0x9f7a45, roughness: 0.92 })
  );
  arena.rotation.x = -Math.PI / 2;
  scene.add(arena);

  const markers = [];
  for (let i = 0; i < 100; i += 1) {
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: i < 50 ? 0xf5b544 : 0x74d0c2 })
    );
    scene.add(marker);
    markers.push(marker);
  }

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(360, rect.height || window.innerHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render(state) {
    resize();
    const activePlayers = state.players;
    markers.forEach((marker, index) => {
      marker.visible = index < activePlayers;
      const angle = (index / Math.max(activePlayers, 1)) * Math.PI * 2;
      const radius = index < 50 ? 2.1 : 3.35;
      marker.position.set(Math.cos(angle) * radius, 0.08, Math.sin(angle) * radius);
      marker.scale.setScalar(state.cameraMode === "combat" && index < 8 ? 2.4 : 1);
    });

    if (state.cameraMode === "combat") {
      camera.position.set(0, 4.2, 5.4);
    } else {
      camera.position.set(0, 7, 10);
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);

  return { render };
}
