# Room Orchestration

Gold Rush targets 2-100 players with 50-player room shards.

## Room Types

- `lobby`: matchmaking, party grouping, load readiness.
- `shard`: active gameplay for up to 50 players.
- `ledger`: match-scoped authoritative room data.
- `handoff`: temporary transition data when players cross shard or phase boundaries.

## Incremental Generation

The match starts with one shard and adds the second shard only when player count exceeds 50.

```txt
2-50 players   -> shard-1
51-100 players -> shard-1 + shard-2 + shared ledger
```

## Edge Cases

- Player 51 joins while match is starting: create shard 2 before drop.
- Player count falls below 51: keep shard 2 alive until match end to avoid state loss.
- Combat crosses shard boundary: resolve combat in the attacker's current shard and mirror summary events to the shared ledger.
- Extraction is shared: cashout writes to the match ledger, not only a shard ledger.
- Disconnects keep inventory locked for a timeout before converting to dropped cargo.
