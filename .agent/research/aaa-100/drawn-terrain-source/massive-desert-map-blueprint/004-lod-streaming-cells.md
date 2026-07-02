# LOD Streaming Cells

Status: active docs-only
Domain: world / render / performance / network

## Purpose

Define the large-world loading shape for the drawn desert source without turning GoldRush into a custom engine.

## Cell Rings

| Ring | Purpose | Contents | Proof |
| --- | --- | --- | --- |
| Near Cell | player footing and interaction | high terrain, collision samples, interactable assets | walk/mine/cashout proof |
| Mid Cell | route readability | medium terrain, POI silhouettes, cover markers | movement screenshot proof |
| Far Cell | horizon identity | low terrain, mesa proxies, sky blend | panorama proof |
| Hidden Cell | unloaded | no renderer/collider load | budget proof |

## Streaming Source

The player, train, proof camera, and future network partition can act as streaming sources, but all streaming decisions should remain source-revision-aware.

```txt
streamingSource
|-- id
|-- type
|-- position
|-- radiusNear
|-- radiusMid
|-- radiusFar
|-- revisionId
`-- proofLabel
```

## LOD Safety

- Terrain LOD must use hysteresis or transition bands to prevent flicker.
- Object-family LOD must keep silhouette identity even when fine details unload.
- Collider LOD must not reduce below player grounding accuracy in near cells.
- Network partitions must agree on active source revision even if render cells differ.

## Gate

Do not claim massive terrain readiness until one walking proof crosses at least two cells and reports loaded cell ids, LOD levels, source revision id, and max collider mismatch.

