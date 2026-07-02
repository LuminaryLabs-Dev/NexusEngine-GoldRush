# Source Fixture File Layout

Status: active docs-only

Packet: 001
Domain: world
Target kit: n:world:authored-terrain-mesh
Roadmap atoms: 021, 022, 023

## Purpose

Define the smallest authored terrain fixture folder that render, physics, placement, and gameplay can all read without importing each other.

## Why This Prevents Plateau

The current map can gain more objects while still feeling flat because there is no durable source asset that owns terrain identity.

## Data Exposed

- manifest id and revision
- world bounds and scale
- height grid reference
- mask stack reference
- chunk index reference
- validation fixture references

## Public API Shape

- loadSourceFixture(fixtureId)
- getFixtureManifest()
- getSourceRevision()
- listAvailableLayers()

## Events And Snapshot

- terrainFixtureLoaded
- terrainFixtureRejected
- terrainSourceRevisionChanged

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI validates required files and schema versions
- CLI rejects missing height, mask, or chunk references
- human-view proof records which fixture rendered

## Edge Cases And Stop Conditions

- Never let renderer-only defaults invent missing terrain data.
- Never allow GoldRush-specific naming inside the neutral source fixture.
- Stop if two consumers need different terrain fixture formats.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.
