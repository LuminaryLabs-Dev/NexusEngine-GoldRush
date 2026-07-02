# Cashout Tension Feedback - Domain Implication

Status: planned docs-only
Axis: 10
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Domain Implication

- Owning domain: gameplay/extraction/audio/vfx.
- Generic candidate: n:gameplay:extraction.
- GoldRush composition kit: n:goldrush:cashout-sites.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
