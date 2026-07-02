# Interest Management Regions Data Proof

Status: planned

## Data Seed

- `peerId`
- `regionId`
- `entityCount`
- `priorityBudget`
- `hiddenEntityCount`

## Event Seed

- `interest.region.changed`
- `interest.entity.added`
- `interest.entity.removed`

## Proof Seed

- Validator: `validate-interest-management-regions.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: A 60-entity simulated match keeps per-peer replicated entities within budget while preserving nearby threats/objectives.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
