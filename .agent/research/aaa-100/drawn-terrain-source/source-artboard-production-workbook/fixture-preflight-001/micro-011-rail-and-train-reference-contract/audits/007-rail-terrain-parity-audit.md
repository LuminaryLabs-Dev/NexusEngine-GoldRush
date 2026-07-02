# 007 - Rail Terrain Parity Audit

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Source field: `railTerrainParity`

## Audit Lens

Audit `railTerrainParity` as source-owned rail and train route data, not as a train mesh, cinematic shortcut, timer, or renderer helper.

## Findings To Check

- Does the source fixture own the field and revision?
- Can every consumer echo fixture id, rail id, stop id, direction label, motion state, and revision where applicable?
- Can validation fail missing-field, duplicate-id, reversed-direction, broken-spline, wrong-side-door, off-terrain, mismatched-scene-edge, and stale-consumer cases?
- Can the player read train arrival, platform side, boarding target, departure direction, and map handoff without debug overlays?
- Can camera, audio, scene flow, simulator proof, and public proof trace back to the same rail annotation?
- Does public proof refresh when the source rail or train annotation changes?

## Long-Term Impact If Ignored

GoldRush will keep feeling like disconnected scenes even if the train is visually present, because train motion, boarding, camera, audio, and map handoff can still be detached from authored place identity and proof.

## Hardening Requirement

- Add a validator case for `railTerrainParity`.
- Add one consumer snapshot echo.
- Add one negative fixture case.
- Add one human-view or state-proof expectation.
- Mark local, simulator, video, and public proof stale when the source revision changes.

## Pass Condition

validator proves rail samples sit on terrain via source height/slope queries and expose clearance, grade, blocker, and revision checks.

## Stop Condition

Stop if rail mesh and terrain height derive independently or tracks float/bury at proof points.
