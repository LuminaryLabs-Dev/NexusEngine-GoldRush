# Multiplayer Room Packet

## Simulation Summary

A multiplayer reviewer expects 2-100 players to be split into deterministic 50-player room shards with readable handoff and shared ledger state.

## Expected Outcome

- 2-50 players create one shard.
- 51-100 players create two shards.
- Player 51 never enters shard 1.
- Each shard maps to a room patch window.
- Room handoff gates connect patch windows without requiring all 100 players to exist.

## Assumptions

- Real network transport can arrive later.
- The current proof can be deterministic local state.
- Room patches should be visible enough that a player understands a larger world exists.

## Failure Signs

- Player count changes only counters, not room/window state.
- Terrain is one shared arena with no room ownership.
- Handoff events exist but do not connect to scene/loading transitions.
- Cashout/combat receipts are not tied back to the shared match ledger.

## Evidence Needed

- Room orchestration validator.
- Runtime snapshot with 72 players, 2 shards, 2 active patch windows.
- HUD proof for shard counts and patch windows.

## Recommended Next Action

Tie path/gold/town descriptors to room windows so each shard has clear local gameplay space.
