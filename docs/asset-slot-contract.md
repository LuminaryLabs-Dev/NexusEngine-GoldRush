# Asset Slot Contract

## Purpose

Asset slots let the playable NexusRealtime game target legacy Gold Rush content before raw assets are copied or sanitized.

## Rules

- Slots are stable IDs, not file paths.
- Slots do not reference `raw/`, `quarantine/`, or source repositories.
- Placeholders are procedural descriptors only.
- Sanitized assets may replace placeholders only after provenance and approval gates pass.
- Approved runtime assets are declared in `src/content/goldrushApprovedAssets.js`.
- Runtime paths use browser-relative `assets/...` values only; `public/`, `raw/`, `sanitized/`, `quarantine/`, absolute paths, URLs, query strings, and traversal are invalid.
- The browser registry overlays approved records onto placeholders, so unknown or partially approved records cannot silently become playable.

## Initial Slots

```txt
goldrush.player.prospector
goldrush.weapon.revolver
goldrush.vehicle.train
goldrush.vehicle.trainCar
goldrush.prop.goldPile
goldrush.prop.cactus01
goldrush.prop.cactus02
goldrush.prop.fence01
goldrush.currency.coin01
goldrush.scene.arenaLayout
```

## Promotion Mapping

Future cloud asset promotion should map each approved asset to:

```json
{
  "id": "goldrush.prop.goldPile",
  "status": "approved",
  "runtimePath": "assets/models/gold-pile.glb",
  "sourceJobId": "goldrush-dual-source-001",
  "sourcePath": "GoldRush/Assets/...",
  "sourceHash": "<sha256>",
  "outputHash": "<sha256>",
  "provenance": "approved",
  "approvalId": "<review-id>"
}
```

Local validation:

```txt
node tools/validation/validate-approved-asset-registry.mjs
```
