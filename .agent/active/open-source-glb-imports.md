# Open Source GLB Imports

Status: active

## Goal

Import only license-clear direct GLB assets into `NexusEngine-GoldRush`, then load them through a local runtime kit without depending on external installers.

## Current Pass

- Imported Poly Pizza / Quaternius `Rocks` as the first faceted-rock GLB seed.
- Imported Poly Pizza / Quaternius `Cactus` as the first plant GLB seed.
- Documented Quaternius character and animation packs as deferred because direct package URLs were not captured in this pass.

## Validation

- `tools/validation/validate-open-source-glbs.mjs` checks manifest provenance and local GLB files.
- Runtime loading must treat GLBs as additive. Procedural local geometry remains the fallback.
