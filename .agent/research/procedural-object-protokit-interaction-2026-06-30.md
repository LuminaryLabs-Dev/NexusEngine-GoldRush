# Procedural Object ProtoKit Interaction

Status: active
Date: 2026-06-30

## Intention

Procedural assets are acceptable for Gold Rush, but they must not be anonymous renderer decorations. Each generated object should behave like a small GoldRush-local protokit with a domain scope, generation layers, placement proof, visual batch metadata, and optional interaction affordance.

## Domain Breakdown

```txt
n:world:placement-raycast
└─ owns downward terrain raycast and fallback placement facts

n:render:micro-object-instancing
└─ batches many protokit snapshots into efficient Three.js meshes

n:gameplay:interaction-hold
└─ consumes object affordances such as mine-gold, take-cover, inspect-mine, inspect-town

n:control:third-person-camera
└─ remains decoupled from object generation and follows player mouse-look only
```

## Implementation Notes

- `src/content/goldrushObjectMicroKits.js` now creates one `goldrush-procedural-object-protokit` contract per generated `goldrush.micro.*` item.
- Each item uses the same generation layers: `seed`, `environment-space`, `raycast-placement`, `visual-batch`, `interaction-affordance`.
- Placement attempts `n:world:placement-raycast` first, then records a deterministic terrain-height fallback if the raycast misses a far-band object.
- Gold, mine, cover, and town object families expose interaction affordances while passive terrain dressing stays non-interactive.
- `src/renderer/proceduralKits.js` keeps renderer ownership limited to instancing, markers, and snapshot proof.
- The camera snapshot now exposes `goldrush-linear-camera-controller-v1` so object generation cannot become a second camera authority.

## Current Proof

```txt
node tools/validation/validate-procedural-renderer-kits.mjs
node tools/validation/validate-terrain-collider.mjs
node tools/validation/validate-nexus-runtime.mjs
node tools/validation/validate-live-playtest.mjs
npm run sanitize
npm run validate
npm run build
npm run proof:cargo-visual
```

Latest browser proof:

```txt
output/playwright/cargo-visual-proof/cargo-visual-2026-06-30T21-29-12-757Z.json
output/playwright/cargo-visual-proof/cargo-visual-2026-06-30T21-29-12-757Z.png
```

## Remaining Gaps

- Interaction markers are readable but still prototype-simple.
- Procedural mesh silhouettes need higher-fidelity family geometry before they feel like authored assets.
- The live interaction prompt still needs a player-facing nearest-affordance selector instead of only visual marker proof.
- Approved runtime assets remain blocked behind human/license review and promotion gates.
