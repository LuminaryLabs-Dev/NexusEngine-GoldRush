# Authoring Purpose

Status: active docs-only
Domain: world / production
Future kit: `n:world:authored-terrain-mesh`

## Purpose

The first authored terrain fixture exists to prove that a drawn desert map source can drive every terrain-dependent system before the project spends time on high-fidelity asset polish.

## Player-Facing Goal

The player should eventually feel that the desert is a real place:

- a readable wash floor to follow
- ridge and mesa silhouettes for orientation
- a mine shelf that explains where gold comes from
- a town or camp shelf that creates social/cover space
- an extraction route that is visible under pressure
- terrain that supports movement instead of fighting the controls

## Production Goal

The fixture is intentionally small. It should answer:

- Can one source revision feed renderer, collider, masks, anchors, and proof?
- Can the source express scale before the full map exists?
- Can authored masks replace ad hoc object scatter?
- Can validators catch source drift before Playwright screenshots?
- Can the future public build prove the same source revision as local?

## Stop Condition

Stop if the first terrain work tries to look final before source ownership is proven.

