# WASD Locomotion Feel - Validator

Status: planned docs-only
Axis: 03
Domain: control/movement

## Validator Target

Input replay proves W follows camera yaw and diagonal movement clamps to intended speed.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
