# Local Validation Gates for Legacy Import PRs

Local Codex can add these checks inside `LuminaryLabs-Dev/NexusEngine-GoldRush` without cloning or reading any legacy repo.

## Gate 1: no runtime references to raw imports

Fail if app/runtime files reference any of these strings:

```txt
raw/imported/
quarantine/
GoldRush_Old/
thecrimsondeveloper/Gold_Rush
```

Suggested command:

```bash
rg -n "raw/imported|quarantine|GoldRush_Old|thecrimsondeveloper/Gold_Rush" src public index.html package.json vite.config.*
```

Expected result: no matches.

## Gate 2: denied folders/files absent from destination

Fail if the destination repo contains copied Unity configs, generated folders, or plugin folders:

```bash
find . \
  -path '*/Packages/manifest.json' -o \
  -path '*/Packages/packages-lock.json' -o \
  -path '*/ProjectSettings/*' -o \
  -path '*/UserSettings/*' -o \
  -path '*/Library/*' -o \
  -path '*/Temp/*' -o \
  -path '*/Obj/*' -o \
  -path '*/Logs/*' -o \
  -path '*/Build/*' -o \
  -path '*/Builds/*' -o \
  -path '*/Assets/Photon/*' -o \
  -path '*/Assets/Photon*/*' -o \
  -path '*/Assets/Plugins/*'
```

Expected result: no matches, except docs/report text that names blocked paths for policy reasons.

## Gate 3: report files must not contain obvious token prefixes

Fail if reports/docs accidentally contain token-like prefixes:

```bash
rg -n "github_pat_|ghp_|gho_|ghu_|ghs_|ghr_|xox[baprs]-|AKIA|BEGIN PRIVATE KEY" docs manifests reports
```

Expected result: no matches.

## Gate 4: public assets require approval

Fail if `public/assets/` contains non-placeholder files that are not listed in an approval/registry report.

Suggested policy:

```txt
public/assets/** requires a matching assetId and approval record before merge.
```

## Gate 4A: cloud asset receipts must agree

Fail if raw candidates exist without the full receipt set, if receipt JSON has the wrong schema, if denied paths were copied, if source discovery does not prove both Unity roots, or if secret scans expose secret values:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs
```

Expected result before import: `waiting-for-cloud-asset-receipts`.
Expected result after cloud raw copy: `cloud-asset-receipts-ready`.

Import branches use strict mode so empty or receipt-free cloud branches fail:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs --require-receipts
```

## Gate 5: static build must not include raw import folders

After build, fail if `dist/` includes import working folders:

```bash
npm run build
find dist -path '*/raw/*' -o -path '*/quarantine/*' -o -path '*/sanitized/*' -o -path '*/reports/*'
```

Expected result: no matches.

## Gate 6: Pages base path

For GitHub Pages under the repo path, the Vite base path should resolve to:

```txt
/NexusEngine-GoldRush/
```

The Build branch should contain generated static output only.

## Gate 7: public Pages smoke proof

After Pages deploys, prove the public URL reaches the player-visible flow:

```bash
npm run proof:public -- --url https://luminarylabs-dev.github.io/NexusEngine-GoldRush/
```

Expected result: title -> lobby -> loading-yard train -> run scene, 20-player match, active `site.gold-field`, loaded `procedural-terrain` kit group, camera-relative WASD, visible-band terrain raycast, `cannon-es` terrain physics, and passing reality validation.
