# Latency Jitter Loss Simulator Data Proof

Status: planned

## Data Seed

- `profileId`
- `latencyMs`
- `jitterMs`
- `lossRate`
- `reorderRate`
- `scenarioResult`

## Event Seed

- `chaos.profile.applied`
- `chaos.packet.delayed`
- `chaos.report.finalized`

## Proof Seed

- Validator: `validate-latency-jitter-loss-simulator.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Simulated poor network reports show movement, receipts, cashout, and disconnect policy remain bounded.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
