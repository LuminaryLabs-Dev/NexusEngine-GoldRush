# Gameplay Route And Risk Web

Status: active docs-only
Domain: gameplay / world / combat / extraction

## Purpose

Map the terrain source to the full extraction battle royale loop.

## Route Web

```txt
spawn
|-- safe teach route
|   |-- wash lowland
|   |-- first gold seam
|   `-- low-risk cashout
|-- high-value route
|   |-- mine shelf
|   |-- exposed ridge
|   `-- contested depot
|-- town route
|   |-- cover
|   |-- optional tools
|   `-- side exit
`-- final-rush route
    |-- closing pressure
    |-- forced rotations
    `-- last cashout
```

## Risk Matrix

| Route | Reward | Risk | Needed terrain |
| --- | --- | --- | --- |
| Safe teach route | low/medium | low | wide wash, clear landmarks |
| High-value mine route | high | high | exposed shelf, cover pockets |
| Town detour | medium | medium | alleys, occlusion, alternate exit |
| Rail depot route | high if carrying | high if contested | long sightline and depot landmark |
| Final-rush route | variable | rising pressure | narrowing corridors and blockers |

## Kit Consumers

| Kit | Uses source data for |
| --- | --- |
| `n:goldrush:player-route-guidance` | next route leg and readable target. |
| `n:goldrush:mine-hold-action` | mine targets that are visible and reachable. |
| `n:goldrush:gold-carrying` | cargo-risk routes and movement pressure. |
| `n:goldrush:cashout-sites` | reachable extraction sites with contest space. |
| `n:goldrush:ambush-pressure` | threat staging tied to cover and sightlines. |
| `n:goldrush:combat-route-guidance` | cover routes that are terrain-authored. |
| `n:goldrush:final-rush-pressure` | shrinking route pressure that uses blockers. |

## Acceptance

A route is not valid until the player can walk it naturally and the report proves every major waypoint comes from source masks or anchors.

