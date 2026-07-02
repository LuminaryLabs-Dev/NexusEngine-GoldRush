# Raycast Placement Data Implementation Simulation

Status: active docs-only
Atom: 07-02

## Simulated Pass

A future implementation adds raycast-placement / data to the terrain source stack. The first version works locally because one consumer reads the new field, but the broader map still risks plateauing if the other consumers keep their old local assumptions.

## Likely Failure

- Renderer accepts the data but collider does not.
- Collider accepts the data but placement anchors drift.
- Placement works but player routes and combat/cashout masks still ignore it.
- Local proof passes but public proof does not name the same source revision.

## Required Recovery

Stop the pass, record the mismatch, and reduce scope to one fixture until source, renderer, collider, placement, gameplay, and proof all agree.

## Success Signal

The atom becomes useful when it reduces hidden local terrain logic and makes the large map more authored from the player's view.
