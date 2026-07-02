# Public Deploy Network Readiness Contract

Status: planned

## Domain Contract

- `domainPath`: `n:goldrush:public-deploy-network-readiness`
- `genericCandidate`: `n:network:deploy-readiness`
- `purpose`: Check public Pages networking behavior, signaling availability, secure context, and proof-safe configuration.
- `publicApi`: small commands and queries only.
- `internalApi`: transport adapters, ordering, validation, queues, correction, and proof helpers stay private.
- `events`: facts emitted for other kits.
- `snapshot`: serializable state for debug, replay, simulator, and proof.
- `reset`: clears connection state, queues, timers, command buffers, and proof-only handles.
- `validator`: `validate-public-deploy-network-readiness.mjs`
- `graduationRule`: generic kit may graduate only if GoldRush mode names, map rules, and game-specific receipts are removed.

## Atomic Implementation Later

1. Create data schema.
2. Create snapshot and reset.
3. Emit one event.
4. Add validator.
5. Add a proof label that prevents overclaiming.
