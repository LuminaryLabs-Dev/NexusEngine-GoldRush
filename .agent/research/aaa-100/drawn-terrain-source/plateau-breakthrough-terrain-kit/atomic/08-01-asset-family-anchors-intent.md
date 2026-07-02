# Asset Family Anchors Intent

Status: active docs-only
Atom: 08-01
Family: asset-family-anchors
Layer: intent
Domain: content/art

## Purpose

Rocks, plants, mines, towns, rails, camps, cover, gold, and extraction objects need authored anchor families.

This atom exists to state the player-facing and kit-facing reason this family exists.

## Required Output

- Name the owning generic and GoldRush kit.
- Name the source field or derived descriptor.
- Name the consumer that must not invent its own copy.
- Name the proof that prevents fake resolution.

## Data Boundary

Keep config minimal. Source facts come from the drawn terrain revision. Derived facts must carry provenance back to that revision.

## Player-View Acceptance

A player should be able to see or feel this atom through terrain readability, route confidence, object grounding, combat fairness, cashout clarity, or stable movement proof.

## Stop Condition

Do not mark this atom resolved until source data, consumer wiring, and human-view or simulator proof all agree on the same revision.
