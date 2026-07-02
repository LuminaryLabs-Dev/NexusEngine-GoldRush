# 003 - Height Sample Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics

## Simulated Implementation

1. Add the minimum source fixture field for height samples and source cell ids.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove sampleHeight returns finite values from the fixture.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

render and collider derive height from different math.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
