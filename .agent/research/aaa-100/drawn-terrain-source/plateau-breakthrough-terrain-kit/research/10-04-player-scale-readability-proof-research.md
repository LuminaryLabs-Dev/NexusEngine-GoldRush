# Player Scale Readability Proof Research

Status: active docs-only
Atom: 10-04

## Research Question

What external or project-local evidence would make player-scale-readability / proof strong enough for a production terrain source pass?

## Current Source Signals

- Open-world architecture references point toward cell/LOD/source discipline.
- Battle-royale references point toward readable macro maps, squads, high-value routes, pressure, and scale.
- GoldRush repo memory points toward kit-owned source data, raycast placement, collider parity, and local/public proof.

## GoldRush Implication

The player must read foreground, midground, destination, and danger from over-the-shoulder views.

This must become a kit/proof requirement before runtime work touches terrain replacement.

## Evidence Needed

- Source field or descriptor name.
- Consumer kit name.
- Validation command or proof harness.
- Player-view state or screenshot angle.
- Edge case that would invalidate a narrow green check.
