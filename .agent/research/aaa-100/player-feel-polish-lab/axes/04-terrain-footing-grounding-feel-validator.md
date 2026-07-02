# Terrain Footing Grounding Feel - Validator

Status: planned docs-only
Axis: 04
Domain: world/physics/control

## Validator Target

Sampled movement proves visible terrain and collision terrain match within tolerance across near-play routes.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
