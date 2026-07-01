# AAA Extraction Battle Royale Gap Map

Status: active
Date: 2026-06-30

## Purpose

Turn current battle royale and extraction references into GoldRush-specific kit gaps. This packet is not a feature wish list; every gap must map to a domain, an owning kit, and proof.

## Sources

- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends
- Fortnite Epic Games Store page: https://store.epicgames.com/en-US/p/fortnite
- Hunt: Showdown official page: https://www.huntshowdown.com/
- ARC Raiders official page: https://arcraiders.com/

## Source Takeaways

### Apex Pattern

- Uses named characters with readable identities and skills.
- Supports classic 60-person Battle Royale.
- Treats large maps, evolving seasons, events, ranked/meta updates, and lore as live surfaces.
- GoldRush implication: the skeleton prospector cannot remain only a placeholder. We need readable archetypes, silhouettes, abilities/tools, and mode identity packets.

### Fortnite Pattern

- Keeps the first read simple: squad action, last-player-standing Battle Royale, Zero Build, traversal, and fast controls.
- Supports many adjacent experiences from one platform surface.
- Zero Build emphasizes cover, sprinting, mantling, spatial judgment, and weapon/item/traversal skill.
- GoldRush implication: the game needs simple first-session verbs before advanced systems: move, spot route, mine, carry, shoot/evade, extract.

### Hunt Pattern

- Combines competitive PvP with heavy PvE.
- The core fantasy is bounty hunting, survival, risk, and match-based extraction tension.
- GoldRush implication: gold seams, AI threats, extraction sites, and player pressure should create overlapping risk instead of isolated minigames.

### ARC Raiders Pattern

- Frames extraction as an adventure, not only a hardcore inventory sim.
- Mixes PvE machine threats, PvP raider threats, atmospheric world-building, loot extraction, and consequences.
- Uses live map conditions as an exposed player-facing surface.
- GoldRush implication: GoldRush should have frontier conditions: dust storm, night train, mine collapse, posse patrol, boomtown rush, bandit pressure, and gold fever modifiers.

## Current GoldRush Strengths

- Kit-first runtime already exposes `engine.n.goldrush*` state.
- Title -> lobby -> loading train -> 20-player run is locally proven.
- Terrain collider and camera-relative WASD are now validator-backed.
- Mining -> cargo -> extraction -> receipt has a local playable proof.
- Network room partitions are hidden behind `goldrushNetwork`.
- Asset sanitation gates prevent unsafe legacy promotion.

## AAA Gaps By Domain

### Identity Domain

Owner candidate: `n:goldrush:frontier-identity`

- Missing readable character class/archetype choices.
- Missing character tool/ability identity.
- Missing cosmetic loadout hooks.
- Missing silhouette proof across lobby, run, combat, and extraction.
- Missing "why this character is in the gold rush" lore packet.

Proof needed:

- Browser proof that three archetypes have distinct silhouettes and tool affordances.
- Snapshot proof that identity affects only allowed gameplay modifiers.

### Combat Domain

Owner candidate: `n:goldrush:frontier-combat`

- Combat is still prototype pressure, not a readable firefight loop.
- Missing weapon slots, ammo, reload timing, recoil, hit confirmation, cover reads, downed state, revive, and threat direction.
- Missing combat camera transition proof from exploration shoulder to aim shoulder.
- Missing PvE bandit/wildlife or hazard pressure as a real system.

Proof needed:

- Deterministic combat validator: aim state -> shot -> hit/miss -> ammo delta -> receipt.
- Human-view proof that the player can identify where the threat came from.

### Extraction Domain

Owner candidate: `n:goldrush:extraction-sites`

- Extraction exists but does not yet feel like a contested location.
- Missing timed cashout, noise/visibility cost, zone ownership, interrupt, and forced decision pressure.
- Missing multiple extraction site personalities.
- Missing final rush route collapse.

Proof needed:

- Validator for mine -> carry -> contested extraction -> receipt -> scoring.
- Browser proof showing route, risk cue, cargo state, and cashout progress at once.

### World Conditions Domain

Owner candidate: `n:goldrush:frontier-conditions`

- No exposed live map condition system.
- No environmental modifiers that change route planning.
- No match intro that tells the player what kind of frontier run they are entering.

Initial conditions:

- clear noon rush
- dust storm
- night train
- mine collapse
- boomtown rush
- bandit patrol
- dry creek
- high fever gold seam

Proof needed:

- Snapshot shows active condition, rule modifiers, audio/lighting/world descriptors.
- Browser proof captures at least two conditions with visible differences.

### Terrain And Readability Domain

Owner candidate: `n:goldrush:world-readability`

- Central mountain scale/framing remains open.
- Routes need landmark hierarchy: spawn landmark, mine landmark, town landmark, extraction landmark, danger landmark.
- Terrain needs path affordances and cover rhythm, not just scattered props.

Proof needed:

- Five-camera proof: spawn, approach, left detour, right detour, near mountain.
- Validator checks route gap widths, horizon visibility, and blocker boundaries.

### Loot And Economy Domain

Owner candidate: `n:goldrush:loot-economy`

- Gold is the only strong reward object.
- Missing item rarity, stash, equipment tradeoff, insurance/loss, and team split rules.
- Missing long-term extraction economy loop.

Proof needed:

- Deterministic loot table validator.
- Match results show carried, banked, lost, stolen, and bonus gold.

### Social Match Domain

Owner candidate: `n:goldrush:party-and-matchmaking`

- PeerJS party room exists, but social flow is not yet AAA-readable.
- Missing party slot presence states, ready checks, leader migration, reconnect, and invite failure handling.
- Missing squad/posse identity in run scene.

Proof needed:

- Multi-tab proof of four-player room, leader start, ready states, and launch handoff.
- Validator for leader disconnect and member reconnect.

### Presentation Domain

Owner candidate: `n:goldrush:frontier-presentation`

- Lobby direction is stronger, but still lacks character staging, lighting polish, motion, and readable mode cards.
- Loading train should be cinematic and playable.
- Result screen needs receipts, winners, replay digest, and "why I lost/won" clarity.

Proof needed:

- Human-view screenshot set for title, lobby, loading train, run, extraction, results.
- No first-screen advanced controls beyond Play/Start/Join essentials.

## Next Implementation Slices

1. Resolve central mountain readability.
   - Domain: terrain/readability.
   - Kit: `n:goldrush:world-readability`.
   - Why now: current feedback bug is open and directly blocks human-view quality.

2. Add frontier conditions as match descriptors. `Implemented locally 2026-06-30.`
   - Domain: world/match.
   - Kit: `n:goldrush:frontier-conditions`.
   - Why next: adds AAA-like match identity without needing approved legacy assets.

3. Upgrade extraction from cashout marker to contested site.
   - Domain: gameplay/extraction.
   - Kit: `n:goldrush:extraction-sites`.
   - Why next: makes the current playable loop feel like an extraction game.

4. Add combat receipts and readable threat direction.
   - Domain: combat.
   - Kit: `n:goldrush:frontier-combat`.
   - Why next: enables exploration/combat perspective switching to matter.

5. Add results screen receipts.
   - Domain: match/results.
   - Kit: `n:goldrush:results-screen`.
   - Why next: makes mining/carry/extract actions legible as a finished loop.

## Edge Cases To Carry Forward

- Frontier conditions must not hide routes or make terrain collider invalid.
- Combat camera must not reintroduce per-frame camera pulsing.
- Extraction site timers must be deterministic under NexusRealtime ticks.
- Party state must not leak raw peer IDs into shareable reports.
- Result receipts must be sanitized and repo-safe by default.
- Legacy audio/assets remain blocked from runtime until approved registry records exist.

## Current Decision

BUG-002 is resolved locally and `n:goldrush:frontier-conditions` now exposes deterministic active/upcoming match descriptors. The next local game-quality pass should wire those descriptors into extraction, combat pressure, presentation, and results so conditions change how the run plays instead of only existing as snapshot metadata.
