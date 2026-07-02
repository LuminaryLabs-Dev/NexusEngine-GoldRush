# Replication Snapshot Contract Data Proof

Status: planned

## Data Seed

- `snapshotId`
- `baseId`
- `tick`
- `scope`
- `entityCount`
- `byteSize`

## Event Seed

- `replication.snapshot.built`
- `replication.delta.applied`
- `replication.delta.rejected`

## Proof Seed

- Validator: `validate-replication-snapshot-contract.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Snapshots are bounded, serializable, ordered, and sufficient to reconstruct match state after a reconnect.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
