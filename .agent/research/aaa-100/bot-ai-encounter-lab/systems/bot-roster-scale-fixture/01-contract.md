# Bot Roster Scale Fixture Contract

Status: planned

## Domain Contract

- `domainPath`: `n:goldrush:staging-bot-roster`
- `genericCandidate`: `n:ai:bot-roster`
- `purpose`: Create deterministic bot rosters for solo, 20-player, and 60-player staged runs.
- `publicApi`: small commands and queries only.
- `internalApi`: route scoring, terrain sampling, behavior scoring, and proof helpers stay private.
- `events`: facts emitted for other kits.
- `snapshot`: serializable state for debug, replay, simulator, and proof.
- `reset`: clears behavior state, pending timers, target state, and proof-only handles.
- `validator`: `validate-bot-roster-scale-fixture.mjs`
- `graduationRule`: generic kit may graduate only if all GoldRush names, rules, and asset assumptions are removed.

## Atomic Implementation Later

1. Create data schema.
2. Create snapshot and reset.
3. Emit one event.
4. Add validator.
5. Add one browser or simulator proof if player-facing.
