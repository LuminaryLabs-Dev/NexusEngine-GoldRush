# 024 LOD ring contract - Intent

Status: active
Domain: world/render
Owning kit candidate: `n:render:terrain-lod-rings`

## Intent
Define how massive terrain stays performant without visible popping or collider mismatch.

## Boundary
- This packet is planning/audit only until implementation is explicitly allowed.
- It must not move runtime code, raw assets, sanitized assets, or public assets.
- It must stay scoped to lod ring contract and split if it starts owning another domain.

## Atomic Outcomes
- Name the owning domain.
- Name the kit or future kit.
- Define the minimal public data.
- Define the player-view acceptance test.
- Define the validation gate.

## Non-Completion Truth
If LOD is undefined, the map will either be too small or too expensive to support 60-player staging.
