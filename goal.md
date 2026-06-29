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
- 2-100 players are supported by `engine.n.goldrushNetwork`; 50-player room partitions are internal implementation detail.

## Room Model

```txt
match
├─ lobby room
├─ internal partition A: players 1-50
├─ internal partition B: players 51-100
├─ shared match ledger
├─ extraction/cashout ledger
└─ final scoring ledger
```

Network rooms are generated incrementally behind `goldrushNetwork`. The app must never require all 100 players to exist before the match can begin, and first-screen UX should not focus on player joining.

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

Exploration, traversal, mining, and extraction use an over-the-shoulder travel camera. Combat switches to a closer over-the-shoulder aim camera and combat HUD state.

The camera system must be treated as a kit-owned playability proof surface, not one fixed angle. `engine.n.goldrushCamera` should expose a deterministic 1,000-pose perspective catalog across exploration, trail-follow, canyon-scout, mining-close, town-approach, combat-shoulder, cover-peek, extraction-run, spectate-crew, and replay-cinematic families. The renderer consumes the selected `threeDescriptor`; playability proof comes from sampling many families and verifying player silhouette, route, landmarks, cover, threats, gold, and terrain depth remain readable.

## World Understanding Rule

The visual target is the space of a playable gold-rush canyon environment, not a one-to-one copy of a reference picture. Reference images provide vocabulary only. Composition must come from environment-space descriptors: canyon basin, wash-floor trail, ridge walls, mine shelf, town shelf, gold seam, and extraction sightline. Props and cameras must explain those spaces first.

## Current Feedback Tracking

- Feedback bugs are tracked in `.agent/feedback/`.
- `BUG-003-character-legs-need-knees.md` is resolved locally by the two-part knee rig pass.
- `BUG-004-frame-to-frame-terrain-player-pulsing.md` is mitigated locally by cached movement-owned render grounding and native-frame crop evidence.
- `BUG-002-central-mountain-scale-and-camera-framing.md` remains open and is the next visible terrain composition issue.
