# 020 - Reset And Cache Invalidation Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/versioning

## Finding

new source data mixes with old derived state.

## Why It Matters

GoldRush can look like it is improving while the source fixture, consumer state, and player-view proof drift apart. This atom must keep the authored map source in control.

## Hardening

- Require fixture id and revision id in the owning kit snapshot.
- Require a negative validator case.
- Require one consumer proof for revision change invalidates render, physics, placement, gameplay, and proof caches.
- Require stale-proof invalidation on revision change.
- Require a human-view or state-proof label that explains what player-facing behavior improved.

## Audit Question

Can this atom be marked ready without proving revision change invalidates render, physics, placement, gameplay, and proof caches? If yes, the gate is too weak.
