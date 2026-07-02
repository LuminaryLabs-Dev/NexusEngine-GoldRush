# Authored Map Atomic Matrix

Status: active

## Purpose

Track the atomic docs-only packet layer for the active authored-map cluster. These packets exist so the next implementation phase can build `n:goldrush:authored-desert-map` and its consumers without another broad, hard-to-debug terrain pass.

## Source References

- GitHub Game Engines collection: https://github.com/collections/game-engines
- EA Apex Knockout 60-player BR reference: https://www.ea.com/games/apex-legends/apex-legends/news/space-hunt-event
- EA Apex Bot Royale staging reference: https://www.ea.com/games/apex-legends/apex-legends/news/breach-patch-notes
- PUBG official overview: https://pubg.com/en/game-info/overview
- Hunt Showdown official game page: https://www.huntshowdown.com/game
- Hunt Showdown hidden extraction/info update: https://www.huntshowdown.com/news/update-28-road-to-hell-go-live

## Matrix

| Atomic | Parent | Concern | Domain | Kit | State | Packet |
| --- | --- | --- | --- | --- | --- | --- |
| 021.001 | Terrain intention map | World Bounds | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/001-world-bounds.md |
| 021.002 | Terrain intention map | Macro Region Map | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/002-macro-region-map.md |
| 021.003 | Terrain intention map | Central Mountain Obstacle | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/003-central-mountain-obstacle.md |
| 021.004 | Terrain intention map | Canyon Basin Flow | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/004-canyon-basin-flow.md |
| 021.005 | Terrain intention map | Train Arrival Corridor | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/005-train-arrival-corridor.md |
| 021.006 | Terrain intention map | Town Mine Relationship | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/006-town-mine-relationship.md |
| 021.007 | Terrain intention map | Gold Seam Districts | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/007-gold-seam-districts.md |
| 021.008 | Terrain intention map | Extraction Sightlines | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/008-extraction-sightlines.md |
| 021.009 | Terrain intention map | Combat Cover Lanes | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/009-combat-cover-lanes.md |
| 021.010 | Terrain intention map | Spawn Safety Rings | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/010-spawn-safety-rings.md |
| 021.011 | Terrain intention map | Final Rush Convergence | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/011-final-rush-convergence.md |
| 021.012 | Terrain intention map | Landmark Silhouette Grid | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/012-landmark-silhouette-grid.md |
| 021.013 | Terrain intention map | Horizon Blend Policy | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/013-horizon-blend-policy.md |
| 021.014 | Terrain intention map | Player Route Grammar | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/014-player-route-grammar.md |
| 021.015 | Terrain intention map | Map Intention Revision | world | n:goldrush:authored-desert-map | atomic-planned | 021-terrain-intention-map/atomic/015-map-intention-revision.md |
| 022.001 | Top-down terrain plate | Plate Resolution | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/001-plate-resolution.md |
| 022.002 | Top-down terrain plate | Coordinate System | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/002-coordinate-system.md |
| 022.003 | Top-down terrain plate | Drawn Layer Names | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/003-drawn-layer-names.md |
| 022.004 | Top-down terrain plate | Revision Hash Policy | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/004-revision-hash-policy.md |
| 022.005 | Top-down terrain plate | Import Format Choice | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/005-import-format-choice.md |
| 022.006 | Top-down terrain plate | Scale Calibration Strip | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/006-scale-calibration-strip.md |
| 022.007 | Top-down terrain plate | Topology Control Lines | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/007-topology-control-lines.md |
| 022.008 | Top-down terrain plate | Source To Runtime Compile | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/008-source-to-runtime-compile.md |
| 022.009 | Top-down terrain plate | Editor Free Authoring | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/009-editor-free-authoring.md |
| 022.010 | Top-down terrain plate | Change Review Diff | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/010-change-review-diff.md |
| 022.011 | Top-down terrain plate | Fallback Mini Plate | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/011-fallback-mini-plate.md |
| 022.012 | Top-down terrain plate | Multi Site Map Cuts | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/012-multi-site-map-cuts.md |
| 022.013 | Top-down terrain plate | Asset Anchor Pass | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/013-asset-anchor-pass.md |
| 022.014 | Top-down terrain plate | Plate Secret Safety | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/014-plate-secret-safety.md |
| 022.015 | Top-down terrain plate | Plate Human View Legend | world | n:goldrush:terrain-source-plate | atomic-planned | 022-top-down-terrain-plate/atomic/015-plate-human-view-legend.md |
| 023.001 | Height and mask data model | Height Channel Contract | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/001-height-channel-contract.md |
| 023.002 | Height and mask data model | Normal Slope Channel | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/002-normal-slope-channel.md |
| 023.003 | Height and mask data model | Walkability Mask | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/003-walkability-mask.md |
| 023.004 | Height and mask data model | Route Mask | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/004-route-mask.md |
| 023.005 | Height and mask data model | Biome Mask | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/005-biome-mask.md |
| 023.006 | Height and mask data model | Gold Density Mask | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/006-gold-density-mask.md |
| 023.007 | Height and mask data model | Cover Mask | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/007-cover-mask.md |
| 023.008 | Height and mask data model | Extraction Mask | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/008-extraction-mask.md |
| 023.009 | Height and mask data model | Placement Mask Stack | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/009-placement-mask-stack.md |
| 023.010 | Height and mask data model | Raycast Sample Api | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/010-raycast-sample-api.md |
| 023.011 | Height and mask data model | Mask Debug Snapshot | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/011-mask-debug-snapshot.md |
| 023.012 | Height and mask data model | Mask Resolution Lod | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/012-mask-resolution-lod.md |
| 023.013 | Height and mask data model | Invalid Surface Reports | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/013-invalid-surface-reports.md |
| 023.014 | Height and mask data model | Runtime Config Minimum | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/014-runtime-config-minimum.md |
| 023.015 | Height and mask data model | Mask Regression Fixtures | world | n:world:terrain-heightfield | atomic-planned | 023-height-mask-data-model/atomic/015-mask-regression-fixtures.md |
| 024.001 | LOD ring contract | Near Ring Contract | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/001-near-ring-contract.md |
| 024.002 | LOD ring contract | Mid Ring Contract | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/002-mid-ring-contract.md |
| 024.003 | LOD ring contract | Far Ring Contract | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/003-far-ring-contract.md |
| 024.004 | LOD ring contract | Chunk Size Grid | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/004-chunk-size-grid.md |
| 024.005 | LOD ring contract | Seam Skirt Policy | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/005-seam-skirt-policy.md |
| 024.006 | LOD ring contract | Lod Handoff Tolerance | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/006-lod-handoff-tolerance.md |
| 024.007 | LOD ring contract | Camera Speed Stress | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/007-camera-speed-stress.md |
| 024.008 | LOD ring contract | Collision Lod Boundary | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/008-collision-lod-boundary.md |
| 024.009 | LOD ring contract | Prop Lod Roles | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/009-prop-lod-roles.md |
| 024.010 | LOD ring contract | Streaming Budget | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/010-streaming-budget.md |
| 024.011 | LOD ring contract | Lod Debug Snapshot | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/011-lod-debug-snapshot.md |
| 024.012 | LOD ring contract | Mobile Lod Profile | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/012-mobile-lod-profile.md |
| 024.013 | LOD ring contract | Lod Restart Safety | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/013-lod-restart-safety.md |
| 024.014 | LOD ring contract | Lod Human View Proof | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/014-lod-human-view-proof.md |
| 024.015 | LOD ring contract | Lod Failure Labels | world/render | n:render:terrain-lod-rings | atomic-planned | 024-lod-ring-contract/atomic/015-lod-failure-labels.md |
| 026.001 | Collider parity | Visible Collider Source Match | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/001-visible-collider-source-match.md |
| 026.002 | Collider parity | Downward Raycast Contract | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/002-downward-raycast-contract.md |
| 026.003 | Collider parity | Capsule Grounding Contract | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/003-capsule-grounding-contract.md |
| 026.004 | Collider parity | Central Mountain Blockers | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/004-central-mountain-blockers.md |
| 026.005 | Collider parity | Train Track Collider | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/005-train-track-collider.md |
| 026.006 | Collider parity | Prop Collider Classes | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/006-prop-collider-classes.md |
| 026.007 | Collider parity | Slope And Step Fixtures | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/007-slope-and-step-fixtures.md |
| 026.008 | Collider parity | No Floating Acceptance | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/008-no-floating-acceptance.md |
| 026.009 | Collider parity | Inside Out Mesh Detection | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/009-inside-out-mesh-detection.md |
| 026.010 | Collider parity | Physics Backend Boundary | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/010-physics-backend-boundary.md |
| 026.011 | Collider parity | Collision Debug Overlay Policy | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/011-collision-debug-overlay-policy.md |
| 026.012 | Collider parity | Client Network Parity | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/012-client-network-parity.md |
| 026.013 | Collider parity | Invalid Placement Quarantine | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/013-invalid-placement-quarantine.md |
| 026.014 | Collider parity | Pulsing Regression Check | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/014-pulsing-regression-check.md |
| 026.015 | Collider parity | Collider Public Proof | physics | n:physics:terrain-collider-parity | atomic-planned | 026-collider-parity/atomic/015-collider-public-proof.md |
| 040.001 | Prop protokit library | Prop Taxonomy | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/001-prop-taxonomy.md |
| 040.002 | Prop protokit library | Rock Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/002-rock-protokits.md |
| 040.003 | Prop protokit library | Plant Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/003-plant-protokits.md |
| 040.004 | Prop protokit library | Rail Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/004-rail-protokits.md |
| 040.005 | Prop protokit library | Mine Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/005-mine-protokits.md |
| 040.006 | Prop protokit library | Town Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/006-town-protokits.md |
| 040.007 | Prop protokit library | Camp Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/007-camp-protokits.md |
| 040.008 | Prop protokit library | Extraction Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/008-extraction-protokits.md |
| 040.009 | Prop protokit library | Gold Resource Protokits | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/009-gold-resource-protokits.md |
| 040.010 | Prop protokit library | Prop Placement Raycast | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/010-prop-placement-raycast.md |
| 040.011 | Prop protokit library | Prop Layering Order | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/011-prop-layering-order.md |
| 040.012 | Prop protokit library | Prop Affordance Api | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/012-prop-affordance-api.md |
| 040.013 | Prop protokit library | Prop Lod Materials | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/013-prop-lod-materials.md |
| 040.014 | Prop protokit library | Prop Density Budget | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/014-prop-density-budget.md |
| 040.015 | Prop protokit library | Prop Review Restart | content | n:goldrush:prop-protokit-library | atomic-planned | 040-prop-protokit-library/atomic/015-prop-review-restart.md |

## Implementation Rule

Do not implement the whole map at once. Pick one atomic packet, prove its source data and validator, then reconnect it through the parent packet and data matrix.
