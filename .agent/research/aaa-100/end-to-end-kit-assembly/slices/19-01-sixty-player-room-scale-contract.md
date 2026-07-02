# Sixty Player Room Scale - Contract

Status: planned docs-only
Slice: 19 Sixty Player Room Scale
Domain: network/runtime/performance
Scene/site: match-runtime
Generic kit: n:network:room-partitions plus n:runtime:snapshot
GoldRush kit: n:goldrush:room-orchestration

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Define how 60 players, party starts, room partitions, snapshots, and public proof become testable without exposing shards as UX.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:room-orchestration` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `network.room.scale.sampled`
- Snapshot: `sixtyPlayerRoomScale`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`network scale simulator plus memory/network budget validator`

## Human-View Proof Seed

simulated 60-player roster, partition state, snapshot budget, and handoff receipts stay bounded and inspectable

## Known Fakeout

Room partition data exists but no 60-player state budget, disconnect/rejoin case, or snapshot fanout proof exists.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.

