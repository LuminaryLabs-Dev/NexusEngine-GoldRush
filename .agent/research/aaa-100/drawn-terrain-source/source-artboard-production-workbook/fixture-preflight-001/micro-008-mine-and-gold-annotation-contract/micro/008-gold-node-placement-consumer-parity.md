# 008 - Gold Node Placement Consumer Parity

Status: planned docs-only
Parent atom: `008-mine-and-gold-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/content/validation
Generic kit candidate: `n:world:resource-annotations`
GoldRush kit candidate: `n:goldrush:gold-seams`

## Purpose

Make `goldNodePlacementEcho` small enough for a future implementation pass.

## Source Field

- Required field: `goldNodePlacementEcho`.
- The resource annotation kit must define or consume this field before mining visuals, hold actions, cargo, scoring, replay, bot staging, or proof consumers derive behavior from it.

## Validator Case

- Fail when `goldNodePlacementEcho` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Resource visuals must name the source annotation decision that makes the object mineable.
- Interaction hold must name the same source annotation revision when starting, ticking, cancelling, or completing.
- Cargo, receipt, scoring, replay, and public proof must not use different resource data from player-facing mining.

## Required Proof

renderer placement and object protokits echo mine id, seam id, resource node id, raycast hit, and source revision.

## Stop Condition

Stop if the renderer can add a mineable object that no source annotation owns.
