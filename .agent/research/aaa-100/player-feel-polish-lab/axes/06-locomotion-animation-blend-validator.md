# Locomotion Animation Blend - Validator

Status: planned docs-only
Axis: 06
Domain: animation/control

## Validator Target

Motion proof verifies no moonwalk, frozen legs, missing knees, or cargo posture drift.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
