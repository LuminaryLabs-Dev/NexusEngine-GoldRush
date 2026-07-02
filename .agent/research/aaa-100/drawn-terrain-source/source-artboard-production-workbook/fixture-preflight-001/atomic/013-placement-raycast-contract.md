# 013 - Placement Raycast Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/content
Generic kit candidate: `n:world:placement-raycast`
GoldRush kit candidate: `n:goldrush:desert-prop-placement`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: raycast hit, normal, slope, material, anchor id.
- Public proof: anchors resolve to grounded transforms on the fixture.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving anchors resolve to grounded transforms on the fixture.
