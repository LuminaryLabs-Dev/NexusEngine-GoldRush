# 011 - Reset And Stale Proof Flags Audit

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Finding

old proof is reused after source changes.

## Impact

The terrain source can appear valid while consumers or proof artifacts point at another source state. That undermines renderer, collider, placement, gameplay, and public proof trust.

## Hardening

- Require fixture id and revision id in snapshots.
- Require a negative validator case.
- Require a consumer echo before widening scope.
- Require stale-proof invalidation on revision change.
- Require a restart note when the source identity contract changes.

## Audit Question

Can this micro-step pass without proving revision changes mark render, collider, placement, gameplay, local proof, and public proof stale? If yes, the gate is too weak.
