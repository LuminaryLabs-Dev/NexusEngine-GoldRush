# 008 - Rail Prop Placement Parity

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make sleepers, signs, switches, depots, and rail clutter consume rail anchors instead of scatter logic.

## Source Field

- Required field: `railPropPlacementEcho`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `railPropPlacementEcho` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Rail props, depot landmarks, route signage, prop protokits, placement validators, screenshots, and public proof must echo source rail anchor ids.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

renderer snapshots echo rail anchor ids, raycast hits, prop family ids, spacing policy, side label, and fixture revision.

## Stop Condition

Stop if tracks are visual-only props with no source-owned placement anchors.
