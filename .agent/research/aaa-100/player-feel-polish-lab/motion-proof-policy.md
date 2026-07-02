# Motion Proof Policy

Status: active docs-only

## Rule

Any claim about camera, movement, train timing, terrain footing, animation, mining tactility, combat, or cashout pressure needs motion proof, not only a screenshot.

## Required Motion Samples

- idle camera: no drift without input.
- slow mouse pan: yaw and pitch change smoothly.
- fast mouse turn: no snapping, oscillation, or competing writer.
- WASD forward: movement follows camera yaw.
- diagonal movement: speed is clamped and body direction is readable.
- stop/start: acceleration and deceleration feel deliberate.
- slope walk: visible terrain and collider agree.
- mine hold: body/tool/audio/progress advance together.
- cargo carry: posture, speed, and sound change together.
- threat route: danger cue appears before damage.
- cashout hold: range, progress, risk, and result receipt agree.
- scene transition: authority resets once, then stabilizes.

## Acceptance

A motion sample passes only when the video, runtime snapshot, event stream, and player-facing cue all describe the same state.
