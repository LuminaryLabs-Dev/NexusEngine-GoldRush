# Acceptance Gates

Status: active docs-only
Domain: validation / production

## Purpose

Define the proof gates for the massive desert map blueprint.

## Gate Matrix

| Gate | Pass condition | Fail condition |
| --- | --- | --- |
| Source revision gate | one revision id appears in source, render, collider, placement, gameplay, and proof snapshots | any consumer uses a different terrain source or local math |
| Macro shape gate | screenshots show basin, horizon mesas, central blocker, and at least three readable POIs | terrain reads as flat scatter field |
| Route gate | player walks spawn -> mine -> cashout without teleport or placement helper | route uses debug placement or hidden completion |
| Collider gate | max visual/collider mismatch stays inside tolerance on route samples | player floats, sinks, or clips through source terrain |
| LOD gate | walking through near/mid transitions has no obvious cracks or flicker | visible popping, missing chunks, or edge gaps |
| Asset anchor gate | anchors place mine, ridge, rock, rail, and extraction forms through raycast/slope checks | assets float, clip, or ignore terrain masks |
| Gameplay zone gate | gold, cover, extraction, and pressure zones come from source masks | gameplay uses separate hardcoded coordinates |
| Public proof gate | public report names source revision and proof boundary | local proof is treated as public readiness |

## Human-View States

Required screenshots:

- spawn looking into basin
- mine route with ridge and wash readable
- town or camp shelf
- central mountain blocker
- extraction depot route
- far horizon LOD view

Required video only when testing:

- LOD transition motion
- camera/terrain collision
- route walk from spawn to mine
- route walk from mine to cashout

## Completion Boundary

This packet can be marked resolved only when a real source fixture or source revision exists. Until then it is planning evidence, not implementation evidence.

