# Final Rush Pressure Economy - Contract

Status: planned docs-only
System: 07
Domain: battle-royale/match/economy

## 10 Point Kit Contract

1. domainPath: n:match:zone-pressure
2. purpose: Make shrinking-space pressure affect route choice, gold greed, cashout timing, and late-match contest value.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: rush.phase.changed, pressure.modifier.applied, greed.warning.raised, cashout.window.closing.
6. snapshot: phase, pressure radius, value modifier, extraction modifier, threat modifier, safe route count, greed warning.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: phase, pressure radius, value modifier, extraction modifier, threat modifier, safe route count, greed warning.
9. validator: Timeline simulation proves value modifiers and extraction windows change by phase and remain visible to results.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:final-rush-pressure-economy
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
