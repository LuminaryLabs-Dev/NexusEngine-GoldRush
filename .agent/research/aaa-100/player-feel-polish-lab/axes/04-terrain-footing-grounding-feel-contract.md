# Terrain Footing Grounding Feel - Contract

Status: planned docs-only
Axis: 04
Domain: world/physics/control

## 10 Point Kit Contract

1. domainPath: n:world:terrain-raycast
2. purpose: Make the player stand on visible terrain with believable slope and step behavior.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: ground.hit.updated, ground.mismatch.detected, ground.step.applied, ground.slope.blocked.
6. snapshot: ground hit, visible height, collider height, normal, slope, step delta, grounding confidence, mismatch..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: ground hit, visible height, collider height, normal, slope, step delta, grounding confidence, mismatch..
9. validator: Sampled movement proves visible terrain and collision terrain match within tolerance across near-play routes.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:player-grounding
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
