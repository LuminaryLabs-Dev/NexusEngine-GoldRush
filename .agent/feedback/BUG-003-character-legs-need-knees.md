# BUG-003: Character Legs Need Knees

## Status

Resolved in local proof.

## Player Feedback

The skeleton character legs are not built as two-part limbs and need knees.

## Human-Visible Failure

- Legs read as single straight sticks from hip to foot.
- Walk animation looks stiff and toy-like.
- The skeleton does not feel like a real third-person character rig.
- Footing bugs become harder to judge because the legs do not show planted/stepping motion clearly.

## Likely Technical Cause

- `mountThirdPersonPlayerKit()` in `src/renderer/proceduralKits.js` creates each leg as one cuboid plus one boot.
- The walk animation rotates the whole leg mesh from the hip.
- There is no upper-leg/lower-leg split, knee joint marker, knee bend, or foot planting phase.

## Related Files

- `src/renderer/proceduralKits.js`
- `src/content/goldrushPresentationSlots.js`
- `tools/validation/validate-procedural-renderer-kits.mjs`

## Acceptance Evidence

- Screenshot shows each leg has an upper leg, knee joint, lower leg, and boot.
- Walk animation visibly bends at the knee while moving.
- Idle stance keeps knees readable without making the silhouette noisy.
- Renderer validation checks the character descriptor includes knee/upper-leg/lower-leg visual parts.

## Resolution Evidence

- `src/renderer/proceduralKits.js` now builds each leg with upper-leg, knee-joint, lower-leg, and boot meshes.
- `poseKneeLegRig()` animates hip swing and knee bend separately.
- `tools/validation/validate-procedural-renderer-kits.mjs` requires `upper-legs`, `knee-joints`, and `lower-legs`.
- Proof screenshot: `screenshots/grounding-knees-stability-video-proof.png`.
- Proof report: `reports/grounding-knees-stability-01.md`.
