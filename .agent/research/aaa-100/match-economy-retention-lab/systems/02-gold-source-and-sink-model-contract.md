# Gold Source And Sink Model - Contract

Status: planned docs-only
System: 02
Domain: gameplay/economy/progression

## 10 Point Kit Contract

1. domainPath: n:gameplay:economy-balance
2. purpose: Separate match gold, extracted gold, score gold, and future meta gold so rewards cannot inflate or blur together.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: gold.mined, gold.carried, gold.dropped, gold.extracted, gold.banked, gold.spent, gold.balance.changed.
6. snapshot: match amount, carried amount, banked amount, lost amount, spendable amount, source id, sink id, balance version.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: match amount, carried amount, banked amount, lost amount, spendable amount, source id, sink id, balance version.
9. validator: Ledger proof verifies no duplicate gold, no negative balances, and no practice-mode persistence unless allowed.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:gold-economy
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
