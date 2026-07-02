# 006 - Cashout Readability Tags

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/gameplay/match/render/validation
Generic kit candidate: `n:world:extraction-zone-mask`
GoldRush kit candidate: `n:goldrush:cashout-sites`

## Purpose

Make cashout visibility and recognition a source contract instead of an accidental visual style.

## Source Field

- Required field: `cashoutReadabilityTags`.
- The cashout/extraction annotation kit must define or consume this field before renderer markers, extraction holds, return-route guidance, combat pressure, cargo transfer, receipts, scoring, replay, results, bot staging, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `cashoutReadabilityTags` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, and revision.

## Consumer Echo

- Renderer, audio, VFX, prompts, accessibility labels, screenshots, simulator proof, and public proof must echo the readability tag set.
- Cashout, extraction, receipt, replay, simulator, and public proof consumers must not use different destination data from player-facing cashout readability.

## Required Proof

validator proves each cashout site carries silhouette, beacon, audio cue, approach visibility, prompt clarity, and occlusion tags.

## Stop Condition

Stop if cashout exists in state but cannot be visually or aurally distinguished in player view.
