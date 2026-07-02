# Minimum Source Fields

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Name the minimum fields that the first source-artboard fixture must expose before any consumer is allowed to use it.

## Required Root Fields

| Field | Purpose | Required shape |
| --- | --- | --- |
| `fixtureId` | Stable identity. | Exact id string. |
| `revisionId` | Restart and proof identity. | Short deterministic revision string. |
| `worldBounds` | Scale and coordinate contract. | Min/max x, y, z plus unit label. |
| `cellSize` | Sampling and LOD budget. | One numeric world-unit step. |
| `origin` | Positioning contract. | x, y, z root transform. |
| `authoringNotes` | Why this fixture exists. | Short text fields only. |

## Required Terrain Layers

| Layer | Consumer | Minimum data |
| --- | --- | --- |
| `height` | render, physics, movement | Sampled height values. |
| `normal` | render, movement | Explicit or derivable normal. |
| `slope` | movement, placement | Flat, walkable, steep, blocker classes. |
| `material` | render, audio, VFX | Sand, rock, trail, mine, rail bed. |
| `biome` | asset placement | Basin, ridge, wash, camp, mine shelf. |
| `walkable` | movement | Boolean or class mask. |
| `blocker` | physics, navigation | Mountain, cliff, prop blocker. |

## Required Gameplay Annotations

| Annotation | Purpose |
| --- | --- |
| `route` | Primary and alternate path intent. |
| `mine` | First mine interaction location. |
| `gold` | First gold seam or node. |
| `cover` | One readable cover pocket. |
| `cashout` | First extraction deposit target. |
| `rail` | Loading-yard or train direction reference. |
| `pressure` | Ambush or final-rush risk seed. |

## Required Asset Anchors

| Anchor | Purpose |
| --- | --- |
| `rock.cluster.small` | Terrain breakup and cover testing. |
| `plant.cactus.small` | Biome identity and scale cue. |
| `mine.entrance.stub` | Objective landmark. |
| `rail.tie.segment` | Train/world continuity. |
| `cashout.beacon.stub` | Extraction readability. |

## Stop Condition

Stop if any required field can only be reconstructed by reading renderer code, physics code, or hardcoded object placement.
