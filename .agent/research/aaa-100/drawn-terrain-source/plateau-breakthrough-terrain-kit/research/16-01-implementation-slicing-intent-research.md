# Implementation Slicing Intent Research

Status: active docs-only
Atom: 16-01

## Research Question

What external or project-local evidence would make implementation-slicing / intent strong enough for a production terrain source pass?

## Current Source Signals

- Open-world architecture references point toward cell/LOD/source discipline.
- Battle-royale references point toward readable macro maps, squads, high-value routes, pressure, and scale.
- GoldRush repo memory points toward kit-owned source data, raycast placement, collider parity, and local/public proof.

## GoldRush Implication

Runtime work must start with a tiny fixture and stop before broad replacement when source consumers diverge.

This must become a kit/proof requirement before runtime work touches terrain replacement.

## Evidence Needed

- Source field or descriptor name.
- Consumer kit name.
- Validation command or proof harness.
- Player-view state or screenshot angle.
- Edge case that would invalidate a narrow green check.
