# 003 - Material Tag Taxonomy

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio/vfx/content/gameplay
Generic kit candidate: `n:world:terrain-material-mask`
GoldRush kit candidate: `n:goldrush:desert-materials`

## Purpose

Make `materialTags` small enough for a future implementation pass.

## Source Field

- Required field: `materialTags`.
- The terrain material mask kit must define or consume this field before render, audio, VFX, placement, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `materialTags` is missing, unknown, non-finite, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Renderer must not own terrain identity by color alone.
- Audio and VFX must not stay generic when source material or biome changes.
- Placement and gameplay must not invent surface or biome tags outside the source fixture.

## Required Proof

source fixture exposes a closed tag set for sand, rock, gravel, clay, wood, rail, water, and mine-tailings surfaces.

## Stop Condition

Stop if this micro-step can pass while render, audio, VFX, and placement use inconsistent names for the same ground surface.
