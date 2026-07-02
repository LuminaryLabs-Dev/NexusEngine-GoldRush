# 026 Collider parity - Intent

Status: active
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Intent
Ensure the drawn terrain, visible mesh, raycast placement, and physics heightfield always agree.

## Boundary
- This packet is planning/audit only until implementation is explicitly allowed.
- It must not move runtime code, raw assets, sanitized assets, or public assets.
- It must stay scoped to collider parity and split if it starts owning another domain.

## Atomic Outcomes
- Name the owning domain.
- Name the kit or future kit.
- Define the minimal public data.
- Define the player-view acceptance test.
- Define the validation gate.

## Non-Completion Truth
If parity is weak, every later interaction proof becomes suspect because the character cannot trust the world.
