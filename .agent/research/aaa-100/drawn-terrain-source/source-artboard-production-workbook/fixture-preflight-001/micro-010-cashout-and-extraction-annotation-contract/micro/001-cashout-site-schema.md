# 001 - Cashout Site Schema

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make source-owned cashout destination identity small enough for a future implementation pass.

## Source Field

- Required field: `cashoutSites`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `cashoutSites` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- Cashout markers, extraction holds, receipts, replay, results, bot staging, and public proof must name the same source cashout site id and revision.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

validator proves source-owned cashout sites have id, shape, radius, role, approach lanes, state tags, and revision.

## Stop Condition

Stop if a cashout marker can be derived only from a renderer beacon or hardcoded coordinate.
