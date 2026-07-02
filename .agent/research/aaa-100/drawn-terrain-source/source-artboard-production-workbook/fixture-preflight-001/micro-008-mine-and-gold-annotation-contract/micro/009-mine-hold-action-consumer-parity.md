# 009 - Mine Hold Action Consumer Parity

Status: planned docs-only
Parent atom: `008-mine-and-gold-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/content/validation
Generic kit candidate: `n:world:resource-annotations`
GoldRush kit candidate: `n:goldrush:gold-seams`

## Purpose

Make `mineHoldActionEcho` small enough for a future implementation pass.

## Source Field

- Required field: `mineHoldActionEcho`.
- The resource annotation kit must define or consume this field before mining visuals, hold actions, cargo, scoring, replay, bot staging, or proof consumers derive behavior from it.

## Validator Case

- Fail when `mineHoldActionEcho` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Resource visuals must name the source annotation decision that makes the object mineable.
- Interaction hold must name the same source annotation revision when starting, ticking, cancelling, or completing.
- Cargo, receipt, scoring, replay, and public proof must not use different resource data from player-facing mining.

## Required Proof

interaction-hold snapshots echo source annotation id, node id, hold progress, cancel reason, and revision.

## Stop Condition

Stop if a hold action can complete against an unannotated object or stale seam revision.
