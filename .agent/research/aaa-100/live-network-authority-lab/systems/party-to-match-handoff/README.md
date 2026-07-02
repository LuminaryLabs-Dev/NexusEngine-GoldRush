# 02 Party To Match Handoff

Status: planned

## Purpose

Move a four-player party lobby into a larger match contract without mixing party transport with match authority.

## Player Need

A party leader should launch the crew cleanly while each member gets the same train and spawn handoff.

## Owning Kits

- Generic incubator candidate: `n:network:party-match-handoff`
- GoldRush custom kit: `n:goldrush:party-to-match-handoff`

## Public API Seed

- `createHandoff(partySnapshot)`
- `acceptHandoff(peerId)`
- `getHandoffStatus()`

## Internal API Seed

- `buildSeatManifest(party)`
- `verifyPartyReadiness(party)`
- `sealLaunchReceipt(receipt)`

## Events

- `party.handoff.created`
- `party.handoff.accepted`
- `party.handoff.sealed`

## Snapshot

- `partyCode`
- `leaderId`
- `memberIds`
- `readyCount`
- `handoffReceiptId`

## Validator

`validate-party-to-match-handoff.mjs`

## Player-View Proof

Host and members see the same launch receipt, train boarding policy, and match seed before entering gold-field.

## Risk If Missing

If handoff is ad hoc, parties desync during train loading and later network proof becomes impossible to trust.
