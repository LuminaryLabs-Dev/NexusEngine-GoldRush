# Mountain Readability Proof

Status: passed
Date: 2026-06-30

## Purpose

Verify `BUG-002` no longer shows the central mountain as a foreground ceiling/slab over the player.

## Changed Domain

```txt
domain: terrain/readability
owning kit: n:goldrush:world-readability
implementation files:
  - src/physics/terrainCollider.js
  - src/renderer/proceduralKits.js
  - tools/validation/validate-goldrush-mountain-readability.mjs
```

## Validator Evidence

```txt
node tools/validation/validate-goldrush-mountain-readability.mjs
status: goldrush-mountain-readability-ready
maxVisualHeight: 4.42
view clearance: 0.82
west clearance: 0.764
east clearance: 0.746
coreHeight: 9.013
coreBaseHeight: -0.187
colliderLift: 9.2
```

## Browser Evidence

```txt
live-test flow: goldrush-first-sequence
source screenshot: output/live-test-it/2026-06-30T10-36-37-132Z/final.png
retained screenshot: screenshots/mountain-readability-2026-06-30.png
```

Human-view result:

- The mountain reads as a midground obstacle instead of an overhead slab.
- Sky and far horizon are visible above the central forms.
- The player can see floor, route cues, left/right space, and landmarks at the same time.
- The central collider still blocks direct traversal through the mountain core.

## Remaining Terrain Debt

- Continue improving landmark hierarchy, route affordances, and prop readability.
- Do not reopen the old ceiling/slab issue unless a new screenshot shows the mountain again mounted above the player.

