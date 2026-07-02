# Source Proof Restart - Domain Implication

Status: active docs-only
Domain: validation / production / release
Related generic kit: `n:runtime:validation`
Related GoldRush kit: `n:goldrush:reality-status`

## Purpose

Explain which GoldRush domains must change behavior because this map family exists.

## Reference Signal

HLOD-style thinking implies distant non-interactive mesas should remain visible through proxy layers rather than full terrain.

## GoldRush Interpretation

Make every terrain proof restartable by source revision, schema version, consumer lockstep, and public proof boundary.

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
