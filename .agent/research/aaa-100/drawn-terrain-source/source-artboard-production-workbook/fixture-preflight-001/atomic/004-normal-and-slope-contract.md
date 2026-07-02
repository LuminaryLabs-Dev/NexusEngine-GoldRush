# 004 - Normal And Slope Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/control
Generic kit candidate: `n:world:terrain-raycast`
GoldRush kit candidate: `n:goldrush:player-grounding`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: normal vector and slope class.
- Public proof: sampleGround returns normal and slope for every walkable test point.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving sampleGround returns normal and slope for every walkable test point.

## Micro Runway

Start future implementation with `../micro-004-normal-and-slope-contract/README.md`. That packet splits this atom into normal vector shape, normal space, slope value domain, slope class taxonomy, walkable thresholds, normal derivation source, gradient sample neighborhood, sampleGround API shape, movement consumer parity, placement consumer parity, negative fixture cases, and stale-proof behavior after normal or slope revision changes.
