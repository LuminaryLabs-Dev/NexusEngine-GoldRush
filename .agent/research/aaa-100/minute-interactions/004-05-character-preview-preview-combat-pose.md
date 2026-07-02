# Preview Combat Pose

Status: active docs-only

Interaction ID: 004-05
Family: Character Preview
Domain: presentation/character
Owner: n:render:character-preview plus n:goldrush:prospector-animation

## Player Micro-Action

preview combat pose

## Why It Matters

This is a minute interaction in the final title -> lobby -> train -> gold field -> mine -> carry -> pressure -> cashout -> results loop. It should feel deliberate to the player and should be owned by a kit, not hidden in renderer or proof helper code.

## Data Contract Seed

- interaction id
- owning kit domain path
- input or trigger source
- visible feedback state
- audio cue state when applicable
- receipt or snapshot delta when applicable

## Event And Snapshot Seed

Event: goldrushMinuteInteraction00405Observed

Snapshot should expose action availability, action owner, player-facing feedback, proof scenario, and unresolved caveats without local paths or debug-only labels.

## Proof Requirement

A future implementation can mark this interaction resolved only with the closest validator and human-view proof when the action is player-facing. Public proof is required if the interaction is claimed on the deployed Build branch.

## Research Pair

- research/004-05-character-preview-preview-combat-pose-research.md

## Stop Condition

Stop if this interaction depends on a hidden helper, unapproved asset, renderer-owned gameplay rule, stale proof, or a control path that the player cannot perform naturally.
