# Challenge And Contract Rotation - Contract

Status: planned docs-only
System: 12
Domain: live-ops/objectives/progression

## 10 Point Kit Contract

1. domainPath: n:progression:challenge-rotation
2. purpose: Plan future rotating claim challenges without making them required for basic play.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: challenge.rotation.loaded, challenge.progressed, challenge.completed, challenge.expired.
6. snapshot: challenge id, rotation id, objective, eligibility, reward, expiration, mode scope, anti-grind cap.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: challenge id, rotation id, objective, eligibility, reward, expiration, mode scope, anti-grind cap.
9. validator: Rotation validator proves deterministic challenge sets, no expired challenge rewards, and no debug-only objectives.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:claim-challenge-rotation
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
