# 003 - Deposit Anchor Contract Audit

Status: planned docs-only
Parent atom: `010-cashout-and-extraction-annotation-contract`
Source field: `depositAnchors`

## Audit Lens

Audit `depositAnchors` as source-owned extraction destination annotation data, not as a visual marker, gameplay shortcut, or scoring helper.

## Findings To Check

- Does the source fixture own the field and revision?
- Can every consumer echo fixture id, cashout id, deposit anchor id, route id, radius band, and revision where applicable?
- Can validation fail missing-field, duplicate-id, invalid-radius, unreachable-anchor, orphan-route, unknown-tag, and stale-consumer cases?
- Can the player read foreground deposit target, midground route back, and destination risk without debug overlays?
- Can receipts, scoring, replay, and results trace back to the same source annotation?
- Does public proof refresh when the source cashout or extraction annotation changes?

## Long-Term Impact If Ignored

GoldRush will keep feeling like a marker prototype even if the scene gets denser, because extraction can still be detached from authored place identity, route risk, contest readability, scoring provenance, and proof.

## Hardening Requirement

- Add a validator case for `depositAnchors`.
- Add one consumer snapshot echo.
- Add one negative fixture case.
- Add one human-view or state-proof expectation.
- Mark local, simulator, and public proof stale when the source revision changes.

## Pass Condition

validator proves deposit/cashout interaction anchors have id, position, facing, stance, input range, and revision.

## Stop Condition

Stop if a cashout hold can start without a source deposit anchor id.
