# NexusEngine Gold Rush

`NexusEngine-GoldRush` is the destination repo for a NexusRealtime-driven browser rebuild of the old Gold Rush Unity games.

The repo is intentionally structured as a thin game host:

- NexusRealtime owns the runtime contract.
- NexusRealtime-Kits and ProtoKits provide reusable domain behavior.
- Gold Rush custom kits compose the game loop, room orchestration, and asset registry.
- Legacy assets arrive through cloud-side import and sanitation gates.

## Local Rule

Only this repository should be cloned and edited locally for this workflow. Legacy Gold Rush assets must be moved by GPT-it/cloud/GitHub-side work into this repo.

## First Playable Shape

- 2-100 player target.
- Room shards hold up to 50 players.
- Multi-room orchestration generates shard data incrementally.
- Exploration/extraction view switches to combat view when combat state is active.
- Asset registry reads promoted runtime assets only from `public/assets`.
- The current playable loop lets the player mine gold, survive an ambush, and cash out through NexusRealtime kit APIs.
- Placeholder asset slots are stable IDs that future sanitized legacy assets can fill.
- Scene, transition, audio, and animation slots are represented in NexusRealtime scene state before legacy files are imported.
- The visible arena is a GoldRush-local procedural terrain kit stack with many small tessellated patches, not a circular primitive placeholder.
- Towns, mountains, paths, gold zones, loading gates, and room patch windows are represented by `engine.n.goldrushWorld`.

## Commands

```bash
npm install
npm run check
npm run dev
```

`npm run check` validates room-shard boundaries, NexusRealtime `engine.n.*` kit wiring, world descriptors, procedural renderer kits, runtime asset boundaries, asset registry promotion fields, and the production build.

## Deploy

Pushing the `Build` branch runs `.github/workflows/deploy-build.yml` and publishes the static Vite build to GitHub Pages.
