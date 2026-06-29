# Gold Rush Cloud Source Preflight

Status: planning/report-only
Branch: `import/goldrush-dual-source-preflight`
Target repo: `LuminaryLabs-Dev/NexusEngine-GoldRush`
Legacy source repo: `thecrimsondeveloper/Gold_Rush`

## Purpose

This branch defines the cloud-side preflight contract for moving selected legacy Gold Rush source data toward `NexusEngine-GoldRush`.

No raw legacy assets are copied by this branch.

The next raw import branch must copy only pre-scanned candidate files into:

```txt
raw/imported/<importJobId>/
```

Raw files must never be copied directly into:

```txt
public/assets/
src/
sanitized/
```

## Known source projects

```txt
GoldRush/
  Unity 6000.0.37f1
  productName: GoldRush
  candidate scenes: Assets/Scenes/Lobby.unity, Assets/Scenes/Arena.unity, Assets/Entities/Player/PlayerTest.unity

GoldRush_Old/
  Unity 2022.3.5f1
  productName: Gold Rush
  candidate scenes: Assets/_GOLDRUSH/00_Scenes/MainMenu.unity, Assets/_GOLDRUSH/00_Scenes/Game.unity, Assets/_GOLDRUSH/00_Scenes/Game_SinglePlayer.unity
```

## Absolute safety rules

```txt
1. Do not print, copy, preserve, or summarize secret values.
2. Do not copy Unity package manifests into this public repo.
3. Do not copy Photon/Fusion plugin/config folders.
4. Do not copy DOTween/Odin-style plugin folders.
5. Do not copy generated Unity folders.
6. Do not promote raw Unity files directly to public/assets.
7. Do not make local Codex clone old repos.
```

## Required cloud worker phases

```txt
1. Checkout legacy source in a private/cloud worker environment.
2. Resolve and record the exact source commit SHA.
3. Run pre-public deny-path scan.
4. Run pre-public secret scan.
5. Remove/block denied files before any push to NexusEngine-GoldRush.
6. Copy only approved candidate paths into raw/imported/<importJobId>/.
7. Generate file hash manifest and scan reports.
8. Open a separate raw-import PR.
```

## Required receipt gate

Raw-copy PRs must include the receipt set documented in:

```txt
docs/cloud-asset-receipts.md
```

The destination repo validates those receipts with:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs
```

Cloud import branches are additionally checked by `.github/workflows/validate-cloud-import.yml`, which runs strict receipt mode:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs --require-receipts
```

## Local Codex boundary

Local Codex may clone and edit only:

```txt
LuminaryLabs-Dev/NexusEngine-GoldRush
```

Local Codex must not be asked to clone or inspect:

```txt
thecrimsondeveloper/Gold_Rush
```

All legacy source movement must happen cloud/GitHub-side through PRs into `NexusEngine-GoldRush`.

## Import job ordering

```txt
PR A: preflight docs/reports only
PR B: raw/imported candidate copy only after pre-public scan
PR C: sanitized converted candidates
PR D: promoted public/assets outputs after human review
PR E: game/app integration using promoted assets only
```

## Local validation gates local Codex can add without old repo access

```txt
npm run check
npm run build
node tools/validate-no-raw-runtime-references.mjs
node tools/validate-import-reports.mjs
node tools/validate-public-assets-approved.mjs
node tools/validate-build-dist-clean.mjs
node tools/validation/validate-cloud-asset-receipts.mjs
```

These validators should inspect only the destination repo. They should fail if runtime code references `raw/`, `quarantine/`, blocked manifests, Photon/Fusion paths, plugin paths, or unapproved assets.
