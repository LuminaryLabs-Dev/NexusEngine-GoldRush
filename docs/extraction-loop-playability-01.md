# Extraction Loop Playability 01

## Purpose

This pass turns the gold-field runtime into a local playable slice:

```txt
spawn
-> walk over shoulder
-> hold E near a gold seam
-> carry gold
-> walk to extraction
-> hold E to cash out
-> receive extraction receipt and score
```

## Runtime Ownership

- `engine.n.goldrushExtractionLoop` owns local run phase, player cargo view, mining progress, combat pressure, extraction progress, and the final loop receipt.
- Existing kits still own their domains:
  - `engine.n.goldrushCargo` owns carried gold.
  - `engine.n.goldrushCashout` owns deposits.
  - `engine.n.goldrushExtractionReceipts` owns accepted/duplicate receipt records.
  - `engine.n.goldrushScoring` owns score application.
  - `engine.n.goldrushReplaySummary` receives loop events.
- Three.js only renders `extractionLoop.worldSpaceMarkers`; it does not decide mining, payout, cashout, or receipt validity.

## Controls

- `WASD`: move relative to camera yaw.
- `E`: hold to mine when near a seam, or hold to cash out when near extraction.
- Right mouse: closer aim/combat posture.
- Left mouse: fire at active local threat pressure.

## Validation

```bash
node tools/validation/validate-goldrush-extraction-loop.mjs
npm run check
```

The validator proves:

- the extraction-loop API exists under `engine.n`.
- mining sites, extraction sites, threat spawns, and world-space markers exist.
- mining cannot pay out unless the player is in range and the hold timer completes.
- extraction cannot complete outside the extraction volume.
- extraction creates an idempotent receipt with `runId`, `cargoValue`, `durationTicks`, `nextSceneId`, and `roomHandoffId`.
- scoring receives the accepted extraction receipt.

## Browser Proof

- Report: `reports/goldrush-extraction-loop-01.json`
- Summary: `reports/goldrush-extraction-loop-01.md`
- Screenshot: `screenshots/goldrush-extraction-loop-01.png`

The browser proof used the local dev server and installed Chrome. It walked through title, lobby, loading-yard train handoff, gold field, mine interaction, extraction interaction, and receipt creation.

## Still Prototype Or Blocked

- Character rig and authored animation clips remain prototype.
- Combat effects and local threat behavior remain prototype.
- Mining/cashout visuals are procedural markers, not legacy-authored props.
- Legacy Unity models, textures, prefabs, audio, SFX, and authored animation clips remain blocked on cloud-side import and approval.
- The visual terrain still needs a separate human-view pass for remaining blue/debug-looking gaps.
