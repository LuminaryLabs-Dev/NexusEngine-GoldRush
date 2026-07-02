# Extraction Depot Cashout - Data Fixture

Status: active docs-only
Domain: gameplay / world / presentation
Generic kit: `n:world:zone-mask`
GoldRush kit: `n:goldrush:cashout-sites`

## Purpose

Define the source data, masks, anchors, budgets, and snapshots required for this map family.

## Map Family Purpose

Make cashout an authored landmark route, not a marker floating on a generic field.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | extraction-depot-cashout |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.extraction-depot-cashout.planned`
- `mapBlueprint.extraction-depot-cashout.fixtureReady`
- `mapBlueprint.extraction-depot-cashout.consumerBound`
- `mapBlueprint.extraction-depot-cashout.proofSampled`

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
