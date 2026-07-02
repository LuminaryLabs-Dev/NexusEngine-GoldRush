# WASD Locomotion Feel - Contract

Status: planned docs-only
Axis: 03
Domain: control/movement

## 10 Point Kit Contract

1. domainPath: n:control:character-movement
2. purpose: Make movement follow camera look direction with acceleration, stopping, and slope behavior that feel intentional.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: movement.input.sampled, movement.velocity.changed, movement.grounded.changed, movement.slope.rejected.
6. snapshot: input vector, camera yaw, desired velocity, actual velocity, acceleration, friction, grounded state, slope limit..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: input vector, camera yaw, desired velocity, actual velocity, acceleration, friction, grounded state, slope limit..
9. validator: Input replay proves W follows camera yaw and diagonal movement clamps to intended speed.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:prospector-movement
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
