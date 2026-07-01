# Extraction Setpiece Human-View Proof - 2026-06-30

## Question
The extraction set-piece contract existed, but the first browser screenshot viewed it from too far away. A contract alone does not prove the player can read the destination while carrying gold.

## Domain Decision
- Owner domain: `n:render:micro-object-instancing`.
- Proof surface: `npm run proof:extraction-setpiece`.
- Host-only proof action: `publicSmokePlaceAtExtractionSetpiece`.
- Gameplay authority stays in `n:gameplay:extraction`; the proof action only positions the local player for browser validation.

## Sources
- Game Accessibility Guidelines: keep essential gameplay information easy to perceive and distinguish.
  https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, visibility of system status: users need visible feedback about the current state and next action.
  https://www.nngroup.com/articles/visibility-system-status/
- Nielsen Norman Group, proximity principle: related visual parts should be grouped so they read as one object.
  https://www.nngroup.com/articles/gestalt-proximity/

## Applied Rule
Every visual contract that matters to play should eventually have a human-view proof, not only a state assertion. For this slice, the proof first mines gold, then places the player near the rail-depot cashout site, preserves camera-relative WASD, screenshots from the player camera, and validates the set-piece state.

## Result
- `publicSmokePlaceAtExtractionSetpiece` is guarded by the existing `publicSmoke` query.
- `proof:extraction-setpiece` validates:
  - mining happened before cashout proof,
  - player placement near `rail-depot-extract-01`,
  - ready cashout cue,
  - `goldrush-extraction-setpiece-v1`,
  - vertical silhouette,
  - smoke cue,
  - rail language,
  - cashout bell,
  - camera-relative player view.
- The renderer keeps depot wood, rail, bell, flag, and smoke material roles distinct instead of recoloring the whole set-piece as one generic marker.

## Remaining Gap
The rail-depot is now readable from proof distance, but still needs real imported or promoted asset geometry later. Until approval/promotion is complete, the procedural set-piece remains a validated protokit placeholder.
