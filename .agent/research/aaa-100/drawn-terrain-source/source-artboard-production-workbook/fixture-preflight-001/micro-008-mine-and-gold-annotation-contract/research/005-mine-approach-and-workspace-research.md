# 005 - Mine Approach And Workspace Research

Status: planned docs-only
Parent atom: `008-mine-and-gold-annotation-contract`
Source field: `mineApproachWorkspace`

## Purpose

Document the source signals and design implications for `mineApproachWorkspace` before future implementation.

## Current Reference Signals

- Unity Terrain editing: terrain should be sculpted, painted, and detailed from authored terrain tooling rather than inferred entirely at runtime. Reference: https://docs.unity3d.com/Manual/terrain-UsingTerrains.html
- Unity Terrain settings: large terrain must be organized as settings, tiles, and source data that consumers can query consistently. Reference: https://docs.unity3d.com/Manual/terrain-OtherSettings.html
- Unreal Landscape overview: height and weight data can support LOD and streaming when the terrain source owns the data. Reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-overview
- Unreal World Partition: large worlds need cell ownership, streaming ranges, and activation state instead of one monolithic runtime field. Reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine
- Apex Legends maps: battle royale maps depend on named places, rotations, and player-understandable POIs. Reference: https://www.ea.com/en/games/apex-legends/apex-legends/maps-hub
- GitHub game engines collection: mature engine ecosystems separate rendering, world data, physics, tooling, and validation concerns. Reference: https://github.com/collections/game-engines

## Domain Implication

- World: the terrain source owns whether a place is a mine, seam, resource node, approach, or blocked workspace.
- Render: visuals consume annotation ids and forms; they do not create mineability.
- Gameplay: mining, cargo, scoring, and extraction receipts must keep source provenance.
- Validation: proof must fail when the annotation is missing, stale, unowned, or only visible through renderer state.

## Data Implication

- Minimal config should contain ids, revision, shape, tags, and proof points.
- Public API should expose read-only queries and consumer snapshots.
- Internal API may derive raycast hits, workspaces, yield tables, and proof samples behind the kit boundary.

## Edge Cases

- Duplicate mine or seam ids across LOD cells.
- Mine marker visible but interaction anchor missing.
- Gold seam hidden behind blocker or outside walkable approach.
- Renderer object exists without a source annotation.
- Cargo receipt created after source revision changes.
- Public proof reuses a stale screenshot after annotation movement.

## Implementation Question

What exact consumer echo proves `mineApproachWorkspace` is source-owned and not inferred from a primitive, helper, or renderer-only object?
