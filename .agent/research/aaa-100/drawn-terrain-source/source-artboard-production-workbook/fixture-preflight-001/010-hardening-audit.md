# Hardening Audit

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Prevent fake progress when the terrain source fixture is later implemented.

## Findings To Harden

| Risk | Why it matters | Hardening requirement |
| --- | --- | --- |
| Bigger map fakeout | Scale can hide weak composition. | Fixture must prove route, objective, cover, cashout, and horizon readability. |
| Density fakeout | More rocks and plants can still be random clutter. | Asset anchors must be source-owned and raycast placed. |
| Renderer fakeout | A pretty mesh can diverge from physics. | Collider parity must compare shared source samples. |
| Physics fakeout | A collider can pass while visible terrain looks wrong. | Human-view proof must show grounded player and terrain continuity. |
| LOD fakeout | A chunk system can work technically but pop or seam. | Proof must inspect near, mid, far, and horizon roles. |
| Gameplay fakeout | Receipts can work with hardcoded points. | Mine, gold, cover, and cashout must come from annotations. |
| Proof fakeout | Nonblank screenshots can miss player intent. | Screenshots must label next player action and failure state. |
| Restart fakeout | New source data can leave stale caches. | Revision change must force consumer rebuild and proof invalidation. |

## Audit Questions

- Can every consumer name the same fixture id?
- Can every consumer name the same revision id?
- Can the player tell where to go within three seconds?
- Can the player tell what is walkable and what blocks them?
- Can the player see why the mine, gold, cover, and cashout are in those places?
- Can local proof and public proof disagree without being caught?

## Stop Condition

Stop if the future implementation can be described as "better terrain" without naming the source field, consumer, proof artifact, and player-facing improvement.
