# Bot Fill Reward Boundary - Contract

Status: planned docs-only
System: 09
Domain: staging/progression/network

## 10 Point Kit Contract

1. domainPath: n:staging:reward-boundary
2. purpose: Separate practice, bot-fill, simulated-scale, private, public, and future ranked reward eligibility.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: mode.eligibility.loaded, botfill.applied, reward.eligibility.changed, summary.label.applied.
6. snapshot: mode id, human count, bot count, private flag, reward eligibility, stat eligibility, proof tier, summary label.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: mode id, human count, bot count, private flag, reward eligibility, stat eligibility, proof tier, summary label.
9. validator: Mode matrix validator proves reward/stat labels for training, bot fill, 20-player sim, 60-player sim, and future live mode.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:bot-fill-reward-boundary
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
