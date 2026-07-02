# 019 - Snapshot And Event Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/events

## Simulated Implementation

1. Add the minimum source fixture field for loaded, rejected, consumerReady, consumerDrift events.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove runtime snapshot serializes fixture status and consumer drift.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

debugging source drift requires renderer inspection instead of state.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
