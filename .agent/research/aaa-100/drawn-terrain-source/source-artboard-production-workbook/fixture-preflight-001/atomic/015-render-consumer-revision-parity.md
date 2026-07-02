# 015 - Render Consumer Revision Parity

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: render/runtime
Generic kit candidate: `n:render:three-scene`
GoldRush kit candidate: `n:goldrush:3d-scene-renderer`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: render chunk source revision and LOD cell id.
- Public proof: render snapshot reports fixture and revision.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving render snapshot reports fixture and revision.
