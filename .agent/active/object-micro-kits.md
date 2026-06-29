# Object Micro-Kits

Status: active

## Goal

Generate thousands of individual Gold Rush object kits locally in this repo, then batch them at render time so the world can grow beyond primitive placeholders.

## Current Pass

- Added `src/content/goldrushObjectMicroKits.js`.
- Generated `3,105` individual `goldrush.micro.*` kit descriptors after capping open-field noise.
- Added `micro-taxonomy-v2` descriptor fields: `kit`, `archetype`, `role`, `biome`, `placement`, `visual`, `transform`, and `debug`.
- Added 17 authored placement zones for field, canyon, trail, mine, camp, town, rail, gold, vista, and combat composition.
- Added renderer instancing in `src/renderer/proceduralKits.js`.
- Replaced separated terrain patch meshes with one continuous terrain field mesh, while preserving patch descriptors for validation and orchestration.
- Removed the visible sky dome primitive from the scene.
- Added validated canyon composition walls through `goldrush.procLandmarks.canyonComposition`.
- Added readability-pass families for canyon wall/skirt/ribbon/shadow pieces, mine entrance/support/cart/tailings/lantern/sign props, and gold seam/tailings lines.
- Added town frontage and foreground trail families to reduce noisy open-ground scatter and improve navigation.

## Proof

- `npm run check` passed after the micro-kit generator and renderer changes.
- Playwright screenshot: `.playwright-cli/page-2026-06-29T07-26-57-121Z.png`.

## Next Visual Findings

- The grid seam problem is resolved.
- The sky dome problem is resolved.
- Open-field noise is capped and town silhouettes are smaller after correction.
- Current scene still needs higher-fidelity authored prop geometry, stronger mine/town landmark clusters, better character fidelity, and more natural lighting/material variation.
