# Cashout Tension Feedback - Contract

Status: planned docs-only
Axis: 10
Domain: gameplay/extraction/audio/vfx

## 10 Point Kit Contract

1. domainPath: n:gameplay:extraction
2. purpose: Turn extraction from a completion helper into a readable, risky, timed destination.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: extraction.entered, extraction.hold.started, extraction.contested, extraction.interrupted, extraction.completed.
6. snapshot: site id, range, hold ratio, contest state, lockdown state, payout multiplier, interrupt risk, receipt state..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: site id, range, hold ratio, contest state, lockdown state, payout multiplier, interrupt risk, receipt state..
9. validator: Replay proves cashout cannot complete out of range and results reflect the extraction receipt.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:cashout-sites
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
