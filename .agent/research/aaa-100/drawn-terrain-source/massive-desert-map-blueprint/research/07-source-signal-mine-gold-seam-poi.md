# Mine Gold Seam POI - Source Signal

Status: active docs-only
Domain: gameplay / content / world
Related generic kit: `n:world:placement-raycast`
Related GoldRush kit: `n:goldrush:gold-seam-protokits`

## Purpose

Connect external architecture or battle-royale design references to the map family without copying proprietary content.

## Reference Signal

World Partition-style thinking implies one persistent source divided into streamable cells around player or proof sources.

## GoldRush Interpretation

Make the mine and gold seams source-anchored so mining is visible, reachable, and worth fighting over.

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
