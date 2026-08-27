const preset = (config) => Object.freeze(config);

export const WORLD_PREVIEW_CAMERA_PRESETS = Object.freeze({
  isometric: preset({
    id: "isometric",
    label: "Isometric World",
    projection: "orthographic",
    position: [3100, 2700, 3100],
    target: [0, 0, 0],
    orthoHeight: 5200,
    near: 1,
    far: 12000,
    purpose: "Reusable spatial overview for world composition, route planning, and late-game state review.",
  }),
  overview: preset({
    id: "overview",
    label: "High World Overview",
    projection: "perspective",
    position: [3600, 3100, 4300],
    target: [0, 0, 100],
    fov: 42,
    near: 5,
    far: 14000,
    purpose: "Read the full map silhouette, mountains, towns, routes, and gold-zone distribution.",
  }),
  westBasin: preset({
    id: "westBasin",
    label: "West Basin Exploration",
    projection: "perspective",
    position: [-2350, 780, 1250],
    target: [-1050, 80, -120],
    fov: 48,
    near: 2,
    far: 9000,
    purpose: "Exploration-scale read of Dustfall Station, West Drywash, ridge geometry, and route hierarchy.",
  }),
  coyoteJunction: preset({
    id: "coyoteJunction",
    label: "Coyote Junction",
    projection: "perspective",
    position: [2050, 520, 1450],
    target: [1120, 70, 420],
    fov: 44,
    near: 2,
    far: 8000,
    purpose: "Settlement composition and cover-readability preview for the east side of the world.",
  }),
  sunderedCamp: preset({
    id: "sunderedCamp",
    label: "Sundered Camp Combat",
    projection: "perspective",
    position: [-1050, 420, 1700],
    target: [-120, 60, 920],
    fov: 50,
    near: 2,
    far: 7000,
    purpose: "Combat-space preview for the central late-run settlement and converging cashout routes.",
  }),
  extractionVista: preset({
    id: "extractionVista",
    label: "Extraction Vista",
    projection: "perspective",
    position: [980, 420, 1680],
    target: [250, 50, 820],
    fov: 46,
    near: 2,
    far: 7000,
    purpose: "Late-run extraction framing with converging routes, threat approaches, and escape direction visible.",
  }),
  finalRush: preset({
    id: "finalRush",
    label: "Final Rush Dramatic",
    projection: "perspective",
    position: [-250, 250, 1430],
    target: [260, 55, 820],
    fov: 58,
    near: 1,
    far: 6500,
    purpose: "Lower dramatic angle for collapse pressure, combat escalation, and end-of-run presentation review.",
  }),
});

export const DEFAULT_WORLD_PREVIEW_PRESETS = Object.freeze([
  "isometric",
  "overview",
  "westBasin",
  "coyoteJunction",
  "sunderedCamp",
  "extractionVista",
  "finalRush",
]);

export function getWorldPreviewCameraPreset(id = "isometric") {
  return WORLD_PREVIEW_CAMERA_PRESETS[id] ?? WORLD_PREVIEW_CAMERA_PRESETS.isometric;
}

export function createWorldPreviewCamera(THREE, presetId, aspect = 16 / 9) {
  const config = getWorldPreviewCameraPreset(presetId);
  let camera;
  if (config.projection === "orthographic") {
    const halfHeight = config.orthoHeight / 2;
    const halfWidth = halfHeight * aspect;
    camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, config.near, config.far);
  } else {
    camera = new THREE.PerspectiveCamera(config.fov, aspect, config.near, config.far);
  }
  camera.position.set(...config.position);
  camera.lookAt(...config.target);
  camera.updateProjectionMatrix();
  return { camera, config };
}
