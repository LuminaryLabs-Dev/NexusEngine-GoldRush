# Free Toon Asset Sourcing

Status: active

## Intention

GoldRush should move toward a high-fidelity toon-shaded wild-west style. Free assets are allowed when they are license-clear, source-reviewed, and represented as local protokit candidates instead of untracked runtime dependencies.

## Imported Candidate Set

- Kenney Platformer Kit: GLB props, character preview seed, rocks, plants, fences, platform, chest, coin, sign.
- Kenney Impact Sounds: OGG one-shots for footsteps, mining, wood, metal, and bell feedback.
- Local candidate root: `external/free-toon-candidates/goldrush-free-toon-001/`
- Manifest: `manifests/asset-candidates/free-toon-candidates.json`
- Validator: `tools/validation/validate-free-toon-candidates.mjs`

## Domain Ownership

```txt
n:goldrush:free-toon-candidate-protokit
├─ model candidates
│  ├─ target n:render:micro-object-instancing
│  ├─ target n:world:placement-raycast
│  ├─ target n:physics:collider
│  ├─ target n:render:character-preview
│  └─ target n:gameplay:cargo
└─ audio candidates
   └─ target n:audio:cue-state
```

## Game Design Read

- Toon shading should be an explicit material policy: flat ramp lighting, readable silhouettes, outline-capable geometry, and role-based accent colors.
- The world should not look like generic platform props dropped into a desert. These candidates need western clustering rules: claim boundaries, depot storage, gold cargo, mine set dressing, and path-side wayfinding.
- Audio should be tied to actions, not ambience beds: footstep cadence, pickaxe hits, wood/metal impacts, and train/bell one-shots.
- The current procedural fallback remains valid, but imported candidates should replace forms only after placement, scale, collider, and visual readability are validated.

## Gaps

- No approved runtime promotion yet.
- No toon material loader yet.
- No candidate GLB preview proof yet.
- No Quaternius train/character/animation import yet.
- No Harvey Carman western music import yet.

## Validator Implication

The free-toon validator proves license metadata, local files, hashes, no runtime/public promotion, and per-item protokit metadata. Future work should add a browser proof that previews selected candidates with toon material overrides before any runtime promotion.
