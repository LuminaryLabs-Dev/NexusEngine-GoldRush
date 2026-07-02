# Layer Sample Table

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define the first sample table shape without creating the actual data file yet.

## Sample Regions

| Region | World role | Expected layers |
| --- | --- | --- |
| `basin.start` | Safe spawn and camera footing. | low height, sand material, walkable. |
| `wash.path` | Primary route. | shallow depression, trail material, walkable. |
| `ridge.blocker` | Central obstacle and horizon silhouette. | high height, rock material, blocker. |
| `mine.shelf` | Mine interaction pocket. | mid height, mine material, walkable with edge guard. |
| `gold.seam` | Resource objective. | rock/sand blend, mine/gold annotation. |
| `cover.pocket` | Combat readability test. | small rock anchors, partial blocker. |
| `cashout.flat` | Extraction readability test. | flat floor, cashout annotation, sightline marker. |

## First LOD Cells

| Cell | Distance role | Data requirement |
| --- | --- | --- |
| `lod.near.000` | Player footing and interaction. | Full height, material, walkable, anchors. |
| `lod.mid.000` | Landmark approach. | Reduced height, material, route, blocker. |
| `lod.far.000` | Horizon shape. | Silhouette and material family only. |
| `lod.horizon.000` | Sky blend. | Non-collidable mesa band and color family. |

## First Proof Anchors

| Anchor | Camera intent | Must show |
| --- | --- | --- |
| `proof.spawn.forward` | Spawn readability. | Route, blocker silhouette, mine direction. |
| `proof.mine.approach` | Objective readability. | Mine shelf and gold seam. |
| `proof.cover.choice` | Combat route readability. | Cover pocket and alternate path. |
| `proof.cashout.return` | Extraction readability. | Cashout marker and route back. |

## Stop Condition

Stop if the first sample table cannot explain what the player should see, where they can walk, what blocks them, where objects land, and what action is available.
