# 004 - Biome Tag Taxonomy

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio/vfx/content/gameplay
Generic kit candidate: `n:world:terrain-material-mask`
GoldRush kit candidate: `n:goldrush:desert-materials`

## Purpose

Make `biomeTags` small enough for a future implementation pass.

## Source Field

- Required field: `biomeTags`.
- The terrain material mask kit must define or consume this field before render, audio, VFX, placement, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `biomeTags` is missing, unknown, non-finite, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Renderer must not own terrain identity by color alone.
- Audio and VFX must not stay generic when source material or biome changes.
- Placement and gameplay must not invent surface or biome tags outside the source fixture.

## Required Proof

source fixture exposes a closed biome set for basin, mesa, wash, mine-shelf, town-shelf, rail-bed, gold-seam, and extraction-site regions.

## Stop Condition

Stop if this micro-step can pass while map regions look different but do not drive placement, route readability, or gameplay pressure consistently.
