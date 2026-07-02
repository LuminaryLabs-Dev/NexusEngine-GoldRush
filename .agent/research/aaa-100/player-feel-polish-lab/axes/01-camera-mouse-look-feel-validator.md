# Camera Mouse Look Feel - Validator

Status: planned docs-only
Axis: 01
Domain: control/camera

## Validator Target

Motion capture verifies single camera authority, no per-frame pose reselection, and mouse delta changes yaw/pitch predictably.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
