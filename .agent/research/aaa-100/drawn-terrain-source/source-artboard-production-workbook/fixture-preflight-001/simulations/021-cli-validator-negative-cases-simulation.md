# 021 - CLI Validator Negative Cases Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: validation

## Simulated Implementation

1. Add the minimum source fixture field for missing fields, invalid masks, drift, stale consumers.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove validator fails bad fixtures before passing the good fixture.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

validation becomes an existence check instead of a source-parity gate.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
