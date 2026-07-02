# 006 - Walkable Blocker Mask Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics/navigation

## Simulated Implementation

1. Add the minimum source fixture field for walkable and blocker masks.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove blocked cells reject grounding and placement unless edge case is named.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

player or props clip through mountains and steep ridges.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
