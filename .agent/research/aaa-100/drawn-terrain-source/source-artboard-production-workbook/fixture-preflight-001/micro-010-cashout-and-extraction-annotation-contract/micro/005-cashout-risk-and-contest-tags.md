# 005 - Cashout Risk And Contest Tags

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make extraction destination risk and contest behavior readable from closed source tags.

## Source Field

- Required field: `cashoutRiskContestTags`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `cashoutRiskContestTags` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- UI prompts, audio stingers, combat pressure, bot staging, receipt modifiers, replay, and results must echo the same risk and contest tags.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

validator proves cashout sites expose risk tier, contest class, visibility class, pressure relation, and extraction value tags as closed values.

## Stop Condition

Stop if cashout contest or lockdown state is only derived from current combat pressure.
