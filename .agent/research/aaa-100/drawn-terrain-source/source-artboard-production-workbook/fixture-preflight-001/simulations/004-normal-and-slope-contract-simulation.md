# 004 - Normal And Slope Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/control

## Simulated Implementation

1. Add the minimum source fixture field for normal vector and slope class.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove sampleGround returns normal and slope for every walkable test point.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

movement treats steep or blocker ground as safe footing.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
