# Rail Train Corridor - Data Fixture

Status: active docs-only
Domain: scene / world / extraction
Generic kit: `n:scene:transition`
GoldRush kit: `n:goldrush:train-loading`

## Purpose

Define the source data, masks, anchors, budgets, and snapshots required for this map family.

## Map Family Purpose

Tie train arrival, rail geometry, loading-yard handoff, and extraction depot identity to one terrain path.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | rail-train-corridor |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.rail-train-corridor.planned`
- `mapBlueprint.rail-train-corridor.fixtureReady`
- `mapBlueprint.rail-train-corridor.consumerBound`
- `mapBlueprint.rail-train-corridor.proofSampled`

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
