# 006 - Walkable Blocker Mask Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics/navigation
Generic kit candidate: `n:world:walkability-mask`
GoldRush kit candidate: `n:goldrush:mountain-blockers`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: walkable and blocker masks.
- Public proof: blocked cells reject grounding and placement unless edge case is named.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving blocked cells reject grounding and placement unless edge case is named.

## Micro Runway

Use `../micro-006-walkable-blocker-mask-contract/README.md` before implementation. It splits this atom into walkable mask schema, blocker mask schema, walkability classes, blocker classes, slope linkage, hole/overhang policy, movement rejection parity, placement rejection parity, AI route/staging parity, edge transition policy, negative fixture cases, and stale-proof policy.
