# Bot AI Encounter Lab

Status: active

## Purpose

This docs-only lab defines the bot, staging, and encounter-direction systems needed to move GoldRush from a single-player route proof toward believable 20-player and 60-player staged pressure. It does not implement bots and it does not claim live multiplayer proof.

## Why This Exists

GoldRush can already prove pieces of route, mining, cargo, extraction, and results. The next risk is that the game feels empty or fake because no behavior-rich opponents exercise the same terrain, resources, cover, cashout, audio, and scoring surfaces. A bot lab lets the team test the full loop locally while keeping live-player claims honest.

## Boundary

- This folder is planning and audit only.
- Bots are staging actors, not proof of live multiplayer authority.
- Bot behavior must use the same domain kits as players whenever possible.
- Every simulated run must label human count, bot count, proof tier, mode, and reward eligibility.
- Any future implementation stays inside the GoldRush repo and starts with local kits.

## System Matrix

| # | System | Generic kit | GoldRush kit | Research |
| --- | --- | --- | --- | --- |
| 01 | [Bot Role Taxonomy](systems/bot-role-taxonomy/README.md) | `n:ai:role-taxonomy` | `n:goldrush:bot-role-taxonomy` | [research](research/bot-role-taxonomy/01-source-research.md) |
| 02 | [Bot Roster Scale Fixture](systems/bot-roster-scale-fixture/README.md) | `n:ai:bot-roster` | `n:goldrush:staging-bot-roster` | [research](research/bot-roster-scale-fixture/01-source-research.md) |
| 03 | [Bot Spawn And Party Fill](systems/bot-spawn-and-party-fill/README.md) | `n:ai:spawn-fill` | `n:goldrush:bot-party-fill` | [research](research/bot-spawn-and-party-fill/01-source-research.md) |
| 04 | [Bot Route Intent](systems/bot-route-intent/README.md) | `n:ai:route-intent` | `n:goldrush:bot-route-intent` | [research](research/bot-route-intent/01-source-research.md) |
| 05 | [Bot Terrain Movement](systems/bot-terrain-movement/README.md) | `n:ai:movement-agent` | `n:goldrush:bot-terrain-movement` | [research](research/bot-terrain-movement/01-source-research.md) |
| 06 | [Bot Resource Prospecting](systems/bot-resource-prospecting/README.md) | `n:ai:objective-agent` | `n:goldrush:bot-prospecting` | [research](research/bot-resource-prospecting/01-source-research.md) |
| 07 | [Bot Mining And Cargo](systems/bot-mining-and-cargo/README.md) | `n:ai:objective-agent` | `n:goldrush:bot-cargo-runner` | [research](research/bot-mining-and-cargo/01-source-research.md) |
| 08 | [Bot Cashout Objective](systems/bot-cashout-objective/README.md) | `n:ai:objective-agent` | `n:goldrush:bot-cashout-runner` | [research](research/bot-cashout-objective/01-source-research.md) |
| 09 | [Bot Threat Telegraph](systems/bot-threat-telegraph/README.md) | `n:ai:combat-agent` | `n:goldrush:bot-threat-telegraph` | [research](research/bot-threat-telegraph/01-source-research.md) |
| 10 | [Bot Cover And Peek](systems/bot-cover-and-peek/README.md) | `n:ai:combat-agent` | `n:goldrush:bot-cover-counterplay` | [research](research/bot-cover-and-peek/01-source-research.md) |
| 11 | [Bot Weapon Engagement](systems/bot-weapon-engagement/README.md) | `n:ai:combat-agent` | `n:goldrush:bot-western-combat` | [research](research/bot-weapon-engagement/01-source-research.md) |
| 12 | [Bot Downed Revive Recovery](systems/bot-downed-revive-recovery/README.md) | `n:ai:recovery-agent` | `n:goldrush:bot-recovery` | [research](research/bot-downed-revive-recovery/01-source-research.md) |
| 13 | [Encounter Director Pacing](systems/encounter-director-pacing/README.md) | `n:ai:encounter-director` | `n:goldrush:encounter-director` | [research](research/encounter-director-pacing/01-source-research.md) |
| 14 | [Encounter Distance Bands](systems/encounter-distance-bands/README.md) | `n:ai:encounter-director` | `n:goldrush:encounter-distance-bands` | [research](research/encounter-distance-bands/01-source-research.md) |
| 15 | [Survivor Density Snapshot](systems/survivor-density-snapshot/README.md) | `n:ai:density-snapshot` | `n:goldrush:survivor-density` | [research](research/survivor-density-snapshot/01-source-research.md) |
| 16 | [Bot Difficulty Personas](systems/bot-difficulty-personas/README.md) | `n:ai:difficulty-persona` | `n:goldrush:bot-difficulty-personas` | [research](research/bot-difficulty-personas/01-source-research.md) |
| 17 | [Simulation Reporting](systems/simulation-reporting/README.md) | `n:runtime:simulation-proof` | `n:goldrush:bot-simulation-reporting` | [research](research/simulation-reporting/01-source-research.md) |
| 18 | [Local Public Bot Proof Boundary](systems/local-public-bot-proof-boundary/README.md) | `n:runtime:simulation-proof` | `n:goldrush:bot-proof-boundary` | [research](research/local-public-bot-proof-boundary/01-source-research.md) |

## External Reference Signals

| Source | Reference | Signal | GoldRush implication |
| --- | --- | --- | --- |
| apex-modes | [Apex Legends game modes](https://help.ea.com/en/articles/apex-legends/game-modes/) | Bot Royale uses humans plus bot squads up to 60 players, Private Match supports up to 60 players and observers, and Training/Firing Range are separated practice contexts. | Separate practice, bot-fill, private proof, and future live modes. Bot proof can exercise pacing and pressure, but it must label what is simulated. |
| pubg-overview | [PUBG overview](https://pubg.com/en/game-info/overview) | Battle royale pressure is built from land, loot, survive, map choice, drop choice, and a shrinking battleground. | Bots must exercise route choice, resource pickup, survival pressure, and zone movement instead of only standing as targets. |
| pubg-custom-ai | [PUBG custom match AI settings](https://pubg.com/en/news/8476) | Custom matches can enable AI, tune AI damage, fill lobbies with bots, start with one team when AI is enabled, and still show results. | GoldRush staging should allow single-player runs with bot-filled pressure while preserving result labels and live-proof boundaries. |
| fortnite-fill | [Fortnite fill and mode toggles](https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894) | Mode, ranked, team fill, and Solo/Duo/Trio/Squad options are player-facing choices near the Play action. | Party, fill, bot-fill, staging, and no-fill should become clean mode contracts instead of hidden proof switches. |
| github-game-engines | [GitHub game engines collection](https://github.com/collections/game-engines) | Common engines and frameworks expose rendering, scene, platform, tooling, collaboration, and runtime surfaces. | Do not build a general engine, but use the list as a missing-surface checklist for AI, scene, proof, content, runtime, and tools. |
| github-js-game-engines | [GitHub JavaScript game engines collection](https://github.com/collections/javascript-game-engines) | Web game frameworks emphasize browser rendering, WebGL, WebGPU, glTF, layout, and platform reach. | Browser proof should track rendering, input, physics, network, asset loading, and report hygiene separately. |

## Required End State

The staged bot layer should be able to run a solo test where the player can title -> lobby -> train -> spawn -> mine -> carry -> encounter threat -> use cover -> cash out -> score -> results while bots also prospect, carry value, threaten, recover, and attempt extraction. The report must say whether this was solo, local bot, public bot, simulated scale, or future live proof.

## First Coding Batch Later

1. Add neutral bot roster and role taxonomy contracts.
2. Add GoldRush bot roster fixture for solo and 20 simulated actors.
3. Add movement that samples the same terrain and raycast APIs as the player.
4. Add one resource-prospecting bot and one cashout bot.
5. Add encounter director pacing with proof labels.
6. Add Playwright/NexusSimulator proof with sanitized reports.
