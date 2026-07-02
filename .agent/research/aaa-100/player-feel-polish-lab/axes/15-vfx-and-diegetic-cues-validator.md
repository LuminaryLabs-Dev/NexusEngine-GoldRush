# VFX And Diegetic Cues - Validator

Status: planned docs-only
Axis: 15
Domain: render/gameplay/audio

## Validator Target

Screenshot proof verifies one primary cue, limited secondary cues, no clutter flood, and no debug-only dependency.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
