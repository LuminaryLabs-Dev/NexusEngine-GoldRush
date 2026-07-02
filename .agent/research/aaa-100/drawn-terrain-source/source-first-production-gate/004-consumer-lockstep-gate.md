# Consumer Lockstep Gate

Status: active docs-only
Domain: world / physics / render / gameplay

## Purpose

Make sure every terrain consumer uses the same source revision before the drawn terrain source replaces prototype terrain.

## Consumers

| Consumer | Must read | Must expose |
| --- | --- | --- |
| Terrain renderer | height, normal, material, chunk, LOD | active revision, chunk count, seam status |
| Terrain collider | height, slope, blocker, walkable | max mismatch, rejected samples |
| Placement raycast | height, normal, anchors, masks | placed count, rejected anchors |
| Player movement | walkable, slope, blocker | grounded state, source revision |
| Camera | blocker, route, slope | collision/shoulder adjustment status |
| Gold resources | gold mask, mine mask, anchors | mineable count and route proof |
| Extraction | extraction mask, route graph | cashout sites and reachability |
| Combat | cover mask, blocker mask, route graph | cover lanes and threat sightlines |
| Bots/staging | walkable, route, gold, extraction, cover | bot route proof and failure rate |

## Lockstep Rule

A report is invalid if any terrain consumer reports a different revision id from the source kit.

## Validator Seed

`validate-source-consumer-lockstep.mjs`

Checks:

- every consumer has a source revision id
- all ids match the active source
- required masks are present
- zero consumers fall back to local terrain math
- proof report includes local/public label

## Player-View Acceptance

The player should be able to:

- spawn on the terrain
- walk to a mine
- see terrain colors and landmarks match the route
- mine from a source-anchored resource
- carry gold to a source-anchored extraction site
- reach results with report metadata naming the terrain revision

