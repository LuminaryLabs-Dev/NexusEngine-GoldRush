# BUG-002: Central Mountain Scale And Camera Framing

## Status

Resolved locally.

## Player Feedback

The terrain and mountain composition is overwhelming the player view. The central mountain appears as a massive dark slab directly above or in front of the player instead of a readable obstacle to walk around.

## Human-Visible Failure

- The mountain blocks the sky and horizon.
- The terrain reads as a ceiling or floating overhang, not a natural canyon landmark.
- Route direction is unclear because the main silhouette consumes the frame.
- The player cannot tell whether the mountain is terrain, collision, background, or a render bug.

## Likely Technical Cause

- `CENTRAL_MOUNTAIN_FORMS` in `src/physics/terrainCollider.js` creates high central lifts near the player.
- `src/renderer/proceduralKits.js` also renders canyon/mountain landmark meshes, creating multiple large silhouettes in the same visual zone.
- The over-the-shoulder camera sits close enough that the mountain fills the frame before route context is visible.
- The terrain blocker rule is valid as gameplay, but the visual presentation needs more distance, slope readability, and route gap framing.

## Related Files

- `src/physics/terrainCollider.js`
- `src/renderer/proceduralKits.js`
- `src/content/goldrushEnvironmentSpace.js`
- `src/content/goldrushWorldElements.js`
- `src/content/goldrushCameraPerspectives.js`

## Acceptance Evidence

- Normal player-view screenshot shows the mountain as a midground obstacle with visible walkaround routes.
- The player can see sky, horizon, route floor, and at least one route cue at the same time.
- Camera proof includes spawn, approach, left detour, right detour, and near-mountain samples.

## Local Fix

- Moved central mountain forms farther into the midground while preserving the central blocker.
- Strengthened spawn, west, and east clearance corridors.
- Added `terrainFieldBaseHeight()` so renderer landmarks can mount to the base terrain instead of stacking visible meshes on top of the invisible collider summit.
- Lowered central mountain visual caps and narrowed visual footprints.
- Tightened validators so future passes must keep mountain visuals below collider lift and must use base-terrain placement.

## Latest Validator Evidence

```txt
node tools/validation/validate-goldrush-mountain-readability.mjs
status: goldrush-mountain-readability-ready
maxVisualHeight: 4.42
colliderLift: 9.2
view clearance: 0.82
west clearance: 0.764
east clearance: 0.746
```

## Remaining Human-View Check

Complete. Browser proof shows the central mountains as midground landmarks with visible sky, horizon, floor route, and walkaround cues.

```txt
screenshot: screenshots/mountain-readability-2026-06-30.png
report: reports/mountain-readability-2026-06-30.md
```
