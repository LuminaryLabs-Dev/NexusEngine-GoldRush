# 009 - Cover And Pressure Annotation Contract Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: combat/world

## Finding

combat pressure spawns without readable counterplay.

## Why It Matters

GoldRush can look like it is improving while the source fixture, consumer state, and player-view proof drift apart. This atom must keep the authored map source in control.

## Hardening

- Require fixture id and revision id in the owning kit snapshot.
- Require a negative validator case.
- Require one consumer proof for combat proof can name source cover and pressure ids.
- Require stale-proof invalidation on revision change.
- Require a human-view or state-proof label that explains what player-facing behavior improved.

## Audit Question

Can this atom be marked ready without proving combat proof can name source cover and pressure ids? If yes, the gate is too weak.
