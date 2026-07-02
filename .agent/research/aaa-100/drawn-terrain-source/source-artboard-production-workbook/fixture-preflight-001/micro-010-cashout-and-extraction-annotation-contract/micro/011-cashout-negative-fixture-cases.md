# 011 - Cashout Negative Fixture Cases

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make invalid cashout annotations fail before they reach renderer, gameplay, scoring, or proof.

## Source Field

- Required field: `cashoutNegativeCases`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `cashoutNegativeCases` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- Every consumer test must include at least one failing source case that prevents cashout proof from going green.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

validator fails missing site ids, duplicate anchors, invalid radii, orphan return routes, unknown tags, unreachable sites, and stale consumer echoes.

## Stop Condition

Stop if validation only proves one marker exists.
