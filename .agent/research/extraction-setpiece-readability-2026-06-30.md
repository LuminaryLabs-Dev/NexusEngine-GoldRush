# Extraction Setpiece Readability Research - 2026-06-30

## Question
The rail-depot extraction point already has cashout state, but it still risks reading as a small functional marker. The game needs a destination set piece that players can recognize while moving, carrying gold, and dealing with pressure.

## Domain Decision
- Owner domain: `n:render:micro-object-instancing`.
- New contract: `goldrush-extraction-setpiece-v1`.
- Inputs: `n:gameplay:extraction` world markers plus `goldrush-extraction-cashout-cue-v1`.
- Output: serializable proof that the visible extraction site has a rail-depot landmark role, vertical silhouette, smoke cue, rail language, bell cue, terrain-grounded placement, and preserved next action.

## Sources
- Game Accessibility Guidelines: make information easy to see and distinguish during play.
  https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, visibility of system status: interfaces should clearly show current state and next feedback.
  https://www.nngroup.com/articles/visibility-system-status/
- Nielsen Norman Group, proximity principle: related visual elements should be spatially grouped so users understand the object as one meaningful unit.
  https://www.nngroup.com/articles/gestalt-proximity/

## Applied Rule
Do not add a detached objective marker system. The extraction site is a renderer-owned set piece that composes existing extraction state and cashout cue state. If this grows too large, split it into smaller renderer protokits such as depot arch, smoke stack, cashout bell, and rail platform, but keep them under the same domain contract until there is a reason to promote them.

## Acceptance
- Browser state exposes `renderer.procedural.gameplay.extractionLoopMarkers.extractionSetpiece`.
- The contract is `goldrush-extraction-setpiece-v1`.
- It composes `n:gameplay:extraction` and `goldrush-extraction-cashout-cue-v1`.
- It proves at least one visible rail-depot cashout landmark.
- It preserves the same next action as the cashout cue.
