# VFX And Diegetic Cues - Domain Implication

Status: planned docs-only
Axis: 15
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Domain Implication

- Owning domain: render/gameplay/audio.
- Generic candidate: n:render:diegetic-cues.
- GoldRush composition kit: n:goldrush:player-guidance-cue.
- Renderer is a consumer, not the authority.
- Public API should expose small commands and queries.
- Private API handles sampling, transforms, batching, timing, and reconciliation.
