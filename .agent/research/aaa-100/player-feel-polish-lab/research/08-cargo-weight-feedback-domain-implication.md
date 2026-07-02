# Cargo Weight Feedback - Domain Implication

Status: planned docs-only
Axis: 08
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Domain Implication

- Owning domain: gameplay/character/audio.
- Generic candidate: n:gameplay:cargo.
- GoldRush composition kit: n:goldrush:gold-carrying.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
