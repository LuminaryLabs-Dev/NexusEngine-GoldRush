# BUG-006: Physics Backend And Terrain Mesh Reliability

## Status

Active fix in local worktree.

## Player Feedback

The meshes read as inside-out or unstable, terrain physics does not feel correct, and movement should be simpler and more reliable with mouse-look camera direction driving WASD.

## Human-Visible Failure

- Terrain can look like stacked surfaces instead of one stable floor.
- Large flat bands can pulse or dominate as the camera moves.
- Player trust breaks when visible terrain, sampled grounding, and physics metadata feel like separate systems.
- Physics backend choice is unclear: Cannon and Rapier are both mentioned but not scoped.

## Local Backend Decision

Use `cannon-es` now because it is already installed and bridged to the terrain heightfield. Keep Rapier as the next backend adapter only after the current terrain, camera, and train loop are stable, because Rapier needs its own async package/init path and kinematic-controller validation.

## Related Files

- `src/physics/cannonTerrainPhysics.js`
- `src/physics/physicsBackendKit.js`
- `src/physics/terrainCollider.js`
- `src/renderer/proceduralKits.js`
- `src/app/goldRushApp.js`
- `tools/validation/validate-physics-backend-kit.mjs`
- `tools/validation/validate-terrain-continuity.mjs`

## Acceptance Evidence

- Debug state exposes one active backend decision.
- Current active backend is `cannon-es` static heightfield.
- Rapier remains a future adapter, not a half-wired runtime dependency.
- WASD movement is explicitly camera-yaw relative.
- Coarse terrain band top faces are carved out underneath finer bands to reduce stacked-surface flicker.
- Visible terrain winding remains upward/front-side for the main terrain mesh.
