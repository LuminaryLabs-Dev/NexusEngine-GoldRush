# Legacy Unity Port Packet

## Simulation Summary

A legacy-port reviewer will judge the rebuild by whether Unity evidence is converted into browser-safe descriptors without pretending raw files are already approved.

## Expected Outcome

- Unity scenes, prefabs, scripts, controllers, audio, and terrain evidence are documented.
- Gold Rush local descriptors map to the legacy concepts:
  - terrain layers and horizon blockers.
  - towns and settlement prefabs.
  - gold piles and spawn areas.
  - lobby/loading/matchmaking scenes.
  - music states and animation parameters.
  - camera combat/exploration behavior.
- Raw files remain blocked until cloud-side scan and provenance.

## Assumptions

- GPT-it/cloud evidence is useful but not final provenance.
- Exact legacy fidelity comes after sanitized asset import.
- C# scripts are design references, not browser runtime code.

## Failure Signs

- Runtime imports raw Unity paths.
- Docs imply assets are copied when only evidence exists.
- Browser gameplay diverges from old Gold Rush pillars: gold, towns, extraction, combat, camera shifts.
- Photon/Fusion/DOTween/Odin patterns leak into runtime instead of being rebuilt.

## Evidence Needed

- `docs/legacy-unity-element-inventory.md` remains current.
- Runtime validators reject raw/imported, Unity project paths, and plugin folders.
- Asset registry keeps placeholders until promotion.

## Recommended Next Action

Turn inventory domains into stable GoldRush-local kit APIs while waiting for private cloud asset import.
