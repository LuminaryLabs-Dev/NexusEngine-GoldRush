# Replay Lesson Loop - Contract

Status: planned docs-only
System: 10
Domain: match/replay/product

## 10 Point Kit Contract

1. domainPath: n:match:replay-summary
2. purpose: Turn results into a short explanation of why the run succeeded or failed and what the player can improve.
3. publicApi: expose compact commands and queries for value, reward, eligibility, or result state.
4. internalApi: own calculation, tuning lookup, receipt reconciliation, and mode filtering behind the kit.
5. events: replay.moment.recorded, lesson.generated, next.run.suggested, summary.viewed.
6. snapshot: moment id, cause, effect, reward, loss, threat, route choice, improvement hint, next action.
7. reset: clear match-local state while preserving versioned tuning defaults.
8. dataExposed: moment id, cause, effect, reward, loss, threat, route choice, improvement hint, next action.
9. validator: Receipt replay validator proves visible result lessons derive from real run events, not generic copy.
10. graduationRule: generic behavior can graduate only if it has no GoldRush naming/rules and complete validator coverage.

## GoldRush Pair

- GoldRush kit: n:goldrush:run-lesson-summary
- GoldRush role: tune the generic surface for wild-west extraction, gold, train-entry pacing, squad claims, and cashout payoff.
