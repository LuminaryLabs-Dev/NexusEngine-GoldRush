# Audio As World Information Gap

Status: active docs-only

ID: 006
Domain: audio/presentation/gameplay
Severity: high
Owner: n:audio:cue-state plus n:goldrush:music-and-stingers
Roadmap rows informed: 043, 044, 056, 060, 061, 071, 076, 096

## Reference Observation

Hunt treats sound as gameplay information: footsteps, gunshots, animals, and environmental cues tell players what is happening. GoldRush audio should communicate train, gold, cargo, threat, extraction, and results state.

## GoldRush Gap

GoldRush has semantic cue-state and procedural fallbacks, but actual audio assets are blocked pending approval and the sound language is not yet a full gameplay information layer.

## Kit Implications

- audio cue-state owns semantic events
- music/stingers kit owns phase transitions
- gameplay kits emit facts; audio presents them
- asset pipeline gates approved runtime audio

## Evidence Required Before Calling This Resolved

- cue matrix for train, mine, carry, threat, shot, cover, cashout, score, results
- browser proof that cues fire at the same moments as visual state
- approval plan for real audio promotion

## Edge Cases

- avoid sustained humming beds
- do not use raw legacy audio before approval
- do not let audio be decorative-only while the player needs feedback

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.
