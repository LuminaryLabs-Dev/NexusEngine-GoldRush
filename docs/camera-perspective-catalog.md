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
- cover-peek views should consume `readable-threat-cover-v1` fields like `peekSide`, `cameraShoulder`, and `recommendedCoverId`.
- mining views must show gold/tool readability.
- canyon views must show depth instead of a flat plane.

## Current Proof

`npm run check` validates the catalog through `tools/validation/validate-nexus-runtime.mjs`.

## Combat Pressure Boundary

The active gameplay camera is not selected from the catalog every frame. Runtime transitions now use one combat-presentation boundary:

```txt
active readable threat / aim / fire / damage
-> goldrushPerspective: combat
-> goldrushCamera: combat
-> goldrushScenes: combat scene intent
-> goldrushAnimation: aiming posture

threat defeated and aim released
-> goldrushPerspective: exploration
-> goldrushCamera: exploration
-> goldrushScenes: arena intent
-> goldrushAnimation: travel posture
```

Frontier-condition danger and extraction-site risk may still bias music, scoring, and cashout pressure. They do not keep the camera in combat without an active threat.
