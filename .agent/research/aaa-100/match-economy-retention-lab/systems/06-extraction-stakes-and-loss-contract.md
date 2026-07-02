# Extraction Stakes And Loss - Contract

Status: planned docs-only
System: 06
Domain: gameplay/match/results

## 10 Point Kit Contract

1. domainPath: n:gameplay:extraction-stakes
2. purpose: Define what is lost, banked, dropped, contested, or converted when extraction succeeds, fails, or is interrupted.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: stake.created, extraction.interrupted, cargo.dropped, stake.recovered, stake.banked, stake.lost.
6. snapshot: stake id, carried value, banked value, dropped value, interruption state, contest severity, recovery window.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: stake id, carried value, banked value, dropped value, interruption state, contest severity, recovery window.
9. validator: Edge-case simulation proves disconnect, death, interruption, timeout, and contested cashout outcomes.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:extraction-stakes
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
