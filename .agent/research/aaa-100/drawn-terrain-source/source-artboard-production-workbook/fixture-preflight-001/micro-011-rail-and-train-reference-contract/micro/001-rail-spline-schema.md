# 001 - Rail Spline Schema

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make source-owned rail path identity small enough for a future implementation pass.

## Source Field

- Required field: `railSplines`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `railSplines` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Train motion, rail mesh, platform markers, loading-yard handoff, camera follow, audio cues, simulator proof, and public proof must name the same rail spline id and revision.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves source-owned rail splines have id, control points, tangent policy, direction labels, grade bands, speed bands, segment ids, and revision.

## Stop Condition

Stop if the train can move on hardcoded points, local curve objects, or renderer-only rails.
