# Audio Cue Layering - Contract

Status: planned docs-only
Axis: 14
Domain: audio/runtime

## 10 Point Kit Contract

1. domainPath: n:audio:cue-state
2. purpose: Replace hum/debug sound with layered title, lobby, train, movement, mining, cargo, threat, cashout, and result cues.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: audio.cue.started, audio.cue.stopped, audio.layer.changed, audio.asset.pending, audio.fallback.used.
6. snapshot: active cue, layer, priority, loop state, cooldown, scene phase, semantic role, fallback pattern, approved asset status..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: active cue, layer, priority, loop state, cooldown, scene phase, semantic role, fallback pattern, approved asset status..
9. validator: Proof verifies distinct semantic cues fire once per event and approved assets remain gated until promotion.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:music-and-stingers
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
