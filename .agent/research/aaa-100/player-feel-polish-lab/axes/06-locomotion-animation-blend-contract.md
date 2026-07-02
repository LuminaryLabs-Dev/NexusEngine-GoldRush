# Locomotion Animation Blend - Contract

Status: planned docs-only
Axis: 06
Domain: animation/control

## 10 Point Kit Contract

1. domainPath: n:animation:state
2. purpose: Tie locomotion states to motion so walk, run, strafe, carry, mine, and combat do not look detached.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: animation.state.changed, animation.blend.updated, animation.overlay.started, animation.footstep.cued.
6. snapshot: animation state, blend weights, speed scalar, direction scalar, cargo posture, action overlay, foot phase..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: animation state, blend weights, speed scalar, direction scalar, cargo posture, action overlay, foot phase..
9. validator: Motion proof verifies no moonwalk, frozen legs, missing knees, or cargo posture drift.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:prospector-animation
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
