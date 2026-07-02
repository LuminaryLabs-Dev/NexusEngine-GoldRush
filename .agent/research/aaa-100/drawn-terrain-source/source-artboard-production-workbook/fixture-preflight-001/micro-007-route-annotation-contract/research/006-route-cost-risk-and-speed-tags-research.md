# 006 - Route Cost Risk And Speed Tags Research

Status: planned docs-only
Parent atom: `007-route-annotation-contract`

## Research Question

What external and local architecture signals constrain `routeCostRiskTags` before implementation?

## Source Signals

- Unity Splines provides shared tooling for curves and paths, useful for roads, trajectories, and path-based objects: https://docs.unity3d.com/Packages/com.unity.splines@latest/
- Unity NavMesh Link models navigable links between surfaces or across gaps, which constrains branch/return lane and connection proof: https://docs.unity3d.com/560/Documentation/Manual/class-NavMeshLink.html
- Unity AI Navigation Off-Mesh Links describe traversal outside normal walkable surfaces, useful for explicit route exceptions: https://docs.unity3d.com/Packages/com.unity.ai.navigation@1.1/manual/CreateOffMeshLink.html
- Unreal Landscape and spline systems are relevant as route/path feature scans for open-world terrain authoring: https://dev.epicgames.com/documentation/unreal-engine/landscape-overview?lang=en-US
- EA Apex Maps show battle royale maps as named places that support rotations and player decision-making, not just terrain fill: https://www.ea.com/en/games/apex-legends/apex-legends/maps-hub
- The GitHub game engines collection is a missing-feature scan for modular runtime, rendering, physics, content, and tooling surfaces, not a directive to build a general engine: https://github.com/collections/game-engines

## Domain Implication

- Route annotations own query output for `routeCostRiskTags`.
- Player guidance, AI staging, gameplay zones, extraction routes, screenshots, simulator reports, and public proof must echo or derive from the same fixture revision.
- The field should be serializable in snapshots so local and public proof can compare route decisions.

## Data And Proof Implication

- Validator needs one good fixture case.
- Validator needs one negative case where route behavior is inferred from visible trail, coordinates, or local guidance only.
- Browser or state proof must show the field through the owning kit instead of renderer inspection.

## Edge Case

The likely fake-completion path is route geometry without gameplay meaning, causing pressure and reward systems to stay detached from the map.
