# 13 Partition Handoff And Cross Room Events

Status: planned

## Purpose

Move entities and event summaries across internal room partitions without duplicating authority.

## Player Need

Cross-region combat, cashout, and final-rush pressure should stay consistent when players move between regions.

## Owning Kits

- Generic incubator candidate: `n:network:partition-handoff`
- GoldRush custom kit: `n:goldrush:partition-handoff-events`

## Public API Seed

- `handoffEntity(entityId, targetPartition)`
- `mirrorEventSummary(event)`
- `getPartitionSnapshot()`

## Internal API Seed

- `sealPartitionExit(entity)`
- `claimPartitionEntry(entity)`
- `dedupeCrossPartitionEvent(event)`

## Events

- `partition.entity.exit`
- `partition.entity.enter`
- `partition.event.mirrored`

## Snapshot

- `partitionId`
- `entityCount`
- `handoffCount`
- `mirrorCount`
- `dedupeCount`

## Validator

`validate-partition-handoff-events.mjs`

## Player-View Proof

An entity crossing a partition keeps one identity, one cargo state, and one receipt sequence.

## Risk If Missing

Partition bugs create duplicate players, lost cargo, or fights that resolve differently in each room.
