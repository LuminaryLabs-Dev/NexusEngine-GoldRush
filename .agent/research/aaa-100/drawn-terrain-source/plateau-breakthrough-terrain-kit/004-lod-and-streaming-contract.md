# LOD And Streaming Contract

Status: active docs-only

## Purpose

Define how a massive desert terrain mesh can be used by an LOD system without turning into disconnected visual chunks.

## LOD Rings

| Ring | Role | Required quality |
| --- | --- | --- |
| Near | Walkable/player contact surface. | Highest collider and visual parity. |
| Mid | Readable routes, props, combat lanes. | Stable material masks and silhouette. |
| Far | Town, mesa, rail, mountain, extraction landmarks. | Strong silhouette and color bands. |
| Horizon | Non-interactive atmosphere and distant mesas. | No visible seam against sky. |

## Rules

- Every chunk names its source revision.
- Every chunk owns its neighbor edge contract.
- Every chunk has a collider policy, even when only near chunks create full colliders.
- Far cells may simplify geometry, but must preserve landmarks.
- Horizon cells may be impostors, but must not replace gameplay terrain.

## Proof

Proof must compare near and mid samples against the same source data, then take player-view screenshots from spawn, ridge, mine, town, train, cashout, and horizon views.
