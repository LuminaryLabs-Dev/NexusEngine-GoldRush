# World Terrain Camera Feedback

Status: active

## Purpose

Preserve user corrections about world shape, terrain, physics, grounding, and camera.

## Feedback

- Not a circular arena.
- The world should be a massive western terrain with many small tessellated patches.
- Terrain should read as a playable space, not as a copied reference image.
- Mountains, rocks, towns, gold zones, paths, lowland floor, rail, and cashout routes should explain the environment.
- Terrain collider and visible terrain must agree.
- Objects should be placed by downward raycasting.
- Use `cannon-es` now for current static heightfield reliability; keep Rapier as a future adapter after the current loop is stable.
- Camera must be over the shoulder of the character.
- Mouse look controls camera direction.
- WASD movement follows camera direction.
- Runtime camera motion should have one authority, reset/reconfigure on scene transitions, and not conflict with player follow.

## Required Proof

- Screenshot shows player grounded on visible terrain.
- Runtime state reports downward terrain raycast placement and active physics backend.
- Camera proof shows one authority, stable pose, camera-relative WASD, and mouse-look input.
- Public and local screenshots are both retained.
