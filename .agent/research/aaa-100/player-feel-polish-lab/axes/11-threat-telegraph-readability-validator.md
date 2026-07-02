# Threat Telegraph Readability - Validator

Status: planned docs-only
Axis: 11
Domain: combat/audio/vfx/world

## Validator Target

Scenario proof verifies threat cues appear before damage and route guidance points to real cover.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
