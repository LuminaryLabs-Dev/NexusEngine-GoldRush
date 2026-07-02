# Human-View Proof Plan

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define the player-view proof required before the first source fixture can be treated as useful.

## Screenshot States

| Proof shot | Camera role | Required readable content |
| --- | --- | --- |
| `spawn-forward` | Over-the-shoulder exploration. | Player, route start, ridge blocker, mine direction, horizon. |
| `wash-route` | Movement path. | Walkable wash, route material, nearby cover, no terrain holes. |
| `mine-approach` | Objective approach. | Mine shelf, gold seam, object anchors, safe footing. |
| `cover-choice` | Combat pressure setup. | Cover pocket, alternate route, sightline break. |
| `cashout-return` | Extraction return. | Cashout marker, path back, pressure lane, horizon direction. |
| `lod-distance` | Long view. | Near detail, mid landmarks, far silhouettes, sky blend. |

## Acceptance Criteria

- The player is grounded on visible terrain.
- The camera reads foreground, midground, and horizon at the same time.
- There is at least one choice, not just a straight strip.
- Mine, gold, cover, and cashout are distinguishable by shape and placement.
- Terrain LOD does not expose seams or flat debug bands in the main view.
- Object anchors look placed into terrain, not floating or buried.

## Failure Labels

| Label | Meaning |
| --- | --- |
| `flat-field` | The image is bigger but still lacks authored map composition. |
| `no-objective-read` | Mine, gold, or cashout cannot be identified. |
| `no-route-read` | The player cannot see where to go. |
| `grounding-drift` | Player or objects float, sink, or jitter. |
| `lod-seam` | Chunk boundaries are visible in the player view. |
| `density-without-design` | More props exist but do not improve gameplay readability. |

## Stop Condition

Stop if the screenshot is technically nonblank but does not make the player's next action obvious.
