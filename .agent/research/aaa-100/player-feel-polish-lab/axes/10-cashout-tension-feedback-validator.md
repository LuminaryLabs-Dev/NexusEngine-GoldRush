# Cashout Tension Feedback - Validator

Status: planned docs-only
Axis: 10
Domain: gameplay/extraction/audio/vfx

## Validator Target

Replay proves cashout cannot complete out of range and results reflect the extraction receipt.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
