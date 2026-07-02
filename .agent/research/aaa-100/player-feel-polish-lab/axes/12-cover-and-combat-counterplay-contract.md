# Cover And Combat Counterplay - Contract

Status: planned docs-only
Axis: 12
Domain: combat/world/physics

## 10 Point Kit Contract

1. domainPath: n:physics:query
2. purpose: Make cover objects, terrain blockers, and threat routes create real choices instead of decorative clutter.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: cover.available, cover.entered, cover.exposure.changed, combat.counterplay.resolved.
6. snapshot: cover id, cover normal, exposure score, threat relation, blocker status, peek zone, escape route..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: cover id, cover normal, exposure score, threat relation, blocker status, peek zone, escape route..
9. validator: Physics/query proof verifies cover has collision, line-of-sight effect, and stable world placement.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:cover-counterplay
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
