import * as THREE from "three";
import { mountGoldRushProceduralScene } from "./proceduralKits.js";

export function createGoldRushRenderer(root) {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  root.appendChild(renderer.domElement);
  const proceduralScene = mountGoldRushProceduralScene({ scene, root });

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(360, rect.height || window.innerHeight);
    renderer.setSize(width, height, false);
  }

  function render(state) {
    resize();
    proceduralScene.update(state);
    renderer.render(scene, proceduralScene.getCamera());
  }

  window.addEventListener("resize", resize);

  return { render, validation: proceduralScene.validation };
}
