# 010 - Receipt And Results Consumer Parity

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make score, replay, and results prove where extracted gold was accepted.

## Source Field

- Required field: `cashoutReceiptResultsEcho`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `cashoutReceiptResultsEcho` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- Receipts, score modifiers, squad totals, replay digest, results screen, simulator reports, and public proof must retain source cashout id.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

extraction receipts, scoring, replay, and results name the same source cashout annotation that accepted the carried gold.

## Stop Condition

Stop if a result score can be produced from extracted gold without source cashout provenance.
