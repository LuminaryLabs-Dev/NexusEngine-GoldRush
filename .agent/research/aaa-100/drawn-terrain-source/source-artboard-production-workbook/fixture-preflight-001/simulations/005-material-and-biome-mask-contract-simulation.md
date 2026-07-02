# 005 - Material And Biome Mask Contract Simulation

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio

## Simulated Implementation

1. Add the minimum source fixture field for material and biome masks.
2. Add a validator that fails when the field is missing or inconsistent.
3. Expose the field through the owning kit snapshot.
4. Wire exactly one consumer to read the field.
5. Prove render, audio, VFX, and placement can name material and biome tags.
6. Re-run the fixture validator after a revision bump.

## Likely Failure

terrain looks varied but gameplay and audio ignore surface identity.

## Recovery

- Stop expanding terrain area.
- Reconnect this atom to fixture revision reporting.
- Add a negative validator case.
- Re-capture proof only after the consumer reports the fixture revision.
