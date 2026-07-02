# Terrain Source Data Schema

Status: active docs-only

## Purpose

Define the minimum data shape that lets authored terrain become the single source for visuals, collider, raycasts, placement, routes, and gameplay zones.

## Required Source Layers

| Layer | Type | Owner | Consumers | Notes |
| --- | --- | --- | --- | --- |
| worldBounds | numeric rect | authored terrain mesh | all | Defines coordinate origin and playable extents. |
| height | grid | authored terrain mesh | render, physics, control, placement | Canonical Y sample. |
| normal | grid or derived | authored terrain mesh | render, physics, movement | Can be derived but must be stable. |
| slope | grid or derived | authored terrain mesh | movement, placement, route scoring | Used for walkability and prop validity. |
| biomeMask | mask | desert world map | render, prop protokits, audio | Drives material and prop family. |
| walkabilityMask | mask | authored terrain mesh | movement, spawns, bots | Hard reject for spawn/extraction placement. |
| routeMask | mask | desert world map | player guidance, bots, train-adjacent foot paths | Supports walkable intention, not strict navmesh yet. |
| goldDensityMask | mask | desert world map | mining objects, economy, risk | Places value into the world intentionally. |
| coverMask | mask | desert world map | combat, threat AI, player guidance | Must match physical cover later. |
| extractionMask | mask | desert world map | extraction sites, cashout setpieces | Must be reachable and visible. |
| railSpline | curve descriptor | desert world map | train sequence, renderer, collision | Must sit on sampled terrain or intentional supports. |
| landmarkAnchors | points/regions | desert world map | renderer, player orientation, proof | Prevents UI-only navigation. |
| propAnchors | points/regions | prop protokit library | renderer, affordance, collision | Expanded by object protokits. |

## Minimal Snapshot

~~~txt
sourceId
revisionHash
worldBounds
sampleSpacing
heightRange
chunkGrid
maskIds
anchorCounts
validationReceipts
~~~

## Hard Rule

Visual mesh, collider mesh, object placement, and gameplay zones must never derive from separate terrain algorithms after this kit exists.
