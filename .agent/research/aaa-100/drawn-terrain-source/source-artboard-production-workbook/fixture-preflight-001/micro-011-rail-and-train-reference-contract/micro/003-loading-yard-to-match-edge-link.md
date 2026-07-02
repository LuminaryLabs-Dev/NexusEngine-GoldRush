# 003 - Loading Yard To Match Edge Link

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make the train loading scene and match map share a source-owned rail edge instead of using unrelated scene coordinates.

## Source Field

- Required field: `loadingYardMapEdgeLinks`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `loadingYardMapEdgeLinks` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Scene transition, train departure, spawn handoff, rail mesh, player lock, replay, and public proof must echo the same loading-yard-to-match edge id.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves loading scene and match map use shared rail edge ids, direction labels, handoff markers, and fixture revision.

## Stop Condition

Stop if the transition teleports between scenes without source rail continuity.
