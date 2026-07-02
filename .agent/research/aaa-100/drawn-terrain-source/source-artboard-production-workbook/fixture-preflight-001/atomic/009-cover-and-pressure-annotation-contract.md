# 009 - Cover And Pressure Annotation Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: combat/world
Generic kit candidate: `n:world:cover-pressure-mask`
GoldRush kit candidate: `n:goldrush:ambush-pressure`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: cover pockets, threat lanes, pressure seeds.
- Public proof: combat proof can name source cover and pressure ids.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Micro Runway

The deeper docs-only runway for this atom lives at `../micro-009-cover-and-pressure-annotation-contract/README.md`.

Use it before coding cover pocket schema, threat lane schema, pressure seeds, sightline/occlusion tags, route linkage, counterplay, combat proof points, pressure queries, renderer threat echoes, combat-loop echoes, negative fixture cases, or stale-proof behavior.

## Stop Condition

Stop if this atom can pass without proving combat proof can name source cover and pressure ids.
