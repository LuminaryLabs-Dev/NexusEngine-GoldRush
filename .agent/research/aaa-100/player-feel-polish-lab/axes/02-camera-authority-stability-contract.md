# Camera Authority Stability - Contract

Status: planned docs-only
Axis: 02
Domain: runtime/control

## 10 Point Kit Contract

1. domainPath: n:runtime:authority-lock
2. purpose: Prevent two systems from moving the gameplay camera in the same frame.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: camera.authority.claimed, camera.authority.released, camera.conflict.detected, camera.transition.reset.
6. snapshot: authority owner, transition phase, follow target, override reason, expiry, last writer, frame token..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: authority owner, transition phase, follow target, override reason, expiry, last writer, frame token..
9. validator: Runtime sample proves one camera writer per frame and fails when same-frame writers exceed one.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:camera-authority
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
