# 024 - Restart Packet And Lessons Loop

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: production
Generic kit candidate: `n:runtime:validation`
GoldRush kit candidate: `n:goldrush:restart-policy`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: restart reason, stale proof list, lesson update.
- Public proof: source revision changes create a restart packet and update lesson only when behavior changes.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Stop Condition

Stop if this atom can pass without proving source revision changes create a restart packet and update lesson only when behavior changes.
