# Results And Replay Clarity Research

Status: active
Date: 2026-06-30

## Sources

- EA Apex Legends overview and FAQ: https://www.ea.com/games/apex-legends/about and https://www.ea.com/games/apex-legends/about/frequently-asked-questions
- Hunt Showdown official game page: https://www.huntshowdown.com/game
- Escape from Tarkov official about page: https://www.escapefromtarkov.com/#about

## Domain Read

Extraction and battle royale results screens have to explain four things quickly:

- outcome: win/loss, placement, team, and score
- value: extracted loot, gold, cargo, bounty, or other persistent gain
- risk: why the extraction was dangerous, contested, noisy, or under pressure
- replay: the moments the player can remember, share, debug, or improve from

## GoldRush Gap

GoldRush already had `goldrushResults` and `goldrushReplaySummary` snapshots, but the playable browser flow stopped at the run scene. That made the loop technically valid in validators while still feeling unfinished to a player.

## Kit Direction

- `n:goldrush:results-screen` must present kit snapshots, not calculate scoring.
- `n:goldrush:replay-summary` must provide compact key moments that survive replay/debug.
- `n:goldrush:scene-flow` must include a real results site, not treat results as hidden arena state.
- Extraction completion should finalize through `runtime.endMatch()` once, then activate the results scene.

## Validator Implications

- `validate-scene-sites.mjs` should require a `results` scene site.
- The results site should load `results-summary` and `replay-summary` kit groups.
- The app source should prove `completeRunToResults`, `runtime.endMatch`, and `showScreen("results")`.
- Browser proof should eventually walk title -> lobby -> train -> run -> extract -> results and inspect visible text.

## Current Slice

Implemented a player-facing results screen that renders:

- winner and placement
- score and extracted gold
- extraction contest severity
- frontier condition field read
- called threat ids
- awards
- replay key moments

The DOM remains presentation-only; match rules, score, contest summary, awards, and replay data stay owned by the existing NexusRealtime-style kits.
