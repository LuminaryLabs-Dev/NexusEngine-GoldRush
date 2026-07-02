# 003 - Resource Node Id Contract

Status: planned docs-only
Parent atom: `008-mine-and-gold-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/content/validation
Generic kit candidate: `n:world:resource-annotations`
GoldRush kit candidate: `n:goldrush:gold-seams`

## Purpose

Make `resourceNodeIds` small enough for a future implementation pass.

## Source Field

- Required field: `resourceNodeIds`.
- The resource annotation kit must define or consume this field before mining visuals, hold actions, cargo, scoring, replay, bot staging, or proof consumers derive behavior from it.

## Validator Case

- Fail when `resourceNodeIds` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Resource visuals must name the source annotation decision that makes the object mineable.
- Interaction hold must name the same source annotation revision when starting, ticking, cancelling, or completing.
- Cargo, receipt, scoring, replay, and public proof must not use different resource data from player-facing mining.

## Required Proof

validator proves every mineable node has a stable source id, annotation id, node id, and revision echo.

## Stop Condition

Stop if mining receipts can be created without a source annotation id.
