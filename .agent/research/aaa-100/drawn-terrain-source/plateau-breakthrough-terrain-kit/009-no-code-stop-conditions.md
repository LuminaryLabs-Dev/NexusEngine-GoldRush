# No Code Stop Conditions

Status: active docs-only

## Current Stop

This packet is planning only. It should not change runtime code, renderer code, physics code, assets, branches, or deployment state.

## Resume Code Only When

- The user explicitly permits implementation.
- The first source fixture scope is selected.
- Owning kits are named.
- Validator expectations are clear.
- Human-view proof states are listed.
- Existing terrain, camera, movement, interaction, extraction, and combat proof debt is preserved.

## First Code Slice Later

When implementation resumes, start with a tiny neutral source fixture for `n:world:authored-terrain-mesh`, then prove source queries before touching renderer replacement, collider replacement, or asset placement.
