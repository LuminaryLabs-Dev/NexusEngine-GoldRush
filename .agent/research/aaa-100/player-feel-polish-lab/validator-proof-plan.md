# Validator Proof Plan

Status: active docs-only

## Purpose

Map the feel lab into future validator/proof work without editing runtime now.

## Future Validators

- validate-camera-authority-feel.mjs
- validate-mouse-look-input.mjs
- validate-camera-relative-movement.mjs
- validate-terrain-footing-feel.mjs
- validate-character-rig-readability.mjs
- validate-animation-blend-state.mjs
- validate-mining-tactility.mjs
- validate-cargo-feedback.mjs
- validate-resource-readability.mjs
- validate-cashout-tension.mjs
- validate-threat-telegraphy.mjs
- validate-cover-counterplay.mjs
- validate-weapon-hit-feedback.mjs
- validate-audio-cue-layering.mjs
- validate-diegetic-cue-priority.mjs
- validate-results-payoff.mjs
- validate-control-comfort.mjs
- validate-local-public-human-view-feel.mjs

## Proof Order

1. Run CLI validator for data/event/snapshot contract.
2. Run local browser human-view proof.
3. If motion-based, record a short video.
4. Run public proof after deployment.
5. Update the axis packet only if local and public evidence agree.
