# 024 - Restart Packet And Lessons Loop Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: production

## Simulated Implementation

1. Add the minimum source fixture field for restart reason, stale proof list, lesson update.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove source revision changes create a restart packet and update lesson only when behavior changes.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

new terrain knowledge is lost between passes.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
