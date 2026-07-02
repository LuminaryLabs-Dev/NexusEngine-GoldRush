# 016 - Collider Consumer Revision Parity Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: physics/runtime

## Simulated Implementation

1. Add the minimum source fixture field for collider source revision and sample parity report.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove collider samples match fixture height at test points.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

player walks on invisible or mismatched terrain.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
