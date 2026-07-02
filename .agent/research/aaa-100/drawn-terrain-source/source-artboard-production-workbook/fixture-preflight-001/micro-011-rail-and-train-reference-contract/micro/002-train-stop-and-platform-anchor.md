# 002 - Train Stop And Platform Anchor

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make stops, platforms, and boarding approach points source-owned instead of implied by station props.

## Source Field

- Required field: `trainStopAnchors`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `trainStopAnchors` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Door prompts, boarding locks, character alignment, platform props, train phase, screenshots, and public proof must echo the same train stop anchor id.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves train stop anchors have id, position, facing, platform side, door side, approach radius, boarding range, and revision.

## Stop Condition

Stop if the player can board at an unannotated transform or a renderer-only platform.
