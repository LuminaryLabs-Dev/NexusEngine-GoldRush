# Risk Reward Tiers - Failure Modes

Status: planned docs-only
System: 05
Domain: gameplay/balance/world

## Main Fakeout

A high-value marker without danger becomes a shopping list, not extraction gameplay.

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
