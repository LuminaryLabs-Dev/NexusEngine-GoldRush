# 011 - Reset And Stale Proof Flags Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Surface identity should be layer data that other systems can reference.
- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist for missing runtime boundaries without building a new engine.
- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR shape and large maps require stable source identity across local and public proof.

## Translation

- Data contract: reset behavior and stale proof flags.
- Proof contract: revision changes mark render, collider, placement, gameplay, local proof, and public proof stale.
- Risk constrained: old proof is reused after source changes.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.
