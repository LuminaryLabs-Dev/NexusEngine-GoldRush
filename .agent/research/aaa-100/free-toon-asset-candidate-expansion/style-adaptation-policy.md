# Toon Style Adaptation Policy

Status: active docs-only

## Purpose

Prevent free asset candidates from turning GoldRush into a mismatched collage. Every source candidate must be adapted into the same high-fidelity toon western direction before runtime promotion.

## Style Target

GoldRush should look like a polished toon-shaded western extraction game:

- large readable silhouettes.
- warm desert material bands.
- crisp shadow shapes.
- simple but intentional color grouping.
- character and object edges that read at over-the-shoulder distance.
- no debug-blue gaps, generic dark clutter, or unstyled primitive leftovers.

## Adaptation Requirements

| Requirement | Why it matters | Gate |
| --- | --- | --- |
| Shared palette | prevents pack-to-pack color mismatch | palette swatch record |
| Toon material conversion | keeps assets coherent with the terrain | material role snapshot |
| Scale normalization | keeps train, rocks, character, and town believable | transform proof |
| Pivot/origin cleanup | makes raycast placement and animation stable | placement proof |
| Collision role | distinguishes scenery, cover, blockers, and interaction props | collider contract |
| Silhouette audit | protects player readability at distance | screenshot proof |
| Performance budget | keeps 60-player target plausible | triangle/material/texture budget |
| Kit registration | stops renderer-only asset ownership | domain kit descriptor |

## Rejection Rules

- Reject assets that only look good in isolation.
- Reject assets that need a custom material system before the core game loop is stable.
- Reject assets that cannot be made readable from the player camera.
- Reject assets with unclear license or source evidence.
- Reject assets that duplicate an existing kit role without improving quality or clarity.

## First Toon Pass

```txt
import candidate for review
-> assign family palette
-> simplify material roles
-> normalize scale
-> generate thumbnail proof
-> place on terrain fixture
-> compare local/public screenshots
-> keep blocked until review approves runtime use
```

