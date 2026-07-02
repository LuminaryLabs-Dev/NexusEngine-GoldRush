# 005 - Material And Biome Mask Contract Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio

## Finding

terrain looks varied but gameplay and audio ignore surface identity.

## Why It Matters

GoldRush can look like it is improving while the source fixture, consumer state, and player-view proof drift apart. This atom must keep the authored map source in control.

## Hardening

- Require fixture id and revision id in the owning kit snapshot.
- Require a negative validator case.
- Require one consumer proof for render, audio, VFX, and placement can name material and biome tags.
- Require stale-proof invalidation on revision change.
- Require a human-view or state-proof label that explains what player-facing behavior improved.

## Audit Question

Can this atom be marked ready without proving render, audio, VFX, and placement can name material and biome tags? If yes, the gate is too weak.
