# BUG-005: Loading Train Sideways Drift And Missing Boarding Sequence

## Status

Active fix in local worktree; staged readout/cue validation added.

## Player Feedback

The train moves sideways. The first playable loading scene should start with the train riding up, the player seeing it arrive, the door opening, the player boarding, the character locking to the train, and the train driving off while the camera follows.

## Human-Visible Failure

- Train departure reads like a sliding prop instead of a vehicle on rails.
- The scene lacks a clear train arrival beat.
- The player does not visibly board through a door.
- The transition to match feels like a trigger zone instead of a small staged scene.

## Likely Technical Cause

- `src/renderer/loadingTrainSceneRenderer.js` used direct `train.position.x` and `train.position.z` offsets for departure.
- No path/tangent system owned train orientation.
- No visible door mesh or train-mounted player anchor existed.
- `src/app/goldRushApp.js` jumped from boarding trigger to departure without approach/open/board phases.

## Related Files

- `src/app/goldRushApp.js`
- `src/renderer/loadingTrainSceneRenderer.js`
- `tools/validation/validate-scene-sites.mjs`

## Acceptance Evidence

- Loading scene shows the train approaching along rails.
- Door opens before boarding.
- An in-world train-door cue appears when boarding is available.
- Player locks to the train boarding anchor after reaching the platform.
- Camera follows the train during departure.
- Validator rejects the old sideways `train.position.x = departureProgress * 30` drift.
- Deploy smoke proof fails unless the player boards by natural camera-relative walking from the loading-yard spawn.

## Local Fix Added

- `src/scenes/goldRushFirstSequence.js` now exposes `goldrush-train-sequence-readout-v1` with current beat, next player action, player cue, readiness flags, boarding cue visibility, and camera directive.
- `src/renderer/loadingTrainSceneRenderer.js` now exposes `goldrush-train-boarding-cue-v1` and renders a door-mounted 3D boarding cue when the train door opens.
- `src/audio/goldRushAudioManager.js` now maps train readout beats into `goldrush-train-transition-audio-cues-v1` one-shots, using existing fallback cue slots until approved legacy audio promotion exists.
- `tools/validation/validate-first-sequence.mjs`, `tools/validation/validate-scene-sites.mjs`, and public smoke proof now require the train readout, visual cue, and audio cue-state contracts.
- `tools/proof/public-deploy-smoke.mjs` now records `boardingPath.method: natural-walk-from-loading-yard-spawn` and no longer falls back to the train-door placement helper during the deploy smoke path.
