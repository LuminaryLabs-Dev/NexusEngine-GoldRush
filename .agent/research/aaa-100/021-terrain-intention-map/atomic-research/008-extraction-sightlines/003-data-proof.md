# 021.008 Extraction Sightlines - Data Proof

Status: research-planned
Parent: 021 Terrain intention map
Atomic: 021.008 Extraction Sightlines
Domain: world
Owning kit candidate: `n:goldrush:authored-desert-map`

## Data Contract

Map sightlines into and out of cashout sites so extracting has pressure without becoming unreadable.

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
