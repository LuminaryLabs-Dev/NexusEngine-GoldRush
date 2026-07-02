# Cover Combat Sightlines - Proof Gate

Status: active docs-only
Domain: combat / world / camera
Generic kit: `n:world:line-of-sight`
GoldRush kit: `n:goldrush:combat-route-guidance`

## Purpose

Define validators, human-view states, failure labels, and deploy boundaries for this map family.

## Map Family Purpose

Author cover pockets, sightline breaks, and threat lanes into terrain instead of staging combat anywhere convenient.

## Required Atomic Output

- owner domain and kit stay explicit
- source revision remains the authority
- renderer, physics, gameplay, content, and proof consume snapshots rather than private geometry
- player-view acceptance is named before implementation
- public proof boundary is separate from local proof

## Data Seeds

| Field | Need |
| --- | --- |
| sourceFamily | cover-combat-sightlines |
| sourceRevision | must match active desert map source |
| worldRegion | basin, horizon, route, POI, or pressure layer as applicable |
| requiredMasks | walkable, blocker, material, route, gameplay, and proof masks as applicable |
| requiredAnchors | only source-derived anchors, never renderer-invented placement |

## Event Seeds

- `mapBlueprint.cover-combat-sightlines.planned`
- `mapBlueprint.cover-combat-sightlines.fixtureReady`
- `mapBlueprint.cover-combat-sightlines.consumerBound`
- `mapBlueprint.cover-combat-sightlines.proofSampled`

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
