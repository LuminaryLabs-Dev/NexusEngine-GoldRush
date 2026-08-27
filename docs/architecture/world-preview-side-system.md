# World Preview Side System

Gold Rush has a development-only Three.js world preview surface for spatial review and camera planning.

```text
Gold Rush world descriptors
        ↓
src/dev/world-preview/worldPreviewScene.js
        ↓
named camera preset
        ↓
Three.js development render
        ↓
headless Playwright capture
```

This is **not** a second world authority. It reads `createGoldRushWorldElements()` and converts those semantic descriptors into simple review geometry. Production gameplay does not import the preview system.

## Camera presets

- `isometric` — orthographic whole-world composition view; canonical reusable isometric review angle.
- `overview` — high perspective read of the full world silhouette.
- `westBasin` — exploration framing for Dustfall Station, West Drywash, and the western ridge.
- `coyoteJunction` — settlement and cover composition on the east side.
- `sunderedCamp` — later-run combat framing around the central settlement.
- `extractionVista` — cashout route and escape-direction review.
- `finalRush` — lower dramatic angle for collapse/final-rush presentation.

The browser surface accepts:

```text
/dev/world-preview.html?camera=isometric&phase=prospect
/dev/world-preview.html?camera=finalRush&phase=collapse
```

The capture runner is:

```bash
node tools/proof/world-camera-preview.mjs
node tools/proof/world-camera-preview.mjs --preset isometric
node tools/proof/world-camera-preview.mjs --preset finalRush --phase collapse
```

Captures are written to `artifacts/world-camera-preview/` with a JSON manifest containing the camera and source-world metadata.

## Boundary

The side system may:

- read world descriptors;
- create presentation-only review geometry;
- select camera presets;
- capture screenshots;
- compare spatial composition over time.

It must not:

- change gameplay state;
- own terrain or collision truth;
- alter mining, combat, extraction, match, or networking state;
- be imported by `src/main.js`;
- become a production renderer dependency.

When the canonical world gains richer terrain/resource/structure descriptors, the preview should read those same descriptors rather than inventing parallel data.
