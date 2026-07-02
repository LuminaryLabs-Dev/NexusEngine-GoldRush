# Asset Anchor Blueprint

Status: active docs-only
Domain: content / world / render

## Purpose

Define how digital assets attach to the drawn terrain source.

## Anchor Types

| Anchor | Asset family | Placement rule |
| --- | --- | --- |
| `ridge.face` | mesa and cliff forms | align to blocker slope and normal. |
| `ridge.talus` | rock and boulder forms | place at slope transition and wash edges. |
| `wash.scrub` | cactus and scrub forms | place on walkable lowland material. |
| `mine.entrance` | mine site forms | attach to ridge cut and route graph. |
| `gold.seam` | mineable resource forms | require gold mask and walkable edge. |
| `rail.curve` | rail and train forms | follow rail spline and slope limit. |
| `town.block` | town building forms | require shelf mask and route adjacency. |
| `camp.clearing` | camp forms | require safe-ish route node. |
| `cover.pocket` | barricade/rock cover forms | require combat lane and sightline tag. |
| `cashout.landmark` | extraction forms | require extraction mask and route proof. |

## Protokit Contract Seed

```txt
assetAnchor
|-- anchorId
|-- revisionId
|-- anchorType
|-- position
|-- normal
|-- slope
|-- sourceMasks
|-- routeNodeId
|-- allowedFamilies
|-- collisionRole
|-- interactionRole
`-- proofSamples
```

## Rule

The renderer may batch assets, but it must not invent placement. Placement belongs to source anchors plus raycast/slope validation.

## First Slice

The first source fixture should include exactly enough anchors to prove the chain:

- one ridge face
- one talus scatter group
- one mine entrance
- one gold seam
- one rail/depot marker
- one extraction landmark

