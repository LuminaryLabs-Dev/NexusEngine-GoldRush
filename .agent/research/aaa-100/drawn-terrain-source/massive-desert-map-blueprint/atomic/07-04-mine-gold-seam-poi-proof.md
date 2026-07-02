# Mine Gold Seam POI - Proof Gate

Status: active docs-only
Domain: gameplay / content / world
Generic kit: `n:world:placement-raycast`
GoldRush kit: `n:goldrush:gold-seam-protokits`

## Purpose

Define validators, human-view states, failure labels, and deploy boundaries for this map family.

## Map Family Purpose

Make the mine and gold seams source-anchored so mining is visible, reachable, and worth fighting over.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | mine-gold-seam-poi |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.mine-gold-seam-poi.planned`
- `mapBlueprint.mine-gold-seam-poi.fixtureReady`
- `mapBlueprint.mine-gold-seam-poi.consumerBound`
- `mapBlueprint.mine-gold-seam-poi.proofSampled`

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
