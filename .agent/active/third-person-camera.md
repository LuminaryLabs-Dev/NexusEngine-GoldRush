# Third Person Camera

Status: active

## Purpose

Move the playable view to over-the-shoulder third person while preserving the existing NexusRealtime camera descriptors.

The camera system should prove playability from many real player situations, not only one staged screenshot. `engine.n.goldrushCamera` now owns a deterministic catalog of 1,000 player-view poses across 10 families.

## Work Items

- Exploration camera: low over-the-shoulder travel view.
- Combat camera: closer over-the-shoulder aim view.
- Renderer: visible player rig used as camera anchor.
- Validation: procedural kit must prove the camera is not top-down tactical framing.
- Catalog: 1,000 deterministic camera poses split across exploration, trail, canyon, mining, town, combat, cover, extraction, spectate, and replay families.
- Playability proof: each pose carries checks for player silhouette, route/landmark readability, terrain depth, cover/threat visibility, or gold/tool visibility.

## Current Proof

- `node tools/validation/validate-nexus-runtime.mjs` passes.
- `npm run check` passes.
- Catalog proof: 1,000 poses, 10 families, 100 poses per family, `validateGoldRushCameraPerspectives()` returns true.
- Latest Playwright proof: `.playwright-cli/page-2026-06-29T07-41-05-003Z.png`.
