# 010 - Train Audio Cue Route Contract

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make whistle, wheel, brake, door, and departure cues follow train phase and rail distance.

## Source Field

- Required field: `trainAudioRouteCues`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `trainAudioRouteCues` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Audio manager, scene flow, train motion, door prompt, player lock, screenshots/video notes, simulator proof, and public proof must echo cue source ids.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves train audio cues bind to rail segment id, distance band, motion state, door side, cue id, volume policy, and revision.

## Stop Condition

Stop if train audio fires from timers only or cannot name rail/motion provenance.
