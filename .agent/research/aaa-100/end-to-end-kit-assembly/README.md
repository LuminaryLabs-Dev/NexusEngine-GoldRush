# End To End Kit Assembly Runway

Status: active docs-only
Date: 2026-07-01
Domain: runtime / scene / world / control / gameplay / combat / network / validation

## Purpose

Map the final GoldRush title-to-results game loop into concrete kit assembly slices. This is the missing bridge between the 100-step roadmap, minute interactions, terrain source work, asset promotion gates, and future implementation passes.

## Core Shape

```txt
title
-> party lobby
-> train loading yard
-> gold field spawn
-> move and ground
-> discover resource
-> mine
-> carry cargo
-> trigger pressure
-> route to cover
-> cash out
-> score
-> results
-> restart or public proof
```

Each slice names the generic reusable kit, the GoldRush custom kit, the site that uses it, the event it emits, the snapshot it exposes, the validator seed, and the player-facing fakeout it must prevent.

## Counts

- Assembly slices: 20
- Packet types per slice: 4
- Slice packets: 80
- Paired research notes: 80

## Files

- `assembly-matrix.md`
- `assembly-research-matrix.md`
- `scene-site-kit-stack.md`
- `event-flow-spine.md`
- `validator-proof-plan.md`
- `fakeout-register.md`
- `kit-gap-register.md`
- `slices/`
- `research/`

## Use Rule

When implementation mode resumes, do not start from a broad feature label. Pick the matching assembly slice, read its contract/data/event/proof packets and paired research, then implement the smallest local kit or adapter that moves that slice toward proof.

