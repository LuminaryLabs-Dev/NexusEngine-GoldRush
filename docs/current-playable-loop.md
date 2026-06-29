# Current Playable Loop

## Purpose

The current browser build proves a local Gold Rush extraction slice without legacy assets:

```txt
Title
-> Lobby
-> Loading-yard train
-> Gold field
-> Walk to a gold seam
-> Hold E to mine
-> Carry gold
-> Walk to extraction
-> Hold E to cash out
-> Extraction receipt and score
```

## Proof Contract

The loop must keep these facts true:

- `72` simulated players generate a ready network with `2` internal partitions.
- NexusRealtime installs the Gold Rush Domain Service Kits under `engine.n.*`.
- `engine.n.goldrushExtractionLoop` exposes the playable local loop state.
- Holding `E` near `mine-seam-01` advances mining progress and adds carried gold.
- Holding `E` near `rail-depot-extract-01` advances extraction progress and creates an accepted receipt.
- The receipt includes `runId`, `cargoValue`, `durationTicks`, `nextSceneId`, and `roomHandoffId`.
- Scoring applies the accepted extraction receipt once.
- Extraction completion is idempotent and cannot complete outside the extraction volume.
- `engine.n.goldrushCamera` exposes a 1,000-pose camera perspective catalog so playability can be checked across many player-view situations, not only the current rendered pose.

The authoritative local check is:

```bash
npm run check
```

The focused loop check is:

```bash
node tools/validation/validate-goldrush-extraction-loop.mjs
```

The latest browser proof is:

```txt
reports/goldrush-extraction-loop-01.json
reports/goldrush-extraction-loop-01.md
screenshots/goldrush-extraction-loop-01.png
```

The human-view proof is the public page:

```txt
https://luminarylabs-dev.github.io/NexusEngine-GoldRush/
```

The public smoke proof is:

```bash
npm run proof:public -- --url https://luminarylabs-dev.github.io/NexusEngine-GoldRush/
```

Latest passing public proof:

```txt
reports/public-smoke/public-smoke-2026-06-29T18-53-53-588Z.json
reports/public-smoke/public-smoke-2026-06-29T18-53-53-588Z.md
screenshots/public-smoke/01-title-2026-06-29T18-53-53-588Z.png
screenshots/public-smoke/02-lobby-2026-06-29T18-53-53-588Z.png
screenshots/public-smoke/03-loading-yard-2026-06-29T18-53-53-588Z.png
screenshots/public-smoke/04-gold-field-2026-06-29T18-53-53-588Z.png
```

## Legacy Mapping

- Modern Gold Rush assets will fill visual/world slots.
- Old Gold Rush gameplay informs gold-as-score, gold-as-risk, combat perspective, and cashout.
- NexusRealtime owns domain state through `engine.n.goldrush*` APIs.
- Three.js consumes snapshots and renders descriptors only.
- The camera catalog lives in domain state; the renderer only consumes the selected `threeDescriptor`.
- The extraction-loop kit owns mining/cashout gameplay state; renderer markers are presentation only.
