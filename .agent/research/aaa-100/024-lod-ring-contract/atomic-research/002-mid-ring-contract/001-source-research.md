# 024.002 Mid Ring Contract - Source Research

Status: research-planned
Parent: 024 LOD ring contract
Atomic: 024.002 Mid Ring Contract
Domain: world/render
Owning kit candidate: `n:render:terrain-lod-rings`

## Research Question

What production, BR, extraction, terrain, LOD, collider, or asset-pipeline references constrain this concern before implementation?

## Atomic Intent

Define mid-ring simplification, silhouette preservation, prop impostors, and safe transition distance.

## Source Notes

- GitHub Game Engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use as a production-surface checklist for scene, asset, physics, tooling, and platform gaps; do not turn GoldRush into a general engine.
- Unreal level streaming docs: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming?application_version=4.27
  - GoldRush use: Large worlds are divided into chunks and streamed so only relevant parts consume resources.
- Unity heightmap docs: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Heightmaps store terrain height as rectangular grayscale data and support import/export workflows.
- Unity terrain collider docs: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Terrain colliders should match the visible heightmap when collision precision matters.
- Godot mesh LOD docs: https://docs.godotengine.org/en/stable/tutorials/3d/mesh_lod.html
  - GoldRush use: LOD is a core 3D performance technique and must be measured, not assumed.
- Godot HLOD visibility docs: https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html
  - GoldRush use: Manual visibility ranges and HLOD can reduce distant visual complexity while preserving near culling.
- Godot HeightMapShape3D docs: https://docs.godotengine.org/en/stable/classes/class_heightmapshape3d.html
  - GoldRush use: Heightmap collision works well for terrain grids but cannot model overhangs or caves without separate meshes.
- EA Apex Knockout BR reference: https://www.ea.com/games/apex-legends/apex-legends/news/space-hunt-event
  - GoldRush use: 60-player, 20-squad objective pressure supports GoldRush 60-player planning and readable squad-scale objectives.
- EA Apex Bot Royale staging reference: https://www.ea.com/games/apex-legends/apex-legends/news/breach-patch-notes
  - GoldRush use: Bot-filled BR staging supports GoldRush single-player test environments that still resemble full matches.
- PUBG official overview: https://pubg.com/en/game-info/overview
  - GoldRush use: Large-map land, loot, survive, vehicle, training, and shrinking-zone patterns define BR map obligations.
- Hunt official game page: https://www.huntshowdown.com/game
  - GoldRush use: Extraction works when valuable objectives, sound, risk, and destination pressure are readable.
- Hunt hidden extraction update: https://www.huntshowdown.com/news/update-28-road-to-hell-go-live
  - GoldRush use: Hidden/revealed extraction information can make exploration and situational awareness valuable.

## GoldRush Interpretation

This concern should be implemented as part of the authored map source pipeline, not as renderer-only decoration. The source references point to one repeated rule: large-world readability depends on explicit source data, chunking, collision parity, LOD policy, and player-facing proof.

## Decision Needed Later

Pick the smallest runtime slice that proves this concern from source data, then attach a validator and, if visible, a human-view screenshot proof.
