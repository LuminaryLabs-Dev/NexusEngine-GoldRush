# 03 Live Room Authority

Status: planned

## Purpose

Define which peer or service owns match decisions, receipts, conflict resolution, and state publication.

## Player Need

Players should not see duplicated gold, contradictory damage, or inconsistent cashout results.

## Owning Kits

- Generic incubator candidate: `n:network:room-authority`
- GoldRush custom kit: `n:goldrush:live-room-authority`

## Public API Seed

- `getAuthority()`
- `submitCommand(command)`
- `getAuthoritySnapshot()`

## Internal API Seed

- `validateCommand(command)`
- `orderCommand(command)`
- `publishAuthoritativeDelta(delta)`

## Events

- `authority.elected`
- `authority.command.accepted`
- `authority.delta.published`

## Snapshot

- `authorityId`
- `epoch`
- `commandSequence`
- `lastDeltaId`
- `conflictPolicy`

## Validator

`validate-live-room-authority.mjs`

## Player-View Proof

Two clients submit conflicting mine or cashout actions and one authoritative receipt order wins deterministically.

## Risk If Missing

Without authority, the match can only be a cooperative demo, not a reliable extraction battle royale.
