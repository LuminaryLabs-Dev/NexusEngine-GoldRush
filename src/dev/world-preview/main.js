import * as THREE from "three";
import { createWorldPreviewCamera, getWorldPreviewCameraPreset } from "./cameraPresets.js";
import { createGoldRushWorldPreviewScene } from "./worldPreviewScene.js";

const params = new URLSearchParams(window.location.search);
const cameraPreset = params.get("camera") ?? "isometric";
const phase = params.get("phase") ?? "prospect";
const canvas = document.querySelector("#world-preview-canvas");
const label = document.querySelector("[data-preview-label]");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = false;

const preview = createGoldRushWorldPreviewScene({ phase });
const cameraInfo = createWorldPreviewCamera(THREE, cameraPreset, 16 / 9);
label.textContent = `${cameraInfo.config.label} · ${phase}`;

function render() {
  const width = Math.max(640, window.innerWidth);
  const height = Math.max(360, window.innerHeight);
  renderer.setSize(width, height, false);
  if (cameraInfo.camera.isPerspectiveCamera) {
    cameraInfo.camera.aspect = width / height;
    cameraInfo.camera.updateProjectionMatrix();
  }
  renderer.render(preview.scene, cameraInfo.camera);
}

render();
window.addEventListener("resize", render);
window.GoldRushWorldPreview = Object.freeze({
  ready: true,
  camera: cameraInfo.config,
  world: preview.snapshot(),
  render,
  selectCamera(id) {
    return getWorldPreviewCameraPreset(id);
  },
});
document.documentElement.dataset.worldPreviewReady = "true";
