# Emit Handoff Payload

Status: active docs-only

Interaction ID: 009-06
Family: Train Departure
Domain: scene/camera/audio
Owner: n:scene:transition plus n:goldrush:train-loading

## Player Micro-Action

emit handoff payload

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

Event: goldrushMinuteInteraction00906Observed

Snapshot should expose action availability, action owner, player-facing feedback, proof scenario, and unresolved caveats without local paths or debug-only labels.

## Proof Requirement

A future implementation can mark this interaction resolved only with the closest validator and human-view proof when the action is player-facing. Public proof is required if the interaction is claimed on the deployed Build branch.

## Research Pair

- research/009-06-train-departure-emit-handoff-payload-research.md

## Stop Condition

Stop if this interaction depends on a hidden helper, unapproved asset, renderer-owned gameplay rule, stale proof, or a control path that the player cannot perform naturally.
