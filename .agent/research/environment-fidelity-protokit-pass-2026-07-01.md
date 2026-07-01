# Environment Fidelity Protokit Pass

Status: active

## Domain

- `n:render:micro-object-instancing`
- `n:goldrush:object:*`
- `n:goldrush:train-loading`

## Source Notes

- Unity Terrain settings separate pixel error, basemap/detail distance, tree distance, billboard start, shadow casting, and material behavior. For GoldRush this supports treating visual fidelity as a layered rendering contract rather than one giant mesh or one global material.
  - Source: https://docs.unity3d.com/Manual/terrain-OtherSettings.html
- Unreal's world-partition/open-world documentation frames large worlds as spatially partitioned content that can be loaded and authored in layers. For GoldRush this supports keeping terrain, object protokits, loading-yard set dressing, and runtime gameplay as separately owned domains.
  - Source: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine

## Gap From Latest Live Audit

- Local and public runtime state matched.
- Camera, terrain grounding, and physics were stable.
- The player-facing scene still read as blockout because:
  - loading yard was mostly a single flat plane with rails and crates,
  - gold-field procedural objects lacked explicit material variation metadata,
  - the proof had no domain snapshot for object visual fidelity,
  - scene polish was not yet tied to a kit contract.

## Design Decision

Do not create a separate polish system. Add fidelity metadata to the existing object protokits and make the existing render kits consume it.

## Applied Slice

- Add `goldrush-object-visual-fidelity-v1` to each generated object protokit.
- Add per-object tint/material-breakup/shape-language/player-read metadata.
- Add `visualFidelity` to the procedural renderer snapshot.
- Add `goldrush-loading-yard-fidelity-v1` set dressing to the loading-yard renderer.
- Keep videos under ignored `output/`; keep durable screenshots/reports under tracked proof folders.

## Validation Expectations

- Object protokit validation must prove every object has fidelity metadata and raycast-locked ground contact.
- Procedural renderer validation must prove tint variation exists.
- Scene-site validation must prove the loading-yard fidelity contract, ballast, platform staging, and distant mesas exist.
- Human-view proof should show local/public parity and identify remaining visual debt separately from runtime stability.
