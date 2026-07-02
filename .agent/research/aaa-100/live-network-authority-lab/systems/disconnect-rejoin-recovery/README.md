# 14 Disconnect Rejoin Recovery

Status: planned

## Purpose

Define what happens when party members, live players, or authority peers leave and return.

## Player Need

A dropped connection should produce readable status, fair cargo policy, and controlled rejoin behavior.

## Owning Kits

- Generic incubator candidate: `n:network:reconnect-recovery`
- GoldRush custom kit: `n:goldrush:disconnect-rejoin-recovery`

## Public API Seed

- `markDisconnected(peerId)`
- `attemptRejoin(peerId, token)`
- `getRecoverySnapshot()`

## Internal API Seed

- `lockInventory(peerId)`
- `expireRecoveryWindow(peerId)`
- `restoreFromCheckpoint(peerId)`

## Events

- `peer.disconnected`
- `peer.rejoin.requested`
- `peer.rejoined`
- `peer.recovery.expired`

## Snapshot

- `peerId`
- `recoveryState`
- `lockedCargo`
- `windowMs`
- `lastCheckpointId`

## Validator

`validate-disconnect-rejoin-recovery.mjs`

## Player-View Proof

Disconnect tests show clear cargo/inventory lock, timeout, rejoin, or drop conversion policy.

## Risk If Missing

Without recovery policy, live proof will hide state corruption behind normal network flakiness.
