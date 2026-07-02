# Partition Handoff Contract

Status: active

## Purpose

Keep internal room partitions as infrastructure, not player-facing UX.

## Handoff Rules

- One entity id survives partition movement.
- Cargo, health, position, route, and receipt high-water mark travel together.
- Exit receipt is sealed before entry receipt is accepted.
- Cross-partition combat is summarized through the authoritative ledger.
- Extraction/cashout writes to match ledger, not only partition ledger.

## Failure States

- Duplicate player appears in two partitions.
- Cargo is lost during handoff.
- Same damage is accepted twice.
- Partition-local cashout result disagrees with match result.
