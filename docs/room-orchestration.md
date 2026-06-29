# Room Orchestration

Status: internal compatibility layer.

Gold Rush now exposes multiplayer topology through `engine.n.goldrushNetwork`. The old 50-player shard structure remains as an internal partition policy and compatibility facade only.

## Room Types

- `lobby`: matchmaking, party grouping, load readiness.
- `partition`: internal active gameplay window for up to 50 simulated players.
- `ledger`: match-scoped authoritative room data.
- `handoff`: temporary transition data when players cross shard or phase boundaries.

## Incremental Generation

The match starts with one internal partition and adds the second partition only when simulated player count exceeds 50.

```txt
2-50 players   -> partition-1
51-100 players -> partition-1 + partition-2 + shared ledger
```

`createNetworkOrchestrator().createSession()` now owns the live incremental path:

```txt
join player 51 -> emit partition.created + player.joined
leave player 51 -> retain partition-2 as empty infrastructure
leave early partition-1 player while partition-2 is active -> compact active players into partition-1 and retain partition-2
```

## Edge Cases

- Player 51 is simulated while match is starting: create partition 2 before drop.
- Player count falls below 51: keep partition 2 alive until match end to avoid state loss.
- Player leaves from an early partition while partition 2 has active players: compact roster assignments so partition 1 fills first, but do not destroy partition 2.
- Combat crosses a partition boundary: resolve combat in the attacker's current partition and mirror summary events to the shared ledger.
- Extraction is shared: cashout writes to the match ledger, not only a partition ledger.
- Disconnects keep inventory locked for a timeout before converting to dropped cargo.
