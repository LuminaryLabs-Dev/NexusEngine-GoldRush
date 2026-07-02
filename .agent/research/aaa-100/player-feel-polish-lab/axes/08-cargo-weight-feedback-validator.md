# Cargo Weight Feedback - Validator

Status: planned docs-only
Axis: 08
Domain: gameplay/character/audio

## Validator Target

Proof verifies movement speed, body posture, visible cargo, audio/noise pressure, and cashout receipt all agree.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
