# 009 - AI Route And Bot Staging Parity Research

Status: planned docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Research Question

What external and local architecture signals constrain `aiRouteWalkabilityEcho` before implementation?

## Source Signals

- Unity AI Navigation defines Walkable and Not Walkable areas, with Not Walkable taking precedence over overlapping areas: https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AreasAndCosts.html
- Unity Terrain Collider builds its collider shape from TerrainData properties, so collision must stay tied to terrain source data: https://docs.unity3d.com/6000.0/Documentation/Manual/class-TerrainCollider.html
- Unreal Landscape uses heightfield collision and target layers for physical material decisions: https://dev.epicgames.com/documentation/unreal-engine/landscape-overview?lang=en-US
- Apex separates practice, bot, private, and competitive modes, which supports GoldRush staging proof before future live 60-player claims: https://help.ea.com/en/articles/apex-legends/game-modes/
- The GitHub game engines collection is a missing-feature scan for modular runtime, rendering, physics, content, and tooling surfaces, not a directive to build a general engine: https://github.com/collections/game-engines

## Domain Implication

- Walkability and blocker masks own query output for `aiRouteWalkabilityEcho`.
- Movement, placement, AI staging, collider, camera, gameplay, and proof consumers must echo or derive from the same fixture revision.
- The field should be serializable in snapshots so local and public proof can compare terrain navigation decisions.

## Data And Proof Implication

- Validator needs one good fixture case.
- Validator needs one negative case where a consumer accepts terrain from height or visual mesh alone.
- Browser or state proof must show the field through the owning kit instead of renderer inspection.

## Edge Case

The likely fake-completion path is proving local player movement while future bot and staging routes still use a different grid.
