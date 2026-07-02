# Cover And Combat Counterplay - Validator

Status: planned docs-only
Axis: 12
Domain: combat/world/physics

## Validator Target

Physics/query proof verifies cover has collision, line-of-sight effect, and stable world placement.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
