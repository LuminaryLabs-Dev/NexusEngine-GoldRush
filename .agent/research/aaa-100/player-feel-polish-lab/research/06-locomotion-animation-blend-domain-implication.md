# Locomotion Animation Blend - Domain Implication

Status: planned docs-only
Axis: 06
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Domain Implication

- Owning domain: animation/control.
- Generic candidate: n:animation:state.
- GoldRush composition kit: n:goldrush:prospector-animation.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
