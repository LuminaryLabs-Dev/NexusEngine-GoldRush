# BUG-001: Player Grounding Not On Visible Terrain

## Status

Open.

## Player Feedback

The player asks why the character is not on top of the terrain. In screenshots the skeleton/pedestal appears to stand on a floating or wrong surface while the expected terrain surface is visually elsewhere.

## Human-Visible Failure

- The character does not read as planted on the ground.
- The pedestal can appear suspended over blue/sky-colored space or intersecting a terrain layer.
- The player cannot trust walking, collision, or slope behavior because the visual terrain and sampled ground disagree.

## Likely Technical Cause

- `src/app/goldRushApp.js` moves the local player from `sampleTerrainCollider()` and `raycastTerrainDown()`.
- `src/renderer/proceduralKits.js` renders overlapping terrain bands with small band Y offsets.
- `raycastTerrainDown()` currently sorts hits by highest Y, so it can select the upper overlapping band or central mountain surface even when the player-visible surface/camera framing makes that look wrong.
- The spawn pedestal uses `terrainFieldHeight()` directly instead of the same sampled hit used by the local player.
- The central mountain forms are still too close/large, so a high blocking surface can visually dominate the player while the intended walkable ground sits below or behind it.

## Related Files

- `src/app/goldRushApp.js`
- `src/physics/terrainCollider.js`
- `src/renderer/proceduralKits.js`
- `tools/validation/validate-terrain-collider.mjs`
- `tools/validation/validate-terrain-continuity.mjs`

## Acceptance Evidence

- Playwright screenshot from normal over-the-shoulder view shows the boots and pedestal grounded on the same visible terrain surface.
- `window.GoldRushHost.getState().localPlayer.ground.hit.bandId` is stable near spawn and does not jump to an unrelated terrain band.
- A validator asserts player, pedestal, and camera target all use the same ground sample at the local player position.

## Next Local Action

Unify player, pedestal, and camera grounding through one `resolvePlayerGrounding()` helper that returns the selected render band, height, slope, walkability, and visual debug metadata. Prefer the near playable band for player footing unless explicitly entering a blocking mountain feature.

