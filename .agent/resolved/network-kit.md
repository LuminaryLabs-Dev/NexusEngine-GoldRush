# Network Kit

Status: resolved

## Contract

`engine.n.goldrushNetwork` owns multiplayer topology, readiness, internal partitioning, and handoff topics.

## Owner

- Runtime kit: `n-goldrush-network-kit`
- Public API: `engine.n.goldrushNetwork`
- Compatibility API: `engine.n.goldrushRooms`

## Invariants

- Simulated player count clamps to `2..100`.
- Internal partition capacity stays `50`.
- 2-50 players use one internal partition.
- 51-100 players use two internal partitions.
- Partitions stay marked `visibility: "internal"`.
- Primary UI shows network readiness, not raw partition distribution.
- Player joining UI remains deferred while multi-browser instance testing is handled externally.

## Validation

```bash
node tools/validation/validate-network-kit.mjs
node tools/validation/validate-room-orchestration.mjs
node tools/validation/validate-nexus-runtime.mjs
```

## Reopen Only If

- Network transport changes.
- Capacity changes.
- More than two partitions are required.
- Browser instance joining becomes a first-screen UX requirement.
