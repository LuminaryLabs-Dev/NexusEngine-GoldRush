# Weapon Hit Feedback - Domain Implication

Status: planned docs-only
Axis: 13
Source: Apex Legends official game modes
URL: https://help.ea.com/en/articles/apex-legends/game-modes/

## Domain Implication

- Owning domain: combat/audio/vfx/receipts.
- Generic candidate: n:combat:hit-feedback.
- GoldRush composition kit: n:goldrush:western-weapon-feedback.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
