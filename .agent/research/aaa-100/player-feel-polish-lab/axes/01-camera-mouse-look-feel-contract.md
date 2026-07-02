# Camera Mouse Look Feel - Contract

Status: planned docs-only
Axis: 01
Domain: control/camera

## 10 Point Kit Contract

1. domainPath: n:control:third-person-camera
2. purpose: Make mouse look feel stable, intentional, and playable over the shoulder.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: camera.look.changed, camera.authority.locked, camera.mode.changed, camera.collision.adjusted.
6. snapshot: yaw, pitch, sensitivity, shoulder offset, smoothing, collision clearance, target distance, active mode, authority receipt..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: yaw, pitch, sensitivity, shoulder offset, smoothing, collision clearance, target distance, active mode, authority receipt..
9. validator: Motion capture verifies single camera authority, no per-frame pose reselection, and mouse delta changes yaw/pitch predictably.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:exploration-camera
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
