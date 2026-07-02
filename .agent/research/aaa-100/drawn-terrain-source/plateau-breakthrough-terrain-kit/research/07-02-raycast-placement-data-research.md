# Raycast Placement Data Research

Status: active docs-only
Atom: 07-02

## Research Question

What external or project-local evidence would make raycast-placement / data strong enough for a production terrain source pass?

## Current Source Signals

- Open-world architecture references point toward cell/LOD/source discipline.
- Battle-royale references point toward readable macro maps, squads, high-value routes, pressure, and scale.
- GoldRush repo memory points toward kit-owned source data, raycast placement, collider parity, and local/public proof.

## GoldRush Implication

All object protokit placement must raycast against the source-derived surface and inherit masks.

This must become a kit/proof requirement before runtime work touches terrain replacement.

## Evidence Needed

- Source field or descriptor name.
- Consumer kit name.
- Validation command or proof harness.
- Player-view state or screenshot angle.
- Edge case that would invalidate a narrow green check.
