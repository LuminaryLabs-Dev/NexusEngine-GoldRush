# 018 - Gameplay Zone Consumer Parity Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/runtime

## Simulated Implementation

1. Add the minimum source fixture field for zone annotation ids used by actions.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove mine and cashout actions report source annotation ids.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

receipts prove actions that were not authored into the map.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
