# Affordance Marker Readability - 2026-06-30

## Intent

The object-affordance interaction path works, but a marker for every nearby interactive object created visual clutter around dense gold seams. The renderer now treats markers as a domain-scoped presentation kit: one selected affordance is loud, a few nearby candidates are quiet, and the rest are hidden.

## Sources

- Game Accessibility Guidelines: https://gameaccessibilityguidelines.com/full-list/
- Nielsen Norman Group, Visibility of System Status: https://www.nngroup.com/articles/visibility-system-status/
- Unity XR Interaction Toolkit Affordance System: https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@2.5/manual/affordance-system.html

## Source Takeaways

- Interaction feedback should be clear and simple enough to understand during play.
- System status should be visible so the player knows what command will be interpreted.
- Affordance systems should map interaction state to visual/audio feedback rather than making every possible object equally loud.

## Domain Breakdown

### n:gameplay:interaction-hold

- Owns nearest-affordance selection.
- Produces selected and candidate packets.
- Does not decide marker opacity or visual styling.

### n:render:micro-object-instancing

- Owns `goldrush-affordance-marker-readability-v1`.
- Renders selected marker loudly.
- Renders at most five nearby candidates quietly.
- Hides all other interactable object markers by default.

### n:goldrush:object:*

- Owns per-object affordance metadata.
- Remains independent of marker styling.

## Validation

- `tools/validation/validate-procedural-renderer-kits.mjs` checks the marker-readability contract and update function.
- `tools/proof/cargo-visual-proof.mjs` checks exactly one selected marker, capped nearby markers, and hidden non-selected markers while preserving mine -> carry proof.
