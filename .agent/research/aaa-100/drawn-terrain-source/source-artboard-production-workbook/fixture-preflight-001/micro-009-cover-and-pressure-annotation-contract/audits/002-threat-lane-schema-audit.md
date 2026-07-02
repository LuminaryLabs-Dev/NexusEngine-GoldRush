# 002 - Threat Lane Schema Audit

Status: planned docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`
Source field: `threatLanes`

## Audit Lens

Audit `threatLanes` as a source-owned terrain combat annotation, not as a visual threat lane or gameplay shortcut.

## Findings To Check

- Does the source fixture own the field and revision?
- Can every consumer echo fixture id, cover id, pressure id, and revision?
- Can validation fail the missing-field, duplicate-id, unknown-tag, unreachable-counterplay, and stale-consumer cases?
- Can the player read foreground cover, midground threat, and next counterplay without debug overlays?
- Can combat receipts, replay, and results trace back to the same annotation?
- Does public proof refresh when the source cover or pressure annotation changes?

## Long-Term Impact If Ignored

GoldRush will keep feeling like a combat prototype even if the scene gets denser, because threat pressure can still be detached from authored place identity, route risk, player counterplay, and proof.

## Hardening Requirement

- Add a validator case for `threatLanes`.
- Add one consumer snapshot echo.
- Add one negative fixture case.
- Add one human-view or state-proof expectation.
- Mark local, simulator, and public proof stale when the source revision changes.

## Pass Condition

validator proves threat lanes have id, origin band, target band, width, visibility class, risk tier, and revision.

## Stop Condition

Stop if ambush pressure can spawn without naming a source threat lane.
