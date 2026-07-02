# Combat Cover Barricade - Visual Target

Status: planned docs-only
Parent: digital asset family atlas
Domain: combat/world/content
Candidate GoldRush kit: n:goldrush:cover-protokits
Terrain source relationship: cover, blocker, combat lane masks

## Atomic Goal

define the high-fidelity toon visual target and silhouette role for the combat cover barricade family.

## Why It Matters

This family must help the authored desert map read as a high-fidelity wild-west extraction space instead of a field of primitives. It should explain routes, risk, reward, cover, extraction, or atmosphere from the player camera.

## Required Forms

wagons, fences, crates, low walls, ridge notches, broken carts.

## Public Data Seed

- family id
- source candidate ids
- approval state
- terrain source mask ids
- placement anchor ids
- visual form ids
- interaction or collider role when relevant
- proof state

## Event Seed

- assetFamilyCandidateRegistered
- assetFamilyApprovedForPrototype
- assetFamilyPlacementResolved
- assetFamilyProofFailed

## Snapshot Seed

- family id: combat-cover-barricade
- kit: n:goldrush:cover-protokits
- terrain source revision
- candidate count
- approved prototype count
- runtime promotion count
- visible proof status

## Placement Rule

Use authored terrain masks and downward raycast placement. Do not hand-place final runtime coordinates as renderer-only state.

## Promotion Rule

A candidate can only become runtime content after license/provenance, sanitization, human review, source-to-runtime path proof, and browser-visible proof.

## Stop Condition

Stop if this family can only be represented by a primitive shape with no terrain-source placement, no family identity, and no human-view proof target.
