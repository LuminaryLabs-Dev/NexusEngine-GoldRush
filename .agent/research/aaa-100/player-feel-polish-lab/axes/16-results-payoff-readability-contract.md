# Results Payoff Readability - Contract

Status: planned docs-only
Axis: 16
Domain: match/presentation/audio

## 10 Point Kit Contract

1. domainPath: n:match:results
2. purpose: Make extracted gold, combat risk, route choices, frontier condition, and replay moments feel earned.
3. publicApi: expose command/query functions for the smallest player-facing behavior only.
4. internalApi: keep implementation helpers private to the kit and do not let UI or renderer call them directly.
5. events: results.finalized, replay.moment.added, award.unlocked, results.action.selected.
6. snapshot: score, extracted amount, carried loss, threat receipts, condition, modifiers, replay moments, awards, next action..
7. reset: clear transient action state, release authority, and preserve only durable config defaults.
8. dataExposed: score, extracted amount, carried loss, threat receipts, condition, modifiers, replay moments, awards, next action..
9. validator: Proof compares receipt ledger to visible results and fails if values truncate or raw ids leak.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming, no GoldRush rules, and complete validator/proof coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:results-screen
- GoldRush responsibility: compose the generic surface into wild-west extraction gameplay and tune the player-readable behavior.
