# Resource Object Readability - Domain Implication

Status: planned docs-only
Axis: 09
Source: Apex Legends official game modes
URL: https://help.ea.com/en/articles/apex-legends/game-modes/

## Domain Implication

- Owning domain: content/render/gameplay.
- Generic candidate: n:render:micro-object-instancing.
- GoldRush composition kit: n:goldrush:resource-object-protokits.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
