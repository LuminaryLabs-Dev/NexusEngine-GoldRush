# 011 - Walkable Blocker Negative Cases

Status: planned docs-only
Parent atom: `006-walkable-blocker-mask-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics/navigation/control/content/validation
Generic kit candidate: `n:world:walkability-mask`
GoldRush kit candidate: `n:goldrush:mountain-blockers`

## Purpose

Make `walkableBlockerNegativeCases` small enough for a future implementation pass.

## Source Field

- Required field: `walkableBlockerNegativeCases`.
- The walkability mask kit must define or consume this field before movement, placement, AI staging, camera collision, or proof consumers derive behavior from it.

## Validator Case

- Fail when `walkableBlockerNegativeCases` is missing, unknown, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Movement must name the source walkability or blocker decision that accepted or rejected a step.
- Placement must name the source walkability or blocker decision that accepted or rejected an anchor.
- AI staging and public proof must not use a different navigation surface from the local player.

## Required Proof

validator fails missing masks, unknown classes, contradictory slope rules, blocked accepted placement, and stale consumer echoes.

## Stop Condition

Stop if the validator has no fixture where blocked data is intentionally wrong and must fail.
