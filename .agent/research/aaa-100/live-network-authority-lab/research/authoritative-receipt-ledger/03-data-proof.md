# Authoritative Receipt Ledger Data Proof

Status: planned

## Data Seed

- `ledgerId`
- `sequence`
- `receiptCount`
- `checkpointId`
- `rejectedCount`

## Event Seed

- `receipt.accepted`
- `receipt.rejected`
- `ledger.checkpointed`

## Proof Seed

- Validator: `validate-authoritative-receipt-ledger.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Conflicting mine, damage, and cashout attempts create one accepted receipt path and clear rejections.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
