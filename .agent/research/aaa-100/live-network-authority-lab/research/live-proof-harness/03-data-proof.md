# Live Proof Harness Data Proof

Status: planned

## Data Seed

- `runId`
- `peerCount`
- `machineCount`
- `proofTier`
- `snapshotDivergence`
- `failureCount`

## Event Seed

- `liveproof.started`
- `liveproof.peer.recorded`
- `liveproof.finalized`

## Proof Seed

- Validator: `validate-live-proof-harness.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Proof differentiates same-browser tabs, separate browser contexts, same machine, separate machines, public URL, and future live 60.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
