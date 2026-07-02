# 023 Height/mask data model - Intent

Status: active
Domain: world
Owning kit candidate: `n:goldrush:terrain-mask-data`

## Intent
Make visual terrain, collider, object placement, routes, gold, and extraction share one source.

## Boundary
- This packet is planning/audit only until implementation is explicitly allowed.
- It must not move runtime code, raw assets, sanitized assets, or public assets.
- It must stay scoped to height/mask data model and split if it starts owning another domain.

## Atomic Outcomes
- Name the owning domain.
- Name the kit or future kit.
- Define the minimal public data.
- Define the player-view acceptance test.
- Define the validation gate.

## Non-Completion Truth
If masks diverge, players will see objects under terrain, blocked routes, fake cover, and mismatched extraction cues.
