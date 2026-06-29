# Cloud Raw Copy Worker Packet

Status: active next cloud action
Import job: `goldrush-dual-source-001`
Source commit: `144230e32b537336c83407b4ddae83cdc95c1c9e`
Plan: `reports/provenance/goldrush-dual-source-001-raw-copy-plan.json`

## Intention

Copy the 31 selected legacy Gold Rush files from the proven source commit into `NexusEngine-GoldRush` as raw candidates only, then produce the six receipt files required by `tools/validation/validate-cloud-asset-receipts.mjs`. Do not promote anything into runtime, do not write to `public/assets/`, and do not process the eight deferred slots.

## Domains

```txt
audio-music-and-sfx
├─ copy wandering music
├─ copy combat music
└─ copy revolver shot SFX

legacy-scene-layout-metadata
├─ copy classic main menu scene
├─ copy modern lobby scene
├─ copy modern arena scene
├─ copy modern player test scene
├─ copy classic game scene
└─ copy classic single-player scene

player-combat-character
├─ copy classic player prefab
├─ copy modern humanoid FBX and textures
├─ copy revolver prefab, FBX, and textures
└─ copy idle, run, and shooting animation candidates

mine-town-terrain-props
├─ copy train and train-track candidates
├─ copy train-car prefabs
├─ copy gold pile and spawn area prefabs
├─ copy coin and cactus models
└─ copy fence prefab and model
```

## Required Receipts

```txt
reports/provenance/goldrush-dual-source-001-source-discovery.json
quarantine/reports/goldrush-dual-source-001-deny-path-scan.json
reports/secret-scans/goldrush-dual-source-001.json
reports/provenance/goldrush-dual-source-001-copy-ledger.json
reports/provenance/goldrush-dual-source-001-hashes.json
reports/asset-classification/goldrush-dual-source-001-classification.json
```

## Copy Rules

```txt
source repo: thecrimsondeveloper/Gold_Rush
source branch: development
source commit: 144230e32b537336c83407b4ddae83cdc95c1c9e
destination repo: LuminaryLabs-Dev/NexusEngine-GoldRush
destination root: raw/imported/goldrush-dual-source-001/
local clone on this computer: forbidden
runtime promotion: forbidden
public asset write: forbidden
deferred slot copy: forbidden
```

Every copied file must land at:

```txt
raw/imported/goldrush-dual-source-001/<sourcePath>
```

The copy ledger `domain` value must be one of the four raw-copy plan domain ids. Loose labels like `audio` or `props` are invalid for this pass.

## Validator Lock

The local receipt gate now cross-checks receipts against the raw-copy plan:

```txt
node tools/validation/validate-cloud-asset-receipts.mjs
```

## Executable Worker

The destination repo includes a guarded raw-copy worker:

```txt
tools/import-sanitize/copy-raw-plan-from-github.mjs
tools/validation/validate-raw-copy-worker.mjs
```

Default dry run does not fetch source blobs and does not write raw files:

```bash
node tools/import-sanitize/copy-raw-plan-from-github.mjs
```

Fetch-only mode downloads blobs through `gh api`, computes hashes, runs in-memory deny/secret checks, and reports receipt counts without writing:

```bash
node tools/import-sanitize/copy-raw-plan-from-github.mjs --fetch
```

Fetch-only proof can be retained without raw contents:

```bash
node tools/import-sanitize/copy-raw-plan-from-github.mjs --fetch --summary-out reports/provenance/goldrush-dual-source-001-raw-copy-worker-fetch-proof.json
```

Write mode copies raw files and writes the six receipts. Because `LuminaryLabs-Dev/NexusEngine-GoldRush` is public, write mode requires an explicit risk acknowledgement:

```bash
node tools/import-sanitize/copy-raw-plan-from-github.mjs --write --confirm-public-raw-import-risk
```

Write mode must be run only on the raw import branch:

```txt
import/goldrush-dual-source-001-raw
```

Once any raw candidate or receipt exists, the gate requires:

```txt
31 copied files
31 raw candidate files
31 hash manifest records
31 classification records
0 blocked classification records
passed deny-path scan
passed secret scan
exact sourcePath, destinationPath, sizeBytes, and planned targetRawPath matches
```

## Explicitly Unresolved

```txt
boss music
gold pickup SFX
cashout SFX
ambush SFX
player-down SFX
aim-idle animation
aim-run animation
dead animation
conversion to browser runtime formats
license/provenance approval
human review
approved runtime registry promotion
public/assets output
```

## Follow-Up After Receipts Land

```txt
1. Run node tools/validation/validate-cloud-asset-receipts.mjs.
2. Run npm run check.
3. Review classification output by slot and domain.
4. Convert approved scene metadata, audio, FBX, textures, prefabs, and animations into sanitized outputs.
5. Generate conversion, provenance, and human-review receipts.
6. Add approved runtime records only after public asset files exist and hashes match.
7. Re-run browser proof for title, lobby, loading train, classic combat, classic solo, and modern extraction paths.
```
