# 023 Height/mask data model - Edge Cases

Status: active
Domain: world

## Edge Cases
- Bad or missing source data.
- Restart from a partially completed packet.
- Public build differs from local build.
- Proof validates a narrow state but is described as broad readiness.
- Generated or imported content exceeds browser budgets.
- Another domain starts depending on private details from this kit.
- Renderer presentation drifts away from gameplay, physics, or network state.

## Hardening Rule
If an edge case requires another owner, create or update that owner packet instead of expanding this packet beyond its domain.
