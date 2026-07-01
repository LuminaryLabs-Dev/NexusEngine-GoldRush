# Frontier Conditions Kit Pass

Status: implemented locally
Date: 2026-06-30

## Purpose

Add match identity to GoldRush without needing approved legacy assets yet. Frontier conditions tell the player what kind of run they are entering and expose deterministic modifiers that world, audio, lighting, extraction, and combat systems can consume.

## Sources

- Hunt: Showdown official page: https://www.huntshowdown.com/
- Hunt: Showdown thundershower design article: https://www.huntshowdown.com/news/behind-the-storm-technical-design-of-thundershower-in-hunt-showdown
- Apex Legends Wild Iron event notes: https://www.ea.com/games/apex-legends/apex-legends/news/wild-iron-event
- Escape from Tarkov official raid extraction support: https://www.escapefromtarkov.com/support/1
- ARC Raiders official page: https://arcraiders.com/
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends
- Fortnite Epic Games Store page: https://store.epicgames.com/en-US/p/fortnite

## Source Takeaways

- Extraction games benefit from condition surfaces that alter route planning instead of only changing visuals.
- Weather and map conditions should affect visibility, audio masking, extraction risk, and threat pressure.
- Battle royale pressure should surface in results/replay because closing-ring or event-rule pressure changes how victory was earned, not just where players stood.
- Extraction success should preserve the condition of the extraction point and carried value so replay/results can explain risk, not only score.
- The player needs active and upcoming condition reads so planning starts before the run.
- The condition system should be deterministic and serializable so NexusRealtime snapshots can replay it.

## Implemented Domain

```txt
n:goldrush:frontier-conditions
├─ active condition
├─ upcoming condition rotation
├─ planning modifiers
├─ world descriptor
├─ audio descriptor
├─ lighting descriptor
├─ resolved effects
└─ validation result
```

## Current Conditions

- Clear Noon Rush
- Dust Storm
- Night Train
- Mine Collapse
- Boomtown Rush
- Bandit Patrol
- Dry Creek
- High Fever Seam

## Active Consumers

- `n:goldrush:frontier-conditions` resolves `effects` from the active condition.
- `n:goldrush:extraction-loop` uses mining payout scalar, extraction hold-time scalar, cashout value scalar, threat detection radius, and combat pressure scalar.
- `n:goldrush:extraction-receipts` records frontier condition context on accepted cashout receipts.
- `n:goldrush:results-screen` summarizes the active condition, linked receipt count, payout/risk/combat scalars, ambience, and lighting key.
- `n:goldrush:replay-summary` preserves the same condition summary in deterministic replay output.
- `n:goldrush:music-and-stingers` exposes condition music bias, ambience, masking, and stingers in audio state.
- `n:goldrush:gold-field-renderer` consumes render effects for sky/fog palette, fog distance, dust, and lighting key.
- `n:goldrush:scene-flow` shows a compact frontier-condition briefing in the lobby before train boarding.
- `n:goldrush:first-sequence` carries the same briefing into the loading-yard payload so train boarding preserves the run identity.
- `frontier-condition-briefing` mounts as a scene-site kit group in both `site.lobby-character` and `site.loading-yard`.
- `window.GoldRushHost.getState()` exposes both `frontierConditions` and `frontierConditionEffects`.

## Edge Cases

- Conditions now affect extraction/combat/audio/render/results/replay-facing state, but they still do not mutate raw terrain geometry or approved asset/audio promotion.
- The active condition is deterministic from seed, phase, and tick band.
- The state is serializable and appears in `engine.n.goldrushScenario.snapshot()`.
- Forced-condition validation uses `goldrush.condition.high-fever-seam` to prove non-baseline payout, hold-time, cashout, combat, receipt, result, replay, ambience, and renderer effects.

## Next Kit Consumers

- Human-view proof should capture at least two forced conditions and compare atmosphere/readability.
- `n:goldrush:extraction-sites` now turns condition risk into contested extraction-site behavior, linked threat calls, marker status, and receipt context.
- `n:goldrush:results-screen` should show the contested extraction reason in the end-state readout.

## Proof

```txt
node --check src/content/goldrushFrontierConditions.js
node --check src/kits/goldRushExtractionLoopKit.js
node --check src/kits/goldRushDomainKits.js
node tools/validation/validate-domain-kit-contracts.mjs
node tools/validation/validate-nexus-runtime.mjs
node tools/validation/validate-goldrush-extraction-loop.mjs
node tools/validation/validate-procedural-renderer-kits.mjs
node tools/validation/validate-first-sequence.mjs
node tools/validation/validate-scene-sites.mjs
```

Latest browser proof: `output/playwright/frontier-condition-briefing-proof.json` shows `goldrush.condition.bandit-patrol` rendered in the lobby and carried into the loading-yard first-sequence payload with the `frontier-condition-briefing` kit group active in both sites.
