# Player Action Surface

Status: active

## Domain Decision

- Classification: composite GoldRush custom gameplay kit.
- Domain: `n:goldrush:player-action-surface`.
- Contract: `goldrush-player-action-surface-v1`.
- Generic source domains consumed: `n:gameplay:interaction-hold`, `n:gameplay:extraction`, `n:gameplay:cargo`, and `n:gameplay:combat-pressure`.
- GoldRush owners preserved: `n:goldrush:mine-hold-action`, `n:goldrush:cashout-sites`, `n:goldrush:gold-carrying`, and `n:goldrush:ambush-pressure`.

## Why This Exists

Mining, cashout, cover, and inspection were becoming separate cue paths. That is hard to scale because every new object or action would need another one-off renderer read. The action surface keeps the source systems separate but exposes one player-facing answer:

```txt
What can I do now?
What button matters?
Am I close enough?
How far through the hold am I?
What risk is active?
What should happen next?
```

## Web/UX Research Notes

- NN/g visibility-of-system-status guidance supports immediate, clear status feedback for actions and progress rather than hidden state.
- Game Accessibility Guidelines control/input guidance supports making action requirements and hold-style input expectations clear, because ambiguous or prolonged input can create avoidable friction.

Sources:

- https://www.nngroup.com/articles/visibility-system-status/
- https://gameaccessibilityguidelines.com/full-list/

## Acceptance Criteria

- `engine.n.goldrushPlayerActionSurface.snapshot()` exposes `goldrush-player-action-surface-v1`.
- The scenario snapshot includes `playerActionSurface`.
- The browser host exposes `playerActionSurface` and `playerActionSurfaceValidation`.
- Mining near a gold seam makes `mine-gold` primary.
- Carrying gold at an extraction site makes `cashout-gold` primary.
- Active cover/combat makes `hold-cover` or `take-cover` primary.
- The surface never owns payouts, deposits, damage, cover engagement, or rendering; it only composes their snapshots.

## Validation

- `tools/validation/validate-player-action-surface.mjs`
- `tools/validation/validate-nexus-runtime.mjs`
- `tools/validation/validate-procedural-renderer-kits.mjs`

## Remaining Gap

The surface is currently a state contract. The next visual pass should consume it for one consistent in-world input/action prompt instead of independently reading selected-affordance and extraction-cashout cue state.
