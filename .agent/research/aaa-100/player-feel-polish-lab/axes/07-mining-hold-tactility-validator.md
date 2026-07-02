# Mining Hold Tactility - Validator

Status: planned docs-only
Axis: 07
Domain: gameplay/interaction/audio/vfx

## Validator Target

Input replay proves hold begins only in range, advances while pressed, cancels on movement/damage, and emits a receipt on completion.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
