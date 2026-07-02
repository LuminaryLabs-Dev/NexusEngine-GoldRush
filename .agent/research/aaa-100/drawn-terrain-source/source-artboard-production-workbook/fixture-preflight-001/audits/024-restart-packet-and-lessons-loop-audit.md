# 024 - Restart Packet And Lessons Loop Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: production

## Finding

new terrain knowledge is lost between passes.

## Why It Matters

GoldRush can look like it is improving while the source fixture, consumer state, and player-view proof drift apart. This atom must keep the authored map source in control.

## Hardening

- Require fixture id and revision id in the owning kit snapshot.
- Require a negative validator case.
- Require one consumer proof for source revision changes create a restart packet and update lesson only when behavior changes.
- Require stale-proof invalidation on revision change.
- Require a human-view or state-proof label that explains what player-facing behavior improved.

## Audit Question

Can this atom be marked ready without proving source revision changes create a restart packet and update lesson only when behavior changes? If yes, the gate is too weak.
