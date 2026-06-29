# Gold Rush Asset Intake Classifier

## Purpose

The classifier is the destination-repo tool that runs after GPT/cloud copies approved legacy Gold Rush candidates into the import staging folder. It does not copy old repos locally and it does not promote assets.

## Inputs

```txt
raw/imported/<importJobId>/
```

The folder must be created by a private/cloud worker only after source-side deny-path and secret scans.

## Command

```bash
node tools/import-sanitize/classify-goldrush-import.mjs --job goldrush-dual-source-001
```

Current empty-repo behavior:

```txt
status: waiting-for-raw-import
files: 0
candidates: 0
blocked: 0
```

## What It Classifies

| Source shape | Output |
| --- | --- |
| Unity scenes | scene-reference slot, layout extraction required |
| FBX/GLB/GTLF props | asset slot, GLB conversion if needed |
| WAV/MP3/OGG cues | audio slot, browser-audio conversion if needed |
| Unity animation/controller files | animation slot, retargeting required |
| Package manifests, settings, generated folders, Photon/Fusion, plugin folders | blocked |
| Secret-like text findings | blocked without printing secret values |
| Unknown extensions or unmapped files | unmapped, not promoted |

## Slot Mapping Examples

```txt
Cactus_01.fbx             -> goldrush.prop.cactus01
Fence_01.fbx              -> goldrush.prop.fence01
Coin_01.fbx               -> goldrush.currency.coin01
Revolver.prefab           -> goldrush.weapon.revolver
Arena.unity               -> goldrush.scene.arena
Game_SinglePlayer.unity   -> goldrush.scene.legacySinglePlayer
Wandering Theme.wav       -> goldrush.audio.music.wandering
Revolver Shot.wav         -> goldrush.audio.sfx.revolverShot
```

## Promotion Rule

Every candidate carries:

```txt
deny-path-scan
secret-scan
conversion-report
license-provenance
human-review
```

No candidate can be treated as approved runtime content until those gates are satisfied and `sanitized/registry/assets.json` has provenance, hashes, approval id, and runtime path.

## Validation

```bash
node tools/validation/validate-asset-intake-classifier.mjs
npm run check
```

The validation fixture proves:

- safe legacy candidates map to Gold Rush slots.
- package manifests and Photon/Fusion config are blocked.
- secret-like config is blocked without printing values.
- unknown docs remain unmapped.
- empty staging reports `waiting-for-raw-import`.
