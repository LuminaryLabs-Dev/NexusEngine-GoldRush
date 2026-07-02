# 009 - Source Summary Snapshot Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Terrain elevation should be source data that downstream systems sample, not duplicated local math.
- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collision parity depends on matching terrain data, shape, position, and scale.
- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Surface identity should be layer data that other systems can reference.

## Translation

- Data contract: summary shape for fixture state.
- Proof contract: snapshot contains fixtureId, revisionId, reason, sourceHash, consumers, drift, and validation state.
- Risk constrained: debug state cannot explain which source is live.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.
