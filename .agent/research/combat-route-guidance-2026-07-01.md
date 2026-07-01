# Combat Route Guidance Research

Date: 2026-07-01
Status: applied

## Intent

Turn carried-gold ambush setup into a player-walked route: cargo creates threat pressure, threat readability creates cover, and camera-relative input moves the player into cover before firing.

## Research Signals

- Microsoft XAG 103: critical gameplay cues should be available through more than one sensory channel and should not rely only on color.
- Microsoft XAG 104: important audio cues such as gunfire and footsteps need equivalent non-audio presentation.
- Game Accessibility Guidelines: objectives, interactables, key objects, and key events should be clearly indicated; essential info should not sit outside the player eyeline.
- EA Accessibility Patent Pledge: context-aware audio/visual communication patterns are useful for player coordination and awareness.

## Applied Design

- Added `n:goldrush:combat-route-guidance`.
- The route composes `n:goldrush:gold-carrying`, `n:goldrush:ambush-pressure`, `n:goldrush:player-action-surface`, `n:goldrush:combat-loop-readiness`, and renderer marker evidence.
- The public API is still small: `update`, `snapshot`, `validate`.
- The private work ranks threat targets, cover targets, camera-relative input, combat input, helper debt, and stage status.
- Route memory latches the first cover target for the active threat because generated cover descriptors are otherwise relative to the moving player.

## Proof Implications

- `node tools/validation/validate-combat-route-guidance.mjs` proves cargo -> threat -> cover route -> cover engagement -> combat receipt.
- `npm run proof:combat-route-guidance` proves title -> train -> mine -> carried-gold threat -> cover route -> cover engagement through `GameHost.tick`.
- This reduces direct-combat-setup helper debt, but result-completion helper debt still belongs to the broader combat/results loop.

## Next Gaps

- Replace dynamic generated cover with authored/protokit world cover so route memory becomes a fallback, not the primary stability fix.
- Add player-facing threat/cover visual polish for toon-shaded silhouettes.
- Add approved audio cues for threat, cover, fire, and hit feedback.
- Move from route proof to repeated encounter feel: timing, damage cadence, recoil, player hit reads, enemy readability, and exit-to-cashout pressure.
