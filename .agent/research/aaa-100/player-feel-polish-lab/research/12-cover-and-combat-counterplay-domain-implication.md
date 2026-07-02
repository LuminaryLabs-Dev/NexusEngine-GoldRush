# Cover And Combat Counterplay - Domain Implication

Status: planned docs-only
Axis: 12
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Domain Implication

- Owning domain: combat/world/physics.
- Generic candidate: n:physics:query.
- GoldRush composition kit: n:goldrush:cover-counterplay.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
