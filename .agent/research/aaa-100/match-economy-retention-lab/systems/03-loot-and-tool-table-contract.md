# Loot And Tool Table - Contract

Status: planned docs-only
System: 03
Domain: gameplay/content/economy

## 10 Point Kit Contract

1. domainPath: n:gameplay:loot-table
2. purpose: Define tools, weapons, consumables, and utility items as readable western loot rather than random props.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: loot.spawned, loot.seen, loot.picked, loot.used, loot.dropped, loot.depleted.
6. snapshot: item id, category, rarity, role, spawn rule, carry burden, use effect, counterplay, approved asset slot.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: item id, category, rarity, role, spawn rule, carry burden, use effect, counterplay, approved asset slot.
9. validator: Loot table validator proves every item has role, rarity, spawn rule, effect, counterplay, and presentation placeholder.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:western-tools
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
