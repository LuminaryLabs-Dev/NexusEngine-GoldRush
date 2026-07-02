# 021 Terrain intention map - Intent

Status: active
Domain: world
Owning kit candidate: `n:goldrush:authored-desert-map`

## Intent
Define the playable map spaces before any new terrain implementation.

## Boundary
- This packet is planning/audit only until implementation is explicitly allowed.
- It must not move runtime code, raw assets, sanitized assets, or public assets.
- It must stay scoped to terrain intention map and split if it starts owning another domain.

## Atomic Outcomes
- Name the owning domain.
- Name the kit or future kit.
- Define the minimal public data.
- Define the player-view acceptance test.
- Define the validation gate.

## Non-Completion Truth
If this is skipped, the team will keep improving a procedural field that has no authored gameplay intention.
