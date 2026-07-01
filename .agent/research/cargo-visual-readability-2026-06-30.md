# Cargo Visual Readability

Status: active
Date: 2026-06-30

## Question

How should GoldRush make mining and carrying gold readable enough for a high-fidelity extraction loop?

## Findings

- Carrying gold is a high-consequence state. The player should not have to infer it only from HUD text, debug values, or result receipts.
- Immediate visible feedback after mining supports trust: the player can see that the action completed, understand the current risk, and decide whether to extract or keep prospecting.
- Distinct object/event cues matter in games. Mined cargo should have a different silhouette from empty gear, and later should pair with distinct pickup, heavy-carry, and cashout audio.
- The first useful slice is a kit-owned visual contract, not a one-off mesh. `n:goldrush:gold-carrying` owns the cargo state and `n:goldrush:three-scene-renderer` owns the Three.js proof that visible carried gold is rendered.

## Kit Gap

```txt
n:gameplay:cargo
└─ needs reusable cargo-visual contract shape for carried objects

n:goldrush:gold-carrying
└─ now exposes goldrush-cargo-visual-v1 after mining

n:goldrush:three-scene-renderer
└─ now snapshots playerRig.cargoVisual for browser proof
```

## Validator Implication

- `tools/validation/validate-goldrush-extraction-loop.mjs` proves mining creates a visible cargo visual contract.
- `tools/validation/validate-procedural-renderer-kits.mjs` proves the renderer exposes player-rig cargo proof state.
- `tools/proof/cargo-visual-proof.mjs` proves a browser run can mine gold and render visible carried nuggets on the prospector rig.

## Remaining AAA Gap

- The current carried gold is still procedural geometry, not a promoted legacy GLB or authored AAA asset.
- The mining node itself still needs physical colliders, real interaction animation, pickup SFX, weight-in-motion feedback, and cashout handoff polish.
- The cargo contract should later graduate into a generic carried-object/cargo readability kit if another NexusRealtime game needs the same pattern without GoldRush-specific gold rules.

## Sources

- Game Accessibility Guidelines, distinct key-object and event cues: https://gameaccessibilityguidelines.com/ensure-sound-music-choices-for-each-key-objects-events-are-distinct-from-each-other/
- Nielsen Norman Group, visibility of system status: https://www.nngroup.com/articles/visibility-system-status/
