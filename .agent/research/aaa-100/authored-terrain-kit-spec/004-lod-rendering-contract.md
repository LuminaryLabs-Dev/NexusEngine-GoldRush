# LOD Rendering Contract

Status: active docs-only

## Purpose

Define how the authored terrain source becomes a large visible desert without letting LOD swaps change gameplay truth.

## LOD Bands

| Band | Purpose | Source Data | Hard Gate |
| --- | --- | --- | --- |
| near | player feet, interaction, mining, cover | highest practical height/mask samples | no ground mismatch, no seam pop, no collision mismatch |
| mid | combat sightlines, towns, extraction reads | reduced mesh from same source | silhouettes and routes stay readable |
| far | mountains, horizon, macro orientation | simplified chunks from same source | horizon blends without fake dome or blue gaps |

## Contract

- LOD changes may change visual density, not height authority.
- LOD chunks must reference the same source revision hash as collider and placement data.
- Each chunk exposes bounds, source sample range, neighbor ids, seam policy, material roles, and debug proof status.
- Renderer is a consumer of terrain source data, not the terrain source owner.
- LOD ring changes must be tested while walking, sprinting, rotating camera, boarding train, and approaching extraction.

## Risk

The main failure is hiding seams with skirts while collider, raycast, or gameplay placement still disagrees with the visible terrain.
