# Delta Compression And Priority Data Proof

Status: planned

## Data Seed

- `peerId`
- `queuedBytes`
- `sentBytes`
- `droppedCount`
- `criticalReceiptLag`

## Event Seed

- `delta.queued`
- `delta.sent`
- `delta.coalesced`
- `delta.dropped`

## Proof Seed

- Validator: `validate-delta-priority.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Under stress, receipts and close threats remain prioritized while far movement updates are coalesced or dropped.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.
