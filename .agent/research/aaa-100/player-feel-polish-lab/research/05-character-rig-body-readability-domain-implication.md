# Character Rig Body Readability - Domain Implication

Status: planned docs-only
Axis: 05
Source: Apex Legends official game modes
URL: https://help.ea.com/en/articles/apex-legends/game-modes/

## Domain Implication

- Owning domain: character/render.
- Generic candidate: n:animation:rig-readability.
- GoldRush composition kit: n:goldrush:prospector-rig.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
