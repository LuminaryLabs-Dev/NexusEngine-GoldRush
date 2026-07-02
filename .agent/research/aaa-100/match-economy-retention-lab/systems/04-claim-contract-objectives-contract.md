# Claim Contract Objectives - Contract

Status: planned docs-only
System: 04
Domain: gameplay/objectives/match

## 10 Point Kit Contract

1. domainPath: n:gameplay:contract-objectives
2. purpose: Turn a match into readable claim objectives: prospect, mine, defend, haul, contest, cashout, and survive.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: contract.offered, contract.accepted, contract.progressed, contract.contested, contract.completed, contract.failed.
6. snapshot: contract id, objective type, route target, value promise, risk tier, completion rule, failure rule, team state.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: contract id, objective type, route target, value promise, risk tier, completion rule, failure rule, team state.
9. validator: Scenario proof verifies each contract can start, progress, fail, complete, and summarize without hidden helpers.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:claim-contracts
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
