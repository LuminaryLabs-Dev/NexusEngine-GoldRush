# Remaining Batch Receipt Contract

Status: raw-write gate
Validator: `node tools/validation/validate-remaining-batch-receipts.mjs`
Generator: `node tools/import-sanitize/generate-remaining-batch-receipts.mjs --write`

## Purpose

The first raw-copy gate is locked to the original 31-file plan. Remaining asset batches must not rewrite that gate or add files that make the first receipt set ambiguous. Each remaining batch gets its own receipt folder and an append-only index.

## Current Batch

```txt
batch: goldrush-dual-source-001.next.001.audio-music-and-sfx
domain: audio-music-and-sfx
items: 15
bytes: 90,145,108
mode: raw-files-written
raw files written: true
public promotion: false
runtime promotion: false
```

The second copied batch is now:

```txt
batch: goldrush-dual-source-001.next.002.player-combat-character
domain: player-combat-character
items: 36
bytes: 74,640,633
mode: raw-files-written
raw files written: true
public promotion: false
runtime promotion: false
```

The third copied batch is now:

```txt
batch: goldrush-dual-source-001.next.003.mine-town-terrain-props
domain: mine-town-terrain-props
items: 125
bytes: 189,766,893
mode: raw-files-written
raw files written: true
public promotion: false
runtime promotion: false
```

The fourth copied batch is now:

```txt
batch: goldrush-dual-source-001.next.004.mine-town-terrain-props
domain: mine-town-terrain-props
items: 125
bytes: 37,057,275
mode: raw-files-written
raw files written: true
public promotion: false
runtime promotion: false
```

The final four copied batches are now:

```txt
batch: goldrush-dual-source-001.next.005.mine-town-terrain-props
items: 125
bytes: 7,371,751
extensions: .fbx, .mat
raw files written: true
public promotion: false
runtime promotion: false

batch: goldrush-dual-source-001.next.006.mine-town-terrain-props
items: 125
bytes: 1,052,989
extensions: .mat
raw files written: true
public promotion: false
runtime promotion: false

batch: goldrush-dual-source-001.next.007.mine-town-terrain-props
items: 125
bytes: 1,083,452
extensions: .mat
raw files written: true
public promotion: false
runtime promotion: false

batch: goldrush-dual-source-001.next.008.mine-town-terrain-props
items: 61
bytes: 105,447,269
extensions: .asset, .mat
raw files written: true
public promotion: false
runtime promotion: false
```

## Receipt Layout

```txt
reports/provenance/remaining-batches/
├─ batch-index.json
└─ goldrush-dual-source-001.next.001.audio-music-and-sfx/
   ├─ source.receipt.json
   ├─ raw-copy.receipt.json
   ├─ hashes.receipt.json
   ├─ secret-scan.receipt.json
   ├─ collision-and-overlap.receipt.json
   └─ validator.receipt.json
```

Every receipt must include:

```txt
receiptKind: remaining-batch
importJobId: goldrush-dual-source-001
batchId: goldrush-dual-source-001.next.001.audio-music-and-sfx
doesNotModifyFirst31Gate: true
```

## Acceptance Rules

- The first 31-file cloud asset receipt gate remains unchanged.
- The remaining batch receipt index is append-only.
- The batch id is unique and stable.
- The batch item count, byte count, and extension set match the remaining coverage plan.
- Every source file is fetched by immutable GitHub blob SHA.
- Every target path stays inside `raw/imported/goldrush-dual-source-001/`.
- No target path overlaps the first 31-file raw-copy plan.
- No case-insensitive target collisions exist.
- Secret scan reports 0 findings.
- Receipts contain no runtime paths and no approval claims.
- Written raw files must match the receipt byte counts and SHA-256 hashes.

## Promotion Rules

Passing this gate proves the raw audio files are copied and hash-backed. It does not approve runtime assets. Public/runtime promotion still requires:

```txt
raw copy receipts
sanitized conversion
license provenance
human review
approved runtime asset record
public/assets file hash match
```

Any missing provenance, hash mismatch, secret finding, unsafe path, unclear license, missing human review, or direct raw-to-runtime promotion blocks promotion.

## Current Sanitized Audio Conversion

The first remaining batch now has a batch-scoped sanitized conversion report:

```txt
converter: tools/import-sanitize/convert-remaining-audio-batch.mjs --write
validator: tools/validation/validate-remaining-audio-conversion.mjs
report: reports/conversion/remaining-batches/goldrush-dual-source-001.next.001.audio-music-and-sfx.json
registry: sanitized/registry/remaining-batches/goldrush-dual-source-001.next.001.audio-music-and-sfx.json
out root: sanitized/converted/goldrush-dual-source-001/remaining-batches/goldrush-dual-source-001.next.001.audio-music-and-sfx/
outputs: 15
bytes: 90,145,108
public promotion: false
runtime promotion: false
```

The conversion keeps the first 31-file conversion report unchanged. It copies only the 15 receipt-owned audio files into the sanitized review layer and classifies them as:

```txt
title intro music: 1
title voice: 1
combat music: 4
wandering music: 9
```

These outputs are browser-ready review candidates, not approved game assets. Runtime playback still requires license provenance, human review, approved runtime records, and a later copy into `public/assets/`.

## Current Audio Review and Provenance Gate

The first remaining audio batch now has explicit pending review/provenance packets:

```txt
generator: tools/import-sanitize/create-remaining-audio-review-packets.mjs --write
validator: tools/validation/validate-remaining-audio-review-packets.mjs
human review: reports/human-review/remaining-batches/goldrush-dual-source-001.next.001.audio-music-and-sfx-request.json
license provenance: reports/license-provenance/remaining-batches/goldrush-dual-source-001.next.001.audio-music-and-sfx.json
review items: 15
review domains: 4
pending human review: 15
pending license review: 15
public promotion: false
runtime promotion: false
```

This gate is intentionally conservative. File names may hint at Incompetech, YouTube Audio Library, or Freesound-style sources, but filename inference is not approval. Each track still needs source-page identity, license terms, attribution requirements, an explicit human approval id, approved runtime metadata, and a matching `public/assets/` file hash before gameplay can load it.

## Current Player/Combat Conversion Gate

The second remaining batch now has batch-scoped conversion output:

```txt
converter: tools/import-sanitize/convert-remaining-player-combat-batch.mjs --write
validator: tools/validation/validate-remaining-player-combat-conversion.mjs
report: reports/conversion/remaining-batches/goldrush-dual-source-001.next.002.player-combat-character.json
registry: sanitized/registry/remaining-batches/goldrush-dual-source-001.next.002.player-combat-character.json
out root: sanitized/converted/goldrush-dual-source-001/remaining-batches/goldrush-dual-source-001.next.002.player-combat-character/
outputs: 36
texture review copies: 3
Unity metadata extracts: 24
external conversion requests: 9
public promotion: false
runtime promotion: false
```

This moves the player prefab, camera prefab, revolver sources, Mixamo/player FBX candidates, Unity animation clips, animator controllers, and materials into a reviewable source-backed pipeline. It still does not make the procedural character final; real runtime use requires GLB/animation conversion, license provenance, human review, approved runtime records, and public asset hash validation.

## Current Mine/Town/Terrain Prop Raw Gate

The third remaining batch is copied and receipt-gated only:

```txt
worker: tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.003.mine-town-terrain-props --write --confirm-public-raw-import-risk
receipt generator: tools/import-sanitize/generate-remaining-batch-receipts.mjs --batch goldrush-dual-source-001.next.003.mine-town-terrain-props --write
fetch proof: reports/provenance/goldrush-dual-source-001-next-003-fetch-proof.json
raw write proof: reports/provenance/goldrush-dual-source-001-next-003-raw-write-proof.json
receipt root: reports/provenance/remaining-batches/goldrush-dual-source-001.next.003.mine-town-terrain-props/
items: 125
bytes: 189,766,893
extensions: .jpg, .png
public promotion: false
runtime promotion: false
```

This gives GoldRush source-backed mine, town, train-track, terrain-material, UI-image, mannequin-texture, cactus, fence, cart, and farm texture candidates. It does not make those textures runtime assets. The next required step is a batch-scoped sanitized texture/material review conversion that creates review copies, classifies roles, rejects UI-only or deprecated candidates when needed, and keeps `public/assets/` untouched until approval records exist.

## Current Mine/Town/Terrain Prop Texture Conversion Gate

The third remaining batch now has batch-scoped sanitized texture review output:

```txt
converter: tools/import-sanitize/convert-remaining-mine-town-terrain-props-batch.mjs --write
validator: tools/validation/validate-remaining-mine-town-terrain-props-conversion.mjs
report: reports/conversion/remaining-batches/goldrush-dual-source-001.next.003.mine-town-terrain-props.json
registry: sanitized/registry/remaining-batches/goldrush-dual-source-001.next.003.mine-town-terrain-props.json
out root: sanitized/converted/goldrush-dual-source-001/remaining-batches/goldrush-dual-source-001.next.003.mine-town-terrain-props/
outputs: 125
texture review copies: 125
bytes: 189,766,893
roles: 11
public promotion: false
runtime promotion: false
```

Role split:

```txt
legacy-character-material: 4
legacy-ui-reference: 17
terrain-surface-material: 19
misc-texture: 1
desert-plant-material: 17
train-car-material: 25
desert-rock-material: 24
fence-material: 2
train-track-material: 4
town-structure-material: 3
mine-cart-material: 9
```

Texture intent split:

```txt
color: 57
data: 42
normal: 26
```

The converter records dimensions, color-space hints, and future compression recommendations so later renderer material work can decide which files become terrain, prop, UI, or reject-only assets. It still does not write `public/assets/`, does not approve any slot, and does not let runtime import from `sanitized/`.

## Current Mine/Town/Terrain Prop Model Conversion Gate

The fourth remaining batch now has batch-scoped sanitized model review output:

```txt
converter: tools/import-sanitize/convert-remaining-mine-town-terrain-prop-models-batch.mjs --write
validator: tools/validation/validate-remaining-mine-town-terrain-prop-models-conversion.mjs
report: reports/conversion/remaining-batches/goldrush-dual-source-001.next.004.mine-town-terrain-props.json
registry: sanitized/registry/remaining-batches/goldrush-dual-source-001.next.004.mine-town-terrain-props.json
out root: sanitized/converted/goldrush-dual-source-001/remaining-batches/goldrush-dual-source-001.next.004.mine-town-terrain-props/
outputs: 125
image review copies: 15
prefab metadata extracts: 79
external conversion requests: 31
bytes: 37,057,275
public promotion: false
runtime promotion: false
```

Role split:

```txt
mine-cart-prop: 6
manual-review-prop: 39
train-rail-prop: 12
legacy-character-reference: 7
desert-rock-prop: 23
frontier-town-prop: 17
desert-flora-prop: 21
```

This gate gives the renderer/content pipeline source-backed candidates for mine carts, rails, towns, cactus/flora, rock formations, and utility props. The FBX files are not browser runtime assets yet. They remain external conversion requests until a later tool produces reviewed GLB/glTF outputs, reconciles materials, confirms scale/origin/collider needs, records license provenance, gets human approval, and copies approved bytes to `public/assets/`.

## Current Mine/Town/Terrain Source Metadata Conversion Gate

The final four remaining batches now have a grouped sanitized metadata review output:

```txt
converter: tools/import-sanitize/convert-remaining-mine-town-terrain-source-metadata-batches.mjs --write
validator: tools/validation/validate-remaining-mine-town-terrain-source-metadata-conversion.mjs
report: reports/conversion/remaining-batches/goldrush-dual-source-001.next.005-008.mine-town-terrain-props-source-metadata.json
registry: sanitized/registry/remaining-batches/goldrush-dual-source-001.next.005-008.mine-town-terrain-props-source-metadata.json
out root: sanitized/converted/goldrush-dual-source-001/remaining-batches/goldrush-dual-source-001.next.005-008.mine-town-terrain-props-source-metadata/
outputs: 436
material metadata extracts: 367
terrain asset metadata extracts: 25
external conversion requests: 44
public promotion: false
runtime promotion: false
```

Role split:

```txt
train-material-or-model: 228
loot-material-or-model: 10
fence-material-or-model: 11
frontier-town-material-or-model: 52
desert-rock-material-or-model: 16
manual-review-source: 88
desert-flora-material-or-model: 3
frontier-utility-material-or-model: 3
terrain-source-asset: 25
```

This completes the planned remaining-batch raw copy coverage for the current inventory: 8 remaining batches, 737 copied remaining items, 48 receipt files, 506,565,370 copied remaining bytes, and no public/runtime promotion. The final four batches are still review-only; material metadata must be remapped to browser PBR material records, terrain assets must be interpreted into safe terrain/heightfield data, FBX files must become approved GLB/glTF, and all promoted outputs still require license provenance, human approval, approved runtime records, and `public/assets/` hash validation.

## Current Non-Audio Review and Provenance Gate

The remaining non-audio sanitized review outputs now have grouped pending human-review and license-provenance packets:

```txt
generator: tools/import-sanitize/create-remaining-non-audio-review-packets.mjs --write
validator: tools/validation/validate-remaining-non-audio-review-packets.mjs
human review: reports/human-review/remaining-batches/goldrush-dual-source-001.remaining-non-audio-request.json
license provenance: reports/license-provenance/remaining-batches/goldrush-dual-source-001.remaining-non-audio.json
review items: 722
review domains: 39
pending human review: 722
pending license review: 722
public promotion: false
runtime promotion: false
```

This packet covers player/combat sources, prop texture review copies, prop prefab metadata, prop FBX conversion requests, material metadata, terrain asset metadata, and final source FBX conversion requests. It intentionally does not approve anything. Approval still requires explicit source/license evidence, explicit human review, attribution capture when needed, approved runtime metadata, public asset bytes, and hash validation.

## Current Review Domain Queue

The remaining review packets now have a prioritized domain queue:

```txt
generator: tools/import-sanitize/generate-remaining-review-domain-queue.mjs --write
validator: tools/validation/validate-remaining-review-domain-queue.mjs
queue: reports/review-queues/goldrush-dual-source-001.remaining-review-domain-queue.json
review items: 737
review domains: 43
P0 domains: 26
P1 domains: 17
public promotion: false
runtime promotion: false
```

Owner split:

```txt
world-technical-art: 9
character-combat-art: 14
audio-licensing: 4
environment-model-art: 6
environment-material-art: 10
```

This queue is an operational review order only. It cannot approve assets, create runtime paths, or write `public/assets/`. It turns the flat pending review set into owner-scoped lanes for audio licensing, character/combat art, world technical art, environment model art, and environment material art.
