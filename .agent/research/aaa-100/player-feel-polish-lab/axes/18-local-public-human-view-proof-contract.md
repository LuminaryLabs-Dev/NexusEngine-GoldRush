# Local Public Human View Proof - Contract

Status: planned docs-only
Axis: 18
Domain: validation/release

## 10 Point Kit Contract

1. domainPath: n:runtime:validation
2. purpose: Make every polish claim prove itself in local and public player view, with video when motion is judged.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: proof.started, proof.local.captured, proof.public.captured, proof.mismatch.detected, proof.accepted.
6. snapshot: proof target, local URL, public URL, screenshot set, video set, input replay, state snapshot, mismatch summary..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: proof target, local URL, public URL, screenshot set, video set, input replay, state snapshot, mismatch summary..
9. validator: Sanitized reports prove local/public screenshots, motion samples, no sensitive paths, and clear pass/fail outcomes.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:human-view-proof
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
