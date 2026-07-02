# 006 - Train Motion State Contract

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make train arrival, idle, boarding, depart, and offscreen phases follow source rail progress.

## Source Field

- Required field: `trainMotionStates`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `trainMotionStates` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Train transform, player lock, camera target, door state, audio cue, scene transition, simulator proof, and public proof must echo the same motion state.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves arrival, idle, boarding, door-open, lock-in, departure, ride-away, and offscreen phases use rail progress, speed band, and revision.

## Stop Condition

Stop if the train moves sideways or phase time drives world transform without a rail sample.
