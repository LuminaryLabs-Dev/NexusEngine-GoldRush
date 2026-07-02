# Match Economy Retention Lab

Status: active docs-only
Date: 2026-07-01
Domain: gameplay / match / progression / product / release

## Purpose

Define the future GoldRush economy, reward, progression, replay, and retention surfaces without implementing runtime changes. This lab fills the gap between a playable extraction loop and a replayable AAA battle-royale extraction game.

## Current Diagnosis

GoldRush already has structural proof for parts of mine -> carry -> cashout -> results. The next risk is that the game can become technically complete but shallow: gold increases, results appear, and routes work, yet the player does not understand value, risk, loss, reward eligibility, or why another run matters.

This lab defines a product-facing economy layer that remains kit-owned:

```txt
run value -> cargo risk -> cashout stake -> match score -> replay lesson -> optional progression -> next run
```

## Reference Signals

- Apex Legends official game modes: https://help.ea.com/en/articles/apex-legends/game-modes/
  - Signal: Apex separates competitive, relaxed, bot, private, training, and firing-range contexts. It also distinguishes progression-safe and non-progression-safe modes. GoldRush needs the same separation for practice, staging, simulated 60-player, public proof, and future live match claims.
- PUBG official game overview: https://pubg.com/en/game-info/overview
  - Signal: PUBG frames battle royale around land, loot, survive, shrinking zone pressure, care package risk, vehicles, training, and solo/duo/squad modes. GoldRush should translate that into train entry, claim route selection, gold/tool/resource economy, final-rush pressure, extraction risk, and staging practice.
- Fortnite ranked and team fill support: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894
  - Signal: Fortnite exposes mode, ranked toggle, fill, and team-size options at the player-facing layer. GoldRush needs party size, practice, fill/bot, and competitive-readiness choices to be product contracts, not hidden debug toggles.
- Fortnite team fill support: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/unable-to-find-teammates-while-playing-in-duos-trios-or-squad-in-battle-royale-and-zero-build-modes-in-fortnite-a202300000014690
  - Signal: Team fill is a simple player-facing switch with large match-quality implications. GoldRush should separate invited party, bot fill, squad fill, and no-fill staging behavior in data and proof.
- GitHub game engine collection: https://github.com/collections/game-engines
  - Signal: The collection highlights broad game-framework surfaces such as multi-platform runtime, rendering, tools, and content systems. GoldRush should not become a general engine, but economy and retention still need kit-owned data, validation, tuning, and deploy proof.
- GitHub JavaScript game engine collection: https://github.com/collections/javascript-game-engines
  - Signal: The JavaScript collection highlights browser game runtime concerns: rendering, physics, WebGL/WebGPU, glTF, and web delivery. GoldRush economy/progression data must stay browser-safe, serializable, and proofable in local/public builds.

## System Set

- 01 Run Value Ladder: Define the value path from empty-handed spawn to mined gold, carried risk, cashout, score, and replay payoff.
- 02 Gold Source And Sink Model: Separate match gold, extracted gold, score gold, and future meta gold so rewards cannot inflate or blur together.
- 03 Loot And Tool Table: Define tools, weapons, consumables, and utility items as readable western loot rather than random props.
- 04 Claim Contract Objectives: Turn a match into readable claim objectives: prospect, mine, defend, haul, contest, cashout, and survive.
- 05 Risk Reward Tiers: Tie map location, gold value, threat pressure, cover density, extraction distance, and route exposure into readable tiers.
- 06 Extraction Stakes And Loss: Define what is lost, banked, dropped, contested, or converted when extraction succeeds, fails, or is interrupted.
- 07 Final Rush Pressure Economy: Make shrinking-space pressure affect route choice, gold greed, cashout timing, and late-match contest value.
- 08 Squad Role And Share Rules: Define how Crew, Posse, and Outfit group types share information, cargo, cashout value, revive burden, and results.
- 09 Bot Fill Reward Boundary: Separate practice, bot-fill, simulated-scale, private, public, and future ranked reward eligibility.
- 10 Replay Lesson Loop: Turn results into a short explanation of why the run succeeded or failed and what the player can improve.
- 11 Progression Without Grind: Define future meta progression that supports identity and learning without burying the core extraction loop.
- 12 Challenge And Contract Rotation: Plan future rotating claim challenges without making them required for basic play.
- 13 Cosmetic And Identity Boundary: Separate character identity, outfit, tools, lobby pose, and cosmetics from power progression and asset approval.
- 14 Tuning And Telemetry Ledger: Make economy, reward, pressure, threat, and progression tuning explicit and replayable across restarts.
- 15 Fairness And Abuse Boundary: Define minimum anti-abuse and sanity rules before rewards, public matches, or persistent progression become meaningful.
- 16 Release Versioned Economy Policy: Version all economy/progression decisions so public builds, local tests, and future restarts can compare the same rules.

## Files

- `economy-domain-map.md`
- `source-reference-matrix.md`
- `reward-loop-contract.md`
- `extraction-stakes-contract.md`
- `progression-boundary-policy.md`
- `tuning-data-matrix.md`
- `fakeout-register.md`
- `validator-proof-plan.md`
- `restart-policy.md`
- `kit-gap-register.md`
- `systems/`
- `research/`

## Non-Code Rule

Do not implement from this lab until code work resumes. Future work should create or update local GoldRush kits only, keep progression eligibility explicit, and prove every reward claim with receipts and local/public human-view evidence.
