# 008 - Audio Vfx Surface Consumer Parity Audit

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`

## Finding

The material and biome pass can fake completion if `audioVfxSurfaceEcho` exists but consumers do not use it.

## Why It Matters

footstep, mining, dust, hit, and ambience cues stay generic even when the terrain visually changes.

## Long-Term Impact

- Terrain art can look denser while player actions, cues, placement, and route readability stay generic.
- Audio, VFX, mining, cover, and extraction feedback can drift from the authored ground identity.
- Public proof can pass screenshots while state proof cannot name the surface or biome that made the action readable.

## Hardening

- Require source fixture or query schema proof.
- Require negative validator proof.
- Require at least one render/audio/VFX/placement/gameplay consumer echo.
- Require stale-proof behavior after source material or biome changes.
- Require human-view or state proof that can compare source tags, rendered material, cue selection, and placement decisions when this becomes runtime work.

## Audit Rewrite

Do not mark this micro-step resolved until audio and VFX cue descriptors can name source material and biome tags for proof points and the validator catches the opposite failure.
