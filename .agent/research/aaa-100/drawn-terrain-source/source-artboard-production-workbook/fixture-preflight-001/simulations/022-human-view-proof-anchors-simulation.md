# 022 - Human View Proof Anchors Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: validation/player-view

## Simulated Implementation

1. Add the minimum source fixture field for proof shot ids and expected readable content.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove screenshots label foreground, midground, horizon, next action, and failure state.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

technical screenshots pass while the player cannot read the map.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
