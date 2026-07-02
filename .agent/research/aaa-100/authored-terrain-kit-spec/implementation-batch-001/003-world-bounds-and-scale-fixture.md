# World Bounds And Scale Fixture

Status: active docs-only

Packet: 003
Domain: world
Target kit: n:world:authored-terrain-mesh
Roadmap atoms: 021, 022

## Purpose

Lock the terrain into a named playable scale before drawing meshes, LOD bands, route corridors, or combat spaces.

## Why This Prevents Plateau

A map that is merely bigger still plateaus if its scale is not authored around travel time, sightlines, extraction risk, and squad spacing.

## Data Exposed

- metersPerUnit
- worldWidth
- worldDepth
- playableBounds
- softBounds
- combatInteriorBounds
- safeSpawnBands

## Public API Shape

- getWorldBounds()
- clampToPlayableBounds(point)
- classifyWorldRegion(point)

## Events And Snapshot

- worldBoundsLoaded
- pointOutsideSoftBounds
- worldScaleRejected

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI checks nonzero bounds and playable area
- human-view proof captures horizon, midground, and near-ground scale
- movement proof confirms travel scale is not tiny

## Edge Cases And Stop Conditions

- Do not use camera zoom to fake map size.
- Do not let prop scatter extend outside playable bounds.
- Stop if extraction, spawn, and gold zones cannot be placed inside the same bounds.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
