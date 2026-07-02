# Central Mountain Blocker - Proof Gate

Status: active docs-only
Domain: world / physics / route design
Generic kit: `n:physics:collider`
GoldRush kit: `n:goldrush:terrain-physics`

## Purpose

Define validators, human-view states, failure labels, and deploy boundaries for this map family.

## Map Family Purpose

Turn the central mountain into an authored blocker, not a visual-only pile of triangles.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | central-mountain-blocker |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.central-mountain-blocker.planned`
- `mapBlueprint.central-mountain-blocker.fixtureReady`
- `mapBlueprint.central-mountain-blocker.consumerBound`
- `mapBlueprint.central-mountain-blocker.proofSampled`

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
