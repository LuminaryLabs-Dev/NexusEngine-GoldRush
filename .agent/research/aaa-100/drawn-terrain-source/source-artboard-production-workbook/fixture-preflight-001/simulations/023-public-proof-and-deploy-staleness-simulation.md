# 023 - Public Proof And Deploy Staleness Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: release/validation

## Simulated Implementation

1. Add the minimum source fixture field for public fixture revision and artifact ids.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove public runtime reports same fixture revision as local proof.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

local source proof is mistaken for deployed behavior.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
