# 008 - Mine And Gold Annotation Contract

Status: planned docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/world
Generic kit candidate: `n:world:resource-annotations`
GoldRush kit candidate: `n:goldrush:gold-seams`

## Purpose

Make one source-fixture concern small enough for a future implementation pass.

## Atomic Scope

- Source data: mine site and gold seam annotations.
- Public proof: mining marker can be derived from annotation id.
- Consumer boundary: the owning kit reports fixture id and revision id in snapshot output.
- Runtime boundary: no renderer, physics, placement, or gameplay fallback may replace this source field silently.

## Substeps

1. Define the source field or snapshot requirement.
2. Add a validator failure case for missing or drifting data.
3. Add one consumer proof path.
4. Add one human-view or state-proof expectation.
5. Mark stale proof if the fixture revision changes.

## Micro Runway

The deeper docs-only runway for this atom lives at `../micro-008-mine-and-gold-annotation-contract/README.md`.

Use it before coding mine site schema, gold seam schema, resource node ids, yield tiers, workspaces, readability tags, interaction anchors, renderer placement echoes, hold-action echoes, cargo/receipt echoes, negative fixture cases, or stale-proof behavior.

## Stop Condition

Stop if this atom can pass without proving mining marker can be derived from annotation id.
