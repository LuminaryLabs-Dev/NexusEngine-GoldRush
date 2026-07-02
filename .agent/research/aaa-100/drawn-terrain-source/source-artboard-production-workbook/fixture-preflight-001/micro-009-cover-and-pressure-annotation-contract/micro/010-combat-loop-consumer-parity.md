# 010 - Combat Loop Consumer Parity

Status: planned docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/combat/render/gameplay/validation
Generic kit candidate: `n:world:cover-pressure-mask`
GoldRush kit candidate: `n:goldrush:ambush-pressure`

## Purpose

Make `combatLoopPressureEcho` small enough for a future implementation pass.

## Source Field

- Required field: `combatLoopPressureEcho`.
- The cover/pressure annotation kit must define or consume this field before renderer threat visuals, combat route guidance, ambush pressure, action surface, receipts, replay, results, bot staging, or proof consumers derive behavior from it.

## Validator Case

- Fail when `combatLoopPressureEcho` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Threat visuals must name the source cover/pressure decision that makes the combat state readable.
- Ambush pressure and combat route guidance must name the same source revision when triggering, guiding, resolving, or recording combat state.
- Receipts, replay, results, simulator proof, and public proof must not use different pressure data from player-facing threat readability.

## Required Proof

ambush pressure, combat route guidance, action surface, receipts, replay, and results name the same source pressure ids.

## Stop Condition

Stop if a combat receipt can be produced without source pressure provenance.
