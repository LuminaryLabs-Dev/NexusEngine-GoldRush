# Contested Extraction Sites

Status: implemented locally
Date: 2026-06-30

## Purpose

Turn extraction from a passive cashout timer into a contested world event that exposes risk, calls threats, and writes replay-safe receipt context.

## Sources

- Hunt: Showdown official site: https://www.huntshowdown.com/
- Crytek event article with scarce extraction information and discovered traits: https://www.crytek.com/news/devils-trail-bringing-searing-new-content
- Escape from Tarkov official support: https://www.escapefromtarkov.com/support
- ARC Raiders official site: https://arcraiders.com/
- Apex Legends official site: https://www.ea.com/games/apex-legends/apex-legends

## Source Takeaways

- Extraction should be a decision point with risk and information pressure, not only a finish button.
- High-value objectives should create player-facing route pressure and consequence.
- Threats around extraction should be readable and attributable to the extraction site.
- Squad games need state that explains why a fight or failed extraction happened.
- Result and replay systems need the extraction context, not only the final score.

## Implemented Domain

```txt
n:goldrush:cashout-sites
├─ extraction volumes
├─ hold progress
├─ condition-linked contest pressure
├─ noise radius
├─ expanded threat radius
├─ linked threat call
├─ marker status
├─ receipt contest context
└─ replay/result-ready data
```

## Current Behavior

- `rail-depot-extract-01` has a `contest` profile with noise radius, threat radius, threat-call threshold, lockdown threshold, and linked threat ids.
- `holdExtraction()` evaluates active frontier condition risk, carried cargo, extraction progress, and site contest defaults.
- High-risk extraction escalates through `watched -> contested -> lockdown`.
- Contested extraction calls linked local threats, currently `claim-jumper-01`.
- The active threat keeps the expanded contest radius instead of being overwritten by normal detection radius.
- World-space extraction markers expose `contest` and switch marker status to `contested` or `lockdown`.
- Accepted extraction receipts preserve `extractionSiteContest` for later results/replay explanation.

## Proof

```txt
node tools/validation/validate-goldrush-extraction-loop.mjs
node tools/validation/validate-nexus-runtime.mjs
node tools/validation/validate-match-lifecycle.mjs
node tools/validation/validate-domain-kit-contracts.mjs
```

Browser proof:

```txt
output/playwright/contested-extraction-sites-proof.json
output/playwright/contested-extraction-sites.png
```

The browser proof forces `goldrush.condition.high-fever-seam`, mines gold, holds extraction, reaches `lockdown`, calls `claim-jumper-01`, preserves `conditionRadius: 28.8`, records `combatPressure: 0.77`, and writes the same contest object into the extraction receipt ledger.

## Next Kit Consumers

- `n:goldrush:results-screen` should display the extraction contest reason and threat call.
- `n:goldrush:replay-summary` should count contested and lockdown extractions.
- `n:goldrush:frontier-combat` should turn called extraction threats into a fuller firefight loop with ammo, hit feedback, and interrupt rules.
