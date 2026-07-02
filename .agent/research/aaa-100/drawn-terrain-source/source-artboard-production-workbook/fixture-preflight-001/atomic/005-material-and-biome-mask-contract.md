# 005 - Material And Biome Mask Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio
Generic kit candidate: `n:world:terrain-material-mask`
GoldRush kit candidate: `n:goldrush:desert-materials`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: material and biome masks.
- Public proof: render, audio, VFX, and placement can name material and biome tags.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving render, audio, VFX, and placement can name material and biome tags.

## Micro Runway

Start future implementation with `../micro-005-material-and-biome-mask-contract/README.md`. That packet splits this atom into material mask schema, biome mask schema, material tags, biome tags, mask weight domain, layer blend policy, render material parity, audio/VFX surface parity, placement biome parity, gameplay surface parity, negative fixture cases, and stale-proof behavior after material or biome revision changes.
