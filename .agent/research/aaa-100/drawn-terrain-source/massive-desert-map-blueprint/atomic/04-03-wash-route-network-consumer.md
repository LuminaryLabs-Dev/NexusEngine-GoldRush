# Wash Route Network - Consumer Contract

Status: active docs-only
Domain: world / control / staging
Generic kit: `n:world:route-graph`
GoldRush kit: `n:goldrush:player-route-guidance`

## Purpose

Define which kits consume this map family and what public events/snapshots prove lockstep.

## Map Family Purpose

Make dry creek beds and lowlands the natural travel language for players and bots.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | wash-route-network |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.wash-route-network.planned`
- `mapBlueprint.wash-route-network.fixtureReady`
- `mapBlueprint.wash-route-network.consumerBound`
- `mapBlueprint.wash-route-network.proofSampled`

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
