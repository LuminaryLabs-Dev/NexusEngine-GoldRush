# Threat Telegraph Readability - Contract

Status: planned docs-only
Axis: 11
Domain: combat/audio/vfx/world

## 10 Point Kit Contract

1. domainPath: n:gameplay:combat-pressure
2. purpose: Make danger readable before damage through sound, silhouette, direction, world cues, and pressure state.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: threat.telegraphed, threat.lineOfSight.changed, threat.pressure.changed, threat.cover.recommended.
6. snapshot: threat id, direction, distance band, alertness, noise cause, telegraph cue, safe cover target, pressure value..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: threat id, direction, distance band, alertness, noise cause, telegraph cue, safe cover target, pressure value..
9. validator: Scenario proof verifies threat cues appear before damage and route guidance points to real cover.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:ambush-pressure
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
