# 08 Replication Snapshot Contract

Status: planned

## Purpose

Define stable snapshot and delta shapes for player, bot, world, cargo, combat, and match state.

## Player Need

Remote players should move, mine, fight, and extract consistently across clients.

## Owning Kits

- Generic incubator candidate: `n:network:replication-snapshot`
- GoldRush custom kit: `n:goldrush:replication-snapshot-contract`

## Public API Seed

- `buildSnapshot(scope)`
- `applySnapshot(snapshot)`
- `getReplicationStats()`

## Internal API Seed

- `diffSnapshot(prev, next)`
- `validateSnapshotSchema(snapshot)`
- `dropStaleDelta(delta)`

## Events

- `replication.snapshot.built`
- `replication.delta.applied`
- `replication.delta.rejected`

## Snapshot

- `snapshotId`
- `baseId`
- `tick`
- `scope`
- `entityCount`
- `byteSize`

## Validator

`validate-replication-snapshot-contract.mjs`

## Player-View Proof

Snapshots are bounded, serializable, ordered, and sufficient to reconstruct match state after a reconnect.

## Risk If Missing

Vague snapshots make prediction, replay, reconnect, and public proof impossible to reason about.
