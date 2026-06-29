# World Understanding Pass

Status: active

## Correction

The current target is not to match one reference picture. The target is to understand and render the space of a playable Gold Rush environment.

## Space First

- Canyon basin: the primary playable volume.
- Wash-floor trail: the movement and extraction corridor.
- Ridge walls: geologic containers and sightline boundaries.
- Mine shelf: resource origin, rail, tailings, and tunnel relationship.
- Town shelf: street line, false fronts, cover, and skyline.
- Gold seam: reward material embedded in geology.
- Extraction sightline: route readability under pressure.

## Rules

- Reference images provide object vocabulary, not composition.
- Terrain form and sightlines come before prop count.
- Props must explain why they exist in the space.
- Every object micro-kit should carry an environment-space id.
- Screenshots should be judged by whether the space reads, not whether the reference picture was copied.

## Current Proof

- `src/content/goldrushEnvironmentSpace.js` defines renderer-space environment understanding.
- `src/content/goldrushWorldElements.js` exposes world-scale `environmentSpaces`.
- `tools/validation/validate-procedural-renderer-kits.mjs` requires environment-space descriptors and object-space ids.
- `tools/validation/validate-world-elements.mjs` requires world-scale environment spaces.
- `npm run check` passes.
- Latest Playwright proof: `.playwright-cli/page-2026-06-29T08-01-54-509Z.png`.
