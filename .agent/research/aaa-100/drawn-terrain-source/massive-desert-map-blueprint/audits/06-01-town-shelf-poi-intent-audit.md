# Town Shelf POI - Intent Hardening Audit

Status: active docs-only
Domain: world / content / combat
Generic kit: `n:world:zone-mask`
GoldRush kit: `n:goldrush:frontier-town-protokits`
Related atom: `atomic/06-01-town-shelf-poi-intent.md`
Related simulation: `simulations/06-01-town-shelf-poi-intent-simulation.md`

## Intention

Harden the player-facing purpose and ownership decision for town shelf footprint, cover pockets, clutter anchors, and optional route identity so future implementation advances GoldRush toward a high-fidelity wild-west extraction battle royale instead of creating another narrow terrain proof.

## Architecture Boundary

- source data owns terrain truth
- generic kit owns reusable mechanics
- GoldRush kit owns game rules and western extraction semantics
- renderer consumes snapshots and batches visuals
- physics consumes source-derived collider data
- gameplay consumes source masks, routes, and anchors
- proof consumes reports and screenshots, not intent

## Findings To Test

| Risk | Why it matters | Hardening requirement |
| --- | --- | --- |
| Source drift | Consumers can disagree about map shape. | Require matching source revision ids. |
| Visual fakeout | A green snapshot can still look bad. | Require human-view screenshots for visible changes. |
| Gameplay fakeout | Receipts can bypass natural movement. | Require natural route proof when interactive. |
| LOD fakeout | Static screenshots can hide popping. | Require sampled motion proof for LOD or camera changes. |
| Public fakeout | Local proof can be mistaken for deployed proof. | Require local/public labels. |
| Scale fakeout | Single-player proof can be mistaken for 60-player readiness. | Require mode labels and simulator/live boundary. |

## Edge Cases

- asset anchors place objects on non-walkable slopes
- collider samples use old procedural height values
- screenshots frame away from broken seams or floating assets
- route proof succeeds only because target radius is too large
- bot or network simulations use a different map source revision
- public build serves a stale revision after local proof passes

## Audit Rewrite

This atom remains planned until its source data, consumer lockstep, validator, and human-view proof are all named. It should move to active only when future code changes can prove this boundary without weakening the broader AAA goal.
