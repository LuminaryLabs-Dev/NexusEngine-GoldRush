# Bot Resource Prospecting Contract

Status: planned

## Domain Contract

- `domainPath`: `n:goldrush:bot-prospecting`
- `genericCandidate`: `n:ai:objective-agent`
- `purpose`: Let bots seek gold sources so the player sees competition around resource areas.
- `publicApi`: small commands and queries only.
- `internalApi`: route scoring, terrain sampling, behavior scoring, and proof helpers stay private.
- `events`: facts emitted for other kits.
- `snapshot`: serializable state for debug, replay, simulator, and proof.
- `reset`: clears behavior state, pending timers, target state, and proof-only handles.
- `validator`: `validate-bot-resource-prospecting.mjs`
- `graduationRule`: generic kit may graduate only if all GoldRush names, rules, and asset assumptions are removed.

## Atomic Implementation Later

1. Create data schema.
2. Create snapshot and reset.
3. Emit one event.
4. Add validator.
5. Add one browser or simulator proof if player-facing.
