# 015 - Render Consumer Revision Parity Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: render/runtime

## Simulated Implementation

1. Add the minimum source fixture field for render chunk source revision and LOD cell id.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove render snapshot reports fixture and revision.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

visual mesh claims source parity while using local terrain math.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
