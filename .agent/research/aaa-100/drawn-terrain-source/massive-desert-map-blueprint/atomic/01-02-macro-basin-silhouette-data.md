# Macro Basin Silhouette - Data Fixture

Status: active docs-only
Domain: world / art direction
Generic kit: `n:world:authored-terrain-mesh`
GoldRush kit: `n:goldrush:desert-world-map`

## Purpose

Define the source data, masks, anchors, budgets, and snapshots required for this map family.

## Map Family Purpose

Define the playable basin, far mesas, horizon line, and first readable map silhouette.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | macro-basin-silhouette |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.macro-basin-silhouette.planned`
- `mapBlueprint.macro-basin-silhouette.fixtureReady`
- `mapBlueprint.macro-basin-silhouette.consumerBound`
- `mapBlueprint.macro-basin-silhouette.proofSampled`

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
