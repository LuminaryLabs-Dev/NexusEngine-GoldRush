# Camera Mouse Look Feel - Domain Implication

Status: planned docs-only
Axis: 01
Source: Apex Legends official game modes
URL: https://help.ea.com/en/articles/apex-legends/game-modes/

## Domain Implication

- Owning domain: control/camera.
- Generic candidate: n:control:third-person-camera.
- GoldRush composition kit: n:goldrush:exploration-camera.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
