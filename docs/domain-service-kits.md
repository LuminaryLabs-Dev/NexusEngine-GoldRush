# Gold Rush Domain Service Kits

## Runtime Source

NexusRealtime is the runtime substrate. ProtoKits and NexusRealtime-Kits are reusable domain sources. Gold Rush owns only game-specific composition, presets, bridges, content, and presentation.

## Initial Custom Kits

- `goldrush-room-orchestrator-kit`: match, lobby, 50-player shards, shared ledger, handoff data.
- `goldrush-mining-kit`: gold nodes, mining progress, depletion, yields.
- `goldrush-cargo-kit`: carried gold, capacity, drops, transfer, weight penalties.
- `goldrush-cashout-kit`: deposits, scoring, extraction validation.
- `goldrush-combat-state-kit`: combat phase, target locks, damage receipts, camera mode.
- `goldrush-perspective-kit`: exploration camera versus combat camera.
- `goldrush-asset-registry-kit`: approved runtime asset manifest and scene descriptors.

## Renderer Boundary

Three.js renders descriptors. It does not own room state, combat state, mining state, cashout state, or match scoring.
