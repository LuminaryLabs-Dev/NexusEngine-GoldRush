# Gold Rush Domain Service Kits

## Runtime Source

NexusRealtime is the runtime substrate. ProtoKits and NexusRealtime-Kits are reusable domain sources. Gold Rush owns only game-specific composition, presets, bridges, content, and presentation.

## Initial Custom Kits

- `goldrush-room-orchestrator-kit`: match, lobby, 50-player shards, shared ledger, handoff data.
- `goldrush-scenario-kit`: linear match loop from lobby through results.
- `goldrush-mining-kit`: gold nodes, mining progress, depletion, yields.
- `goldrush-cargo-kit`: carried gold, capacity, drops, transfer, weight penalties.
- `goldrush-cashout-kit`: deposits, scoring, extraction validation.
- `goldrush-combat-state-kit`: combat phase, target locks, damage receipts, camera mode.
- `goldrush-perspective-kit`: exploration camera versus combat camera.
- `goldrush-world-element-kit`: world scale, towns, mountains, paths, gold zones, loading gates, and room patch windows.
- `goldrush-scene-transition-kit`: browser scene state, transitions, audio cues, and animation cues.
- `goldrush-asset-registry-kit`: approved runtime asset manifest and scene descriptors.

## Current Runtime Integration

The browser scaffold now installs Gold Rush custom domain service kits through the NexusRealtime `createRealtimeGame()` composer. Gold Rush APIs are exposed under `engine.n.*`:

- `engine.n.goldrushRooms`
- `engine.n.goldrushScenario`
- `engine.n.goldrushMining`
- `engine.n.goldrushCargo`
- `engine.n.goldrushCashout`
- `engine.n.goldrushCombat`
- `engine.n.goldrushPerspective`
- `engine.n.goldrushWorld`
- `engine.n.goldrushScenes`
- `engine.n.goldrushAssets`

This keeps the renderer as a consumer of snapshots and descriptors rather than the owner of game state.

## Playable Loop

The current playable loop is implemented through the installed kits:

```txt
Mine Gold -> goldrushMining.mine -> goldrushCargo.add
Ambush -> goldrushPerspective.set(combat) -> goldrushCombat.damage
Cash Out -> goldrushCashout.deposit -> goldrushCargo.drop
```

This preserves the old Gold Rush idea that gold is score, risk, health, ammo, and loot, while the modern browser renderer stays presentation-only.

## Renderer Boundary

Three.js renders descriptors. It does not own room state, combat state, mining state, cashout state, or match scoring.

## Procedural Renderer Kits

The current browser surface is no longer a circular arena primitive. GoldRush owns local renderer kits under `src/renderer/proceduralKits.js`:

- `goldrush.procTerrain.patchTessellation`: broad terrain field with 300+ small tessellated patches.
- `goldrush.procTerrain.routeRibbon`: exploration and combat path cues across the field.
- `goldrush.procTerrain.goldNodeScatter`: distributed gold-node placeholders.
- `goldrush.procTerrain.shardPlayerMarkers`: two 50-player shard marker lanes.
- `goldrush.procScene.lightingCamera`: exploration and combat camera presets.
- `goldrush.procWorld.elements`: procedural towns, mountains, landmarks, paths, gold zones, and loading gates.

Each kit is validated separately by `tools/validation/validate-procedural-renderer-kits.mjs` before the renderer composes them.

World descriptors are separately validated by `tools/validation/validate-world-elements.mjs`.
