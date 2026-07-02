# Cargo Carry Risk - Data

Status: planned docs-only
Slice: 13 Cargo Carry Risk
Domain: gameplay/character/combat
Scene/site: site.gold-field
Generic kit: n:gameplay:cargo
GoldRush kit: n:goldrush:gold-carrying

## Purpose

Define the minimal serializable data and event payloads needed for the slice to compose with adjacent kits.

## Slice Intention

Make carried gold alter movement, character posture, visibility, threat pressure, and score potential.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:gold-carrying` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `cargo.carried.changed`
- Snapshot: `cargoCarryRisk`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`cargo-visual proof plus extraction-loop validator`

## Human-View Proof Seed

cargo appears on character, movement changes, threat/noise state changes, and receipts preserve carried amount

## Known Fakeout

A score number increases but the player does not feel cargo weight, value, or danger.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.

