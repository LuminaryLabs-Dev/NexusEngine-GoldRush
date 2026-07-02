# 012 - Restart Packet Linkage Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist for missing runtime boundaries without building a new engine.
- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR shape and large maps require stable source identity across local and public proof.
- PUBG official site: https://pubg.com/en/
  - GoldRush use: Large BR loops depend on land, loot, survive, map identity, and repeatable match state.

## Translation

- Data contract: restart packet fields and lesson-update trigger.
- Proof contract: source revision changes require restart packet fields before row status changes.
- Risk constrained: new terrain knowledge is lost between planning and implementation passes.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.
