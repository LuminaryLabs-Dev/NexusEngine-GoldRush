# 012 - Material Biome Stale Proof Simulation

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`

## Simulated Implementation Pass

1. Add `materialBiomeRevisionPolicy` to the future source fixture schema or terrain surface query result.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:terrain-material-mask` and `n:goldrush:desert-materials`.
4. Add one consumer echo from render, audio, VFX, placement, gameplay, or public proof depending on the field.
5. Mark proof stale if the source material or biome revision changes.

## Expected First Failure

The first failure should be a validator error proving that old renderer batches, object placements, or proof screenshots survive after surface identity changes.

## Expected Passing Evidence

material or biome changes mark render, audio, VFX, placement, gameplay, screenshot, and public proof stale.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, material tag, biome tag, and consumer echo before a surface-identity terrain pass can be treated as deployed.
