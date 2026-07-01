# Grounding, Knees, And Pulse Stability 01

## Scope

This pass targeted three player-visible problems:

- the player/pedestal using unstable or mismatched terrain height,
- skeleton legs reading as one-piece sticks without knees,
- frame-to-frame player/ground pulsing that looked like an every-other-frame issue.

## Code Changes

- `src/app/goldRushApp.js` now exposes `localPlayer.renderGround` from the cached movement ground sample.
- `src/renderer/proceduralKits.js` now uses cached `renderGround` for player root height instead of recomputing terrain height in the renderer.
- `src/renderer/proceduralKits.js` removes root-level walk bob and moves leg motion into two-part knee rigs.
- `src/renderer/loadingTrainSceneRenderer.js` now treats the rail/platform approach as a boarding corridor so automated and human movement can reliably trigger the train handoff.
- `tools/validation/validate-procedural-renderer-kits.mjs` checks for knee-leg rig helpers, cached render grounding, and absence of the old root-bob expression.

## Temporal Evidence

Source recording:

`<documents>/ME/recordings/Screen Recording 2026-06-29 at 8.36.49 AM.mov`

Fresh proof video:

`reports/videos/grounding-knees-stability-video-proof.webm`

Dense-frame proof:

- original crop sheet: `reports/frame-analysis/original/player-crop-contact.png`
- post-fix stationary crop sheet: `reports/frame-analysis/postfix-stationary/player-crop-contact.png`
- numeric summary: `reports/frame-analysis/grounding-pulse-summary.json`

The original 90-frame player crop had `ydifAvg: 6.586` and `ydifMax: 11.363`. The post-fix stationary 75-frame player crop had `ydifAvg: 1.129` and an even/odd YAVG delta of `0.012`, which does not support an active every-other-frame brightness pulse.

## Browser Proof

Fresh Playwright proof reached:

- `screen: run`
- no page errors
- `localPlayer.ground.hit.bandId: near-play-band`
- `localPlayer.renderGround.source: cached-movement-ground`
- `localPlayer.renderGround.stableForFrame: true`

Screenshot:

`screenshots/grounding-knees-stability-video-proof.png`

## Remaining Debt

BUG-002 remains open: the central mountain still reads as a huge dark slab over the player in the proof video and screenshot. That is a composition/framing problem, not the same bug as the every-other-frame player/ground pulse.
