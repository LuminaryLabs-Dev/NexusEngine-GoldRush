# Authored Terrain Proof And Deploy Plan

Status: active docs-only

## Purpose

Define how future authored-terrain implementation must be proven before it can support AAA claims.

## Proof Levels

| Level | Proof | Required for |
| --- | --- | --- |
| CLI fixture | source load, sample, masks, chunk seams, raycast | any source contract change |
| renderer proof | nonblank terrain, LOD bands, landmark silhouettes | visible terrain changes |
| physics proof | collider/raycast/grounding parity | movement or collision changes |
| natural player proof | walk, rotate camera, approach gold/extraction | player-facing terrain claims |
| motion video | pulsing, LOD transition, camera conflict | motion-sensitive fixes |
| simulator proof | 20/50/60 participant zone and snapshot load | multiplayer scale claims |
| public proof | Pages URL, Build branch, smoke report | deploy or public-link claims |
| sanitizer proof | no local paths, account names, raw paths, secret-like values | retained docs/reports |

## Public Deploy Risk Checks

- The Build branch may lag behind development.
- Static base paths may break chunk or asset loads.
- Browser precision may expose seams hidden locally.
- Cached Pages assets may serve stale source revisions.
- Heavy terrain chunks can exceed public browser budgets.
- Proof-only helpers can accidentally pass a natural-play claim.

## Completion Rule

No authored terrain claim is complete until the proof level matches the risk level and the report states exactly what was covered.
