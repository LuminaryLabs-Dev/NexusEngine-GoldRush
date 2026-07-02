# 011 - Mask Negative Fixture Cases Audit

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`

## Finding

The material and biome pass can fake completion if `maskNegativeCases` exists but consumers do not use it.

## Why It Matters

validation only checks that a mask exists and misses broken material or biome contracts.

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

Do not mark this micro-step resolved until validator fails missing masks, unknown tags, invalid weights, ambiguous dominant layers, and consumer tag drift and the validator catches the opposite failure.
