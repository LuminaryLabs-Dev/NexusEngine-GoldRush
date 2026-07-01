# Free Toon Candidate Import

Status: source candidates only

## Goal

Move GoldRush toward a high-fidelity toon-shaded wild-west look without dumping untracked assets into runtime.

## Imported

- `Kenney Platformer Kit` as CC0 GLB candidate models.
- `Kenney Impact Sounds` as CC0 OGG candidate one-shots.
- Manifest: `manifests/asset-candidates/free-toon-candidates.json`
- Validator: `tools/validation/validate-free-toon-candidates.mjs`

## Design Perspective

- The current procedural look should become a toon-shaded western diorama: clear silhouettes, flat-ramp material bands, readable prop clusters, and object-specific interaction affordances.
- Gold should be exaggerated and readable from the over-the-shoulder camera.
- Frontier dressing should be grounded through raycasts, not hand-placed above or under the terrain.
- Audio should be short, tactile one-shots tied to semantic cue state: footstep, mine hit, wood impact, metal impact, train bell, and claim interaction.

## Candidate Domains

```txt
free toon candidates
├─ props
│  ├─ barrel
│  ├─ crate
│  ├─ chest
│  └─ sign
├─ world dressing
│  ├─ rocks
│  ├─ stones
│  ├─ grass
│  ├─ plant
│  └─ tree-pine
├─ claim structure
│  ├─ fence-rope
│  ├─ fence-straight
│  ├─ flag
│  └─ platform
├─ character preview
│  └─ character-oobi
├─ cargo/resource
│  └─ coin-gold
└─ audio cues
   ├─ footstep dirt/grass
   ├─ footstep wood
   ├─ train bell
   ├─ mine hit
   ├─ metal impact
   └─ wood impact
```

## Runtime Boundary

- These are not approved runtime assets.
- No `public/assets` paths were added.
- Every item has `runtimePromotion: false`, `publicPromotion: false`, and `approvedRuntimePath: null`.
- The next step is a promotion pass that turns selected candidates into approved runtime assets or object/audio protokits.

## Deferred Sources

- Quaternius stylized nature, train, and character/animation packs are strong toon-shaded game-design fits, but they need a separate direct-download or package-review pass.
- Harvey Carman's wild-west music is a strong soundtrack fit, but the pack is large and needs attribution/license handling before any runtime import.
