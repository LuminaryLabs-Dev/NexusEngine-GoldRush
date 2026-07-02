# Consumer Readiness

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define when each first consumer is allowed to claim it is using the authored terrain fixture.

## Readiness Matrix

| Consumer | Required proof | Not ready if |
| --- | --- | --- |
| Render chunk | Mesh bounds, source revision, LOD cell, material layer, and proof anchor. | It renders from local noise or old hardcoded geometry. |
| Terrain collider | Height samples, slope classes, walkable/blocker masks, and revision parity. | It builds from a different grid or ignores blocker masks. |
| Player grounding | Raycast result, render-ground parity, slope limit, and revision id. | It samples a separate movement height function. |
| Object placement | Anchor id, raycast hit, mask tags, transform, and revision id. | Props are placed by arbitrary x/z scatter only. |
| Gameplay zones | Route, mine, gold, cover, cashout, and pressure annotations. | Objective locations are invented outside the fixture. |
| LOD selector | Near, mid, far, and horizon cell ids tied to player/camera distance. | LOD is only a renderer optimization with no source cell contract. |
| Human proof | Screenshot anchor id, camera role, expected foreground, midground, and horizon. | It only proves nonblank pixels. |

## First Consumer Order

```txt
1. source summary
2. render one near chunk
3. collider sample parity
4. player grounding query
5. object anchor placement
6. gameplay annotation read
7. human-view proof shot
```

## Stop Condition

Stop if any consumer can pass without naming both `goldrush.desert.artboard.fixture.001` and its revision id.
