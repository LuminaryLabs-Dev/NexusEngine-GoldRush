# Fixture Intent

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Intention

Build the smallest authored desert map source that proves GoldRush can stop relying on renderer-owned procedural terrain facts.

## What It Proves

- A drawn terrain source can own the map revision.
- Renderer, collider, placement, gameplay, and proof can report the same revision id.
- A small terrain slice can include gameplay meaning, not only visual geometry.
- LOD and collider parity can be checked before scale expands.
- The map can be restarted with new source knowledge without losing ownership boundaries.

## What It Does Not Prove

- It does not prove the final full-scale map.
- It does not prove 60-player live network readiness.
- It does not prove AAA art fidelity.
- It does not prove final asset licensing or promotion.
- It does not prove combat balance.

## Player Promise

The first fixture should make one tiny playable western place readable from over-the-shoulder view:

```txt
train edge -> wash path -> mine shelf -> gold seam -> cover pocket -> cashout marker
```

## Design Rule

The fixture should feel like a small slice of a larger desert basin, not a contained arena. Even in the tiny version, it should include a horizon direction, a blocker silhouette, and one navigation choice.

## Stop Condition

Stop if the fixture only improves geometry density but still lacks route, objective, cover, extraction, LOD, and proof annotations.
