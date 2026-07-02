# 009 - Extraction Hold Consumer Parity

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make the mine-to-cashout hold action consume the same source destination as the renderer.

## Source Field

- Required field: `extractionHoldEcho`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `extractionHoldEcho` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- Hold progress, cancel, completion, contest, cargo transfer, receipt, replay, and results must echo source cashout and anchor ids.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

extraction hold snapshots echo source cashout id, anchor id, hold progress, contest state, cancel reason, and revision.

## Stop Condition

Stop if hold action can complete against an unannotated cashout site.
