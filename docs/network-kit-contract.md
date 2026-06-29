# Network Kit Contract

## Purpose

`engine.n.goldrushNetwork` is the public multiplayer/network contract for Gold Rush.

The old shard structure is now internal infrastructure. It exists so the game can support 2-100 simulated players with 50-player partitions, but first-screen UX, core game feel, and future feature passes should talk about the network, match, terrain, gold, combat, and extraction loop instead of foregrounding shards.

## Public API

```txt
engine.n.goldrushNetwork.generate({ players, phase })
engine.n.goldrushNetwork.snapshot()
engine.n.goldrushNetwork.joinPlayer({ playerId, source })
engine.n.goldrushNetwork.leavePlayer({ playerId, reason })
engine.n.goldrushNetwork.handoff({ playerId, fromPartitionId, toPartitionId, reason })
engine.n.goldrushNetwork.validate()
```

## Internal Policy

- Minimum simulated players: `2`.
- Maximum simulated players: `100`.
- Internal partition capacity: `50`.
- Primary UI does not own player joining.
- Multi-browser instance testing can exercise joining outside the first-screen workflow.
- `engine.n.goldrushRooms` remains a compatibility facade until all old room references are migrated.
- Player 51 creates partition 2 through the incremental session allocator.
- If player count drops below 51 after partition 2 has existed, partition 2 stays retained until match end so handoff, combat summaries, and ledger references do not lose identity.
- Active players compact into earlier partitions after leaves; retained partitions keep deterministic ids and room windows.

## Resolution Criteria

- `validate-network-kit.mjs` proves 2, 50, 51, 72, 100, invalid low, invalid high, and NaN player counts.
- Runtime snapshots expose `network.status === "ready"`.
- Runtime snapshots keep partitions marked `visibility: "internal"`.
- Runtime snapshots expose `policy.partitionRetention === "retain-high-water-until-match-end"`.
- Network ledgers include `player-join`, `player-leave`, and `room-handoff` write domains.
- The primary HUD shows network readiness, not raw partition distribution.
- Reopen only if capacity, transport, room topology, or external multiplayer joining changes.
