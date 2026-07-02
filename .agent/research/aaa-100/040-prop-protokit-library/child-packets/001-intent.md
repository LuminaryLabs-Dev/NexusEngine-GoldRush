# 040 Prop protokit library - Intent

Status: active
Domain: content
Owning kit candidate: `n:goldrush:prop-protokit-library`

## Intent
Turn procedural and imported objects into stable domain-owned protokits instead of renderer-owned clutter.

## Boundary
- This packet is planning/audit only until implementation is explicitly allowed.
- It must not move runtime code, raw assets, sanitized assets, or public assets.
- It must stay scoped to prop protokit library and split if it starts owning another domain.

## Atomic Outcomes
- Name the owning domain.
- Name the kit or future kit.
- Define the minimal public data.
- Define the player-view acceptance test.
- Define the validation gate.

## Non-Completion Truth
If props stay as generic scatter, the map will look busy but not playable, readable, or maintainable.
