# 007 - Cashout Query Api Shape

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make the public cashout query small, stable, serializable, and source-owned.

## Source Field

- Required field: `cashoutQueryApi`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `cashoutQueryApi` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- Gameplay, renderer, bot staging, interaction, receipts, replay, and proof scripts must use the same query output shape.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

getCashoutAt reports site id, radius band, anchor id, route link, risk tags, and revision at named proof points.

## Stop Condition

Stop if gameplay or renderer queries cashout through local marker objects.
