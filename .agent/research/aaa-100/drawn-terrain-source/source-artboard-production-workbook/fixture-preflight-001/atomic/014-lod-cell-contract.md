# 014 - LOD Cell Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: render/performance
Generic kit candidate: `n:world:terrain-chunks`
GoldRush kit candidate: `n:goldrush:gold-field-lod`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: near, mid, far, horizon cell ids.
- Public proof: active camera/player position resolves expected LOD cells.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving active camera/player position resolves expected LOD cells.
