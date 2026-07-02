# Accessibility And Control Comfort - Validator

Status: planned docs-only
Axis: 17
Domain: control/ux/accessibility

## Validator Target

Settings proof verifies each comfort setting changes runtime behavior and survives scene transitions.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
