# 017 - Movement Grounding Consumer Parity Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: control/physics

## Finding

camera and player pulse because movement owns different ground truth.

## Why It Matters

GoldRush can look like it is improving while the source fixture, consumer state, and player-view proof drift apart. This atom must keep the authored map source in control.

## Hardening

- Require fixture id and revision id in the owning kit snapshot.
- Require a negative validator case.
- Require one consumer proof for local player ground snapshot names fixture revision.
- Require stale-proof invalidation on revision change.
- Require a human-view or state-proof label that explains what player-facing behavior improved.

## Audit Question

Can this atom be marked ready without proving local player ground snapshot names fixture revision? If yes, the gate is too weak.
