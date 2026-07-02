# 09 Delta Compression And Priority

Status: planned

## Purpose

Prioritize critical receipts over low-value movement/detail updates and keep messages under size budgets.

## Player Need

Important events like damage, cashout, and extraction must arrive before decorative or distant updates.

## Owning Kits

- Generic incubator candidate: `n:network:delta-priority`
- GoldRush custom kit: `n:goldrush:delta-compression-priority`

## Public API Seed

- `queueDelta(delta)`
- `flushPriorityBudget(peerId)`
- `getQueueSnapshot(peerId)`

## Internal API Seed

- `estimatePacketBytes(packet)`
- `coalesceMovementDeltas(queue)`
- `promoteCriticalReceipt(receipt)`

## Events

- `delta.queued`
- `delta.sent`
- `delta.coalesced`
- `delta.dropped`

## Snapshot

- `peerId`
- `queuedBytes`
- `sentBytes`
- `droppedCount`
- `criticalReceiptLag`

## Validator

`validate-delta-priority.mjs`

## Player-View Proof

Under stress, receipts and close threats remain prioritized while far movement updates are coalesced or dropped.

## Risk If Missing

Unbounded deltas will turn 60-player proof into lag or invisible combat failures.
