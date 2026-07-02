# Tuning And Telemetry Ledger - Contract

Status: planned docs-only
System: 14
Domain: validation/balance/runtime

## 10 Point Kit Contract

1. domainPath: n:runtime:tuning-ledger
2. purpose: Make economy, reward, pressure, threat, and progression tuning explicit and replayable across restarts.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: tuning.loaded, tuning.changed, scenario.metric.recorded, balance.decision.logged.
6. snapshot: tuning version, parameter id, value, source, scenario, outcome metric, proof link, decision state.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: tuning version, parameter id, value, source, scenario, outcome metric, proof link, decision state.
9. validator: Tuning validator proves every changed number has reason, scenario, before/after expectation, and rollback path.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:balance-ledger
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
