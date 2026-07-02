# Network Mode Policy Contract

Status: planned

## Domain Contract

- `domainPath`: `n:goldrush:network-mode-policy`
- `genericCandidate`: `n:network:mode-policy`
- `purpose`: Separate local, public proof, bot staging, simulated scale, peer party, and future live 60-player modes.
- `publicApi`: small commands and queries only.
- `internalApi`: transport adapters, ordering, validation, queues, correction, and proof helpers stay private.
- `events`: facts emitted for other kits.
- `snapshot`: serializable state for debug, replay, simulator, and proof.
- `reset`: clears connection state, queues, timers, command buffers, and proof-only handles.
- `validator`: `validate-network-mode-policy.mjs`
- `graduationRule`: generic kit may graduate only if GoldRush mode names, map rules, and game-specific receipts are removed.

## Atomic Implementation Later

1. Create data schema.
2. Create snapshot and reset.
3. Emit one event.
4. Add validator.
5. Add a proof label that prevents overclaiming.
