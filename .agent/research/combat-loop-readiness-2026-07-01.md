# Combat Loop Readiness Research - 2026-07-01

## Intent

Move GoldRush closer to a battle royale extraction loop by proving combat is readable, counterplay-driven, receipt-backed, and summarized in results instead of being a hidden helper or debug-only state.

## Sources

- Microsoft Xbox Accessibility Guideline 103, visual information: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103
- Microsoft Xbox Accessibility Guideline 104, audio information: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/104
- Game Accessibility Guidelines full list: https://gameaccessibilityguidelines.com/full-list/

## Relevant Findings

- Combat-critical facts should not rely on one sensory channel. Threat direction, danger lanes, cover, damage, and extraction pressure need visual structure plus audio/state alternatives.
- Audio-only combat information is fragile. Gunfire, footsteps, threat cues, and warning cues should also be represented through visible world cues, receipt state, or player-facing prompts.
- Objective/context clarity matters in action games. The player should always know the current threat, current counterplay, and the next goal without reading debug overlays.
- Distinct sound/music cues are useful, but GoldRush must keep actual legacy audio promotion gated until human/license approval records exist.

## Kit Implications

- `n:goldrush:combat-loop-readiness` should compose existing systems instead of owning mechanics.
- The kit must prove six staged facts: cargo activates threat pressure, threat telegraph is readable, cover counterplay exists, cover can be engaged, shot/damage receipts exist, and results summarize combat.
- The kit must expose helper debt when proof still uses direct combat setup or direct result completion helpers.
- Renderer evidence is allowed as proof input, but combat authority stays in `n:goldrush:ambush-pressure`, `n:goldrush:player-action-surface`, `n:match:receipts`, and `n:match:results`.

## Validator / Proof Implications

- CLI validation should prove the full data loop from mine -> threat -> cover -> shot/damage receipts -> extract -> results.
- Browser proof should also resolve the readiness matrix, but it may still log helper debt until a human-routed combat encounter exists.
- Next gap after this kit is route-to-threat/cover play: the player should enter combat by moving through the world, not by direct proof setup.
