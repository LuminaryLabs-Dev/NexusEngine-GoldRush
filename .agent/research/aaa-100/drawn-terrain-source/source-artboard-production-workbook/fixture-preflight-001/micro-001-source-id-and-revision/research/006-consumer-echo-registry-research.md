# 006 - Consumer Echo Registry Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR shape and large maps require stable source identity across local and public proof.
- PUBG official site: https://pubg.com/en/
  - GoldRush use: Large BR loops depend on land, loot, survive, map identity, and repeatable match state.
- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Height, scale, and component decisions need explicit source contracts before consumers derive terrain.

## Translation

- Data contract: expected consumer ids and echo fields.
- Proof contract: render, collider, movement, placement, gameplay, proof list fixtureId and revisionId.
- Risk constrained: one consumer can silently stay on old terrain math.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.
