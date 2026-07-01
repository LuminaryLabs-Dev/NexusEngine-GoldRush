import * as THREE from "three";
import { mountGoldRushProceduralScene } from "./proceduralKits.js";

export function createGoldRushRenderer(root) {
  const scene = new THREE.Scene();

  const proofCaptureMode = new URLSearchParams(window.location.search).has("publicSmoke");
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: proofCaptureMode });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  root.appendChild(renderer.domElement);
  const proceduralScene = mountGoldRushProceduralScene({ scene, root });
  let currentState = null;
  let started = false;
  let frameCount = 0;

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(360, rect.height || window.innerHeight);
    renderer.setSize(width, height, false);
  }

  function renderFrame(time = performance.now()) {
    if (!currentState) return;
    resize();
    proceduralScene.update(currentState, time / 1000);
    renderer.render(scene, proceduralScene.getCamera());
    frameCount += 1;
  }

  function draw(time = 0) {
    renderFrame(time);
    window.requestAnimationFrame(draw);
  }

  function render(state) {
    currentState = state;
    renderFrame(performance.now());
    if (!started) {
      started = true;
      window.requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resize);

  return {
    render,
    validation: proceduralScene.validation,
    snapshot() {
      return {
        mounted: true,
        frameCount,
        procedural: proceduralScene.snapshot(),
      };
    },
  };
}
