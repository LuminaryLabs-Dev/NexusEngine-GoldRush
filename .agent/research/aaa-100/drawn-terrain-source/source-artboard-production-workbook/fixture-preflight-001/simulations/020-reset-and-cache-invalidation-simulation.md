# 020 - Reset And Cache Invalidation Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/versioning

## Simulated Implementation

1. Add the minimum source fixture field for revision reset, derived cache ids, stale proof flags.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove revision change invalidates render, physics, placement, gameplay, and proof caches.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

new source data mixes with old derived state.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
