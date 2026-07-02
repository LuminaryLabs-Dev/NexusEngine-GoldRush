# Latency Jitter Loss Simulator Domain Implication

Status: planned

## Domain Impact

- Generic candidate: `n:network:chaos-simulator`
- GoldRush custom kit: `n:goldrush:latency-jitter-loss-simulator`
- Consumes: network mode, party state, scene phase, commands, snapshots, receipts, and proof policy.
- Emits: events and snapshots consumed by runtime, gameplay, simulator, proof, and results.

## Architecture Implication

This belongs in domain service kits, not ad hoc app-host callbacks. If it becomes too specific, split the generic candidate from the GoldRush custom rules rather than expanding one mixed kit.

## Integration Web

```txt
mode policy
-> transport readiness
-> authority and ledger
-> snapshot replication
-> prediction/recovery
-> proof report
```
