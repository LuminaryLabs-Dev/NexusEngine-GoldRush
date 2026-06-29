import * as CANNON from "cannon-es";
import { createTerrainColliderDescriptor } from "./terrainCollider.js";

export function createCannonTerrainPhysics(descriptor = createTerrainColliderDescriptor()) {
  const heightMatrix = createCannonHeightMatrix(descriptor);
  const shape = new CANNON.Heightfield(heightMatrix, {
    elementSize: descriptor.step,
  });
  const body = new CANNON.Body({
    mass: 0,
    material: new CANNON.Material("goldrush-terrain"),
  });
  body.addShape(shape);
  body.position.set(descriptor.bounds.minX, 0, descriptor.bounds.minZ);
  body.collisionFilterGroup = 1;
  body.collisionFilterMask = -1;

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -18.6, 0),
  });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.addBody(body);

  return {
    id: "goldrush.physics.cannonTerrain",
    engine: "cannon-es",
    mode: "static-heightfield",
    descriptorId: descriptor.id,
    world,
    body,
    shape,
    heightMatrix,
    bodyCount: world.bodies.length,
    shapeCount: body.shapes.length,
    bounds: descriptor.bounds,
    step: descriptor.step,
    rows: descriptor.rows,
    columns: descriptor.columns,
    axes: {
      horizontal: ["x", "z"],
      vertical: "y",
      adapterNote: "Cannon height matrix mirrors the Gold Rush x/z samples; gameplay placement remains raycast-driven until dynamic rigidbodies are enabled.",
    },
  };
}

export function createCannonTerrainPhysicsDescriptor(descriptor = createTerrainColliderDescriptor()) {
  return {
    id: "goldrush.physics.cannonTerrain",
    engine: "cannon-es",
    mode: "static-heightfield",
    sourceColliderId: descriptor.id,
    body: {
      mass: 0,
      type: "static",
      shape: "Heightfield",
      material: "goldrush-terrain",
    },
    world: {
      gravity: { x: 0, y: -18.6, z: 0 },
      broadphase: "SAPBroadphase",
      allowSleep: true,
    },
    sampleShape: {
      rows: descriptor.rows,
      columns: descriptor.columns,
      elementSize: descriptor.step,
      sampleCount: descriptor.samples.length,
    },
  };
}

export function validateCannonTerrainPhysics(physics = createCannonTerrainPhysics()) {
  const failures = [];
  if (physics.engine !== "cannon-es") failures.push("engine-mismatch");
  if (!(physics.world instanceof CANNON.World)) failures.push("missing-cannon-world");
  if (!(physics.body instanceof CANNON.Body)) failures.push("missing-cannon-body");
  if (!(physics.shape instanceof CANNON.Heightfield)) failures.push("missing-cannon-heightfield");
  if (physics.body.mass !== 0) failures.push("terrain-body-not-static");
  if (physics.bodyCount < 1) failures.push("world-missing-terrain-body");
  if (physics.shapeCount !== 1) failures.push("terrain-body-shape-count");
  if (physics.heightMatrix.length !== physics.rows) failures.push("height-matrix-row-mismatch");
  if (!physics.heightMatrix.every((row) => row.length === physics.columns)) failures.push("height-matrix-column-mismatch");
  return {
    passed: failures.length === 0,
    failures,
    physics,
  };
}

function createCannonHeightMatrix(descriptor) {
  const matrix = [];
  for (let row = 0; row < descriptor.rows; row += 1) {
    const start = row * descriptor.columns;
    matrix.push(descriptor.samples.slice(start, start + descriptor.columns));
  }
  return matrix;
}
