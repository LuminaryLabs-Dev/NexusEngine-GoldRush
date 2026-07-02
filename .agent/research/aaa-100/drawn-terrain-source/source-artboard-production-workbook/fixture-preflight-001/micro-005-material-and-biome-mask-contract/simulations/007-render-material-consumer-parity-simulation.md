# 007 - Render Material Consumer Parity Simulation

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`

## Simulated Implementation Pass

1. Add `renderMaterialEcho` to the future source fixture schema or terrain surface query result.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:terrain-material-mask` and `n:goldrush:desert-materials`.
4. Add one consumer echo from render, audio, VFX, placement, gameplay, or public proof depending on the field.
5. Mark proof stale if the source material or biome revision changes.

## Expected First Failure

The first failure should be a validator error proving that Three.js materials become the terrain identity source instead of rendering source-owned masks.

## Expected Passing Evidence

render snapshot names the source material and biome tags used for terrain material selection.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, material tag, biome tag, and consumer echo before a surface-identity terrain pass can be treated as deployed.
