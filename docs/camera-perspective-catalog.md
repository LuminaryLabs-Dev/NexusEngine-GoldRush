# Camera Perspective Catalog

## Purpose

Gold Rush should not rely on one fixed camera to prove playability. The runtime owns a deterministic catalog of player-view poses so screenshots and future QA can test the game from many real situations.

## Runtime Contract

`engine.n.goldrushCamera.snapshot()` exposes:

- `perspectiveCount`: `1000`
- `perspectiveFamilies`: ten named camera families
- `perspectiveCatalog`: the serializable pose catalog
- `selectedPerspective`: the active pose packet
- `threeDescriptor`: the renderer-safe camera descriptor selected from the catalog

## Families

- `exploration-over-shoulder`: player, trail, and next terrain feature.
- `trail-follow`: foreground path readability.
- `canyon-scout`: canyon wall scale, slopes, and horizon blend.
- `mining-close`: gold seams, tools, and mining animation.
- `town-approach`: town landmarks without labels.
- `combat-shoulder`: weapon posture, cover, and threat lane.
- `cover-peek`: shoulder-side cover occlusion.
- `extraction-run`: exit route under pressure.
- `spectate-crew`: group, route, and room context.
- `replay-cinematic`: proof frames for match summaries.

## Playability Use

The catalog is not a visual gimmick. It is the proof surface for whether the game can be called playable:

- the player silhouette must read at thumbnail size.
- the route or landmark must be visible without UI labels.
- combat views must show cover and threat lanes.
- mining views must show gold/tool readability.
- canyon views must show depth instead of a flat plane.

## Current Proof

`npm run check` validates the catalog through `tools/validation/validate-nexus-runtime.mjs`.
