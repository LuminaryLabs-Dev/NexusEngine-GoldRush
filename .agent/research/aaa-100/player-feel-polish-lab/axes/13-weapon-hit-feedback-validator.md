# Weapon Hit Feedback - Validator

Status: planned docs-only
Axis: 13
Domain: combat/audio/vfx/receipts

## Validator Target

Input proof verifies one fire action creates one audio/visual/receipt bundle and no duplicate damage.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
