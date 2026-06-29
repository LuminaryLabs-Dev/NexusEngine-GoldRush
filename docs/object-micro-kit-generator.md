# Object Micro-Kit Generator

Gold Rush object dressing now uses generated individual object micro-kits instead of hand-authored one-off scene clutter.

## Contract

- Source: `src/content/goldrushObjectMicroKits.js`
- Runtime mount: `src/renderer/proceduralKits.js`
- Validation: `tools/validation/validate-procedural-renderer-kits.mjs`

The generator creates one descriptor per individual object. Each descriptor has a stable `goldrush.micro.*` id, family, geometry role, material role, gameplay tags, transform, color, and LOD.

## Current Scale

- `3,105` individual object micro-kits.
- `34` object families.
- `17` authored placement zones.
- Families cover surface ripples, gravel, red rock, dry grass, scrub, cactus sprouts, gold flecks, ore chips, camp debris, trail markers, canyon strata, combat cover, rail ballast, town debris, and dust anchors.

## Rendering Strategy

The renderer batches compatible individual kits into `THREE.InstancedMesh` buckets. This keeps the object model granular while avoiding thousands of separate draw calls.

## Visual Direction

The first pass intentionally prioritizes coverage and validation. The next art pass should:

- reduce clutter clumps around the player path.
- add authored canyon wall silhouettes and town landmarks.
- improve lighting and color separation.
- replace remaining primitive-looking camp and mine shapes with richer kit geometry.
- make gold flecks read as ore and reward zones instead of scattered debug shards.

## GPT-it Guidance Applied

GPT-it recommended evolving the descriptors from count-first scenery points into authored object kits. The local descriptor contract now includes stable kit ids, archetypes, roles, placement zones/clusters/anchors, visual batch keys, silhouette metadata, transforms, and debug provenance.

The current readability pass adds integrated canyon wall/skirt/ribbon/shadow families, mine camp landmark/support families, gold seam/tailings families, town frontage landmarks, and foreground trail support. The latest screenshot shows the old debug grid and sky dome remain resolved, the giant right canyon block is less dominant, town silhouettes are smaller after correction, and the next visual gap is higher-fidelity authored prop geometry plus stronger landmark clusters.

## GPT-it Status

GPT-it was attempted through the debug Chrome path. The ChatGPT project tab was reachable, but safe prompt/send/readback was blocked because the local fallback runner path was missing and no WebSocket client module was available for direct CDP control. The local implementation followed the requested GPT-it direction without waiting on that blocker.
