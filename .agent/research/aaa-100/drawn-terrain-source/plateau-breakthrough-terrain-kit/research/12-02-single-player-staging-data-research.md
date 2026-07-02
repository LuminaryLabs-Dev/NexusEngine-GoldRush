# Single Player Staging Data Research

Status: active docs-only
Atom: 12-02

## Research Question

What external or project-local evidence would make single-player-staging / data strong enough for a production terrain source pass?

## Current Source Signals

- Open-world architecture references point toward cell/LOD/source discipline.
- Battle-royale references point toward readable macro maps, squads, high-value routes, pressure, and scale.
- GoldRush repo memory points toward kit-owned source data, raycast placement, collider parity, and local/public proof.

## GoldRush Implication

The source map must support solo practice, bot fill, route proofs, and deterministic reset.

This must become a kit/proof requirement before runtime work touches terrain replacement.

## Evidence Needed

- Source field or descriptor name.
- Consumer kit name.
- Validation command or proof harness.
- Player-view state or screenshot angle.
- Edge case that would invalidate a narrow green check.
