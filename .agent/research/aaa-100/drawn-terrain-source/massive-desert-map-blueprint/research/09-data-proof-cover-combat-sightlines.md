# Cover Combat Sightlines - Data And Proof

Status: active docs-only
Domain: combat / world / camera
Related generic kit: `n:world:line-of-sight`
Related GoldRush kit: `n:goldrush:combat-route-guidance`

## Purpose

Specify the smallest data fixture and proof artifact that would make implementation evidence real.

## Reference Signal

Terrain heightmap workflows imply map shape should be editable source data before renderer or collider derivation.

## GoldRush Interpretation

Author cover pockets, sightline breaks, and threat lanes into terrain instead of staging combat anywhere convenient.

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
