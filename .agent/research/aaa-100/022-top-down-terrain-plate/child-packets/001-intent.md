# 022 Top-down terrain plate - Intent

Status: active
Domain: world
Owning kit candidate: `n:goldrush:authored-desert-map-source`

## Intent
Define the drawn source format, scale, and coordinate system for the whole desert field.

## Boundary
- This packet is planning/audit only until implementation is explicitly allowed.
- It must not move runtime code, raw assets, sanitized assets, or public assets.
- It must stay scoped to top-down terrain plate and split if it starts owning another domain.

## Atomic Outcomes
- Name the owning domain.
- Name the kit or future kit.
- Define the minimal public data.
- Define the player-view acceptance test.
- Define the validation gate.

## Non-Completion Truth
If scale/origin/resolution are vague, every downstream kit will invent its own coordinate assumptions.
