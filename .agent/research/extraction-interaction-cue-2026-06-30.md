# Extraction Interaction Cue Research - 2026-06-30

## Question
The rail-depot set-piece is visible, but the player still needs clear in-world feedback that they are in the cashout volume, should hold, and are making progress while risk rises.

## Domain Decision
- Owner domain: `n:render:micro-object-instancing`.
- New contract: `goldrush-extraction-interaction-cue-v1`.
- Inputs: `n:gameplay:extraction`, `goldrush-extraction-cashout-cue-v1`, and `goldrush-extraction-setpiece-v1`.
- Outputs: in-range state, active hold state, normalized progress, interrupt risk, prompt visibility, hold-progress visibility, and next player action.

## Sources
- Game Accessibility Guidelines: key gameplay information should be perceivable and distinguishable while playing.
  https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, visibility of system status: users need visible feedback on current state and system progress.
  https://www.nngroup.com/articles/visibility-system-status/
- Nielsen Norman Group, proximity principle: related visual parts should be grouped so they read as one object.
  https://www.nngroup.com/articles/gestalt-proximity/

## Applied Rule
Cashout progress is gameplay-owned, but cashout readability is renderer-owned. The renderer may add a depot-local prompt/progress bar only by consuming extraction state. It must not calculate extraction completion, payout, contest, or results.

## Acceptance
- The renderer snapshot exposes `extractionInteractionCue.contract === "goldrush-extraction-interaction-cue-v1"`.
- `proof:extraction-setpiece` mines gold, moves to the depot, starts cashout, and proves:
  - active cashout marker,
  - in-range player state,
  - hold progress greater than zero,
  - next action `keep-holding-cashout`,
  - camera-relative player view still intact.

## Remaining Gap
The cue is still procedural. Later, approved/promoted assets should replace the placeholder geometry with a better cashout device, signage, animation, and sound, while preserving this contract.
