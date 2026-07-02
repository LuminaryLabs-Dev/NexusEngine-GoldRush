# Consumer Proof Matrix

Status: active docs-only
Domain: architecture / proof

## Purpose

Define the first proof each consumer must provide after the source fixture exists.

## Matrix

| Consumer | Consumes | First proof |
| --- | --- | --- |
| Render | chunks, height, normals, material masks | one source-backed chunk renders with expected revision |
| Physics | height, slope, blocker, walkable masks | terrain raycast and collider samples match visible surface |
| Control | height, slope, route hint | WASD movement stays grounded across fixture samples |
| Placement | anchors, masks, raycast samples | props attach only to valid anchors |
| Gameplay | gold, extraction, route, cover masks | mine target and cashout target derive from fixture zones |
| Combat | cover and blocker masks | first staged threat has valid cover lane |
| Network | source revision and region ids | snapshot can be serialized for room handoff |
| Staging | proof samples and route graph | single-player scenario can start, walk, mine, cashout |
| Public deploy | same fixture revision | public Pages proof sees same source revision as local |

## Human-View Requirement

The first visual proof must include:

- title or setup state showing fixture id in debug/proof state only
- run scene screenshot from over-the-shoulder camera
- movement sample across at least one chunk edge
- one grounded prop or mine object
- one visible route/extraction cue

## Motion Requirement

If the proof changes movement, camera, LOD, or grounding, use video or motion samples. A static screenshot is not enough.

