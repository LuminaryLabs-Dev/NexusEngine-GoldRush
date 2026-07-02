# Fairness And Abuse Boundary - Contract

Status: planned docs-only
System: 15
Domain: network/security/economy

## 10 Point Kit Contract

1. domainPath: n:runtime:fairness-boundary
2. purpose: Define minimum anti-abuse and sanity rules before rewards, public matches, or persistent progression become meaningful.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: claim.submitted, claim.validated, claim.rejected, reward.blocked, fairness.alerted.
6. snapshot: action id, authority source, client claim, server/sim validation state, reward eligibility, suspicion reason.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: action id, authority source, client claim, server/sim validation state, reward eligibility, suspicion reason.
9. validator: Abuse simulation tries duplicate mine, out-of-range cashout, impossible cargo, stale party reward, and replay mutation.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:economy-fairness
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
