# Current Plateau Evidence

Status: active docs-only
Domain: world / art direction / player-view proof

## Evidence Summary

The current project has meaningful technical progress, but the visible map can still stall because the map source is not yet an authored asset.

## What Current Proof Can Support

| Evidence type | What it supports | What it does not support |
| --- | --- | --- |
| Terrain collider proof | Player grounding and raycast placement can be validated. | That the terrain shape is authored or compelling. |
| Procedural object protokits | Objects can have domain identity and placement metadata. | That objects form believable towns, mines, routes, or cover. |
| Live-state screenshots | Local and public game states can be compared. | That the full map composition is AAA quality. |
| Player route proof | Natural route proof is possible. | That routes are globally planned across the map. |
| Results and combat receipts | Gameplay loop state exists. | That the world layout creates meaningful extraction risk. |

## Plateau Mechanism

```txt
local procedural terrain
|-- can make bigger areas
|-- can scatter more objects
|-- can pass grounding proof
`-- cannot by itself create map authorship

authored terrain source
|-- defines world shape
|-- defines routes and blockers
|-- defines asset anchors
|-- defines gameplay masks
`-- gives every kit the same source revision
```

## Audit Finding

The scene is no longer blocked primarily by missing terrain algorithms. It is blocked by missing source art direction and missing source-derived data contracts.

## Hardening Recommendation

Before runtime terrain replacement, create a fixture that proves one authored terrain source revision feeds:

- visible mesh
- collision query
- player route
- object placement
- gold zone
- extraction zone
- screenshot and report metadata

