# Player View Packet

## Simulation Summary

A player should read Gold Rush as a large western extraction world with towns, routes, gold risk, and combat pressure, not as a tech demo or flat board.

## Expected Outcome

- First screen loads directly into playable controls and a visible terrain world.
- The world looks broad, patched, and traversable.
- Towns, mountains, paths, and gold zones give the scene readable destinations.
- Mine, Ambush, and Cash Out visibly change HUD state and phase state.
- Combat changes the feel through camera, audio, and animation descriptors.

## Assumptions

- Placeholder geometry is acceptable while raw legacy assets are blocked.
- Player-facing clarity matters more than exact asset fidelity in this phase.
- A screenshot is stronger evidence than object counts.

## Failure Signs

- The world reads as a circular arena, empty plane, or abstract diagram.
- HUD shows technical state but the scene gives no reason to move.
- Towns/gold zones exist in data but are not visible or understandable.
- Combat state changes only counters, not perspective/readability.

## Evidence Needed

- Browser screenshot showing massive terrain, landmarks, towns, routes, and readable HUD.
- Interaction proof: Mine -> Ambush -> Cash Out.
- HUD proof for players, shards, scene, camera, audio, anim, world size, towns, patch windows, and gold nodes.

## Recommended Next Action

Make town/path/gold-zone descriptors more explicit in `engine.n.*` APIs and surface them in HUD/player proof so visible play goals are easier to understand.
