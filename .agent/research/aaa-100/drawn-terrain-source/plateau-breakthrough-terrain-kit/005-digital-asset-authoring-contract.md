# Digital Asset Authoring Contract

Status: active docs-only

## Purpose

Make digital assets part of the map source, not random decoration.

## Required Asset Families

- mesa and ridge silhouettes
- canyon rocks and boulders
- desert plants and scrub
- mine entrances and supports
- rail and train corridor props
- town shelf buildings
- camp and frontier objects
- gold seams, ore, tailings, pans, crates
- extraction depot landmarks
- cover and combat readability objects
- dust, smoke, sparkle, cashout, and route cues

## Protokit Rule

Each meaningful asset family must become a local GoldRush protokit descriptor before it becomes routine content. Renderer batching is allowed, but renderer code must consume protokit descriptors instead of owning placement rules.

## Placement Rule

Assets must land through source anchors or raycast placement against source-derived terrain. Manual one-off positions are allowed only inside the source fixture, never as hidden renderer state.
