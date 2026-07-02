# 002 - Bounds Scale And Origin

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/network
Generic kit candidate: `n:world:authored-terrain-mesh`
GoldRush kit candidate: `n:goldrush:desert-world-map`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: worldBounds, origin, unitScale, cellSize.
- Public proof: queries reject points outside bounds and report unit scale.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving queries reject points outside bounds and report unit scale.

## Micro Runway

Start future implementation with `../micro-002-bounds-scale-and-origin/README.md`. That packet splits this atom into coordinate system, unit scale, playable bounds, origin anchor, cell size, vertical range, out-of-bounds negative case, query boundary mode, traversal scale check, LOD/partition scale echo, physics/render parity, and restart policy.
