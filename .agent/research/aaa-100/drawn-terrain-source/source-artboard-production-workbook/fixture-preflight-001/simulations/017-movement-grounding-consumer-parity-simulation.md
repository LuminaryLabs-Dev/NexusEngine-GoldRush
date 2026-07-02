# 017 - Movement Grounding Consumer Parity Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: control/physics

## Simulated Implementation

1. Add the minimum source fixture field for ground hit, slope, walkable, revision id.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove local player ground snapshot names fixture revision.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

camera and player pulse because movement owns different ground truth.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
