# Central Mountain Blocker - Domain Implication

Status: active docs-only
Domain: world / physics / route design
Related generic kit: `n:physics:collider`
Related GoldRush kit: `n:goldrush:terrain-physics`

## Purpose

Explain which GoldRush domains must change behavior because this map family exists.

## Reference Signal

HLOD-style thinking implies distant non-interactive mesas should remain visible through proxy layers rather than full terrain.

## GoldRush Interpretation

Turn the central mountain into an authored blocker, not a visual-only pile of triangles.

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
