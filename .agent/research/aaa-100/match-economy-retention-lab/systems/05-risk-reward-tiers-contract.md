# Risk Reward Tiers - Contract

Status: planned docs-only
System: 05
Domain: gameplay/balance/world

## 10 Point Kit Contract

1. domainPath: n:gameplay:risk-reward
2. purpose: Tie map location, gold value, threat pressure, cover density, extraction distance, and route exposure into readable tiers.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: risk.tier.assigned, route.value.changed, pressure.value.changed, reward.tier.revealed.
6. snapshot: route id, reward tier, threat tier, extraction distance, cover score, visibility score, noise score, expected value.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: route id, reward tier, threat tier, extraction distance, cover score, visibility score, noise score, expected value.
9. validator: Map scenario validator proves high-value zones also carry measurable risk and readable counterplay.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:risk-reward-tiers
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
