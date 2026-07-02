# Camera Authority Stability - Validator

Status: planned docs-only
Axis: 02
Domain: runtime/control

## Validator Target

Runtime sample proves one camera writer per frame and fails when same-frame writers exceed one.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
