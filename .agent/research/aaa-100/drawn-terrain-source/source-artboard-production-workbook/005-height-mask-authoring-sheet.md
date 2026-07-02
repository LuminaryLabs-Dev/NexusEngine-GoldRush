# Height Mask Authoring Sheet

Status: active docs-only

## Purpose

Describe the data a future drawn terrain asset must provide so mesh, collider, raycast, and gameplay agree.

## Height Authoring

- Basin floor needs subtle undulation, not a flat plane.
- Wash paths need lower elevation and route readability.
- Mine shelves need flattened enough ground for player actions.
- Town shelves need flatter layout pads with readable edges.
- Central mountain needs strong blocker slope and visible route around it.
- Horizon mesas need silhouette first, fine detail second.

## Mask Authoring

| Mask | Required values |
| --- | --- |
| `walkable` | `yes`, `limited`, `no` |
| `slopeClass` | `flat`, `walkableSlope`, `scramble`, `blocked` |
| `materialClass` | `sand`, `clay`, `rock`, `railBed`, `wood`, `mineFloor` |
| `routeClass` | `main`, `shortcut`, `risky`, `train`, `bot`, `proof` |
| `gameplayClass` | `mine`, `gold`, `cover`, `cashout`, `pressure`, `safe` |

## Parity Rule

The visible mesh, raycast height, and collider must be tested against the same sample points.

## Failure State

If the player can stand below visible terrain, float above terrain, or cash out on a marker that is not grounded to the source surface, this sheet is unresolved.
