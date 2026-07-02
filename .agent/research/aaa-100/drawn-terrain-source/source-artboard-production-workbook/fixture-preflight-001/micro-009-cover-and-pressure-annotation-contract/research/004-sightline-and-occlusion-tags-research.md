# 004 - Sightline And Occlusion Tags Research

Status: planned docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`
Source field: `sightlineOcclusionTags`

## Purpose

Document the source signals and design implications for `sightlineOcclusionTags` before future implementation.

## Current Reference Signals

- Apex Legends E-District: battle-royale POIs need varied verticality, rooftop-to-rooftop combat, street combat, flanks, and player-controlled movement options. Reference: https://www.ea.com/games/apex-legends/apex-legends/news/welcome-to-edistrict
- Apex Legends Ignite Storm Point update: map updates should reduce rotation friction, improve pacing, create central hot drops, and add defensive options when squads are forced into combat. Reference: https://www.ea.com/es/games/apex-legends/apex-legends/news/ignite-season-game-updates
- Apex Legends Shockwave patch notes: competitive maps need diverse fights, end-ring locations, enemy intel, and readable tactical pressure. Reference: https://www.ea.com/games/apex-legends/apex-legends/news/shockwave-patch-notes
- Unreal World Partition: large-world combat data should be cell-aware and source-owned so streaming or activation does not detach pressure from place. Reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine
- Unreal Landscape overview: height, weight, and LOD data should support terrain queries and large terrain without every consumer inventing local data. Reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-overview
- GitHub game engines collection: mature game stacks separate world data, rendering, physics, gameplay, networking, and validation concerns. Reference: https://github.com/collections/game-engines

## Domain Implication

- World: the terrain source owns where pressure can happen, where cover exists, and how players route through risk.
- Render: visuals consume cover and pressure ids; they do not create threat identity.
- Combat: ambush, cover, counterplay, receipts, and replay must keep source provenance.
- Validation: proof must fail when pressure is missing, stale, unowned, unreadable, or only visible through renderer state.

## Data Implication

- Minimal config should contain ids, revision, shapes, tags, proof points, and counterplay links.
- Public API should expose read-only pressure and cover queries plus consumer snapshots.
- Internal API may derive sightlines, exposure bands, line segments, route links, and proof samples behind the kit boundary.

## Edge Cases

- Duplicate cover or threat ids across LOD cells.
- Threat lane visible but no reachable counterplay pocket exists.
- Pressure seed activates outside the authored route web.
- Renderer draws a lane without source pressure provenance.
- Combat receipt records threat while source revision has changed.
- Public proof reuses a stale combat screenshot after cover movement.

## Implementation Question

What exact consumer echo proves `sightlineOcclusionTags` is source-owned and not inferred from a primitive, helper, or renderer-only threat lane?
