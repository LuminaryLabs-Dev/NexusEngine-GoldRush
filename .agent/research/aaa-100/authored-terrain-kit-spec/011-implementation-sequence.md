# Authored Terrain Implementation Sequence

Status: active docs-only

## Purpose

Define the first safe coding sequence once docs-only mode is lifted.

## Sequence

1. Add neutral data-only kit shell for n:world:authored-terrain-mesh with no GoldRush rules.
2. Add GoldRush custom shell for n:goldrush:desert-world-map that consumes the generic kit snapshot.
3. Add a tiny source fixture with world bounds, height grid, masks, and anchors.
4. Add CLI validator for fixture load, sample, mask, chunk, and raycast behavior.
5. Connect renderer to consume the fixture without changing gameplay authority.
6. Connect terrain collider parity to the same fixture source.
7. Add placement receipt generation for one prop family and one gold zone.
8. Add one human-view proof that walks on the terrain and checks no mismatch.
9. Add one public/deploy proof only after local proof and build artifact sanitation pass.
10. Expand one atomic authored-map packet at a time after the source contract is stable.

## Stop Conditions

- Visual terrain and collider terrain diverge.
- Any prop placement skips mask plus raycast receipt.
- Any gameplay zone uses a circle without terrain-source evidence.
- Any runtime code references raw, sanitized, quarantine, absolute, or source-only asset paths.
- Any proof uses a helper path while being described as natural play.
