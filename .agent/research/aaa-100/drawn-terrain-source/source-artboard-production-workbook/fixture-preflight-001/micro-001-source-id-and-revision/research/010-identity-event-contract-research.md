# 010 - Identity Event Contract Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collision parity depends on matching terrain data, shape, position, and scale.
- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Surface identity should be layer data that other systems can reference.
- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist for missing runtime boundaries without building a new engine.

## Translation

- Data contract: loaded, rejected, changed, consumerReady, consumerDrift events.
- Proof contract: events carry fixtureId, revisionId, and consumer id when relevant.
- Risk constrained: state changes happen without a replayable event trail.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.
