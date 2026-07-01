import * as THREE from "three";
import { mountGoldRushProceduralScene } from "./proceduralKits.js";

export function createGoldRushRenderer(root) {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
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

  function draw(time = 0) {
    if (!currentState) return;
    resize();
    proceduralScene.update(currentState, time / 1000);
    renderer.render(scene, proceduralScene.getCamera());
    frameCount += 1;
    window.requestAnimationFrame(draw);
  }

  function render(state) {
    currentState = state;
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
