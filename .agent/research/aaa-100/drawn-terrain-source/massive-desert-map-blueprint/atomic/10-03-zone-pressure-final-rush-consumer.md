# Zone Pressure Final Rush - Consumer Contract

Status: active docs-only
Domain: battle royale / gameplay / world
Generic kit: `n:world:zone-mask`
GoldRush kit: `n:goldrush:final-rush-pressure`

## Purpose

Define which kits consume this map family and what public events/snapshots prove lockstep.

## Map Family Purpose

Make pressure corridors and late-game routes part of the map source.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | zone-pressure-final-rush |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.zone-pressure-final-rush.planned`
- `mapBlueprint.zone-pressure-final-rush.fixtureReady`
- `mapBlueprint.zone-pressure-final-rush.consumerBound`
- `mapBlueprint.zone-pressure-final-rush.proofSampled`

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
