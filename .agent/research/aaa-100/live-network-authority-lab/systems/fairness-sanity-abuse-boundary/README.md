# 16 Fairness Sanity Abuse Boundary

Status: planned

## Purpose

Reject impossible commands and define what client-side authority is never allowed to decide.

## Player Need

Players need fair mining, damage, cashout, and scoring even when peers are untrusted.

## Owning Kits

- Generic incubator candidate: `n:network:sanity-boundary`
- GoldRush custom kit: `n:goldrush:fairness-sanity-abuse-boundary`

## Public API Seed

- `validateClientCommand(command)`
- `getSanitySnapshot()`
- `reportSuspiciousCommand(command)`

## Internal API Seed

- `checkRateLimit(peerId)`
- `checkSpatialPlausibility(command)`
- `compareAgainstLedger(command)`

## Events

- `sanity.command.accepted`
- `sanity.command.rejected`
- `sanity.suspicion.reported`

## Snapshot

- `peerId`
- `acceptedCount`
- `rejectedCount`
- `rateLimitState`
- `lastRejectReason`

## Validator

`validate-fairness-sanity-boundary.mjs`

## Player-View Proof

Impossible speed, distance mining, duplicate cashout, and impossible damage commands are rejected with readable reasons.

## Risk If Missing

A P2P match without sanity boundaries is not a fair battle royale; it is a trust demo.
