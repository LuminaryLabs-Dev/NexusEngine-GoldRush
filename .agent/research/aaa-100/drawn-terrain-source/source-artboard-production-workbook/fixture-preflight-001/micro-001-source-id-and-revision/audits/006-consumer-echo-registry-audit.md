# 006 - Consumer Echo Registry Audit

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Finding

one consumer can silently stay on old terrain math.

## Impact

The terrain source can appear valid while consumers or proof artifacts point at another source state. That undermines renderer, collider, placement, gameplay, and public proof trust.

## Hardening

- Require fixture id and revision id in snapshots.
- Require a negative validator case.
- Require a consumer echo before widening scope.
- Require stale-proof invalidation on revision change.
- Require a restart note when the source identity contract changes.

## Audit Question

Can this micro-step pass without proving render, collider, movement, placement, gameplay, proof list fixtureId and revisionId? If yes, the gate is too weak.
