# Terrain Gap Seal 01

## Purpose

Remove the sky-blue/debug-looking holes across the Gold Rush terrain while preserving:

- centralized terrain math in `src/physics/terrainCollider.js`
- downward raycast grounding
- `cannon-es` heightfield metadata
- many small tessellated terrain cells
- rectangular massive terrain, not a circular arena

## Fix

- `createBandedTriangleTerrainGeometry()` now exports for validation.
- Terrain top triangles are wound upward instead of downward, so the visible top face is not culled.
- Terrain bands now carry continuity metadata: `overlapCells`, `skirtDepth`, and `renderOrder`.
- Exposed band edges generate skirt faces from the same `terrainFieldHeight()` sampler.
- Far-horizon vertex colors blend toward sandstone/fog instead of sky-blue debug color.

## Proof

```bash
node tools/validation/validate-terrain-continuity.mjs
npm run check
```

The validator proves:

- `45,020` terrain triangles are generated.
- `43,328` terrain triangles face upward.
- `0` terrain triangles face downward in the sampled render proof.
- no sampled terrain vertex uses debug/sky-blue color.
- spawn, mine seam, and extraction still raycast to terrain.

Browser proof:

```txt
reports/terrain-gap-seal-01.json
reports/terrain-gap-seal-01.md
screenshots/terrain-gap-seal-01.png
```

The browser pixel gate sampled the lower 58% of the WebGL frame and found:

```txt
lowerSkyBlueRatio: 0
lowerVeryBlueRatio: 0
```

## Remaining Visual Debt

This pass seals terrain gaps. It does not solve all visual composition issues.

The central mountain currently looms too close over the player in the proof screenshot. That should be handled in a separate mountain scale/framing pass, not mixed into this terrain continuity fix.
