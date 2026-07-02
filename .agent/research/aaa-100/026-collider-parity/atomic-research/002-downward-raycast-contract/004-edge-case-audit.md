# 026.002 Downward Raycast Contract - Edge Case Audit

Status: research-planned
Parent: 026 Collider parity
Atomic: 026.002 Downward Raycast Contract
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Edge-Case Audit

Define raycast-down semantics, maximum search height, ground normal output, and missing-ground behavior.

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
