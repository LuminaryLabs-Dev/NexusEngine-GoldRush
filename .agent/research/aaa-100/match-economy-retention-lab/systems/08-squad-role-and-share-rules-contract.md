# Squad Role And Share Rules - Contract

Status: planned docs-only
System: 08
Domain: team/economy/network

## 10 Point Kit Contract

1. domainPath: n:team:reward-share
2. purpose: Define how Crew, Posse, and Outfit group types share information, cargo, cashout value, revive burden, and results.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: squad.rule.loaded, cargo.shared, assist.recorded, score.shared, leader.action.required.
6. snapshot: group type, member count, shared cargo rule, score split, revive rule, cashout assist, leader authority.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: group type, member count, shared cargo rule, score split, revive rule, cashout assist, leader authority.
9. validator: Party simulation verifies 1, 2, 4, and bot-filled group reward rules without hidden shard UI.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:squad-share-rules
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
