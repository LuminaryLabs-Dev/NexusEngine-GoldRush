# Horizon Mesa HLOD - Edge Case Audit

Status: active docs-only
Domain: render / performance / world
Related generic kit: `n:world:terrain-chunks`
Related GoldRush kit: `n:goldrush:gold-field-lod`

## Purpose

List likely failure modes that would make a green validator misleading.

## Reference Signal

Terrain layer workflows imply material and biome masks should be explicit and budgeted.

## GoldRush Interpretation

Keep distant mesas and cliffs visible as cheap far-world identity without loading full interactive terrain.

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
