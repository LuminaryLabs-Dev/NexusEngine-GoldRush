# Lod Cells Consumer

Status: active docs-only
Atom: 05-03
Family: lod-cells
Layer: consumer
Domain: render/performance

## Purpose

Near, mid, far, and horizon cells must be derived from source and audited for seams and silhouette loss.

This atom exists to name the downstream kits that must consume this family.

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
