# Authored Terrain Readiness Gate Matrix

Status: active docs-only

## Purpose

Define gates that must pass before the authored terrain effort moves from documentation into runtime implementation.

| Gate | Required evidence | Blocks |
| --- | --- | --- |
| source contract | generic and GoldRush kit contracts reviewed | broad terrain rewrite |
| scale contract | world bounds, sample spacing, and chunk grid named | map too small or fake scale |
| source schema | height, normal, slope, masks, anchors defined | separate terrain algorithms |
| LOD contract | near/mid/far bands and seam tolerance named | popping and chunk gaps |
| collider parity | height/raycast/collider proof design named | floating, sinking, pulsing |
| placement contract | mask plus raycast receipt required | floating props and unreachable zones |
| gameplay zones | spawn, gold, town, cover, extraction, final rush descriptors named | circles with no game meaning |
| consumer flow | render, physics, control, gameplay, match consumers named | renderer-owned hidden logic |
| proof plan | CLI, Playwright, video, public, and sanitizer proof named | fake resolved state |
| restart plan | source revision hash and rollback path named | stale terrain after restart |

## Completion Rule

This matrix is not resolved until future implementation proves each gate with current code and current player-view or public proof.
