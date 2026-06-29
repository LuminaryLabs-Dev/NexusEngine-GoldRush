# BUG-005: Loading Train Sideways Drift And Missing Boarding Sequence

## Status

Active fix in local worktree.

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
- Player locks to the train boarding anchor after reaching the platform.
- Camera follows the train during departure.
- Validator rejects the old sideways `train.position.x = departureProgress * 30` drift.
