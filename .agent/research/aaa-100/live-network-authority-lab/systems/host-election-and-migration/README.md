# 04 Host Election And Migration

Status: planned

## Purpose

Plan leader/host selection and recovery when the active match host disconnects.

## Player Need

A match should fail gracefully or migrate clearly instead of silently corrupting state.

## Owning Kits

- Generic incubator candidate: `n:network:host-election`
- GoldRush custom kit: `n:goldrush:host-election-migration`

## Public API Seed

- `electHost(roster)`
- `beginMigration(reason)`
- `getMigrationStatus()`

## Internal API Seed

- `scoreHostCandidate(peer)`
- `freezeCommands(epoch)`
- `resumeFromSnapshot(snapshot)`

## Events

- `host.elected`
- `host.migration.started`
- `host.migration.completed`
- `host.migration.failed`

## Snapshot

- `hostId`
- `candidateIds`
- `migrationEpoch`
- `frozenCommandCount`
- `resumeSnapshotId`

## Validator

`validate-host-election-migration.mjs`

## Player-View Proof

A host disconnect test freezes commands, selects a replacement or exits with a clear failure receipt.

## Risk If Missing

Peer-hosted matches without migration policy will lose state or produce unreviewable reports.
