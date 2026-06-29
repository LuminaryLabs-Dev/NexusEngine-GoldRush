# BUG-004: Frame-To-Frame Terrain And Player Pulsing

## Status

Mitigated in local proof; keep under watch during the next mountain/framing pass.

## Player Feedback

The recorded gameplay shows a pulsing issue that appears every other frame or near every other frame.

## Evidence

- Source recording:
  `/Users/crimsonwheeler/Documents/ME/recordings/Screen Recording 2026-06-29 at 8.36.49 AM.mov`
- Duration: 4.05 seconds.
- Source frame rate: about 44.29 fps.
- Dense frame contact sheet:
  `/tmp/goldrush-pulse-review/native-frames-000-079.jpg`
- Player crop sheets:
  `/tmp/goldrush-pulse-review/player-crop-028-045.jpg`
  `/tmp/goldrush-pulse-review/player-crop-060-079.jpg`

## Human-Visible Failure

- The ground directly around the player changes brightness/shape frame-to-frame.
- The player silhouette appears to subtly bob or pop against the ground.
- The terrain surface looks like competing layers instead of one stable floor.
- This makes movement feel unstable even when the character is mostly walking straight.

## Measured Signal

Whole-frame even/odd brightness was stable, so this is not a global exposure flicker.

The player/near-ground crop had local frame differences up to about `YDIF=5.154`, and local brightness swung from about `YAVG=116.439` to `YAVG=121.485` over the inspected native-frame window.

## Likely Technical Cause

- Terrain bands overlap in screen space and may be z-fighting or swapping visual dominance as the camera moves.
- The player render adds walk bob to `group.position.y`, which can make the character and its shadow/highlight pulse against the terrain.
- The ground sample, render-band Y offset, and camera target may not be using one stable grounding result per frame.
- Shadow rendering may exaggerate the issue because the character and terrain are flat-shaded and high contrast.

## Related Files

- `src/renderer/proceduralKits.js`
- `src/physics/terrainCollider.js`
- `src/app/goldRushApp.js`
- `tools/validation/validate-terrain-continuity.mjs`
- `tools/validation/validate-terrain-collider.mjs`

## Acceptance Evidence

- Consecutive-frame crop review shows no alternating bright/dark terrain pulse around the player.
- Player grounding, camera target, pedestal, and player rig consume the same cached terrain sample for a frame.
- Terrain overlap either has stable render order/depth behavior or is clipped into non-overlapping visible regions.
- Walk animation preserves leg motion without moving the whole root up/down enough to pulse against the terrain.

## Mitigation Evidence

- `src/app/goldRushApp.js` now exposes one cached `renderGround` sample from movement.
- `src/renderer/proceduralKits.js` consumes `localPlayer.renderGround.height` before falling back to other terrain height sources.
- Root-level walk bob was removed from the player group; visible motion now lives in limbs.
- Fresh Playwright proof reached `screen: run` with no page errors and `localPlayer.renderGround.source: cached-movement-ground`.
- Dense-frame post-fix stationary crop proof over 75 frames had an even/odd YAVG delta of `0.012`, so the measured crop no longer behaves like an every-other-frame pulse.
- Proof report: `reports/grounding-knees-stability-01.md`.
- Numeric summary: `reports/frame-analysis/grounding-pulse-summary.json`.

## Remaining Watch Item

The proof still has isolated frame deltas and severe central-mountain framing debt. Re-check the pulse after BUG-002 changes because large terrain silhouette edits can reintroduce local flicker.

## 2026-06-29 Re-Review

- New source recording reviewed: `/Users/crimsonwheeler/Documents/Me/recordings/Screen Recording 2026-06-29 at 10.05.50 AM.mov`.
- Dense native-frame review did not show a clean every-other-frame global flicker.
- The visible pulse reads as large flat terrain/lighting bands moving across the player view while the camera moves.
- Current local fix direction is to simplify stacked terrain surfaces by carving coarse band top faces beneath finer terrain bands.
