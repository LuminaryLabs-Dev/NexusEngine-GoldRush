# WASD Locomotion Feel - Domain Implication

Status: planned docs-only
Axis: 03
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Domain Implication

- Owning domain: control/movement.
- Generic candidate: n:control:character-movement.
- GoldRush composition kit: n:goldrush:prospector-movement.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
