# Character Rig Body Readability - Validator

Status: planned docs-only
Axis: 05
Domain: character/render

## Validator Target

Static and motion screenshots prove knees, arms, carried cargo, hat, tool, and body orientation are visible.

## Required Evidence

- event stream shows expected events.
- snapshot is serializable.
- reset returns the kit to clean state.
- local proof captures player-facing evidence.
- public proof confirms the deployed page matches local behavior.

## Stop Condition

Do not mark this axis resolved if proof uses hidden placement helpers, direct completion helpers, debug-only overlays, or state assertions without human-view evidence.
