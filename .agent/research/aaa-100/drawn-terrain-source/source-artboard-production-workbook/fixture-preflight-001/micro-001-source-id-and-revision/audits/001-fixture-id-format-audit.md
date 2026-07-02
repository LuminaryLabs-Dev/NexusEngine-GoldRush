# 001 - Fixture Id Format Audit

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Finding

fixture identity becomes a loose label instead of a stable source contract.

## Impact

The terrain source can appear valid while consumers or proof artifacts point at another source state. That undermines renderer, collider, placement, gameplay, and public proof trust.

## Hardening

- Require fixture id and revision id in snapshots.
- Require a negative validator case.
- Require a consumer echo before widening scope.
- Require stale-proof invalidation on revision change.
- Require a restart note when the source identity contract changes.

## Audit Question

Can this micro-step pass without proving validator rejects ids outside goldrush.desert.artboard.fixture.*? If yes, the gate is too weak.
