# 026.004 Central Mountain Blockers - Data Proof

Status: research-planned
Parent: 026 Collider parity
Atomic: 026.004 Central Mountain Blockers
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Data Contract

Specify mountain blocker collision as authored terrain/blocker data instead of hidden renderer geometry.

## Required Inputs

- Authored map revision id.
- Coordinate transform.
- Source plate or layer dependency.
- Expected consumer kits.
- Proof threshold.

## Required Outputs

- Serializable snapshot.
- Deterministic validation receipt.
- Human-view acceptance criteria when visible.
- Failure labels that a future agent can route to the right kit.

## Proof Plan

1. Add a CLI validator that loads the authored map fixture.
2. Check this concern's invariants without launching the game.
3. If player-facing, capture spawn, movement, and look-left/right screenshots.
4. If timing-sensitive, add a short video proof after screenshot proof passes.
5. Confirm the report passes sanitized artifact checks.

## Acceptance Threshold

This packet is research-complete when it names exact input fields, exact output fields, a validator command, and a player-view failure state if applicable.
