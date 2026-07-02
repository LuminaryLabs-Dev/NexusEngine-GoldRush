# Progression Without Grind - Contract

Status: planned docs-only
System: 11
Domain: progression/product/ux

## 10 Point Kit Contract

1. domainPath: n:progression:unlock-rules
2. purpose: Define future meta progression that supports identity and learning without burying the core extraction loop.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: progression.earned, unlock.available, unlock.equipped, cap.reached, reset.applied.
6. snapshot: progression track, unlock type, eligibility, cap, reset policy, cosmetic flag, gameplay flag, proof requirement.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: progression track, unlock type, eligibility, cap, reset policy, cosmetic flag, gameplay flag, proof requirement.
9. validator: Progression validator proves optionality, no first-screen clutter, no reward in ineligible modes, and no gameplay paywall.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:progression-boundary
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
