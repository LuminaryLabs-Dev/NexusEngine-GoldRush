# Local Public Human View Proof - Validator

Status: planned docs-only
Axis: 18
Domain: validation/release

## Validator Target

Sanitized reports prove local/public screenshots, motion samples, no sensitive paths, and clear pass/fail outcomes.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
