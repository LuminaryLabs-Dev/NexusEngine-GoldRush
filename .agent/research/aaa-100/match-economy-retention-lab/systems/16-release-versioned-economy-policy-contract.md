# Release Versioned Economy Policy - Contract

Status: planned docs-only
System: 16
Domain: release/governance/economy

## 10 Point Kit Contract

1. domainPath: n:release:economy-version
2. purpose: Version all economy/progression decisions so public builds, local tests, and future restarts can compare the same rules.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: economy.version.loaded, release.rule.changed, proof.version.recorded, restart.packet.written.
6. snapshot: economy version, content version, ruleset id, deploy branch, proof date, compatibility, migration note.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: economy version, content version, ruleset id, deploy branch, proof date, compatibility, migration note.
9. validator: Release validator proves local/public ruleset ids match and result reports include economy/progression version.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:economy-release-policy
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
