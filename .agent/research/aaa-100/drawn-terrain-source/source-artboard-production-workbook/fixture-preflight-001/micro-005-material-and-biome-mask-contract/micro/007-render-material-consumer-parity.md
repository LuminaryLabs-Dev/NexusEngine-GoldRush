# 007 - Render Material Consumer Parity

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio/vfx/content/gameplay
Generic kit candidate: `n:world:terrain-material-mask`
GoldRush kit candidate: `n:goldrush:desert-materials`

## Purpose

Make `renderMaterialEcho` small enough for a future implementation pass.

## Source Field

- Required field: `renderMaterialEcho`.
- The terrain material mask kit must define or consume this field before render, audio, VFX, placement, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `renderMaterialEcho` is missing, unknown, non-finite, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Renderer must not own terrain identity by color alone.
- Audio and VFX must not stay generic when source material or biome changes.
- Placement and gameplay must not invent surface or biome tags outside the source fixture.

## Required Proof

render snapshot names the source material and biome tags used for terrain material selection.

## Stop Condition

Stop if this micro-step can pass while Three.js materials become the terrain identity source instead of rendering source-owned masks.
