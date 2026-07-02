# Town Shelf POI - Consumer Contract

Status: active docs-only
Domain: world / content / combat
Generic kit: `n:world:zone-mask`
GoldRush kit: `n:goldrush:frontier-town-protokits`

## Purpose

Define which kits consume this map family and what public events/snapshots prove lockstep.

## Map Family Purpose

Define the frontier town as an authored shelf with cover, side routes, social identity, and readable clutter.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | town-shelf-poi |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.town-shelf-poi.planned`
- `mapBlueprint.town-shelf-poi.fixtureReady`
- `mapBlueprint.town-shelf-poi.consumerBound`
- `mapBlueprint.town-shelf-poi.proofSampled`

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
