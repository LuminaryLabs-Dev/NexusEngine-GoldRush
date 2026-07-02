# 012 - Asset Anchor Family Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: content/world

## Simulated Implementation

1. Add the minimum source fixture field for asset anchor ids, family, mask, transform hints.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove first prop placement reports anchor id and raycast hit.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

procedural objects remain scatter instead of kit-owned map content.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
