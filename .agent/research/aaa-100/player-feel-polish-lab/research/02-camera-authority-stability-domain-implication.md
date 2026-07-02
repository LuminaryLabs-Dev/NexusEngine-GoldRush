# Camera Authority Stability - Domain Implication

Status: planned docs-only
Axis: 02
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Domain Implication

- Owning domain: runtime/control.
- Generic candidate: n:runtime:authority-lock.
- GoldRush composition kit: n:goldrush:camera-authority.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
