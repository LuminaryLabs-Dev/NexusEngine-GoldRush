# Object Affordance Interaction Research - 2026-06-30

## Intent

GoldRush procedural objects can stay procedural, but each object needs to behave as a local protokit with a stable interaction affordance. The player-facing interaction path should select the nearest valid object affordance, then hand off to the owning gameplay domain.

## Sources

- Game Accessibility Guidelines full list: https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group visibility of system status: https://www.nngroup.com/articles/visibility-system-status/
- Unity Physics.Raycast scripting API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Physics.Raycast.html

## Domain Breakdown

### n:goldrush:object:*

- Owns each generated visual object as a procedural object protokit.
- Exposes transform, raycast placement, family, visual batch, and interaction metadata.
- Does not directly mine, score, or modify match state.

### n:world:placement-raycast

- Owns downward terrain placement.
- Keeps object y positions tied to the terrain collider/heightfield.
- Provides placement proof for browser and CLI validation.

### n:gameplay:interaction-hold

- Owns nearest-affordance selection.
- Keeps interaction bounded by distance and action filters.
- Produces serializable selection packets for UI/status/proof.

### n:goldrush:gold-carrying

- Owns cargo receipts, carried value, mobility cost, and visible carried-gold data.
- Receives mining results after the affordance dispatch reaches the extraction loop.

## Design Implications

- The first player action should not call hidden mining APIs directly.
- Visible objects with `mine-gold` affordances should target the authored mining site.
- The app state should expose the selected object and last interaction receipt so humans and scripts can understand what happened.
- If an object family becomes too broad or too hard to test, split it by domain role instead of making the selector more complex.

## Validation Implications

- CLI must prove each object is its own protokit.
- CLI must prove object placement uses downward raycast metadata.
- CLI must prove nearest gold affordance resolves to `mine-seam-01`.
- Browser proof must interact through `GoldRushHost.actions.interact()` after placing at a real object affordance.
