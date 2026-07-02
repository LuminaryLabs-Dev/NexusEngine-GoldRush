# 011 - Mine Gold Negative Fixture Cases Audit

Status: planned docs-only
Parent atom: `008-mine-and-gold-annotation-contract`
Source field: `mineGoldNegativeCases`

## Audit Lens

Audit `mineGoldNegativeCases` as a source-owned terrain annotation, not as a visual marker or gameplay shortcut.

## Findings To Check

- Does the source fixture own the field and revision?
- Can every consumer echo fixture id, annotation id, and revision?
- Can validation fail the missing-field, duplicate-id, unknown-tag, and stale-consumer cases?
- Can the player see or reach the authored mine/gold point without proof helpers?
- Can cargo, scoring, replay, and results trace back to the same annotation?
- Does public proof refresh when the source annotation changes?

## Long-Term Impact If Ignored

GoldRush will keep feeling like a prototype even if the scene becomes visually denser, because the core resource loop can still be detached from authored place identity, route planning, risk, and proof.

## Hardening Requirement

- Add a validator case for `mineGoldNegativeCases`.
- Add one consumer snapshot echo.
- Add one negative fixture case.
- Add one human-view or state-proof expectation.
- Mark local, simulator, and public proof stale when the source revision changes.

## Pass Condition

validator fails missing mine ids, duplicate seam ids, unknown tier tags, orphan resource nodes, blocked workspaces, and stale consumer echoes.

## Stop Condition

Stop if the validator only checks happy-path mining.
