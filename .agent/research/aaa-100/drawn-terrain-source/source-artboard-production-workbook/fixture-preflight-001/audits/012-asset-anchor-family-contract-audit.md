# 012 - Asset Anchor Family Contract Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: content/world

## Finding

procedural objects remain scatter instead of kit-owned map content.

## Why It Matters

GoldRush can look like it is improving while the source fixture, consumer state, and player-view proof drift apart. This atom must keep the authored map source in control.

## Hardening

- Require fixture id and revision id in the owning kit snapshot.
- Require a negative validator case.
- Require one consumer proof for first prop placement reports anchor id and raycast hit.
- Require stale-proof invalidation on revision change.
- Require a human-view or state-proof label that explains what player-facing behavior improved.

## Audit Question

Can this atom be marked ready without proving first prop placement reports anchor id and raycast hit? If yes, the gate is too weak.
