# 005 - Train Door And Boarding Side Contract

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make door opening side, platform side, and character boarding pose source-readable.

## Source Field

- Required field: `trainDoorBoardingSides`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `trainDoorBoardingSides` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Door animation, prompt, character lock, camera shoulder, platform marker, audio cue, screenshot label, and public proof must echo the same side labels.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves each stop names valid door side, platform side, step-up height, lock pose, camera side, prompt side, and revision.

## Stop Condition

Stop if a train door can open on the wrong side or boarding can ignore platform side.
