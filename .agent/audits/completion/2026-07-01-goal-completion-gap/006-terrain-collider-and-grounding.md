# Terrain Collider And Grounding

Status: active docs-only

Requirement ID: 006
Domain: physics/control/world
Owner: n:physics:collider plus n:world:terrain-raycast
Current status: partial

## Current Evidence

Lessons matrix says collider/raycast proof exists, but authored map readability still needs a shared source.

## Why This Is Not Complete Yet

Collider/raycast proof for current terrain is not enough once authored terrain source, LOD, and chunking replace the terrain basis.

## Evidence Required To Close

- collider parity validator samples authored terrain source
- movement proof crosses slopes, roads, ridges, and extraction sites
- no floating, sinking, or render/collider mismatch in local/public proof

## Completion Rule

Do not mark this requirement complete from intent, a narrow validator, or a stale proof report. It needs current authoritative evidence matching the full requirement scope.

## Implementation Boundary

This is an audit packet only. It does not authorize runtime changes under the current docs-only boundary.
