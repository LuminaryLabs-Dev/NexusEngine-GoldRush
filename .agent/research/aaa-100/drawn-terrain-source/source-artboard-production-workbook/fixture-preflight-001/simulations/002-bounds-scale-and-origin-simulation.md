# 002 - Bounds Scale And Origin Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/network

## Simulated Implementation

1. Add the minimum source fixture field for worldBounds, origin, unitScale, cellSize.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove queries reject points outside bounds and report unit scale.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

map scale drifts from player movement and 60-player density assumptions.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
