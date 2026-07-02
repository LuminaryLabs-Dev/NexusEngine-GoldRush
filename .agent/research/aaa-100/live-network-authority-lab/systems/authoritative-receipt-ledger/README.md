# 12 Authoritative Receipt Ledger

Status: planned

## Purpose

Order irreversible gameplay facts such as mined gold, damage, cargo loss, cashout, score, and results.

## Player Need

Players should see one consistent story of who mined, fought, carried, extracted, and won.

## Owning Kits

- Generic incubator candidate: `n:network:receipt-ledger`
- GoldRush custom kit: `n:goldrush:authoritative-receipt-ledger`

## Public API Seed

- `appendReceipt(receipt)`
- `getLedgerSnapshot()`
- `verifyReceipt(receiptId)`

## Internal API Seed

- `assignReceiptSequence(receipt)`
- `rejectConflictingReceipt(receipt)`
- `checkpointLedger()`

## Events

- `receipt.accepted`
- `receipt.rejected`
- `ledger.checkpointed`

## Snapshot

- `ledgerId`
- `sequence`
- `receiptCount`
- `checkpointId`
- `rejectedCount`

## Validator

`validate-authoritative-receipt-ledger.mjs`

## Player-View Proof

Conflicting mine, damage, and cashout attempts create one accepted receipt path and clear rejections.

## Risk If Missing

Without an authoritative ledger, extraction and scoring become client-local fiction.
