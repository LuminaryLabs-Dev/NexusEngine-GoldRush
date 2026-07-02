# Cosmetic And Identity Boundary - Contract

Status: planned docs-only
System: 13
Domain: presentation/progression/content

## 10 Point Kit Contract

1. domainPath: n:presentation:cosmetic-loadout
2. purpose: Separate character identity, outfit, tools, lobby pose, and cosmetics from power progression and asset approval.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: identity.loaded, cosmetic.equipped, cosmetic.blocked, preview.updated.
6. snapshot: cosmetic id, slot, approval status, equip state, gameplay effect flag, lobby preview pose, source status.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: cosmetic id, slot, approval status, equip state, gameplay effect flag, lobby preview pose, source status.
9. validator: Cosmetic validator proves no unapproved asset path, no gameplay power from cosmetic slots, and clear lobby preview state.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:prospector-identity
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
