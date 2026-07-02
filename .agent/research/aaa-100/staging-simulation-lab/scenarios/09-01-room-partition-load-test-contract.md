# Room Partition Load Test - Contract

Status: planned docs-only
Scenario: 09 Room Partition Load Test
Domain: network/runtime
Owner kit: n:goldrush:room-partition-load-test

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Exercise the internal room partition policy without exposing shard mechanics as the player UX.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:room-partition-load-test`.
2. Confirm whether the scenario is practice, bot fill, scale simulation, browser proof, public proof, or future live network proof.
3. Define the public API call or scenario seed needed to start it.
4. Define the private setup allowed before the player route begins.
5. Define the event emitted when the scenario state changes.
6. Define the snapshot required for validator and browser proof.
7. Define the receipts that should survive scenario reset or match end.
8. Define the fakeout that must fail validation.
9. Define the human-view evidence required if the player sees or feels this scenario.
10. Define the restart packet that should be written if this scenario fails.

## Event And Snapshot

- Event: `network.partition.load.sampled`
- Snapshot: `roomPartitionLoadTest`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-room-partition-load-test`

## Human Proof Seed

Report shows partition assignment, player caps, compaction policy, disconnect/rejoin cases, and UX-safe labels.

## Fakeout To Prevent

Partition math passes but player handoff, reconnect, or party identity is untested.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.

