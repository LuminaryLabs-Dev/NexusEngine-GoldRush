# Bot Fill Reward Boundary - Failure Modes

Status: planned docs-only
System: 09
Domain: staging/progression/network

## Main Fakeout

A 60-player bot simulation can be misread as live multiplayer readiness.

## Edge Cases

- duplicate reward event.
- ineligible mode tries to grant progression.
- player disconnects while carrying value.
- party member joins/leaves after reward eligibility is decided.
- public build runs stale tuning.
- result screen truncates or hides why reward changed.
- future imported assets alter perceived value without changing economy data.

## Hardening

- require source receipts.
- require mode eligibility.
- require explicit reset semantics.
- require local/public proof when user-facing.
- record tuning version and release version.
