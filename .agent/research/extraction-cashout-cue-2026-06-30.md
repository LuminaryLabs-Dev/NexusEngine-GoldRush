# Extraction Cashout Cue

Status: active

## Scope

Domain: `n:render:micro-object-instancing`

Owning contract: `goldrush-extraction-cashout-cue-v1`

## Research Inputs

- Game Accessibility Guidelines: make objectives and interaction feedback perceivable through clear visual/audio state.
- Nielsen Norman Group, visibility of system status: systems should keep users informed about what is happening.
- Nielsen Norman Group, visual hierarchy and proximity: nearby related signals should group clearly and make the next action easier to parse.

## Gap

Mining now has selected-object affordance cues and readable resource forms, but extraction previously read mostly as a generic zone marker. For an extraction game, the cashout destination needs the same kind of player-readable state: where to go, whether it is ready, whether it is contested, whether it is locked down, and whether the player should hold to finish.

## Decision

Keep extraction/cashout rules in `n:gameplay:extraction` and the GoldRush `n:goldrush:cashout-sites` kit. Add only renderer-owned presentation under `n:render:micro-object-instancing`.

## Implemented Contract

`goldrush-extraction-cashout-cue-v1` exposes:

- `visibleCueCount`
- `readyCount`
- `contestedCount`
- `lockdownCount`
- `activeMarkerId`
- primary marker status
- primary progress
- contest status
- interrupt risk
- next player action

## Human-View Result

The player-view proof now shows a diegetic cashout beacon/zone and the runtime snapshot proves it is guiding the post-mining next action to `route-to-cashout`.

## Remaining AAA Gap

The cue is a functional renderer proof, not final extraction art. The next high-value pass should make the rail-depot extraction site read as a destination set piece with stronger silhouette, smoke/bell language, rail alignment, and clearer distance framing.
