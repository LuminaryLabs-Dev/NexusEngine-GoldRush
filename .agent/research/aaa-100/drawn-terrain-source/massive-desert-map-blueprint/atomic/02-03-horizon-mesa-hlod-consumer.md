# Horizon Mesa HLOD - Consumer Contract

Status: active docs-only
Domain: render / performance / world
Generic kit: `n:world:terrain-chunks`
GoldRush kit: `n:goldrush:gold-field-lod`

## Purpose

Define which kits consume this map family and what public events/snapshots prove lockstep.

## Map Family Purpose

Keep distant mesas and cliffs visible as cheap far-world identity without loading full interactive terrain.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | horizon-mesa-hlod |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.horizon-mesa-hlod.planned`
- `mapBlueprint.horizon-mesa-hlod.fixtureReady`
- `mapBlueprint.horizon-mesa-hlod.consumerBound`
- `mapBlueprint.horizon-mesa-hlod.proofSampled`

## Snapshot Seeds

- family id
- source revision id
- owning generic kit
- owning GoldRush kit
- consumer ids
- required proof state
- unresolved risks

## Stop Conditions

Stop implementation if this family needs hardcoded coordinates, renderer-only state, mismatched terrain revision ids, or proof helpers that bypass natural player movement.
