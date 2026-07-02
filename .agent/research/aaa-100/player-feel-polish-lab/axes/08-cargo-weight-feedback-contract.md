# Cargo Weight Feedback - Contract

Status: planned docs-only
Axis: 08
Domain: gameplay/character/audio

## 10 Point Kit Contract

1. domainPath: n:gameplay:cargo
2. purpose: Make carried gold visibly and mechanically change movement, posture, sound, and threat exposure.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: cargo.changed, cargo.capacity.reached, cargo.noise.changed, cargo.dropped, cargo.deposited.
6. snapshot: carried amount, capacity, speed multiplier, posture, visible nugget count, noise radius, drop eligibility..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: carried amount, capacity, speed multiplier, posture, visible nugget count, noise radius, drop eligibility..
9. validator: Proof verifies movement speed, body posture, visible cargo, audio/noise pressure, and cashout receipt all agree.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:gold-carrying
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
