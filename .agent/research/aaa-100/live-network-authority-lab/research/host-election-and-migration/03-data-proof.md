# Host Election And Migration Data Proof

Status: planned

## Data Seed

- `hostId`
- `candidateIds`
- `migrationEpoch`
- `frozenCommandCount`
- `resumeSnapshotId`

## Event Seed

- `host.elected`
- `host.migration.started`
- `host.migration.completed`
- `host.migration.failed`

## Proof Seed

- Validator: `validate-host-election-migration.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: A host disconnect test freezes commands, selects a replacement or exits with a clear failure receipt.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
