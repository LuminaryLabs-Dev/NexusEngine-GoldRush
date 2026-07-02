# Run Value Ladder - Contract

Status: planned docs-only
System: 01
Domain: gameplay/economy/match

## 10 Point Kit Contract

1. domainPath: n:gameplay:value-ladder
2. purpose: Define the value path from empty-handed spawn to mined gold, carried risk, cashout, score, and replay payoff.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: value.source.spawned, value.claimed, value.carried, value.extracted, value.lost, value.summarized.
6. snapshot: value tier, source type, carry risk, extraction value, score value, replay tag, pacing band.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: value tier, source type, carry risk, extraction value, score value, replay tag, pacing band.
9. validator: Simulate a run and prove every value gain/loss has source, carry, extraction, score, and replay receipts.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:run-value-ladder
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
