# Gold Rush World Elements Expansion

## Summary

Gold Rush now has a GoldRush-local world element domain for massive terrain, towns, mountains, landmarks, paths, gold zones, loading gates, and room patch windows.

## Context

The current source of truth is local procedural data until GPT/cloud-side inventory can safely inspect legacy Unity YAML and scripts. Local Codex must not clone the old Unity repos. Legacy files remain reference inputs only until a private cloud worker scans and imports approved candidates.

## Domains

- Terrain scale: 5.2 km by 3.4 km conceptual world, split into deterministic 128 m patch units.
- Room patches: two 50-player room windows mapped to west/east terrain regions.
- Towns: Dustfall Station, Coyote Junction, and Sundered Camp as early settlement anchors.
- Mountains: mesa and ridge blockers for horizon, boundaries, and combat backdrop.
- Rocks/scatter: rocks, cactus, fences, ore props as descriptor fields.
- Gold zones: four multiplayer contention zones with radius and richness values.
- Paths: station, basin, rail, and cashout routes.
- Loading: train bridge and cashout yard gates for future room handoff transitions.

## Expansion

### Mountains

- Local descriptor: `mountainRanges`.
- Purpose: establish world bounds, distant read, combat backdrops, and route occlusion.
- Runtime owner: `engine.n.goldrushWorld`.
- Renderer behavior: custom ridge geometry, not primitive circles.
- Validation: at least three ranges, each high enough to read as a horizon blocker.

### Rocks And Scatter

- Local descriptor: `scatterFields`.
- Purpose: fill terrain with rocks, cactus, fences, ore props, and cover intent.
- Runtime owner: `engine.n.goldrushWorld`.
- Renderer behavior: descriptor-ready; no raw asset dependency yet.
- Validation: deterministic count, anchor, spread, and kind per scatter field.

### Towns

- Local descriptor: `towns`.
- Purpose: lobby/station identity, mid-map settlement cover, and combat/cashout anchors.
- Runtime owner: `engine.n.goldrushWorld`.
- Renderer behavior: custom procedural building geometry for each listed building.
- Validation: at least three towns, including station and saloon-like settlement roles.

### Gold Zones

- Local descriptor: `goldZones`.
- Purpose: multiplayer mining contention and score-risk clustering.
- Runtime owner: `engine.n.goldrushWorld` plus `engine.n.goldrushMining`.
- Renderer behavior: translucent zone fields and gold-node scatter.
- Validation: at least four broad zones, each tied to room windows.

### Loading And Room Patch Windows

- Local descriptor: `roomPatchWindows` and `loadingGates`.
- Purpose: map 50-player shards to terrain windows and prepare room handoff transitions.
- Runtime owner: `engine.n.goldrushWorld` plus `engine.n.goldrushRooms`.
- Renderer behavior: active window count appears in HUD.
- Validation: 72 players activates two room patch windows and at least two loading gates.

### Paths

- Local descriptor: `paths`.
- Purpose: visible routes from station to basin, rail, town, and cashout.
- Runtime owner: `engine.n.goldrushWorld`.
- Renderer behavior: procedural path markers across the terrain field.
- Validation: every path has at least four points.

## Alignment

This stays aligned with the prior constraints:

- only GoldRush-local code and docs were added.
- old Unity source remains cloud-side only.
- runtime still consumes NexusRealtime snapshots.
- renderer consumes descriptors and does not own match state.
- no raw Unity files or private repo paths were imported.

## Reconciliation

The broad pass is intentionally large but safe: it adds world-scale structure now, while leaving exact Unity YAML/script evidence pending from GPT/cloud-side search. When that evidence arrives, the descriptors should be refined instead of replaced.

## Usable Output

Implementation surfaces:

```txt
src/content/goldrushWorldElements.js
src/kits/goldRushDomainKits.js -> engine.n.goldrushWorld
src/renderer/proceduralKits.js -> goldrush.procWorld.elements
tools/validation/validate-world-elements.mjs
tools/validation/validate-procedural-renderer-kits.mjs
```

Next cloud evidence should map Unity YAML/script findings into these fields:

```txt
mountainRanges
scatterFields
towns
landmarks
goldZones
paths
loadingGates
roomPatchWindows
```

## Notes

Have I checked whether this expansion still aligns with the prior goals, and do I need to trim or reframe anything before outputting it?

Yes. The expansion stays bounded to NexusEngine-GoldRush and preserves the asset-import safety boundary.
