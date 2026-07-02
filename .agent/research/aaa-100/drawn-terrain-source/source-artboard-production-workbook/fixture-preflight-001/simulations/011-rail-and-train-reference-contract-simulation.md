# 011 - Rail And Train Reference Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world

## Simulated Implementation

1. Add the minimum source fixture field for rail direction, train edge, platform approach.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove train and gold-field source use compatible direction labels.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

the train sequence feels disconnected from the match map.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
