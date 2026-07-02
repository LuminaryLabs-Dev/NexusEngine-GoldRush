# 009 - Train Camera Follow Contract

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make train cinematic camera behavior a linear handoff from gameplay camera authority instead of a competing camera system.

## Source Field

- Required field: `trainCameraRailHandoff`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `trainCameraRailHandoff` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Camera snapshot, train motion state, player lock, rail progress, scene flow, screenshot proof, and public proof must echo one camera handoff id.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves camera follow, over-shoulder return, train ride framing, player lock state, rail sample target, and revision are reported together.

## Stop Condition

Stop if a rail cinematic and gameplay camera can both move the camera in the same phase.
