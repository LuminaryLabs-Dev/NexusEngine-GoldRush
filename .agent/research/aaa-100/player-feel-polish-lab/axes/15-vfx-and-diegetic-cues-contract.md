# VFX And Diegetic Cues - Contract

Status: planned docs-only
Axis: 15
Domain: render/gameplay/audio

## 10 Point Kit Contract

1. domainPath: n:render:diegetic-cues
2. purpose: Move guidance from debug overlays to in-world cues that explain route, action, danger, value, and extraction.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: cue.spawned, cue.updated, cue.resolved, cue.hidden, cue.conflict.detected.
6. snapshot: cue id, cue type, world position, priority, target id, visibility band, fade state, occlusion state, action hint..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: cue id, cue type, world position, priority, target id, visibility band, fade state, occlusion state, action hint..
9. validator: Screenshot proof verifies one primary cue, limited secondary cues, no clutter flood, and no debug-only dependency.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:player-guidance-cue
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
