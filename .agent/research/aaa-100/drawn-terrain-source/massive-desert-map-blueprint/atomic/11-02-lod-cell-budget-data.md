# LOD Cell Budget - Data Fixture

Status: active docs-only
Domain: performance / render / network
Generic kit: `n:world:terrain-chunks`
GoldRush kit: `n:goldrush:gold-field-lod`

## Purpose

Define the source data, masks, anchors, budgets, and snapshots required for this map family.

## Map Family Purpose

Give near, mid, far, and hidden map cells explicit visual, collider, anchor, and report budgets.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | lod-cell-budget |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.lod-cell-budget.planned`
- `mapBlueprint.lod-cell-budget.fixtureReady`
- `mapBlueprint.lod-cell-budget.consumerBound`
- `mapBlueprint.lod-cell-budget.proofSampled`

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
