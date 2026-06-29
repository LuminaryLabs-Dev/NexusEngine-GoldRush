# Gold Rush Terrain Collider

Gold Rush uses one shared terrain algorithm for the visible field and the player grounding contract.

## Domains

| Domain | Owner | Contract |
| --- | --- | --- |
| Terrain shape | `src/physics/terrainCollider.js` | Exports `terrainFieldHeight`, `terrainFieldColor`, shared tessellation bands, central mountain blockers, downward raycast placement, and the sampled heightfield descriptor. |
| Player movement | `src/app/goldRushApp.js` | Raycasts down with `raycastTerrainDown()`, samples `sampleTerrainCollider()` during movement, writes `localPlayer.position.y`, and blocks unwalkable mountain interiors or step-ups above the allowed threshold. |
| Renderer | `src/renderer/proceduralKits.js` | Imports the shared terrain functions and reads `localPlayer.ground.height` for the skeleton rig and over-the-shoulder camera. |
| Physics bridge | `src/physics/cannonTerrainPhysics.js` | Builds a real `cannon-es` `World`, static `Body`, and `Heightfield` shape from the terrain collider descriptor; Rapier remains a future bridge target. |

## Edge Cases

- Spawn must sample to a finite, walkable height.
- Player placement must use the highest downward hit on the visible banded triangle terrain, not only the ideal height formula.
- Near-play terrain must sit above coarser overlapping bands so player footing uses the detailed local surface.
- Central mountain interiors are blockers; the player should route around them.
- Renderer code must not copy the height/color algorithm.
- The debug state exposes `terrainCollider` plus `localPlayer.ground` so Playwright can prove grounding without visual guessing.

## Camera Movement

The run scene supports mouse-look. `localPlayer.look.yaw` drives the over-the-shoulder camera, and WASD movement is rotated by that same yaw so forward movement follows the camera direction.

## Cannon Adapter

`createCannonTerrainPhysics()` converts the collider height samples into a Cannon `Heightfield` attached to a static terrain body. The app exposes `window.GoldRushHost.getState().terrainPhysics` so browser validation can confirm the physics contract without loading dynamic rigidbodies into the prototype loop yet.

## Validation

```txt
node tools/validation/validate-terrain-collider.mjs
npm run check
```
