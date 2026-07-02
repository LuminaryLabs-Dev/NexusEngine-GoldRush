# 024.008 Collision Lod Boundary - Edge Case Audit

Status: research-planned
Parent: 024 LOD ring contract
Atomic: 024.008 Collision Lod Boundary
Domain: world/render
Owning kit candidate: `n:render:terrain-lod-rings`

## Edge-Case Audit

Separate visual LOD from physics LOD so the player never walks on far visual-only terrain.

## Likely Failure Modes

- Source revision changes but derived cache does not reset.
- Renderer consumes a visual approximation that no longer matches physics or gameplay masks.
- Public Pages proof runs stale data compared with local proof.
- A single-player proof is mislabeled as 60-player readiness.
- The concern is hidden behind debug state instead of being readable in the player view.
- The implementation leaks local paths, raw import folders, or unapproved asset paths into reports.

## Hardening Questions

- What is the one invariant that catches this failure early?
- Which kit is allowed to own that invariant?
- What screenshot or report would prove a real player can perceive the result?
- What should fail loudly before deploy?

## Audit Gate

Do not mark the parent packet resolved until this concern has a validator, a restart rule, and a human-view proof if it affects what the player sees or does.
