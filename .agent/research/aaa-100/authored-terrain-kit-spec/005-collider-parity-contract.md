# Collider Parity Contract

Status: active docs-only

## Purpose

Make physics and grounding consume the same authored terrain source as rendering and placement.

## Backend Boundary

Current local memory says cannon-es is the active static heightfield backend. Rapier remains a later backend candidate behind the same public physics API for stronger kinematic character control, but this spec is source-first and backend-neutral.

## Contract

| Check | Requirement | Proof |
| --- | --- | --- |
| height parity | collider sample and terrain source sample match within tolerance | CLI sample fixture and Playwright motion sample |
| render parity | visible mesh vertex height matches source sample at tested coordinates | screenshot plus sampled debug state |
| raycast parity | downward raycast returns source height and normal | CLI raycast fixture |
| blocker parity | mountains/blockers match visible obstacle intent | route-around proof |
| LOD parity | LOD change does not change collision height | motion/video proof |
| restart parity | reload produces same source hash and samples | deterministic fixture |

## Failure Labels

- floating-player
- sinking-player
- pulsing-ground
- collider-above-visible-mesh
- collider-below-visible-mesh
- lod-sample-swap
- wrong-coordinate-frame
- stale-source-revision

## Hard Rule

No terrain feature can move from active to resolved if the player can visibly stand on a different surface than the collider sample.
