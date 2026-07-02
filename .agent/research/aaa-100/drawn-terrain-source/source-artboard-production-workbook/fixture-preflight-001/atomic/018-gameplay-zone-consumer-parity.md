# 018 - Gameplay Zone Consumer Parity

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/runtime
Generic kit candidate: `n:gameplay:interaction-hold`
GoldRush kit candidate: `n:goldrush:mine-hold-action`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: zone annotation ids used by actions.
- Public proof: mine and cashout actions report source annotation ids.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving mine and cashout actions report source annotation ids.
