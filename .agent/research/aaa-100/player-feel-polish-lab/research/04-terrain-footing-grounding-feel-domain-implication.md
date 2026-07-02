# Terrain Footing Grounding Feel - Domain Implication

Status: planned docs-only
Axis: 04
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Domain Implication

- Owning domain: world/physics/control.
- Generic candidate: n:world:terrain-raycast.
- GoldRush composition kit: n:goldrush:player-grounding.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
