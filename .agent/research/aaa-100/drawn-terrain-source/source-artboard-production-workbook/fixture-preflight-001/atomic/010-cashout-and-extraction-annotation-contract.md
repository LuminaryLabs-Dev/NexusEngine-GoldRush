# 010 - Cashout And Extraction Annotation Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/match
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: cashout marker, extraction radius, return route.
- Public proof: cashout marker and receipt can report annotation id.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Micro Runway

The deeper docs-only runway for this atom lives at `../micro-010-cashout-and-extraction-annotation-contract/README.md`.

## Stop Condition

Stop if this atom can pass without proving cashout marker and receipt can report annotation id.
