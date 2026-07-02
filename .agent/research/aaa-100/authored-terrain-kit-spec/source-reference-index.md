# Authored Terrain Source Reference Index

Status: active docs-only

## Purpose

Track the external references that shape the authored terrain kit spec without letting outside references redefine the GoldRush product.

## Sources

- GitHub Game Engines collection: https://github.com/collections/game-engines -- Use as a missing-surface checklist for terrain, rendering, physics, resource management, tools, validation, and deployment. Do not broaden GoldRush into a general engine.
- three.js LOD docs: https://threejs.org/docs/#api/en/objects/LOD -- Use to frame view-distance-based representation changes, while keeping gameplay data independent from visual LOD swaps.
- three.js BufferGeometry docs: https://threejs.org/docs/#api/en/core/BufferGeometry -- Use to frame terrain mesh output as indexed buffer data with explicit attributes and groups.
- Rapier JavaScript colliders docs: https://rapier.rs/docs/user_guides/javascript/colliders/ -- Use to compare future backend options for heightfields and collider shape tradeoffs.
- cannon-es Heightfield docs: https://pmndrs.github.io/cannon-es/docs/classes/Heightfield.html -- Use as current-heightfield backend reference: height data, element size, getHeightAt, and update behavior.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Use as the presentation and scale benchmark for 60-player battle royale, massive maps, and squad identity.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Use as pacing reference for zone pressure shaping movement, risk, combat timing, and survivor flow.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Use as extraction reference for bounty value, sound, atmosphere, loss pressure, and risk-to-extract decisions.

## Interpretation Rules

- Use engine references to identify missing surfaces, not to build a general engine.
- Use three.js references for browser render contract shape, not as gameplay authority.
- Use physics references to keep collider source data explicit and backend-swappable.
- Use battle royale references for scale, pacing, and convergence pressure.
- Use extraction references for risk, value, audio, atmosphere, and leave-or-greed decisions.
