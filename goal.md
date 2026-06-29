# NexusEngine Gold Rush Goal

## Objective

Build Gold Rush as a NexusRealtime-driven multiplayer extraction battle royale that merges both legacy Gold Rush Unity projects into one browser-playable game.

## Required End State

- Legacy assets from both old Gold Rush projects are copied into this repo through GPT/cloud-side transfer.
- Raw files land in `raw/imported/<jobId>/` only.
- Sanitation outputs land in `sanitized/`.
- Browser runtime assets land in `public/assets/` only after approval.
- The app deploys from the `Build` branch.
- The game uses NexusRealtime as the runtime contract and custom Gold Rush kits for orchestration.
- 2-100 players are supported by generated 50-player room shards.

## Room Model

```txt
match
├─ lobby room
├─ shard A: players 1-50
├─ shard B: players 51-100
├─ shared match ledger
├─ extraction/cashout ledger
└─ final scoring ledger
```

Rooms are generated incrementally. The app must never require all 100 players to exist before the match can begin.

## Game Loop

```txt
lobby
-> drop
-> prospect
-> carry gold
-> combat or evade
-> extract/cash out
-> pressure collapse
-> final rush
-> match result
```

## Perspective Rule

Exploration, traversal, mining, and extraction use the extraction camera. Combat switches to the combat camera and combat HUD state.
