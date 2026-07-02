# 014 - LOD Cell Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: render/performance

## Simulated Implementation

1. Add the minimum source fixture field for near, mid, far, horizon cell ids.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove active camera/player position resolves expected LOD cells.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

large terrain pops, seams, or overdraws without source-owned cells.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
