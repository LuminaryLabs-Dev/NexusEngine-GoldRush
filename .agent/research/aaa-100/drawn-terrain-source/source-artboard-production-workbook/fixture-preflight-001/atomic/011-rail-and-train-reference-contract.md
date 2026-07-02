# 011 - Rail And Train Reference Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: rail direction, train edge, platform approach.
- Public proof: train and gold-field source use compatible direction labels.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Micro Runway

The deeper docs-only runway for this atom lives at `../micro-011-rail-and-train-reference-contract/README.md`.

## Stop Condition

Stop if this atom can pass without proving train and gold-field source use compatible direction labels.
