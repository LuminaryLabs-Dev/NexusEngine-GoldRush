# Gold Rush Domain Service Kits

## Runtime Source

NexusRealtime is the runtime substrate. ProtoKits and NexusRealtime-Kits are reusable domain sources. Gold Rush owns only game-specific composition, presets, bridges, content, and presentation.

## Initial Custom Kits

- `goldrush-room-orchestrator-kit`: match, lobby, 50-player shards, shared ledger, handoff data.
- `goldrush-legacy-source-kit`: cloud-side legacy source intake contract and browser-safe asset readiness.
- `goldrush-terrain-patch-window-kit`: terrain scale, patch grid, active room windows, and point-to-patch mapping.
- `goldrush-town-layout-kit`: town anchors, street graphs, building descriptors, and settlement transition hooks.
- `goldrush-path-network-kit`: roads, rail, cashout routes, choke-point paths, and town/gold-zone links.
- `goldrush-gold-zone-kit`: multiplayer gold zones, spawn cadence, pickup values, and route links.
- `goldrush-loading-gate-kit`: loading and room-handoff gates that connect room windows, paths, and scene transitions.
- `goldrush-scenario-kit`: linear match loop from lobby through results.
- `goldrush-mining-kit`: gold nodes, mining progress, depletion, yields.
- `goldrush-cargo-kit`: carried gold, capacity, drops, transfer, weight penalties.
- `goldrush-cashout-kit`: deposits, scoring, extraction validation.
- `goldrush-combat-state-kit`: combat phase, target locks, damage receipts, camera mode.
- `goldrush-camera-descriptor-kit`: rich exploration/combat/loading/cashout camera descriptors from legacy camera evidence.
- `goldrush-perspective-kit`: exploration camera versus combat camera.
- `goldrush-world-element-kit`: world scale, towns, mountains, paths, gold zones, loading gates, and room patch windows.
- `goldrush-scene-transition-kit`: browser scene state, transitions, audio cues, and animation cues.
- `goldrush-audio-state-kit`: music state and one-shot cue descriptors.
- `goldrush-animation-state-kit`: player pose and legacy animation parameter descriptors.
- `goldrush-match-lifecycle-kit`: match status, phase order, lifecycle clock, and end conditions.
- `goldrush-final-rush-kit`: final rush warning, collapse pressure, pressure zones, and lockout state.
- `goldrush-extraction-receipt-kit`: accepted/rejected/duplicate extraction receipts and totals.
- `goldrush-room-handoff-receipt-kit`: room gate handoff receipts across shard windows and loading transitions.
- `goldrush-scoring-kit`: player/team score rules, receipt application, penalties, bonuses, and placement.
- `goldrush-match-results-kit`: winner, placements, awards, final reason, and final result state.
- `goldrush-replay-summary-kit`: deterministic compact match summary from receipt and result ledgers.
- `goldrush-asset-registry-kit`: approved runtime asset manifest and scene descriptors.

## Current Runtime Integration

The browser scaffold now installs Gold Rush custom domain service kits through the NexusRealtime `createRealtimeGame()` composer. Gold Rush APIs are exposed under `engine.n.*`:

- `engine.n.goldrushRooms`
- `engine.n.goldrushScenario`
- `engine.n.goldrushLegacySources`
- `engine.n.goldrushTerrain`
- `engine.n.goldrushTowns`
- `engine.n.goldrushPaths`
- `engine.n.goldrushGoldZones`
- `engine.n.goldrushLoadingGates`
- `engine.n.goldrushMining`
- `engine.n.goldrushCargo`
- `engine.n.goldrushCashout`
- `engine.n.goldrushCombat`
- `engine.n.goldrushCamera`
- `engine.n.goldrushPerspective`
- `engine.n.goldrushWorld`
- `engine.n.goldrushScenes`
- `engine.n.goldrushAudio`
- `engine.n.goldrushAnimation`
- `engine.n.goldrushMatch`
- `engine.n.goldrushFinalRush`
- `engine.n.goldrushExtractionReceipts`
- `engine.n.goldrushRoomHandoffReceipts`
- `engine.n.goldrushScoring`
- `engine.n.goldrushResults`
- `engine.n.goldrushReplaySummary`
- `engine.n.goldrushAssets`

This keeps the renderer as a consumer of snapshots and descriptors rather than the owner of game state.

For browser inspection, the app exposes:

```txt
window.GoldRushHost.getState()
```

This returns scenario, legacy source intake/readiness, world, terrain, towns, paths, gold zones, loading gates, audio, animation, camera, match, final rush, extraction receipt, handoff receipt, scoring, result, and replay summary descriptors.

## Playable Loop

The current playable loop is implemented through the installed kits:

```txt
Mine Gold -> goldrushMining.mine -> goldrushCargo.add
Ambush -> goldrushPerspective.set(combat) -> goldrushCombat.damage
Final Rush -> goldrushFinalRush.arm -> goldrushFinalRush.tick
Handoff Gate -> goldrushRoomHandoffReceipts.recordHandoff
Cash Out -> goldrushCashout.deposit -> goldrushExtractionReceipts.recordExtraction -> goldrushScoring.applyExtractionReceipt
End Match -> goldrushResults.finalize -> goldrushReplaySummary.capture
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
