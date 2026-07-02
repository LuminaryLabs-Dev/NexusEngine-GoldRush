# Source Proof Restart - Data Fixture

Status: active docs-only
Domain: validation / production / release
Generic kit: `n:runtime:validation`
GoldRush kit: `n:goldrush:reality-status`

## Purpose

Define the source data, masks, anchors, budgets, and snapshots required for this map family.

## Map Family Purpose

Make every terrain proof restartable by source revision, schema version, consumer lockstep, and public proof boundary.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | source-proof-restart |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.source-proof-restart.planned`
- `mapBlueprint.source-proof-restart.fixtureReady`
- `mapBlueprint.source-proof-restart.consumerBound`
- `mapBlueprint.source-proof-restart.proofSampled`

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
