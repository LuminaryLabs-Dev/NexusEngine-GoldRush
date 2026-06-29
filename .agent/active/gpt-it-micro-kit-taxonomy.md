# GPT-it Micro-Kit Taxonomy Pass

Status: active

## GPT-it Result

The ChatGPT project tab was controlled through Chrome DevTools Protocol using Node's built-in WebSocket. Prompt send succeeded in the `NexusRealtime/Experiments` project.

Captured response was partially collapsed/truncated by ChatGPT after the mine/camp section, but the usable guidance was:

- Move from count-first descriptors to authored micro-kits rendered clearly.
- Keep every object as a stable `goldrush.micro.*` descriptor.
- Add authored placement zones for mine camp, town edge, trail, canyon, and gold fields.
- Replace even scatter with clustered composition rules.
- Batch by visual role, material bucket, LOD, and silhouette importance.
- Make gold read as ore veins, pans, nuggets, tailings, and seam accents.
- Add renderer readability controls and validation gates beyond screenshots.

Follow-up GPT-it prompt for `goldrush-microkit-readability-pass-01` recommended:

- integrated canyon wall segments, mesa blocks, slope skirts, strata ribbons, shadow pockets, and rim caps.
- explicit zone model for canyon wall/floor, trail edge, mine camp, town frontage, and gold seam zones.
- placement roles: landmark, support, dressing, noise.
- cap noise per zone and push small clutter to edge bands.
- readable mine cluster with entrance frame, support timbers, ore cart, tailings, lanterns, warning signs, tools, and rope.
- replace scattered shard gold with seam veins, nuggets, tailings, and embedded ore readability.

## Local Application

- Expanded `src/content/goldrushObjectMicroKits.js` into `micro-taxonomy-v2`.
- Object kits now include `kit`, `archetype`, `role`, `biome`, `placement`, `visual`, `transform`, and `debug` metadata.
- Current generated scale is `3,252` individual object kits across `15` placement zones.
- Added `goldrush.procLandmarks.canyonComposition` for large authored canyon walls.
- Added validation for placement zones, role coverage, taxonomy metadata, and canyon framing.
- Added validation for integrated canyon families, readable mine camp families, gold seam zone, and four placement roles.
- Added noise-control/frontage pass:
  - capped open-field noise to 500 descriptors.
  - added `town.frontage-facade`, `town.water-tower`, and `town.frontage-prop` families.
  - added `trail.foreground-rut` and `trail.edge-brush` families.
  - added route ribbon rendering for a clearer player path.
  - corrected town landmark scale/materials after screenshot review.

## Latest Proof

- `npm run check` passed.
- Latest screenshot: `.playwright-cli/page-2026-06-29T07-26-57-121Z.png`.
