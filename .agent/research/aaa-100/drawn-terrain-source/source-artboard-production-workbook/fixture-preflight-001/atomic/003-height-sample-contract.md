# 003 - Height Sample Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics
Generic kit candidate: `n:world:terrain-heightfield`
GoldRush kit candidate: `n:goldrush:desert-terrain`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: height samples and source cell ids.
- Public proof: sampleHeight returns finite values from the fixture.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving sampleHeight returns finite values from the fixture.

## Micro Runway

Start future implementation with `../micro-003-height-sample-contract/README.md`. That packet splits this atom into height array shape, value domain, normalization policy, origin offset, source cell id, interpolation mode, edge policy, public query API shape, named proof points, render/collider parity, negative fixture cases, and stale-proof behavior after height revision changes.
