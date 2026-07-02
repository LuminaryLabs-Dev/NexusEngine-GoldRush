# Extraction Depot Cashout - Edge Case Audit

Status: active docs-only
Domain: gameplay / world / presentation
Related generic kit: `n:world:zone-mask`
Related GoldRush kit: `n:goldrush:cashout-sites`

## Purpose

List likely failure modes that would make a green validator misleading.

## Reference Signal

Terrain layer workflows imply material and biome masks should be explicit and budgeted.

## GoldRush Interpretation

Make cashout an authored landmark route, not a marker floating on a generic field.

This research note is a constraint on future implementation. It does not prove that the game currently has the feature. It says what the next implementation packet must prove before this family can move from planned to active runtime work.

## Questions Before Coding

- Which source layer or mask owns this family?
- Which kit exposes the public API?
- Which private consumer derives renderer, physics, route, or gameplay data?
- Which validator catches drift?
- Which screenshot or video proves player-view readability?
- Which report label prevents local proof from being mistaken for public or live readiness?

## Research-Derived Acceptance

- source revision id is present
- consumer lockstep is visible
- data fixture is serializable
- player path is natural when interactive
- 60-player claims remain simulation/live-labeled
- no raw or local source path appears in public reports
