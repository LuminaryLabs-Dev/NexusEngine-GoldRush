# Partition Handoff And Cross Room Events Data Proof

Status: planned

## Data Seed

- `partitionId`
- `entityCount`
- `handoffCount`
- `mirrorCount`
- `dedupeCount`

## Event Seed

- `partition.entity.exit`
- `partition.entity.enter`
- `partition.event.mirrored`

## Proof Seed

- Validator: `validate-partition-handoff-events.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: An entity crossing a partition keeps one identity, one cargo state, and one receipt sequence.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
