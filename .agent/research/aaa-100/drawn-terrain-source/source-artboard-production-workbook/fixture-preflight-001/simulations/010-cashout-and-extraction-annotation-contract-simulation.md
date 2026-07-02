# 010 - Cashout And Extraction Annotation Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/match

## Simulated Implementation

1. Add the minimum source fixture field for cashout marker, extraction radius, return route.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove cashout marker and receipt can report annotation id.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

extraction works structurally but not as a map-authored destination.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
